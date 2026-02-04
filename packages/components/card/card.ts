/**
 * @module card
 * デジタル庁デザインシステム Cardコンポーネント
 * @version 0.1.0
 */

import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { hasSlotContent } from '../../utils/dom.js';
import { cardTokens } from './card-tokens.js';
import { cardStyles } from './card-styles.js';

type PointerState = {
  id: number | null;
  startX: number;
  startY: number;
  moved: boolean;
};

/**
 * Cardコンポーネント
 *
 * DADS「カード」の構造（コンテナ/メイン/イメージ/サブ）を Web Components として提供します。
 * 最小限のShadow DOM構造（3セクション）で、利用者がLight DOMで自由にマークアップできます。
 *
 * ## 設計思想: Token-Driven Customization
 *
 * カードは視覚的バリエーションが多いレイアウトコンテナのため、`variant`属性は提供しません。
 * 代わりにCSSトークンと`::part()`による柔軟なカスタマイズを推奨します。
 *
 * ```css
 * // "Elevated" スタイルの例
 * dads-card.elevated {
 *   --dads-card-border-width: 0;
 *   box-shadow: var(--elevation-4);
 * }
 *
 * // "Bordered" スタイルの例
 * dads-card.bordered {
 *   --dads-card-border-width: 1px;
 *   --dads-card-border-color: var(--color-neutral-solid-gray-420);
 * }
 * ```
 *
 * ## クリック委譲（カード面クリック）
 *
 * - 主リンク要素に `data-dads-card-primary` を付与します
 * - さらに `data-dads-card-delegate` を付与すると、カード面クリック（pointer）を主リンクへ委譲します
 * - キーボード操作は「主リンクへフォーカスしてEnter」で成立するため、カード自体はフォーカス可能にしません
 *
 * ## 既知の課題と対処法
 *
 * ### overflow: clip問題
 * `::part(base)`の`overflow: clip`がfocus ringやbox-shadowをクリップします。
 * 対処: `dads-card::part(base) { overflow: visible; }` でオーバーライド
 *
 * ### ::slotted() margin問題
 * Shadow DOM内の`::slotted(*) { margin: 0 }`が外部marginを上書きします。
 * 対処: Light DOM要素では`margin`の代わりに`padding`を使用してください。
 *
 * @customElement dads-card
 * @tagname dads-card
 *
 * @slot media - イメージエリア（任意）
 * @slot - メインコンテンツ（デフォルトスロット、h2/p等を自由にマークアップ）
 * @slot sub - サブエリア（任意）
 *
 * @csspart base - コンテナ（overflow制御に使用）
 * @csspart media - イメージエリア（背景・ボーダー等のカスタマイズ）
 * @csspart main - メインエリア（padding・背景のカスタマイズ）
 * @csspart sub - サブエリア（アクション領域のカスタマイズ）
 *
 * @attr {'vertical' | 'horizontal'} layout - レイアウト（デフォルト: vertical）
 *
 * @cssprop --dads-card-background - 背景色
 * @cssprop --dads-card-border-color - 外周色
 * @cssprop --dads-card-border-width - 外周の線幅
 * @cssprop --dads-card-border-radius - 角丸
 * @cssprop --dads-card-divider-color - エリア間の区切り線色（media/sub の境界）
 * @cssprop --dads-card-divider-width - エリア間の区切り線幅
 * @cssprop --dads-card-media-width - layout="horizontal" のメディア列幅
 * @cssprop --dads-card-media-aspect-ratio - メディア領域の aspect-ratio
 * @cssprop --dads-card-padding-block - パディング（上下）
 * @cssprop --dads-card-padding-inline - パディング（左右）
 * @cssprop --dads-card-gap - エリア内の余白
 * @cssprop --dads-card-color - 本文/ラベルなどの文字色
 * @cssprop --dads-card-title-color - タイトル（h1-h6）の文字色
 * @cssprop --dads-card-title-font-size - タイトルのフォントサイズ
 * @cssprop --dads-card-title-font-weight - タイトルのフォントウェイト
 * @cssprop --dads-card-title-line-height - タイトルの行高
 * @cssprop --dads-card-title-letter-spacing - タイトルの字間
 * @cssprop --dads-card-content-color - コンテンツ（p）の文字色
 * @cssprop --dads-card-content-font-size - コンテンツのフォントサイズ
 * @cssprop --dads-card-content-font-weight - コンテンツのフォントウェイト
 * @cssprop --dads-card-content-line-height - コンテンツの行高
 * @cssprop --dads-card-content-letter-spacing - コンテンツの字間
 * @cssprop --dads-card-focus-outline-color - フォーカスアウトライン色（委譲ON時）
 * @cssprop --dads-card-focus-outline-width - フォーカスアウトライン幅（委譲ON時）
 * @cssprop --dads-card-focus-outline-offset - フォーカスアウトラインのオフセット（委譲ON時）
 * @cssprop --dads-card-focus-ring-color - フォーカスリング色（委譲ON時）
 * @cssprop --dads-card-focus-ring-width - フォーカスリング幅（委譲ON時）
 */
