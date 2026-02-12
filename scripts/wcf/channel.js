import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const CHANNEL_LOCAL = 'local';
export const CHANNEL_STABLE = 'stable';
export const CHANNEL_DELEGATED_ENV = 'WCF_CHANNEL_DELEGATED';
export const CHANNEL_CACHE_PATH_ENV = 'WCF_CHANNEL_CACHE_PATH';
export const DEFAULT_CHANNEL_TTL_MS = 10 * 60 * 1000;
export const DEFAULT_LOCK_TIMEOUT_MS = 3000;
export const DEFAULT_LOCK_RETRIES = 1;
export const DEFAULT_LOCK_RETRY_BACKOFF_MS = 500;
export const STABLE_REPO_URL = 'https://github.com/monoharada/web-components-factory.git';
export const STABLE_LOCK_URL =
  'https://raw.githubusercontent.com/monoharada/web-components-factory/main/registry/wcf-channel-lock.json';
export const STABLE_BUNDLED_LOCK_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'registry',
  'wcf-channel-lock.json',
);

const SHA_RE = /^[0-9a-f]{40}$/;

function createChannelError(code, message, cause = null) {
  const err = new Error(`${code}: ${message}`);
  err.code = code;
  if (cause) err.cause = cause;
  return err;
}

function toErrorMessage(error) {
  if (!error) return 'Unknown error';
  if (error instanceof Error) return error.message;
  return String(error);
}

function isValidSha(value) {
  return SHA_RE.test(String(value ?? '').trim().toLowerCase());
}

function toStableSpec(sha) {
  return `git+${STABLE_REPO_URL}#${sha}`;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isFresh(checkedAtMs, nowMs, ttlMs) {
  return Number.isFinite(checkedAtMs) && nowMs - checkedAtMs < ttlMs;
}

export function normalizeChannel(channel) {
  const value = String(channel ?? CHANNEL_LOCAL).trim().toLowerCase();
  if (value === CHANNEL_LOCAL || value === CHANNEL_STABLE) return value;
  throw new Error(`Invalid --channel: ${channel} (use local|stable)`);
}

export function stripChannelArgs(argv) {
  const result = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--channel') {
      i += 1;
      continue;
    }
    if (arg.startsWith('--channel=')) continue;
    result.push(arg);
  }
  return result;
}

export function getDefaultChannelCachePath({
  platform = process.platform,
  env = process.env,
  homedir = os.homedir(),
} = {}) {
  if (platform === 'win32') {
    const localAppData = env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local');
    return path.join(localAppData, 'wcf', 'channel-cache.json');
  }
  if (platform === 'darwin') {
    return path.join(homedir, 'Library', 'Caches', 'wcf', 'channel-cache.json');
  }
  const xdgCacheHome = env.XDG_CACHE_HOME || path.join(homedir, '.cache');
  return path.join(xdgCacheHome, 'wcf', 'channel-cache.json');
}

export function validateStableLockDocument(lockDocument) {
  const stable = lockDocument?.channels?.stable;
  if (!stable || typeof stable !== 'object') {
    throw createChannelError('E_CHANNEL_LOCK_INVALID', 'Missing channels.stable in lock document');
  }
  const repo = String(stable.repo ?? '').trim();
  if (repo !== STABLE_REPO_URL) {
    throw createChannelError(
      'E_CHANNEL_LOCK_INVALID',
      `Lock repo mismatch: expected "${STABLE_REPO_URL}" but got "${repo}"`,
    );
  }
  const sha = String(stable.sha ?? '').trim().toLowerCase();
  if (!isValidSha(sha)) {
    throw createChannelError('E_CHANNEL_LOCK_INVALID', `Invalid stable sha: "${stable.sha}"`);
  }
  return {
    repo,
    sha,
  };
}

