import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * bun server.ts を子プロセスで起動する。
 */
export function startServer({ projectRoot, port, debug = Boolean(process.env.DEBUG) }) {
  const server = spawn('bun', ['server.ts'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (debug) {
    server.stdout.on('data', (data) => {
      console.log(`[server] ${data.toString().trim()}`);
    });
    server.stderr.on('data', (data) => {
      console.error(`[server:err] ${data.toString().trim()}`);
    });
  }

  return server;
}

/**
 * サーバが起動するまでリトライで待機する。
 */
export async function waitForServer({
  baseUrl,
  readyPath = '/viewer.html',
  maxRetries = 30,
  intervalMs = 500,
}) {
  for (let i = 0; i < maxRetries; i += 1) {
    try {
      const res = await fetch(`${baseUrl}${readyPath}`);
      if (res.ok) {
        return;
      }
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Server did not start within ${maxRetries * intervalMs}ms`);
}

/**
 * Playwright がインストールした chromium 実行ファイルを探索する。
 */
export function findChromiumExecutable() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  const homeDir = process.env.HOME || '/root';
  const candidates = [];

  const platformConfigs = [
    {
      cacheDir: join(homeDir, 'Library', 'Caches', 'ms-playwright'),
      binaryPaths: [
        'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        'chrome-mac/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      ],
    },
    {
      cacheDir: join(homeDir, '.cache', 'ms-playwright'),
      binaryPaths: ['chrome-linux/chrome'],
    },
  ];

  for (const { cacheDir, binaryPaths } of platformConfigs) {
    try {
      const entries = readdirSync(cacheDir).filter(
        (entry) => entry.startsWith('chromium-') && !entry.includes('headless'),
      );
      for (const entry of entries.sort().reverse()) {
        for (const binPath of binaryPaths) {
          candidates.push(join(cacheDir, entry, binPath));
        }
      }
    } catch {
      // ディレクトリが存在しない場合は無視
    }
  }

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `Chromium executable not found. Checked: ${candidates.join(', ')}. ` +
      'Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH env or run: npx playwright install chromium',
  );
}

/**
 * Playwright chromium を起動する。
 */
export async function launchChromium(executablePath, headless = true) {
  const { chromium } = await import('playwright-core');
  return chromium.launch({ headless, executablePath });
}

/**
 * browser / server の終了処理を共通化する。
 */
export async function closeResources({ browser, server, forceKillDelayMs = 2000 }) {
  if (browser) {
    await browser.close().catch(() => {});
  }
  if (server) {
    server.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, forceKillDelayMs));
    try {
      server.kill('SIGKILL');
    } catch {
      // already dead
    }
  }
}
