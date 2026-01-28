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
import type { A11yAnnotations } from '../../utils/a11y-annotations.js';

type PointerState = {
  id: number | null;
  startX: number;
  startY: number;
  moved: boolean;
};

const INTERACTIVE_SELECTOR =
  'a[href],button,input,select,textarea,label,summary,[role="button"],[role="link"],[tabindex]:not([tabindex="-1"])';

/**
 * Cardコンポーネント
 *
 * DADS「カード」の構造（コンテナ/メイン/イメージ/サブ）を Web Components として提供します。
 *
 * クリック委譲（カード面クリック）:
 * - 主リンク要素に `data-dads-card-primary` を付与します
 * - さらに `data-dads-card-delegate` を付与すると、カード面クリック（pointer）を主リンクへ委譲します
 * - キーボード操作は「主リンクへフォーカスしてEnter」で成立するため、カード自体はフォーカス可能にしません
 *
 * @customElement dads-card
 * @tagname dads-card
 *
 * @slot media - イメージエリア（任意）
 * @slot media-label - イメージラベル（任意）
 * @slot media-function - イメージエリアの機能ボタン（任意）
 *
 * @slot title - タイトル（必須）
 * @slot main-label - メインラベル（任意）
 * @slot main-function - メインエリアの機能ボタン（任意）
 * @slot content - メインコンテンツ（任意）
 *
 * @slot sub-label - サブラベル（任意）
 * @slot sub-function - サブエリアの機能ボタン（任意）
 * @slot sub - サブエリア（任意）
 *
 * @csspart base - コンテナ
 * @csspart media - イメージエリア
 * @csspart media-body - イメージ本体
 * @csspart media-overlay - イメージ上のオーバーレイ（label/function）
 * @csspart media-label - イメージラベル
 * @csspart media-function - イメージ機能ボタン
 * @csspart main - メインエリア
 * @csspart main-header - メイン見出し行（title/label + function）
 * @csspart main-heading - タイトル/ラベルのまとまり
 * @csspart title - タイトル領域
 * @csspart main-label - メインラベル
 * @csspart main-function - メイン機能ボタン
 * @csspart content - メインコンテンツ
 * @csspart sub - サブエリア
 * @csspart sub-header - サブラベル + 機能ボタン
 * @csspart sub-label - サブラベル
 * @csspart sub-function - サブ機能ボタン
 * @csspart sub-content - サブコンテンツ
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
 * @cssprop --dads-card-title-color - タイトル文字色
 * @cssprop --dads-card-title-font-size - タイトル文字サイズ
 * @cssprop --dads-card-title-font-weight - タイトルの太さ
 * @cssprop --dads-card-title-line-height - タイトルの行高
 * @cssprop --dads-card-title-underline-offset - 主リンク時の下線オフセット
 * @cssprop --dads-card-title-underline-thickness - 主リンク時の下線太さ
 * @cssprop --dads-card-title-underline-thickness-hover - ホバー時の下線太さ（主リンク時）
 * @cssprop --dads-card-focus-outline-color - フォーカスアウトライン色（委譲ON時）
 * @cssprop --dads-card-focus-outline-width - フォーカスアウトライン幅（委譲ON時）
 * @cssprop --dads-card-focus-outline-offset - フォーカスアウトラインのオフセット（委譲ON時）
 * @cssprop --dads-card-focus-ring-color - フォーカスリング色（委譲ON時）
 * @cssprop --dads-card-focus-ring-width - フォーカスリング幅（委譲ON時）
 */
export class DadsCard extends TypographyWebComponent {
  static readonly a11yAnnotations: A11yAnnotations = {
    version: 1,
    summary: 'カードコンポーネント仕様（アクセシビリティ注釈）',
    categories: {
      semantics: [
        'カードはコンテナ/メイン/イメージ/サブの領域を持つレイアウトコンポーネントです。',
        'キーボード操作は、カード内のリンク（主リンク）へフォーカスして Enter で遷移します。',
      ],
      keyboard: [
        'カード自体はフォーカス可能にしません。',
        'カード面クリック（pointer委譲）は data 属性で任意に有効化できます。',
      ],
      zoom: [
        '余白やサイズは rem と CSS 変数で定義され、拡大時も読みやすさを維持します。',
      ],
      states: [
        'layout="horizontal" で横並び（イメージ左・メイン右）にできます。',
      ],
      labels: [
        'title スロットにタイトル（見出し等）を配置します。',
      ],
      motion: [
        'アニメーションは使用しません。',
      ],
    },
    callouts: [
      {
        id: 'container',
        title: 'カードコンテナ',
        label: 'container',
        description: '外周・背景を持つカードのコンテナです。',
        category: 'semantics',
        placement: 'top-right',
        target: { scope: 'shadow', selector: '[part="base"]' },
      },
      {
        id: 'media',
        title: 'イメージエリア',
        label: 'media',
        description: '画像や動画などのメディアを配置するエリアです（任意）。',
        category: 'semantics',
        placement: 'top-left',
        target: { scope: 'shadow', selector: '[part="media"]' },
      },
      {
        id: 'main',
        title: 'メインエリア',
        label: 'main',
        description: 'タイトルや本文などの主要コンテンツを配置します。',
        category: 'semantics',
        placement: 'bottom-left',
        target: { scope: 'shadow', selector: '[part="main"]' },
      },
      {
        id: 'sub',
        title: 'サブエリア',
        label: 'sub',
        description: '関連情報やボタンなどの補助要素を配置するエリアです（任意）。',
        category: 'semantics',
        placement: 'bottom-right',
        target: { scope: 'shadow', selector: '[part="sub"]' },
      },
    ],
  };

