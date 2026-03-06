import { describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  loadJsonDataWithFallback,
  loadTextDataWithFallback,
  resolveBundledDataPath,
  resolveRuntimeDataPath,
} from './runtime-data.mjs';

async function withTempRuntimeDirs(run) {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-mcp-runtime-'));
  const repoRoot = path.join(tempRoot, 'repo');
  const bundledDir = path.join(tempRoot, 'package');

  await fs.mkdir(path.join(repoRoot, 'registry'), { recursive: true });
  await fs.mkdir(path.join(repoRoot, 'packages/mcp-server/data'), { recursive: true });
  await fs.mkdir(path.join(bundledDir, 'data'), { recursive: true });

  try {
    return await run({ repoRoot, bundledDir });
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

describe('runtime data path helpers', () => {
  it('resolves repo and bundled paths from the shared file map', () => {
    expect(resolveRuntimeDataPath('custom-elements.json', { repoRoot: '/repo' })).toBe(path.join('/repo', 'custom-elements.json'));
    expect(resolveBundledDataPath('custom-elements.json', { bundledDir: '/pkg' })).toBe(path.join('/pkg', 'data', 'custom-elements.json'));
    expect(resolveRuntimeDataPath('unknown.json', { repoRoot: '/repo' })).toBeUndefined();
  });

  it('prefers bundled data before repo fallback', async () => {
    await withTempRuntimeDirs(async ({ repoRoot, bundledDir }) => {
      await fs.writeFile(path.join(repoRoot, 'llms-full.txt'), 'repo copy', 'utf8');
      await fs.writeFile(path.join(bundledDir, 'data', 'llms-full.txt'), 'bundled copy', 'utf8');

      const text = await loadTextDataWithFallback('llms-full.txt', { bundledDir, repoRoot });
      expect(text).toBe('bundled copy');
    });
  });

  it('falls back to repo data when bundled data is missing', async () => {
    await withTempRuntimeDirs(async ({ repoRoot, bundledDir }) => {
      await fs.writeFile(path.join(repoRoot, 'llms-full.txt'), 'repo copy', 'utf8');

      const text = await loadTextDataWithFallback('llms-full.txt', { bundledDir, repoRoot });
      expect(text).toBe('repo copy');
    });
  });

  it('throws a file-specific error when JSON parsing fails', async () => {
    await withTempRuntimeDirs(async ({ repoRoot, bundledDir }) => {
      await fs.writeFile(path.join(repoRoot, 'registry', 'install-registry.json'), '{', 'utf8');

      await expect(
        loadJsonDataWithFallback('install-registry.json', { bundledDir, repoRoot }),
      ).rejects.toThrow('データファイルのJSON解析に失敗しました: install-registry.json');
    });
  });
});
