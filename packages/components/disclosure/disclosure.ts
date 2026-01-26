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
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

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

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'ディスクロージャーコンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部は <details>/<summary> で実装し、ネイティブの開閉セマンティクス（open）を利用します。',
        '見出し（slot="summary"）が summary の主要ラベルになります。',
        '本文（slot="content"）は open のときに表示されます（detailsのネイティブ挙動）。',
        'back-link（slot="back-link"）は任意で、未指定の場合は表示しません。',
      ],
      keyboard: [
        'summary は Tab でフォーカスでき、Enter/Space で開閉できます（ネイティブ挙動）。',
        'back-link が表示されている場合、Tab でフォーカスでき、クリック/Enter で見出しへ戻れます。',
      ],
      zoom: [
        '見出し/本文はテキストの折り返しを前提にし、ズーム/文字サイズ変更でも情報が欠けないことを想定します。',
      ],
      states: [
        'open 属性で初期状態を制御でき、ユーザー操作と同期します。',
        'アイコンは open 状態で回転し、開閉状態を視覚的に補助します。',
      ],
      labels: [
        'summary のラベルは slot="summary" のテキストで決まります。',
        'back-link のラベルは slot="back-link" で提供します。',
      ],
      motion: [
        'back-link は summary へスクロール+フォーカスします（prefers-reduced-motion を考慮します）。',
      ],
    },
    callouts: [
      {
        id: 'summary',
        title: 'summary（見出し）',
        label: '<summary>',
        description: '展開/折りたたみの操作起点。',
        category: 'keyboard',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="summary"]' },
      },
      {
        id: 'icon',
        title: '開閉状態アイコン',
        label: 'aria-hidden="true"',
        description: '開閉状態を視覚的に示すアイコン（aria-hidden）。',
        category: 'states',
        placement: 'top-left',
        target: { scope: 'shadow', selector: '[part="icon"]' },
      },
      {
        id: 'content',
        title: 'content（本文）',
        label: 'slot="content"',
        description: '展開時に表示される本文領域。',
        category: 'semantics',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="content"]' },
      },
      {
        id: 'back-link',
        title: '先頭に戻るリンク（任意）',
        label: 'slot="back-link"',
        description: '本文内から見出しへ戻る補助リンク。未指定の場合は表示しません。',
        category: 'labels',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="back-link"]' },
      },
    ],
  };

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
