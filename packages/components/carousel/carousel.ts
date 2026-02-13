/**
 * @module carousel
 * デジタル庁デザインシステム Carousel コンポーネント
 */

import {
  html,
  Keys,
  BooleanAttr,
  PropertyAttr,
  type AttrBehavior,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { carouselTokens } from './carousel-tokens.js';
import { carouselStyles } from './carousel-styles.js';

export type DadsCarouselType = 'container' | 'key-visual';

export type DadsCarouselChangeSource =
  | 'prev'
  | 'next'
  | 'indicator';

export type DadsCarouselEventSource =
  | DadsCarouselChangeSource
  | 'all-slides'
  | 'api'
  | 'attribute'
  | 'sync';

export type DadsCarouselSlidesChangeReason = 'items' | 'slotchange' | 'mutation' | 'sync';

export type DadsCarouselLayoutChangeReason = 'resize' | 'breakpoint' | 'image-slider' | 'sync';

export type DadsCarouselMediaRole = 'main' | 'main-bg' | 'next-preview' | 'next-bg';

export interface DadsCarouselItem {
  src: string;
  alt: string;
  href?: string;
  title?: string;
  description?: string;
  srcset?: string;
  sizes?: string;
  width?: number;
  height?: number;
  target?: string;
  rel?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  id?: string;
}

export interface DadsCarouselChangeDetail {
  currentIndex: number;
  previousIndex: number;
  total: number;
  source: DadsCarouselChangeSource;
}

export interface DadsCarouselToggleAllDetail {
  expanded: boolean;
}

export interface DadsCarouselBeforeChangeDetail {
  currentIndex: number;
  nextIndex: number;
  total: number;
  source: DadsCarouselEventSource;
  wrapped: boolean;
  userInitiated: boolean;
}

export interface DadsCarouselIndexChangeDetail {
  previousIndex: number;
  currentIndex: number;
  total: number;
  source: DadsCarouselEventSource;
  wrapped: boolean;
  userInitiated: boolean;
}

export interface DadsCarouselSlideStateDetail {
  index: number;
  id: string;
  label: string;
  source: DadsCarouselEventSource;
}

export interface DadsCarouselSlidesChangeDetail {
  previousTotal: number;
  total: number;
  source: CarouselSource;
  reason: DadsCarouselSlidesChangeReason;
}

export interface DadsCarouselLayoutChangeDetail {
  previousWide: boolean;
  wide: boolean;
  imageSlider: boolean;
  breakpointRem: number;
  containerWidthPx: number;
  reason: DadsCarouselLayoutChangeReason;
}

export interface DadsCarouselControlsUpdateDetail {
  mode: 'desktop' | 'mobile' | 'hidden';
  total: number;
  currentIndex: number;
  expanded: boolean;
  wide: boolean;
  imageSlider: boolean;
  showStepNav: boolean;
  showPageNav: boolean;
  showNextPreview: boolean;
  showAllSlides: boolean;
  prevDisabled: boolean;
  nextDisabled: boolean;
}

export interface DadsCarouselMediaDetail {
  index: number;
  role: DadsCarouselMediaRole;
  src: string;
  source: DadsCarouselEventSource;
  error?: 'decode-error' | 'load-error';
}

type CarouselSource = 'items' | 'slot';

type CarouselSlide = {
  id: string;
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  item?: DadsCarouselItem;
  mediaNode?: HTMLImageElement | HTMLPictureElement;
};

type CarouselSlideImageSource = {
  src: string;
  srcset?: string;
  sizes?: string;
};

type CarouselMediaReadyResult =
  | { ok: true }
  | { ok: false; error: 'decode-error' | 'load-error' };

type CarouselMediaContext = {
  index: number;
  role: DadsCarouselMediaRole;
  source: DadsCarouselEventSource;
};

type CarouselMediaWaitPolicy = 'wait-before-insert' | 'insert-immediately';

const DEFAULT_TYPE: DadsCarouselType = 'container';
const DEFAULT_ARIA_LABEL = 'カルーセル';
const DEFAULT_UNIT = 'スライド';
const DEFAULT_PREV_LABEL = '前のスライド';
const DEFAULT_NEXT_LABEL = '次のスライド';
const DEFAULT_ALL_SLIDES_LABEL = 'すべてのスライド';
const DEFAULT_BREAKPOINT_REM = 64;
const DEFAULT_STEP_NAV_LABEL = 'スライド選択';

let carouselIdSeed = 0;

function normalizeType(value: string | null): DadsCarouselType {
  return value === 'key-visual' ? 'key-visual' : DEFAULT_TYPE;
}

function normalizeText(value: string | null, fallback: string): string {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
}

function parseInteger(value: string | null): number {
  if (value === null) return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.trunc(parsed);
}

function clampIndex(value: number, total: number): number {
  if (!Number.isFinite(value) || total <= 0) return 0;
  if (value < 0) return 0;
  if (value >= total) return total - 1;
  return value;
}

function normalizeLoopIndex(value: number, total: number): number {
  if (!Number.isFinite(value) || total <= 0) return 0;
  const normalized = Math.trunc(value) % total;
  return normalized >= 0 ? normalized : normalized + total;
}

function parseBreakpointRem(value: string | null): number {
  const parsed = Number.parseFloat(value ?? '');
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_BREAKPOINT_REM;
  return parsed;
}

function trimOptional(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value !== 'number') return undefined;
  return Number.isFinite(value) ? value : undefined;
}

function normalizeLoading(value: unknown): DadsCarouselItem['loading'] {
  return value === 'eager' || value === 'lazy' ? value : undefined;
}

function normalizeDecoding(value: unknown): DadsCarouselItem['decoding'] {
  return value === 'sync' || value === 'async' || value === 'auto' ? value : undefined;
}

function normalizeItem(raw: DadsCarouselItem | null | undefined): DadsCarouselItem | null {
  if (!raw || typeof raw !== 'object') return null;

  const src = trimOptional(raw.src);
  if (!src) return null;

  const item: DadsCarouselItem = {
    src,
    alt: typeof raw.alt === 'string' ? raw.alt : '',
  };

  const href = trimOptional(raw.href);
  const title = trimOptional(raw.title);
  const description = trimOptional(raw.description);
  const srcset = trimOptional(raw.srcset);
  const sizes = trimOptional(raw.sizes);
  const target = trimOptional(raw.target);
  const rel = trimOptional(raw.rel);
  const loading = normalizeLoading(raw.loading);
  const decoding = normalizeDecoding(raw.decoding);
  const id = trimOptional(raw.id);
  const width = toOptionalNumber(raw.width);
  const height = toOptionalNumber(raw.height);

  if (href) item.href = href;
  if (title) item.title = title;
  if (description) item.description = description;
  if (srcset) item.srcset = srcset;
  if (sizes) item.sizes = sizes;
  if (target) item.target = target;
  if (rel) item.rel = rel;
  if (loading) item.loading = loading;
  if (decoding) item.decoding = decoding;
  if (id) item.id = id;
  if (width !== undefined) item.width = width;
  if (height !== undefined) item.height = height;

  return item;
}

function resolveRel(target: string | undefined, rel: string | undefined): string | undefined {
  if (rel) return rel;
  if (target === '_blank') return 'noopener noreferrer';
  return undefined;
}

function isLegacyChangeSource(source: DadsCarouselEventSource): source is DadsCarouselChangeSource {
  return source === 'prev' || source === 'next' || source === 'indicator';
}

