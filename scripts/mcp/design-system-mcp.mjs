/**
 * design-system-mcp.mjs — Repo-local MCP server (thin wrapper over core.mjs).
 *
 * Reads data files directly from the repository root rather than from bundled
 * `data/` directory.  Used via `npm run mcp:design-system`.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from '../../packages/mcp-server/core.mjs';
import { resolveRuntimeDataPath } from '../../packages/mcp-server/runtime-data.mjs';
import { loadJsonDataFromPath, loadTextDataFromPath, loadWcfMcpRuntimeConfig } from '../../packages/mcp-server/server.mjs';

const REPO_ROOT = path.resolve(process.cwd());

export async function loadJsonData(fileName) {
  const abs = resolveRuntimeDataPath(fileName, { repoRoot: REPO_ROOT });
  if (!abs) throw new Error(`Unknown data file: ${fileName}`);
  const text = await fs.readFile(abs, 'utf8');
  return JSON.parse(text);
}

export async function loadTextData(fileName) {
  const abs = resolveRuntimeDataPath(fileName, { repoRoot: REPO_ROOT });
  if (!abs) throw new Error(`Unknown data file: ${fileName}`);
  return fs.readFile(abs, 'utf8');
}

export async function loadValidator() {
  return import('../../packages/mcp-server/validator.mjs');
}

export async function main() {
  const runtimeConfig = await loadWcfMcpRuntimeConfig({
    cwd: REPO_ROOT,
    configPath: process.env.WCF_MCP_CONFIG,
  });
  const { server } = await createMcpServer(loadJsonData, loadValidator, {
    plugins: runtimeConfig.plugins,
    loadJsonDataFromPath,
    loadTextDataFromPath,
    loadTextData,
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

const directRunArg = process.argv[1];
const isDirectRun =
  typeof directRunArg === 'string' &&
  pathToFileURL(path.resolve(directRunArg)).href === import.meta.url;

if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
