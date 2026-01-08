/**
 * DadsBlockquoteコンポーネント テスト
 * TDD（テスト駆動開発）アプローチ
 */

import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';

// ========== Phase 1: 基本レンダリング ==========
describe('DadsBlockquote - 基本レンダリング', () => {
  afterEach(() => {
    cleanup();
  });

  it('コンポーネントが存在する', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    expect(component).toBeInTheDocument();
  });

  it('Shadow DOMが作成される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    expect(component.shadowRoot).toBeTruthy();
  });

  it('blockquoteタグが含まれる', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    const blockquote = getShadowElement(component, '[part="blockquote"]');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote?.tagName.toLowerCase()).toBe('blockquote');
  });

  it('スロットのコンテンツが表示される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    expect(component.textContent).toContain('引用テキスト');
  });
});

// ========== Phase 2: 属性 ==========
describe('DadsBlockquote - 属性', () => {
  afterEach(() => {
    cleanup();
  });

  it('cite属性が内部blockquoteに反映される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote cite="https://example.com">
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    const blockquote = getShadowElement(component, '[part="blockquote"]') as HTMLQuoteElement;
    // Happy-DOM互換: .citeプロパティではなくgetAttributeを使用
    expect(blockquote?.getAttribute('cite')).toBe('https://example.com');
  });

  it('cite属性の動的変更が反映される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote cite="https://old.example.com">
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    // 属性を変更
    component.setAttribute('cite', 'https://new.example.com');

    // 属性変更が反映されるまで待機（getAttribute使用 - Happy-DOM互換）
    await waitFor(() => {
      const blockquote = getShadowElement(component, '[part="blockquote"]') as HTMLQuoteElement;
      expect(blockquote?.getAttribute('cite')).toBe('https://new.example.com');
    });
  });

  it('cite属性を削除すると内部blockquoteからも削除される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote cite="https://example.com">
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    // 属性を削除
    component.removeAttribute('cite');

    const blockquote = getShadowElement(component, '[part="blockquote"]') as HTMLQuoteElement;
    expect(blockquote?.hasAttribute('cite')).toBe(false);
  });
});

// ========== Phase 3: スタイル ==========
describe('DadsBlockquote - スタイル', () => {
  afterEach(() => {
    cleanup();
  });

  it('DADSスタイルが適用される（border-left）', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    const blockquote = getShadowElement(component, '[part="blockquote"]') as Element;
    const styles = getComputedStyle(blockquote);

    // border-leftの確認
    expect(styles.borderLeftWidth).toBe('8px');
    expect(styles.borderLeftStyle).toBe('solid');
  });
});

// ========== Phase 4: コンテンツパターン ==========
describe('DadsBlockquote - コンテンツパターン', () => {
  afterEach(() => {
    cleanup();
  });

  it('複数段落が正しく表示される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>最初の段落</p>
        <p>二番目の段落</p>
        <p>三番目の段落</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    expect(component.textContent).toContain('最初の段落');
    expect(component.textContent).toContain('二番目の段落');
    expect(component.textContent).toContain('三番目の段落');
  });

  it('リスト付きコンテンツが正しく表示される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>デジタル庁デザインシステムは、以下の理念を追求して作成されています。</p>
        <ul>
          <li>アクセシビリティファースト</li>
          <li>行政機関にとって高い汎用性と利便性</li>
          <li>継続的かつ持続可能な改善活動</li>
        </ul>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    expect(component.textContent).toContain('アクセシビリティファースト');
    expect(component.textContent).toContain('行政機関にとって高い汎用性と利便性');
    expect(component.textContent).toContain('継続的かつ持続可能な改善活動');
  });

  it('混合コンテンツが正しく表示される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>説明テキスト</p>
        <ul>
          <li>項目1</li>
          <li>項目2</li>
        </ul>
        <p>まとめテキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    expect(component.textContent).toContain('説明テキスト');
    expect(component.textContent).toContain('項目1');
    expect(component.textContent).toContain('まとめテキスト');
  });
});

