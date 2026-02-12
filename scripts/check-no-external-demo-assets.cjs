#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const demosDir = path.join(projectRoot, 'src', 'demos');
const viewerPath = path.join(projectRoot, 'viewer.html');
const resourcesPath = path.join(projectRoot, 'resources');
const distPagesPath = path.join(projectRoot, 'dist-pages');

const patterns = [
  {
    name: 'html-asset-attr',
    regex: /\b(?:src|poster)\s*=\s*["']([^"']*)["']/gi,
    type: 'value',
  },
  {
    name: 'js-asset-prop',
    regex: /\b(?:src|poster)\s*(?:=|:)\s*["']([^"']*)["']/gi,
    type: 'value',
  },
  {
    name: 'css-url',
    regex: /url\(\s*["']?(?:https?:\/\/|\/\/)[^\s"')]+/gi,
  },
  {
    name: 'html-srcset-attr',
    regex: /\bsrcset\s*=\s*["']([^"']*)["']/gi,
    type: 'srcset',
  },
  {
    name: 'js-srcset-prop',
    regex: /\bsrcset\s*:\s*["']([^"']*)["']/gi,
    type: 'srcset',
  },
];

const externalUrlPattern = /^\s*(?:https?:\/\/|\/\/)/;

function hasExternalUrl(value) {
  return externalUrlPattern.test(value);
}

function hasExternalSrcset(value) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .some((entry) => {
      if (!entry) return false;
      const [urlPart] = entry.split(/\s+/);
      return hasExternalUrl(urlPart);
    });
}

function collectFiles(dirPath) {
  const extensions = ['.ts', '.html'];
  const files = [];
  if (!fs.existsSync(dirPath)) return files;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
      continue;
    }

    if (entry.isFile() && extensions.includes(path.extname(entry.name))) {
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
    const lineNo = i + 1;

    for (const pattern of patterns) {
      const matchRegex = new RegExp(pattern.regex.source, pattern.regex.flags);

      if (pattern.type === 'srcset') {
        let match;
        while ((match = matchRegex.exec(line)) !== null) {
          const value = match[1];
          if (hasExternalSrcset(value)) {
            issues.push({
              file: path.relative(projectRoot, filePath),
              line: lineNo,
              pattern: pattern.name,
              snippet: match[0],
            });
          }
        }
        continue;
      }

      if (pattern.type === 'value') {
        let match;
        while ((match = matchRegex.exec(line)) !== null) {
          const value = match[1];
          if (hasExternalUrl(value)) {
            issues.push({
              file: path.relative(projectRoot, filePath),
              line: lineNo,
              pattern: pattern.name,
              snippet: match[0],
            });
          }
        }
        continue;
      }

      let match;
      while ((match = matchRegex.exec(line)) !== null) {
        issues.push({
          file: path.relative(projectRoot, filePath),
          line: lineNo,
          pattern: pattern.name,
          snippet: match[0],
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

  const targets = [
    ...collectFiles(demosDir),
    ...collectFiles(resourcesPath),
    ...collectFiles(distPagesPath),
    viewerPath,
  ].filter((filePath) => fs.existsSync(filePath));
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
