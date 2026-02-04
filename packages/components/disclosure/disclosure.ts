/**
 * @module disclosure
 * デジタル庁デザインシステム Disclosure（ディスクロージャー）コンポーネント
 * @version 1.0.0
 */

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
  #details: HTMLDetailsElement | null = null;
  #summary: HTMLElement | null = null;
  #backLink: HTMLAnchorElement | null = null;
  #backLinkObserver: MutationObserver | null = null;


  static definition = {
    name: 'dads-disclosure',
    template: html`
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
    styles: withReset(
      [applyDADSTokens(), applySpacingTokens(), disclosureTokens, disclosureStyles, applyDADSFocusStyles()],
      'minimal',
    ),
    attributes: [BooleanAttr('open')],
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.#details = this.shadowRoot?.querySelector('[part="details"]') as HTMLDetailsElement | null;
    this.#summary = this.shadowRoot?.querySelector('[part="summary"]') as HTMLElement | null;
    this.#backLink = this.shadowRoot?.querySelector('[part="back-link"]') as HTMLAnchorElement | null;

    // 初期状態を同期（attribute -> details.open）
    this.#syncOpen();

    this.#details?.addEventListener('toggle', this.#handleToggle);

    this.#backLink?.addEventListener('click', this.#handleBackLinkClick);

    // slotchange は環境によって発火/実装差があるため、Light DOM を MutationObserver で監視する
    this.#backLinkObserver = new MutationObserver(() => this.#syncBackLinkVisibility());
    this.#backLinkObserver.observe(this, {
      attributes: true,
      attributeFilter: ['slot'],
      characterData: true,
      childList: true,
      subtree: true,
    });
    this.#syncBackLinkVisibility();
  }

  disconnectedCallback(): void {
    this.#details?.removeEventListener('toggle', this.#handleToggle);
    this.#backLink?.removeEventListener('click', this.#handleBackLinkClick);
    this.#backLinkObserver?.disconnect();
    this.#backLinkObserver = null;
  }

  // BooleanAttr('open') により自動で呼ばれる（openChanged）
  openChanged(_oldValue: string | null, newValue: string | null): void {
    const shouldOpen = newValue !== null;
    if (this.#details && this.#details.open !== shouldOpen) {
      this.#details.open = shouldOpen;
    }
  }

  #handleToggle = (): void => {
    if (!this.#details) return;

    // details.open -> host[open] を同期
    const isOpen = this.#details.open;
    this.toggleAttribute('open', isOpen);

    // hostからbubblesするイベントとして再送出（外側で監視しやすい）
    this.dispatchEvent(new Event('toggle', { bubbles: true }));
  };

  #syncOpen(): void {
    if (!this.#details) return;
    const shouldOpen = this.hasAttribute('open');
    if (this.#details.open !== shouldOpen) {
      this.#details.open = shouldOpen;
    }
  }

  #syncBackLinkVisibility = (): void => {
    const hasContent = Array.from(this.querySelectorAll('[slot="back-link"]')).some(
      (node) => (node.textContent ?? '').trim() !== '',
    );
    this.toggleAttribute('data-has-back-link', hasContent);
  };

  #handleBackLinkClick = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const summary = this.#summary;
    if (!summary) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    summary.scrollIntoView({ behavior, block: 'start' });
    summary.focus();
  };
}
