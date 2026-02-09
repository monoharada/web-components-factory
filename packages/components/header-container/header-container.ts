/**
 * @module header-container
 * デジタル庁デザインシステム ヘッダーコンテナコンポーネント
 * @version 1.0.0
 */

import { PropertyAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { hasSlotContent } from '../../utils/dom.js';
import { headerContainerTokens } from './header-container-tokens.js';
import { headerContainerStyles } from './header-container-styles.js';

type DadsHeaderContainerMode = 'auto' | 'wide-full' | 'wide-slim' | 'medium' | 'compact';

const AUTO_MODE = 'auto' as const;

const VALID_MODES = new Set<DadsHeaderContainerMode>([
  AUTO_MODE,
  'wide-full',
  'wide-slim',
  'medium',
  'compact',
]);

function normalizeMode(value: string | null): DadsHeaderContainerMode {
  const normalized = value?.trim().toLowerCase() ?? '';
  if (VALID_MODES.has(normalized as DadsHeaderContainerMode)) {
    return normalized as DadsHeaderContainerMode;
  }
  return AUTO_MODE;
}

function normalizeAriaLabel(value: string | null): string | null {
  if (value === null) return null;
  const normalized = value.trim();
  return normalized === '' ? null : normalized;
}

function resolveAutoMode(): Exclude<DadsHeaderContainerMode, 'auto'> {
  if (typeof window === 'undefined') return 'wide-full';

  if (typeof window.matchMedia === 'function') {
    if (window.matchMedia('(min-width: 80rem)').matches) return 'wide-full';
    if (window.matchMedia('(min-width: 48rem)').matches) return 'medium';
    return 'compact';
  }

  if (window.innerWidth >= 1280) return 'wide-full';
  if (window.innerWidth >= 768) return 'medium';
  return 'compact';
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
 * ヘッダーコンテナコンポーネント
 *
 * @customElement
 * @tagname dads-header-container
 *
 * @slot logo - ロゴ領域
 * @slot utility - 補助リンク/ユーティリティ領域
 * @slot global-menu - グローバルメニュー領域
 * @slot hamburger-menu - ハンバーガーメニュー領域
 *
 * @csspart base - ルート領域
 * @csspart primary-row - 1段目レイアウト領域
 * @csspart logo - ロゴ領域
 * @csspart utility - 補助リンク領域
 * @csspart global-menu - グローバルメニュー領域
 * @csspart hamburger-menu - ハンバーガーメニュー領域
 *
 * @attr {'auto' | 'wide-full' | 'wide-slim' | 'medium' | 'compact'} mode - レイアウトモード
 * @attr {string} aria-label - ヘッダー領域のアクセシブル名
 *
 * @cssprop --dads-header-container-inline-padding - インライン余白
 * @cssprop --dads-header-container-primary-min-block-size - 1段目の最小高さ
 * @cssprop --dads-header-container-global-menu-min-block-size - メニュー段の最小高さ
 * @cssprop --dads-header-container-border-color - 境界線色
 */
export class DadsHeaderContainer extends TypographyWebComponent {
  #base: HTMLElement | null = null;
  #utilityPart: HTMLElement | null = null;
  #globalMenuPart: HTMLElement | null = null;
  #hamburgerMenuPart: HTMLElement | null = null;
  #utilitySlot: HTMLSlotElement | null = null;
  #globalMenuSlot: HTMLSlotElement | null = null;
  #hamburgerMenuSlot: HTMLSlotElement | null = null;
  #subscriptions: Array<() => void> = [];
  #lightDomObserver: MutationObserver | null = null;
  #onViewportResize = () => this.#syncLayoutState();

  static definition = {
    name: 'dads-header-container',
    template: html`
      <header part="base" id="base">
        <div part="primary-row" id="primary-row">
          <div part="logo" id="logo">
            <slot name="logo" id="logo-slot"></slot>
          </div>
          <div part="utility" id="utility">
            <slot name="utility" id="utility-slot"></slot>
          </div>
          <div part="hamburger-menu" id="hamburger-menu">
            <slot name="hamburger-menu" id="hamburger-menu-slot"></slot>
          </div>
        </div>

        <div part="global-menu" id="global-menu">
          <slot name="global-menu" id="global-menu-slot"></slot>
        </div>
      </header>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        headerContainerTokens,
        headerContainerStyles,
      ],
      'minimal',
    ),
    attributes: [PropertyAttr('mode'), PropertyAttr('aria-label')],
  };

  declare mode: DadsHeaderContainerMode;

  connectedCallback(): void {
    super.connectedCallback();

    this.#base = this.shadowRoot?.querySelector('#base') as HTMLElement | null;
    this.#utilityPart = this.shadowRoot?.querySelector('#utility') as HTMLElement | null;
    this.#globalMenuPart = this.shadowRoot?.querySelector('#global-menu') as HTMLElement | null;
    this.#hamburgerMenuPart = this.shadowRoot?.querySelector('#hamburger-menu') as HTMLElement | null;

    this.#utilitySlot = this.shadowRoot?.querySelector('#utility-slot') as HTMLSlotElement | null;
    this.#globalMenuSlot = this.shadowRoot?.querySelector('#global-menu-slot') as HTMLSlotElement | null;
    this.#hamburgerMenuSlot = this.shadowRoot?.querySelector('#hamburger-menu-slot') as HTMLSlotElement | null;

    if (!this.hasAttribute('mode')) {
      this.setAttribute('mode', AUTO_MODE);
    }

    this.#setupSlotListeners();
    this.#setupLightDomObserver();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.#onViewportResize);
    }

    this.#syncModeAttribute();
    this.#syncSlotFlags();
    this.#syncAccessibleName();
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

    if (name === 'mode') {
      this.#syncModeAttribute();
      this.#syncLayoutState();
      return;
    }

    if (name === 'aria-label') {
      this.#syncAccessibleName();
    }
  }

  #setupSlotListeners(): void {
    unsubscribeAll(this.#subscriptions);

    const sync = () => {
      this.#syncSlotFlags();
      this.#syncLayoutState();
    };

    if (this.#utilitySlot) {
      this.#subscriptions.push(subscribe(this.#utilitySlot, 'slotchange', sync));
    }

    if (this.#globalMenuSlot) {
      this.#subscriptions.push(subscribe(this.#globalMenuSlot, 'slotchange', sync));
    }

    if (this.#hamburgerMenuSlot) {
      this.#subscriptions.push(subscribe(this.#hamburgerMenuSlot, 'slotchange', sync));
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

  #syncModeAttribute(): void {
    const normalized = normalizeMode(this.getAttribute('mode'));
    if (this.getAttribute('mode') !== normalized) {
      this.setAttribute('mode', normalized);
    }
  }

  #resolveEffectiveMode(): Exclude<DadsHeaderContainerMode, 'auto'> {
    const mode = normalizeMode(this.getAttribute('mode'));
    if (mode !== AUTO_MODE) return mode;
    return resolveAutoMode();
  }

  #syncSlotFlags(): void {
    const hasUtility = hasSlotContent(this.#utilitySlot) || this.querySelector('[slot="utility"]') !== null;
    const hasGlobalMenu =
      hasSlotContent(this.#globalMenuSlot) || this.querySelector('[slot="global-menu"]') !== null;
    const hasHamburgerMenu =
      hasSlotContent(this.#hamburgerMenuSlot) || this.querySelector('[slot="hamburger-menu"]') !== null;

    this.toggleAttribute('data-has-utility', hasUtility);
    this.toggleAttribute('data-has-global-menu', hasGlobalMenu);
    this.toggleAttribute('data-has-hamburger-menu', hasHamburgerMenu);
  }

  #syncLayoutState(): void {
    const effectiveMode = this.#resolveEffectiveMode();
    this.setAttribute('data-effective-mode', effectiveMode);

    const hasUtility = this.hasAttribute('data-has-utility');
    const hasGlobalMenu = this.hasAttribute('data-has-global-menu');
    const hasHamburgerMenu = this.hasAttribute('data-has-hamburger-menu');

    const showUtility = hasUtility;
    const showGlobalMenu = hasGlobalMenu && (effectiveMode === 'wide-full' || effectiveMode === 'wide-slim');
    const showHamburgerMenu = hasHamburgerMenu && (effectiveMode === 'medium' || effectiveMode === 'compact');

    this.#utilityPart?.toggleAttribute('hidden', !showUtility);
    this.#globalMenuPart?.toggleAttribute('hidden', !showGlobalMenu);
    this.#hamburgerMenuPart?.toggleAttribute('hidden', !showHamburgerMenu);
  }

  #syncAccessibleName(): void {
    const base = this.#base;
    if (!base) return;

    const label = normalizeAriaLabel(this.getAttribute('aria-label'));
    if (label === null) {
      base.removeAttribute('aria-label');
      return;
    }

    base.setAttribute('aria-label', label);
  }
}
