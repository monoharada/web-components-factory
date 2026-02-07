import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { contentTypesetStylesText } from '../packages/styles/content-typeset.ts';
import { createPage, getPattern, listPatterns } from '../scripts/wcf/core.js';

async function mkdtemp() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'wcf-page-'));
}

describe('wcf page create', () => {
  const normalizeTypesetStyle = (cssText: string): string =>
    cssText
      .split('\n')
      .map(line => line.trimEnd())
      .filter(line => line.length > 0)
      .join('\n');

  const readEmbeddedTypesetStyle = (html: string): string => {
    const match = html.match(/<style data-wcf-typeset>\n([\s\S]*?)\n\s*<\/style>/);
    if (!match) return '';
    return normalizeTypesetStyle(match[1].replace(/^ {4}/gm, ''));
  };

  it('creates index.html for boot entry with tag importmap', async () => {
    const tmp = await mkdtemp();
    try {
      const res = await createPage({
        prefix: 'myui',
        pattern: 'search-results',
        dir: tmp,
        entry: 'boot',
      });

      const text = await fs.readFile(res.file, 'utf8');
      expect(text).toContain('<style data-wcf-typeset>');
      expect(text).toContain('@layer reset, tokens, base, layout, components, contents, page;');
      expect(text).toContain('@layer contents');
      expect(text).toContain('--dads-typeset-heading-margin-top-normal: 1lh;');
      expect(text).toContain('--dads-typeset-heading-margin-top-compact: 1em;');
      expect(readEmbeddedTypesetStyle(text)).toBe(normalizeTypesetStyle(contentTypesetStylesText));
      expect(text).toContain('<script type="importmap">');
      expect(text).toContain('"myui-search-box": "./vendor/components/myui/components/search-box.js"');
      expect(text).toContain("import './vendor/components/myui/boot.js';");
      expect(text).toContain('<main data-dads-typeset>');
      expect(text).toContain('<myui-search-box');
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('creates index.html for @wcf entry with @wcf importmap', async () => {
    const tmp = await mkdtemp();
    try {
      const res = await createPage({
        prefix: 'myui',
        pattern: 'search-form',
        dir: tmp,
        entry: '@wcf',
      });

      const text = await fs.readFile(res.file, 'utf8');
      expect(text).toContain('"@wcf": "./vendor/components/myui/index.js"');
      expect(text).toContain("import '@wcf';");
      expect(text).toContain('<main data-dads-typeset>');
      expect(res.warnings).toContain(
        'W_ENTRY_DEPRECATED: --entry @wcf is deprecated in release N and will be removed in N+1. Use --entry boot.',
      );
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('creates index.html for index entry with deprecation warning', async () => {
    const tmp = await mkdtemp();
    try {
      const res = await createPage({
        prefix: 'myui',
        pattern: 'search-form',
        dir: tmp,
        entry: 'index',
      });

      const text = await fs.readFile(res.file, 'utf8');
      expect(text).toContain("import './vendor/components/myui/index.js';");
      expect(res.warnings).toContain(
        'W_ENTRY_DEPRECATED: --entry index is deprecated in release N and will be removed in N+1. Use --entry boot.',
      );
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});

describe('wcf patterns metadata', () => {
  it('lists v1 patterns with contract metadata', async () => {
    const patterns = await listPatterns();
    const ids = patterns.map((x) => x.name);
    expect(ids).toContain('search-results');
    expect(ids).toContain('application-form-single-validation');
    expect(ids).toContain('application-form-step-validation');
  });

  it('returns pattern detail with entry hints and required components', async () => {
    const detail = await getPattern('application-form-step-validation');
    expect(detail.contractVersion).toBe('1.0');
    expect(detail.entryHints).toContain('boot');
    expect(detail.requiredComponents).toContain('step-navigation');
    expect(detail.sampleHtml).toContain('<dads-step-navigation');
  });
});