// ========== Phase 5: アクセシビリティ ==========
describe('DadsBlockquote - アクセシビリティ', () => {
  afterEach(() => {
    cleanup();
  });

  it('ネイティブblockquoteのセマンティクスが維持される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>引用テキスト</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');
    const blockquote = getShadowElement(component, '[part="blockquote"]');
    expect(blockquote?.tagName.toLowerCase()).toBe('blockquote');
  });
});

// ========== Phase 6: 自動スロット割り当て ==========
/**
 * NOTE: Happy-DOMは slotAssignment: 'manual' と slot.assign() APIを
 * 完全にはサポートしていないため、これらのテストはスキップされます。
 * 実ブラウザ環境（Playwright等）では正常に動作します。
 */
describe.skip('DadsBlockquote - 自動スロット割り当て', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * ヘルパー関数: スロットに割り当てられた要素を取得
   */
  const getSlotAssignedElements = (component: HTMLElement, slotId: string): Element[] => {
    const slot = component.shadowRoot?.getElementById(slotId) as HTMLSlotElement | null;
    return slot?.assignedElements() ?? [];
  };

  it('要素1つ → lead に配置', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>唯一の段落</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    const leadElements = getSlotAssignedElements(component, 'lead-slot');
    const bodyElements = getSlotAssignedElements(component, 'body-slot');
    const closeElements = getSlotAssignedElements(component, 'close-slot');

    expect(leadElements).toHaveLength(1);
    expect(leadElements[0].textContent).toBe('唯一の段落');
    expect(bodyElements).toHaveLength(0);
    expect(closeElements).toHaveLength(0);
  });

  it('要素2つ → 最初→lead, 最後→body', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>最初の段落</p>
        <p>最後の段落</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    const leadElements = getSlotAssignedElements(component, 'lead-slot');
    const bodyElements = getSlotAssignedElements(component, 'body-slot');
    const closeElements = getSlotAssignedElements(component, 'close-slot');

    expect(leadElements).toHaveLength(1);
    expect(leadElements[0].textContent).toBe('最初の段落');
    expect(bodyElements).toHaveLength(1);
    expect(bodyElements[0].textContent).toBe('最後の段落');
    expect(closeElements).toHaveLength(0);
  });

  it('要素3つ以上 → 最初→lead, 中間→body, 最後→close', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>最初の段落</p>
        <p>中間の段落1</p>
        <p>中間の段落2</p>
        <p>最後の段落</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    const leadElements = getSlotAssignedElements(component, 'lead-slot');
    const bodyElements = getSlotAssignedElements(component, 'body-slot');
    const closeElements = getSlotAssignedElements(component, 'close-slot');

    expect(leadElements).toHaveLength(1);
    expect(leadElements[0].textContent).toBe('最初の段落');
    expect(bodyElements).toHaveLength(2);
    expect(bodyElements[0].textContent).toBe('中間の段落1');
    expect(bodyElements[1].textContent).toBe('中間の段落2');
    expect(closeElements).toHaveLength(1);
    expect(closeElements[0].textContent).toBe('最後の段落');
  });

  it('明示的slot="lead"指定は尊重される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p slot="lead">明示的lead</p>
        <p>自動振り分け1</p>
        <p>自動振り分け2</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    const leadElements = getSlotAssignedElements(component, 'lead-slot');
    const bodyElements = getSlotAssignedElements(component, 'body-slot');
    const closeElements = getSlotAssignedElements(component, 'close-slot');

    // 明示的leadと自動振り分けの最初の要素がlead
    expect(leadElements).toHaveLength(2);
    expect(leadElements[0].textContent).toBe('明示的lead');
    expect(leadElements[1].textContent).toBe('自動振り分け1');
    // 2要素なので2番目→body
    expect(bodyElements).toHaveLength(1);
    expect(bodyElements[0].textContent).toBe('自動振り分け2');
    expect(closeElements).toHaveLength(0);
  });

  it('明示的slot="close"指定は尊重される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>自動振り分け1</p>
        <p>自動振り分け2</p>
        <p>自動振り分け3</p>
        <p slot="close">明示的close</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    const leadElements = getSlotAssignedElements(component, 'lead-slot');
    const bodyElements = getSlotAssignedElements(component, 'body-slot');
    const closeElements = getSlotAssignedElements(component, 'close-slot');

    expect(leadElements).toHaveLength(1);
    expect(leadElements[0].textContent).toBe('自動振り分け1');
    expect(bodyElements).toHaveLength(1);
    expect(bodyElements[0].textContent).toBe('自動振り分け2');
    // 明示的closeと自動振り分けの最後の要素がclose
    expect(closeElements).toHaveLength(2);
    expect(closeElements[0].textContent).toBe('明示的close');
    expect(closeElements[1].textContent).toBe('自動振り分け3');
  });

  it('動的に子要素を追加すると再割り当てされる', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>最初の段落</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    // 初期状態: 1要素→lead
    let leadElements = getSlotAssignedElements(component, 'lead-slot');
    expect(leadElements).toHaveLength(1);

    // 動的に子要素を追加
    const newP1 = document.createElement('p');
    newP1.textContent = '追加された段落1';
    const newP2 = document.createElement('p');
    newP2.textContent = '追加された段落2';
    component.appendChild(newP1);
    component.appendChild(newP2);

    // MutationObserverによる再割り当てを待機
    await waitFor(() => {
      leadElements = getSlotAssignedElements(component, 'lead-slot');
      const bodyElements = getSlotAssignedElements(component, 'body-slot');
      const closeElements = getSlotAssignedElements(component, 'close-slot');

      // 3要素→ 最初→lead, 中間→body, 最後→close
      expect(leadElements).toHaveLength(1);
      expect(leadElements[0].textContent).toBe('最初の段落');
      expect(bodyElements).toHaveLength(1);
      expect(bodyElements[0].textContent).toBe('追加された段落1');
      expect(closeElements).toHaveLength(1);
      expect(closeElements[0].textContent).toBe('追加された段落2');
    });
  });

  it('動的に子要素を削除すると再割り当てされる', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p id="p1">段落1</p>
        <p id="p2">段落2</p>
        <p id="p3">段落3</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    // 初期状態: 3要素
    let leadElements = getSlotAssignedElements(component, 'lead-slot');
    let closeElements = getSlotAssignedElements(component, 'close-slot');
    expect(leadElements).toHaveLength(1);
    expect(closeElements).toHaveLength(1);

    // 子要素を削除
    const p2 = component.querySelector('#p2');
    const p3 = component.querySelector('#p3');
    p2?.remove();
    p3?.remove();

    // MutationObserverによる再割り当てを待機
    await waitFor(() => {
      leadElements = getSlotAssignedElements(component, 'lead-slot');
      const bodyElements = getSlotAssignedElements(component, 'body-slot');
      closeElements = getSlotAssignedElements(component, 'close-slot');

      // 1要素→ leadのみ
      expect(leadElements).toHaveLength(1);
      expect(leadElements[0].textContent).toBe('段落1');
      expect(bodyElements).toHaveLength(0);
      expect(closeElements).toHaveLength(0);
    });
  });

  it('空のスロットにはhidden属性が設定される', async () => {
    const { defineBlockquote } = await import('./blockquote-define');
    defineBlockquote();

    const component = await renderWebComponent(`
      <dads-blockquote>
        <p>唯一の段落</p>
      </dads-blockquote>
    `);

    await waitForComponent('dads-blockquote');

    const leadSlot = component.shadowRoot?.getElementById('lead-slot');
    const bodySlot = component.shadowRoot?.getElementById('body-slot');
    const closeSlot = component.shadowRoot?.getElementById('close-slot');

    // leadには要素があるのでhiddenなし
    expect(leadSlot?.hasAttribute('hidden')).toBe(false);
    // body, closeは空なのでhidden
    expect(bodySlot?.hasAttribute('hidden')).toBe(true);
    expect(closeSlot?.hasAttribute('hidden')).toBe(true);
  });
});