export class DadsCard extends TypographyWebComponent {

  static definition = {
    name: 'dads-card',
    template: html`
      <article part="base" id="base">
        <section part="media" id="media" hidden>
          <slot name="media" id="media-slot"></slot>
        </section>

        <section part="main">
          <slot id="main-slot"></slot>
        </section>

        <section part="sub" id="sub" hidden>
          <slot name="sub" id="sub-slot"></slot>
        </section>
      </article>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        cardTokens,
        cardStyles,
        applyDADSFocusStyles(),
      ],
      'minimal',
    ),
    attributes: [PropertyAttr('layout')],
  };

  static get observedAttributes(): string[] {
    return ['layout'];
  }

  #mediaSlot: HTMLSlotElement | null = null;
  #mainSlot: HTMLSlotElement | null = null;
  #subSlot: HTMLSlotElement | null = null;

  #media: HTMLElement | null = null;
  #sub: HTMLElement | null = null;

  #primary: HTMLElement | null = null;
  #mutationObserver: MutationObserver | null = null;

  #pointer: PointerState = { id: null, startX: 0, startY: 0, moved: false };

  connectedCallback(): void {
    super.connectedCallback();

    this.#mediaSlot = this.shadowRoot?.querySelector('#media-slot') as HTMLSlotElement | null;
    this.#mainSlot = this.shadowRoot?.querySelector('#main-slot') as HTMLSlotElement | null;
    this.#subSlot = this.shadowRoot?.querySelector('#sub-slot') as HTMLSlotElement | null;

    this.#media = this.shadowRoot?.querySelector('#media') as HTMLElement | null;
    this.#sub = this.shadowRoot?.querySelector('#sub') as HTMLElement | null;

    const onSlotChange = () => this.#syncAll();
    this.#mediaSlot?.addEventListener('slotchange', onSlotChange);
    this.#mainSlot?.addEventListener('slotchange', onSlotChange);
    this.#subSlot?.addEventListener('slotchange', onSlotChange);

    // Primary link can be inserted/updated from outside; observe light DOM changes.
    this.#mutationObserver = new MutationObserver(() => this.#syncPrimary());
    this.#mutationObserver.observe(this, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-dads-card-primary', 'data-dads-card-delegate'],
    });

    this.addEventListener('pointerdown', this.#handlePointerDown);
    this.addEventListener('pointermove', this.#handlePointerMove);
    this.addEventListener('pointerup', this.#handlePointerUp);
    this.addEventListener('pointercancel', this.#handlePointerUp);
    this.addEventListener('click', this.#handleClick);
    this.addEventListener('focusin', this.#handleFocusIn);
    this.addEventListener('focusout', this.#handleFocusOut);

    this.#syncAll();
  }

  disconnectedCallback(): void {
    this.removeEventListener('pointerdown', this.#handlePointerDown);
    this.removeEventListener('pointermove', this.#handlePointerMove);
    this.removeEventListener('pointerup', this.#handlePointerUp);
    this.removeEventListener('pointercancel', this.#handlePointerUp);
    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('focusin', this.#handleFocusIn);
    this.removeEventListener('focusout', this.#handleFocusOut);

    this.#mutationObserver?.disconnect();
    this.#mutationObserver = null;

    super.disconnectedCallback();
  }

  #syncAll(): void {
    this.#syncAreasVisibility();
    this.#syncPrimary();
  }

  #syncAreasVisibility(): void {
    const hasLightDomSlot = (name: string): boolean => this.querySelector(`[slot="${name}"]`) !== null;

    const hasMedia = hasSlotContent(this.#mediaSlot) || hasLightDomSlot('media');
    const hasSub = hasSlotContent(this.#subSlot) || hasLightDomSlot('sub');

    this.#media?.toggleAttribute('hidden', !hasMedia);
    this.#sub?.toggleAttribute('hidden', !hasSub);

    this.toggleAttribute('data-has-media', hasMedia);
    this.toggleAttribute('data-has-sub', hasSub);
  }

  #syncPrimary(): void {
    const primary = this.querySelector('[data-dads-card-primary]');
    this.#primary = primary instanceof HTMLElement ? primary : null;

    this.toggleAttribute('data-dads-card-delegate', this.#isDelegateEnabled());
  }

  /** 委譲モードが有効かどうかを判定 */
  #isDelegateEnabled(): boolean {
    return this.#primary !== null && this.#primary.hasAttribute('data-dads-card-delegate');
  }

  #handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    this.#pointer.id = event.pointerId;
    this.#pointer.startX = event.clientX;
    this.#pointer.startY = event.clientY;
    this.#pointer.moved = false;
  };

  #handlePointerMove = (event: PointerEvent): void => {
    if (this.#pointer.id == null) return;
    if (event.pointerId !== this.#pointer.id) return;

    const dx = event.clientX - this.#pointer.startX;
    const dy = event.clientY - this.#pointer.startY;
    const distanceSq = dx * dx + dy * dy;
    const threshold = 6;
    if (distanceSq > threshold * threshold) this.#pointer.moved = true;
  };

  #handlePointerUp = (event: PointerEvent): void => {
    if (this.#pointer.id == null) return;
    if (event.pointerId !== this.#pointer.id) return;
    this.#pointer.id = null;
  };

  #isSelectionInsideHost(): boolean {
    const sel = document.getSelection?.() ?? null;
    if (!sel || sel.isCollapsed) return false;

    const anchor = sel.anchorNode;
    const focus = sel.focusNode;
    if (anchor && this.contains(anchor)) return true;
    if (focus && this.contains(focus)) return true;

    return false;
  }

  #handleClick = (event: MouseEvent): void => {
    const primary = this.#primary;
    if (!this.#isDelegateEnabled() || !primary) return;

    const moved = this.#pointer.moved;
    this.#pointer.moved = false;

    // Drag selection / pointer drag should not trigger navigation.
    if (moved) return;
    if (this.#isSelectionInsideHost()) return;

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (const node of path) {
      if (!(node instanceof Element)) continue;

      // If the click already originated from an interactive element, don't hijack.
      if (node === primary || primary.contains(node)) return;
      if (node.closest?.('a,button,input,select,textarea,label,summary')) return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    primary.click();
  };

  #handleFocusIn = (event: FocusEvent): void => {
    const primary = this.#primary;
    if (!this.#isDelegateEnabled() || !primary) return;

    const t = event.target;
    if (!(t instanceof Node)) return;
    if (t === primary || primary.contains(t)) {
      this.setAttribute('data-primary-focus', '');
    }
  };

  #handleFocusOut = (event: FocusEvent): void => {
    const primary = this.#primary;
    if (!this.#isDelegateEnabled() || !primary) return;

    const next = event.relatedTarget;
    if (next instanceof Node && (next === primary || primary.contains(next))) return;
    this.removeAttribute('data-primary-focus');
  };
}
