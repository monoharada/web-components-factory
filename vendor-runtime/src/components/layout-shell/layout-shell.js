/**
 * @module layout-shell
 * 画面レイアウトシェルコンポーネント
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
var _DadsLayoutShell_instances, _DadsLayoutShell_headerPart, _DadsLayoutShell_sidebarPart, _DadsLayoutShell_asidePart, _DadsLayoutShell_footerPart, _DadsLayoutShell_headerSlot, _DadsLayoutShell_sidebarSlot, _DadsLayoutShell_asideSlot, _DadsLayoutShell_footerSlot, _DadsLayoutShell_subscriptions, _DadsLayoutShell_lightDomObserver, _DadsLayoutShell_onViewportResize, _DadsLayoutShell_setupSlotListeners, _DadsLayoutShell_setupLightDomObserver, _DadsLayoutShell_syncPatternAttribute, _DadsLayoutShell_syncModeAttribute, _DadsLayoutShell_syncMobileSidebarAttribute, _DadsLayoutShell_resolveEffectiveMode, _DadsLayoutShell_hasDirectSlotElement, _DadsLayoutShell_syncSlotFlags, _DadsLayoutShell_syncLayoutState;
import { PropertyAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { hasSlotContent } from '../../utils/dom.js';
import { layoutShellTokens } from './layout-shell-tokens.js';
import { layoutShellStyles } from './layout-shell-styles.js';
const DEFAULT_PATTERN = 'app-shell';
const AUTO_MODE = 'auto';
const DEFAULT_MOBILE_SIDEBAR = 'bottom';
const VALID_PATTERNS = new Set([
    'website',
    'app-shell',
    'master-detail',
    'left-header-pane',
    'three-pane',
    'three-pane-shell',
]);
const VALID_MODES = new Set([
    AUTO_MODE,
    'desktop',
    'tablet',
    'mobile',
]);
const VALID_MOBILE_SIDEBARS = new Set([
    'hidden',
    'top',
    'bottom',
]);
function normalizePattern(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (VALID_PATTERNS.has(normalized)) {
        return normalized;
    }
    return DEFAULT_PATTERN;
}
function normalizeMode(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (VALID_MODES.has(normalized)) {
        return normalized;
    }
    return AUTO_MODE;
}
function normalizeMobileSidebar(value) {
    const normalized = value?.trim().toLowerCase() ?? '';
    if (VALID_MOBILE_SIDEBARS.has(normalized)) {
        return normalized;
    }
    return DEFAULT_MOBILE_SIDEBAR;
}
function resolveAutoMode() {
    if (typeof window === 'undefined')
        return 'desktop';
    if (typeof window.matchMedia === 'function') {
        if (window.matchMedia('(min-width: 80rem)').matches)
            return 'desktop';
        if (window.matchMedia('(min-width: 48rem)').matches)
            return 'tablet';
        return 'mobile';
    }
    if (window.innerWidth >= 1280)
        return 'desktop';
    if (window.innerWidth >= 768)
        return 'tablet';
    return 'mobile';
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
    constructor() {
        super(...arguments);
        _DadsLayoutShell_instances.add(this);
        _DadsLayoutShell_headerPart.set(this, null);
        _DadsLayoutShell_sidebarPart.set(this, null);
        _DadsLayoutShell_asidePart.set(this, null);
        _DadsLayoutShell_footerPart.set(this, null);
        _DadsLayoutShell_headerSlot.set(this, null);
        _DadsLayoutShell_sidebarSlot.set(this, null);
        _DadsLayoutShell_asideSlot.set(this, null);
        _DadsLayoutShell_footerSlot.set(this, null);
        _DadsLayoutShell_subscriptions.set(this, []);
        _DadsLayoutShell_lightDomObserver.set(this, null);
        _DadsLayoutShell_onViewportResize.set(this, () => __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this));
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsLayoutShell_headerPart, this.shadowRoot?.querySelector('#header'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_sidebarPart, this.shadowRoot?.querySelector('#sidebar'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_asidePart, this.shadowRoot?.querySelector('#aside'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_footerPart, this.shadowRoot?.querySelector('#footer'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_headerSlot, this.shadowRoot?.querySelector('#header-slot'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_sidebarSlot, this.shadowRoot?.querySelector('#sidebar-slot'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_asideSlot, this.shadowRoot?.querySelector('#aside-slot'), "f");
        __classPrivateFieldSet(this, _DadsLayoutShell_footerSlot, this.shadowRoot?.querySelector('#footer-slot'), "f");
        if (!this.hasAttribute('pattern')) {
            this.setAttribute('pattern', DEFAULT_PATTERN);
        }
        if (!this.hasAttribute('mode')) {
            this.setAttribute('mode', AUTO_MODE);
        }
        if (!this.hasAttribute('mobile-sidebar')) {
            this.setAttribute('mobile-sidebar', DEFAULT_MOBILE_SIDEBAR);
        }
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_setupSlotListeners).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_setupLightDomObserver).call(this);
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', __classPrivateFieldGet(this, _DadsLayoutShell_onViewportResize, "f"));
        }
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncPatternAttribute).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncModeAttribute).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncMobileSidebarAttribute).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncSlotFlags).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        unsubscribeAll(__classPrivateFieldGet(this, _DadsLayoutShell_subscriptions, "f"));
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', __classPrivateFieldGet(this, _DadsLayoutShell_onViewportResize, "f"));
        }
        __classPrivateFieldGet(this, _DadsLayoutShell_lightDomObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsLayoutShell_lightDomObserver, null, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (!this.isConnected)
            return;
        if (oldValue === newValue)
            return;
        if (name === 'pattern') {
            __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncPatternAttribute).call(this);
            __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this);
            return;
        }
        if (name === 'mode') {
            __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncModeAttribute).call(this);
            __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this);
            return;
        }
        if (name === 'mobile-sidebar') {
            __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncMobileSidebarAttribute).call(this);
            __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this);
        }
    }
}
_DadsLayoutShell_headerPart = new WeakMap(), _DadsLayoutShell_sidebarPart = new WeakMap(), _DadsLayoutShell_asidePart = new WeakMap(), _DadsLayoutShell_footerPart = new WeakMap(), _DadsLayoutShell_headerSlot = new WeakMap(), _DadsLayoutShell_sidebarSlot = new WeakMap(), _DadsLayoutShell_asideSlot = new WeakMap(), _DadsLayoutShell_footerSlot = new WeakMap(), _DadsLayoutShell_subscriptions = new WeakMap(), _DadsLayoutShell_lightDomObserver = new WeakMap(), _DadsLayoutShell_onViewportResize = new WeakMap(), _DadsLayoutShell_instances = new WeakSet(), _DadsLayoutShell_setupSlotListeners = function _DadsLayoutShell_setupSlotListeners() {
    unsubscribeAll(__classPrivateFieldGet(this, _DadsLayoutShell_subscriptions, "f"));
    const sync = () => {
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncSlotFlags).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this);
    };
    if (__classPrivateFieldGet(this, _DadsLayoutShell_headerSlot, "f")) {
        __classPrivateFieldGet(this, _DadsLayoutShell_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsLayoutShell_headerSlot, "f"), 'slotchange', sync));
    }
    if (__classPrivateFieldGet(this, _DadsLayoutShell_sidebarSlot, "f")) {
        __classPrivateFieldGet(this, _DadsLayoutShell_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsLayoutShell_sidebarSlot, "f"), 'slotchange', sync));
    }
    if (__classPrivateFieldGet(this, _DadsLayoutShell_asideSlot, "f")) {
        __classPrivateFieldGet(this, _DadsLayoutShell_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsLayoutShell_asideSlot, "f"), 'slotchange', sync));
    }
    if (__classPrivateFieldGet(this, _DadsLayoutShell_footerSlot, "f")) {
        __classPrivateFieldGet(this, _DadsLayoutShell_subscriptions, "f").push(subscribe(__classPrivateFieldGet(this, _DadsLayoutShell_footerSlot, "f"), 'slotchange', sync));
    }
}, _DadsLayoutShell_setupLightDomObserver = function _DadsLayoutShell_setupLightDomObserver() {
    __classPrivateFieldGet(this, _DadsLayoutShell_lightDomObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsLayoutShell_lightDomObserver, null, "f");
    if (typeof MutationObserver === 'undefined')
        return;
    __classPrivateFieldSet(this, _DadsLayoutShell_lightDomObserver, new MutationObserver(() => {
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncSlotFlags).call(this);
        __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_syncLayoutState).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsLayoutShell_lightDomObserver, "f").observe(this, {
        childList: true,
        subtree: false,
        attributes: true,
        attributeFilter: ['slot'],
    });
}, _DadsLayoutShell_syncPatternAttribute = function _DadsLayoutShell_syncPatternAttribute() {
    const normalized = normalizePattern(this.getAttribute('pattern'));
    if (this.getAttribute('pattern') !== normalized) {
        this.setAttribute('pattern', normalized);
    }
}, _DadsLayoutShell_syncModeAttribute = function _DadsLayoutShell_syncModeAttribute() {
    const normalized = normalizeMode(this.getAttribute('mode'));
    if (this.getAttribute('mode') !== normalized) {
        this.setAttribute('mode', normalized);
    }
}, _DadsLayoutShell_syncMobileSidebarAttribute = function _DadsLayoutShell_syncMobileSidebarAttribute() {
    const normalized = normalizeMobileSidebar(this.getAttribute('mobile-sidebar'));
    if (this.getAttribute('mobile-sidebar') !== normalized) {
        this.setAttribute('mobile-sidebar', normalized);
    }
}, _DadsLayoutShell_resolveEffectiveMode = function _DadsLayoutShell_resolveEffectiveMode() {
    const mode = normalizeMode(this.getAttribute('mode'));
    if (mode !== AUTO_MODE)
        return mode;
    return resolveAutoMode();
}, _DadsLayoutShell_hasDirectSlotElement = function _DadsLayoutShell_hasDirectSlotElement(slotName) {
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].getAttribute('slot') === slotName)
            return true;
    }
    return false;
}, _DadsLayoutShell_syncSlotFlags = function _DadsLayoutShell_syncSlotFlags() {
    const hasHeader = hasSlotContent(__classPrivateFieldGet(this, _DadsLayoutShell_headerSlot, "f")) || __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_hasDirectSlotElement).call(this, 'header');
    const hasSidebar = hasSlotContent(__classPrivateFieldGet(this, _DadsLayoutShell_sidebarSlot, "f")) || __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_hasDirectSlotElement).call(this, 'sidebar');
    const hasAside = hasSlotContent(__classPrivateFieldGet(this, _DadsLayoutShell_asideSlot, "f")) || __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_hasDirectSlotElement).call(this, 'aside');
    const hasFooter = hasSlotContent(__classPrivateFieldGet(this, _DadsLayoutShell_footerSlot, "f")) || __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_hasDirectSlotElement).call(this, 'footer');
    this.toggleAttribute('data-has-header', hasHeader);
    this.toggleAttribute('data-has-sidebar', hasSidebar);
    this.toggleAttribute('data-has-aside', hasAside);
    this.toggleAttribute('data-has-footer', hasFooter);
}, _DadsLayoutShell_syncLayoutState = function _DadsLayoutShell_syncLayoutState() {
    const pattern = normalizePattern(this.getAttribute('pattern'));
    const effectiveMode = __classPrivateFieldGet(this, _DadsLayoutShell_instances, "m", _DadsLayoutShell_resolveEffectiveMode).call(this);
    const mobileSidebar = normalizeMobileSidebar(this.getAttribute('mobile-sidebar'));
    this.setAttribute('data-effective-pattern', pattern);
    this.setAttribute('data-effective-mode', effectiveMode);
    const hasHeader = this.hasAttribute('data-has-header');
    const hasSidebar = this.hasAttribute('data-has-sidebar');
    const hasAside = this.hasAttribute('data-has-aside');
    const hasFooter = this.hasAttribute('data-has-footer');
    let showSidebar = false;
    let showAside = false;
    let sidebarState = 'hidden';
    let bodyLayout = 'single';
    if (pattern === 'app-shell') {
        if (effectiveMode === 'desktop') {
            showSidebar = hasSidebar;
            sidebarState = showSidebar ? 'full' : 'hidden';
            bodyLayout = showSidebar ? 'app-shell' : 'single';
        }
        else if (effectiveMode === 'tablet') {
            showSidebar = hasSidebar;
            sidebarState = showSidebar ? 'rail' : 'hidden';
            bodyLayout = showSidebar ? 'app-shell-rail' : 'single';
        }
        else {
            if (mobileSidebar === 'hidden') {
                showSidebar = false;
                sidebarState = 'hidden';
                bodyLayout = 'single';
            }
            else {
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
            }
            else if (showSidebar) {
                bodyLayout = 'app-shell';
            }
            else if (showAside) {
                bodyLayout = 'master-detail';
            }
            else {
                bodyLayout = 'single';
            }
        }
        else if (effectiveMode === 'tablet') {
            showSidebar = hasSidebar;
            sidebarState = showSidebar ? 'rail' : 'hidden';
            if (showSidebar && showAside) {
                bodyLayout = 'three-pane-tablet';
            }
            else if (showSidebar) {
                bodyLayout = 'app-shell-rail';
            }
            else if (showAside) {
                bodyLayout = 'master-detail-stacked';
            }
            else {
                bodyLayout = 'single';
            }
        }
        else {
            const allowMobileSidebar = mobileSidebar !== 'hidden';
            showSidebar = hasSidebar && allowMobileSidebar;
            sidebarState = showSidebar ? 'full' : 'hidden';
            if (showSidebar && showAside) {
                bodyLayout = mobileSidebar === 'top'
                    ? 'three-pane-mobile-top'
                    : 'three-pane-mobile-bottom';
            }
            else if (showAside) {
                bodyLayout = 'master-detail-stacked';
            }
            else if (showSidebar) {
                bodyLayout = mobileSidebar === 'top'
                    ? 'app-shell-mobile-stacked-top'
                    : 'app-shell-mobile-stacked-bottom';
            }
            else {
                bodyLayout = 'single';
            }
        }
    }
    this.setAttribute('data-sidebar-state', sidebarState);
    this.setAttribute('data-body-layout', bodyLayout);
    __classPrivateFieldGet(this, _DadsLayoutShell_headerPart, "f")?.toggleAttribute('hidden', !hasHeader);
    __classPrivateFieldGet(this, _DadsLayoutShell_sidebarPart, "f")?.toggleAttribute('hidden', !showSidebar);
    __classPrivateFieldGet(this, _DadsLayoutShell_asidePart, "f")?.toggleAttribute('hidden', !showAside);
    __classPrivateFieldGet(this, _DadsLayoutShell_footerPart, "f")?.toggleAttribute('hidden', !hasFooter);
};
DadsLayoutShell.definition = {
    name: 'dads-layout-shell',
    template: html `
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
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        layoutShellTokens,
        layoutShellStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('pattern'),
        PropertyAttr('mode'),
        PropertyAttr('mobileSidebar', 'mobile-sidebar'),
    ],
};
