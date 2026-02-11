import { describe, expect, it } from 'vitest';
import { demos } from './layout-shell.js';

describe('layout-shell demo', () => {
  it('レイアウトシェル見出しと6パターン作例を含む', () => {
    const html = demos.layoutShell();

    expect(html).toContain('レイアウトシェル');
    expect(html).toContain('data-layout-example="website"');
    expect(html).toContain('data-layout-example="app-shell"');
    expect(html).toContain('data-layout-example="master-detail"');
    expect(html).toContain('data-layout-example="left-header-pane"');
    expect(html).toContain('data-layout-example="three-pane"');
    expect(html).toContain('data-layout-example="three-pane-shell"');
    expect(html).toContain('pattern="website" mode="auto"');
    expect(html).toContain('pattern="app-shell" mode="auto"');
    expect(html).toContain('pattern="master-detail" mode="auto"');
    const leftHeaderSection = html.split('data-layout-example="left-header-pane"')[1] ?? '';
    expect(leftHeaderSection).toContain('ヘッダー（左ペイン）');
    expect(leftHeaderSection).toContain('pattern="left-header-pane" mode="auto"');
    expect(leftHeaderSection).toContain('slot="footer" class="layout-shell-slot" data-slot="footer"');
    const threePaneSection = html.split('data-layout-example="three-pane"')[1] ?? '';
    expect(threePaneSection).toContain('pattern="three-pane" mode="auto"');
    expect(threePaneSection).toContain('サイドバー');
    expect(threePaneSection).toContain('slot="aside"');
    expect(threePaneSection).toContain('補助領域');
    const threePaneShellSection = html.split('data-layout-example="three-pane-shell"')[1] ?? '';
    expect(threePaneShellSection).toContain('pattern="three-pane-shell" mode="auto"');
    expect(threePaneShellSection).toContain('ヘッダー');
    expect(threePaneShellSection).toContain('フッター');
    expect(html).toContain('dads-device-mock');
    expect(html).toContain('device="desktop"');
    const previewCount = html.match(/class="layout-shell-preview" data-layout-shell-preview/g)?.length ?? 0;
    expect(previewCount).toBe(7);
    expect(html).toContain('data-layout-shell-preview-range');
    expect(html).toContain('data-layout-shell-preview-value');
    expect(html).toContain('data-layout-shell-preview-preset="1454"');
    expect(html).toContain('data-layout-shell-preview-device="mobile"');
    expect(html).not.toContain('visible-height=');
  });

  it('API / Controls は pattern / mobile-sidebar を扱い、mode 制御は持たない', () => {
    const html = demos.layoutShell();

    expect(html).toContain('data-api-attr="pattern"');
    expect(html).toContain('data-api-attr="mobile-sidebar"');
    expect(html).not.toContain('data-api-attr="mode"');
    expect(html).not.toContain('aria-label="mode"');
    expect(html).toContain('value="website"');
    expect(html).toContain('value="app-shell"');
    expect(html).toContain('value="master-detail"');
    expect(html).toContain('value="left-header-pane"');
    expect(html).toContain('value="three-pane"');
    expect(html).toContain('value="three-pane-shell"');
    expect(html).toContain('value="bottom"');
    expect(html).toContain('value="top"');
    expect(html).toContain('value="hidden"');
    expect(html).toContain('data-default="bottom"');
    expect(html).toContain('<dads-layout-shell pattern="app-shell" mode="auto" mobile-sidebar="bottom" data-dads-typeset>');
  });

  it('CSS vars は基本値 + mobile倍率 + 詳細上書きを表示する', () => {
    const html = demos.layoutShell();

    expect(html).toContain('--dads-layout-shell-space');
    expect(html).toContain('--dads-layout-shell-pane-width');
    expect(html).toContain('--dads-layout-shell-main-max-width');
    expect(html).toContain('--dads-layout-shell-mobile-space-scale');
    expect(html).toContain('詳細上書き（既存6項目 + mobile倍率）');
    expect(html).toContain('--dads-layout-shell-inline-padding');
    expect(html).toContain('--dads-layout-shell-block-gap');
    expect(html).toContain('--dads-layout-shell-sidebar-width');
    expect(html).toContain('--dads-layout-shell-sidebar-rail-width');
    expect(html).toContain('--dads-layout-shell-aside-width');
    expect(html).toContain('mobileは <code>space × mobile-space-scale</code> で自動連動します。');
  });

  it('必要なレイアウト関連コンポーネントを preload する', () => {
    const html = demos.layoutShell();

    expect(html).toContain("import('dads-layout-shell')");
    expect(html).toContain("import('dads-layout-sidebar')");
    expect(html).toContain("import('dads-layout-aside')");
    expect(html).toContain("import('dads-device-mock')");
  });

  it('デバイスボタンと幅調整スクリプトを含む', () => {
    const html = demos.layoutShell();

    expect(html).toContain('window.__dadsLayoutShellInitPreviewControls');
    expect(html).toContain("preview.querySelector('[data-layout-shell-preview-range]')");
    expect(html).toContain("preview.querySelectorAll('[data-layout-shell-preview-preset]')");
    expect(html).toContain("setAttribute('data-layout-shell-preview-width'");
    expect(html).toContain("setAttribute('device', device)");
    expect(html).toContain("setAttribute('mode', device)");
  });

  it('スケルトン表現や点線装飾を含まない', () => {
    const html = demos.layoutShell();

    expect(html).not.toContain('layout-shell-skeleton');
    expect(html).not.toContain('dashed');
    expect(html).not.toContain('animation:');
  });

  it('mode はデバイスボタン/幅調整で内部同期し、APIテーブルには表示しない', () => {
    const html = demos.layoutShell();

    expect(html).not.toContain('data-api-attr="mode"');
    expect(html).toContain("shells[k].setAttribute('mode', device)");
  });
});