function queryMediaNode(
  root: Element | null,
): HTMLImageElement | HTMLPictureElement | null {
  if (!root) return null;
  if (root instanceof HTMLImageElement || root instanceof HTMLPictureElement) return root;

  const picture = root.querySelector('picture');
  if (picture instanceof HTMLPictureElement) {
    const pictureImg = picture.querySelector('img');
    if (pictureImg instanceof HTMLImageElement) return picture;
  }

  const image = root.querySelector('img');
  if (image instanceof HTMLImageElement) return image;
  return null;
}

function extractImageElement(root: Element): HTMLImageElement | null {
  if (root instanceof HTMLImageElement) return root;
  const image = root.querySelector('img');
  return image instanceof HTMLImageElement ? image : null;
}

function cloneMediaNode(
  node: HTMLImageElement | HTMLPictureElement,
  noAlt: boolean,
): HTMLElement {
  const cloned = node.cloneNode(true) as HTMLElement;
  if (!noAlt) return cloned;

  if (cloned instanceof HTMLImageElement) {
    cloned.alt = '';
    return cloned;
  }

  const image = cloned.querySelector('img');
  if (image instanceof HTMLImageElement) image.alt = '';
  return cloned;
}

function createCurrentIndexAttrBehavior(): AttrBehavior {
  return {
    attribute: 'current-index',
    attributeChangedCallback(instance, oldValue, newValue) {
      const callback = (instance as { currentIndexChanged?: (oldV: string | null, newV: string | null) => void })
        .currentIndexChanged;
      if (typeof callback === 'function') callback.call(instance, oldValue, newValue);
    },
  };
}

/**
 * カルーセル
 *
 * @customElement dads-carousel
 * @tagname dads-carousel
 *
 * @slot default - スライド要素（items 未指定時に利用）
 * @slot heading - 見出し（container タイプ向け）
 *
 * @csspart root - ルート領域
 * @csspart inner - 内部レイアウト
 * @csspart panels - パネル領域
 * @csspart panel-set - パネルセット
 * @csspart number - 番号表示
 * @csspart panel-number - パネル番号（一覧展開時）
 * @csspart main - メインパネル領域
 * @csspart main-panel - メインパネル
 * @csspart main-link - メインリンク
 * @csspart main-label - メインラベル（スクリーンリーダー向け）
 * @csspart image-container - 画像コンテナ
 * @csspart main-images - メイン画像コンテナ
 * @csspart main-bg - メイン背景
 * @csspart next - 次スライド領域
 * @csspart next-preview-button - 次スライドプレビューボタン
 * @csspart next-image-container - 次スライド画像コンテナ
 * @csspart next-image-label - 次スライドラベル
 * @csspart next-bg - 次スライド背景
 * @csspart controls - コントロール領域
 * @csspart indicators - ステップナビゲーション
 * @csspart indicator-button - ステップボタン
 * @csspart page-nav - ページナビゲーション
 * @csspart prev-button - 前ボタン
 * @csspart next-button - 次ボタン
 * @csspart all-slides - すべてのスライド領域
 * @csspart all-slides-button - すべてのスライド切替ボタン
 * @csspart all-slides-content - すべてのスライド内容
 * @csspart all-slides-item - すべてのスライド項目
 * @csspart status - ステータス（aria-live）
 *
 * @attr {'container'|'key-visual'} type - 表示タイプ
 * @attr {number} current-index - 現在スライドの 0 始まり index
 * @attr {string} aria-label - カルーセルの aria-label
 * @attr {string} prev-label - 前ボタンのラベル
 * @attr {string} next-label - 次ボタンのラベル
 * @attr {string} all-slides-label - 一覧展開ボタンのラベル
 * @attr {boolean} image-slider - イメージスライダー（幅狭コンテナ）モードを強制
 * @attr {number} breakpoint-rem - desktop 判定のブレークポイント（rem）
 * @attr {string} unit - スライドの単位（例: スライド）
 *
 * @fires dads-carousel-before-change - スライド変更直前（cancelable）
 * @fires dads-carousel-index-change - スライド変更完了後（API/属性変更含む）
 * @fires dads-carousel-slide-inactive - 直前スライドが非アクティブ化された時
 * @fires dads-carousel-slide-active - 新しいスライドがアクティブ化された時
 * @fires dads-carousel-slides-change - slides 構成（枚数/source）が変わった時
 * @fires dads-carousel-layout-change - data-wide などレイアウト状態が変わった時
 * @fires dads-carousel-controls-update - controls 表示モードや状態が更新された時
 * @fires dads-carousel-media-loaded - 描画対象メディアの準備完了時
 * @fires dads-carousel-media-error - 描画対象メディアの読み込み失敗時
 * @fires dads-carousel-change - 現在スライド変更時（ユーザー操作のみ）
 * @fires dads-carousel-toggle-all - 一覧展開状態の変更時
 */
export class DadsCarousel extends TypographyWebComponent {
  static readonly version = '0.2.0';

