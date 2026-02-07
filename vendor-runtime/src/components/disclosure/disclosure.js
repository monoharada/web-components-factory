/**
 * @module disclosure
 * デジタル庁デザインシステム Disclosure（ディスクロージャー）コンポーネント
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
var _DadsDisclosure_instances, _DadsDisclosure_details, _DadsDisclosure_summary, _DadsDisclosure_backLink, _DadsDisclosure_backLinkObserver, _DadsDisclosure_handleToggle, _DadsDisclosure_syncOpen, _DadsDisclosure_syncBackLinkVisibility, _DadsDisclosure_handleBackLinkClick;
import { BooleanAttr, html } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { disclosureTokens } from './disclosure-tokens.js';
import { disclosureStyles } from './disclosure-styles.js';
/**
 * Disclosure（ディスクロージャー）コンポーネント
 *
 * @customElement dads-disclosure
 * @tagname dads-disclosure
 *
 * @slot summary - 見出し（summary内）
 * @slot content - 本文
 * @slot back-link - 先頭に戻るリンクのラベル（任意、未指定なら表示しない）
 *
 * @csspart details - <details> 要素
 * @csspart summary - <summary> 要素
 * @csspart icon - 開閉状態アイコン
 * @csspart icon-circle - アイコン内側の円（hover時の反転用）
 * @csspart icon-triangle - アイコン内の三角形（hover時の反転用）
 * @csspart summary-text - 見出しテキストラッパー
 * @csspart content - 本文領域
 * @csspart back-link - 先頭に戻るリンク（任意）
 * @csspart back-link-icon - 戻るリンクのアイコン
 *
 * @attr {boolean} open - 開閉状態（trueでopen）
 *
 * @cssprop --dads-disclosure-gap - summary内のgap
 * @cssprop --dads-disclosure-icon-size - アイコンサイズ
 * @cssprop --dads-disclosure-icon-color - アイコン色
 * @cssprop --dads-disclosure-content-padding-inline-start - 本文のインライン開始padding
 * @cssprop --dads-disclosure-back-link-color - 戻るリンク色
 *
 * @fires toggle - 開閉状態変更時に発火（bubbles）
 *
 * @example
 * ```html
 * <dads-disclosure open>
 *   <span slot="summary">ダミーテキストとは何ですか？</span>
 *   <div slot="content">これはダミーテキストです。</div>
 *   <span slot="back-link">先頭に戻る</span>
 * </dads-disclosure>
 * ```
 */
