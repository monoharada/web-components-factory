#!/usr/bin/env node

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const projectRoot = process.cwd();
const rootDir = path.join(projectRoot, 'dist-pages');

const port = Number.parseInt(process.env.PAGES_PORT ?? process.env.PORT ?? '3001', 10);

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

  // Prevent path traversal
  const rel = path.relative(root, joined);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null;
  }
  return joined;
}

async function fileExists(filePath) {
  try {
    const st = await fs.stat(filePath);
    return st.isFile();
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      res.writeHead(400);
      res.end('Bad Request');
      return;
    }

    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const filePath = safeJoin(rootDir, pathname);
    if (!filePath) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (!(await fileExists(filePath))) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes.get(ext) ?? 'application/octet-stream';

    const body = await fs.readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500);
    res.end('Internal Server Error');
    console.error('[pages:preview] Error:', error);
  }
});

server.listen(port, async () => {
  const indexUrl = pathToFileURL(path.join(rootDir, 'index.html')).href;
  console.log(`[pages:preview] Serving ${rootDir}`);
  console.log(`[pages:preview] http://localhost:${port}/`);
  console.log(`[pages:preview] (local file) ${indexUrl}`);
});

