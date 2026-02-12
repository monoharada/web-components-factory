#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const demosDir = path.join(projectRoot, 'src', 'demos');
const viewerPath = path.join(projectRoot, 'viewer.html');

const patterns = [
  {
    name: 'html-asset-attr',
    regex: /\b(?:src|srcset|poster)\s*=\s*["']https?:\/\/[^"']+/gi,
  },
  {
    name: 'js-asset-prop',
    regex: /\b(?:src|srcset)\s*:\s*["']https?:\/\/[^"']+/gi,
  },
  {
    name: 'css-url',
    regex: /url\(\s*["']?https?:\/\/[^\s"')]+/gi,
  },
];

function collectFiles(dirPath) {
  const files = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const issues = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const pattern of patterns) {
      const matches = line.match(pattern.regex);
      if (!matches) continue;
      for (const match of matches) {
        issues.push({
          file: path.relative(projectRoot, filePath),
          line: i + 1,
          pattern: pattern.name,
          snippet: match,
        });
      }
    }
  }

  return issues;
}

function main() {
  if (!fs.existsSync(demosDir)) {
    console.error(`[assets:check:local] Missing directory: ${demosDir}`);
    process.exit(1);
  }

  const targets = [...collectFiles(demosDir), viewerPath].filter((filePath) => fs.existsSync(filePath));
  const issues = targets.flatMap((filePath) => scanFile(filePath));

  if (issues.length === 0) {
    console.log(`[assets:check:local] OK (${targets.length} files scanned)`);
    return;
  }

  console.error('[assets:check:local] External asset references are not allowed.');
  for (const issue of issues) {
    console.error(`- ${issue.file}:${issue.line} [${issue.pattern}] ${issue.snippet}`);
  }
  process.exit(1);
}

main();
