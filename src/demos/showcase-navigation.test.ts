import { describe, expect, it } from 'vitest';
import { demos } from './showcase-navigation.js';

describe('showcase-navigation (globalMenu demo)', () => {
  it('アクセシビリティ注釈セクションを含む', () => {
    const html = demos.globalMenu();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-global-menu"');
    expect(html).not.toContain('callout-lane="top"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / Controls'),
    );
  });

  it('nav 名の付与に aria-label を使用する作例を含む', () => {
    const html = demos.globalMenu();
    expect(html).toContain('<dads-global-menu data-api-target aria-label="グローバルナビゲーション">');
    expect(html).toContain('<code>aria-label</code>');
    expect(html).toContain('nav ランドマーク名');
  });

  it('a11y-annotate を読み込む', () => {
    const html = demos.globalMenu();
    expect(html).toContain("import('a11y-annotate')");
  });
});