async function loadCacheEntry(cachePath) {
  let content;
  try {
    content = await fs.readFile(cachePath, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return {
        entry: null,
        warnings: [],
      };
    }
    return {
      entry: null,
      warnings: [`E_CHANNEL_CACHE_INVALID: Unable to read cache: ${toErrorMessage(error)}`],
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    return {
      entry: null,
      warnings: [`E_CHANNEL_CACHE_INVALID: Cache JSON is invalid: ${toErrorMessage(error)}`],
    };
  }

  const raw = parsed?.stable;
  if (!raw || typeof raw !== 'object') {
    return {
      entry: null,
      warnings: [],
    };
  }

  const sha = String(raw.sha ?? '').trim().toLowerCase();
  const spec = String(raw.spec ?? '').trim();
  const resolvedAt = String(raw.resolvedAt ?? '').trim();
  const checkedAt = String(raw.checkedAt ?? '').trim();
  const checkedAtMs = Date.parse(checkedAt);

  if (!isValidSha(sha)) {
    return {
      entry: null,
      warnings: ['E_CHANNEL_CACHE_INVALID: Cache sha is invalid'],
    };
  }
  if (spec !== toStableSpec(sha)) {
    return {
      entry: null,
      warnings: ['E_CHANNEL_CACHE_INVALID: Cache package spec is invalid'],
    };
  }
  if (!Number.isFinite(checkedAtMs)) {
    return {
      entry: null,
      warnings: ['E_CHANNEL_CACHE_INVALID: Cache checkedAt is invalid'],
    };
  }

  return {
    entry: {
      spec,
      sha,
      resolvedAt,
      checkedAt,
      checkedAtMs,
    },
    warnings: [],
  };
}

async function writeCacheEntry(cachePath, entry) {
  const payload = {
    version: 1,
    stable: {
      spec: entry.spec,
      sha: entry.sha,
      resolvedAt: entry.resolvedAt,
      checkedAt: entry.checkedAt,
    },
  };

  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  const tempPath = `${cachePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await fs.rename(tempPath, cachePath);
}

async function fetchLockDocument({
  lockUrl,
  timeoutMs,
  retries,
  retryBackoffMs,
  fetchImpl,
}) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(lockUrl, {
        signal: controller.signal,
        headers: { accept: 'application/json' },
      });
      if (!response?.ok) {
        throw createChannelError(
          'E_CHANNEL_LOCK_FETCH_FAILED',
          `Failed to fetch lock document (status=${response?.status ?? 'unknown'})`,
        );
      }

      let parsed;
      try {
        parsed = await response.json();
      } catch (error) {
        throw createChannelError('E_CHANNEL_LOCK_INVALID', `Lock JSON parse failed: ${toErrorMessage(error)}`);
      }
      return validateStableLockDocument(parsed);
    } catch (error) {
      const wrapped =
        error?.code === 'E_CHANNEL_LOCK_FETCH_FAILED' || error?.code === 'E_CHANNEL_LOCK_INVALID'
          ? error
          : createChannelError('E_CHANNEL_LOCK_FETCH_FAILED', toErrorMessage(error), error);
      if (wrapped.code === 'E_CHANNEL_LOCK_INVALID') {
        throw wrapped;
      }
      lastError = wrapped;
      if (attempt < retries) {
        // Small backoff to avoid immediate retry storm on transient failures.
        await delay(retryBackoffMs * (attempt + 1));
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError ?? createChannelError('E_CHANNEL_LOCK_FETCH_FAILED', 'Unknown lock fetch failure');
}

async function readBundledLockDocument({ bundledLockPath }) {
  let content;
  try {
    content = await fs.readFile(bundledLockPath, 'utf8');
  } catch (error) {
    throw createChannelError(
      'E_CHANNEL_LOCK_FETCH_FAILED',
      `Unable to read bundled lock document: ${toErrorMessage(error)}`,
      error,
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw createChannelError('E_CHANNEL_LOCK_INVALID', `Bundled lock JSON parse failed: ${toErrorMessage(error)}`, error);
  }
  return validateStableLockDocument(parsed);
}

export async function resolveStablePackageSpec({
  fetchImpl = globalThis.fetch,
  cachePath = process.env[CHANNEL_CACHE_PATH_ENV] || getDefaultChannelCachePath(),
  cacheTtlMs = DEFAULT_CHANNEL_TTL_MS,
  bundledLockPath = STABLE_BUNDLED_LOCK_PATH,
  lockUrl = STABLE_LOCK_URL,
  lockTimeoutMs = DEFAULT_LOCK_TIMEOUT_MS,
  lockRetries = DEFAULT_LOCK_RETRIES,
  lockRetryBackoffMs = DEFAULT_LOCK_RETRY_BACKOFF_MS,
  nowMs = Date.now(),
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw createChannelError('E_CHANNEL_LOCK_FETCH_FAILED', 'Global fetch is not available in this runtime');
  }

  const warnings = [];
  const { entry: cachedEntry, warnings: cacheWarnings } = await loadCacheEntry(cachePath);
  warnings.push(...cacheWarnings);

  if (cachedEntry && isFresh(cachedEntry.checkedAtMs, nowMs, cacheTtlMs)) {
    return {
      spec: cachedEntry.spec,
      sha: cachedEntry.sha,
      source: 'cache',
      warnings,
    };
  }

  let lockError = null;
  try {
    const resolved = await fetchLockDocument({
      lockUrl,
      timeoutMs: lockTimeoutMs,
      retries: lockRetries,
      retryBackoffMs: lockRetryBackoffMs,
      fetchImpl,
    });
    const spec = toStableSpec(resolved.sha);
    const timestamp = new Date(nowMs).toISOString();
    await writeCacheEntry(cachePath, {
      spec,
      sha: resolved.sha,
      resolvedAt: timestamp,
      checkedAt: timestamp,
    });
    return {
      spec,
      sha: resolved.sha,
      source: 'remote',
      warnings,
    };
  } catch (error) {
    lockError = error;
  }

  if (lockError?.code === 'E_CHANNEL_LOCK_INVALID') {
    throw lockError;
  }

  if (lockError?.code === 'E_CHANNEL_LOCK_FETCH_FAILED') {
    try {
      const resolvedBundled = await readBundledLockDocument({ bundledLockPath });
      const spec = toStableSpec(resolvedBundled.sha);
      const timestamp = new Date(nowMs).toISOString();
      await writeCacheEntry(cachePath, {
        spec,
        sha: resolvedBundled.sha,
        resolvedAt: timestamp,
        checkedAt: timestamp,
      });
      warnings.push(
        `${lockError.code}: ${toErrorMessage(lockError)}. Falling back to bundled lock document.`,
      );
      return {
        spec,
        sha: resolvedBundled.sha,
        source: 'bundled-lock',
        warnings,
      };
    } catch (bundledError) {
      if (bundledError?.code === 'E_CHANNEL_LOCK_INVALID') {
        throw bundledError;
      }
      if (cachedEntry) {
        warnings.push(
          `${lockError.code}: ${toErrorMessage(lockError)}. Falling back to cached stable spec.`,
        );
        return {
          spec: cachedEntry.spec,
          sha: cachedEntry.sha,
          source: 'fallback-cache',
          warnings,
        };
      }
    }
  }

  throw createChannelError(
    'E_CHANNEL_RESOLVE_FAILED',
    `Unable to resolve stable channel (${lockError?.code ?? 'unknown'})`,
    lockError,
  );
}

function runNpmExec({ packageSpec, argv, env, spawnImpl }) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(
      'npm',
      ['exec', '--yes', `--package=${packageSpec}`, '--', 'wcf', ...argv],
      {
        stdio: 'inherit',
        env: {
          ...env,
          [CHANNEL_DELEGATED_ENV]: '1',
        },
      },
    );

    child.on('error', (error) => {
      reject(createChannelError('E_CHANNEL_RESOLVE_FAILED', `Failed to run npm exec: ${toErrorMessage(error)}`));
    });
    child.on('close', (code) => {
      resolve(code ?? 1);
    });
  });
}

export async function runDelegatedChannel({
  channel,
  rawArgv,
  env = process.env,
  fetchImpl = globalThis.fetch,
  spawnImpl = spawn,
} = {}) {
  const selected = normalizeChannel(channel);
  if (selected === CHANNEL_LOCAL || env[CHANNEL_DELEGATED_ENV] === '1') {
    return {
      delegated: false,
      exitCode: 0,
      warnings: [],
    };
  }

  const resolved = await resolveStablePackageSpec({
    fetchImpl,
    cachePath: env[CHANNEL_CACHE_PATH_ENV] || undefined,
  });
  const forwardArgv = stripChannelArgs(rawArgv ?? []);
  const exitCode = await runNpmExec({
    packageSpec: resolved.spec,
    argv: forwardArgv,
    env,
    spawnImpl,
  });

  return {
    delegated: true,
    exitCode,
    warnings: resolved.warnings,
  };
}
