import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

import { initAgentKit, printImportMap, vendorAdd, vendorInstall } from '../scripts/wcf/core.js';
import { withCwd } from './utils/with-cwd';

const REPO_ROOT = path.resolve(__dirname, '..');
const WCF_CLI = path.join(REPO_ROOT, 'scripts', 'wcf', 'cli.js');

async function mkdtemp() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-vendor-'));
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(root: string): Promise<string[]> {
  const out: string[] = [];
  const stack = [root];

  while (stack.length > 0) {
    const dir = stack.pop();
    if (!dir) continue;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        stack.push(abs);
      } else if (ent.isFile()) {
        out.push(abs);
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

describe('wcf vendor install', () => {
  it('installs search-results pattern into vendor directory without hashed filenames', async () => {
    const tmp = await mkdtemp();
    const outDirRel = path.join('vendor', 'components', 'myui');
    const outDir = path.join(tmp, outDirRel);

    try {
      await withCwd(tmp, async () => {
        await vendorInstall({
          prefix: 'myui',
          outDir: outDirRel,
          pattern: 'search-results',
        });
      });

      expect(await exists(path.join(outDir, 'boot.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'index.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'wc-autoloader.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'components', 'config.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'autoload', 'heading.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'autoload', 'search-box.js'))).toBe(true);

      expect(await exists(path.join(outDir, 'components', 'heading.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'components', 'search-box.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'components', 'card.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'components', 'page-navigation.js'))).toBe(true);
      const bootText = await fs.readFile(path.join(outDir, 'boot.js'), 'utf8');
      const indexText = await fs.readFile(path.join(outDir, 'index.js'), 'utf8');
      const autoloadText = await fs.readFile(path.join(outDir, 'autoload', 'search-box.js'), 'utf8');
      expect(bootText).toContain("import { setConfig } from './components/config.js';");
      expect(indexText).toContain("await import('./components/search-box.js');");
      expect(autoloadText).toContain("await import('../components/search-box.js');");

      const files = await listFilesRecursive(outDir);
      const hashed = files.filter((f) => /-[a-f0-9]{8,}\.js$/i.test(path.basename(f)));
      expect(hashed).toEqual([]);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('keeps non-empty outDir protected unless --force is set', async () => {
    const tmp = await mkdtemp();
    const outDirRel = path.join('vendor', 'components', 'myui');
    const outDir = path.join(tmp, outDirRel);
    try {
      await withCwd(tmp, async () => {
        await vendorInstall({
          prefix: 'myui',
          outDir: outDirRel,
          pattern: 'search-results',
        });
      });

      await fs.writeFile(path.join(outDir, 'keep.txt'), 'manual', 'utf8');

      await expect(
        withCwd(tmp, async () => {
          await vendorInstall({
            prefix: 'myui',
            outDir: outDirRel,
            pattern: 'search-results',
          });
        }),
      ).rejects.toThrow('Output directory is not empty');

      await withCwd(tmp, async () => {
        await vendorInstall({
          prefix: 'myui',
          outDir: outDirRel,
          pattern: 'search-results',
          force: true,
        });
      });
      expect(await exists(path.join(outDir, 'keep.txt'))).toBe(true);
      expect(await exists(path.join(outDir, 'boot.js'))).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('prints importmap with stable component paths', async () => {
    const text = await printImportMap({
      prefix: 'myui',
      dir: 'vendor/components/myui',
      pattern: 'search-results',
      format: 'html',
    });

    expect(text).toContain('<script type="importmap">');
    expect(text).toContain('"myui-search-box": "./vendor/components/myui/components/search-box.js"');
    expect(text).toContain('"myui-page-navigation": "./vendor/components/myui/components/page-navigation.js"');
  });

  it('refuses --force on unmanaged non-empty directory', async () => {
    const tmp = await mkdtemp();
    const outDirRel = 'unsafe-dir';
    const outDir = path.join(tmp, outDirRel);

    try {
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, 'keep.txt'), 'do-not-touch', 'utf8');

      await expect(
        withCwd(tmp, async () => {
          await vendorInstall({
            prefix: 'myui',
            outDir: outDirRel,
            pattern: 'search-results',
            force: true,
          });
        }),
      ).rejects.toThrow('Refusing --force on unmanaged output directory');

      expect(await exists(path.join(outDir, 'keep.txt'))).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('wcf vendor add', () => {
  it('merges existing and newly requested components', async () => {
    const tmp = await mkdtemp();
    const outDirRel = path.join('vendor', 'components', 'myui');
    const outDir = path.join(tmp, outDirRel);
    try {
      await withCwd(tmp, async () => {
        await vendorInstall({
          prefix: 'myui',
          outDir: outDirRel,
          components: ['button'],
        });
      });

      const res = await withCwd(tmp, async () => {
        return await vendorAdd({
          prefix: 'myui',
          outDir: outDirRel,
          components: ['card'],
        });
      });

      expect(res.addedComponents).toEqual(['card']);
      expect(res.totalComponents).toBe(2);
      expect(await exists(path.join(outDir, 'components', 'button.js'))).toBe(true);
      expect(await exists(path.join(outDir, 'components', 'card.js'))).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('detects drift and allows overwrite only with --force', async () => {
    const tmp = await mkdtemp();
    const outDirRel = path.join('vendor', 'components', 'myui');
    const outDir = path.join(tmp, outDirRel);
    try {
      await withCwd(tmp, async () => {
        await vendorInstall({
          prefix: 'myui',
          outDir: outDirRel,
          pattern: 'search-form',
        });
      });

      const buttonEntry = path.join(outDir, 'components', 'button.js');
      const marker = '\n// local drift\n';
      await fs.writeFile(buttonEntry, (await fs.readFile(buttonEntry, 'utf8')) + marker, 'utf8');

      await expect(
        withCwd(tmp, async () => {
          await vendorAdd({
            prefix: 'myui',
            outDir: outDirRel,
            components: ['card'],
          });
        }),
      ).rejects.toThrow(/E_VENDOR_DRIFT/);
      expect(await exists(path.join(outDir, 'components', 'card.js'))).toBe(false);
      expect(await fs.readFile(buttonEntry, 'utf8')).toContain(marker.trim());

      await withCwd(tmp, async () => {
        await vendorAdd({
          prefix: 'myui',
          outDir: outDirRel,
          components: ['card'],
          force: true,
        });
      });

      expect(await exists(path.join(outDir, 'components', 'card.js'))).toBe(true);
      expect(await fs.readFile(buttonEntry, 'utf8')).not.toContain(marker.trim());
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('detects drift even when no managed components are discovered', async () => {
    const tmp = await mkdtemp();
    const outDirRel = path.join('vendor', 'components', 'myui');
    const outDir = path.join(tmp, outDirRel);
    try {
      await fs.mkdir(outDir, { recursive: true });
      const bootFile = path.join(outDir, 'boot.js');
      const marker = '// manual drift';
      await fs.writeFile(bootFile, `${marker}\n`, 'utf8');

      await expect(
        withCwd(tmp, async () => {
          await vendorAdd({
            prefix: 'myui',
            outDir: outDirRel,
            components: ['card'],
          });
        }),
      ).rejects.toThrow(/E_VENDOR_DRIFT/);
      expect(await fs.readFile(bootFile, 'utf8')).toContain(marker);

      await withCwd(tmp, async () => {
        await vendorAdd({
          prefix: 'myui',
          outDir: outDirRel,
          components: ['card'],
          force: true,
        });
      });

      expect(await fs.readFile(bootFile, 'utf8')).not.toContain(marker);
      expect(await exists(path.join(outDir, 'components', 'card.js'))).toBe(true);
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('wcf agent init', () => {
  it('creates skills, prompt, and helper scripts without overwriting files', async () => {
    const tmp = await mkdtemp();
    try {
      const outDir = path.join(tmp, 'project');
      const res = await initAgentKit({
        prefix: 'myui',
        outDir,
        pattern: 'search-results',
      });

      expect(res.prefix).toBe('myui');
      expect(res.pattern).toBe('search-results');
      expect(await exists(path.join(outDir, '.wcf', 'AGENT_GUIDE.md'))).toBe(true);
      expect(await exists(path.join(outDir, 'skills', 'wcf-vendor-install', 'SKILL.md'))).toBe(true);
      expect(await exists(path.join(outDir, 'prompts', 'create-page.md'))).toBe(true);
      expect(await exists(path.join(outDir, 'scripts', 'wcf-install.sh'))).toBe(true);
      expect(await exists(path.join(outDir, 'scripts', 'wcf-print-importmap.sh'))).toBe(true);
      expect(await exists(path.join(outDir, 'scripts', 'wcf-create-page.sh'))).toBe(true);

      const installScript = await fs.readFile(path.join(outDir, 'scripts', 'wcf-install.sh'), 'utf8');
      const importmapScript = await fs.readFile(path.join(outDir, 'scripts', 'wcf-print-importmap.sh'), 'utf8');
      const skillText = await fs.readFile(path.join(outDir, 'skills', 'wcf-vendor-install', 'SKILL.md'), 'utf8');

      expect(installScript).toContain('run_wcf init --prefix');
      expect(installScript).toContain('run_wcf add --pattern');
      expect(installScript).toContain('run_wcf add "${COMPONENTS[@]}"');
      expect(importmapScript).toContain('importmap.snippet.json');
      expect(skillText).toContain("import './vendor/components/<prefix>/index.js';");

      await expect(
        initAgentKit({
          prefix: 'myui',
          outDir,
          pattern: 'search-results',
        }),
      ).rejects.toThrow('Refusing to overwrite existing file');
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('wcf cli channel local', () => {
  it('keeps existing behavior with --channel local', () => {
    const result = spawnSync(
      process.execPath,
      [
        WCF_CLI,
        'vendor-importmap-json',
        '--channel',
        'local',
        '--prefix',
        'myui',
        '--dir',
        'vendor/components/myui',
        '--pattern',
        'search-results',
      ],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
      },
    );

    expect(result.status).toBe(0);
    expect(String(result.stdout)).toContain('"myui-search-box"');
  });
});
