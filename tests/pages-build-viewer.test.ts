import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { describe, expect, test } from 'vitest';

const LONG_IO_TIMEOUT_MS = 40_000;

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
    expect(html).toContain('id="component-pane"');
    expect(html).toContain('id="component-pane-nav"');
    expect(html).toContain('id="component-pane-toggle"');
    expect(html).toContain('id="component-pane-backdrop"');
    expect(html).toContain('<dads-layout-sidebar>');
    expect(html).toContain("createElement('dads-menu-list')");
    expect(html).toContain("createElement('dads-menu-list-item')");
    expect(html).not.toContain('<header>');

    const tableControlDemoJs = readFileSync('dist-pages/src/demos/showcase-table-control.js', 'utf8');
    expect(tableControlDemoJs).not.toContain("import('/src/demos/");
    expect(tableControlDemoJs).toContain("import('./src/demos/");
  }, LONG_IO_TIMEOUT_MS);
});
