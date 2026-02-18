import { describe, it, expect } from 'vitest';
import { demos } from './showcase-components.js';

describe('showcase-components (chipTag demo)', () => {
  it('lead-icon 同期スクリプトは module ではなく通常 script を使う', () => {
    const html = demos.chipTag();
    expect(html).not.toContain('<script type="module">');
  });

  it('チップタグ作例に宛先と2件のラベルが含まれる', () => {
    const html = demos.chipTag();
    const expectedLabels = ['宛先', 'CC', 'デジ田 太郎', 'デジ濱 実', 'デジ山 ひかり'];
    for (const label of expectedLabels) {
      expect(html).toContain(label);
    }
  });

  it('Events テーブルに chip-tag のイベントが含まれる', () => {
    const html = demos.chipTag();
    expect(html).toContain('dads-chip-tag-remove');
    expect(html).toContain('dads-chip-tag-click');
  });

  it('commandfor 作例が含まれる', () => {
    const html = demos.chipTag();
    expect(html).toContain('メールアプリの宛先欄（作例）');
    expect(html).toContain('command="clear-recipients"');
    expect(html).toContain('commandfor="#mail-to-row"');
    expect(html).toContain('commandfor="#mail-cc-row"');
  });
});

describe('showcase-components (divider demo)', () => {
  it('vertical 用のプレビュー文脈切替フックを含む', () => {
    const html = demos.divider();
    expect(html).toContain('data-divider-api-panel');
    expect(html).toContain('data-divider-preview');
    expect(html).toContain('data-divider-before');
    expect(html).toContain('data-divider-after');
    expect(html).toContain('左コンテンツ');
    expect(html).toContain('右コンテンツ');
    expect(html).toContain("divider.getAttribute('orientation') === 'vertical'");
  });

  it('divider の CSS vars に margin-inline を含む', () => {
    const html = demos.divider();
    expect(html).toContain('data-api-css-var="--dads-divider-margin"');
    expect(html).toContain('区切り余白（shorthand・推奨）');
    expect(html).toContain('data-api-css-var="--dads-divider-margin-vertical"');
    expect(html).toContain('vertical 専用上書き（必要時のみ）');
    expect(html).toContain('data-api-css-var="--dads-divider-margin-inline"');
    expect(html).toContain('左右余白（主に vertical）');
    expect(html).toContain('上下余白（主に horizontal）');
  });
});

describe('showcase-components (button demo)', () => {
  it('Props / Attrs テーブルに icon-start / icon-end の slot 行を含む', () => {
    const html = demos.button();
    expect(html).toContain('<th scope="row"><code>icon-start</code></th>');
    expect(html).toContain('<th scope="row"><code>icon-end</code></th>');
    expect(html).toContain('先頭（リード）アイコン');
    expect(html).toContain('末尾（テール）アイコン');
    expect(html).toContain('data-button-icon-start');
    expect(html).toContain('data-button-icon-end');
    expect(html).toContain('aria-label="icon-start"');
    expect(html).toContain('aria-label="icon-end"');
    expect(html).toContain('<option value="none" selected>none</option>');
    expect(html).toContain('<option value="dummy">dummy</option>');
    expect(html).toContain('<option value="login">login</option>');
    expect(html).toContain('<option value="logout">logout</option>');
    expect(html).toContain('<option value="settings">settings</option>');
  });

  it('Material Symbols のアイコン作例は全てラベル付きで配置する', () => {
    const html = demos.button();
    expect(html).toContain('アイコン付き（Material Symbols）');
    expect(html).toContain('ログイン');
    expect(html).toContain('ログアウト');
    expect(html).toContain('設定');
    expect(html).toContain('<svg slot="icon-start" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">');
    expect(html).toContain('<path d="M10.825 22Q10.35 22');
  });

  it('API controls の同期スクリプトは icon の表示・path更新・reset同期を行う', () => {
    const html = demos.button();
    expect(html).toContain("var startSelect = root.querySelector('[data-button-icon-start]');");
    expect(html).toContain("var endSelect = root.querySelector('[data-button-icon-end]');");
    expect(html).toContain("var value = String(select.value || 'none');");
    expect(html).toContain("icon.setAttribute('hidden', '');");
    expect(html).toContain("path.setAttribute('d', nextPath);");
    expect(html).toContain("icon.removeAttribute('hidden');");
    expect(html).toContain("startSelect.addEventListener('change', syncAll);");
    expect(html).toContain("endSelect.addEventListener('change', syncAll);");
    expect(html).toContain("startSelect.value = startSelect.getAttribute('data-default') || 'none';");
    expect(html).toContain("endSelect.value = endSelect.getAttribute('data-default') || 'none';");
    expect(html).toContain('syncAll();');
  });
});

