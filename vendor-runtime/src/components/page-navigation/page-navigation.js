/**
 * @module page-navigation
 * デジタル庁デザインシステム Page Navigation コンポーネント
 * @version 1.1.0
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
var _DadsPageNavigation_instances, _DadsPageNavigation_nav, _DadsPageNavigation_prevLink, _DadsPageNavigation_nextLink, _DadsPageNavigation_prevButton, _DadsPageNavigation_nextButton, _DadsPageNavigation_prevLinkLabelEl, _DadsPageNavigation_nextLinkLabelEl, _DadsPageNavigation_prevButtonLabelEl, _DadsPageNavigation_nextButtonLabelEl, _DadsPageNavigation_statusWrapper, _DadsPageNavigation_statusSlot, _DadsPageNavigation_statusFallback, _DadsPageNavigation_handleStatusSlotChange, _DadsPageNavigation_handlePrevClick, _DadsPageNavigation_handleNextClick, _DadsPageNavigation_emitNavigationEvent, _DadsPageNavigation_isButtonMode, _DadsPageNavigation_syncControlsAndLayout, _DadsPageNavigation_syncStatusAndLayout, _DadsPageNavigation_syncAll, _DadsPageNavigation_syncNavLabel, _DadsPageNavigation_syncControls, _DadsPageNavigation_updateLinkControl, _DadsPageNavigation_setTextContent, _DadsPageNavigation_syncStatus, _DadsPageNavigation_computeStatusContent, _DadsPageNavigation_syncLayout, _DadsPageNavigation_isVisible;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { pageNavigationTokens } from './page-navigation-tokens.js';
import { pageNavigationStyles } from './page-navigation-styles.js';
const DEFAULT_NAV_LABEL = 'ページナビゲーション';
const DEFAULT_PREV_LABEL = '前のページ';
const DEFAULT_NEXT_LABEL = '次のページ';
const DEFAULT_STATUS_SEPARATOR = '/';
function toFormattedNumberText(value) {
    if (value == null || value === '')
        return null;
    const n = Number(value);
    if (!Number.isFinite(n))
        return value;
    return new Intl.NumberFormat().format(n);
}
/**
 * Page Navigation コンポーネント
 *
 * @customElement dads-page-navigation
 * @tagname dads-page-navigation
 *
 * @slot status - 任意のステータス表示（例: `1/24`, `9,999 / 9,999`, `全120件 1/24`）
 *
 * @csspart nav - ナビゲーションルート（nav要素）
 * @csspart control - コントロール（a/button要素）
 * @csspart prev - 前へコントロール
 * @csspart next - 次へコントロール
 * @csspart icon - 矢印アイコン（svg）
 * @csspart label - コントロールラベル
 * @csspart status - ステータス表示
 *
 * @attr {string} type - 表示タイプ（text | outlined | arrow）
 * @attr {string} size - サイズ（arrowのみ: l | m | s | xs）
 * @attr {string} as - レンダリング要素（link | button）デフォルト: link
 * @attr {string} prev-href - 前へリンク先（as="link" 時のみ有効）
 * @attr {string} next-href - 次へリンク先（as="link" 時のみ有効）
 * @attr {string} prev-label - 前へラベル（例: 前のページ / 前の3件）
 * @attr {string} next-label - 次へラベル（例: 次のページ / 次の3件）
 * @attr {boolean} disabled-prev - 前ボタン非表示（as="button" 時のみ有効）
 * @attr {boolean} disabled-next - 次ボタン非表示（as="button" 時のみ有効）
 * @attr {string} status - ステータス文字列（slot未指定時のフォールバック）
 * @attr {string} status-separator - current/total の区切り（デフォルト: `/`、例: ` / `）
 * @attr {string} current - 現在値（数値文字列）
 * @attr {string} total - 総数（数値文字列）
 * @attr {boolean} hide-status - ステータスを強制的に非表示
 * @attr {boolean} fill - コントロールをコンテナ幅いっぱいに広げる（両側が50%ずつ）
 * @attr {string} aria-label - ナビゲーションのラベル（デフォルト: ページナビゲーション）
 *
 * @fires prev - 前ボタンクリック時（as="button" 時のみ）
 * @fires next - 次ボタンクリック時（as="button" 時のみ）
 */
