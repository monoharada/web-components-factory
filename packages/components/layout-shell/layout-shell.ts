/**
 * @module layout-shell
 * 画面レイアウトシェルコンポーネント
 * @version 1.0.0
 */

import { PropertyAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { hasSlotContent } from '../../utils/dom.js';
import { layoutShellTokens } from './layout-shell-tokens.js';
import { layoutShellStyles } from './layout-shell-styles.js';

type DadsLayoutShellPattern =
  | 'website'
  | 'app-shell'
  | 'master-detail'
  | 'left-header-pane'
  | 'three-pane'
  | 'three-pane-shell';
type DadsLayoutShellMode = 'auto' | 'desktop' | 'tablet' | 'mobile';
type DadsLayoutShellMobileSidebar = 'hidden' | 'top' | 'bottom';

const DEFAULT_PATTERN = 'app-shell' as const;
const AUTO_MODE = 'auto' as const;
const DEFAULT_MOBILE_SIDEBAR = 'bottom' as const;

const VALID_PATTERNS = new Set<DadsLayoutShellPattern>([
  'website',
  'app-shell',
  'master-detail',
  'left-header-pane',
  'three-pane',
  'three-pane-shell',
]);

const VALID_MODES = new Set<DadsLayoutShellMode>([
  AUTO_MODE,
  'desktop',
  'tablet',
  'mobile',
]);

const VALID_MOBILE_SIDEBARS = new Set<DadsLayoutShellMobileSidebar>([
  'hidden',
  'top',
  'bottom',
]);

function normalizePattern(value: string | null): DadsLayoutShellPattern {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (VALID_PATTERNS.has(normalized as DadsLayoutShellPattern)) {
    return normalized as DadsLayoutShellPattern;
  }
  return DEFAULT_PATTERN;
}

function normalizeMode(value: string | null): DadsLayoutShellMode {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (VALID_MODES.has(normalized as DadsLayoutShellMode)) {
    return normalized as DadsLayoutShellMode;
  }
  return AUTO_MODE;
}

function normalizeMobileSidebar(value: string | null): DadsLayoutShellMobileSidebar {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (VALID_MOBILE_SIDEBARS.has(normalized as DadsLayoutShellMobileSidebar)) {
    return normalized as DadsLayoutShellMobileSidebar;
  }
  return DEFAULT_MOBILE_SIDEBAR;
}

function resolveAutoMode(): Exclude<DadsLayoutShellMode, 'auto'> {
  if (typeof window === 'undefined') return 'desktop';

  if (typeof window.matchMedia === 'function') {
    if (window.matchMedia('(min-width: 80rem)').matches) return 'desktop';
    if (window.matchMedia('(min-width: 48rem)').matches) return 'tablet';
    return 'mobile';
  }

  if (window.innerWidth >= 1280) return 'desktop';
  if (window.innerWidth >= 768) return 'tablet';
  return 'mobile';
}

function subscribe<T extends EventTarget>(
  el: T,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean,
): () => void {
  el.addEventListener(type, listener, options);
  return () => el.removeEventListener(type, listener, options);
}

function unsubscribeAll(subscriptions: Array<() => void>): void {
  for (const unsubscribe of subscriptions) unsubscribe();
  subscriptions.length = 0;
}

/**
 * 画面レイアウトシェル
 *
 * @customElement
 * @tagname dads-layout-shell
 *
 * @slot header - ヘッダー領域
 * @slot sidebar - サイドバー領域
 * @slot default - メイン領域
 * @slot aside - 補助情報領域
 * @slot footer - フッター領域
 *
 * @csspart base - ルートレイアウト領域
 * @csspart header - ヘッダー領域
 * @csspart body - 本文レイアウト領域
 * @csspart sidebar - サイドバー領域
 * @csspart main - メイン領域
 * @csspart aside - 補助情報領域
 * @csspart footer - フッター領域
 *
 * @attr {'website' | 'app-shell' | 'master-detail' | 'left-header-pane' | 'three-pane' | 'three-pane-shell'} pattern - レイアウトパターン
 * @attr {'auto' | 'desktop' | 'tablet' | 'mobile'} mode - レイアウトモード
 * @attr {'hidden' | 'top' | 'bottom'} mobile-sidebar - app-shell + mobile 時のサイドバー配置
 *
 * @cssprop --dads-layout-shell-space - 余白の基本値（inline-padding / block-gap の基準）
 * @cssprop --dads-layout-shell-pane-width - ペイン幅の基本値（sidebar / rail / aside の基準）
 * @cssprop --dads-layout-shell-main-max-width - websiteパターン時のメイン最大幅（基本調整）
 * @cssprop --dads-layout-shell-mobile-space-scale - mobile時の余白縮小倍率（spaceに乗算）
 * @cssprop --dads-layout-shell-inline-padding - コンテナの左右余白（詳細上書き）
 * @cssprop --dads-layout-shell-block-gap - ブロック間ギャップ（詳細上書き）
 * @cssprop --dads-layout-shell-sidebar-width - app-shell desktop時のsidebar幅（詳細上書き）
 * @cssprop --dads-layout-shell-sidebar-rail-width - app-shell tablet時のsidebar幅（詳細上書き）
 * @cssprop --dads-layout-shell-aside-width - master-detail desktop時のaside幅（詳細上書き）
 */
export class DadsLayoutShell extends TypographyWebComponent {
  #headerPart: HTMLElement | null = null;
  #sidebarPart: HTMLElement | null = null;
  #asidePart: HTMLElement | null = null;
  #footerPart: HTMLElement | null = null;

  #headerSlot: HTMLSlotElement | null = null;
  #sidebarSlot: HTMLSlotElement | null = null;
  #asideSlot: HTMLSlotElement | null = null;
  #footerSlot: HTMLSlotElement | null = null;

  #subscriptions: Array<() => void> = [];
  #lightDomObserver: MutationObserver | null = null;
  #onViewportResize = () => this.#syncLayoutState();

  static definition = {
    name: 'dads-layout-shell',
    template: html`
      <div part="base" id="base">
        <header part="header" id="header">
          <slot name="header" id="header-slot"></slot>
        </header>

        <div part="body" id="body">
          <aside part="sidebar" id="sidebar">
            <slot name="sidebar" id="sidebar-slot"></slot>
          </aside>

          <main part="main" id="main" aria-label="メインコンテンツ">
            <slot id="main-slot"></slot>
          </main>

          <aside part="aside" id="aside">
            <slot name="aside" id="aside-slot"></slot>
          </aside>
        </div>

        <footer part="footer" id="footer">
          <slot name="footer" id="footer-slot"></slot>
        </footer>
      </div>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        layoutShellTokens,
        layoutShellStyles,
      ],
      'minimal',
    ),
    attributes: [
      PropertyAttr('pattern'),
      PropertyAttr('mode'),
      PropertyAttr('mobileSidebar', 'mobile-sidebar'),
    ],
  };

  declare pattern: DadsLayoutShellPattern;
  declare mode: DadsLayoutShellMode;
  declare mobileSidebar: DadsLayoutShellMobileSidebar;

  connectedCallback(): void {
    super.connectedCallback();

    this.#headerPart = this.shadowRoot?.querySelector('#header') as HTMLElement | null;
    this.#sidebarPart = this.shadowRoot?.querySelector('#sidebar') as HTMLElement | null;
    this.#asidePart = this.shadowRoot?.querySelector('#aside') as HTMLElement | null;
    this.#footerPart = this.shadowRoot?.querySelector('#footer') as HTMLElement | null;

    this.#headerSlot = this.shadowRoot?.querySelector('#header-slot') as HTMLSlotElement | null;
    this.#sidebarSlot = this.shadowRoot?.querySelector('#sidebar-slot') as HTMLSlotElement | null;
    this.#asideSlot = this.shadowRoot?.querySelector('#aside-slot') as HTMLSlotElement | null;
    this.#footerSlot = this.shadowRoot?.querySelector('#footer-slot') as HTMLSlotElement | null;

    if (!this.hasAttribute('pattern')) {
      this.setAttribute('pattern', DEFAULT_PATTERN);
    }

    if (!this.hasAttribute('mode')) {
      this.setAttribute('mode', AUTO_MODE);
    }

    if (!this.hasAttribute('mobile-sidebar')) {
      this.setAttribute('mobile-sidebar', DEFAULT_MOBILE_SIDEBAR);
    }

    this.#setupSlotListeners();
    this.#setupLightDomObserver();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.#onViewportResize);
    }

    this.#syncPatternAttribute();
    this.#syncModeAttribute();
    this.#syncMobileSidebarAttribute();
    this.#syncSlotFlags();
    this.#syncLayoutState();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    unsubscribeAll(this.#subscriptions);

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.#onViewportResize);
    }

    this.#lightDomObserver?.disconnect();
    this.#lightDomObserver = null;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!this.isConnected) return;
    if (oldValue === newValue) return;

    if (name === 'pattern') {
      this.#syncPatternAttribute();
      this.#syncLayoutState();
      return;
    }

    if (name === 'mode') {
      this.#syncModeAttribute();
      this.#syncLayoutState();
      return;
    }

    if (name === 'mobile-sidebar') {
      this.#syncMobileSidebarAttribute();
      this.#syncLayoutState();
    }
  }

  #setupSlotListeners(): void {
    unsubscribeAll(this.#subscriptions);

    const sync = () => {
      this.#syncSlotFlags();
      this.#syncLayoutState();
    };

    if (this.#headerSlot) {
      this.#subscriptions.push(subscribe(this.#headerSlot, 'slotchange', sync));
    }

    if (this.#sidebarSlot) {
      this.#subscriptions.push(subscribe(this.#sidebarSlot, 'slotchange', sync));
    }

    if (this.#asideSlot) {
      this.#subscriptions.push(subscribe(this.#asideSlot, 'slotchange', sync));
    }

    if (this.#footerSlot) {
      this.#subscriptions.push(subscribe(this.#footerSlot, 'slotchange', sync));
    }
  }

  #setupLightDomObserver(): void {
    this.#lightDomObserver?.disconnect();
    this.#lightDomObserver = null;

    if (typeof MutationObserver === 'undefined') return;

    this.#lightDomObserver = new MutationObserver(() => {
      this.#syncSlotFlags();
      this.#syncLayoutState();
    });

    this.#lightDomObserver.observe(this, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ['slot'],
    });
  }

  #syncPatternAttribute(): void {
    const normalized = normalizePattern(this.getAttribute('pattern'));
    if (this.getAttribute('pattern') !== normalized) {
      this.setAttribute('pattern', normalized);
    }
  }

  #syncModeAttribute(): void {
    const normalized = normalizeMode(this.getAttribute('mode'));
    if (this.getAttribute('mode') !== normalized) {
      this.setAttribute('mode', normalized);
    }
  }

  #syncMobileSidebarAttribute(): void {
    const normalized = normalizeMobileSidebar(this.getAttribute('mobile-sidebar'));
    if (this.getAttribute('mobile-sidebar') !== normalized) {
      this.setAttribute('mobile-sidebar', normalized);
    }
  }

  #resolveEffectiveMode(): Exclude<DadsLayoutShellMode, 'auto'> {
    const mode = normalizeMode(this.getAttribute('mode'));
    if (mode !== AUTO_MODE) return mode;
    return resolveAutoMode();
  }

  #hasDirectSlotElement(slotName: string): boolean {
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].getAttribute('slot') === slotName) return true;
    }
    return false;
  }

  #syncSlotFlags(): void {
    const hasHeader = hasSlotContent(this.#headerSlot) || this.#hasDirectSlotElement('header');
    const hasSidebar = hasSlotContent(this.#sidebarSlot) || this.#hasDirectSlotElement('sidebar');
    const hasAside = hasSlotContent(this.#asideSlot) || this.#hasDirectSlotElement('aside');
    const hasFooter = hasSlotContent(this.#footerSlot) || this.#hasDirectSlotElement('footer');

    this.toggleAttribute('data-has-header', hasHeader);
    this.toggleAttribute('data-has-sidebar', hasSidebar);
    this.toggleAttribute('data-has-aside', hasAside);
    this.toggleAttribute('data-has-footer', hasFooter);
  }

  #syncLayoutState(): void {
    const pattern = normalizePattern(this.getAttribute('pattern'));
    const effectiveMode = this.#resolveEffectiveMode();
    const mobileSidebar = normalizeMobileSidebar(this.getAttribute('mobile-sidebar'));

    this.setAttribute('data-effective-pattern', pattern);
    this.setAttribute('data-effective-mode', effectiveMode);

    const hasHeader = this.hasAttribute('data-has-header');
    const hasSidebar = this.hasAttribute('data-has-sidebar');
    const hasAside = this.hasAttribute('data-has-aside');
    const hasFooter = this.hasAttribute('data-has-footer');

    let showSidebar = false;
    let showAside = false;
    let sidebarState: 'full' | 'rail' | 'hidden' = 'hidden';
    let bodyLayout:
      | 'single'
      | 'app-shell'
      | 'app-shell-rail'
      | 'app-shell-mobile-stacked-top'
      | 'app-shell-mobile-stacked-bottom'
      | 'master-detail'
      | 'master-detail-stacked'
      | 'left-header-pane'
      | 'three-pane'
      | 'three-pane-tablet'
      | 'three-pane-mobile-top'
      | 'three-pane-mobile-bottom' = 'single';

    if (pattern === 'app-shell') {
      if (effectiveMode === 'desktop') {
        showSidebar = hasSidebar;
        sidebarState = showSidebar ? 'full' : 'hidden';
        bodyLayout = showSidebar ? 'app-shell' : 'single';
      } else if (effectiveMode === 'tablet') {
        showSidebar = hasSidebar;
        sidebarState = showSidebar ? 'rail' : 'hidden';
        bodyLayout = showSidebar ? 'app-shell-rail' : 'single';
      } else {
        if (mobileSidebar === 'hidden') {
          showSidebar = false;
          sidebarState = 'hidden';
          bodyLayout = 'single';
        } else {
          showSidebar = hasSidebar;
          sidebarState = showSidebar ? 'full' : 'hidden';
          bodyLayout = showSidebar
            ? (mobileSidebar === 'top' ? 'app-shell-mobile-stacked-top' : 'app-shell-mobile-stacked-bottom')
            : 'single';
        }
      }
    }

    if (pattern === 'master-detail') {
      showAside = hasAside;
      if (showAside) {
        bodyLayout = effectiveMode === 'desktop' ? 'master-detail' : 'master-detail-stacked';
      }
    }

    if (pattern === 'left-header-pane') {
      showSidebar = false;
      showAside = false;
      bodyLayout = hasHeader && effectiveMode !== 'mobile' ? 'left-header-pane' : 'single';
    }

    if (pattern === 'three-pane' || pattern === 'three-pane-shell') {
      showAside = hasAside;

      if (effectiveMode === 'desktop') {
        showSidebar = hasSidebar;
        sidebarState = showSidebar ? 'full' : 'hidden';

        if (showSidebar && showAside) {
          bodyLayout = 'three-pane';
        } else if (showSidebar) {
          bodyLayout = 'app-shell';
        } else if (showAside) {
          bodyLayout = 'master-detail';
        } else {
          bodyLayout = 'single';
        }
      } else if (effectiveMode === 'tablet') {
        showSidebar = hasSidebar;
        sidebarState = showSidebar ? 'rail' : 'hidden';

        if (showSidebar && showAside) {
          bodyLayout = 'three-pane-tablet';
        } else if (showSidebar) {
          bodyLayout = 'app-shell-rail';
        } else if (showAside) {
          bodyLayout = 'master-detail-stacked';
        } else {
          bodyLayout = 'single';
        }
      } else {
        const allowMobileSidebar = mobileSidebar !== 'hidden';
        showSidebar = hasSidebar && allowMobileSidebar;
        sidebarState = showSidebar ? 'full' : 'hidden';

        if (showSidebar && showAside) {
          bodyLayout = mobileSidebar === 'top'
            ? 'three-pane-mobile-top'
            : 'three-pane-mobile-bottom';
        } else if (showAside) {
          bodyLayout = 'master-detail-stacked';
        } else if (showSidebar) {
          bodyLayout = mobileSidebar === 'top'
            ? 'app-shell-mobile-stacked-top'
            : 'app-shell-mobile-stacked-bottom';
        } else {
          bodyLayout = 'single';
        }
      }
    }

    this.setAttribute('data-sidebar-state', sidebarState);
    this.setAttribute('data-body-layout', bodyLayout);

    this.#headerPart?.toggleAttribute('hidden', !hasHeader);
    this.#sidebarPart?.toggleAttribute('hidden', !showSidebar);
    this.#asidePart?.toggleAttribute('hidden', !showAside);
    this.#footerPart?.toggleAttribute('hidden', !hasFooter);
  }
}
