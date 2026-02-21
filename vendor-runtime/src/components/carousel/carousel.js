/**
 * @module carousel
 * デジタル庁デザインシステム Carousel コンポーネント
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
var _DadsCarousel_instances, _DadsCarousel_instanceId, _DadsCarousel_items, _DadsCarousel_slides, _DadsCarousel_source, _DadsCarousel_expanded, _DadsCarousel_currentIndex, _DadsCarousel_slideCount, _DadsCarousel_isWide, _DadsCarousel_measuredWide, _DadsCarousel_syncingCurrentIndexAttr, _DadsCarousel_syncingExpandedState, _DadsCarousel_preloadCache, _DadsCarousel_renderSeq, _DadsCarousel_mainHeightLockSeq, _DadsCarousel_lastControlsUpdateKey, _DadsCarousel_root, _DadsCarousel_headingSlot, _DadsCarousel_slidesSlot, _DadsCarousel_mainPanel, _DadsCarousel_mainLink, _DadsCarousel_mainLabel, _DadsCarousel_mainImages, _DadsCarousel_mainBgContent, _DadsCarousel_currentNumber, _DadsCarousel_nextWrap, _DadsCarousel_nextButton, _DadsCarousel_nextImageContainer, _DadsCarousel_nextImageLabel, _DadsCarousel_nextBg, _DadsCarousel_nextBgContent, _DadsCarousel_controls, _DadsCarousel_indicators, _DadsCarousel_pageNav, _DadsCarousel_pagePrevButton, _DadsCarousel_pagePrevLabel, _DadsCarousel_pageNextButton, _DadsCarousel_pageNextLabel, _DadsCarousel_pageStatus, _DadsCarousel_allSlides, _DadsCarousel_allSlidesSummaryLabel, _DadsCarousel_allSlidesList, _DadsCarousel_status, _DadsCarousel_hostObserver, _DadsCarousel_resizeObserver, _DadsCarousel_handleSlotChange, _DadsCarousel_handleHostMutations, _DadsCarousel_handlePrevClick, _DadsCarousel_handleNextClick, _DadsCarousel_handleIndicatorsClick, _DadsCarousel_handleIndicatorsKeydown, _DadsCarousel_handleAllSlidesToggle, _DadsCarousel_handleRootKeydown, _DadsCarousel_setupResizeObserver, _DadsCarousel_syncWideState, _DadsCarousel_syncAll, _DadsCarousel_isImageSliderMode, _DadsCarousel_measureWideFromCurrentWidth, _DadsCarousel_syncTypeAttribute, _DadsCarousel_syncRootSemantics, _DadsCarousel_collectSlides, _DadsCarousel_collectItemSlides, _DadsCarousel_collectSlotSlides, _DadsCarousel_getSlotSlides, _DadsCarousel_normalizeSlotSlide, _DadsCarousel_unitText, _DadsCarousel_syncCurrentIndex, _DadsCarousel_reflectCurrentIndex, _DadsCarousel_setCurrentIndex, _DadsCarousel_setExpanded, _DadsCarousel_syncControlText, _DadsCarousel_syncResponsiveVisibility, _DadsCarousel_renderCurrentState, _DadsCarousel_renderEmptyState, _DadsCarousel_renderMainSlide, _DadsCarousel_renderNextSlide, _DadsCarousel_syncLink, _DadsCarousel_createSlideMedia, _DadsCarousel_renderIndicators, _DadsCarousel_renderAllSlidesList, _DadsCarousel_replaceMediaWhenReady, _DadsCarousel_isMediaReady, _DadsCarousel_waitForMediaReady, _DadsCarousel_lockMainPanelHeight, _DadsCarousel_primeSlidePreload, _DadsCarousel_getSlideImageSource, _DadsCarousel_preloadSlide, _DadsCarousel_isUserInitiatedSource, _DadsCarousel_emitBeforeChange, _DadsCarousel_emitIndexChange, _DadsCarousel_emitSlideActive, _DadsCarousel_emitSlideInactive, _DadsCarousel_emitSlidesChange, _DadsCarousel_emitLayoutChange, _DadsCarousel_emitControlsUpdate, _DadsCarousel_emitMediaLoaded, _DadsCarousel_emitMediaError, _DadsCarousel_emitMediaResult, _DadsCarousel_mediaSrc, _DadsCarousel_currentContainerWidthPx, _DadsCarousel_syncMainPanelSemantics, _DadsCarousel_syncStatus, _DadsCarousel_mainPanelId, _DadsCarousel_indicatorId;
import { html, Keys, BooleanAttr, PropertyAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { carouselTokens } from './carousel-tokens.js';
import { carouselStyles } from './carousel-styles.js';
const DEFAULT_TYPE = 'container';
const DEFAULT_ARIA_LABEL = 'カルーセル';
const DEFAULT_UNIT = 'スライド';
const DEFAULT_PREV_LABEL = '前のスライド';
const DEFAULT_NEXT_LABEL = '次のスライド';
const DEFAULT_ALL_SLIDES_LABEL = 'すべてのスライド';
const DEFAULT_BREAKPOINT_REM = 64;
const DEFAULT_STEP_NAV_LABEL = 'スライド選択';
let carouselIdSeed = 0;
function normalizeType(value) {
    return value === 'key-visual' ? 'key-visual' : DEFAULT_TYPE;
}
function normalizeText(value, fallback) {
    const normalized = value?.trim();
    return normalized && normalized.length > 0 ? normalized : fallback;
}
function parseInteger(value) {
    if (value === null)
        return 0;
    const parsed = Number(value);
    if (!Number.isFinite(parsed))
        return 0;
    return Math.trunc(parsed);
}
function clampIndex(value, total) {
    if (!Number.isFinite(value) || total <= 0)
        return 0;
    if (value < 0)
        return 0;
    if (value >= total)
        return total - 1;
    return value;
}
function normalizeLoopIndex(value, total) {
    if (!Number.isFinite(value) || total <= 0)
        return 0;
    const normalized = Math.trunc(value) % total;
    return normalized >= 0 ? normalized : normalized + total;
}
function parseBreakpointRem(value) {
    const parsed = Number.parseFloat(value ?? '');
    if (!Number.isFinite(parsed) || parsed <= 0)
        return DEFAULT_BREAKPOINT_REM;
    return parsed;
}
function trimOptional(value) {
    if (typeof value !== 'string')
        return undefined;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
}
function toOptionalNumber(value) {
    if (typeof value !== 'number')
        return undefined;
    return Number.isFinite(value) ? value : undefined;
}
function normalizeLoading(value) {
    return value === 'eager' || value === 'lazy' ? value : undefined;
}
function normalizeDecoding(value) {
    return value === 'sync' || value === 'async' || value === 'auto' ? value : undefined;
}
function normalizeItem(raw) {
    if (!raw || typeof raw !== 'object')
        return null;
    const src = trimOptional(raw.src);
    if (!src)
        return null;
    const item = {
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
    if (href)
        item.href = href;
    if (title)
        item.title = title;
    if (description)
        item.description = description;
    if (srcset)
        item.srcset = srcset;
    if (sizes)
        item.sizes = sizes;
    if (target)
        item.target = target;
    if (rel)
        item.rel = rel;
    if (loading)
        item.loading = loading;
    if (decoding)
        item.decoding = decoding;
    if (id)
        item.id = id;
    if (width !== undefined)
        item.width = width;
    if (height !== undefined)
        item.height = height;
    return item;
}
function resolveRel(target, rel) {
    if (rel)
        return rel;
    if (target === '_blank')
        return 'noopener noreferrer';
    return undefined;
}
function isLegacyChangeSource(source) {
    return source === 'prev' || source === 'next' || source === 'indicator';
}
function queryMediaNode(root) {
    if (!root)
        return null;
    if (root instanceof HTMLImageElement || root instanceof HTMLPictureElement)
        return root;
    const picture = root.querySelector('picture');
    if (picture instanceof HTMLPictureElement) {
        const pictureImg = picture.querySelector('img');
        if (pictureImg instanceof HTMLImageElement)
            return picture;
    }
    const image = root.querySelector('img');
    if (image instanceof HTMLImageElement)
        return image;
    return null;
}
function extractImageElement(root) {
    if (root instanceof HTMLImageElement)
        return root;
    const image = root.querySelector('img');
    return image instanceof HTMLImageElement ? image : null;
}
function cloneMediaNode(node, noAlt) {
    const cloned = node.cloneNode(true);
    if (!noAlt)
        return cloned;
    if (cloned instanceof HTMLImageElement) {
        cloned.alt = '';
        return cloned;
    }
    const image = cloned.querySelector('img');
    if (image instanceof HTMLImageElement)
        image.alt = '';
    return cloned;
}
function createCurrentIndexAttrBehavior() {
    return {
        attribute: 'current-index',
        attributeChangedCallback(instance, oldValue, newValue) {
            const callback = instance
                .currentIndexChanged;
            if (typeof callback === 'function')
                callback.call(instance, oldValue, newValue);
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
    constructor() {
        super(...arguments);
        _DadsCarousel_instances.add(this);
        _DadsCarousel_instanceId.set(this, ++carouselIdSeed);
        _DadsCarousel_items.set(this, []);
        _DadsCarousel_slides.set(this, []);
        _DadsCarousel_source.set(this, 'slot');
        _DadsCarousel_expanded.set(this, false);
        _DadsCarousel_currentIndex.set(this, 0);
        _DadsCarousel_slideCount.set(this, 0);
        _DadsCarousel_isWide.set(this, false);
        _DadsCarousel_measuredWide.set(this, true);
        _DadsCarousel_syncingCurrentIndexAttr.set(this, false);
        _DadsCarousel_syncingExpandedState.set(this, false);
        _DadsCarousel_preloadCache.set(this, new Map());
        _DadsCarousel_renderSeq.set(this, 0);
        _DadsCarousel_mainHeightLockSeq.set(this, 0);
        _DadsCarousel_lastControlsUpdateKey.set(this, '');
        _DadsCarousel_root.set(this, null);
        _DadsCarousel_headingSlot.set(this, null);
        _DadsCarousel_slidesSlot.set(this, null);
        _DadsCarousel_mainPanel.set(this, null);
        _DadsCarousel_mainLink.set(this, null);
        _DadsCarousel_mainLabel.set(this, null);
        _DadsCarousel_mainImages.set(this, null);
        _DadsCarousel_mainBgContent.set(this, null);
        _DadsCarousel_currentNumber.set(this, null);
        _DadsCarousel_nextWrap.set(this, null);
        _DadsCarousel_nextButton.set(this, null);
        _DadsCarousel_nextImageContainer.set(this, null);
        _DadsCarousel_nextImageLabel.set(this, null);
        _DadsCarousel_nextBg.set(this, null);
        _DadsCarousel_nextBgContent.set(this, null);
        _DadsCarousel_controls.set(this, null);
        _DadsCarousel_indicators.set(this, null);
        _DadsCarousel_pageNav.set(this, null);
        _DadsCarousel_pagePrevButton.set(this, null);
        _DadsCarousel_pagePrevLabel.set(this, null);
        _DadsCarousel_pageNextButton.set(this, null);
        _DadsCarousel_pageNextLabel.set(this, null);
        _DadsCarousel_pageStatus.set(this, null);
        _DadsCarousel_allSlides.set(this, null);
        _DadsCarousel_allSlidesSummaryLabel.set(this, null);
        _DadsCarousel_allSlidesList.set(this, null);
        _DadsCarousel_status.set(this, null);
        _DadsCarousel_hostObserver.set(this, null);
        _DadsCarousel_resizeObserver.set(this, null);
        _DadsCarousel_handleSlotChange.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCarousel_items, "f").length > 0)
                return;
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'slotchange', 'sync');
        });
        _DadsCarousel_handleHostMutations.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCarousel_items, "f").length > 0)
                return;
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'mutation', 'sync');
        });
        _DadsCarousel_handlePrevClick.set(this, () => {
            this.prev();
        });
        _DadsCarousel_handleNextClick.set(this, () => {
            this.next();
        });
        _DadsCarousel_handleIndicatorsClick.set(this, (event) => {
            const target = event.target;
            if (!(target instanceof Element))
                return;
            const button = target.closest('button[data-index]');
            if (!button)
                return;
            const index = parseInteger(button.getAttribute('data-index'));
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setCurrentIndex).call(this, index, 'indicator', true, false);
        });
        _DadsCarousel_handleIndicatorsKeydown.set(this, (event) => {
            if (!(event.target instanceof Element))
                return;
            const currentButton = event.target.closest('button[data-index]');
            if (!currentButton)
                return;
            const total = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
            if (total < 2)
                return;
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
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setCurrentIndex).call(this, next, 'indicator', true, loop);
            const targetIndex = loop ? normalizeLoopIndex(next, total) : clampIndex(next, total);
            const nextButton = __classPrivateFieldGet(this, _DadsCarousel_indicators, "f")?.querySelector(`button[data-index="${targetIndex}"]`);
            nextButton?.focus();
        });
        _DadsCarousel_handleAllSlidesToggle.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsCarousel_syncingExpandedState, "f"))
                return;
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setExpanded).call(this, Boolean(__classPrivateFieldGet(this, _DadsCarousel_allSlides, "f")?.open), true, false);
        });
        _DadsCarousel_handleRootKeydown.set(this, (event) => {
            if (event.key !== 'Escape')
                return;
            if (!__classPrivateFieldGet(this, _DadsCarousel_expanded, "f"))
                return;
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setExpanded).call(this, false, true, true);
            __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f")?.querySelector('summary')?.focus();
        });
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute('type'))
            this.setAttribute('type', DEFAULT_TYPE);
        if (!this.hasAttribute('current-index'))
            this.setAttribute('current-index', '0');
        if (!this.hasAttribute('aria-label'))
            this.setAttribute('aria-label', DEFAULT_ARIA_LABEL);
        if (!this.hasAttribute('prev-label'))
            this.setAttribute('prev-label', DEFAULT_PREV_LABEL);
        if (!this.hasAttribute('next-label'))
            this.setAttribute('next-label', DEFAULT_NEXT_LABEL);
        if (!this.hasAttribute('all-slides-label')) {
            this.setAttribute('all-slides-label', DEFAULT_ALL_SLIDES_LABEL);
        }
        if (!this.hasAttribute('breakpoint-rem')) {
            this.setAttribute('breakpoint-rem', String(DEFAULT_BREAKPOINT_REM));
        }
        if (!this.hasAttribute('unit'))
            this.setAttribute('unit', DEFAULT_UNIT);
        __classPrivateFieldSet(this, _DadsCarousel_root, this.shadowRoot?.querySelector('#root'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_headingSlot, this.shadowRoot?.querySelector('#heading-slot'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_slidesSlot, this.shadowRoot?.querySelector('#slides-slot'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_mainPanel, this.shadowRoot?.querySelector('#main-panel'), "f");
        if (__classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f"))
            __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").id = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_mainPanelId).call(this);
        __classPrivateFieldSet(this, _DadsCarousel_mainLink, this.shadowRoot?.querySelector('#main-link'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_mainLabel, this.shadowRoot?.querySelector('#main-label'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_mainImages, this.shadowRoot?.querySelector('#main-images'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_mainBgContent, this.shadowRoot?.querySelector('#main-bg-content'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_currentNumber, this.shadowRoot?.querySelector('#current-number'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_nextWrap, this.shadowRoot?.querySelector('#next'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_nextButton, this.shadowRoot?.querySelector('#next-preview-button'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_nextImageContainer, this.shadowRoot?.querySelector('#next-image-container'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_nextImageLabel, this.shadowRoot?.querySelector('#next-image-label'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_nextBg, this.shadowRoot?.querySelector('#next-bg'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_nextBgContent, this.shadowRoot?.querySelector('#next-bg-content'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_controls, this.shadowRoot?.querySelector('#controls'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_indicators, this.shadowRoot?.querySelector('#indicators'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_pageNav, this.shadowRoot?.querySelector('#page-nav'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_pagePrevButton, this.shadowRoot?.querySelector('#page-prev-button'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_pagePrevLabel, this.shadowRoot?.querySelector('#page-prev-label'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_pageNextButton, this.shadowRoot?.querySelector('#page-next-button'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_pageNextLabel, this.shadowRoot?.querySelector('#page-next-label'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_pageStatus, this.shadowRoot?.querySelector('#page-status'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_allSlides, this.shadowRoot?.querySelector('#all-slides'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_allSlidesSummaryLabel, this.shadowRoot?.querySelector('#all-slides-summary-label'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_allSlidesList, this.shadowRoot?.querySelector('#all-slides-list'), "f");
        __classPrivateFieldSet(this, _DadsCarousel_status, this.shadowRoot?.querySelector('#status'), "f");
        __classPrivateFieldGet(this, _DadsCarousel_slidesSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsCarousel_handleSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_nextButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handleNextClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_pagePrevButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handlePrevClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_pageNextButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handleNextClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_indicators, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handleIndicatorsClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_indicators, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCarousel_handleIndicatorsKeydown, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f")?.addEventListener('toggle', __classPrivateFieldGet(this, _DadsCarousel_handleAllSlidesToggle, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_root, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsCarousel_handleRootKeydown, "f"));
        __classPrivateFieldSet(this, _DadsCarousel_hostObserver, new MutationObserver(__classPrivateFieldGet(this, _DadsCarousel_handleHostMutations, "f")), "f");
        __classPrivateFieldGet(this, _DadsCarousel_hostObserver, "f").observe(this, {
            childList: true,
            attributes: true,
            attributeFilter: ['slot', 'data-title', 'data-description'],
            subtree: true,
        });
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setupResizeObserver).call(this, 'sync');
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'sync', 'sync');
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsCarousel_slidesSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsCarousel_handleSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_nextButton, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handleNextClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_pagePrevButton, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handlePrevClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_pageNextButton, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handleNextClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_indicators, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsCarousel_handleIndicatorsClick, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_indicators, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsCarousel_handleIndicatorsKeydown, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f")?.removeEventListener('toggle', __classPrivateFieldGet(this, _DadsCarousel_handleAllSlidesToggle, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_root, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsCarousel_handleRootKeydown, "f"));
        __classPrivateFieldGet(this, _DadsCarousel_hostObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsCarousel_hostObserver, null, "f");
        __classPrivateFieldGet(this, _DadsCarousel_resizeObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsCarousel_resizeObserver, null, "f");
        super.disconnectedCallback();
    }
    typeChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'sync', 'sync');
    }
    ariaLabelChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncRootSemantics).call(this);
    }
    prevLabelChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncControlText).call(this);
    }
    nextLabelChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncControlText).call(this);
    }
    allSlidesLabelChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncControlText).call(this);
    }
    imageSliderChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'sync', 'image-slider');
    }
    breakpointRemChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setupResizeObserver).call(this, 'breakpoint');
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_measureWideFromCurrentWidth).call(this);
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncWideState).call(this, 'breakpoint');
    }
    unitChanged() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'sync', 'sync');
    }
    currentIndexChanged() {
        if (__classPrivateFieldGet(this, _DadsCarousel_syncingCurrentIndexAttr, "f"))
            return;
        const total = __classPrivateFieldGet(this, _DadsCarousel_slides, "f").length;
        if (total <= 0) {
            __classPrivateFieldSet(this, _DadsCarousel_currentIndex, 0, "f");
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_reflectCurrentIndex).call(this);
            return;
        }
        const changed = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setCurrentIndex).call(this, parseInteger(this.getAttribute('current-index')), 'attribute', false, false);
        if (!changed)
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_reflectCurrentIndex).call(this);
    }
    get items() {
        return __classPrivateFieldGet(this, _DadsCarousel_items, "f").slice();
    }
    set items(value) {
        const nextItems = [];
        if (Array.isArray(value)) {
            for (const raw of value) {
                const normalized = normalizeItem(raw);
                if (normalized)
                    nextItems.push(normalized);
            }
        }
        __classPrivateFieldSet(this, _DadsCarousel_items, nextItems, "f");
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncAll).call(this, 'items', 'sync');
    }
    get currentIndex() {
        return __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f");
    }
    set currentIndex(value) {
        this.goTo(value);
    }
    get expanded() {
        return __classPrivateFieldGet(this, _DadsCarousel_expanded, "f");
    }
    set expanded(value) {
        this.toggleAllSlides(Boolean(value));
    }
    get slideCount() {
        return __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    }
    goTo(index) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setCurrentIndex).call(this, index, 'api', false, false);
    }
    next() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setCurrentIndex).call(this, __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1, 'next', true, true);
    }
    prev() {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setCurrentIndex).call(this, __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") - 1, 'prev', true, true);
    }
    toggleAllSlides(force) {
        const next = typeof force === 'boolean' ? force : !__classPrivateFieldGet(this, _DadsCarousel_expanded, "f");
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setExpanded).call(this, next, true, true);
    }
}
_DadsCarousel_instanceId = new WeakMap(), _DadsCarousel_items = new WeakMap(), _DadsCarousel_slides = new WeakMap(), _DadsCarousel_source = new WeakMap(), _DadsCarousel_expanded = new WeakMap(), _DadsCarousel_currentIndex = new WeakMap(), _DadsCarousel_slideCount = new WeakMap(), _DadsCarousel_isWide = new WeakMap(), _DadsCarousel_measuredWide = new WeakMap(), _DadsCarousel_syncingCurrentIndexAttr = new WeakMap(), _DadsCarousel_syncingExpandedState = new WeakMap(), _DadsCarousel_preloadCache = new WeakMap(), _DadsCarousel_renderSeq = new WeakMap(), _DadsCarousel_mainHeightLockSeq = new WeakMap(), _DadsCarousel_lastControlsUpdateKey = new WeakMap(), _DadsCarousel_root = new WeakMap(), _DadsCarousel_headingSlot = new WeakMap(), _DadsCarousel_slidesSlot = new WeakMap(), _DadsCarousel_mainPanel = new WeakMap(), _DadsCarousel_mainLink = new WeakMap(), _DadsCarousel_mainLabel = new WeakMap(), _DadsCarousel_mainImages = new WeakMap(), _DadsCarousel_mainBgContent = new WeakMap(), _DadsCarousel_currentNumber = new WeakMap(), _DadsCarousel_nextWrap = new WeakMap(), _DadsCarousel_nextButton = new WeakMap(), _DadsCarousel_nextImageContainer = new WeakMap(), _DadsCarousel_nextImageLabel = new WeakMap(), _DadsCarousel_nextBg = new WeakMap(), _DadsCarousel_nextBgContent = new WeakMap(), _DadsCarousel_controls = new WeakMap(), _DadsCarousel_indicators = new WeakMap(), _DadsCarousel_pageNav = new WeakMap(), _DadsCarousel_pagePrevButton = new WeakMap(), _DadsCarousel_pagePrevLabel = new WeakMap(), _DadsCarousel_pageNextButton = new WeakMap(), _DadsCarousel_pageNextLabel = new WeakMap(), _DadsCarousel_pageStatus = new WeakMap(), _DadsCarousel_allSlides = new WeakMap(), _DadsCarousel_allSlidesSummaryLabel = new WeakMap(), _DadsCarousel_allSlidesList = new WeakMap(), _DadsCarousel_status = new WeakMap(), _DadsCarousel_hostObserver = new WeakMap(), _DadsCarousel_resizeObserver = new WeakMap(), _DadsCarousel_handleSlotChange = new WeakMap(), _DadsCarousel_handleHostMutations = new WeakMap(), _DadsCarousel_handlePrevClick = new WeakMap(), _DadsCarousel_handleNextClick = new WeakMap(), _DadsCarousel_handleIndicatorsClick = new WeakMap(), _DadsCarousel_handleIndicatorsKeydown = new WeakMap(), _DadsCarousel_handleAllSlidesToggle = new WeakMap(), _DadsCarousel_handleRootKeydown = new WeakMap(), _DadsCarousel_instances = new WeakSet(), _DadsCarousel_setupResizeObserver = function _DadsCarousel_setupResizeObserver(reason = 'sync') {
    __classPrivateFieldGet(this, _DadsCarousel_resizeObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsCarousel_resizeObserver, null, "f");
    if (typeof ResizeObserver === 'undefined') {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_measureWideFromCurrentWidth).call(this);
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncWideState).call(this, reason);
        return;
    }
    const minWidthRem = parseBreakpointRem(this.getAttribute('breakpoint-rem'));
    __classPrivateFieldSet(this, _DadsCarousel_resizeObserver, new ResizeObserver((entries) => {
        for (const entry of entries) {
            const boxSize = Array.isArray(entry.borderBoxSize)
                ? entry.borderBoxSize[0]
                : entry.borderBoxSize;
            const inlineSize = boxSize ? boxSize.inlineSize : entry.contentRect.width;
            const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
            const widthRem = inlineSize / (Number.isFinite(rootFontSize) ? rootFontSize : 16);
            __classPrivateFieldSet(this, _DadsCarousel_measuredWide, widthRem >= minWidthRem, "f");
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncWideState).call(this, 'resize');
        }
    }), "f");
    __classPrivateFieldGet(this, _DadsCarousel_resizeObserver, "f").observe(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_measureWideFromCurrentWidth).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncWideState).call(this, reason);
}, _DadsCarousel_syncWideState = function _DadsCarousel_syncWideState(reason = 'sync') {
    const next = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_isImageSliderMode).call(this) ? false : __classPrivateFieldGet(this, _DadsCarousel_measuredWide, "f");
    this.setAttribute('data-wide', next ? 'true' : 'false');
    const previousWide = __classPrivateFieldGet(this, _DadsCarousel_isWide, "f");
    if (previousWide === next) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncMainPanelSemantics).call(this);
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncResponsiveVisibility).call(this, __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f") >= 2);
        return;
    }
    __classPrivateFieldSet(this, _DadsCarousel_isWide, next, "f");
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitLayoutChange).call(this, {
        previousWide,
        wide: next,
        imageSlider: __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_isImageSliderMode).call(this),
        breakpointRem: parseBreakpointRem(this.getAttribute('breakpoint-rem')),
        containerWidthPx: __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_currentContainerWidthPx).call(this),
        reason,
    });
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncMainPanelSemantics).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncResponsiveVisibility).call(this, __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f") >= 2);
}, _DadsCarousel_syncAll = function _DadsCarousel_syncAll(slidesReason = 'sync', layoutReason = 'sync') {
    if (!this.isConnected)
        return;
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncTypeAttribute).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncRootSemantics).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_collectSlides).call(this, slidesReason);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_measureWideFromCurrentWidth).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncWideState).call(this, layoutReason);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncControlText).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncCurrentIndex).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderCurrentState).call(this, 'sync');
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncStatus).call(this);
}, _DadsCarousel_isImageSliderMode = function _DadsCarousel_isImageSliderMode() {
    return this.hasAttribute('image-slider');
}, _DadsCarousel_measureWideFromCurrentWidth = function _DadsCarousel_measureWideFromCurrentWidth() {
    const width = this.getBoundingClientRect().width;
    if (!Number.isFinite(width) || width <= 0)
        return;
    const minWidthRem = parseBreakpointRem(this.getAttribute('breakpoint-rem'));
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
    const widthRem = width / (Number.isFinite(rootFontSize) ? rootFontSize : 16);
    __classPrivateFieldSet(this, _DadsCarousel_measuredWide, widthRem >= minWidthRem, "f");
}, _DadsCarousel_syncTypeAttribute = function _DadsCarousel_syncTypeAttribute() {
    const imageSliderMode = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_isImageSliderMode).call(this);
    const normalizedType = normalizeType(this.getAttribute('type'));
    if (this.getAttribute('type') !== normalizedType) {
        this.setAttribute('type', normalizedType);
        return;
    }
    const effectiveType = imageSliderMode ? 'container' : normalizedType;
    this.setAttribute('data-carousel-type', effectiveType);
    this.setAttribute('data-image-slider', imageSliderMode ? 'true' : 'false');
}, _DadsCarousel_syncRootSemantics = function _DadsCarousel_syncRootSemantics() {
    if (!__classPrivateFieldGet(this, _DadsCarousel_root, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCarousel_root, "f").setAttribute('role', 'region');
    __classPrivateFieldGet(this, _DadsCarousel_root, "f").setAttribute('aria-roledescription', 'carousel');
    const labelledby = trimOptional(this.getAttribute('aria-labelledby'));
    if (labelledby) {
        __classPrivateFieldGet(this, _DadsCarousel_root, "f").setAttribute('aria-labelledby', labelledby);
        __classPrivateFieldGet(this, _DadsCarousel_root, "f").removeAttribute('aria-label');
        return;
    }
    __classPrivateFieldGet(this, _DadsCarousel_root, "f").removeAttribute('aria-labelledby');
    __classPrivateFieldGet(this, _DadsCarousel_root, "f").setAttribute('aria-label', normalizeText(this.getAttribute('aria-label'), DEFAULT_ARIA_LABEL));
}, _DadsCarousel_collectSlides = function _DadsCarousel_collectSlides(reason) {
    const previousTotal = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    const previousSource = __classPrivateFieldGet(this, _DadsCarousel_source, "f");
    if (__classPrivateFieldGet(this, _DadsCarousel_items, "f").length > 0) {
        __classPrivateFieldSet(this, _DadsCarousel_source, 'items', "f");
        __classPrivateFieldSet(this, _DadsCarousel_slides, __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_collectItemSlides).call(this), "f");
    }
    else {
        __classPrivateFieldSet(this, _DadsCarousel_source, 'slot', "f");
        __classPrivateFieldSet(this, _DadsCarousel_slides, __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_collectSlotSlides).call(this), "f");
    }
    __classPrivateFieldSet(this, _DadsCarousel_slideCount, __classPrivateFieldGet(this, _DadsCarousel_slides, "f").length, "f");
    this.setAttribute('data-source', __classPrivateFieldGet(this, _DadsCarousel_source, "f"));
    this.setAttribute('data-slide-count', String(__classPrivateFieldGet(this, _DadsCarousel_slideCount, "f")));
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_primeSlidePreload).call(this);
    const changed = previousTotal !== __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f") || previousSource !== __classPrivateFieldGet(this, _DadsCarousel_source, "f");
    if (changed) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitSlidesChange).call(this, {
            previousTotal,
            total: __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f"),
            source: __classPrivateFieldGet(this, _DadsCarousel_source, "f"),
            reason,
        });
    }
}, _DadsCarousel_collectItemSlides = function _DadsCarousel_collectItemSlides() {
    const slides = [];
    const unit = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this);
    for (let index = 0; index < __classPrivateFieldGet(this, _DadsCarousel_items, "f").length; index += 1) {
        const item = __classPrivateFieldGet(this, _DadsCarousel_items, "f")[index];
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
}, _DadsCarousel_collectSlotSlides = function _DadsCarousel_collectSlotSlides() {
    const slides = [];
    const slotSlides = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_getSlotSlides).call(this);
    for (let index = 0; index < slotSlides.length; index += 1) {
        const normalized = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_normalizeSlotSlide).call(this, slotSlides[index], index);
        if (normalized)
            slides.push(normalized);
    }
    return slides;
}, _DadsCarousel_getSlotSlides = function _DadsCarousel_getSlotSlides() {
    const assigned = __classPrivateFieldGet(this, _DadsCarousel_slidesSlot, "f")?.assignedElements({ flatten: true }) ?? [];
    const fromSlot = assigned.filter((el) => el instanceof HTMLElement);
    if (fromSlot.length > 0)
        return fromSlot;
    const fallback = [];
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        const slot = child.getAttribute('slot');
        if (slot === null || slot === '')
            fallback.push(child);
    }
    return fallback;
}, _DadsCarousel_normalizeSlotSlide = function _DadsCarousel_normalizeSlotSlide(node, index) {
    const link = node instanceof HTMLAnchorElement ? node : node.querySelector('a');
    const media = queryMediaNode(link ?? node);
    if (!media)
        return null;
    const image = extractImageElement(media);
    const unit = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this);
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
}, _DadsCarousel_unitText = function _DadsCarousel_unitText() {
    return normalizeText(this.getAttribute('unit'), DEFAULT_UNIT);
}, _DadsCarousel_syncCurrentIndex = function _DadsCarousel_syncCurrentIndex() {
    const total = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    const clamped = clampIndex(parseInteger(this.getAttribute('current-index')), total);
    __classPrivateFieldSet(this, _DadsCarousel_currentIndex, clamped, "f");
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_reflectCurrentIndex).call(this);
}, _DadsCarousel_reflectCurrentIndex = function _DadsCarousel_reflectCurrentIndex() {
    const next = String(__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f"));
    if (this.getAttribute('current-index') === next)
        return;
    __classPrivateFieldSet(this, _DadsCarousel_syncingCurrentIndexAttr, true, "f");
    this.setAttribute('current-index', next);
    __classPrivateFieldSet(this, _DadsCarousel_syncingCurrentIndexAttr, false, "f");
}, _DadsCarousel_setCurrentIndex = function _DadsCarousel_setCurrentIndex(value, source, emitLegacyChangeEvent, loop) {
    const total = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    if (total <= 0)
        return false;
    const previousIndex = __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f");
    const requested = Math.trunc(value);
    const nextIndex = loop
        ? normalizeLoopIndex(requested, total)
        : clampIndex(requested, total);
    if (previousIndex === nextIndex)
        return false;
    const wrapped = loop && (requested < 0 || requested >= total);
    const userInitiated = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_isUserInitiatedSource).call(this, source);
    const beforeDetail = {
        currentIndex: previousIndex,
        nextIndex,
        total,
        source,
        wrapped,
        userInitiated,
    };
    if (!__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitBeforeChange).call(this, beforeDetail))
        return false;
    __classPrivateFieldSet(this, _DadsCarousel_currentIndex, nextIndex, "f");
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_reflectCurrentIndex).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderCurrentState).call(this, source);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncStatus).call(this);
    const previousSlide = __classPrivateFieldGet(this, _DadsCarousel_slides, "f")[previousIndex];
    const activeSlide = __classPrivateFieldGet(this, _DadsCarousel_slides, "f")[nextIndex];
    if (previousSlide) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitSlideInactive).call(this, {
            index: previousIndex,
            id: previousSlide.id,
            label: previousSlide.label,
            source,
        });
    }
    if (activeSlide) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitSlideActive).call(this, {
            index: nextIndex,
            id: activeSlide.id,
            label: activeSlide.label,
            source,
        });
    }
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitIndexChange).call(this, {
        previousIndex,
        currentIndex: nextIndex,
        total,
        source,
        wrapped,
        userInitiated,
    });
    if (!emitLegacyChangeEvent)
        return true;
    if (!isLegacyChangeSource(source))
        return true;
    const detail = {
        currentIndex: nextIndex,
        previousIndex,
        total,
        source,
    };
    this.emitEvent('dads-carousel-change', detail);
    return true;
}, _DadsCarousel_setExpanded = function _DadsCarousel_setExpanded(next, emitEvent, syncDetails) {
    const canExpand = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f") >= 2;
    const normalized = canExpand ? next : false;
    const changed = __classPrivateFieldGet(this, _DadsCarousel_expanded, "f") !== normalized;
    __classPrivateFieldSet(this, _DadsCarousel_expanded, normalized, "f");
    this.setAttribute('data-expanded', __classPrivateFieldGet(this, _DadsCarousel_expanded, "f") ? 'true' : 'false');
    if (syncDetails && __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f") && __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f").open !== __classPrivateFieldGet(this, _DadsCarousel_expanded, "f")) {
        __classPrivateFieldSet(this, _DadsCarousel_syncingExpandedState, true, "f");
        __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f").open = __classPrivateFieldGet(this, _DadsCarousel_expanded, "f");
        __classPrivateFieldSet(this, _DadsCarousel_syncingExpandedState, false, "f");
    }
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncResponsiveVisibility).call(this, canExpand);
    if (changed && emitEvent) {
        this.emitEvent('dads-carousel-toggle-all', {
            expanded: __classPrivateFieldGet(this, _DadsCarousel_expanded, "f"),
        });
    }
}, _DadsCarousel_syncControlText = function _DadsCarousel_syncControlText() {
    const prevLabel = normalizeText(this.getAttribute('prev-label'), DEFAULT_PREV_LABEL);
    const nextLabel = normalizeText(this.getAttribute('next-label'), DEFAULT_NEXT_LABEL);
    const allSlidesLabel = normalizeText(this.getAttribute('all-slides-label'), DEFAULT_ALL_SLIDES_LABEL);
    if (__classPrivateFieldGet(this, _DadsCarousel_pagePrevLabel, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_pagePrevLabel, "f").textContent = prevLabel;
    if (__classPrivateFieldGet(this, _DadsCarousel_pageNextLabel, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_pageNextLabel, "f").textContent = nextLabel;
    if (__classPrivateFieldGet(this, _DadsCarousel_allSlidesSummaryLabel, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_allSlidesSummaryLabel, "f").textContent = allSlidesLabel;
    if (__classPrivateFieldGet(this, _DadsCarousel_nextImageLabel, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_nextImageLabel, "f").textContent = nextLabel;
    if (__classPrivateFieldGet(this, _DadsCarousel_indicators, "f")) {
        __classPrivateFieldGet(this, _DadsCarousel_indicators, "f").setAttribute('aria-label', `${__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this)}${DEFAULT_STEP_NAV_LABEL.replace(DEFAULT_UNIT, '')}`);
    }
}, _DadsCarousel_syncResponsiveVisibility = function _DadsCarousel_syncResponsiveVisibility(hasMultiple) {
    if (__classPrivateFieldGet(this, _DadsCarousel_controls, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_controls, "f").hidden = !hasMultiple;
    if (__classPrivateFieldGet(this, _DadsCarousel_allSlides, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_allSlides, "f").hidden = !hasMultiple;
    const showDesktopControls = hasMultiple && __classPrivateFieldGet(this, _DadsCarousel_isWide, "f") && !__classPrivateFieldGet(this, _DadsCarousel_expanded, "f");
    const showMobileControls = hasMultiple && !__classPrivateFieldGet(this, _DadsCarousel_isWide, "f") && !__classPrivateFieldGet(this, _DadsCarousel_expanded, "f");
    const mode = !hasMultiple || __classPrivateFieldGet(this, _DadsCarousel_expanded, "f")
        ? 'hidden'
        : __classPrivateFieldGet(this, _DadsCarousel_isWide, "f")
            ? 'desktop'
            : 'mobile';
    if (__classPrivateFieldGet(this, _DadsCarousel_nextWrap, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_nextWrap, "f").hidden = !showDesktopControls;
    if (__classPrivateFieldGet(this, _DadsCarousel_nextBg, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_nextBg, "f").hidden = !showDesktopControls;
    if (__classPrivateFieldGet(this, _DadsCarousel_indicators, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_indicators, "f").hidden = !showDesktopControls;
    if (__classPrivateFieldGet(this, _DadsCarousel_pageNav, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_pageNav, "f").hidden = !showMobileControls;
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitControlsUpdate).call(this, {
        mode,
        total: __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f"),
        currentIndex: __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f"),
        expanded: __classPrivateFieldGet(this, _DadsCarousel_expanded, "f"),
        wide: __classPrivateFieldGet(this, _DadsCarousel_isWide, "f"),
        imageSlider: __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_isImageSliderMode).call(this),
        showStepNav: showDesktopControls,
        showPageNav: showMobileControls,
        showNextPreview: showDesktopControls,
        showAllSlides: hasMultiple,
        prevDisabled: !hasMultiple || __classPrivateFieldGet(this, _DadsCarousel_expanded, "f") || Boolean(__classPrivateFieldGet(this, _DadsCarousel_pagePrevButton, "f")?.disabled),
        nextDisabled: !hasMultiple || __classPrivateFieldGet(this, _DadsCarousel_expanded, "f") || Boolean(__classPrivateFieldGet(this, _DadsCarousel_pageNextButton, "f")?.disabled),
    });
}, _DadsCarousel_renderCurrentState = function _DadsCarousel_renderCurrentState(source) {
    var _a;
    const total = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    if (total <= 0) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderEmptyState).call(this);
        return;
    }
    this.toggleAttribute('hidden', false);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setExpanded).call(this, __classPrivateFieldGet(this, _DadsCarousel_expanded, "f"), false, true);
    const current = __classPrivateFieldGet(this, _DadsCarousel_slides, "f")[__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f")];
    if (!current) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderEmptyState).call(this);
        return;
    }
    const renderSeq = __classPrivateFieldSet(this, _DadsCarousel_renderSeq, (_a = __classPrivateFieldGet(this, _DadsCarousel_renderSeq, "f"), ++_a), "f");
    if (__classPrivateFieldGet(this, _DadsCarousel_currentNumber, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_currentNumber, "f").textContent = String(__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1);
    if (__classPrivateFieldGet(this, _DadsCarousel_mainLabel, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_mainLabel, "f").textContent = `${__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this)}${__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1}`;
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderMainSlide).call(this, current, __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f"), renderSeq, source);
    const hasMultiple = total >= 2;
    if (hasMultiple) {
        const nextIndex = normalizeLoopIndex(__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1, total);
        const next = __classPrivateFieldGet(this, _DadsCarousel_slides, "f")[nextIndex];
        if (next)
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderNextSlide).call(this, next, nextIndex, renderSeq, source);
    }
    else {
        __classPrivateFieldGet(this, _DadsCarousel_nextImageContainer, "f")?.replaceChildren();
        __classPrivateFieldGet(this, _DadsCarousel_nextBgContent, "f")?.replaceChildren();
    }
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderIndicators).call(this);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_renderAllSlidesList).call(this);
    if (__classPrivateFieldGet(this, _DadsCarousel_pageStatus, "f")) {
        __classPrivateFieldGet(this, _DadsCarousel_pageStatus, "f").textContent = `${__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1} / ${total}`;
    }
    if (!hasMultiple) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setExpanded).call(this, false, false, true);
    }
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncResponsiveVisibility).call(this, hasMultiple);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncMainPanelSemantics).call(this);
}, _DadsCarousel_renderEmptyState = function _DadsCarousel_renderEmptyState() {
    __classPrivateFieldSet(this, _DadsCarousel_renderSeq, __classPrivateFieldGet(this, _DadsCarousel_renderSeq, "f") + 1, "f");
    __classPrivateFieldSet(this, _DadsCarousel_mainHeightLockSeq, __classPrivateFieldGet(this, _DadsCarousel_mainHeightLockSeq, "f") + 1, "f");
    __classPrivateFieldSet(this, _DadsCarousel_currentIndex, 0, "f");
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_reflectCurrentIndex).call(this);
    this.toggleAttribute('hidden', true);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_setExpanded).call(this, false, false, true);
    __classPrivateFieldGet(this, _DadsCarousel_mainImages, "f")?.replaceChildren();
    __classPrivateFieldGet(this, _DadsCarousel_mainBgContent, "f")?.replaceChildren();
    __classPrivateFieldGet(this, _DadsCarousel_nextImageContainer, "f")?.replaceChildren();
    __classPrivateFieldGet(this, _DadsCarousel_nextBgContent, "f")?.replaceChildren();
    __classPrivateFieldGet(this, _DadsCarousel_indicators, "f")?.replaceChildren();
    __classPrivateFieldGet(this, _DadsCarousel_allSlidesList, "f")?.replaceChildren();
    __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f")?.style.removeProperty('min-block-size');
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncResponsiveVisibility).call(this, false);
    if (__classPrivateFieldGet(this, _DadsCarousel_status, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_status, "f").textContent = '';
    if (__classPrivateFieldGet(this, _DadsCarousel_pageStatus, "f"))
        __classPrivateFieldGet(this, _DadsCarousel_pageStatus, "f").textContent = '';
}, _DadsCarousel_renderMainSlide = function _DadsCarousel_renderMainSlide(slide, index, renderSeq, source) {
    if (!__classPrivateFieldGet(this, _DadsCarousel_mainLink, "f") || !__classPrivateFieldGet(this, _DadsCarousel_mainImages, "f") || !__classPrivateFieldGet(this, _DadsCarousel_mainBgContent, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncLink).call(this, __classPrivateFieldGet(this, _DadsCarousel_mainLink, "f"), slide);
    const mainMedia = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_createSlideMedia).call(this, slide, false, 'eager', 'sync');
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_replaceMediaWhenReady).call(this, __classPrivateFieldGet(this, _DadsCarousel_mainImages, "f"), mainMedia, {
        renderSeq,
        lockMainHeight: true,
        context: { index, role: 'main', source },
    });
    const mainBg = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_createSlideMedia).call(this, slide, true, 'lazy', 'async');
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_replaceMediaWhenReady).call(this, __classPrivateFieldGet(this, _DadsCarousel_mainBgContent, "f"), mainBg, {
        renderSeq,
        lockMainHeight: false,
        context: { index, role: 'main-bg', source },
    });
}, _DadsCarousel_renderNextSlide = function _DadsCarousel_renderNextSlide(slide, index, renderSeq, source) {
    if (!__classPrivateFieldGet(this, _DadsCarousel_nextImageContainer, "f") || !__classPrivateFieldGet(this, _DadsCarousel_nextBgContent, "f"))
        return;
    const media = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_createSlideMedia).call(this, slide, true, 'lazy', 'async');
    const previewMedia = media ? media.cloneNode(true) : null;
    const previewImage = previewMedia ? extractImageElement(previewMedia) : null;
    if (previewImage)
        previewImage.loading = 'eager';
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_replaceMediaWhenReady).call(this, __classPrivateFieldGet(this, _DadsCarousel_nextImageContainer, "f"), previewMedia, {
        renderSeq,
        lockMainHeight: false,
        context: { index, role: 'next-preview', source },
        waitPolicy: 'insert-immediately',
    });
    const bgMedia = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_createSlideMedia).call(this, slide, true, 'lazy', 'async');
    const bgImage = bgMedia ? extractImageElement(bgMedia) : null;
    if (bgImage)
        bgImage.loading = 'eager';
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_replaceMediaWhenReady).call(this, __classPrivateFieldGet(this, _DadsCarousel_nextBgContent, "f"), bgMedia, {
        renderSeq,
        lockMainHeight: false,
        context: { index, role: 'next-bg', source },
        waitPolicy: 'insert-immediately',
    });
}, _DadsCarousel_syncLink = function _DadsCarousel_syncLink(link, slide) {
    if (slide.href) {
        link.setAttribute('href', slide.href);
        if (slide.target)
            link.setAttribute('target', slide.target);
        else
            link.removeAttribute('target');
        if (slide.rel)
            link.setAttribute('rel', slide.rel);
        else
            link.removeAttribute('rel');
        return;
    }
    link.removeAttribute('href');
    link.removeAttribute('target');
    link.removeAttribute('rel');
}, _DadsCarousel_createSlideMedia = function _DadsCarousel_createSlideMedia(slide, noAlt, loading, decoding) {
    if (slide.item) {
        const image = document.createElement('img');
        image.src = slide.item.src;
        image.alt = noAlt ? '' : slide.item.alt;
        if (slide.item.srcset)
            image.srcset = slide.item.srcset;
        if (slide.item.sizes)
            image.sizes = slide.item.sizes;
        if (slide.item.width !== undefined)
            image.width = slide.item.width;
        if (slide.item.height !== undefined)
            image.height = slide.item.height;
        image.loading = slide.item.loading ?? loading;
        image.decoding = slide.item.decoding ?? decoding ?? 'async';
        return image;
    }
    if (!slide.mediaNode)
        return null;
    const cloned = cloneMediaNode(slide.mediaNode, noAlt);
    const image = extractImageElement(cloned);
    if (image) {
        image.loading = loading;
        image.decoding = decoding ?? 'async';
    }
    return cloned;
}, _DadsCarousel_renderIndicators = function _DadsCarousel_renderIndicators() {
    if (!__classPrivateFieldGet(this, _DadsCarousel_indicators, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCarousel_indicators, "f").replaceChildren();
    const total = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    if (total < 2)
        return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < total; index += 1) {
        const item = document.createElement('li');
        item.setAttribute('part', 'step-item');
        item.setAttribute('role', 'presentation');
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('part', 'indicator-button number');
        button.setAttribute('role', 'tab');
        button.setAttribute('id', __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_indicatorId).call(this, index));
        button.setAttribute('data-index', String(index));
        button.setAttribute('aria-controls', __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_mainPanelId).call(this));
        button.setAttribute('aria-label', `${__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this)}${index + 1}`);
        const unit = document.createElement('span');
        unit.setAttribute('part', 'visually-hidden');
        unit.textContent = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this);
        button.append(unit, String(index + 1));
        const isSelected = index === __classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f");
        button.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        button.setAttribute('tabindex', isSelected ? '0' : '-1');
        if (isSelected)
            button.setAttribute('aria-current', 'true');
        else
            button.removeAttribute('aria-current');
        item.appendChild(button);
        fragment.appendChild(item);
    }
    __classPrivateFieldGet(this, _DadsCarousel_indicators, "f").appendChild(fragment);
}, _DadsCarousel_renderAllSlidesList = function _DadsCarousel_renderAllSlidesList() {
    if (!__classPrivateFieldGet(this, _DadsCarousel_allSlidesList, "f"))
        return;
    __classPrivateFieldGet(this, _DadsCarousel_allSlidesList, "f").replaceChildren();
    const total = __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f");
    if (total < 2)
        return;
    const fragment = document.createDocumentFragment();
    for (let i = 1; i < total; i += 1) {
        const index = normalizeLoopIndex(__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + i, total);
        const slide = __classPrivateFieldGet(this, _DadsCarousel_slides, "f")[index];
        if (!slide)
            continue;
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
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_syncLink).call(this, link, slide);
        }
        const label = document.createElement('span');
        label.setAttribute('part', 'visually-hidden');
        label.textContent = `${__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this)}${index + 1}`;
        const imageContainer = document.createElement('div');
        imageContainer.setAttribute('part', 'image-container');
        const media = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_createSlideMedia).call(this, slide, false, 'lazy', 'async');
        if (media)
            imageContainer.appendChild(media);
        link.append(label, imageContainer);
        main.appendChild(link);
        const bg = document.createElement('div');
        bg.setAttribute('part', 'main-bg');
        const bgInner = document.createElement('div');
        const bgMedia = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_createSlideMedia).call(this, slide, true, 'lazy', 'async');
        if (bgMedia)
            bgInner.appendChild(bgMedia);
        bg.appendChild(bgInner);
        listItem.append(number, main, bg);
        fragment.appendChild(listItem);
    }
    __classPrivateFieldGet(this, _DadsCarousel_allSlidesList, "f").appendChild(fragment);
}, _DadsCarousel_replaceMediaWhenReady = function _DadsCarousel_replaceMediaWhenReady(container, media, options) {
    const { renderSeq, lockMainHeight, context, waitPolicy = 'wait-before-insert', } = options;
    if (!container)
        return;
    if (renderSeq !== __classPrivateFieldGet(this, _DadsCarousel_renderSeq, "f"))
        return;
    if (!media) {
        container.replaceChildren();
        if (lockMainHeight)
            __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f")?.style.removeProperty('min-block-size');
        return;
    }
    if (!__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_isMediaReady).call(this, media)) {
        if (waitPolicy === 'insert-immediately') {
            const releaseLock = lockMainHeight ? __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_lockMainPanelHeight).call(this) : () => { };
            container.replaceChildren(media);
            void __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_waitForMediaReady).call(this, media).then((result) => {
                if (renderSeq !== __classPrivateFieldGet(this, _DadsCarousel_renderSeq, "f")) {
                    releaseLock();
                    return;
                }
                __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitMediaResult).call(this, result, media, context);
                releaseLock();
            });
            return;
        }
        const releaseLock = lockMainHeight ? __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_lockMainPanelHeight).call(this) : () => { };
        void __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_waitForMediaReady).call(this, media).then((result) => {
            if (renderSeq !== __classPrivateFieldGet(this, _DadsCarousel_renderSeq, "f")) {
                releaseLock();
                return;
            }
            container.replaceChildren(media);
            __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitMediaResult).call(this, result, media, context);
            releaseLock();
        });
        return;
    }
    container.replaceChildren(media);
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitMediaLoaded).call(this, media, context);
    if (lockMainHeight)
        __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f")?.style.removeProperty('min-block-size');
}, _DadsCarousel_isMediaReady = function _DadsCarousel_isMediaReady(media) {
    const image = extractImageElement(media);
    if (!image)
        return true;
    return image.complete;
}, _DadsCarousel_waitForMediaReady = function _DadsCarousel_waitForMediaReady(media) {
    const image = extractImageElement(media);
    if (!image)
        return Promise.resolve({ ok: true });
    if (image.complete)
        return Promise.resolve({ ok: true });
    return new Promise((resolve) => {
        let settled = false;
        const finalize = (result) => {
            if (settled)
                return;
            settled = true;
            image.removeEventListener('load', handleLoad);
            image.removeEventListener('error', handleError);
            resolve(result);
        };
        const handleLoad = () => {
            finalize({ ok: true });
        };
        const handleError = () => {
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
}, _DadsCarousel_lockMainPanelHeight = function _DadsCarousel_lockMainPanelHeight() {
    var _a;
    if (!__classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f"))
        return () => { };
    const measured = __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").getBoundingClientRect().height;
    if (!(measured > 0))
        return () => { };
    const token = __classPrivateFieldSet(this, _DadsCarousel_mainHeightLockSeq, (_a = __classPrivateFieldGet(this, _DadsCarousel_mainHeightLockSeq, "f"), ++_a), "f");
    __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").style.minBlockSize = `${Math.ceil(measured)}px`;
    return () => {
        if (token !== __classPrivateFieldGet(this, _DadsCarousel_mainHeightLockSeq, "f"))
            return;
        const panel = __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f");
        if (!panel)
            return;
        requestAnimationFrame(() => {
            if (token !== __classPrivateFieldGet(this, _DadsCarousel_mainHeightLockSeq, "f"))
                return;
            panel.style.removeProperty('min-block-size');
        });
    };
}, _DadsCarousel_primeSlidePreload = function _DadsCarousel_primeSlidePreload() {
    __classPrivateFieldGet(this, _DadsCarousel_preloadCache, "f").clear();
    for (const slide of __classPrivateFieldGet(this, _DadsCarousel_slides, "f")) {
        void __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_preloadSlide).call(this, slide);
    }
}, _DadsCarousel_getSlideImageSource = function _DadsCarousel_getSlideImageSource(slide) {
    if (slide.item) {
        return {
            src: slide.item.src,
            srcset: slide.item.srcset,
            sizes: slide.item.sizes,
        };
    }
    if (!slide.mediaNode)
        return null;
    const image = extractImageElement(slide.mediaNode);
    if (!image || !image.src)
        return null;
    const source = { src: image.src };
    if (image.srcset)
        source.srcset = image.srcset;
    if (image.sizes)
        source.sizes = image.sizes;
    return source;
}, _DadsCarousel_preloadSlide = function _DadsCarousel_preloadSlide(slide) {
    if (!slide)
        return Promise.resolve();
    const source = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_getSlideImageSource).call(this, slide);
    if (!source?.src)
        return Promise.resolve();
    const key = `${source.src}|${source.srcset ?? ''}|${source.sizes ?? ''}`;
    const cached = __classPrivateFieldGet(this, _DadsCarousel_preloadCache, "f").get(key);
    if (cached)
        return cached;
    const preload = new Promise((resolve) => {
        let done = false;
        const finish = () => {
            if (done)
                return;
            done = true;
            resolve();
        };
        const image = new Image();
        if (source.srcset)
            image.srcset = source.srcset;
        if (source.sizes)
            image.sizes = source.sizes;
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
    __classPrivateFieldGet(this, _DadsCarousel_preloadCache, "f").set(key, preload);
    return preload;
}, _DadsCarousel_isUserInitiatedSource = function _DadsCarousel_isUserInitiatedSource(source) {
    return source === 'prev' || source === 'next' || source === 'indicator' || source === 'all-slides';
}, _DadsCarousel_emitBeforeChange = function _DadsCarousel_emitBeforeChange(detail) {
    return this.emitEvent('dads-carousel-before-change', detail);
}, _DadsCarousel_emitIndexChange = function _DadsCarousel_emitIndexChange(detail) {
    this.emitEvent('dads-carousel-index-change', detail, {
        cancelable: false,
    });
}, _DadsCarousel_emitSlideActive = function _DadsCarousel_emitSlideActive(detail) {
    this.emitEvent('dads-carousel-slide-active', detail, {
        cancelable: false,
    });
}, _DadsCarousel_emitSlideInactive = function _DadsCarousel_emitSlideInactive(detail) {
    this.emitEvent('dads-carousel-slide-inactive', detail, {
        cancelable: false,
    });
}, _DadsCarousel_emitSlidesChange = function _DadsCarousel_emitSlidesChange(detail) {
    this.emitEvent('dads-carousel-slides-change', detail, {
        cancelable: false,
    });
}, _DadsCarousel_emitLayoutChange = function _DadsCarousel_emitLayoutChange(detail) {
    this.emitEvent('dads-carousel-layout-change', detail, {
        cancelable: false,
    });
}, _DadsCarousel_emitControlsUpdate = function _DadsCarousel_emitControlsUpdate(detail) {
    const key = JSON.stringify(detail);
    if (__classPrivateFieldGet(this, _DadsCarousel_lastControlsUpdateKey, "f") === key)
        return;
    __classPrivateFieldSet(this, _DadsCarousel_lastControlsUpdateKey, key, "f");
    this.emitEvent('dads-carousel-controls-update', detail, {
        cancelable: false,
    });
}, _DadsCarousel_emitMediaLoaded = function _DadsCarousel_emitMediaLoaded(media, context) {
    const src = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_mediaSrc).call(this, media);
    if (!src)
        return;
    this.emitEvent('dads-carousel-media-loaded', {
        index: context.index,
        role: context.role,
        src,
        source: context.source,
    }, { cancelable: false });
}, _DadsCarousel_emitMediaError = function _DadsCarousel_emitMediaError(media, context, error) {
    const src = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_mediaSrc).call(this, media);
    if (!src)
        return;
    this.emitEvent('dads-carousel-media-error', {
        index: context.index,
        role: context.role,
        src,
        source: context.source,
        error,
    }, { cancelable: false });
}, _DadsCarousel_emitMediaResult = function _DadsCarousel_emitMediaResult(result, media, context) {
    if (result.ok) {
        __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitMediaLoaded).call(this, media, context);
        return;
    }
    __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_emitMediaError).call(this, media, context, result.error);
}, _DadsCarousel_mediaSrc = function _DadsCarousel_mediaSrc(media) {
    const image = extractImageElement(media);
    if (!image)
        return null;
    const src = image.currentSrc || image.src;
    return src && src.length > 0 ? src : null;
}, _DadsCarousel_currentContainerWidthPx = function _DadsCarousel_currentContainerWidthPx() {
    const width = this.getBoundingClientRect().width;
    if (!Number.isFinite(width) || width <= 0)
        return 0;
    return Math.round(width);
}, _DadsCarousel_syncMainPanelSemantics = function _DadsCarousel_syncMainPanelSemantics() {
    if (!__classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f"))
        return;
    if (!__classPrivateFieldGet(this, _DadsCarousel_isWide, "f") || __classPrivateFieldGet(this, _DadsCarousel_slideCount, "f") <= 0) {
        __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").removeAttribute('role');
        __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").removeAttribute('aria-label');
        return;
    }
    __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").setAttribute('role', 'tabpanel');
    __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").setAttribute('aria-label', `${__classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_unitText).call(this)}${__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1}`);
    __classPrivateFieldGet(this, _DadsCarousel_mainPanel, "f").id = __classPrivateFieldGet(this, _DadsCarousel_instances, "m", _DadsCarousel_mainPanelId).call(this);
}, _DadsCarousel_syncStatus = function _DadsCarousel_syncStatus() {
    if (!__classPrivateFieldGet(this, _DadsCarousel_status, "f"))
        return;
    if (__classPrivateFieldGet(this, _DadsCarousel_slideCount, "f") <= 0) {
        __classPrivateFieldGet(this, _DadsCarousel_status, "f").textContent = '';
        return;
    }
    __classPrivateFieldGet(this, _DadsCarousel_status, "f").textContent = `全${__classPrivateFieldGet(this, _DadsCarousel_slideCount, "f")}枚中${__classPrivateFieldGet(this, _DadsCarousel_currentIndex, "f") + 1}枚目`;
}, _DadsCarousel_mainPanelId = function _DadsCarousel_mainPanelId() {
    return `${this.localName}-panel-${__classPrivateFieldGet(this, _DadsCarousel_instanceId, "f")}`;
}, _DadsCarousel_indicatorId = function _DadsCarousel_indicatorId(index) {
    return `${this.localName}-indicator-${__classPrivateFieldGet(this, _DadsCarousel_instanceId, "f")}-${index + 1}`;
};
DadsCarousel.version = '0.2.0';
DadsCarousel.definition = {
    name: 'dads-carousel',
    template: html `
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
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        carouselTokens,
        carouselStyles,
    ], 'minimal'),
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
