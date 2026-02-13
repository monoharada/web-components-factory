#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { EXIT_CODES, parseArgValue } from './file-upload-shared.mjs';

function parseCli(argv) {
  return {
    url: parseArgValue(argv, 'url', ''),
    captureJson: parseArgValue(argv, 'capture-json', ''),
    reportJson: parseArgValue(argv, 'report-json', ''),
    baselinesJson: parseArgValue(argv, 'baselines-json', ''),
    opsDir: parseArgValue(argv, 'ops-dir', ''),
  };
}

function buildArgs(raw, keyMap) {
  const args = [];
  for (const [argName, value] of keyMap) {
    if (!value) continue;
    args.push(`--${argName}`, String(value));
  }
  return args;
}

async function runNodeScript(scriptPath, scriptArgs) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...scriptArgs], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }
      const error = new Error(`${scriptPath} exited with code ${String(code)}`);
      error.code = code ?? 1;
      reject(error);
    });
  });
}

async function main() {
  const cli = parseCli(process.argv.slice(2));

  const captureArgs = buildArgs(cli, [
    ['url', cli.url],
    ['capture-json', cli.captureJson],
  ]);
  const diffArgs = buildArgs(cli, [
    ['capture-json', cli.captureJson],
    ['report-json', cli.reportJson],
    ['baselines-json', cli.baselinesJson],
  ]);
  const opsArgs = buildArgs(cli, [
    ['capture-json', cli.captureJson],
    ['report-json', cli.reportJson],
    ['ops-dir', cli.opsDir],
  ]);

  try {
    await runNodeScript('scripts/design-sync/file-upload-capture.mjs', captureArgs);
    await runNodeScript('scripts/design-sync/file-upload-diff.mjs', diffArgs);
    await runNodeScript('scripts/design-sync/file-upload-to-pencil-ops.mjs', opsArgs);
  } catch (err) {
    const code = Number(err?.code ?? 1);
    process.exit(Number.isFinite(code) ? code : EXIT_CODES.opsFailure);
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err);
  console.error(`[design-sync:file-upload:pipeline] ${message}`);
  process.exit(EXIT_CODES.opsFailure);
});
