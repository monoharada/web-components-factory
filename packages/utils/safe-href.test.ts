import { describe, expect, it } from 'vitest';
import { isSafeHref } from './safe-href';

describe('safe-href', () => {
  it('許可する href を true にする', () => {
    const validHrefs = [
      '#',
      '/path',
      './relative',
      '../parent',
      'https://example.com',
      ' https://example.com ',
      'http://example.com',
      'mailto:hello@example.com',
      'tel:+81-90-0000-0000',
    ];

    for (const href of validHrefs) {
      expect(isSafeHref(href)).toBe(true);
    }
  });

  it('拒否する href を false にする', () => {
    const invalidHrefs = [
      'javascript:alert(1)',
      'data:text/html;base64,PHNjcmlwdA==',
      'ftp://example.com',
      '?q=1',
      'docs/page',
      'page.html',
      '',
      '   ',
    ];

    for (const href of invalidHrefs) {
      expect(isSafeHref(href)).toBe(false);
    }
  });
});
