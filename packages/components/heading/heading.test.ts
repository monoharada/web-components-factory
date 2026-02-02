/**
 * DadsHeadingコンポーネント テスト
 */

import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  renderWebComponent,
  cleanup,
  getShadowElement,
  waitForComponent,
} from '../../../test/utils/test-helpers';

// ========== 基本レンダリング ==========
describe('DadsHeading - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading>見出し</dads-heading>');

    await waitForComponent('dads-heading');
    expect(component).toBeInTheDocument();
  });

  it('デフォルトでrole="heading"とaria-level="2"が設定される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading>見出し</dads-heading>');

    await waitForComponent('dads-heading');
    expect(component.getAttribute('role')).toBe('heading');
    expect(component.getAttribute('aria-level')).toBe('2');
  });

  it('デフォルトでsize="36"が設定される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading>見出し</dads-heading>');

    await waitForComponent('dads-heading');
    expect(component.getAttribute('size')).toBe('36');
  });
});

// ========== 属性反映 ==========
describe('DadsHeading - 属性反映', () => {
  afterEach(() => {
    cleanup();
  });

  it('level="h3"でaria-levelが3になる', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading level="h3">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    expect(component.getAttribute('aria-level')).toBe('3');
  });

  it('無効なlevelはデフォルトにフォールバックする', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading level="h9">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    expect(component.getAttribute('aria-level')).toBe('2');
    expect(component.getAttribute('level')).toBe('2');
  });

  it('shoulder slot があると data-has-shoulder が付与される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent(
      '<dads-heading><span slot="shoulder">肩</span>見出し</dads-heading>'
    );

    await waitForComponent('dads-heading');
    await waitFor(() => {
      expect(component.hasAttribute('data-has-shoulder')).toBe(true);
    });
  });

  it('icon slot があると data-has-icon が付与される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent(
      '<dads-heading><span slot="icon">★</span>見出し</dads-heading>'
    );

    await waitForComponent('dads-heading');
    await waitFor(() => {
      expect(component.hasAttribute('data-has-icon')).toBe(true);
    });
  });

  it('chip 属性があると data-has-chip が付与される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading chip>見出し</dads-heading>');

    await waitForComponent('dads-heading');
    await waitFor(() => {
      expect(component.hasAttribute('data-has-chip')).toBe(true);
    });
  });

  it('slot/attr がない場合は data-has-* が付与されない', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading>見出し</dads-heading>');

    await waitForComponent('dads-heading');
    await waitFor(() => {
      expect(component.hasAttribute('data-has-chip')).toBe(false);
      expect(component.hasAttribute('data-has-shoulder')).toBe(false);
      expect(component.hasAttribute('data-has-icon')).toBe(false);
    });
  });
});

// ========== スタイル ==========
describe('DadsHeading - スタイル', () => {
  afterEach(() => {
    cleanup();
  });

  it('size="45"のアイコンがDADS準拠（相対単位）で定義される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent(
      '<dads-heading size="45"><span slot="icon">★</span>見出し</dads-heading>'
    );

    await waitForComponent('dads-heading');
    expect(component.getAttribute('size')).toBe('45');

    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    // size 別の再代入（グローバルトークンを代入）
    expect(sheetText).toContain(":host([size='45'])");
    expect(sheetText).toContain('--heading-font-size: var(--font-size-45);');

    // icon は DADS HTML 実装（相対単位）を踏襲
    expect(sheetText).toContain('--heading-icon-size: 1.25em;');
    expect(sheetText).toContain('--heading-icon-vertical-align: -0.19em;');
    // vertical-align は wrapper に適用して baseline 揃えを安定させる
    expect(sheetText).toContain("[part='icon'] {");
    expect(sheetText).toContain('vertical-align: var(--dads-heading-icon-vertical-align);');
  });

  it('chip の余白は spacing トークンで定義され、サイズ別に再代入される（小数pxは丸め）', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading chip size="45">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    // 小数pxは丸めて、グローバルトークン（spacing）を代入する
    expect(sheetText).toContain('--heading-chip-width: var(--spacing-4);');
    expect(sheetText).toContain('--heading-chip-padding-inline: var(--spacing-10);');
  });

  it('chip の幅はトークン増殖せず、size属性で spacing トークンを再代入する', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading chip size="45">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    // suffix付きトークンを増やさず、ベース変数へ代入する
    expect(sheetText).toContain('--dads-heading-chip-width: var(--heading-chip-width);');
    expect(sheetText).toContain(":host([size='45'])");
    expect(sheetText).toContain('--heading-chip-width: var(--spacing-4);');
  });

  it('chipの高さはtop/bottomで制御され、見出しサイズに追従して伸縮する', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading chip size="45">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain('bottom: var(--dads-heading-chip-bottom);');
    expect(sheetText).not.toContain('height: var(--dads-heading-chip-height);');
  });

  it('chipはgroupパートに紐づいて配置される', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading chip size="45">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain(":host([data-has-chip]) [part='group']");
    expect(sheetText).not.toContain(':host([data-has-chip])::before');
  });

  it('chip と shoulder は同時に表示できる', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent(
      '<dads-heading chip><span slot="shoulder">ショルダー</span>見出し</dads-heading>'
    );

    await waitForComponent('dads-heading');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(component.hasAttribute('data-has-chip')).toBe(true);
    expect(component.hasAttribute('data-has-shoulder')).toBe(true);
    // Chip is implemented via ::before on the group; shoulder presence should not disable it.
    expect(sheetText).toContain(":host([data-has-chip]) [part='group']::before");
  });

  it('margin="top" は group の margin で「見出しの前の余白」を表現する（Shadow DOMで外部resetの影響を受けにくい）', async () => {
    const { defineHeading } = await import('./heading-define');
    defineHeading();

    const component = await renderWebComponent('<dads-heading margin="top">見出し</dads-heading>');

    await waitForComponent('dads-heading');
    const sheets = component.shadowRoot?.adoptedStyleSheets ?? [];
    const sheetText = sheets
      .map(sheet => Array.from(sheet.cssRules ?? []).map(rule => rule.cssText).join('\n'))
      .join('\n');

    expect(sheetText).toContain(":host([margin='top']) [part='group']");
    expect(sheetText).toContain('margin-block-start: var(--dads-heading-margin-block-start);');
  });
});
