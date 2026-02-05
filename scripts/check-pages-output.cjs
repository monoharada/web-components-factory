#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const indexHtmlPath = path.resolve(process.cwd(), process.argv[2] ?? 'dist-pages/index.html');
const html = fs.readFileSync(indexHtmlPath, 'utf8');

if (!html.includes('Web Components Viewer')) {
  console.error(`[pages] ${indexHtmlPath} does not look like viewer.html output`);
  process.exit(1);
}

if (html.includes('Average Case UI')) {
  console.error(`[pages] ${indexHtmlPath} looks like Average Case output`);
  process.exit(1);
}

console.log('[pages] OK: Viewer');

