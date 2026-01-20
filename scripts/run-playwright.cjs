#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = process.cwd();
const evidenceDir = path.join(projectRoot, 'e2e-evidence');

function hasPlaywrightSpecFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return false;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (hasPlaywrightSpecFiles(entryPath)) return true;
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.spec.ts')) return true;
  }

  return false;
}

if (!hasPlaywrightSpecFiles(evidenceDir)) {
  console.log('[e2e] No Playwright spec files found under e2e-evidence/. Skipping.');
  console.log('[e2e] Add e.g. e2e-evidence/example.spec.ts to enable.');
  process.exit(0);
}

const binName = process.platform === 'win32' ? 'playwright.cmd' : 'playwright';
const playwrightBin = path.join(projectRoot, 'node_modules', '.bin', binName);

if (!fs.existsSync(playwrightBin)) {
  console.error('[e2e] Playwright CLI not found. Run `npm ci` first.');
  process.exit(1);
}

const args = process.argv.slice(2);
const result = spawnSync(playwrightBin, ['test', ...args], { stdio: 'inherit' });
process.exit(result.status ?? 1);

