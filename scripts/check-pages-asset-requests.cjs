#!/usr/bin/env node

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist-pages');
const indexPath = path.join(distDir, 'index.html');
const reportPath = path.join(distDir, '.asset-check-report.json');

const monitoredExternalTypes = new Set(['image', 'script', 'stylesheet', 'font', 'media', 'fetch', 'xhr']);

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
]);

function safeJoin(root, requestPath) {
  const normalized = requestPath.replace(/\\/g, '/');
  const withoutQuery = normalized.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(withoutQuery);
  const cleaned = decoded.startsWith('/') ? decoded.slice(1) : decoded;
  const joined = path.join(root, cleaned);
  const rel = path.relative(root, joined);

  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return joined;
}

function extractComponentValues(html) {
  const values = [];
  const seen = new Set();
  const optionRe = /<option\s+[^>]*value="([^"]*)"[^>]*>/gi;

  let match = optionRe.exec(html);
  while (match) {
    const value = (match[1] ?? '').trim();
    if (value && !seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
    match = optionRe.exec(html);
  }

  return values;
}

function shouldIgnoreUrl(rawUrl) {
  if (!rawUrl) return true;
  return (
    rawUrl.startsWith('data:') ||
    rawUrl.startsWith('blob:') ||
    rawUrl.endsWith('/favicon.ico') ||
    rawUrl.includes('/favicon.ico?')
  );
}

async function createStaticServer(rootDir) {
  const server = http.createServer(async (req, res) => {
    try {
      if (!req.url) {
        res.writeHead(400);
        res.end('Bad Request');
        return;
      }

      const url = new URL(req.url, 'http://127.0.0.1');
      const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
      const filePath = safeJoin(rootDir, pathname);

      if (!filePath) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      const stat = await fsp.stat(filePath).catch(() => null);
      if (!stat || !stat.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = contentTypes.get(ext) ?? 'application/octet-stream';
      const body = await fsp.readFile(filePath);

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
      });
      res.end(body);
    } catch (error) {
      res.writeHead(500);
      res.end('Internal Server Error');
      console.error('[pages:check:assets] server error', error);
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to get server address');
  }

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

function toNormalizedUrl(rawUrl, baseUrl) {
  try {
    return new URL(rawUrl, baseUrl);
  } catch {
    return null;
  }
}

async function run() {
  if (!fs.existsSync(indexPath)) {
    console.error(`[pages:check:assets] Missing file: ${indexPath}`);
    console.error('[pages:check:assets] Run `npm run pages:build` first.');
    process.exit(1);
  }

  const html = await fsp.readFile(indexPath, 'utf8');
  const components = extractComponentValues(html);

  if (components.length === 0) {
    console.error('[pages:check:assets] No component options found in dist-pages/index.html');
    process.exit(1);
  }

  const { server, baseUrl } = await createStaticServer(distDir);
  const baseOrigin = new URL(baseUrl).origin;

  const sameOrigin404 = [];
  const externalAssets = [];
  const requestFailures = [];
  const pages = [];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('response', (response) => {
    const rawUrl = response.url();
    if (shouldIgnoreUrl(rawUrl)) return;

    const url = toNormalizedUrl(rawUrl, baseUrl);
    if (!url) return;

    const resourceType = response.request().resourceType();
    const status = response.status();

    if (url.origin === baseOrigin) {
      if (status === 404) {
        sameOrigin404.push({
          url: url.toString(),
          status,
          resourceType,
          method: response.request().method(),
          component: page.url(),
        });
      }
      return;
    }

    if (!monitoredExternalTypes.has(resourceType)) return;

    externalAssets.push({
      url: url.toString(),
      status,
      resourceType,
      method: response.request().method(),
      component: page.url(),
    });
  });

  page.on('requestfailed', (request) => {
    const rawUrl = request.url();
    if (shouldIgnoreUrl(rawUrl)) return;

    const url = toNormalizedUrl(rawUrl, baseUrl);
    if (!url) return;

    const resourceType = request.resourceType();
    const failure = request.failure();

    if (url.origin === baseOrigin) {
      requestFailures.push({
        url: url.toString(),
        status: 'requestfailed',
        resourceType,
        method: request.method(),
        failureText: failure?.errorText ?? 'unknown',
        component: page.url(),
      });
      return;
    }

    if (!monitoredExternalTypes.has(resourceType)) return;

    externalAssets.push({
      url: url.toString(),
      status: 'requestfailed',
      resourceType,
      method: request.method(),
      failureText: failure?.errorText ?? 'unknown',
      component: page.url(),
    });
  });

  try {
    for (const component of components) {
      const before404 = sameOrigin404.length;
      const beforeExternal = externalAssets.length;
      const beforeFailed = requestFailures.length;

      const componentUrl = `${baseUrl}/?component=${encodeURIComponent(component)}&nosw=1`;
      await page.goto(componentUrl, { waitUntil: 'load', timeout: 30_000 });
      try {
        await page.waitForLoadState('networkidle', { timeout: 15_000 });
      } catch {
        // networkidleに達しないケースを許容しつつ、追加待機で遅延読み込みを吸収
      }
      await page.waitForTimeout(300);

      pages.push({
        component,
        url: componentUrl,
        sameOrigin404: sameOrigin404.length - before404,
        externalAssets: externalAssets.length - beforeExternal,
        requestFailures: requestFailures.length - beforeFailed,
      });
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    pages,
    sameOrigin404,
    externalAssets,
    requestFailures,
  };

  const hasError = sameOrigin404.length > 0 || externalAssets.length > 0 || requestFailures.length > 0;

  if (hasError) {
    await fsp.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.error('[pages:check:assets] FAILED');
    console.error(`- same-origin 404: ${sameOrigin404.length}`);
    console.error(`- external asset requests: ${externalAssets.length}`);
    console.error(`- requestfailed: ${requestFailures.length}`);
    console.error(`- report: ${reportPath}`);
    process.exit(1);
  }

  if (fs.existsSync(reportPath)) {
    await fsp.rm(reportPath, { force: true });
  }

  console.log(`[pages:check:assets] OK (${components.length} components checked)`);
}

run().catch((error) => {
  console.error('[pages:check:assets] Error:', error);
  process.exit(1);
});
