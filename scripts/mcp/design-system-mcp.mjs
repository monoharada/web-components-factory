/**
 * design-system-mcp.mjs — Repo-local MCP server (thin wrapper over core.mjs).
 *
 * Reads data files directly from the repository root rather than from bundled
 * `data/` directory.  Used via `npm run mcp:design-system`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from '../../packages/mcp-server/core.mjs';

const REPO_ROOT = path.resolve(process.cwd());

const FILE_MAP = {
  'custom-elements.json': 'custom-elements.json',
  'install-registry.json': 'registry/install-registry.json',
  'pattern-registry.json': 'registry/pattern-registry.json',
  'design-tokens.json': 'packages/mcp-server/data/design-tokens.json',
  'guidelines-index.json': 'packages/mcp-server/data/guidelines-index.json',
};

async function loadJsonData(fileName) {
  const relPath = FILE_MAP[fileName];
  if (!relPath) throw new Error(`Unknown data file: ${fileName}`);
  const abs = path.join(REPO_ROOT, relPath);
  const text = await fs.readFile(abs, 'utf8');
  return JSON.parse(text);
}

async function loadValidator() {
  return import('../wc/validator-core.mjs');
}

async function main() {
  const { server } = await createMcpServer(loadJsonData, loadValidator);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