  static definition = {
    name: 'dads-carousel',
    template: html`
      <section part="root" id="root">
        <div part="inner" id="inner">
          <slot id="heading-slot" name="heading"></slot>

          <div part="panels" id="panels">
            <div part="panel-set active-panel" id="active-panel">
              <p
                part="number panel-number"
                id="current-number"
                aria-current="true"
                aria-hidden="true"
              ></p>

              <div part="main" id="main" aria-live="polite" aria-atomic="true">
                <div part="main-panel" id="main-panel">
                  <a part="main-link" id="main-link">
                    <span part="visually-hidden main-label" id="main-label"></span>
                    <div part="image-container main-images" id="main-images"></div>
                  </a>
                </div>
              </div>

              <p part="next" id="next">
                <button part="next-preview-button" id="next-preview-button" type="button">
                  <span part="next-image-container" id="next-image-container"></span>
                  <span part="next-image-label" id="next-image-label"></span>
                </button>
              </p>

              <div part="main-bg" id="main-bg"><div id="main-bg-content"></div></div>
              <div part="next-bg" id="next-bg"><div id="next-bg-content"></div></div>
            </div>
          </div>

          <div part="controls" id="controls">
            <ul part="step-nav indicators" id="indicators" role="tablist"></ul>

            <p part="page-nav" id="page-nav">
              <button part="page-nav-button prev-button" id="page-prev-button" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="m5.27 8 5.33-5.33-.93-.94L3.4 8l6.27 6.27.93-.94L5.27 8Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span part="visually-hidden" id="page-prev-label"></span>
              </button>

              <span part="page-status" id="page-status"></span>

              <button part="page-nav-button next-button" id="page-next-button" type="button">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="m6 1.73-.93.94L10.4 8l-5.33 5.33.93.94L12.27 8 6 1.73Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span part="visually-hidden" id="page-next-label"></span>
              </button>
            </p>

            <details part="all-slides all-slides-details" id="all-slides">
              <summary part="all-slides-button" id="all-slides-summary">
                <svg part="all-slides-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" fill="currentColor"></circle>
                  <circle part="all-slides-icon-circle" cx="12" cy="12" r="8" fill="currentColor"></circle>
                  <path part="all-slides-icon-triangle" d="M17 10H7L12 15L17 10Z" fill="Canvas"></path>
                </svg>
                <span id="all-slides-summary-label"></span>
              </summary>

              <div part="all-slides-content" id="all-slides-content">
                <ul part="slides" id="all-slides-list"></ul>
              </div>
            </details>
          </div>

          <p part="visually-hidden status" id="status" aria-live="polite" aria-atomic="true"></p>
          <slot id="slides-slot" hidden></slot>
        </div>
      </section>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        carouselTokens,
        carouselStyles,
      ],
      'minimal',
    ),
    attributes: [
      PropertyAttr('type'),
      createCurrentIndexAttrBehavior(),
      PropertyAttr('ariaLabel', 'aria-label'),
      PropertyAttr('prevLabel', 'prev-label'),
      PropertyAttr('nextLabel', 'next-label'),
      PropertyAttr('allSlidesLabel', 'all-slides-label'),
      BooleanAttr('imageSlider', 'image-slider'),
      PropertyAttr('breakpointRem', 'breakpoint-rem'),
      PropertyAttr('unit'),
    ],
  };

  #instanceId = ++carouselIdSeed;
  #items: DadsCarouselItem[] = [];
  #slides: CarouselSlide[] = [];
  #source: CarouselSource = 'slot';
  #expanded = false;
  #currentIndex = 0;
  #slideCount = 0;
  #isWide = false;
  #measuredWide = true;
  #syncingCurrentIndexAttr = false;
  #syncingExpandedState = false;
  #preloadCache = new Map<string, Promise<void>>();
  #renderSeq = 0;
  #mainHeightLockSeq = 0;
  #lastControlsUpdateKey = '';

  #root: HTMLElement | null = null;
  #headingSlot: HTMLSlotElement | null = null;
  #slidesSlot: HTMLSlotElement | null = null;
  #mainPanel: HTMLElement | null = null;
  #mainLink: HTMLAnchorElement | null = null;
  #mainLabel: HTMLElement | null = null;
  #mainImages: HTMLElement | null = null;
  #mainBgContent: HTMLElement | null = null;
  #currentNumber: HTMLElement | null = null;
  #nextWrap: HTMLElement | null = null;
  #nextButton: HTMLButtonElement | null = null;
  #nextImageContainer: HTMLElement | null = null;
  #nextImageLabel: HTMLElement | null = null;
  #nextBg: HTMLElement | null = null;
  #nextBgContent: HTMLElement | null = null;
  #controls: HTMLElement | null = null;
  #indicators: HTMLElement | null = null;
  #pageNav: HTMLElement | null = null;
  #pagePrevButton: HTMLButtonElement | null = null;
  #pagePrevLabel: HTMLElement | null = null;
  #pageNextButton: HTMLButtonElement | null = null;
  #pageNextLabel: HTMLElement | null = null;
  #pageStatus: HTMLElement | null = null;
  #allSlides: HTMLDetailsElement | null = null;
  #allSlidesSummaryLabel: HTMLElement | null = null;
  #allSlidesList: HTMLElement | null = null;
  #status: HTMLElement | null = null;

  #hostObserver: MutationObserver | null = null;
  #resizeObserver: ResizeObserver | null = null;

  declare type: DadsCarouselType | null;
  declare ariaLabel: string | null;
  declare prevLabel: string | null;
  declare nextLabel: string | null;
  declare allSlidesLabel: string | null;
  declare imageSlider: boolean;
  declare breakpointRem: string | null;
  declare unit: string | null;

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('type')) this.setAttribute('type', DEFAULT_TYPE);
    if (!this.hasAttribute('current-index')) this.setAttribute('current-index', '0');
    if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', DEFAULT_ARIA_LABEL);
    if (!this.hasAttribute('prev-label')) this.setAttribute('prev-label', DEFAULT_PREV_LABEL);
    if (!this.hasAttribute('next-label')) this.setAttribute('next-label', DEFAULT_NEXT_LABEL);
    if (!this.hasAttribute('all-slides-label')) {
      this.setAttribute('all-slides-label', DEFAULT_ALL_SLIDES_LABEL);
    }
    if (!this.hasAttribute('breakpoint-rem')) {
      this.setAttribute('breakpoint-rem', String(DEFAULT_BREAKPOINT_REM));
    }
    if (!this.hasAttribute('unit')) this.setAttribute('unit', DEFAULT_UNIT);

    this.#root = this.shadowRoot?.querySelector('#root') as HTMLElement | null;
    this.#headingSlot = this.shadowRoot?.querySelector('#heading-slot') as HTMLSlotElement | null;
    this.#slidesSlot = this.shadowRoot?.querySelector('#slides-slot') as HTMLSlotElement | null;
    this.#mainPanel = this.shadowRoot?.querySelector('#main-panel') as HTMLElement | null;
    if (this.#mainPanel) this.#mainPanel.id = this.#mainPanelId();
    this.#mainLink = this.shadowRoot?.querySelector('#main-link') as HTMLAnchorElement | null;
    this.#mainLabel = this.shadowRoot?.querySelector('#main-label') as HTMLElement | null;
    this.#mainImages = this.shadowRoot?.querySelector('#main-images') as HTMLElement | null;
    this.#mainBgContent = this.shadowRoot?.querySelector('#main-bg-content') as HTMLElement | null;
    this.#currentNumber = this.shadowRoot?.querySelector('#current-number') as HTMLElement | null;
    this.#nextWrap = this.shadowRoot?.querySelector('#next') as HTMLElement | null;
    this.#nextButton = this.shadowRoot?.querySelector('#next-preview-button') as HTMLButtonElement | null;
    this.#nextImageContainer = this.shadowRoot?.querySelector('#next-image-container') as HTMLElement | null;
    this.#nextImageLabel = this.shadowRoot?.querySelector('#next-image-label') as HTMLElement | null;
    this.#nextBg = this.shadowRoot?.querySelector('#next-bg') as HTMLElement | null;
    this.#nextBgContent = this.shadowRoot?.querySelector('#next-bg-content') as HTMLElement | null;
    this.#controls = this.shadowRoot?.querySelector('#controls') as HTMLElement | null;
    this.#indicators = this.shadowRoot?.querySelector('#indicators') as HTMLElement | null;
    this.#pageNav = this.shadowRoot?.querySelector('#page-nav') as HTMLElement | null;
    this.#pagePrevButton = this.shadowRoot?.querySelector('#page-prev-button') as HTMLButtonElement | null;
    this.#pagePrevLabel = this.shadowRoot?.querySelector('#page-prev-label') as HTMLElement | null;
    this.#pageNextButton = this.shadowRoot?.querySelector('#page-next-button') as HTMLButtonElement | null;
    this.#pageNextLabel = this.shadowRoot?.querySelector('#page-next-label') as HTMLElement | null;
    this.#pageStatus = this.shadowRoot?.querySelector('#page-status') as HTMLElement | null;
    this.#allSlides = this.shadowRoot?.querySelector('#all-slides') as HTMLDetailsElement | null;
    this.#allSlidesSummaryLabel = this.shadowRoot?.querySelector(
      '#all-slides-summary-label',
    ) as HTMLElement | null;
    this.#allSlidesList = this.shadowRoot?.querySelector('#all-slides-list') as HTMLElement | null;
    this.#status = this.shadowRoot?.querySelector('#status') as HTMLElement | null;

    this.#slidesSlot?.addEventListener('slotchange', this.#handleSlotChange);
    this.#nextButton?.addEventListener('click', this.#handleNextClick);
    this.#pagePrevButton?.addEventListener('click', this.#handlePrevClick);
    this.#pageNextButton?.addEventListener('click', this.#handleNextClick);
    this.#indicators?.addEventListener('click', this.#handleIndicatorsClick);
    this.#indicators?.addEventListener('keydown', this.#handleIndicatorsKeydown);
    this.#allSlides?.addEventListener('toggle', this.#handleAllSlidesToggle);
    this.#root?.addEventListener('keydown', this.#handleRootKeydown);

    this.#hostObserver = new MutationObserver(this.#handleHostMutations);
    this.#hostObserver.observe(this, {
      childList: true,
      attributes: true,
      attributeFilter: ['slot', 'data-title', 'data-description'],
      subtree: true,
    });

    this.#setupResizeObserver('sync');
    this.#syncAll('sync', 'sync');
  }

  disconnectedCallback(): void {
    this.#slidesSlot?.removeEventListener('slotchange', this.#handleSlotChange);
    this.#nextButton?.removeEventListener('click', this.#handleNextClick);
    this.#pagePrevButton?.removeEventListener('click', this.#handlePrevClick);
    this.#pageNextButton?.removeEventListener('click', this.#handleNextClick);
    this.#indicators?.removeEventListener('click', this.#handleIndicatorsClick);
    this.#indicators?.removeEventListener('keydown', this.#handleIndicatorsKeydown);
    this.#allSlides?.removeEventListener('toggle', this.#handleAllSlidesToggle);
    this.#root?.removeEventListener('keydown', this.#handleRootKeydown);
    this.#hostObserver?.disconnect();
    this.#hostObserver = null;
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;

    super.disconnectedCallback();
  }

  typeChanged(): void {
    this.#syncAll('sync', 'sync');
  }

  ariaLabelChanged(): void {
    this.#syncRootSemantics();
  }

  prevLabelChanged(): void {
    this.#syncControlText();
  }

  nextLabelChanged(): void {
    this.#syncControlText();
  }

  allSlidesLabelChanged(): void {
    this.#syncControlText();
  }

  imageSliderChanged(): void {
    this.#syncAll('sync', 'image-slider');
  }

  breakpointRemChanged(): void {
    this.#setupResizeObserver('breakpoint');
    this.#measureWideFromCurrentWidth();
    this.#syncWideState('breakpoint');
  }

  unitChanged(): void {
    this.#syncAll('sync', 'sync');
  }

  currentIndexChanged(): void {
    if (this.#syncingCurrentIndexAttr) return;
    const total = this.#slides.length;
    if (total <= 0) {
      this.#currentIndex = 0;
      this.#reflectCurrentIndex();
      return;
    }

    const changed = this.#setCurrentIndex(
      parseInteger(this.getAttribute('current-index')),
      'attribute',
      false,
      false,
    );
    if (!changed) this.#reflectCurrentIndex();
  }

  get items(): DadsCarouselItem[] {
    return this.#items.slice();
  }

  set items(value: DadsCarouselItem[]) {
    const nextItems: DadsCarouselItem[] = [];
    if (Array.isArray(value)) {
      for (const raw of value) {
        const normalized = normalizeItem(raw);
        if (normalized) nextItems.push(normalized);
      }
    }

    this.#items = nextItems;
    this.#syncAll('items', 'sync');
  }

  get currentIndex(): number {
    return this.#currentIndex;
  }

  set currentIndex(value: number) {
    this.goTo(value);
  }

  get expanded(): boolean {
    return this.#expanded;
  }

  set expanded(value: boolean) {
    this.toggleAllSlides(Boolean(value));
  }

  get slideCount(): number {
    return this.#slideCount;
  }

  goTo(index: number): void {
    this.#setCurrentIndex(index, 'api', false, false);
  }

  next(): void {
    this.#setCurrentIndex(this.#currentIndex + 1, 'next', true, true);
  }

  prev(): void {
    this.#setCurrentIndex(this.#currentIndex - 1, 'prev', true, true);
  }

  toggleAllSlides(force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !this.#expanded;
    this.#setExpanded(next, true, true);
  }

  #handleSlotChange = (): void => {
    if (this.#items.length > 0) return;
    this.#syncAll('slotchange', 'sync');
  };

  #handleHostMutations = (): void => {
    if (this.#items.length > 0) return;
    this.#syncAll('mutation', 'sync');
  };

  #handlePrevClick = (): void => {
    this.prev();
  };

  #handleNextClick = (): void => {
    this.next();
  };

  #handleIndicatorsClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('button[data-index]');
    if (!button) return;

    const index = parseInteger(button.getAttribute('data-index'));
    this.#setCurrentIndex(index, 'indicator', true, false);
  };

  #handleIndicatorsKeydown = (event: KeyboardEvent): void => {
    if (!(event.target instanceof Element)) return;
    const currentButton = event.target.closest<HTMLButtonElement>('button[data-index]');
    if (!currentButton) return;

    const total = this.#slideCount;
    if (total < 2) return;

    const current = parseInteger(currentButton.getAttribute('data-index'));
    let next = current;
    let loop = false;

    switch (event.key) {
      case Keys.arrowRight:
      case Keys.arrowDown:
        next = current + 1;
        loop = true;
        break;
      case Keys.arrowLeft:
      case Keys.arrowUp:
        next = current - 1;
        loop = true;
        break;
      case Keys.home:
        next = 0;
        break;
      case Keys.end:
        next = total - 1;
        break;
      case Keys.enter:
      case Keys.space:
        next = current;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#setCurrentIndex(next, 'indicator', true, loop);
    const targetIndex = loop ? normalizeLoopIndex(next, total) : clampIndex(next, total);
    const nextButton = this.#indicators?.querySelector<HTMLButtonElement>(
      `button[data-index="${targetIndex}"]`,
    );
    nextButton?.focus();
  };

  #handleAllSlidesToggle = (): void => {
    if (this.#syncingExpandedState) return;
    this.#setExpanded(Boolean(this.#allSlides?.open), true, false);
  };

  #handleRootKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') return;
    if (!this.#expanded) return;

    event.preventDefault();
    this.#setExpanded(false, true, true);
    this.#allSlides?.querySelector('summary')?.focus();
  };

  #setupResizeObserver(reason: DadsCarouselLayoutChangeReason = 'sync'): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;

    if (typeof ResizeObserver === 'undefined') {
      this.#measureWideFromCurrentWidth();
      this.#syncWideState(reason);
      return;
    }

    const minWidthRem = parseBreakpointRem(this.getAttribute('breakpoint-rem'));
    this.#resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const boxSize = Array.isArray(entry.borderBoxSize)
          ? entry.borderBoxSize[0]
          : entry.borderBoxSize;
        const inlineSize = boxSize ? boxSize.inlineSize : entry.contentRect.width;

        const rootFontSize = Number.parseFloat(
          getComputedStyle(document.documentElement).fontSize || '16',
        );
        const widthRem = inlineSize / (Number.isFinite(rootFontSize) ? rootFontSize : 16);
        this.#measuredWide = widthRem >= minWidthRem;
        this.#syncWideState('resize');
      }
    });

    this.#resizeObserver.observe(this);
    this.#measureWideFromCurrentWidth();
    this.#syncWideState(reason);
  }

  #syncWideState(reason: DadsCarouselLayoutChangeReason = 'sync'): void {
    const next = this.#isImageSliderMode() ? false : this.#measuredWide;
    this.setAttribute('data-wide', next ? 'true' : 'false');
    const previousWide = this.#isWide;

    if (previousWide === next) {
      this.#syncMainPanelSemantics();
      this.#syncResponsiveVisibility(this.#slideCount >= 2);
      return;
    }

    this.#isWide = next;
    this.#emitLayoutChange({
      previousWide,
      wide: next,
      imageSlider: this.#isImageSliderMode(),
      breakpointRem: parseBreakpointRem(this.getAttribute('breakpoint-rem')),
      containerWidthPx: this.#currentContainerWidthPx(),
      reason,
    });
    this.#syncMainPanelSemantics();
    this.#syncResponsiveVisibility(this.#slideCount >= 2);
  }

  #syncAll(
    slidesReason: DadsCarouselSlidesChangeReason = 'sync',
    layoutReason: DadsCarouselLayoutChangeReason = 'sync',
  ): void {
    if (!this.isConnected) return;

    this.#syncTypeAttribute();
    this.#syncRootSemantics();
    this.#collectSlides(slidesReason);
    this.#measureWideFromCurrentWidth();
    this.#syncWideState(layoutReason);
    this.#syncControlText();
    this.#syncCurrentIndex();
    this.#renderCurrentState('sync');
    this.#syncStatus();
  }

  #isImageSliderMode(): boolean {
    return this.hasAttribute('image-slider');
  }

  #measureWideFromCurrentWidth(): void {
    const width = this.getBoundingClientRect().width;
    if (!Number.isFinite(width) || width <= 0) return;

    const minWidthRem = parseBreakpointRem(this.getAttribute('breakpoint-rem'));
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize || '16',
    );
    const widthRem = width / (Number.isFinite(rootFontSize) ? rootFontSize : 16);
    this.#measuredWide = widthRem >= minWidthRem;
  }

  #syncTypeAttribute(): void {
    const imageSliderMode = this.#isImageSliderMode();
    const normalizedType = normalizeType(this.getAttribute('type'));
    if (this.getAttribute('type') !== normalizedType) {
      this.setAttribute('type', normalizedType);
      return;
    }

    const effectiveType = imageSliderMode ? 'container' : normalizedType;
    this.setAttribute('data-carousel-type', effectiveType);
    this.setAttribute('data-image-slider', imageSliderMode ? 'true' : 'false');
  }

  #syncRootSemantics(): void {
    if (!this.#root) return;

    this.#root.setAttribute('role', 'region');
    this.#root.setAttribute('aria-roledescription', 'carousel');

    const labelledby = trimOptional(this.getAttribute('aria-labelledby'));
    if (labelledby) {
      this.#root.setAttribute('aria-labelledby', labelledby);
      this.#root.removeAttribute('aria-label');
      return;
    }

    this.#root.removeAttribute('aria-labelledby');
    this.#root.setAttribute('aria-label', normalizeText(this.getAttribute('aria-label'), DEFAULT_ARIA_LABEL));
  }

  #collectSlides(reason: DadsCarouselSlidesChangeReason): void {
    const previousTotal = this.#slideCount;
    const previousSource = this.#source;

    if (this.#items.length > 0) {
      this.#source = 'items';
      this.#slides = this.#collectItemSlides();
    } else {
      this.#source = 'slot';
      this.#slides = this.#collectSlotSlides();
    }

    this.#slideCount = this.#slides.length;
    this.setAttribute('data-source', this.#source);
    this.setAttribute('data-slide-count', String(this.#slideCount));
    this.#primeSlidePreload();

    const changed = previousTotal !== this.#slideCount || previousSource !== this.#source;
    if (changed) {
      this.#emitSlidesChange({
        previousTotal,
        total: this.#slideCount,
        source: this.#source,
        reason,
      });
    }
  }

  #collectItemSlides(): CarouselSlide[] {
    const slides: CarouselSlide[] = [];
    const unit = this.#unitText();

    for (let index = 0; index < this.#items.length; index += 1) {
      const item = this.#items[index];
      const label = item.title ?? item.alt ?? `${unit}${index + 1}`;
      slides.push({
        id: item.id ?? `item-${index + 1}`,
        label,
        href: item.href,
        target: item.target,
        rel: resolveRel(item.target, item.rel),
        item,
      });
    }

    return slides;
  }

  #collectSlotSlides(): CarouselSlide[] {
    const slides: CarouselSlide[] = [];
    const slotSlides = this.#getSlotSlides();

    for (let index = 0; index < slotSlides.length; index += 1) {
      const normalized = this.#normalizeSlotSlide(slotSlides[index], index);
      if (normalized) slides.push(normalized);
    }

    return slides;
  }

  #getSlotSlides(): HTMLElement[] {
    const assigned = this.#slidesSlot?.assignedElements({ flatten: true }) ?? [];
    const fromSlot = assigned.filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (fromSlot.length > 0) return fromSlot;

    const fallback: HTMLElement[] = [];
    for (const child of this.children) {
      if (!(child instanceof HTMLElement)) continue;
      const slot = child.getAttribute('slot');
      if (slot === null || slot === '') fallback.push(child);
    }
    return fallback;
  }

  #normalizeSlotSlide(node: HTMLElement, index: number): CarouselSlide | null {
    const link = node instanceof HTMLAnchorElement ? node : node.querySelector('a');
    const media = queryMediaNode(link ?? node);
    if (!media) return null;

    const image = extractImageElement(media);
    const unit = this.#unitText();

    const dataTitle = trimOptional(node.getAttribute('data-title'));
    const ariaLabel = trimOptional(node.getAttribute('aria-label'));
    const alt = image?.alt ?? '';
    const label = dataTitle ?? ariaLabel ?? trimOptional(alt) ?? `${unit}${index + 1}`;

    const href = trimOptional(link?.getAttribute('href'));
    const target = trimOptional(link?.getAttribute('target'));
    const rel = resolveRel(target, trimOptional(link?.getAttribute('rel')));

    return {
      id: trimOptional(node.id) ?? `slot-${index + 1}`,
      label,
      href,
      target,
      rel,
      mediaNode: media,
    };
  }

  #unitText(): string {
    return normalizeText(this.getAttribute('unit'), DEFAULT_UNIT);
  }

  #syncCurrentIndex(): void {
    const total = this.#slideCount;
    const clamped = clampIndex(parseInteger(this.getAttribute('current-index')), total);
    this.#currentIndex = clamped;
    this.#reflectCurrentIndex();
  }

  #reflectCurrentIndex(): void {
    const next = String(this.#currentIndex);
    if (this.getAttribute('current-index') === next) return;

    this.#syncingCurrentIndexAttr = true;
    this.setAttribute('current-index', next);
    this.#syncingCurrentIndexAttr = false;
  }

  #setCurrentIndex(
    value: number,
    source: DadsCarouselEventSource,
    emitLegacyChangeEvent: boolean,
    loop: boolean,
  ): boolean {
    const total = this.#slideCount;
    if (total <= 0) return false;

    const previousIndex = this.#currentIndex;
    const requested = Math.trunc(value);
    const nextIndex = loop
      ? normalizeLoopIndex(requested, total)
      : clampIndex(requested, total);
    if (previousIndex === nextIndex) return false;

    const wrapped = loop && (requested < 0 || requested >= total);
    const userInitiated = this.#isUserInitiatedSource(source);
    const beforeDetail: DadsCarouselBeforeChangeDetail = {
      currentIndex: previousIndex,
      nextIndex,
      total,
      source,
      wrapped,
      userInitiated,
    };
    if (!this.#emitBeforeChange(beforeDetail)) return false;

    this.#currentIndex = nextIndex;
    this.#reflectCurrentIndex();
    this.#renderCurrentState(source);
    this.#syncStatus();

    const previousSlide = this.#slides[previousIndex];
    const activeSlide = this.#slides[nextIndex];
    if (previousSlide) {
      this.#emitSlideInactive({
        index: previousIndex,
        id: previousSlide.id,
        label: previousSlide.label,
        source,
      });
    }
    if (activeSlide) {
      this.#emitSlideActive({
        index: nextIndex,
        id: activeSlide.id,
        label: activeSlide.label,
        source,
      });
    }

    this.#emitIndexChange({
      previousIndex,
      currentIndex: nextIndex,
      total,
      source,
      wrapped,
      userInitiated,
    });

    if (!emitLegacyChangeEvent) return true;
    if (!isLegacyChangeSource(source)) return true;
    const detail: DadsCarouselChangeDetail = {
      currentIndex: nextIndex,
      previousIndex,
      total,
      source,
    };
    this.emitEvent<DadsCarouselChangeDetail>('dads-carousel-change', detail);
    return true;
  }

  #setExpanded(next: boolean, emitEvent: boolean, syncDetails: boolean): void {
    const canExpand = this.#slideCount >= 2;
    const normalized = canExpand ? next : false;
    const changed = this.#expanded !== normalized;
    this.#expanded = normalized;

    this.setAttribute('data-expanded', this.#expanded ? 'true' : 'false');

    if (syncDetails && this.#allSlides && this.#allSlides.open !== this.#expanded) {
      this.#syncingExpandedState = true;
      this.#allSlides.open = this.#expanded;
      this.#syncingExpandedState = false;
    }
    this.#syncResponsiveVisibility(canExpand);

    if (changed && emitEvent) {
      this.emitEvent<DadsCarouselToggleAllDetail>('dads-carousel-toggle-all', {
        expanded: this.#expanded,
      });
    }
  }

  #syncControlText(): void {
    const prevLabel = normalizeText(this.getAttribute('prev-label'), DEFAULT_PREV_LABEL);
    const nextLabel = normalizeText(this.getAttribute('next-label'), DEFAULT_NEXT_LABEL);
    const allSlidesLabel = normalizeText(
      this.getAttribute('all-slides-label'),
      DEFAULT_ALL_SLIDES_LABEL,
    );

    if (this.#pagePrevLabel) this.#pagePrevLabel.textContent = prevLabel;
    if (this.#pageNextLabel) this.#pageNextLabel.textContent = nextLabel;
    if (this.#allSlidesSummaryLabel) this.#allSlidesSummaryLabel.textContent = allSlidesLabel;
    if (this.#nextImageLabel) this.#nextImageLabel.textContent = nextLabel;
    if (this.#indicators) {
      this.#indicators.setAttribute(
        'aria-label',
        `${this.#unitText()}${DEFAULT_STEP_NAV_LABEL.replace(DEFAULT_UNIT, '')}`,
      );
    }
  }

  #syncResponsiveVisibility(hasMultiple: boolean): void {
    if (this.#controls) this.#controls.hidden = !hasMultiple;
    if (this.#allSlides) this.#allSlides.hidden = !hasMultiple;

    const showDesktopControls = hasMultiple && this.#isWide && !this.#expanded;
    const showMobileControls = hasMultiple && !this.#isWide && !this.#expanded;
    const mode: DadsCarouselControlsUpdateDetail['mode'] = !hasMultiple || this.#expanded
      ? 'hidden'
      : this.#isWide
        ? 'desktop'
        : 'mobile';

    if (this.#nextWrap) this.#nextWrap.hidden = !showDesktopControls;
    if (this.#nextBg) this.#nextBg.hidden = !showDesktopControls;
    if (this.#indicators) this.#indicators.hidden = !showDesktopControls;
    if (this.#pageNav) this.#pageNav.hidden = !showMobileControls;

    this.#emitControlsUpdate({
      mode,
      total: this.#slideCount,
      currentIndex: this.#currentIndex,
      expanded: this.#expanded,
      wide: this.#isWide,
      imageSlider: this.#isImageSliderMode(),
      showStepNav: showDesktopControls,
      showPageNav: showMobileControls,
      showNextPreview: showDesktopControls,
      showAllSlides: hasMultiple,
      prevDisabled: !hasMultiple || this.#expanded || Boolean(this.#pagePrevButton?.disabled),
      nextDisabled: !hasMultiple || this.#expanded || Boolean(this.#pageNextButton?.disabled),
    });
  }

  #renderCurrentState(source: DadsCarouselEventSource): void {
    const total = this.#slideCount;
    if (total <= 0) {
      this.#renderEmptyState();
      return;
    }

    this.toggleAttribute('hidden', false);
    this.#setExpanded(this.#expanded, false, true);

    const current = this.#slides[this.#currentIndex];
    if (!current) {
      this.#renderEmptyState();
      return;
    }

    const renderSeq = ++this.#renderSeq;

    if (this.#currentNumber) this.#currentNumber.textContent = String(this.#currentIndex + 1);
    if (this.#mainLabel) this.#mainLabel.textContent = `${this.#unitText()}${this.#currentIndex + 1}`;

    this.#renderMainSlide(current, this.#currentIndex, renderSeq, source);

    const hasMultiple = total >= 2;

    if (hasMultiple) {
      const nextIndex = normalizeLoopIndex(this.#currentIndex + 1, total);
      const next = this.#slides[nextIndex];
      if (next) this.#renderNextSlide(next, nextIndex, renderSeq, source);
    } else {
      this.#nextImageContainer?.replaceChildren();
      this.#nextBgContent?.replaceChildren();
    }

    this.#renderIndicators();
    this.#renderAllSlidesList();

    if (this.#pageStatus) {
      this.#pageStatus.textContent = `${this.#currentIndex + 1} / ${total}`;
    }

    if (!hasMultiple) {
      this.#setExpanded(false, false, true);
    }

    this.#syncResponsiveVisibility(hasMultiple);
    this.#syncMainPanelSemantics();
  }

  #renderEmptyState(): void {
    this.#renderSeq += 1;
    this.#mainHeightLockSeq += 1;
    this.#currentIndex = 0;
    this.#reflectCurrentIndex();
    this.toggleAttribute('hidden', true);
    this.#setExpanded(false, false, true);

    this.#mainImages?.replaceChildren();
    this.#mainBgContent?.replaceChildren();
    this.#nextImageContainer?.replaceChildren();
    this.#nextBgContent?.replaceChildren();
    this.#indicators?.replaceChildren();
    this.#allSlidesList?.replaceChildren();
    this.#mainPanel?.style.removeProperty('min-block-size');

    this.#syncResponsiveVisibility(false);
    if (this.#status) this.#status.textContent = '';
    if (this.#pageStatus) this.#pageStatus.textContent = '';
  }

  #renderMainSlide(
    slide: CarouselSlide,
    index: number,
    renderSeq: number,
    source: DadsCarouselEventSource,
  ): void {
    if (!this.#mainLink || !this.#mainImages || !this.#mainBgContent) return;

    this.#syncLink(this.#mainLink, slide);
    const mainMedia = this.#createSlideMedia(slide, false, 'eager', 'sync');
    this.#replaceMediaWhenReady(this.#mainImages, mainMedia, {
      renderSeq,
      lockMainHeight: true,
      context: { index, role: 'main', source },
    });

    const mainBg = this.#createSlideMedia(slide, true, 'lazy', 'async');
    this.#replaceMediaWhenReady(this.#mainBgContent, mainBg, {
      renderSeq,
      lockMainHeight: false,
      context: { index, role: 'main-bg', source },
    });
  }

  #renderNextSlide(
    slide: CarouselSlide,
    index: number,
    renderSeq: number,
    source: DadsCarouselEventSource,
  ): void {
    if (!this.#nextImageContainer || !this.#nextBgContent) return;
    const media = this.#createSlideMedia(slide, true, 'lazy', 'async');
    const previewMedia = media ? (media.cloneNode(true) as HTMLElement) : null;
    const previewImage = previewMedia ? extractImageElement(previewMedia) : null;
    if (previewImage) previewImage.loading = 'eager';
    this.#replaceMediaWhenReady(this.#nextImageContainer, previewMedia, {
      renderSeq,
      lockMainHeight: false,
      context: { index, role: 'next-preview', source },
      waitPolicy: 'insert-immediately',
    });

    const bgMedia = this.#createSlideMedia(slide, true, 'lazy', 'async');
    const bgImage = bgMedia ? extractImageElement(bgMedia) : null;
    if (bgImage) bgImage.loading = 'eager';
    this.#replaceMediaWhenReady(this.#nextBgContent, bgMedia, {
      renderSeq,
      lockMainHeight: false,
      context: { index, role: 'next-bg', source },
      waitPolicy: 'insert-immediately',
    });
  }

  #syncLink(link: HTMLAnchorElement, slide: CarouselSlide): void {
    if (slide.href) {
      link.setAttribute('href', slide.href);
      if (slide.target) link.setAttribute('target', slide.target);
      else link.removeAttribute('target');
      if (slide.rel) link.setAttribute('rel', slide.rel);
      else link.removeAttribute('rel');
      return;
    }

    link.removeAttribute('href');
    link.removeAttribute('target');
    link.removeAttribute('rel');
  }

  #createSlideMedia(
    slide: CarouselSlide,
    noAlt: boolean,
    loading: 'eager' | 'lazy',
    decoding: DadsCarouselItem['decoding'],
  ): HTMLElement | null {
    if (slide.item) {
      const image = document.createElement('img');
      image.src = slide.item.src;
      image.alt = noAlt ? '' : slide.item.alt;
      if (slide.item.srcset) image.srcset = slide.item.srcset;
      if (slide.item.sizes) image.sizes = slide.item.sizes;
      if (slide.item.width !== undefined) image.width = slide.item.width;
      if (slide.item.height !== undefined) image.height = slide.item.height;
      image.loading = slide.item.loading ?? loading;
      image.decoding = slide.item.decoding ?? decoding ?? 'async';
      return image;
    }

    if (!slide.mediaNode) return null;
    const cloned = cloneMediaNode(slide.mediaNode, noAlt);
    const image = extractImageElement(cloned);
    if (image) {
      image.loading = loading;
      image.decoding = decoding ?? 'async';
    }
    return cloned;
  }

  #renderIndicators(): void {
    if (!this.#indicators) return;
    this.#indicators.replaceChildren();

    const total = this.#slideCount;
    if (total < 2) return;

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < total; index += 1) {
      const item = document.createElement('li');
      item.setAttribute('part', 'step-item');
      item.setAttribute('role', 'presentation');

      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('part', 'indicator-button number');
      button.setAttribute('role', 'tab');
      button.setAttribute('id', this.#indicatorId(index));
      button.setAttribute('data-index', String(index));
      button.setAttribute('aria-controls', this.#mainPanelId());
      button.setAttribute('aria-label', `${this.#unitText()}${index + 1}`);

      const unit = document.createElement('span');
      unit.setAttribute('part', 'visually-hidden');
      unit.textContent = this.#unitText();
      button.append(unit, String(index + 1));

      const isSelected = index === this.#currentIndex;
      button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      button.setAttribute('tabindex', isSelected ? '0' : '-1');
      if (isSelected) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');

      item.appendChild(button);
      fragment.appendChild(item);
    }

    this.#indicators.appendChild(fragment);
  }

  #renderAllSlidesList(): void {
    if (!this.#allSlidesList) return;
    this.#allSlidesList.replaceChildren();

    const total = this.#slideCount;
    if (total < 2) return;

    const fragment = document.createDocumentFragment();
    for (let i = 1; i < total; i += 1) {
      const index = normalizeLoopIndex(this.#currentIndex + i, total);
      const slide = this.#slides[index];
      if (!slide) continue;

      const listItem = document.createElement('li');
      listItem.setAttribute('part', 'panel-set all-slides-item');
      listItem.setAttribute('data-index', String(index));

      const number = document.createElement('p');
      number.setAttribute('part', 'number panel-number');
      number.setAttribute('aria-hidden', 'true');
      number.textContent = String(index + 1);

      const main = document.createElement('div');
      main.setAttribute('part', 'main');

      const linkTag = slide.href ? 'a' : 'span';
      const link = document.createElement(linkTag);
      link.setAttribute('part', 'main-link');
      if (link instanceof HTMLAnchorElement) {
        this.#syncLink(link, slide);
      }

      const label = document.createElement('span');
      label.setAttribute('part', 'visually-hidden');
      label.textContent = `${this.#unitText()}${index + 1}`;

      const imageContainer = document.createElement('div');
      imageContainer.setAttribute('part', 'image-container');
      const media = this.#createSlideMedia(slide, false, 'lazy', 'async');
      if (media) imageContainer.appendChild(media);

      link.append(label, imageContainer);
      main.appendChild(link);

      const bg = document.createElement('div');
      bg.setAttribute('part', 'main-bg');
      const bgInner = document.createElement('div');
      const bgMedia = this.#createSlideMedia(slide, true, 'lazy', 'async');
      if (bgMedia) bgInner.appendChild(bgMedia);
      bg.appendChild(bgInner);

      listItem.append(number, main, bg);
      fragment.appendChild(listItem);
    }

    this.#allSlidesList.appendChild(fragment);
  }

  #replaceMediaWhenReady(
    container: HTMLElement | null,
    media: HTMLElement | null,
    options: {
      renderSeq: number;
      lockMainHeight: boolean;
      context: CarouselMediaContext;
      waitPolicy?: CarouselMediaWaitPolicy;
    },
  ): void {
    const {
      renderSeq,
      lockMainHeight,
      context,
      waitPolicy = 'wait-before-insert',
    } = options;
    if (!container) return;
    if (renderSeq !== this.#renderSeq) return;

    if (!media) {
      container.replaceChildren();
      if (lockMainHeight) this.#mainPanel?.style.removeProperty('min-block-size');
      return;
    }

    if (!this.#isMediaReady(media)) {
      if (waitPolicy === 'insert-immediately') {
        const releaseLock = lockMainHeight ? this.#lockMainPanelHeight() : (): void => {};
        container.replaceChildren(media);
        void this.#waitForMediaReady(media).then((result) => {
          if (renderSeq !== this.#renderSeq) {
            releaseLock();
            return;
          }
          this.#emitMediaResult(result, media, context);
          releaseLock();
        });
        return;
      }
      const releaseLock = lockMainHeight ? this.#lockMainPanelHeight() : (): void => {};
      void this.#waitForMediaReady(media).then((result) => {
        if (renderSeq !== this.#renderSeq) {
          releaseLock();
          return;
        }
        container.replaceChildren(media);
        this.#emitMediaResult(result, media, context);
        releaseLock();
      });
      return;
    }

    container.replaceChildren(media);
    this.#emitMediaLoaded(media, context);
    if (lockMainHeight) this.#mainPanel?.style.removeProperty('min-block-size');
  }

  #isMediaReady(media: HTMLElement): boolean {
    const image = extractImageElement(media);
    if (!image) return true;
    return image.complete;
  }

  #waitForMediaReady(media: HTMLElement): Promise<CarouselMediaReadyResult> {
    const image = extractImageElement(media);
    if (!image) return Promise.resolve({ ok: true });
    if (image.complete) return Promise.resolve({ ok: true });

    return new Promise((resolve) => {
      let settled = false;
      const finalize = (result: CarouselMediaReadyResult): void => {
        if (settled) return;
        settled = true;
        image.removeEventListener('load', handleLoad);
        image.removeEventListener('error', handleError);
        resolve(result);
      };

      const handleLoad = (): void => {
        finalize({ ok: true });
      };
      const handleError = (): void => {
        finalize({ ok: false, error: 'load-error' });
      };

      image.addEventListener('load', handleLoad, { once: true });
      image.addEventListener('error', handleError, { once: true });

      if (typeof image.decode === 'function') {
        void image.decode()
          .then(() => finalize({ ok: true }))
          .catch(() => {
            finalize({ ok: false, error: 'decode-error' });
          });
        return;
      }

      if (image.complete) {
        finalize({ ok: true });
      }
    });
  }

  #lockMainPanelHeight(): () => void {
    if (!this.#mainPanel) return (): void => {};
    const measured = this.#mainPanel.getBoundingClientRect().height;
    if (!(measured > 0)) return (): void => {};

    const token = ++this.#mainHeightLockSeq;
    this.#mainPanel.style.minBlockSize = `${Math.ceil(measured)}px`;

    return (): void => {
      if (token !== this.#mainHeightLockSeq) return;
      const panel = this.#mainPanel;
      if (!panel) return;
      requestAnimationFrame(() => {
        if (token !== this.#mainHeightLockSeq) return;
        panel.style.removeProperty('min-block-size');
      });
    };
  }

  #primeSlidePreload(): void {
    this.#preloadCache.clear();
    for (const slide of this.#slides) {
      void this.#preloadSlide(slide);
    }
  }

  #getSlideImageSource(slide: CarouselSlide): CarouselSlideImageSource | null {
    if (slide.item) {
      return {
        src: slide.item.src,
        srcset: slide.item.srcset,
        sizes: slide.item.sizes,
      };
    }

    if (!slide.mediaNode) return null;
    const image = extractImageElement(slide.mediaNode);
    if (!image || !image.src) return null;

    const source: CarouselSlideImageSource = { src: image.src };
    if (image.srcset) source.srcset = image.srcset;
    if (image.sizes) source.sizes = image.sizes;
    return source;
  }

  #preloadSlide(slide: CarouselSlide | undefined): Promise<void> {
    if (!slide) return Promise.resolve();

    const source = this.#getSlideImageSource(slide);
    if (!source?.src) return Promise.resolve();

    const key = `${source.src}|${source.srcset ?? ''}|${source.sizes ?? ''}`;
    const cached = this.#preloadCache.get(key);
    if (cached) return cached;

    const preload = new Promise<void>((resolve) => {
      let done = false;
      const finish = (): void => {
        if (done) return;
        done = true;
        resolve();
      };

      const image = new Image();
      if (source.srcset) image.srcset = source.srcset;
      if (source.sizes) image.sizes = source.sizes;

      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      image.src = source.src;

      if (image.complete) {
        finish();
        return;
      }

      if (typeof image.decode === 'function') {
        void image.decode().then(finish).catch(finish);
      }
    });

    this.#preloadCache.set(key, preload);
    return preload;
  }

  #isUserInitiatedSource(source: DadsCarouselEventSource): boolean {
    return source === 'prev' || source === 'next' || source === 'indicator' || source === 'all-slides';
  }

  #emitBeforeChange(detail: DadsCarouselBeforeChangeDetail): boolean {
    return this.emitEvent<DadsCarouselBeforeChangeDetail>('dads-carousel-before-change', detail);
  }

  #emitIndexChange(detail: DadsCarouselIndexChangeDetail): void {
    this.emitEvent<DadsCarouselIndexChangeDetail>('dads-carousel-index-change', detail, {
      cancelable: false,
    });
  }

  #emitSlideActive(detail: DadsCarouselSlideStateDetail): void {
    this.emitEvent<DadsCarouselSlideStateDetail>('dads-carousel-slide-active', detail, {
      cancelable: false,
    });
  }

  #emitSlideInactive(detail: DadsCarouselSlideStateDetail): void {
    this.emitEvent<DadsCarouselSlideStateDetail>('dads-carousel-slide-inactive', detail, {
      cancelable: false,
    });
  }

  #emitSlidesChange(detail: DadsCarouselSlidesChangeDetail): void {
    this.emitEvent<DadsCarouselSlidesChangeDetail>('dads-carousel-slides-change', detail, {
      cancelable: false,
    });
  }

  #emitLayoutChange(detail: DadsCarouselLayoutChangeDetail): void {
    this.emitEvent<DadsCarouselLayoutChangeDetail>('dads-carousel-layout-change', detail, {
      cancelable: false,
    });
  }

  #emitControlsUpdate(detail: DadsCarouselControlsUpdateDetail): void {
    const key = JSON.stringify(detail);
    if (this.#lastControlsUpdateKey === key) return;
    this.#lastControlsUpdateKey = key;
    this.emitEvent<DadsCarouselControlsUpdateDetail>('dads-carousel-controls-update', detail, {
      cancelable: false,
    });
  }

  #emitMediaLoaded(
    media: HTMLElement,
    context: CarouselMediaContext,
  ): void {
    const src = this.#mediaSrc(media);
    if (!src) return;
    this.emitEvent<DadsCarouselMediaDetail>('dads-carousel-media-loaded', {
      index: context.index,
      role: context.role,
      src,
      source: context.source,
    }, { cancelable: false });
  }

  #emitMediaError(
    media: HTMLElement,
    context: CarouselMediaContext,
    error: 'decode-error' | 'load-error',
  ): void {
    const src = this.#mediaSrc(media);
    if (!src) return;
    this.emitEvent<DadsCarouselMediaDetail>('dads-carousel-media-error', {
      index: context.index,
      role: context.role,
      src,
      source: context.source,
      error,
    }, { cancelable: false });
  }

  #emitMediaResult(
    result: CarouselMediaReadyResult,
    media: HTMLElement,
    context: CarouselMediaContext,
  ): void {
    if (result.ok) {
      this.#emitMediaLoaded(media, context);
      return;
    }
    this.#emitMediaError(media, context, result.error);
  }

  #mediaSrc(media: HTMLElement): string | null {
    const image = extractImageElement(media);
    if (!image) return null;
    const src = image.currentSrc || image.src;
    return src && src.length > 0 ? src : null;
  }

  #currentContainerWidthPx(): number {
    const width = this.getBoundingClientRect().width;
    if (!Number.isFinite(width) || width <= 0) return 0;
    return Math.round(width);
  }

  #syncMainPanelSemantics(): void {
    if (!this.#mainPanel) return;

    if (!this.#isWide || this.#slideCount <= 0) {
      this.#mainPanel.removeAttribute('role');
      this.#mainPanel.removeAttribute('aria-label');
      return;
    }

    this.#mainPanel.setAttribute('role', 'tabpanel');
    this.#mainPanel.setAttribute('aria-label', `${this.#unitText()}${this.#currentIndex + 1}`);
    this.#mainPanel.id = this.#mainPanelId();
  }

  #syncStatus(): void {
    if (!this.#status) return;

    if (this.#slideCount <= 0) {
      this.#status.textContent = '';
      return;
    }

    this.#status.textContent = `全${this.#slideCount}枚中${this.#currentIndex + 1}枚目`;
  }

  #mainPanelId(): string {
    return `${this.localName}-panel-${this.#instanceId}`;
  }

  #indicatorId(index: number): string {
    return `${this.localName}-indicator-${this.#instanceId}-${index + 1}`;
  }
}
