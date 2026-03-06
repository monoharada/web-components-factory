import fs from 'node:fs/promises';
import path from 'node:path';

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
  const text = await loadTextDataWithFallback(fileName, options);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      `データファイルのJSON解析に失敗しました: ${fileName} (${error instanceof Error ? error.message : String(error)})`,
    );
  }
}