describe('showcase-components (card demo)', () => {
  it('画像はローカルアセットのみを参照する', () => {
    const html = demos.card();
    expect(html).toContain('./resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/card-3-1.png');
    expect(html).toContain('./resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/card-3-2.png');
    expect(html).toContain('./resources/dads/components/card/local/card-5-hero-960x640.jpg');
    expect(html).not.toContain('https://images.unsplash.com/');
    expect(html).not.toContain('https://design.digital.go.jp/dads/html/assets/');
  });
});

describe('showcase-components (descriptionList demo)', () => {
  it('説明リストデモに marker 切り替え UI が含まれる', () => {
    const html = demos.descriptionList();
    expect(html).toContain('<dads-description-list');
    expect(html).toContain('data-api-attr="marker"');
    expect(html).toContain('value="none"');
    expect(html).toContain('value="bullet"');
    expect(html).toContain('value="custom"');
  });

  it('説明リストデモに Usage コードブロックが含まれる', () => {
    const html = demos.descriptionList();
    expect(html).toContain('<dads-code-block data-api-code>');
    expect(html).toContain('<dads-description-list marker="none">');
    expect(html).toContain('<dads-description-list marker="bullet">');
    expect(html).toContain('<dads-description-list marker="custom">');
  });

  it('data-marker 互換属性の作例が含まれる', () => {
    const html = demos.descriptionList();
    expect(html).toContain('data-api-attr="data-marker"');
    expect(html).toContain('<dads-description-list data-marker="bullet">');
    expect(html).toContain('DADS HTML 互換属性（marker と同期）');
  });
});