  static definition = {
    name: 'dads-card',
    template: html`
      <article part="base" id="base">
        <section part="media" id="media" hidden>
          <div part="media-body">
            <slot name="media" id="media-slot"></slot>
          </div>
          <div part="media-overlay">
            <div part="media-label">
              <slot name="media-label" id="media-label-slot"></slot>
            </div>
            <div part="media-function">
              <slot name="media-function" id="media-function-slot"></slot>
            </div>
          </div>
        </section>

        <section part="main">
          <div part="main-header">
            <div part="main-heading">
              <div part="title">
                <slot name="title" id="title-slot"></slot>
              </div>
              <div part="main-label">
                <slot name="main-label" id="main-label-slot"></slot>
              </div>
            </div>
            <div part="main-function">
              <slot name="main-function" id="main-function-slot"></slot>
            </div>
          </div>

          <div part="content">
            <slot name="content" id="content-slot"></slot>
          </div>
        </section>

        <section part="sub" id="sub" hidden>
          <div part="sub-header">
            <div part="sub-label">
              <slot name="sub-label" id="sub-label-slot"></slot>
            </div>
            <div part="sub-function">
              <slot name="sub-function" id="sub-function-slot"></slot>
            </div>
          </div>
          <div part="sub-content">
            <slot name="sub" id="sub-slot"></slot>
          </div>
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
  #mediaLabelSlot: HTMLSlotElement | null = null;
  #mediaFunctionSlot: HTMLSlotElement | null = null;
  #titleSlot: HTMLSlotElement | null = null;
  #mainLabelSlot: HTMLSlotElement | null = null;
  #mainFunctionSlot: HTMLSlotElement | null = null;
  #contentSlot: HTMLSlotElement | null = null;
  #subLabelSlot: HTMLSlotElement | null = null;
  #subFunctionSlot: HTMLSlotElement | null = null;
  #subSlot: HTMLSlotElement | null = null;

  #media: HTMLElement | null = null;
  #sub: HTMLElement | null = null;

  #primary: HTMLElement | null = null;
  #mutationObserver: MutationObserver | null = null;

  #pointer: PointerState = { id: null, startX: 0, startY: 0, moved: false };
  #suppressTitleHover = false;

  connectedCallback(): void {
    super.connectedCallback();

    this.#mediaSlot = this.shadowRoot?.querySelector('#media-slot') as HTMLSlotElement | null;
    this.#mediaLabelSlot = this.shadowRoot?.querySelector('#media-label-slot') as HTMLSlotElement | null;
    this.#mediaFunctionSlot = this.shadowRoot?.querySelector('#media-function-slot') as HTMLSlotElement | null;
    this.#titleSlot = this.shadowRoot?.querySelector('#title-slot') as HTMLSlotElement | null;
    this.#mainLabelSlot = this.shadowRoot?.querySelector('#main-label-slot') as HTMLSlotElement | null;
    this.#mainFunctionSlot = this.shadowRoot?.querySelector('#main-function-slot') as HTMLSlotElement | null;
    this.#contentSlot = this.shadowRoot?.querySelector('#content-slot') as HTMLSlotElement | null;
    this.#subLabelSlot = this.shadowRoot?.querySelector('#sub-label-slot') as HTMLSlotElement | null;
    this.#subFunctionSlot = this.shadowRoot?.querySelector('#sub-function-slot') as HTMLSlotElement | null;
    this.#subSlot = this.shadowRoot?.querySelector('#sub-slot') as HTMLSlotElement | null;

    this.#media = this.shadowRoot?.querySelector('#media') as HTMLElement | null;
    this.#sub = this.shadowRoot?.querySelector('#sub') as HTMLElement | null;

    const onSlotChange = () => this.#syncAll();
    this.#mediaSlot?.addEventListener('slotchange', onSlotChange);
    this.#mediaLabelSlot?.addEventListener('slotchange', onSlotChange);
    this.#mediaFunctionSlot?.addEventListener('slotchange', onSlotChange);
    this.#titleSlot?.addEventListener('slotchange', onSlotChange);
    this.#mainLabelSlot?.addEventListener('slotchange', onSlotChange);
    this.#mainFunctionSlot?.addEventListener('slotchange', onSlotChange);
    this.#contentSlot?.addEventListener('slotchange', onSlotChange);
    this.#subLabelSlot?.addEventListener('slotchange', onSlotChange);
    this.#subFunctionSlot?.addEventListener('slotchange', onSlotChange);
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
    this.addEventListener('mouseover', this.#handleMouseOver);
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
    this.removeEventListener('mouseover', this.#handleMouseOver);
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

    const hasMedia =
      hasSlotContent(this.#mediaSlot) ||
      hasSlotContent(this.#mediaLabelSlot) ||
      hasSlotContent(this.#mediaFunctionSlot) ||
      hasLightDomSlot('media') ||
      hasLightDomSlot('media-label') ||
      hasLightDomSlot('media-function');

    const hasSub =
      hasSlotContent(this.#subSlot) ||
      hasSlotContent(this.#subLabelSlot) ||
      hasSlotContent(this.#subFunctionSlot) ||
      hasLightDomSlot('sub') ||
      hasLightDomSlot('sub-label') ||
      hasLightDomSlot('sub-function');

    this.#media?.toggleAttribute('hidden', !hasMedia);
    this.#sub?.toggleAttribute('hidden', !hasSub);

    this.toggleAttribute('data-has-media', hasMedia);
    this.toggleAttribute('data-has-sub', hasSub);
  }

  #syncPrimary(): void {
    const primary = this.querySelector('[data-dads-card-primary]');
    this.#primary = primary instanceof HTMLElement ? primary : null;

    const delegate =
      this.#primary instanceof HTMLElement && this.#primary.hasAttribute('data-dads-card-delegate');
    this.toggleAttribute('data-dads-card-delegate', delegate);

    // DADS: underline title when clickable (container/main/title is a link).
    const titleAssigned = this.#titleSlot?.assignedElements({ flatten: true }) ?? [];
    let titleClickable = false;
    if (this.#primary) {
      if (titleAssigned.length > 0) {
        for (const el of titleAssigned) {
          if (!(el instanceof HTMLElement)) continue;
          if (el === this.#primary || el.contains(this.#primary)) {
            titleClickable = true;
            break;
          }
        }
      } else {
        // Fallback for test envs where slot assignment isn't reliable (e.g. Happy DOM).
        titleClickable = this.#primary.closest('[slot="title"]') !== null;
      }
    }
    this.toggleAttribute('data-title-clickable', titleClickable);
  }

  #setSuppressTitleHover(value: boolean): void {
    if (this.#suppressTitleHover === value) return;
    this.#suppressTitleHover = value;
    this.toggleAttribute('data-suppress-title-hover', value);
  }

  #syncTitleHoverSuppression(event: MouseEvent): void {
    if (!this.hasAttribute('data-title-clickable')) {
      this.#setSuppressTitleHover(false);
      return;
    }

    const primary = this.#primary;
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const primaryIndex = primary ? path.indexOf(primary) : -1;

    let suppress = false;
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      if (!(node instanceof Element)) continue;

      // Ignore primary and its internal structure (including its shadow DOM).
      if (primaryIndex !== -1 && i <= primaryIndex) continue;
      if (node.matches(INTERACTIVE_SELECTOR)) {
        suppress = true;
        break;
      }
    }

    this.#setSuppressTitleHover(suppress);
  }

  #handleMouseOver = (event: MouseEvent): void => {
    this.#syncTitleHoverSuppression(event);
  };

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
    if (!primary) return;
    if (!primary.hasAttribute('data-dads-card-delegate')) return;

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
    if (!primary) return;
    if (!primary.hasAttribute('data-dads-card-delegate')) return;

    const t = event.target;
    if (!(t instanceof Node)) return;
    if (t === primary || primary.contains(t)) {
      this.setAttribute('data-primary-focus', '');
    }
  };

  #handleFocusOut = (event: FocusEvent): void => {
    const primary = this.#primary;
    if (!primary) return;
    if (!primary.hasAttribute('data-dads-card-delegate')) return;

    const next = event.relatedTarget;
    if (next instanceof Node && (next === primary || primary.contains(next))) return;
    this.removeAttribute('data-primary-focus');
  };
}
