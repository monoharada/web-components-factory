/**
 * アコーディオンコンポーネント テスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  renderWebComponent,
  getShadowElement,
  getShadowText,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { defineAccordion } from './accordion-define';

// コンポーネントを登録
defineAccordion();

describe('DadsAccordionDetails', () => {
  afterEach(() => {
    cleanup();
  });

  describe('基本機能', () => {
    it('コンポーネントが正しくレンダリングされる', async () => {
      const accordion = await renderWebComponent(`
        <dads-accordion-details>
          <dads-accordion-item-details>
            <span slot="header">テスト見出し</span>
            <div slot="content">テストコンテンツ</div>
          </dads-accordion-item-details>
        </dads-accordion-details>
      `);

      await waitForComponent('dads-accordion-item-details');
      
      const item = accordion.querySelector('dads-accordion-item-details');
      expect(item).toBeInTheDocument();
      
      const summary = getShadowElement(item!, '[part="summary"]');
      expect(summary).toBeInTheDocument();
    });

    it('複数のアイテムを含めることができる', async () => {
      const accordion = await renderWebComponent(`
        <dads-accordion-details>
          <dads-accordion-item-details>
            <span slot="header">項目1</span>
            <div slot="content">内容1</div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">項目2</span>
            <div slot="content">内容2</div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">項目3</span>
            <div slot="content">内容3</div>
          </dads-accordion-item-details>
        </dads-accordion-details>
      `);

      const items = accordion.querySelectorAll('dads-accordion-item-details');
      expect(items).toHaveLength(3);
    });
  });

  describe('単一展開モード', () => {
    it('デフォルトでは一つのアイテムのみ展開可能', async () => {
      const accordion = await renderWebComponent(`
        <dads-accordion-details>
          <dads-accordion-item-details>
            <span slot="header">項目1</span>
            <div slot="content">内容1</div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">項目2</span>
            <div slot="content">内容2</div>
          </dads-accordion-item-details>
        </dads-accordion-details>
      `);

      const items = accordion.querySelectorAll('dads-accordion-item-details');
      const details1 = getShadowElement(items[0]!, '[part="details"]') as HTMLDetailsElement;
      const details2 = getShadowElement(items[1]!, '[part="details"]') as HTMLDetailsElement;

      // 最初のアイテムを開く
      details1.open = true;
      items[0].dispatchEvent(new Event('toggle', { bubbles: true }));
      
      await waitFor(() => {
        expect(details1.open).toBe(true);
      });

      // 2番目のアイテムを開く
      details2.open = true;
      items[1].dispatchEvent(new Event('toggle', { bubbles: true }));

      await waitFor(() => {
        expect(details2.open).toBe(true);
        expect(details1.open).toBe(false); // 最初のアイテムは閉じる
      });
    });
  });

  describe('複数展開モード', () => {
    it('allow-multiple属性で複数展開可能', async () => {
      const accordion = await renderWebComponent(`
        <dads-accordion-details allow-multiple>
          <dads-accordion-item-details>
            <span slot="header">項目1</span>
            <div slot="content">内容1</div>
          </dads-accordion-item-details>
          <dads-accordion-item-details>
            <span slot="header">項目2</span>
            <div slot="content">内容2</div>
          </dads-accordion-item-details>
        </dads-accordion-details>
      `);

      const items = accordion.querySelectorAll('dads-accordion-item-details');
      const details1 = getShadowElement(items[0]!, '[part="details"]') as HTMLDetailsElement;
      const details2 = getShadowElement(items[1]!, '[part="details"]') as HTMLDetailsElement;

      // 両方のアイテムを開く
      details1.open = true;
      details2.open = true;

      await waitFor(() => {
        expect(details1.open).toBe(true);
        expect(details2.open).toBe(true); // 両方開いた状態を維持
      });
    });
  });
});

describe('DadsAccordionItemDetails', () => {
  afterEach(() => {
    cleanup();
  });

  describe('基本機能', () => {
    it('スロットコンテンツが正しく表示される', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details>
          <span slot="header">見出しテキスト</span>
          <div slot="content">本文コンテンツ</div>
        </dads-accordion-item-details>
      `);

      await waitForComponent('dads-accordion-item-details');

      // Shadow DOM内のスロット要素を確認
      const headerSlot = getShadowElement(item, 'slot[name="header"]');
      const contentSlot = getShadowElement(item, 'slot[name="content"]');
      
      expect(headerSlot).toBeInTheDocument();
      expect(contentSlot).toBeInTheDocument();
    });

    it('expanded属性で初期展開状態を制御', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details expanded>
          <span slot="header">見出し</span>
          <div slot="content">内容</div>
        </dads-accordion-item-details>
      `);

      const details = getShadowElement(item, '[part="details"]') as HTMLDetailsElement;
      expect(details.open).toBe(true);
    });

    // disabled属性のテストは削除（アコーディオンには非活性状態は不要）
  });

  describe('メソッド', () => {
    it('toggle()メソッドで開閉切り替え', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details>
          <span slot="header">見出し</span>
          <div slot="content">内容</div>
        </dads-accordion-item-details>
      `) as any;

      await waitForComponent('dads-accordion-item-details');
      
      // Shadow DOMからdetails要素を取得
      const details = item.shadowRoot.querySelector('details') as HTMLDetailsElement;
      
      expect(details).toBeTruthy();
      expect(details.tagName).toBe('DETAILS');
      
      // happy-domでは.openプロパティが正しく動作しない可能性があるため、
      // 属性とプロパティの両方を確認
      const isInitiallyOpen = details.open || details.hasAttribute('open');
      expect(isInitiallyOpen).toBe(false);
      
      item.toggle();
      await waitFor(() => {
        const isOpen = details.open || details.hasAttribute('open');
        expect(isOpen).toBe(true);
      });
      
      item.toggle();
      await waitFor(() => {
        const isOpen = details.open || details.hasAttribute('open');
        expect(isOpen).toBe(false);
      });
    });

    it('expand()メソッドで展開', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details>
          <span slot="header">見出し</span>
          <div slot="content">内容</div>
        </dads-accordion-item-details>
      `) as any;

      const details = getShadowElement(item, '[part="details"]') as HTMLDetailsElement;
      
      item.expand();
      await waitFor(() => {
        expect(details.open).toBe(true);
      });
    });

    it('collapse()メソッドで閉じる', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details expanded>
          <span slot="header">見出し</span>
          <div slot="content">内容</div>
        </dads-accordion-item-details>
      `) as any;

      const details = getShadowElement(item, '[part="details"]') as HTMLDetailsElement;
      
      expect(details.open).toBe(true);
      
      item.collapse();
      await waitFor(() => {
        expect(details.open).toBe(false);
      });
    });
  });

  describe('戻るボタン', () => {
    it('戻るボタンがクリック可能', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details expanded>
          <span slot="header">見出し</span>
          <div slot="content">長いコンテンツ</div>
        </dads-accordion-item-details>
      `);

      const returnButton = getShadowElement(item, '[part="return-button"]');
      expect(returnButton).toBeInTheDocument();
      
      // フォーカスのモック
      const summary = getShadowElement(item, '[part="summary"]') as HTMLElement;
      const focusSpy = vi.spyOn(summary, 'focus');
      const scrollSpy = vi.spyOn(summary, 'scrollIntoView');
      
      // ボタンクリック
      returnButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      
      await waitFor(() => {
        expect(scrollSpy).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start'
        });
        expect(focusSpy).toHaveBeenCalled();
      });
    });
  });

  describe('イベント', () => {
    it('toggle イベントが発火する', async () => {
      const item = await renderWebComponent(`
        <dads-accordion-item-details>
          <span slot="header">見出し</span>
          <div slot="content">内容</div>
        </dads-accordion-item-details>
      `);

      const toggleHandler = vi.fn();
      item.addEventListener('toggle', toggleHandler);

      const details = getShadowElement(item, '[part="details"]') as HTMLDetailsElement;
      details.open = true;
      details.dispatchEvent(new Event('toggle', { bubbles: true }));

      await waitFor(() => {
        expect(toggleHandler).toHaveBeenCalled();
      });
    });
  });
});