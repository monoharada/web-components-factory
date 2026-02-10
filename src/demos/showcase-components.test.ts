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

describe('showcase-components (notificationBanner demo)', () => {
  it('冒頭にアクセシビリティ注釈セクションを含む', () => {
    const html = demos.notificationBanner();
    expect(html).toContain('アクセシビリティ注釈（a11y-annotate）');
    expect(html).toContain('target-selector="dads-notification-banner"');
    expect(html.indexOf('アクセシビリティ注釈（a11y-annotate）')).toBeLessThan(
      html.indexOf('API / Controls（Storybook風）')
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