describe('showcase-components (resourceList demo)', () => {
  it('冒頭にアクセシビリティ注釈セクションを含み、リンク版とフォームコントロール版を表示する', () => {
    const html = demos.resourceList();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    const annotateCount = html.match(/target-selector="dads-resource-list"/g)?.length ?? 0;
    expect(annotateCount).toBeGreaterThanOrEqual(2);
    expect(html).toContain('リンク版');
    expect(html).toContain('フォームコントロール版');
    expect(html).toContain('aria-labelledby="resource-list-annotate-control-title resource-list-annotate-control-support"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / 操作')
    );
    expect(html.indexOf('API / 操作')).toBeLessThan(
      html.indexOf('Figma作例（12692:1434）')
    );
  });

  it('Props / Attrs に主要属性のコントロールを含む', () => {
    const html = demos.resourceList();
    expect(html).toContain('data-api-attr="data-style"');
    expect(html).toContain('data-api-attr="data-interaction"');
    expect(html).toContain('data-resource-list-control-kind');
    expect(html).toContain('data-resource-list-control-checked');
    expect(html).toContain('data-resource-list-control-disabled');
    expect(html).toContain('data-api-attr="href"');
    expect(html).toContain('data-api-attr="target"');
    expect(html).toContain('data-api-attr="rel"');
    expect(html).toContain('data-api-attr="download"');
  });

  it('Figma作例8カテゴリを含む', () => {
    const html = demos.resourceList();
    const exampleTitles = [
      '受診記録一覧',
      '給与明細一覧',
      'アカウント一覧',
      '支払い方法選択',
      '会議室選択',
      'ユーザー選択',
      '検索結果一覧',
      'お知らせ一覧',
    ];
    for (const title of exampleTitles) {
      expect(html).toContain(title);
    }
  });

  it('Figma作例レイアウトは1カラムで表示される', () => {
    const html = demos.resourceList();
    expect(html).toContain('grid-template-columns: minmax(0, 1fr);');
    expect(html).not.toContain('repeat(auto-fit, minmax(min(100%, 30rem), 1fr))');
    expect(html).not.toContain('repeat(auto-fit, minmax(min(100%, 48rem), 1fr))');
  });

  it('作例間に余白なしの dashed divider が挿入される', () => {
    const html = demos.resourceList();
    expect(html).toContain('resource-list-example-divider');
    expect(html).toContain('data-style="dashed"');
    expect(html).toContain('--dads-divider-margin: 0;');
    expect(html).toContain('--dads-divider-margin-inline: 0;');
    expect(html).toContain('--dads-divider-margin-block: 0;');
    const dividerCount = html.match(/resource-list-example-divider/g)?.length ?? 0;
    expect(dividerCount).toBeGreaterThanOrEqual(7);
  });

  it('給与明細は角丸なし、アカウント一覧は三点メニューを表示する', () => {
    const html = demos.resourceList();
    expect(html).toContain('resource-list-figma-item--payroll');
    expect(html).toContain('--dads-resource-list-border-radius: 0;');
    expect(html).toContain('resource-list-account-menu');
    expect(html).toContain('resource-list-room-menu-1');
    expect(html).toContain('会議室Aのサブアクション');
    expect(html).toContain('デジ田 太郎のアカウント操作を開く');
    expect(html).toContain(".resource-list-figma-item--account::part(base)");
    expect(html).toContain('inline-size: var(--dads-resource-list-action-width);');
    expect(html).toContain('inset-inline-start: calc(100% + 4px);');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('role="menuitem"');
  });

  it('Usage と CSS vars の主要項目を含む', () => {
    const html = demos.resourceList();
    expect(html).toContain('<dads-resource-list data-style="list" data-interaction="whole" href="/example">');
    expect(html).toContain('<dads-resource-list data-style="frame" data-interaction="whole">');
    expect(html).toContain('<dads-checkbox slot="control" checked aria-labelledby="resource-list-user-title resource-list-user-support"></dads-checkbox>');
    expect(html).toContain('<dads-radio slot="control" name="payment-method" checked aria-labelledby="resource-list-payment-title resource-list-payment-support"></dads-radio>');
    expect(html).toContain('data-api-css-var="--dads-resource-list-background"');
    expect(html).toContain('data-api-css-var="--dads-resource-list-border-color"');
    expect(html).toContain('data-api-css-var="--dads-resource-list-title-link-color"');
    expect(html).toContain('data-api-css-var="--dads-resource-list-action-width"');
  });

  it('作例の checkbox/radio は見出し領域を aria-labelledby で関連付ける', () => {
    const html = demos.resourceList();
    expect(html).toContain('aria-labelledby="resource-list-section-4-row-1-title resource-list-section-4-row-1-support"');
    expect(html).toContain('aria-labelledby="resource-list-section-6-row-1-title resource-list-section-6-row-1-support"');
  });

  it('API パネルに control slot 切り替え同期スクリプトを含む', () => {
    const html = demos.resourceList();
    expect(html).toContain('data-resource-list-api-preview');
    expect(html).toContain('data-resource-list-demo-control');
    expect(html).toContain('createDemoControl');
    expect(html).toContain('applyDefaults');
    expect(html).toContain("'dads-switch'");
  });

  it('旧比較系セクションを含まない', () => {
    const html = demos.resourceList();
    expect(html).not.toContain('Figma再現（状態比較）');
    expect(html).not.toContain('三点リーダー（action）状態比較');
    expect(html).not.toContain('data-demo-action-state=');
  });
});

describe('showcase-components (notificationBanner demo)', () => {
  it('冒頭にアクセシビリティ注釈セクションを含む', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-notification-banner"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / 操作')
    );
  });

  it('モバイル作例セクションを含めない', () => {
    const html = demos.notificationBanner();
    expect(html).not.toContain('モバイル作例');
    expect(html).not.toContain('repeat(auto-fit, minmax(280px, 1fr))');
  });

  it('Desktop作例は standard / color-chip を保持する', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('Standard（Desktop）');
    expect(html).toContain('Color Chip（Desktop）');
  });

  it('背景色作例と特定コンテンツ付随作例を含む', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('背景色を使用した作例');
    expect(html).toContain('特定のコンテンツに付随する場合の作例');
    expect(html).toContain('--dads-notification-banner-background');
    expect(html).toContain('var(--color-primitive-green-50');
    expect(html).toContain('var(--color-primitive-red-50');
    expect(html).toContain('var(--color-primitive-yellow-50');
    expect(html).toContain('var(--color-primitive-blue-50');
    expect(html).toContain('var(--color-neutral-solid-gray-50');
    expect(html).toContain('data-background-demo-type');
    expect(html).toContain('<dads-select');
    expect(html).toContain('label="背景色プリセット"');
    expect(html).toContain('label="タイプ"');
    expect(html).toContain('>サクセス<');
    expect(html).toContain('>警告<');
    const backgroundBannerCount =
      html.match(/<dads-notification-banner[^>]*data-background-demo-banner/g)?.length ?? 0;
    expect(backgroundBannerCount).toBe(2);
  });

  it('特定コンテンツ付随作例は単一パネル内で切り替える操作フックを含む', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('data-attached-before-banner');
    expect(html).toContain('data-attached-after-banner');
    expect(html).toContain('data-attached-ack');
    expect(html).toContain('activateAfterState');
    expect(html).toContain('data-attached-demo-panel="single"');
    expect(html).not.toContain('data-attached-demo-panel="after"');
    expect(html).toContain('data-attached-after-banner data-mobile-demo type="warning" variant="standard" hidden');
    expect(html).toContain('max-width: 360px; width: 100%;');
    const mobileDemoCount = html.match(/data-mobile-demo/g)?.length ?? 0;
    expect(mobileDemoCount).toBeGreaterThanOrEqual(2);
    expect(html).toContain('作例を初期状態に戻す');
  });

  it('type変更時に表示文言を同期するためのフックを含む', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('data-api-copy="title"');
    expect(html).toContain('data-api-copy="description"');
    expect(html).toContain('syncCopyByType');
    expect(html).toContain('<dads-select label="type"');
    expect(html).toContain('<dads-select label="dismiss-mode"');
    expect(html).toContain('data-api-attr="type"');
    expect(html).toContain('data-api-attr="dismiss-mode"');
    expect(html).toContain('<code>actions-layout</code>');
    expect(html).toContain('vertical（垂直）');
    expect(html).toContain('horizontal（水平）');
    expect(html).toContain('actions-layout="horizontal"');
    expect(html).toContain('data-default="horizontal"');
    expect(html).not.toContain('<select ');
  });

  it('dismiss-mode のAPI説明は保持する', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('<code>dismiss-mode</code>');
    expect(html).toContain("'hide' | 'collapse'");
  });
});

