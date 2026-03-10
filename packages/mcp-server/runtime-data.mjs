import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const RUNTIME_FILE_MAP = Object.freeze({
  'custom-elements.json': 'custom-elements.json',
  'install-registry.json': 'registry/install-registry.json',
  'pattern-registry.json': 'registry/pattern-registry.json',
  'component-selector-guide.json': 'registry/component-selector-guide.json',
  'design-tokens.json': 'packages/mcp-server/data/design-tokens.json',
  'guidelines-index.json': 'packages/mcp-server/data/guidelines-index.json',
  'llms-full.txt': 'llms-full.txt',
  'skills-registry.json': 'registry/skills-registry.json',
});

export function resolveRuntimeDataPath(fileName, { repoRoot = process.cwd() } = {}) {
  const repoRelative = RUNTIME_FILE_MAP[fileName];
  return repoRelative ? path.join(repoRoot, repoRelative) : undefined;
}

export function resolveBundledDataPath(fileName, { bundledDir } = {}) {
  if (!bundledDir) return undefined;
  return path.join(bundledDir, 'data', fileName);
}

async function readTextIfExists(targetPath) {
  if (!targetPath) return null;
  try {
    return await fs.readFile(targetPath, 'utf8');
  } catch {
    return null;
  }
}

async function loadGeneratedJsonFallback(fileName, { repoRoot }) {
  const generators = {
    'design-tokens.json': {
      modulePath: path.join(repoRoot, 'scripts/mcp/extract-design-tokens.mjs'),
      exportName: 'buildDesignTokensData',
    },
    'guidelines-index.json': {
      modulePath: path.join(repoRoot, 'scripts/mcp/index-guidelines.mjs'),
      exportName: 'buildGuidelinesIndexData',
    },
  };

  const generator = generators[fileName];
  if (!generator) return null;

  try {
    await fs.access(generator.modulePath);
  } catch {
    return null;
  }

  const loaded = await import(pathToFileURL(generator.modulePath).href);
  const build = loaded?.[generator.exportName];
  if (typeof build !== 'function') return null;
  return build();
}

export async function loadTextDataWithFallback(fileName, { bundledDir, repoRoot = process.cwd() } = {}) {
  const bundled = resolveBundledDataPath(fileName, { bundledDir });
  const repo = resolveRuntimeDataPath(fileName, { repoRoot });

  for (const candidate of [bundled, repo]) {
    const text = await readTextIfExists(candidate);
    if (text !== null) return text;
  }

  throw new Error(`テキストデータファイルが見つかりません: ${fileName}`);
}

export async function loadJsonDataWithFallback(fileName, options = {}) {
  try {
    const text = await loadTextDataWithFallback(fileName, options);
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(
        `データファイルのJSON解析に失敗しました: ${fileName} (${error instanceof Error ? error.message : String(error)})`,
      );
    }
  } catch (error) {
    const generated = await loadGeneratedJsonFallback(fileName, {
      repoRoot: options.repoRoot ?? process.cwd(),
    });
    if (generated !== null) return generated;
    throw error;
  }
}
