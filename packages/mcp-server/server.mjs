/**
 * server.mjs — Standalone MCP server (thin wrapper over core.mjs).
 *
 * Data is loaded from the bundled `data/` directory first, falling back to
 * the repository root (for development / CI).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Data loading — bundled data/ first, then repo root fallback
// ---------------------------------------------------------------------------

const REPO_FILE_MAP = {
  'custom-elements.json': 'custom-elements.json',
  'install-registry.json': 'registry/install-registry.json',
  'pattern-registry.json': 'registry/pattern-registry.json',
  'design-tokens.json': 'design-tokens.json',
  'guidelines-index.json': 'guidelines-index.json',
};

function resolveDataPath(fileName) {
  const bundled = path.join(__dirname, 'data', fileName);
  const repoRoot = path.resolve(process.cwd());
  const repoRelative = REPO_FILE_MAP[fileName];
  const repo = repoRelative ? path.join(repoRoot, repoRelative) : undefined;
  return { bundled, repo };
}

async function loadJsonData(fileName) {
  const { bundled, repo } = resolveDataPath(fileName);
  for (const p of [bundled, repo]) {
    if (!p) continue;
    try {
      const text = await fs.readFile(p, 'utf8');
      return JSON.parse(text);
    } catch {
      // Try next path
    }
  }
  throw new Error(`データファイルが見つかりません: ${fileName}`);
}

async function loadValidator() {
  return import('./validator.mjs');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createServer() {
  return createMcpServer(loadJsonData, loadValidator);
}

export async function startServer() {
  const { server } = await createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
