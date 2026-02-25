/**
 * @module tab
 * デジタル庁デザインシステム Tab コンポーネント
 * APG Tabs Pattern 準拠の4方向レイアウト・reflow・auto/manual アクティベーション対応
 * @version 0.1.0
 */

import {
  html,
  PropertyAttr,
  Keys,
  ElementSelection,
  Orientation,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { withReset } from '../../styles/reset-css.js';
import { tabTokens } from './tab-tokens.js';
import { tabStyles } from './tab-styles.js';

type TabOrientation = 'top' | 'bottom' | 'left' | 'right';
type ActivationMode = 'auto' | 'manual';

function normalizeOrientation(v: string | null): TabOrientation {
  if (v === 'bottom' || v === 'left' || v === 'right') return v;
  return 'top';
}

function normalizeActivationMode(v: string | null): ActivationMode {
  return v === 'manual' ? 'manual' : 'auto';
}

function isHorizontalOrientation(orientation: TabOrientation): boolean {
  return orientation === 'top' || orientation === 'bottom';
}

/**
 * DadsTab コンポーネント
 *
 * Light DOM の子要素をタブパネルとして扱い、各子要素の `data-tab-label` 属性から
 * タブラベルを動的に生成する単一コンポーネントタブ。
 *
 * @customElement
 * @tagname dads-tab
 *
 * @slot default - タブパネルの内容（各子要素に data-tab-label でラベル、data-tab-disabled で無効化を指定）
 *
 * @csspart base - ルートコンテナ
 * @csspart tablist - タブリスト（role="tablist"）
 * @csspart tab - 各タブボタン（role="tab"）
 * @csspart indicator - 各タブの選択マーク
 * @csspart label - 各タブのラベルテキスト
 * @csspart tabpanel - 各タブパネル（role="tabpanel"）
 *
 * @attr {'top' | 'bottom' | 'left' | 'right'} [orientation='top'] - タブリストの配置方向
 * @attr {'auto' | 'manual'} [activation-mode='auto'] - アクティベーションモード
 * @attr {string} [selected-index='0'] - 選択中のタブインデックス
 *
 * @cssprop --dads-tab-background - タブ背景色
 * @cssprop --dads-tab-background-hover - タブホバー時背景色
 * @cssprop --dads-tab-color - タブテキスト色
 * @cssprop --dads-tab-color-selected - 選択タブテキスト色
 * @cssprop --dads-tab-color-disabled - 無効タブテキスト色
 * @cssprop --dads-tab-border-color - ボーダー色
 * @cssprop --dads-tab-indicator-color - インジケーター色
 * @cssprop --dads-tab-indicator-height - インジケーター高さ
 * @cssprop --dads-tab-focus-outline-color - フォーカスアウトライン色
 * @cssprop --dads-tab-focus-ring-color - フォーカスリング色
 *
 * @fires dads-tab-change - タブ選択変更時（detail: { selectedIndex: number, previousIndex: number }）
 *
 * @example
 * ```html
 * <dads-tab>
 *   <div data-tab-label="タブ1">タブ1の内容</div>
 *   <div data-tab-label="タブ2">タブ2の内容</div>
 *   <div data-tab-label="タブ3">タブ3の内容</div>
 * </dads-tab>
 * ```
 */
export class DadsTab extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'dads-tab',
    template: html`
      <div part="base" id="base">
        <div part="tablist" role="tablist" id="tablist"></div>
        <slot id="default-slot"></slot>
      </div>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        tabTokens,
        tabStyles,
        applyDADSFocusStyles(),
      ],
      'minimal',
    ),
    attributes: [
      PropertyAttr('orientation'),
      PropertyAttr('activationMode', 'activation-mode'),
      PropertyAttr('selectedIndex', 'selected-index'),
    ],
  };

  declare orientation: string | null;
  declare activationMode: string | null;
  declare selectedIndex: string | null;

  #tablist: HTMLElement | null = null;
  #slot: HTMLSlotElement | null = null;
  #tabs: HTMLButtonElement[] = [];
  #panels: HTMLElement[] = [];
  #childObserver: MutationObserver | null = null;
  #layoutObserver: ResizeObserver | null = null;
  #idCounter = 0;
  #lastTablistBlockSize = '';

  connectedCallback() {
    super.connectedCallback();

    if (!this.hasAttribute('orientation')) {
      this.setAttribute('orientation', 'top');
    }
    if (!this.hasAttribute('activation-mode')) {
      this.setAttribute('activation-mode', 'auto');
    }
    if (!this.hasAttribute('selected-index')) {
      this.setAttribute('selected-index', '0');
    }

    this.#tablist = this.shadowRoot?.querySelector<HTMLElement>('#tablist') ?? null;
    this.#slot = this.shadowRoot?.querySelector<HTMLSlotElement>('#default-slot') ?? null;

    this.#slot?.addEventListener('slotchange', this.#handleSlotChange);

    this.#childObserver = new MutationObserver(this.#handleChildMutation);
    this.#childObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ['data-tab-label', 'data-tab-disabled', 'aria-label', 'aria-labelledby'],
      subtree: false,
    });

    if (typeof ResizeObserver !== 'undefined') {
      this.#layoutObserver = new ResizeObserver(() => {
        this.#syncPanelMinBlockSize();
      });
      this.#layoutObserver.observe(this);
      if (this.#tablist) {
        this.#layoutObserver.observe(this.#tablist);
      }
    }

    this.#syncTabs();
  }

  disconnectedCallback() {
    this.#slot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#slot = null;
    this.#tablist = null;
    this.#childObserver?.disconnect();
    this.#childObserver = null;
    this.#layoutObserver?.disconnect();
    this.#layoutObserver = null;
    this.#tabs = [];
    this.#panels = [];
    this.style.removeProperty('--_dads-tab-tablist-block-size');
    this.#lastTablistBlockSize = '';
    super.disconnectedCallback();
  }

  orientationChanged(): void {
    this.#syncAriaOrientation();
    this.#syncPanelMinBlockSize();
  }

  selectedIndexChanged(): void {
    this.#syncSelection();
  }

  activationModeChanged(): void {
    // No DOM changes needed for mode change
  }

  #handleSlotChange = (): void => {
    this.#syncTabs();
  };

  #handleChildMutation = (): void => {
    this.#syncTabs();
  };

  #generateId(prefix: string): string {
    this.#idCounter += 1;
    return `${this.localName}-${prefix}-${this.#idCounter}`;
  }

  #getPanelChildren(): HTMLElement[] {
    const children: HTMLElement[] = [];
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      if (!child.hasAttribute('data-tab-label')) continue;
      children.push(child);
    }
    return children;
  }

  #syncTabs(): void {
    const tablist = this.#tablist;
    if (!tablist) return;

    const panelChildren = this.#getPanelChildren();

    // Remove existing tabs
    while (tablist.firstChild) {
      tablist.removeChild(tablist.firstChild);
    }

    this.#tabs = [];
    this.#panels = [];

    for (const child of panelChildren) {
      const label = child.getAttribute('data-tab-label') ?? '';
      const disabled = child.hasAttribute('data-tab-disabled');

      // Ensure IDs for ARIA linking
      if (!child.id) {
        child.id = this.#generateId('panel');
      }

      const tabId = this.#generateId('tab');

      // Create tab button
      const tab = document.createElement('button');
      tab.setAttribute('part', 'tab');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('id', tabId);
      tab.setAttribute('aria-controls', child.id);
      tab.type = 'button';
      tab.addEventListener('click', this.#handleTabClick);
      tab.addEventListener('keydown', this.#handleKeyDown);

      const indicator = document.createElement('span');
      indicator.setAttribute('part', 'indicator');
      indicator.setAttribute('aria-hidden', 'true');

      const labelNode = document.createElement('span');
      labelNode.setAttribute('part', 'label');
      labelNode.textContent = label;

      tab.append(indicator, labelNode);

      if (disabled) {
        tab.setAttribute('aria-disabled', 'true');
      }

      // Set panel ARIA
      child.setAttribute('role', 'tabpanel');
      child.setAttribute('part', 'tabpanel');
      child.setAttribute('aria-labelledby', tabId);
      child.setAttribute('tabindex', '0');

      tablist.appendChild(tab);
      this.#tabs.push(tab);
      this.#panels.push(child);
    }

    this.#syncAriaOrientation();
    this.#syncPanelMinBlockSize();
    this.#syncSelection();
  }

  #syncAriaOrientation(): void {
    const tablist = this.#tablist;
    if (!tablist) return;

    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    const ariaOrientation = isHorizontalOrientation(orientation) ? 'horizontal' : 'vertical';
    tablist.setAttribute('aria-orientation', ariaOrientation);

    const labelledBy = this.getAttribute('aria-labelledby');
    const label = this.getAttribute('aria-label');
    if (labelledBy) {
      tablist.setAttribute('aria-labelledby', labelledBy);
      tablist.removeAttribute('aria-label');
      return;
    }
    tablist.removeAttribute('aria-labelledby');
    tablist.setAttribute('aria-label', label || 'タブ');
  }

  #syncPanelMinBlockSize(): void {
    const tablist = this.#tablist;
    if (!tablist) return;

    const blockSize = Math.max(0, Math.ceil(tablist.getBoundingClientRect().height));
    const nextValue = `${blockSize}px`;
    if (this.#lastTablistBlockSize === nextValue) return;

    this.#lastTablistBlockSize = nextValue;
    this.style.setProperty('--_dads-tab-tablist-block-size', nextValue);
  }

  #syncSelection(): void {
    const index = Math.max(0, parseInt(this.getAttribute('selected-index') ?? '0', 10) || 0);
    const clampedIndex = Math.min(index, this.#tabs.length - 1);

    for (let i = 0; i < this.#tabs.length; i++) {
      const tab = this.#tabs[i];
      const panel = this.#panels[i];
      const isSelected = i === clampedIndex;

      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');

      if (isSelected) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    }
  }

  #getEnabledTabs(): HTMLButtonElement[] {
    const enabled: HTMLButtonElement[] = [];
    for (const tab of this.#tabs) {
      if (tab.getAttribute('aria-disabled') === 'true') continue;
      enabled.push(tab);
    }
    return enabled;
  }

  #handleTabClick = (event: MouseEvent): void => {
    const tab = event.currentTarget as HTMLButtonElement;
    if (tab.getAttribute('aria-disabled') === 'true') return;

    const index = this.#tabs.indexOf(tab);
    if (index < 0) return;

    this.#selectTab(index);
  };

  #handleKeyDown = (event: KeyboardEvent): void => {
    const currentTab = event.currentTarget as HTMLButtonElement;
    const isTabKey = event.key === 'Tab';
    if (
      currentTab.getAttribute('aria-disabled') === 'true' &&
      event.key !== Keys.arrowUp &&
      event.key !== Keys.arrowDown &&
      event.key !== Keys.arrowLeft &&
      event.key !== Keys.arrowRight &&
      event.key !== Keys.home &&
      event.key !== Keys.end &&
      !isTabKey
    ) {
      return;
    }

    const mode = normalizeActivationMode(this.getAttribute('activation-mode'));
    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    const ariaOrientation = isHorizontalOrientation(orientation)
      ? Orientation.horizontal
      : Orientation.vertical;

    if (isTabKey) {
      const enabledTabs = this.#getEnabledTabs();
      if (enabledTabs.length <= 1) return;
      const currentIndex = enabledTabs.indexOf(currentTab);
      if (currentIndex < 0) return;

      const delta = event.shiftKey ? -1 : 1;
      const nextIndex = currentIndex + delta;
      if (nextIndex < 0 || nextIndex >= enabledTabs.length) {
        // 端ではデフォルトの Tab 移動（タブリスト外）を許可する
        return;
      }

      event.preventDefault();
      enabledTabs[nextIndex].focus();
      return;
    }

    // Enter でフォーカス中タブのパネルへ移動
    if (event.key === Keys.enter) {
      event.preventDefault();
      const index = this.#tabs.indexOf(currentTab);
      if (index < 0 || currentTab.getAttribute('aria-disabled') === 'true') return;

      if (this.getAttribute('selected-index') !== String(index)) {
        this.#selectTab(index);
      }
      this.#panels[index]?.focus();
      return;
    }

    // Space は manual モード時のみ選択変更
    if (mode === 'manual' && event.key === Keys.space) {
      event.preventDefault();
      const index = this.#tabs.indexOf(currentTab);
      if (index >= 0 && currentTab.getAttribute('aria-disabled') !== 'true') {
        this.#selectTab(index);
      }
      return;
    }

    const enabledTabs = this.#getEnabledTabs();
    if (enabledTabs.length <= 1) return;

    const selection = new ElementSelection(enabledTabs, currentTab);
    selection.processKey(
      event,
      (target) => {
        target.focus();
        if (mode === 'auto') {
          const index = this.#tabs.indexOf(target);
          if (index >= 0) {
            this.#selectTab(index);
          }
        }
      },
      {
        orientation: ariaOrientation,
        wrap: true,
        preventDefaultHomeEnd: true,
      },
    );
  };

  #selectTab(index: number): void {
    const previousIndex = parseInt(this.getAttribute('selected-index') ?? '0', 10) || 0;
    if (index === previousIndex) return;

    this.setAttribute('selected-index', String(index));

    this.dispatchEvent(
      new CustomEvent('dads-tab-change', {
        detail: { selectedIndex: index, previousIndex },
        bubbles: true,
        composed: true,
      }),
    );
  }
}
