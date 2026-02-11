import { describe, expect, it } from 'vitest';
import { demos } from './drawer.js';

describe('drawer demo', () => {
  it('冒頭にアクセシビリティ注釈セクションを含む', () => {
    const html = demos.drawer();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-drawer"');
    expect(html).toContain('callout-lane="side"');
    expect(html).toContain('drawer-demo__surface--annotate');
    expect(html).toContain('--dads-drawer-width: 46%');
    expect(html).toContain('--a11y-annotate-callout-lane-gap: 16px');
    expect(html).toContain('dads-drawer::part(base)');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / 操作'),
    );
  });

  it('実画面作例（showModal）セクションを含む', () => {
    const html = demos.drawer();
    expect(html).toContain('実画面作例（showModal）');
    expect(html).toContain('id="drawer-live-trigger"');
    expect(html).toContain('command="show-modal"');
    expect(html).toContain('id="drawer-live-target"');
  });

  it('モバイル全面展開作例セクションを含む', () => {
    const html = demos.drawer();
    expect(html).toContain('モバイル全面展開作例');
    expect(html).toContain('Mobile: Right Menu');
    expect(html).toContain('右タイプ（light-dismiss）');
    expect(html).toContain('<dads-device-mock class="drawer-demo__mobile-mock" device="mobile">');
    expect(html).toContain('id="drawer-mobile-trigger"');
    expect(html).toContain('id="drawer-mobile-target"');
    expect(html).toContain('commandfor="#drawer-mobile-target"');
    expect(html).toContain('command="show-modal"');
    expect(html).toContain('id="drawer-mobile-right-trigger"');
    expect(html).toContain('id="drawer-mobile-right-target"');
    expect(html).toContain('commandfor="#drawer-mobile-right-target"');
    expect(html).toContain('drawer-demo__mobile-trigger-layer drawer-demo__mobile-trigger-layer--right');
    expect(html).toContain('drawer-demo__mobile-drawer drawer-demo__mobile-drawer--fullscreen');
    expect(html).toContain('drawer-demo__mobile-drawer drawer-demo__mobile-drawer--right-type');
    expect(html).toContain('data-preview-contained');
    expect(html).toContain('placement="right"');
    expect(html).toContain('--dads-drawer-width: 100%');
    expect(html).toContain('--dads-drawer-max-width: 100%');
    expect(html).toContain('--dads-drawer-background: #fff');
    expect(html).toContain('close-label="閉じる"');
    expect(html).toContain('light-dismiss');
  });

  it('API / Controls の command-store バインドをプレビューコンテナに固定する', () => {
    const html = demos.drawer();
    expect(html).toContain('data-drawer-demo-root');
    expect(html).toContain("var demoRoot = apiPanel.querySelector('[data-drawer-demo-root]');");
    expect(html).toContain("demoRoot.setAttribute('data-drawer-api-command-store-bound', 'true');");
    expect(html).toContain('mod.defaultCommandStore.bind(demoRoot);');
  });

  it('モバイル作例の command-store バインドとトリガー同期処理を含む', () => {
    const html = demos.drawer();
    expect(html).toContain("var mobileRoot = hostRoot.querySelector('#drawer-mobile-root');");
    expect(html).toContain("mobileRoot.setAttribute('data-drawer-mobile-command-store-bound', 'true');");
    expect(html).toContain('mod.defaultCommandStore.bind(mobileRoot);');
    expect(html).toContain('var bindMobilePair = function(drawerId, triggerId, triggerLayerId) {');
    expect(html).toContain("bindMobilePair('drawer-mobile-target', 'drawer-mobile-trigger', 'drawer-mobile-trigger-layer');");
    expect(html).toContain("'drawer-mobile-right-target'");
    expect(html).toContain("'drawer-mobile-right-trigger'");
    expect(html).toContain("'drawer-mobile-right-trigger-layer'");
    expect(html).toContain("import('dads-device-mock')");
  });

  it('実画面作例の drawer には data-preview-contained を付与しない', () => {
    const html = demos.drawer();
    expect(html).toContain('<dads-drawer id="drawer-live-target" placement="left" close-label="閉じる">');
    expect(html).not.toContain('<dads-drawer id="drawer-live-target" data-preview-contained');
  });
});
