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

describe('showcase-navigation (utilityLink demo)', () => {
  it('アクセシビリティ注釈セクションを含む', () => {
    const html = demos.utilityLink();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-utility-link"');
  });

  it('dads-utility-link を読み込む', () => {
    const html = demos.utilityLink();
    expect(html).toContain("import('dads-utility-link')");
  });

  it('APIテーブルに主要属性を含む', () => {
    const html = demos.utilityLink();
    expect(html).toContain('<code>href</code>');
    expect(html).toContain('<code>target</code>');
    expect(html).toContain('<code>rel</code>');
    expect(html).toContain('<code>download</code>');
  });

  it('lead-icon の表示切替は hidden 属性で制御する', () => {
    const html = demos.utilityLink();
    expect(html).toContain('data-api-target-selector="[data-utility-link-lead-icon]"');
    expect(html).toContain('data-api-attr="hidden"');
  });
});
