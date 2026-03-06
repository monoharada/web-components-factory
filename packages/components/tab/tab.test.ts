/**
 * Tab コンポーネント テスト
 * APG Tabs Pattern 準拠の検証
 */

import { describe, it, expect, afterEach } from 'vitest';
import { waitFor } from '@testing-library/dom';
import {
  renderWebComponent,
  getShadowElement,
  cleanup,
  waitForComponent,
} from '../../../test/utils/test-helpers';
import { defineTab } from './tab-define';

defineTab();

function createBasicTab(): HTMLElement {
  return renderWebComponent(`
    <dads-tab>
      <div data-tab-label="タブ1">パネル1の内容</div>
      <div data-tab-label="タブ2">パネル2の内容</div>
      <div data-tab-label="タブ3">パネル3の内容</div>
    </dads-tab>
  `);
}

function createTabWithDisabled(): HTMLElement {
  return renderWebComponent(`
    <dads-tab>
      <div data-tab-label="タブ1">パネル1</div>
      <div data-tab-label="タブ2" data-tab-disabled>パネル2（無効）</div>
      <div data-tab-label="タブ3">パネル3</div>
    </dads-tab>
  `);
}

function getTabs(component: HTMLElement): HTMLButtonElement[] {
  const tablist = getShadowElement(component, '[role="tablist"]');
  if (!tablist) return [];
  return Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
}

function getPanels(component: HTMLElement): HTMLElement[] {
  return Array.from(component.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
}

function dispatchKey(element: HTMLElement, key: string, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  });
  element.dispatchEvent(event);
  return event;
}

function pressKey(element: HTMLElement, key: string, init: KeyboardEventInit = {}): void {
  dispatchKey(element, key, init);
}

