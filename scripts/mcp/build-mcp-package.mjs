#!/usr/bin/env node
/**
 * Build script for the standalone MCP server package.
 * Copies data files (CEM, registries) into packages/mcp-server/data/
 * so the package can run without cloning the repository.
 *
 * Usage:
 *   npm run mcp:build
 *   node scripts/mcp/build-mcp-package.mjs
 *   node scripts/mcp/build-mcp-package.mjs --check  (CI mode: verify data is up to date)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const MCP_DATA_DIR = path.join(ROOT, 'packages/mcp-server/data');

const CHECK_MODE = process.argv.includes('--check');

const FILES = [
  {
    src: path.join(ROOT, 'custom-elements.json'),
    dest: path.join(MCP_DATA_DIR, 'custom-elements.json'),
  },
  {
    src: path.join(ROOT, 'registry/install-registry.json'),
    dest: path.join(MCP_DATA_DIR, 'install-registry.json'),
  },
  {
    src: path.join(ROOT, 'registry/pattern-registry.json'),
    dest: path.join(MCP_DATA_DIR, 'pattern-registry.json'),
  },
];

async function readFileSafe(p) {
  try {
    return await fs.readFile(p, 'utf8');
  } catch {
    return null;
  }
}

async function main() {
  await fs.mkdir(MCP_DATA_DIR, { recursive: true });

  let allUpToDate = true;

  for (const { src, dest } of FILES) {
    const srcContent = await readFileSafe(src);
    if (srcContent === null) {
      console.error(`Source not found: ${path.relative(ROOT, src)}`);
      process.exit(1);
    }

    const destContent = await readFileSafe(dest);
    const name = path.basename(dest);

    if (srcContent === destContent) {
      console.log(`  ${name}: up to date`);
      continue;
    }

    if (CHECK_MODE) {
      console.error(`  ${name}: OUT OF DATE (run \`npm run mcp:build\` to update)`);
      allUpToDate = false;
      continue;
    }

    await fs.writeFile(dest, srcContent, 'utf8');
    const sizeKb = (Buffer.byteLength(srcContent, 'utf8') / 1024).toFixed(1);
    console.log(`  ${name}: copied (${sizeKb} KB)`);
  }

  if (CHECK_MODE && !allUpToDate) {
    console.error('\nMCP package data is out of date. Run: npm run mcp:build');
    process.exit(1);
  }

  if (CHECK_MODE) {
    console.log('\nMCP package data is up to date');
  } else {
    console.log('\nMCP package build complete');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
