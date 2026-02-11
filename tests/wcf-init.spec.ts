import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { initProject } from '../scripts/wcf/core.js';
import { withCwd } from './utils/with-cwd';

async function mkdtemp() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-init-'));
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

describe('wcf init project', () => {
  it('creates vendor assets and page in one command', async () => {
    const tmp = await mkdtemp();
    const projectDir = path.join(tmp, 'project');

    try {
      const res = await withCwd(tmp, async () => {
        return await initProject({
          prefix: 'myui',
          dir: 'project',
          pattern: 'search-results',
          entry: 'boot',
        });
      });

      expect(path.basename(res.file)).toBe('index.html');
      expect(await exists(res.file)).toBe(true);
      expect(await exists(path.join(projectDir, 'index.html'))).toBe(true);
      expect(await exists(path.join(projectDir, 'vendor', 'components', 'myui', 'boot.js'))).toBe(true);
      expect(await exists(path.join(projectDir, 'vendor', 'components', 'myui', 'components', 'search-box.js'))).toBe(
        true,
      );
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('fails fast for existing page unless --force is set', async () => {
    const tmp = await mkdtemp();
    const projectDir = path.join(tmp, 'project');
    const pageFile = path.join(projectDir, 'index.html');
    const vendorBoot = path.join(projectDir, 'vendor', 'components', 'myui', 'boot.js');

    try {
      await fs.mkdir(projectDir, { recursive: true });
      await fs.writeFile(pageFile, '<!doctype html>\n', 'utf8');

      await expect(
        withCwd(tmp, async () => {
          await initProject({
            prefix: 'myui',
            dir: 'project',
            pattern: 'search-results',
          });
        }),
      ).rejects.toThrow(/E_PAGE_EXISTS/);
      expect(await exists(vendorBoot)).toBe(false);

      await withCwd(tmp, async () => {
        await initProject({
          prefix: 'myui',
          dir: 'project',
          pattern: 'search-results',
          force: true,
        });
      });

      expect(await exists(pageFile)).toBe(true);
      expect(await exists(vendorBoot)).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('keeps vendor output when page creation fails after vendor install', async () => {
    const tmp = await mkdtemp();
    const projectDir = path.join(tmp, 'project');
    const vendorBoot = path.join(projectDir, 'vendor', 'components', 'myui', 'boot.js');

    try {
      await expect(
        withCwd(tmp, async () => {
          await initProject({
            prefix: 'myui',
            dir: 'project',
            pattern: 'search-results',
            entry: 'invalid-entry',
          });
        }),
      ).rejects.toThrow(/E_ENTRY_INVALID/);

      expect(await exists(vendorBoot)).toBe(true);
      expect(await exists(path.join(projectDir, 'index.html'))).toBe(false);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});
