/**
 * @module page-navigation
 * デジタル庁デザインシステム Page Navigation コンポーネント
 * @version 1.1.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { pageNavigationTokens } from './page-navigation-tokens.js';
import { pageNavigationStyles } from './page-navigation-styles.js';
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

const DEFAULT_NAV_LABEL = 'ページナビゲーション';
const DEFAULT_PREV_LABEL = '前のページ';
const DEFAULT_NEXT_LABEL = '次のページ';
const DEFAULT_STATUS_SEPARATOR = '/';

/**
 * prev/next イベントの detail 型
 */
export interface PageNavigationEventDetail {
  originalEvent: MouseEvent;
}

function toFormattedNumberText(value: string | null): string | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
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
  static definition = {
    name: 'dads-page-navigation',
    template: html`
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
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        pageNavigationTokens,
        pageNavigationStyles,
        applyDADSFocusStyles(),
      ],
      'minimal',
    ),
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

  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'ページナビゲーション（アクセシビリティ注釈）',
    categories: {
      semantics: [
        '内部は <nav> 要素を使用し、ページ移動のまとまりを示します。',
        'as="link" 時は <a rel="prev|next"> を使用します（href未指定時は非表示）。',
        'as="button" 時は <button> を使用し、クリックでイベントを発火します。',
      ],
      keyboard: [
        'リンク: Tabでフォーカス、Enterで遷移（ネイティブ挙動）。',
        'ボタン: Tabでフォーカス、Enter/Spaceでイベント発火（ネイティブ挙動）。',
      ],
      zoom: [
        'コンテンツ幅に応じてレイアウトが追従し、狭い幅では左寄せレイアウトに切り替えます。',
      ],
      states: [
        'type属性で表示タイプ（text/outlined/arrow）を切り替えます。',
        'arrowタイプはsize属性（l/m/s/xs）でコントロールのサイズを切り替えます。',
        'as="button" 時は disabled-prev / disabled-next で非表示にできます。',
      ],
      labels: [
        'navの aria-label は aria-label 属性で上書きできます。',
        'arrowタイプはラベルを視覚的に隠しつつ、スクリーンリーダー向けの名称を維持します。',
        'ステータス表示は slot/status属性/current+total から構成できます。',
      ],
      motion: ['アニメーションは使用しません。'],
    },
    callouts: [
      {
        id: 'prev',
        title: '前へ',
        label: 'prev',
        category: 'keyboard',
        target: { scope: 'shadow', selector: '[part~="prev"]:not([hidden])' },
        placement: 'top-left',
      },
      {
        id: 'status',
        title: 'ステータス',
        label: 'status',
        category: 'labels',
        target: { scope: 'shadow', selector: '[part~="status"]' },
        placement: 'top-right',
      },
      {
        id: 'next',
        title: '次へ',
        label: 'next',
        category: 'keyboard',
        target: { scope: 'shadow', selector: '[part~="next"]:not([hidden])' },
        placement: 'bottom-right',
      },
    ],
  };

  #nav: HTMLElement | null = null;
  #prevLink: HTMLAnchorElement | null = null;
  #nextLink: HTMLAnchorElement | null = null;
  #prevButton: HTMLButtonElement | null = null;
  #nextButton: HTMLButtonElement | null = null;
  #prevLinkLabelEl: HTMLElement | null = null;
  #nextLinkLabelEl: HTMLElement | null = null;
  #prevButtonLabelEl: HTMLElement | null = null;
  #nextButtonLabelEl: HTMLElement | null = null;
  #statusWrapper: HTMLElement | null = null;
  #statusSlot: HTMLSlotElement | null = null;
  #statusFallback: HTMLElement | null = null;

  connectedCallback() {
    super.connectedCallback();

    this.#nav = this.shadowRoot?.getElementById('nav') as HTMLElement | null;
    this.#prevLink = this.shadowRoot?.getElementById('prev-link') as HTMLAnchorElement | null;
    this.#nextLink = this.shadowRoot?.getElementById('next-link') as HTMLAnchorElement | null;
    this.#prevButton = this.shadowRoot?.getElementById('prev-button') as HTMLButtonElement | null;
    this.#nextButton = this.shadowRoot?.getElementById('next-button') as HTMLButtonElement | null;
    this.#prevLinkLabelEl = this.shadowRoot?.getElementById('prev-link-label') as HTMLElement | null;
    this.#nextLinkLabelEl = this.shadowRoot?.getElementById('next-link-label') as HTMLElement | null;
    this.#prevButtonLabelEl = this.shadowRoot?.getElementById('prev-button-label') as HTMLElement | null;
    this.#nextButtonLabelEl = this.shadowRoot?.getElementById('next-button-label') as HTMLElement | null;
    this.#statusWrapper = this.shadowRoot?.getElementById('status') as HTMLElement | null;
    this.#statusSlot = this.shadowRoot?.getElementById('status-slot') as HTMLSlotElement | null;
    this.#statusFallback = this.shadowRoot?.getElementById('status-fallback') as HTMLElement | null;

    if (!this.hasAttribute('type')) this.setAttribute('type', 'text');
    if (!this.hasAttribute('size')) this.setAttribute('size', 'm');
    if (!this.hasAttribute('status-separator')) this.setAttribute('status-separator', DEFAULT_STATUS_SEPARATOR);

    this.#statusSlot?.addEventListener('slotchange', this.#handleStatusSlotChange);
    this.#prevButton?.addEventListener('click', this.#handlePrevClick);
    this.#nextButton?.addEventListener('click', this.#handleNextClick);
    this.#syncAll();
  }

  disconnectedCallback() {
    this.#statusSlot?.removeEventListener('slotchange', this.#handleStatusSlotChange);
    this.#prevButton?.removeEventListener('click', this.#handlePrevClick);
    this.#nextButton?.removeEventListener('click', this.#handleNextClick);
  }

  // Layout-only attributes
  typeChanged(): void {
    this.#syncLayout();
  }
  sizeChanged(): void {
    this.#syncLayout();
  }
  fillChanged(): void {
    this.#syncLayout();
  }

  // Control + layout attributes
  asChanged(): void {
    this.#syncControlsAndLayout();
  }
  prevHrefChanged(): void {
    this.#syncControlsAndLayout();
  }
  nextHrefChanged(): void {
    this.#syncControlsAndLayout();
  }

  // Control-only attributes
  prevLabelChanged(): void {
    this.#syncControls();
  }
  nextLabelChanged(): void {
    this.#syncControls();
  }
  disabledPrevChanged(): void {
    this.#syncControls();
  }
  disabledNextChanged(): void {
    this.#syncControls();
  }

  // Nav label
  ariaLabelChanged(): void {
    this.#syncNavLabel();
  }

  // Status + layout attributes
  hideStatusChanged(): void {
    this.#syncStatusAndLayout();
  }
  statusChanged(): void {
    this.#syncStatusAndLayout();
  }
  currentChanged(): void {
    this.#syncStatusAndLayout();
  }
  totalChanged(): void {
    this.#syncStatusAndLayout();
  }
  statusSeparatorChanged(): void {
    this.#syncStatusAndLayout();
  }

  #handleStatusSlotChange = (): void => {
    this.#syncStatusAndLayout();
  };

  #handlePrevClick = (event: MouseEvent): void => {
    this.#emitNavigationEvent('prev', event);
  };

  #handleNextClick = (event: MouseEvent): void => {
    this.#emitNavigationEvent('next', event);
  };

  #emitNavigationEvent(type: 'prev' | 'next', originalEvent: MouseEvent): void {
    const detail: PageNavigationEventDetail = { originalEvent };
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  }

  #isButtonMode(): boolean {
    return this.getAttribute('as') === 'button';
  }

  #syncControlsAndLayout(): void {
    this.#syncControls();
    this.#syncLayout();
  }

  #syncStatusAndLayout(): void {
    this.#syncStatus();
    this.#syncLayout();
  }

  #syncAll(): void {
    this.#syncNavLabel();
    this.#syncControls();
    this.#syncStatus();
    this.#syncLayout();
  }

  #syncNavLabel(): void {
    if (!this.#nav) return;
    const label = this.getAttribute('aria-label') || DEFAULT_NAV_LABEL;
    this.#nav.setAttribute('aria-label', label);
  }

  #syncControls(): void {
    const isButton = this.#isButtonMode();
    const prevHref = this.getAttribute('prev-href');
    const nextHref = this.getAttribute('next-href');
    const prevLabel = this.getAttribute('prev-label') || DEFAULT_PREV_LABEL;
    const nextLabel = this.getAttribute('next-label') || DEFAULT_NEXT_LABEL;

    // Link visibility and href
    this.#updateLinkControl(this.#prevLink, !isButton && Boolean(prevHref), prevHref);
    this.#updateLinkControl(this.#nextLink, !isButton && Boolean(nextHref), nextHref);

    // Button visibility
    const disabledPrev = this.hasAttribute('disabled-prev');
    const disabledNext = this.hasAttribute('disabled-next');
    this.#prevButton?.toggleAttribute('hidden', !isButton || disabledPrev);
    this.#nextButton?.toggleAttribute('hidden', !isButton || disabledNext);

    // Labels (all elements at once)
    this.#setTextContent([this.#prevLinkLabelEl, this.#prevButtonLabelEl], prevLabel);
    this.#setTextContent([this.#nextLinkLabelEl, this.#nextButtonLabelEl], nextLabel);
  }

  #updateLinkControl(link: HTMLAnchorElement | null, show: boolean, href: string | null): void {
    if (!link) return;
    link.toggleAttribute('hidden', !show);
    if (show && href) {
      link.setAttribute('href', href);
    }
  }

  #setTextContent(elements: (HTMLElement | null)[], text: string): void {
    for (const el of elements) {
      if (el) el.textContent = text;
    }
  }

  #syncStatus(): void {
    if (!this.#statusWrapper || !this.#statusFallback || !this.#statusSlot) return;

    // Hidden status: early return
    if (this.hasAttribute('hide-status')) {
      this.#statusWrapper.setAttribute('hidden', '');
      return;
    }

    // Determine status text and visibility
    const statusContent = this.#computeStatusContent();
    this.#statusFallback.textContent = statusContent ?? '';
    this.#statusWrapper.toggleAttribute('hidden', statusContent === null);
  }

  #computeStatusContent(): string | null {
    // Priority 1: Slotted content
    const hasSlotted =
      this.querySelector('[slot="status"]') !== null ||
      (this.#statusSlot?.assignedNodes({ flatten: true }).length ?? 0) > 0;
    if (hasSlotted) return '';

    // Priority 2: status attribute
    const statusText = this.getAttribute('status');
    if (statusText) return statusText;

    // Priority 3: current/total
    const currentText = toFormattedNumberText(this.getAttribute('current'));
    const totalText = toFormattedNumberText(this.getAttribute('total'));
    if (currentText != null && totalText != null) {
      const separator = this.getAttribute('status-separator') ?? DEFAULT_STATUS_SEPARATOR;
      return `${currentText}${separator}${totalText}`;
    }

    return null;
  }

  #syncLayout(): void {
    if (!this.#nav) return;

    const [prevEl, nextEl] = this.#isButtonMode()
      ? [this.#prevButton, this.#nextButton]
      : [this.#prevLink, this.#nextLink];

    const hasBoth = this.#isVisible(prevEl) && this.#isVisible(nextEl);
    this.#nav.setAttribute('data-layout', hasBoth ? 'balanced' : 'start');
    this.#nav.toggleAttribute('data-fill', this.hasAttribute('fill'));
  }

  #isVisible(el: HTMLElement | null): boolean {
    return el != null && !el.hasAttribute('hidden');
  }
}
