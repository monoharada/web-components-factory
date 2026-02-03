import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

const runMeasure = () => {
  const entry = path.resolve(__dirname, '../fixtures/size/entry.ts');
  const script = path.resolve(repoRoot, 'scripts/size/measure-esm.mjs');
  const output = execFileSync(
    process.execPath,
    [script, '--entry', entry, '--json', '--root', repoRoot],
    { encoding: 'utf8' }
  );
  return JSON.parse(output) as {
    results: Array<{ fileCount: number }>;
  };
};

describe('measure-esm - type-only import/export', () => {
  it('type-only specifier を runtime 依存として数えない', () => {
    const result = runMeasure();
    expect(result.results[0]?.fileCount).toBe(1);
  });
});
