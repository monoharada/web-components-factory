/**
 * server.mjs — Standalone MCP server (thin wrapper over core.mjs).
 *
 * Data is loaded from the bundled `data/` directory first, falling back to
 * the repository root (for development / CI).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './core.mjs';
import { loadJsonDataWithFallback, loadTextDataWithFallback } from './runtime-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Data loading — bundled data/ first, then repo root fallback
// ---------------------------------------------------------------------------

export const DEFAULT_WCF_MCP_CONFIG = 'wcf-mcp.config.json';

export function createRuntimeDataLoaders({ cwd = process.cwd() } = {}) {
  const repoRoot = path.resolve(cwd);
  return {
    async loadJsonData(fileName) {
      return loadJsonDataWithFallback(fileName, {
        bundledDir: __dirname,
        repoRoot,
      });
    },
    async loadTextData(fileName) {
      return loadTextDataWithFallback(fileName, {
        bundledDir: __dirname,
        repoRoot,
      });
    },
  };
}

async function loadValidator() {
  return import('./validator.mjs');
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function resolveFromBase(baseDir, maybeRelativePath) {
  if (path.isAbsolute(maybeRelativePath)) return maybeRelativePath;
  return path.resolve(baseDir, maybeRelativePath);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function normalizeDataSourcesInput(raw, baseDir, ownerLabel) {
  if (!raw) return [];
  const out = [];
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!isPlainObject(item)) {
        throw new Error(`Invalid ${ownerLabel}.dataSources entry: expected object`);
      }
      const fileName = String(item.fileName ?? '').trim();
      const sourcePath = String(item.path ?? '').trim();
      if (!fileName || !sourcePath) {
        throw new Error(`Invalid ${ownerLabel}.dataSources entry: fileName and path are required`);
      }
      out.push({ fileName, path: resolveFromBase(baseDir, sourcePath) });
    }
    return out;
  }
  if (isPlainObject(raw)) {
    for (const [fileName, sourcePath] of Object.entries(raw)) {
      const source = String(sourcePath ?? '').trim();
      if (!fileName || !source) continue;
      out.push({ fileName, path: resolveFromBase(baseDir, source) });
    }
    return out;
  }
  throw new Error(`Invalid ${ownerLabel}.dataSources: expected array or object map`);
}

async function loadModulePlugin(modulePath, baseDir) {
  const absPath = resolveFromBase(baseDir, modulePath);
  const loaded = await import(pathToFileURL(absPath).href);
  const candidate = loaded?.default ?? loaded?.plugin ?? loaded;
  const plugin = typeof candidate === 'function' ? await candidate() : candidate;
  if (!isPlainObject(plugin)) {
    throw new Error(`Invalid plugin module: ${modulePath} (expected plugin object export)`);
  }
  return {
    plugin,
    moduleDir: path.dirname(absPath),
  };
}

function normalizeStaticTools(staticTools, ownerLabel) {
  if (!Array.isArray(staticTools)) return [];
  const out = [];
  for (const entry of staticTools) {
    if (!isPlainObject(entry)) {
      throw new Error(`Invalid ${ownerLabel}.staticTools entry: expected object`);
    }
    const name = String(entry.name ?? '').trim();
    if (!name) throw new Error(`Invalid ${ownerLabel}.staticTools entry: name is required`);
    const description = String(entry.description ?? '').trim() || `Static plugin tool (${ownerLabel})`;
    out.push({
      name,
      description,
      inputSchema: {},
      staticPayload: Object.prototype.hasOwnProperty.call(entry, 'payload')
        ? entry.payload
        : { message: `Static tool response from ${name}` },
    });
  }
  return out;
}

export async function loadWcfMcpRuntimeConfig({ cwd = process.cwd(), configPath } = {}) {
  const resolvedConfigPath = configPath
    ? resolveFromBase(cwd, configPath)
    : path.join(cwd, DEFAULT_WCF_MCP_CONFIG);
  const exists = await pathExists(resolvedConfigPath);
  if (!exists) {
    if (configPath) {
      throw new Error(`Config file not found: ${resolvedConfigPath}`);
    }
    return { configPath: resolvedConfigPath, plugins: [] };
  }

  const text = await fs.readFile(resolvedConfigPath, 'utf8');
  const rawConfig = JSON.parse(text);
  if (!isPlainObject(rawConfig)) {
    throw new Error(`Invalid config: ${resolvedConfigPath} must contain a JSON object`);
  }

  const configDir = path.dirname(resolvedConfigPath);
  const plugins = [];
  const rootDataSources = normalizeDataSourcesInput(rawConfig.dataSources, configDir, 'config');
  if (rootDataSources.length > 0) {
    plugins.push({
      name: 'config-data-sources',
      version: '0.0.1',
      dataSources: rootDataSources,
      tools: [],
    });
  }

  const rawPlugins = Array.isArray(rawConfig.plugins) ? rawConfig.plugins : [];
  for (const item of rawPlugins) {
    if (!isPlainObject(item)) {
      throw new Error('Invalid config.plugins entry: expected object');
    }
    if (typeof item.module === 'string' && item.module.trim() !== '') {
      const { plugin: loadedPlugin, moduleDir } = await loadModulePlugin(item.module, configDir);
      const moduleDataSources = normalizeDataSourcesInput(
        loadedPlugin.dataSources,
        moduleDir,
        `plugin(${item.module})`,
      );
      plugins.push({
        ...loadedPlugin,
        dataSources: moduleDataSources,
      });
      continue;
    }

    const name = String(item.name ?? '').trim();
    const version = String(item.version ?? '').trim();
    if (!name || !version) {
      throw new Error('Invalid config.plugins static entry: name and version are required');
    }
    plugins.push({
      name,
      version,
      dataSources: normalizeDataSourcesInput(item.dataSources, configDir, `plugin(${name})`),
      tools: normalizeStaticTools(item.staticTools, `plugin(${name})`),
    });
  }

  return {
    configPath: resolvedConfigPath,
    plugins,
  };
}

export async function loadJsonDataFromPath(sourcePath) {
  const text = await fs.readFile(sourcePath, 'utf8');
  return JSON.parse(text);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function createServer(options = {}) {
  const runtimeCwd = options.cwd ?? process.cwd();
  const runtimeConfig = await loadWcfMcpRuntimeConfig({
    cwd: runtimeCwd,
    configPath: options.configPath,
  });
  const { loadJsonData, loadTextData } = createRuntimeDataLoaders({ cwd: runtimeCwd });
  return createMcpServer(loadJsonData, loadValidator, {
    plugins: runtimeConfig.plugins,
    loadJsonDataFromPath,
    loadTextData,
  });
}

export async function startServer(options = {}) {
  const { server } = await createServer(options);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