export class DadsDisclosure extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsDisclosure_instances.add(this);
        _DadsDisclosure_details.set(this, null);
        _DadsDisclosure_summary.set(this, null);
        _DadsDisclosure_backLink.set(this, null);
        _DadsDisclosure_backLinkObserver.set(this, null);
        _DadsDisclosure_handleToggle.set(this, () => {
            if (!__classPrivateFieldGet(this, _DadsDisclosure_details, "f"))
                return;
            // details.open -> host[open] を同期
            const isOpen = __classPrivateFieldGet(this, _DadsDisclosure_details, "f").open;
            this.toggleAttribute('open', isOpen);
            // hostからbubblesするイベントとして再送出（外側で監視しやすい）
            this.dispatchEvent(new Event('toggle', { bubbles: true }));
        });
        _DadsDisclosure_syncBackLinkVisibility.set(this, () => {
            const hasContent = Array.from(this.querySelectorAll('[slot="back-link"]')).some((node) => (node.textContent ?? '').trim() !== '');
            this.toggleAttribute('data-has-back-link', hasContent);
        });
        _DadsDisclosure_handleBackLinkClick.set(this, (event) => {
            event.preventDefault();
            event.stopPropagation();
            const summary = __classPrivateFieldGet(this, _DadsDisclosure_summary, "f");
            if (!summary)
                return;
            const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
            const behavior = prefersReducedMotion ? 'auto' : 'smooth';
            summary.scrollIntoView({ behavior, block: 'start' });
            summary.focus();
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsDisclosure_details, this.shadowRoot?.querySelector('[part="details"]'), "f");
        __classPrivateFieldSet(this, _DadsDisclosure_summary, this.shadowRoot?.querySelector('[part="summary"]'), "f");
        __classPrivateFieldSet(this, _DadsDisclosure_backLink, this.shadowRoot?.querySelector('[part="back-link"]'), "f");
        // 初期状態を同期（attribute -> details.open）
        __classPrivateFieldGet(this, _DadsDisclosure_instances, "m", _DadsDisclosure_syncOpen).call(this);
        __classPrivateFieldGet(this, _DadsDisclosure_details, "f")?.addEventListener('toggle', __classPrivateFieldGet(this, _DadsDisclosure_handleToggle, "f"));
        __classPrivateFieldGet(this, _DadsDisclosure_backLink, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsDisclosure_handleBackLinkClick, "f"));
        // slotchange は環境によって発火/実装差があるため、Light DOM を MutationObserver で監視する
        __classPrivateFieldSet(this, _DadsDisclosure_backLinkObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsDisclosure_syncBackLinkVisibility, "f").call(this)), "f");
        __classPrivateFieldGet(this, _DadsDisclosure_backLinkObserver, "f").observe(this, {
            attributes: true,
            attributeFilter: ['slot'],
            characterData: true,
            childList: true,
            subtree: true,
        });
        __classPrivateFieldGet(this, _DadsDisclosure_syncBackLinkVisibility, "f").call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsDisclosure_details, "f")?.removeEventListener('toggle', __classPrivateFieldGet(this, _DadsDisclosure_handleToggle, "f"));
        __classPrivateFieldGet(this, _DadsDisclosure_backLink, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsDisclosure_handleBackLinkClick, "f"));
        __classPrivateFieldGet(this, _DadsDisclosure_backLinkObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsDisclosure_backLinkObserver, null, "f");
    }
    // BooleanAttr('open') により自動で呼ばれる（openChanged）
    openChanged(_oldValue, newValue) {
        const shouldOpen = newValue !== null;
        if (__classPrivateFieldGet(this, _DadsDisclosure_details, "f") && __classPrivateFieldGet(this, _DadsDisclosure_details, "f").open !== shouldOpen) {
            __classPrivateFieldGet(this, _DadsDisclosure_details, "f").open = shouldOpen;
        }
    }
}
_DadsDisclosure_details = new WeakMap(), _DadsDisclosure_summary = new WeakMap(), _DadsDisclosure_backLink = new WeakMap(), _DadsDisclosure_backLinkObserver = new WeakMap(), _DadsDisclosure_handleToggle = new WeakMap(), _DadsDisclosure_syncBackLinkVisibility = new WeakMap(), _DadsDisclosure_handleBackLinkClick = new WeakMap(), _DadsDisclosure_instances = new WeakSet(), _DadsDisclosure_syncOpen = function _DadsDisclosure_syncOpen() {
    if (!__classPrivateFieldGet(this, _DadsDisclosure_details, "f"))
        return;
    const shouldOpen = this.hasAttribute('open');
    if (__classPrivateFieldGet(this, _DadsDisclosure_details, "f").open !== shouldOpen) {
        __classPrivateFieldGet(this, _DadsDisclosure_details, "f").open = shouldOpen;
    }
};
DadsDisclosure.definition = {
    name: 'dads-disclosure',
    template: html `
      <details part="details">
        <summary part="summary">
          <svg part="icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="currentcolor" />
            <circle part="icon-circle" cx="12" cy="12" r="8" fill="currentcolor" />
            <path part="icon-triangle" d="M17 10H7L12 15L17 10Z" fill="Canvas" />
          </svg>
          <span part="summary-text">
            <slot name="summary"></slot>
          </span>
        </summary>
        <div part="content">
          <slot name="content"></slot>
          <a part="back-link" href="#">
            <svg part="back-link-icon" width="24" height="24" fill="none" aria-hidden="true">
              <path
                d="M6 7V14.5C6 16.8 8.2 19 10.5 19C12.8 19 15 16.8 15 14.5V6M10.709 9.7L15 5.414L19.291 9.7"
                stroke="currentcolor"
                stroke-width="2"
              />
            </svg>
            <slot name="back-link"></slot>
          </a>
        </div>
      </details>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), disclosureTokens, disclosureStyles, applyDADSFocusStyles()], 'minimal'),
    attributes: [BooleanAttr('open')],
};