describe('showcase-components (emergencyBanner demo)', () => {
  it('アクセシビリティ注釈セクションを含む', () => {
    const html = demos.emergencyBanner();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-emergency-banner"');
    expect(html).toContain('callout-lane="top"');
    expect(html).toContain('--a11y-annotate-callout-gutter: clamp(8rem, 22vw, 20rem);');
    expect(html).toContain('--a11y-annotate-callout-lane-offset: 168px;');
    expect(html).toContain('padding: 96px 160px;');
    expect(html).toContain('max-width: 1240px;');
  });

  it('UsageコードとAPI属性コントロールを含む', () => {
    const html = demos.emergencyBanner();
    expect(html).toContain('<dads-code-block data-api-code>');
    expect(html).toContain('<dads-emergency-banner href="https://example.com/evacuation" target="_blank">');
    expect(html).toContain('data-api-attr="heading-level"');
    expect(html).toContain('data-api-attr="prefix-mode"');
    expect(html).toContain('data-api-attr="prefix-label"');
    expect(html).toContain('data-api-attr="href"');
    expect(html).toContain('data-api-attr="target"');
    expect(html).toContain('data-api-attr="rel"');
  });

  it('APIテーブルは属性デフォルト値を正しく示す', () => {
    const html = demos.emergencyBanner();
    expect(html).toContain("<td><code>_self</code></td>");
    expect(html).toContain('data-api-attr="target" data-default="_self"');
    expect(html).toContain("<td><code>''（空）</code></td>");
    expect(html).toContain('data-api-attr="rel" data-default=""');
  });

  it('Slots / CSS Parts / Events テーブルを含む', () => {
    const html = demos.emergencyBanner();
    expect(html).toContain('<h4 class="wc-api-panel__section-title">Slots</h4>');
    expect(html).toContain('<code>slot="heading"</code>');
    expect(html).toContain('<code>slot="action"</code>');
    expect(html).toContain('<h4 class="wc-api-panel__section-title">CSS Parts</h4>');
    expect(html).toContain('<code>action-link</code>');
    expect(html).toContain('<code>action-icon</code>');
    expect(html).toContain('<h4 class="wc-api-panel__section-title">Events</h4>');
    expect(html).toContain('なし（独自イベントなし）');
  });

  it('主要CSS変数コントロールを含む', () => {
    const html = demos.emergencyBanner();
    expect(html).toContain('--dads-emergency-banner-border-color');
    expect(html).toContain('--dads-emergency-banner-background');
    expect(html).toContain('--dads-emergency-banner-color');
    expect(html).toContain('--dads-emergency-banner-heading-color');
    expect(html).toContain('--dads-emergency-banner-action-background');
    expect(html).toContain('--dads-emergency-banner-action-background-hover');
    expect(html).toContain('--dads-emergency-banner-action-color');
    expect(html).toContain('--dads-emergency-banner-action-border-radius');
  });
});
