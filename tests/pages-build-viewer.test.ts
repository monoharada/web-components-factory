import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { describe, expect, test } from 'vitest';

function run(cmd: string, args: string[]) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', env: process.env });
  expect(result.status).toBe(0);
}

describe('pages:build', () => {
  test('outputs Viewer to dist-pages/index.html (not Average Case)', () => {
    run(process.execPath, ['scripts/build-pages.cjs']);
    run(process.execPath, ['scripts/check-pages-output.cjs']);

    const html = readFileSync('dist-pages/index.html', 'utf8');
    expect(html).toContain('<title>Web Components Viewer');
    expect(html).toContain("from './styles/tokens.js'");
    expect(html).not.toContain("from '/styles/tokens.js'");

    const tableControlDemoJs = readFileSync('dist-pages/src/demos/showcase-table-control.js', 'utf8');
    expect(tableControlDemoJs).not.toContain("import('/src/demos/");
    expect(tableControlDemoJs).toContain("import('./src/demos/");
  });
});
