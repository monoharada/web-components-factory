import { mkdtemp, rm, stat, unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { afterEach, expect, test } from 'vitest';

const REPO_ROOT = path.resolve(__dirname, '..');
const WCF_BIN = path.join(REPO_ROOT, 'bin', 'wcf.mjs');

async function exists(p: string): Promise<boolean> {
  try {
    const st = await stat(p);
    return st.isFile() || st.isDirectory();
  } catch {
    return false;
  }
}

function runNode(args: string[], { cwd }: { cwd: string }): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += String(d)));
    child.stderr.on('data', (d) => (stderr += String(d)));
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`node ${args.join(' ')} failed (${code})\n${stderr}`));
    });
  });
}

async function makeTempDir(): Promise<string> {
  return mkdtemp(path.join(os.tmpdir(), 'wcf-consumer-'));
}

async function cleanupDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}

let tempDir: string | undefined;
afterEach(async () => {
  if (tempDir) await cleanupDir(tempDir);
  tempDir = undefined;
});

test(
  'wcf add --pattern installs required components (local upstream)',
  { timeout: 30_000 },
  async () => {
    tempDir = await makeTempDir();
    const outDir = 'vendor/components/myui';

    await runNode([WCF_BIN, 'init', '--prefix', 'myui', '--lang', 'js', '--out', outDir], { cwd: tempDir });
    await runNode(
      [WCF_BIN, 'add', '--pattern', 'search-form', '--prefix', 'myui', '--lang', 'js', '--out', outDir, '--local', REPO_ROOT],
      { cwd: tempDir },
    );

    expect(await exists(path.join(tempDir, outDir, 'autoload', 'button.js'))).toBe(true);
    expect(await exists(path.join(tempDir, outDir, 'autoload', 'search-box.js'))).toBe(true);
    expect(await exists(path.join(tempDir, outDir, 'importmap.snippet.json'))).toBe(true);
  },
);

test(
  'detach prevents new writes even when a file is missing',
  { timeout: 30_000 },
  async () => {
    tempDir = await makeTempDir();
    const outDir = 'vendor/components/myui';

    await runNode([WCF_BIN, 'init', '--prefix', 'myui', '--lang', 'js', '--out', outDir], { cwd: tempDir });
    await runNode([WCF_BIN, 'add', 'button', '--prefix', 'myui', '--lang', 'js', '--out', outDir, '--local', REPO_ROOT], {
      cwd: tempDir,
    });

    await runNode([WCF_BIN, 'detach', 'button'], { cwd: tempDir });

    const buttonFile = path.join(tempDir, outDir, 'wcf', 'packages', 'components', 'button', 'button.js');
    expect(await exists(buttonFile)).toBe(true);
    await unlink(buttonFile);
    expect(await exists(buttonFile)).toBe(false);

    await runNode([WCF_BIN, 'add', 'button', '--prefix', 'myui', '--lang', 'js', '--out', outDir, '--local', REPO_ROOT], {
      cwd: tempDir,
    });

    // If detach is "owner-level", missing files must stay missing (no new writes).
    expect(await exists(buttonFile)).toBe(false);
  },
);

test(
  'init refuses outDir outside project by default',
  { timeout: 30_000 },
  async () => {
    tempDir = await makeTempDir();
    await expect(
      runNode([WCF_BIN, 'init', '--prefix', 'myui', '--lang', 'js', '--out', '../outside'], { cwd: tempDir }),
    ).rejects.toThrow(/Refusing --out outside the project/i);
  },
);

