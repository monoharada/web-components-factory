#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SHA_RE = /^[0-9a-f]{40}$/;

function findRepoRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, '..', '..');
}

function lockPathFromRoot(root) {
  return path.join(root, 'registry', 'wcf-channel-lock.json');
}

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(
    [
      'Usage:',
      '  node scripts/wcf/update-channel-lock.mjs --ref <sha|tag|main>',
      '  node scripts/wcf/update-channel-lock.mjs --check',
      '',
      'Options:',
      '  --ref <value>     update stable lock with resolved SHA',
      '  --check           validate lock schema and stable SHA format',
      '  -h, --help        show this help',
      '',
    ].join('\n'),
  );
}

function parseArgs(argv) {
  const result = {
    ref: null,
    check: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--check') {
      result.check = true;
      continue;
    }
    if (arg === '--ref') {
      result.ref = argv[++i] ?? null;
      continue;
    }
    if (arg === '-h' || arg === '--help') {
      result.help = true;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  return result;
}

async function readLock(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text);
}

function assertLockShape(lock) {
  if (!lock || typeof lock !== 'object') {
    throw new Error('Invalid lock: root object is required');
  }
  if (lock.version !== 1) {
    throw new Error(`Invalid lock: version must be 1 (got ${lock.version})`);
  }
  const stable = lock?.channels?.stable;
  if (!stable || typeof stable !== 'object') {
    throw new Error('Invalid lock: channels.stable is required');
  }
  const repo = String(stable.repo ?? '').trim();
  if (repo !== 'https://github.com/monoharada/web-components-factory.git') {
    throw new Error(`Invalid lock: unsupported stable repo "${repo}"`);
  }
  const sha = String(stable.sha ?? '').trim().toLowerCase();
  if (!SHA_RE.test(sha)) {
    throw new Error(`Invalid lock: stable sha must be 40 hex chars (got "${stable.sha}")`);
  }
  return {
    repo,
    sha,
  };
}

function resolveRefSha({ repo, ref }) {
  const normalizedRef = String(ref ?? '').trim();
  if (!normalizedRef) {
    throw new Error('Missing --ref');
  }
  if (SHA_RE.test(normalizedRef.toLowerCase())) {
    return normalizedRef.toLowerCase();
  }

  const headRef = normalizedRef === 'main' ? 'refs/heads/main' : normalizedRef;
  const tagRef = normalizedRef === 'main' ? null : `refs/tags/${normalizedRef}`;
  const refsToTry = tagRef ? [headRef, tagRef, `${tagRef}^{}`] : [headRef];

  for (const candidate of refsToTry) {
    const result = spawnSync('git', ['ls-remote', repo, candidate], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (result.status !== 0) continue;
    const first = String(result.stdout ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)[0];
    if (!first) continue;
    const [sha] = first.split(/\s+/);
    if (SHA_RE.test(String(sha ?? '').toLowerCase())) {
      return sha.toLowerCase();
    }
  }

  throw new Error(`Unable to resolve ref "${ref}" for repo "${repo}"`);
}

async function writeLock(filePath, lock) {
  await fs.writeFile(filePath, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const repoRoot = findRepoRoot();
  const lockPath = lockPathFromRoot(repoRoot);
  const lock = await readLock(lockPath);
  const stable = assertLockShape(lock);

  if (args.check) {
    // eslint-disable-next-line no-console
    console.log(
      [
        `Lock OK: ${path.relative(repoRoot, lockPath)}`,
        `stable.repo: ${stable.repo}`,
        `stable.sha: ${stable.sha}`,
      ].join('\n'),
    );
    process.exit(0);
  }

  if (!args.ref) {
    printHelp();
    throw new Error('Either --check or --ref is required');
  }

  const nextSha = resolveRefSha({
    repo: stable.repo,
    ref: args.ref,
  });

  lock.updatedAt = new Date().toISOString();
  lock.channels.stable.sha = nextSha;
  await writeLock(lockPath, lock);

  // eslint-disable-next-line no-console
  console.log(
    [
      `Updated: ${path.relative(repoRoot, lockPath)}`,
      `stable.repo: ${stable.repo}`,
      `stable.sha: ${nextSha}`,
    ].join('\n'),
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(String(error?.stack ?? error));
  process.exit(1);
});
