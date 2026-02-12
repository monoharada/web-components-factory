import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

const DEFAULT_THRESHOLD_MS = 5 * 60 * 1000;

function parseArgs(argv) {
  const result = {
    runner: 'local',
    thresholdMs: DEFAULT_THRESHOLD_MS,
    packageSpec: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--runner') {
      result.runner = argv[++i] ?? 'local';
      continue;
    }
    if (arg === '--threshold-ms') {
      result.thresholdMs = Number(argv[++i] ?? DEFAULT_THRESHOLD_MS);
      continue;
    }
    if (arg === '--package') {
      result.packageSpec = String(argv[++i] ?? '').trim() || null;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      // eslint-disable-next-line no-console
      console.log(
        [
          'Usage: node scripts/wcf/smoke-ttfr.js [--runner local|bun-local|npm|bunx] [--threshold-ms 300000] [--package <spec>]',
          '',
          'Measures time from empty directory to generated index.html for the search-results pattern.',
          'npm/bunx runners default to local package (`file:<cwd>`).',
          'Use --package or WCF_PACKAGE to verify remote package specs.',
        ].join('\n'),
      );
      process.exit(0);
    }
  }

  return result;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function normalizePackageSpecForNpmExec(packageSpec) {
  const value = String(packageSpec ?? '').trim();
  const githubGitHttpRe = /^git\+https:\/\/github\.com\/([^/]+)\/([^/#]+?)(?:\.git)?#(.+)$/i;
  const match = value.match(githubGitHttpRe);
  if (!match) return value;
  const [, owner, repo, ref] = match;
  return `github:${owner}/${repo}#${ref}`;
}

function buildWcfRunner({ runner, repoRoot, runCwd, packageSpec }) {
  if (runner === 'local') {
    return (wcfArgs) =>
      run(process.execPath, [path.join(repoRoot, 'scripts', 'wcf', 'cli.js'), ...wcfArgs], { cwd: runCwd });
  }
  if (runner === 'npm') {
    const normalizedSpec = normalizePackageSpecForNpmExec(packageSpec);
    const isWin = process.platform === 'win32';
    const localWcfBin = path.join(runCwd, 'node_modules', '.bin', isWin ? 'wcf.cmd' : 'wcf');
    let installed = false;

    return (wcfArgs) => {
      if (!installed) {
        run('npm', ['install', '--no-save', normalizedSpec], { cwd: runCwd });
        installed = true;
      }
      run(localWcfBin, wcfArgs, { cwd: runCwd, shell: isWin });
    };
  }
  if (runner === 'bun-local') {
    return (wcfArgs) => run('bun', [path.join(repoRoot, 'scripts', 'wcf', 'cli.js'), ...wcfArgs], { cwd: runCwd });
  }
  if (runner === 'bunx') {
    return (wcfArgs) => run('bunx', ['--package', packageSpec, 'wcf', ...wcfArgs], { cwd: runCwd });
  }

  throw new Error(`Unknown runner: ${runner}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(process.cwd());
  const defaultPackageSpec = `file:${repoRoot}`;
  const packageSpec =
    args.packageSpec ??
    process.env.WCF_PACKAGE ??
    defaultPackageSpec;
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-ttfr-'));
  const runWcf = buildWcfRunner({ runner: args.runner, repoRoot, runCwd: tmpDir, packageSpec });

  const start = performance.now();
  runWcf(['vendor', 'install', '--prefix', 'myui', '--dir', path.join('vendor', 'components', 'myui'), '--pattern', 'search-results']);
  runWcf(['page', 'create', '--pattern', 'search-results', '--prefix', 'myui', '--dir', '.', '--entry', 'boot']);
  const end = performance.now();

  const indexPath = path.join(tmpDir, 'index.html');
  await fs.access(indexPath);

  const elapsedMs = Math.round(end - start);
  const result = {
    runner: args.runner,
    elapsedMs,
    thresholdMs: args.thresholdMs,
    pass: elapsedMs <= args.thresholdMs,
    indexPath,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result, null, 2));

  if (!result.pass) {
    process.exit(1);
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(String(error?.stack ?? error));
  process.exit(1);
});