export class DadsPageNavigation extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsPageNavigation_instances.add(this);
        _DadsPageNavigation_nav.set(this, null);
        _DadsPageNavigation_prevLink.set(this, null);
        _DadsPageNavigation_nextLink.set(this, null);
        _DadsPageNavigation_prevButton.set(this, null);
        _DadsPageNavigation_nextButton.set(this, null);
        _DadsPageNavigation_prevLinkLabelEl.set(this, null);
        _DadsPageNavigation_nextLinkLabelEl.set(this, null);
        _DadsPageNavigation_prevButtonLabelEl.set(this, null);
        _DadsPageNavigation_nextButtonLabelEl.set(this, null);
        _DadsPageNavigation_statusWrapper.set(this, null);
        _DadsPageNavigation_statusSlot.set(this, null);
        _DadsPageNavigation_statusFallback.set(this, null);
        _DadsPageNavigation_handleStatusSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatusAndLayout).call(this);
        });
        _DadsPageNavigation_handlePrevClick.set(this, (event) => {
            __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_emitNavigationEvent).call(this, 'prev', event);
        });
        _DadsPageNavigation_handleNextClick.set(this, (event) => {
            __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_emitNavigationEvent).call(this, 'next', event);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsPageNavigation_nav, this.shadowRoot?.getElementById('nav'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_prevLink, this.shadowRoot?.getElementById('prev-link'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_nextLink, this.shadowRoot?.getElementById('next-link'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_prevButton, this.shadowRoot?.getElementById('prev-button'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_nextButton, this.shadowRoot?.getElementById('next-button'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_prevLinkLabelEl, this.shadowRoot?.getElementById('prev-link-label'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_nextLinkLabelEl, this.shadowRoot?.getElementById('next-link-label'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_prevButtonLabelEl, this.shadowRoot?.getElementById('prev-button-label'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_nextButtonLabelEl, this.shadowRoot?.getElementById('next-button-label'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_statusWrapper, this.shadowRoot?.getElementById('status'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_statusSlot, this.shadowRoot?.getElementById('status-slot'), "f");
        __classPrivateFieldSet(this, _DadsPageNavigation_statusFallback, this.shadowRoot?.getElementById('status-fallback'), "f");
        if (!this.hasAttribute('type'))
            this.setAttribute('type', 'text');
        if (!this.hasAttribute('size'))
            this.setAttribute('size', 'm');
        if (!this.hasAttribute('status-separator'))
            this.setAttribute('status-separator', DEFAULT_STATUS_SEPARATOR);
        __classPrivateFieldGet(this, _DadsPageNavigation_statusSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsPageNavigation_handleStatusSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsPageNavigation_prevButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsPageNavigation_handlePrevClick, "f"));
        __classPrivateFieldGet(this, _DadsPageNavigation_nextButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsPageNavigation_handleNextClick, "f"));
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsPageNavigation_statusSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsPageNavigation_handleStatusSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsPageNavigation_prevButton, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsPageNavigation_handlePrevClick, "f"));
        __classPrivateFieldGet(this, _DadsPageNavigation_nextButton, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsPageNavigation_handleNextClick, "f"));
    }
    // Layout-only attributes
    typeChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncLayout).call(this);
    }
    sizeChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncLayout).call(this);
    }
    fillChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncLayout).call(this);
    }
    // Control + layout attributes
    asChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControlsAndLayout).call(this);
    }
    prevHrefChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControlsAndLayout).call(this);
    }
    nextHrefChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControlsAndLayout).call(this);
    }
    // Control-only attributes
    prevLabelChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControls).call(this);
    }
    nextLabelChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControls).call(this);
    }
    disabledPrevChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControls).call(this);
    }
    disabledNextChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControls).call(this);
    }
    // Nav label
    ariaLabelChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncNavLabel).call(this);
    }
    // Status + layout attributes
    hideStatusChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatusAndLayout).call(this);
    }
    statusChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatusAndLayout).call(this);
    }
    currentChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatusAndLayout).call(this);
    }
    totalChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatusAndLayout).call(this);
    }
    statusSeparatorChanged() {
        __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatusAndLayout).call(this);
    }
}
_DadsPageNavigation_nav = new WeakMap(), _DadsPageNavigation_prevLink = new WeakMap(), _DadsPageNavigation_nextLink = new WeakMap(), _DadsPageNavigation_prevButton = new WeakMap(), _DadsPageNavigation_nextButton = new WeakMap(), _DadsPageNavigation_prevLinkLabelEl = new WeakMap(), _DadsPageNavigation_nextLinkLabelEl = new WeakMap(), _DadsPageNavigation_prevButtonLabelEl = new WeakMap(), _DadsPageNavigation_nextButtonLabelEl = new WeakMap(), _DadsPageNavigation_statusWrapper = new WeakMap(), _DadsPageNavigation_statusSlot = new WeakMap(), _DadsPageNavigation_statusFallback = new WeakMap(), _DadsPageNavigation_handleStatusSlotChange = new WeakMap(), _DadsPageNavigation_handlePrevClick = new WeakMap(), _DadsPageNavigation_handleNextClick = new WeakMap(), _DadsPageNavigation_instances = new WeakSet(), _DadsPageNavigation_emitNavigationEvent = function _DadsPageNavigation_emitNavigationEvent(type, originalEvent) {
    const detail = { originalEvent };
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}, _DadsPageNavigation_isButtonMode = function _DadsPageNavigation_isButtonMode() {
    return this.getAttribute('as') === 'button';
}, _DadsPageNavigation_syncControlsAndLayout = function _DadsPageNavigation_syncControlsAndLayout() {
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControls).call(this);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncLayout).call(this);
}, _DadsPageNavigation_syncStatusAndLayout = function _DadsPageNavigation_syncStatusAndLayout() {
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatus).call(this);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncLayout).call(this);
}, _DadsPageNavigation_syncAll = function _DadsPageNavigation_syncAll() {
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncNavLabel).call(this);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncControls).call(this);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncStatus).call(this);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_syncLayout).call(this);
}, _DadsPageNavigation_syncNavLabel = function _DadsPageNavigation_syncNavLabel() {
    if (!__classPrivateFieldGet(this, _DadsPageNavigation_nav, "f"))
        return;
    const label = this.getAttribute('aria-label') || DEFAULT_NAV_LABEL;
    __classPrivateFieldGet(this, _DadsPageNavigation_nav, "f").setAttribute('aria-label', label);
}, _DadsPageNavigation_syncControls = function _DadsPageNavigation_syncControls() {
    const isButton = __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_isButtonMode).call(this);
    const prevHref = this.getAttribute('prev-href');
    const nextHref = this.getAttribute('next-href');
    const prevLabel = this.getAttribute('prev-label') || DEFAULT_PREV_LABEL;
    const nextLabel = this.getAttribute('next-label') || DEFAULT_NEXT_LABEL;
    // Link visibility and href
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_updateLinkControl).call(this, __classPrivateFieldGet(this, _DadsPageNavigation_prevLink, "f"), !isButton && Boolean(prevHref), prevHref);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_updateLinkControl).call(this, __classPrivateFieldGet(this, _DadsPageNavigation_nextLink, "f"), !isButton && Boolean(nextHref), nextHref);
    // Button visibility
    const disabledPrev = this.hasAttribute('disabled-prev');
    const disabledNext = this.hasAttribute('disabled-next');
    __classPrivateFieldGet(this, _DadsPageNavigation_prevButton, "f")?.toggleAttribute('hidden', !isButton || disabledPrev);
    __classPrivateFieldGet(this, _DadsPageNavigation_nextButton, "f")?.toggleAttribute('hidden', !isButton || disabledNext);
    // Labels (all elements at once)
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_setTextContent).call(this, [__classPrivateFieldGet(this, _DadsPageNavigation_prevLinkLabelEl, "f"), __classPrivateFieldGet(this, _DadsPageNavigation_prevButtonLabelEl, "f")], prevLabel);
    __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_setTextContent).call(this, [__classPrivateFieldGet(this, _DadsPageNavigation_nextLinkLabelEl, "f"), __classPrivateFieldGet(this, _DadsPageNavigation_nextButtonLabelEl, "f")], nextLabel);
}, _DadsPageNavigation_updateLinkControl = function _DadsPageNavigation_updateLinkControl(link, show, href) {
    if (!link)
        return;
    link.toggleAttribute('hidden', !show);
    if (show && href) {
        link.setAttribute('href', href);
    }
}, _DadsPageNavigation_setTextContent = function _DadsPageNavigation_setTextContent(elements, text) {
    for (const el of elements) {
        if (el)
            el.textContent = text;
    }
}, _DadsPageNavigation_syncStatus = function _DadsPageNavigation_syncStatus() {
    if (!__classPrivateFieldGet(this, _DadsPageNavigation_statusWrapper, "f") || !__classPrivateFieldGet(this, _DadsPageNavigation_statusFallback, "f") || !__classPrivateFieldGet(this, _DadsPageNavigation_statusSlot, "f"))
        return;
    // Hidden status: early return
    if (this.hasAttribute('hide-status')) {
        __classPrivateFieldGet(this, _DadsPageNavigation_statusWrapper, "f").setAttribute('hidden', '');
        return;
    }
    // Determine status text and visibility
    const statusContent = __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_computeStatusContent).call(this);
    __classPrivateFieldGet(this, _DadsPageNavigation_statusFallback, "f").textContent = statusContent ?? '';
    __classPrivateFieldGet(this, _DadsPageNavigation_statusWrapper, "f").toggleAttribute('hidden', statusContent === null);
}, _DadsPageNavigation_computeStatusContent = function _DadsPageNavigation_computeStatusContent() {
    // Priority 1: Slotted content
    const hasSlotted = this.querySelector('[slot="status"]') !== null ||
        (__classPrivateFieldGet(this, _DadsPageNavigation_statusSlot, "f")?.assignedNodes({ flatten: true }).length ?? 0) > 0;
    if (hasSlotted)
        return '';
    // Priority 2: status attribute
    const statusText = this.getAttribute('status');
    if (statusText)
        return statusText;
    // Priority 3: current/total
    const currentText = toFormattedNumberText(this.getAttribute('current'));
    const totalText = toFormattedNumberText(this.getAttribute('total'));
    if (currentText != null && totalText != null) {
        const separator = this.getAttribute('status-separator') ?? DEFAULT_STATUS_SEPARATOR;
        return `${currentText}${separator}${totalText}`;
    }
    return null;
}, _DadsPageNavigation_syncLayout = function _DadsPageNavigation_syncLayout() {
    if (!__classPrivateFieldGet(this, _DadsPageNavigation_nav, "f"))
        return;
    const [prevEl, nextEl] = __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_isButtonMode).call(this)
        ? [__classPrivateFieldGet(this, _DadsPageNavigation_prevButton, "f"), __classPrivateFieldGet(this, _DadsPageNavigation_nextButton, "f")]
        : [__classPrivateFieldGet(this, _DadsPageNavigation_prevLink, "f"), __classPrivateFieldGet(this, _DadsPageNavigation_nextLink, "f")];
    const hasBoth = __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_isVisible).call(this, prevEl) && __classPrivateFieldGet(this, _DadsPageNavigation_instances, "m", _DadsPageNavigation_isVisible).call(this, nextEl);
    __classPrivateFieldGet(this, _DadsPageNavigation_nav, "f").setAttribute('data-layout', hasBoth ? 'balanced' : 'start');
    __classPrivateFieldGet(this, _DadsPageNavigation_nav, "f").toggleAttribute('data-fill', this.hasAttribute('fill'));
}, _DadsPageNavigation_isVisible = function _DadsPageNavigation_isVisible(el) {
    return el != null && !el.hasAttribute('hidden');
};
DadsPageNavigation.definition = {
    name: 'dads-page-navigation',
    template: html `
      <nav part="nav" id="nav" data-layout="balanced">
        <!-- Link mode (as="link") -->
        <a part="control prev" id="prev-link" rel="prev" hidden>
          <svg part="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 6L8 12L14 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span part="label" id="prev-link-label"></span>
        </a>
        <!-- Button mode (as="button") -->
        <button part="control prev" id="prev-button" type="button" hidden>
          <svg part="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 6L8 12L14 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span part="label" id="prev-button-label"></span>
        </button>

        <span part="status" id="status">
          <slot name="status" id="status-slot"></slot>
          <span id="status-fallback"></span>
        </span>

        <!-- Link mode (as="link") -->
        <a part="control next" id="next-link" rel="next" hidden>
          <span part="label" id="next-link-label"></span>
          <svg part="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 6L16 12L10 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
        <!-- Button mode (as="button") -->
        <button part="control next" id="next-button" type="button" hidden>
          <span part="label" id="next-button-label"></span>
          <svg part="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 6L16 12L10 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </nav>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        pageNavigationTokens,
        pageNavigationStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('type'),
        PropertyAttr('size'),
        PropertyAttr('as'),
        PropertyAttr('prevHref', 'prev-href'),
        PropertyAttr('nextHref', 'next-href'),
        PropertyAttr('prevLabel', 'prev-label'),
        PropertyAttr('nextLabel', 'next-label'),
        BooleanAttr('disabledPrev', 'disabled-prev'),
        BooleanAttr('disabledNext', 'disabled-next'),
        PropertyAttr('status'),
        PropertyAttr('statusSeparator', 'status-separator'),
        PropertyAttr('current'),
        PropertyAttr('total'),
        BooleanAttr('hideStatus', 'hide-status'),
        BooleanAttr('fill'),
        PropertyAttr('ariaLabel', 'aria-label'),
    ],
};
