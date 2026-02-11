/**
 * @module header-container
 * デジタル庁デザインシステム ヘッダーコンテナコンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsHeaderContainer_instances, _DadsHeaderContainer_base, _DadsHeaderContainer_utilityPart, _DadsHeaderContainer_globalMenuPart, _DadsHeaderContainer_hamburgerMenuPart, _DadsHeaderContainer_utilitySlot, _DadsHeaderContainer_globalMenuSlot, _DadsHeaderContainer_hamburgerMenuSlot, _DadsHeaderContainer_subscriptions, _DadsHeaderContainer_lightDomObserver, _DadsHeaderContainer_onViewportResize, _DadsHeaderContainer_setupSlotListeners, _DadsHeaderContainer_setupLightDomObserver, _DadsHeaderContainer_syncModeAttribute, _DadsHeaderContainer_resolveEffectiveMode, _DadsHeaderContainer_syncSlotFlags, _DadsHeaderContainer_syncLayoutState, _DadsHeaderContainer_syncAccessibleName;
import { PropertyAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { hasSlotContent } from '../../utils/dom.js';
import { headerContainerTokens } from './header-container-tokens.js';
import { headerContainerStyles } from './header-container-styles.js';
const AUTO_MODE = 'auto';
const VALID_MODES = new Set([
    AUTO_MODE,
    'wide-full',
    'wide-slim',
    'medium',
    'compact',
]);
function normalizeMode(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (VALID_MODES.has(normalized)) {
        return normalized;
    }
    return AUTO_MODE;
}
function normalizeAriaLabel(value) {
    if (value === null)
        return null;
    const normalized = value.trim();
    return normalized === '' ? null : normalized;
}
function resolveAutoMode() {
    if (typeof window === 'undefined')
        return 'wide-full';
    if (typeof window.matchMedia === 'function') {
        if (window.matchMedia('(min-width: 80rem)').matches)
            return 'wide-full';
        if (window.matchMedia('(min-width: 48rem)').matches)
            return 'medium';
        return 'compact';
    }
    if (window.innerWidth >= 1280)
        return 'wide-full';
    if (window.innerWidth >= 768)
        return 'medium';
    return 'compact';
}
function subscribe(el, type, listener, options) {
    el.addEventListener(type, listener, options);
    return () => el.removeEventListener(type, listener, options);
}
function unsubscribeAll(subscriptions) {
    for (const unsubscribe of subscriptions)
        unsubscribe();
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
    constructor() {
        super(...arguments);
        _DadsHeaderContainer_instances.add(this);
        _DadsHeaderContainer_base.set(this, null);
        _DadsHeaderContainer_utilityPart.set(this, null);
        _DadsHeaderContainer_globalMenuPart.set(this, null);
        _DadsHeaderContainer_hamburgerMenuPart.set(this, null);
        _DadsHeaderContainer_utilitySlot.set(this, null);
        _DadsHeaderContainer_globalMenuSlot.set(this, null);
        _DadsHeaderContainer_hamburgerMenuSlot.set(this, null);
        _DadsHeaderContainer_subscriptions.set(this, []);
        _DadsHeaderContainer_lightDomObserver.set(this, null);
        _DadsHeaderContainer_onViewportResize.set(this, () => __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncLayoutState).call(this));
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsHeaderContainer_base, this.shadowRoot?.querySelector('#base'), "f");
        __classPrivateFieldSet(this, _DadsHeaderContainer_utilityPart, this.shadowRoot?.querySelector('#utility'), "f");
        __classPrivateFieldSet(this, _DadsHeaderContainer_globalMenuPart, this.shadowRoot?.querySelector('#global-menu'), "f");
        __classPrivateFieldSet(this, _DadsHeaderContainer_hamburgerMenuPart, this.shadowRoot?.querySelector('#hamburger-menu'), "f");
        __classPrivateFieldSet(this, _DadsHeaderContainer_utilitySlot, this.shadowRoot?.querySelector('#utility-slot'), "f");
        __classPrivateFieldSet(this, _DadsHeaderContainer_globalMenuSlot, this.shadowRoot?.querySelector('#global-menu-slot'), "f");
        __classPrivateFieldSet(this, _DadsHeaderContainer_hamburgerMenuSlot, this.shadowRoot?.querySelector('#hamburger-menu-slot'), "f");
        if (!this.hasAttribute('mode')) {
            this.setAttribute('mode', AUTO_MODE);
        }
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_setupSlotListeners).call(this);
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_setupLightDomObserver).call(this);
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', __classPrivateFieldGet(this, _DadsHeaderContainer_onViewportResize, "f"));
        }
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncModeAttribute).call(this);
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncSlotFlags).call(this);
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncAccessibleName).call(this);
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncLayoutState).call(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribeAll(__classPrivateFieldGet(this, _DadsHeaderContainer_subscriptions, "f"));
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', __classPrivateFieldGet(this, _DadsHeaderContainer_onViewportResize, "f"));
        }
        __classPrivateFieldGet(this, _DadsHeaderContainer_lightDomObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsHeaderContainer_lightDomObserver, null, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isConnected)
            return;
        if (oldValue === newValue)
            return;
        if (name === 'mode') {
            __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncModeAttribute).call(this);
            __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncLayoutState).call(this);
            return;
        }
        if (name === 'aria-label') {
            __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncAccessibleName).call(this);
        }
    }
}
_DadsHeaderContainer_base = new WeakMap(), _DadsHeaderContainer_utilityPart = new WeakMap(), _DadsHeaderContainer_globalMenuPart = new WeakMap(), _DadsHeaderContainer_hamburgerMenuPart = new WeakMap(), _DadsHeaderContainer_utilitySlot = new WeakMap(), _DadsHeaderContainer_globalMenuSlot = new WeakMap(), _DadsHeaderContainer_hamburgerMenuSlot = new WeakMap(), _DadsHeaderContainer_subscriptions = new WeakMap(), _DadsHeaderContainer_lightDomObserver = new WeakMap(), _DadsHeaderContainer_onViewportResize = new WeakMap(), _DadsHeaderContainer_instances = new WeakSet(), _DadsHeaderContainer_setupSlotListeners = function _DadsHeaderContainer_setupSlotListeners() {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsHeaderContainer_subscriptions, "f"));
    const sync = () => {
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncSlotFlags).call(this);
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncLayoutState).call(this);
    };
    if (__classPrivateFieldGet(this, _DadsHeaderContainer_utilitySlot, "f")) {
        __classPrivateFieldGet(this, _DadsHeaderContainer_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsHeaderContainer_utilitySlot, "f"), 'slotchange', sync));
    }
    if (__classPrivateFieldGet(this, _DadsHeaderContainer_globalMenuSlot, "f")) {
        __classPrivateFieldGet(this, _DadsHeaderContainer_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsHeaderContainer_globalMenuSlot, "f"), 'slotchange', sync));
    }
    if (__classPrivateFieldGet(this, _DadsHeaderContainer_hamburgerMenuSlot, "f")) {
        __classPrivateFieldGet(this, _DadsHeaderContainer_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsHeaderContainer_hamburgerMenuSlot, "f"), 'slotchange', sync));
    }
}, _DadsHeaderContainer_setupLightDomObserver = function _DadsHeaderContainer_setupLightDomObserver() {
    __classPrivateFieldGet(this, _DadsHeaderContainer_lightDomObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsHeaderContainer_lightDomObserver, null, "f");
    if (typeof MutationObserver === 'undefined')
        return;
    __classPrivateFieldSet(this, _DadsHeaderContainer_lightDomObserver, new MutationObserver(() => {
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncSlotFlags).call(this);
        __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_syncLayoutState).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsHeaderContainer_lightDomObserver, "f").observe(this, {
        childList: true,
        subtree: false,
        attributes: true,
        attributeFilter: ['slot'],
    });
}, _DadsHeaderContainer_syncModeAttribute = function _DadsHeaderContainer_syncModeAttribute() {
    const normalized = normalizeMode(this.getAttribute('mode'));
    if (this.getAttribute('mode') !== normalized) {
        this.setAttribute('mode', normalized);
    }
}, _DadsHeaderContainer_resolveEffectiveMode = function _DadsHeaderContainer_resolveEffectiveMode() {
    const mode = normalizeMode(this.getAttribute('mode'));
    if (mode !== AUTO_MODE)
        return mode;
    return resolveAutoMode();
}, _DadsHeaderContainer_syncSlotFlags = function _DadsHeaderContainer_syncSlotFlags() {
    const hasUtility = hasSlotContent(__classPrivateFieldGet(this, _DadsHeaderContainer_utilitySlot, "f")) || this.querySelector('[slot="utility"]') !== null;
    const hasGlobalMenu = hasSlotContent(__classPrivateFieldGet(this, _DadsHeaderContainer_globalMenuSlot, "f")) || this.querySelector('[slot="global-menu"]') !== null;
    const hasHamburgerMenu = hasSlotContent(__classPrivateFieldGet(this, _DadsHeaderContainer_hamburgerMenuSlot, "f")) || this.querySelector('[slot="hamburger-menu"]') !== null;
    this.toggleAttribute('data-has-utility', hasUtility);
    this.toggleAttribute('data-has-global-menu', hasGlobalMenu);
    this.toggleAttribute('data-has-hamburger-menu', hasHamburgerMenu);
}, _DadsHeaderContainer_syncLayoutState = function _DadsHeaderContainer_syncLayoutState() {
    const effectiveMode = __classPrivateFieldGet(this, _DadsHeaderContainer_instances, "m", _DadsHeaderContainer_resolveEffectiveMode).call(this);
    this.setAttribute('data-effective-mode', effectiveMode);
    const hasUtility = this.hasAttribute('data-has-utility');
    const hasGlobalMenu = this.hasAttribute('data-has-global-menu');
    const hasHamburgerMenu = this.hasAttribute('data-has-hamburger-menu');
    const showUtility = hasUtility;
    const showGlobalMenu = hasGlobalMenu && (effectiveMode === 'wide-full' || effectiveMode === 'wide-slim');
    const showHamburgerMenu = hasHamburgerMenu && (effectiveMode === 'medium' || effectiveMode === 'compact');
    __classPrivateFieldGet(this, _DadsHeaderContainer_utilityPart, "f")?.toggleAttribute('hidden', !showUtility);
    __classPrivateFieldGet(this, _DadsHeaderContainer_globalMenuPart, "f")?.toggleAttribute('hidden', !showGlobalMenu);
    __classPrivateFieldGet(this, _DadsHeaderContainer_hamburgerMenuPart, "f")?.toggleAttribute('hidden', !showHamburgerMenu);
}, _DadsHeaderContainer_syncAccessibleName = function _DadsHeaderContainer_syncAccessibleName() {
    const base = __classPrivateFieldGet(this, _DadsHeaderContainer_base, "f");
    if (!base)
        return;
    const label = normalizeAriaLabel(this.getAttribute('aria-label'));
    if (label === null) {
        base.removeAttribute('aria-label');
        return;
    }
    base.setAttribute('aria-label', label);
};
DadsHeaderContainer.definition = {
    name: 'dads-header-container',
    template: html `
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
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        headerContainerTokens,
        headerContainerStyles,
    ], 'minimal'),
    attributes: [PropertyAttr('mode'), PropertyAttr('aria-label')],
};
