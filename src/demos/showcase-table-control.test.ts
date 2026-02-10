import { describe, expect, it } from 'vitest';
import { demos } from './showcase-table-control.js';

describe('showcase-table-control demo', () => {
  it('横幅を拡張し、状態切替UIをプレビュー枠外に配置する', () => {
    const html = demos.tableControl();

    expect(html).toContain('max-width: 1440px');
    expect(html).toContain('テーブル操作UIの作例をまとめています。');
    expect(html).not.toContain('Figmaノード');
    expect(html).toContain('申請管理テーブル 連動デモ');
    expect(html).toContain('class="table-control-demo__scenarios" role="group" aria-label="状態切替"');
    expect(html).toContain('size="x-small"');
    expect(html).toContain('#demo-table-control-header::part(popular)');
    expect(html).toContain('inline-size: 100%');
    expect(html).toContain('id="demo-table-control-root" class="table-control-demo__preview table-control-municipal-demo__root"');
    expect(html).toContain('--dads-search-box-gap: calc(8 / 16 * 1rem);');
    expect(html).toContain('--dads-search-box-border-radius: var(--border-radius-4, 0.25rem);');
    expect(html).toContain('--dads-search-box-border-width: 1px;');
    expect(html).toContain('--dads-search-box-control-min-height: calc(30 / 16 * 1rem);');
    expect(html).toContain('--dads-search-box-input-min-width: calc(312 / 16 * 1rem);');
    expect(html).toContain('--dads-search-box-input-padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);');
    expect(html).toContain('--dads-search-box-search-icon-size: calc(20 / 16 * 1rem);');
    expect(html).toContain('margin: 0 0 calc(48 / 16 * 1rem);');
    expect(html).not.toContain('border: 1px dashed #d1d5db;');

    const scenarioIndex = html.indexOf('class="table-control-demo__scenarios"');
    const rootIndex = html.indexOf('id="demo-table-control-root"');
    expect(scenarioIndex).toBeGreaterThan(-1);
    expect(rootIndex).toBeGreaterThan(-1);
    expect(scenarioIndex).toBeLessThan(rootIndex);
  });

  it('既存のdads-tableソート機能を利用するマークアップを含む', () => {
    const html = demos.tableControl();

    expect(html).toContain('<dads-table hover sort-behavior="dom">');
    expect(html).toContain('data-sort-type="date"');
    expect(html).toContain('<button type="button" data-sort>更新日</button>');
  });

  it('新規追加モーダルをdadsコンポーネントで構成する', () => {
    const html = demos.tableControl();

    expect(html).toContain('id="demo-table-control-create-open"');
    expect(html).toContain('id="demo-table-control-create-dialog"');
    expect(html).toContain('<dads-input-text');
    expect(html).toContain('id="demo-table-control-create-title"');
    expect(html).toContain('id="demo-table-control-create-department"');
    expect(html).toContain('id="demo-table-control-create-category"');
    expect(html).toContain('id="demo-table-control-create-status"');
    expect(html).toContain('id="demo-table-control-create-save"');
    expect(html).toContain('id="demo-table-control-create-cancel"');
  });

  it('自治体届出者の作例を同一ページ内に含む', () => {
    const html = demos.tableControl();

    expect(html).toContain('自治体届出者テーブル');
    expect(html).toContain('id="demo-table-control-municipal-root"');
    expect(html).toContain('data-table-control-municipal-scenario="before-search"');
    expect(html).toContain('data-table-control-municipal-scenario="after-search"');
    expect(html).toContain('data-table-control-municipal-scenario="empty-result"');
    expect(html).toContain('class="table-control-municipal-demo__scenarios" role="group" aria-label="状態切替"');
    expect(html).toContain('--dads-search-box-control-min-height: calc(30 / 16 * 1rem);');
    expect(html).not.toContain('table-control-municipal-demo__card');
  });

  it('申請者一覧の作例に検索プリセット・一括操作・編集UIを含む', () => {
    const html = demos.tableControl();

    expect(html).toContain('申請者一覧テーブル 検索プリセット');
    expect(html).toContain('よくある検索ワード、選択行の一括操作、行ごとの編集・削除をまとめて確認できる作例です。');
    expect(html).not.toContain('ノード 15765:24678');
    expect(html).toContain('id="demo-table-control-preset-root"');
    expect(html).toContain('id="demo-table-control-preset-root" class="table-control-preset-demo__root table-control-municipal-demo__root"');
    expect(html).toContain('id="demo-preset-presets"');
    expect(html).toContain('data-query="マイナンバーカード"');
    expect(html).toContain('data-query="パスポート"');
    expect(html).toContain('<dads-table id="demo-preset-table" selectable hover size="dense">');
    expect(html).toContain('id="demo-preset-bulk-bar"');
    expect(html).toContain('id="demo-preset-edit-dialog"');
    expect(html).toContain('id="demo-preset-delete-dialog"');
    expect(html).toContain('data-actions-col');
    expect(html).toContain('>操作<');
    expect(html).toContain('table-control-preset-demo__row-menu');
    expect(html).toContain('id="demo-preset-pagination"');
    expect(html).toContain('slot="page-navigation"');
    expect(html).not.toContain('slot="pagination"');
    expect(html).toContain('size="s"');
    expect(html).not.toContain('table-control-preset-demo__card');
  });

  it('3作例の共通ラッパーを左寄せにする', () => {
    const html = demos.tableControl();

    expect(html).toContain('id="demo-table-control-root" class="table-control-demo__preview table-control-municipal-demo__root"');
    expect(html).toContain('id="demo-table-control-municipal-root" class="table-control-municipal-demo__root"');
    expect(html).toContain('id="demo-table-control-preset-root" class="table-control-preset-demo__root table-control-municipal-demo__root"');

    expect(html).not.toContain('table-control-municipal-demo__root {\n          display: grid;\n          gap: 16px;\n          max-width');
    expect(html).not.toContain('table-control-municipal-demo__root {\n          display: grid;\n          gap: 16px;\n          inline-size: 100%;\n          margin: 0 auto;');
    expect(html).not.toContain('table-control-preset-demo__root {\n          display: grid;\n          gap: 16px;\n          max-width');
    expect(html).not.toContain('table-control-preset-demo__root {\n          display: grid;\n          gap: 16px;\n          inline-size: 100%;\n          margin: 0 auto;');
  });

  it('3作例から注釈ラップを外し、注釈専用セクションを持つ', () => {
    const html = demos.tableControl();

    expect(html).not.toContain('<a11y-annotate target-selector="dads-table-control">');
    expect(html).not.toContain('<a11y-annotate target-selector="#demo-table-control-municipal-root">');
    expect(html).not.toContain('<a11y-annotate target-selector="#demo-table-control-preset-root">');

    expect(html).toContain('アクセシビリティ注釈（Table Control Components）');
    expect(html).toContain('class="table-control-annotate-demo__root table-control-municipal-demo__root"');
    expect(html).toContain('class="table-control-annotate-demo__toggle"');
    expect(html).toContain('<a11y-annotate class="table-control-annotate-demo__annotate" target-selector="#demo-table-control-annotate-header">');
    expect(html).toContain('<a11y-annotate class="table-control-annotate-demo__annotate" target-selector="#demo-table-control-annotate-footer">');
    expect(html).toContain('id="demo-table-control-annotate-header"');
    expect(html).toContain('id="demo-table-control-annotate-footer"');
    expect(html).toContain('page-size-options="10,50,100,200,500"');
    expect(html).toContain('data-annotation-toggle');

    expect(html).not.toContain('table-control-annotate-demo__frame {\n          max-width: calc(936 / 16 * 1rem);');
    expect(html).not.toContain('table-control-annotate-demo__frame {\n          max-width: calc(936 / 16 * 1rem);\n          inline-size: 100%;\n          margin: 0 auto;');

    const annotateIndex = html.indexOf('アクセシビリティ注釈（Table Control Components）');
    const mvcIndex = html.indexOf('申請管理テーブル 連動デモ');
    expect(annotateIndex).toBeGreaterThan(-1);
    expect(mvcIndex).toBeGreaterThan(-1);
    expect(annotateIndex).toBeLessThan(mvcIndex);
  });

  it('必要なモジュールを読み込む', () => {
    const html = demos.tableControl();

    expect(html).toContain("import('dads-dialog')");
    expect(html).toContain("import('dads-input-text')");
    expect(html).toContain("import('dads-select')");
    expect(html).toContain("import('dads-search-box')");
    expect(html).toContain("import('dads-switch')");
    expect(html).toContain("import('dads-chip-label')");
    expect(html).toContain("import('dads-menu-list-box')");
    expect(html).toContain("import('dads-divider')");
    expect(html).toContain("import('dads-code-block')");
    expect(html).toContain('./src/demos/table-control-municipal-mvc.js');
    expect(html).toContain('mountTableControlMunicipalDemo');
    expect(html).toContain('./src/demos/table-control-preset-mvc.js');
    expect(html).toContain('mountTableControlPresetDemo');
    expect(html).not.toContain("import('/src/demos/");
  });
});
