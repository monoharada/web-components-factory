import { describe, expect, it } from 'vitest';
import { demos } from './hamburger-menu-button.js';

describe('hamburger-menu-button demo', () => {
  it('冒頭にアクセシビリティ注釈セクションを含む', () => {
    const html = demos.hamburgerMenuButton();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-hamburger-menu-button"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / Controls（Storybook風）'),
    );
  });

  it('実画面作例（showModal）セクションを含む', () => {
    const html = demos.hamburgerMenuButton();
    expect(html).toContain('実画面作例（showModal）');
    expect(html).toContain('id="hamburger-live-standard-trigger"');
    expect(html).toContain('id="hamburger-live-icon-trigger"');
    expect(html).toContain('id="hamburger-live-standard-drawer"');
    expect(html).toContain('id="hamburger-live-icon-drawer"');
  });

  it('実画面作例の drawer には data-preview-contained を付与しない', () => {
    const html = demos.hamburgerMenuButton();
    expect(html).toContain(
      '<dads-drawer id="hamburger-live-standard-drawer" placement="left" close-label="閉じる">',
    );
    expect(html).toContain(
      '<dads-drawer id="hamburger-live-icon-drawer" placement="right" close-label="閉じる">',
    );
    expect(html).not.toContain('<dads-drawer id="hamburger-live-standard-drawer" data-preview-contained');
    expect(html).not.toContain('<dads-drawer id="hamburger-live-icon-drawer" data-preview-contained');
  });

  it('API / Controls は preview root 単位で command-store を bind する', () => {
    const html = demos.hamburgerMenuButton();
    expect(html).toContain("var demoRoot = apiPanel.querySelector('[data-hamburger-demo-root]');");
    expect(html).toContain('mod.defaultCommandStore.bind(demoRoot);');
  });

  it('API / Controls の同一 drawer トリガーを全件同期する', () => {
    const html = demos.hamburgerMenuButton();
    expect(html).toContain('dads-hamburger-menu-button[commandfor="#hamburger-demo-drawer"]');
    expect(html).toContain('var syncTriggers = function(isOpen) {');
    expect(html).toContain('syncTriggers(true);');
    expect(html).toContain('syncTriggers(false);');
  });
});