describe('DadsTab', () => {
  afterEach(() => {
    cleanup();
  });

  // ============================================================
  // Step 1: 骨格 (P-01) — C-01, C-09
  // ============================================================
  describe('基本機能 (Step 1)', () => {
    it('コンポーネントが正しくレンダリングされる', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      expect(tab).toBeInTheDocument();
      expect(tab.shadowRoot).not.toBeNull();
    });

    it('tablist role が設定される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tablist = getShadowElement(tab, '[role="tablist"]');
      expect(tablist).not.toBeNull();
    });

    it('tab role が各タブに設定される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      expect(tabs).toHaveLength(3);
      for (const t of tabs) {
        expect(t.getAttribute('role')).toBe('tab');
      }
    });

    it('tabpanel role が各パネルに設定される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const panels = getPanels(tab);
      expect(panels).toHaveLength(3);
      for (const p of panels) {
        expect(p.getAttribute('role')).toBe('tabpanel');
      }
    });

    it('aria-controls と aria-labelledby が正しくリンクされる', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      const panels = getPanels(tab);

      for (let i = 0; i < tabs.length; i++) {
        const controlsId = tabs[i].getAttribute('aria-controls');
        expect(controlsId).toBe(panels[i].id);

        const labelledbyId = panels[i].getAttribute('aria-labelledby');
        expect(labelledbyId).toBe(tabs[i].id);
      }
    });

    it('タブラベルが data-tab-label から取得される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      expect(tabs[0].textContent).toBe('タブ1');
      expect(tabs[1].textContent).toBe('タブ2');
      expect(tabs[2].textContent).toBe('タブ3');
    });

    it('part 属性が正しく設定される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const base = getShadowElement(tab, '[part="base"]');
      expect(base).not.toBeNull();

      const tablist = getShadowElement(tab, '[part="tablist"]');
      expect(tablist).not.toBeNull();

      const tabs = getTabs(tab);
      for (const t of tabs) {
        expect(t.getAttribute('part')).toBe('tab');
        expect(t.querySelector('[part="indicator"]')).not.toBeNull();
        expect(t.querySelector('[part="label"]')?.textContent).toMatch(/^タブ/);
      }

      const panels = getPanels(tab);
      for (const p of panels) {
        expect(p.getAttribute('part')).toBe('tabpanel');
      }
    });

    it('tablist にアクセス可能な名前が設定される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tablist = getShadowElement(tab, '[role="tablist"]');
      expect(tablist?.getAttribute('aria-label')).toBe('タブ');
      expect(tablist?.hasAttribute('aria-labelledby')).toBe(false);
    });
  });

  // ============================================================
  // Step 2: 公開APIと属性同期 (P-02) — C-02, C-04, C-05
  // ============================================================
  describe('属性同期 (Step 2)', () => {
    it('デフォルト属性が設定される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      expect(tab.getAttribute('orientation')).toBe('top');
      expect(tab.getAttribute('activation-mode')).toBe('auto');
      expect(tab.getAttribute('selected-index')).toBe('0');
    });

    it('selected-index=0 で最初のタブが選択される (C-02)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      const panels = getPanels(tab);

      expect(tabs[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs[1].getAttribute('aria-selected')).toBe('false');
      expect(tabs[2].getAttribute('aria-selected')).toBe('false');

      expect(panels[0].hasAttribute('hidden')).toBe(false);
      expect(panels[1].hasAttribute('hidden')).toBe(true);
      expect(panels[2].hasAttribute('hidden')).toBe(true);
    });

    it('selected-index 変更で選択タブが更新される (C-02)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('selected-index', '2');

      const tabs = getTabs(tab);
      const panels = getPanels(tab);

      expect(tabs[0].getAttribute('aria-selected')).toBe('false');
      expect(tabs[2].getAttribute('aria-selected')).toBe('true');

      expect(panels[0].hasAttribute('hidden')).toBe(true);
      expect(panels[2].hasAttribute('hidden')).toBe(false);
    });

    it('aria-selected="true" は常に1つだけ (C-02)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      for (let i = 0; i < 3; i++) {
        tab.setAttribute('selected-index', String(i));
        const tabs = getTabs(tab);
        const selectedCount = tabs.filter(
          (t) => t.getAttribute('aria-selected') === 'true',
        ).length;
        expect(selectedCount).toBe(1);
      }
    });

    it('orientation 変更で aria-orientation が更新される (C-05)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tablist = getShadowElement(tab, '[role="tablist"]');

      // top → horizontal
      expect(tablist?.getAttribute('aria-orientation')).toBe('horizontal');

      // left → vertical
      tab.setAttribute('orientation', 'left');
      expect(tablist?.getAttribute('aria-orientation')).toBe('vertical');

      // right → vertical
      tab.setAttribute('orientation', 'right');
      expect(tablist?.getAttribute('aria-orientation')).toBe('vertical');

      // bottom → horizontal
      tab.setAttribute('orientation', 'bottom');
      expect(tablist?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('パネル最小高さがタブリスト高さトークンに同期される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const synced = tab.style.getPropertyValue('--_dads-tab-tablist-block-size').trim();
      expect(synced.endsWith('px')).toBe(true);
    });

    it('host の aria-label が tablist に同期される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('aria-label', 'ニュースカテゴリ');
      await new Promise((resolve) => setTimeout(resolve, 0));

      const tablist = getShadowElement(tab, '[role="tablist"]');
      expect(tablist?.getAttribute('aria-label')).toBe('ニュースカテゴリ');
      expect(tablist?.hasAttribute('aria-labelledby')).toBe(false);
    });

    it('host の aria-labelledby が tablist に同期される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('aria-label', 'fallback');
      tab.setAttribute('aria-labelledby', 'tab-heading');
      await new Promise((resolve) => setTimeout(resolve, 0));

      const tablist = getShadowElement(tab, '[role="tablist"]');
      expect(tablist?.getAttribute('aria-labelledby')).toBe('tab-heading');
      expect(tablist?.hasAttribute('aria-label')).toBe(false);
    });

    it('タブクリックで dads-tab-change イベントが発火する', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      let eventDetail: { selectedIndex: number; previousIndex: number } | null = null;
      tab.addEventListener('dads-tab-change', ((e: CustomEvent) => {
        eventDetail = e.detail;
      }) as EventListener);

      const tabs = getTabs(tab);
      tabs[2].click();

      expect(eventDetail).not.toBeNull();
      expect(eventDetail!.selectedIndex).toBe(2);
      expect(eventDetail!.previousIndex).toBe(0);
    });

    it('tabpanel に tabindex="-1" が設定される（Tab 順序から除外）', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const panels = getPanels(tab);
      for (const p of panels) {
        expect(p.getAttribute('tabindex')).toBe('-1');
      }
    });

    it('子パネルの data-tab-label 変更がタブ表示へ即時反映される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const secondPanel = tab.querySelector<HTMLElement>('div[data-tab-label="タブ2"]');
      expect(secondPanel).not.toBeNull();

      secondPanel!.setAttribute('data-tab-label', 'お知らせ');
      await new Promise((resolve) => setTimeout(resolve, 50));

      const tabs = getTabs(tab);
      expect(tabs[1].textContent).toBe('お知らせ');
    });
  });

  // ============================================================
  // Step 3: キーボードモデルと roving tabindex (P-03) — C-03, C-04, C-06
  // ============================================================
  describe('Tab キーモデル (Step 3, C-03)', () => {
    it('全タブが tabindex="0" で Tab 巡回可能', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      expect(tabs[0].getAttribute('tabindex')).toBe('0');
      expect(tabs[1].getAttribute('tabindex')).toBe('0');
      expect(tabs[2].getAttribute('tabindex')).toBe('0');
    });

    it('selected-index 変更後も全タブ tabindex="0"', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('selected-index', '1');

      const tabs = getTabs(tab);
      expect(tabs[0].getAttribute('tabindex')).toBe('0');
      expect(tabs[1].getAttribute('tabindex')).toBe('0');
      expect(tabs[2].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('キーボードナビゲーション (Step 3)', () => {
    it('Tab はタブ間移動を横取りせず、デフォルト移動を許可する', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      const event = dispatchKey(tabs[0], 'Tab');

      expect(event.defaultPrevented).toBe(false);
    });

    it('Shift+Tab はタブ間移動を横取りせず、デフォルト移動を許可する', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[1].focus();
      const event = dispatchKey(tabs[1], 'Tab', { shiftKey: true });

      expect(event.defaultPrevented).toBe(false);
    });

    it('最後タブで Tab はリスト外移動を許可する（ループしない）', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[2].focus();
      const event = dispatchKey(tabs[2], 'Tab');

      expect(event.defaultPrevented).toBe(false);
    });

    it('最初タブで Shift+Tab はリスト外移動を許可する（ループしない）', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      const event = dispatchKey(tabs[0], 'Tab', { shiftKey: true });

      expect(event.defaultPrevented).toBe(false);
    });

    it('ArrowRight でフォーカスが次のタブに移動する（horizontal）', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');

      expect(document.activeElement === tabs[1] || tabs[1].matches(':focus')).toBe(true);
    });

    it('ArrowLeft でフォーカスが前のタブに移動する（horizontal）', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('selected-index', '1');
      const tabs = getTabs(tab);
      tabs[1].focus();
      pressKey(tabs[1], 'ArrowLeft');

      expect(document.activeElement === tabs[0] || tabs[0].matches(':focus')).toBe(true);
    });

    it('Home で最初のタブにフォーカスが移動する', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('selected-index', '2');
      const tabs = getTabs(tab);
      tabs[2].focus();
      pressKey(tabs[2], 'Home');

      expect(document.activeElement === tabs[0] || tabs[0].matches(':focus')).toBe(true);
    });

    it('End で最後のタブにフォーカスが移動する', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'End');

      expect(document.activeElement === tabs[2] || tabs[2].matches(':focus')).toBe(true);
    });

    it('循環ナビゲーション: 最後→最初', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('selected-index', '2');
      const tabs = getTabs(tab);
      tabs[2].focus();
      pressKey(tabs[2], 'ArrowRight');

      expect(document.activeElement === tabs[0] || tabs[0].matches(':focus')).toBe(true);
    });

    it('循環ナビゲーション: 最初→最後', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowLeft');

      expect(document.activeElement === tabs[2] || tabs[2].matches(':focus')).toBe(true);
    });

    it('vertical orientation で ArrowDown/ArrowUp が使用される (C-05)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('orientation', 'left');
      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowDown');

      expect(document.activeElement === tabs[1] || tabs[1].matches(':focus')).toBe(true);
    });
  });

  describe('auto/manual モード (Step 3, C-04)', () => {
    it('auto モード: Enter で tabpanel へフォーカス移動する', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      const panels = getPanels(tab);

      tabs[0].focus();
      pressKey(tabs[0], 'Enter');

      expect(tab.getAttribute('selected-index')).toBe('0');
      expect(panels[0].hasAttribute('hidden')).toBe(false);
      expect(document.activeElement === panels[0] || panels[0].matches(':focus')).toBe(true);
    });

    it('auto モード: Arrow でフォーカスと選択が同時に変更される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');

      expect(tab.getAttribute('selected-index')).toBe('1');
    });

    it('manual モード: Arrow でフォーカスのみ移動、選択は変わらない', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('activation-mode', 'manual');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');

      // 選択は変わらない
      expect(tab.getAttribute('selected-index')).toBe('0');
    });

    it('manual モード: Enter で選択変更 + tabpanel へフォーカス移動', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('activation-mode', 'manual');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');

      // フォーカスは tabs[1] に移動しているはず
      // tabs[1] で Enter を押す
      pressKey(tabs[1], 'Enter');

      const panels = getPanels(tab);
      expect(tab.getAttribute('selected-index')).toBe('1');
      expect(document.activeElement === panels[1] || panels[1].matches(':focus')).toBe(true);
    });

    it('manual モード: Space で選択変更（フォーカスはタブに留まる）', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      tab.setAttribute('activation-mode', 'manual');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');
      pressKey(tabs[1], ' ');

      expect(tab.getAttribute('selected-index')).toBe('1');
      expect(document.activeElement === tabs[1] || tabs[1].matches(':focus')).toBe(true);
    });
  });

  describe('Disabled タブ (Step 3, C-06)', () => {
    it('disabled タブに aria-disabled="true" が設定される', async () => {
      const tab = createTabWithDisabled();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      expect(tabs[1].getAttribute('aria-disabled')).toBe('true');
    });

    it('disabled タブをクリックしても選択されない', async () => {
      const tab = createTabWithDisabled();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[1].click();

      expect(tab.getAttribute('selected-index')).toBe('0');
    });

    it('Arrow キーで disabled タブがスキップされる', async () => {
      const tab = createTabWithDisabled();
      await waitForComponent('dads-tab');

      const tabs = getTabs(tab);
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');

      // タブ2 は disabled なのでスキップされ、タブ3 にフォーカス
      expect(document.activeElement === tabs[2] || tabs[2].matches(':focus')).toBe(true);
    });
  });

  // ============================================================
  // Step 4: Reflow stability (C-08)
  // ============================================================
  describe('Reflow stability (Step 4, C-08)', () => {
    it('タブの追加後もARIAリンクが維持される', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      // 新しいパネルを追加
      const newPanel = document.createElement('div');
      newPanel.setAttribute('data-tab-label', 'タブ4');
      newPanel.textContent = 'パネル4の内容';
      tab.appendChild(newPanel);

      // MutationObserver が発火するまで待つ
      await new Promise((r) => setTimeout(r, 50));

      const tabs = getTabs(tab);
      const panels = getPanels(tab);

      expect(tabs).toHaveLength(4);
      expect(panels).toHaveLength(4);

      // ARIA リンク検証
      for (let i = 0; i < tabs.length; i++) {
        expect(tabs[i].getAttribute('aria-controls')).toBe(panels[i].id);
        expect(panels[i].getAttribute('aria-labelledby')).toBe(tabs[i].id);
      }
    });
  });

  describe('a11yAnnotations', () => {
    it('callouts が主要な要素を含む', async () => {
      const { getCemA11yAnnotations } = await import('../../../tests/utils/cem-annotations.js');
      const annotations = getCemA11yAnnotations('dads-tab');
      const ids = annotations?.callouts?.map((c) => c.id) ?? [];

      expect(ids).toEqual(
        expect.arrayContaining([
          'tablist',
          'active-tab',
          'tab-indicator',
          'tab-label',
          'tabpanel',
        ]),
      );
    });
  });

  // ============================================================
  // Step 7: 追加テスト (G-06, G-07, G-11)
  // ============================================================
  describe('追加テスト', () => {
    it('focus-visible タブに z-index: 3 のスタイルルールが存在する (G-06)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const sheets = tab.shadowRoot?.adoptedStyleSheets ?? [];
      let hasFocusVisibleZIndex = false;

      for (const sheet of sheets) {
        for (const rule of sheet.cssRules) {
          const ruleText = rule.cssText;
          if (ruleText.includes('focus-visible') && ruleText.includes('z-index')) {
            hasFocusVisibleZIndex = true;
            break;
          }
        }
        if (hasFocusVisibleZIndex) break;
      }

      expect(hasFocusVisibleZIndex).toBe(true);
    });

    it('全タブが disabled の場合、キーボード操作が安全に無視される (G-07)', async () => {
      const container = renderWebComponent(`
        <dads-tab>
          <div data-tab-label="タブ1" data-tab-disabled>パネル1</div>
          <div data-tab-label="タブ2" data-tab-disabled>パネル2</div>
          <div data-tab-label="タブ3" data-tab-disabled>パネル3</div>
        </dads-tab>
      `);
      await waitForComponent('dads-tab');

      const tabs = getTabs(container);
      expect(tabs).toHaveLength(3);

      // 全タブが aria-disabled="true"
      for (const t of tabs) {
        expect(t.getAttribute('aria-disabled')).toBe('true');
      }

      // ArrowRight キーを発火してもエラーにならない
      tabs[0].focus();
      pressKey(tabs[0], 'ArrowRight');

      // クリックしても選択が変わらない
      tabs[1].click();
      expect(container.getAttribute('selected-index')).toBe('0');
    });

    it('aria-label 変更が tablist に反映される (G-11)', async () => {
      const tab = createBasicTab();
      await waitForComponent('dads-tab');

      const tablist = getShadowElement(tab, '[role="tablist"]');

      tab.setAttribute('aria-label', '初期ラベル');
      await waitFor(() => {
        expect(tablist?.getAttribute('aria-label')).toBe('初期ラベル');
      });

      tab.setAttribute('aria-label', '変更後ラベル');
      await waitFor(() => {
        expect(tablist?.getAttribute('aria-label')).toBe('変更後ラベル');
      });
    });
  });
});
