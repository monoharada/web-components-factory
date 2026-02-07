/**
 * @module card
 * デジタル庁デザインシステム Cardコンポーネント
 * @version 0.1.0
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
var _DadsCard_instances, _DadsCard_mediaSlot, _DadsCard_mainSlot, _DadsCard_subSlot, _DadsCard_media, _DadsCard_sub, _DadsCard_primary, _DadsCard_mutationObserver, _DadsCard_pointer, _DadsCard_syncAll, _DadsCard_syncAreasVisibility, _DadsCard_syncPrimary, _DadsCard_isDelegateEnabled, _DadsCard_handlePointerDown, _DadsCard_handlePointerMove, _DadsCard_handlePointerUp, _DadsCard_isSelectionInsideHost, _DadsCard_handleClick, _DadsCard_handleFocusIn, _DadsCard_handleFocusOut;
import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { hasSlotContent } from '../../utils/dom.js';
import { cardTokens } from './card-tokens.js';
import { cardStyles } from './card-styles.js';
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
    constructor() {
        super(...arguments);
        _DadsCard_instances.add(this);
        _DadsCard_mediaSlot.set(this, null);
        _DadsCard_mainSlot.set(this, null);
        _DadsCard_subSlot.set(this, null);
        _DadsCard_media.set(this, null);
        _DadsCard_sub.set(this, null);
        _DadsCard_primary.set(this, null);
        _DadsCard_mutationObserver.set(this, null);
        _DadsCard_pointer.set(this, { id: null, startX: 0, startY: 0, moved: false });
        _DadsCard_handlePointerDown.set(this, (event) => {
            if (event.button !== 0)
                return;
            __classPrivateFieldGet(this, _DadsCard_pointer, "f").id = event.pointerId;
            __classPrivateFieldGet(this, _DadsCard_pointer, "f").startX = event.clientX;
            __classPrivateFieldGet(this, _DadsCard_pointer, "f").startY = event.clientY;
            __classPrivateFieldGet(this, _DadsCard_pointer, "f").moved = false;
        });
        _DadsCard_handlePointerMove.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCard_pointer, "f").id == null)
                return;
            if (event.pointerId !== __classPrivateFieldGet(this, _DadsCard_pointer, "f").id)
                return;
            const dx = event.clientX - __classPrivateFieldGet(this, _DadsCard_pointer, "f").startX;
            const dy = event.clientY - __classPrivateFieldGet(this, _DadsCard_pointer, "f").startY;
            const distanceSq = dx * dx + dy * dy;
            const threshold = 6;
            if (distanceSq > threshold * threshold)
                __classPrivateFieldGet(this, _DadsCard_pointer, "f").moved = true;
        });
        _DadsCard_handlePointerUp.set(this, (event) => {
            if (__classPrivateFieldGet(this, _DadsCard_pointer, "f").id == null)
                return;
            if (event.pointerId !== __classPrivateFieldGet(this, _DadsCard_pointer, "f").id)
                return;
            __classPrivateFieldGet(this, _DadsCard_pointer, "f").id = null;
        });
        _DadsCard_handleClick.set(this, (event) => {
            const primary = __classPrivateFieldGet(this, _DadsCard_primary, "f");
            if (!__classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_isDelegateEnabled).call(this) || !primary)
                return;
            const moved = __classPrivateFieldGet(this, _DadsCard_pointer, "f").moved;
            __classPrivateFieldGet(this, _DadsCard_pointer, "f").moved = false;
            // Drag selection / pointer drag should not trigger navigation.
            if (moved)
                return;
            if (__classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_isSelectionInsideHost).call(this))
                return;
            const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            for (const node of path) {
                if (!(node instanceof Element))
                    continue;
                // If the click already originated from an interactive element, don't hijack.
                if (node === primary || primary.contains(node))
                    return;
                if (node.closest?.('a,button,input,select,textarea,label,summary'))
                    return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            primary.click();
        });
        _DadsCard_handleFocusIn.set(this, (event) => {
            const primary = __classPrivateFieldGet(this, _DadsCard_primary, "f");
            if (!__classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_isDelegateEnabled).call(this) || !primary)
                return;
            const t = event.target;
            if (!(t instanceof Node))
                return;
            if (t === primary || primary.contains(t)) {
                this.setAttribute('data-primary-focus', '');
            }
        });
        _DadsCard_handleFocusOut.set(this, (event) => {
            const primary = __classPrivateFieldGet(this, _DadsCard_primary, "f");
            if (!__classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_isDelegateEnabled).call(this) || !primary)
                return;
            const next = event.relatedTarget;
            if (next instanceof Node && (next === primary || primary.contains(next)))
                return;
            this.removeAttribute('data-primary-focus');
        });
    }
    static get observedAttributes() {
        return ['layout'];
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsCard_mediaSlot, this.shadowRoot?.querySelector('#media-slot'), "f");
        __classPrivateFieldSet(this, _DadsCard_mainSlot, this.shadowRoot?.querySelector('#main-slot'), "f");
        __classPrivateFieldSet(this, _DadsCard_subSlot, this.shadowRoot?.querySelector('#sub-slot'), "f");
        __classPrivateFieldSet(this, _DadsCard_media, this.shadowRoot?.querySelector('#media'), "f");
        __classPrivateFieldSet(this, _DadsCard_sub, this.shadowRoot?.querySelector('#sub'), "f");
        const onSlotChange = () => __classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_syncAll).call(this);
        __classPrivateFieldGet(this, _DadsCard_mediaSlot, "f")?.addEventListener('slotchange', onSlotChange);
        __classPrivateFieldGet(this, _DadsCard_mainSlot, "f")?.addEventListener('slotchange', onSlotChange);
        __classPrivateFieldGet(this, _DadsCard_subSlot, "f")?.addEventListener('slotchange', onSlotChange);
        // Primary link can be inserted/updated from outside; observe light DOM changes.
        __classPrivateFieldSet(this, _DadsCard_mutationObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_syncPrimary).call(this)), "f");
        __classPrivateFieldGet(this, _DadsCard_mutationObserver, "f").observe(this, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['data-dads-card-primary', 'data-dads-card-delegate'],
        });
        this.addEventListener('pointerdown', __classPrivateFieldGet(this, _DadsCard_handlePointerDown, "f"));
        this.addEventListener('pointermove', __classPrivateFieldGet(this, _DadsCard_handlePointerMove, "f"));
        this.addEventListener('pointerup', __classPrivateFieldGet(this, _DadsCard_handlePointerUp, "f"));
        this.addEventListener('pointercancel', __classPrivateFieldGet(this, _DadsCard_handlePointerUp, "f"));
        this.addEventListener('click', __classPrivateFieldGet(this, _DadsCard_handleClick, "f"));
        this.addEventListener('focusin', __classPrivateFieldGet(this, _DadsCard_handleFocusIn, "f"));
        this.addEventListener('focusout', __classPrivateFieldGet(this, _DadsCard_handleFocusOut, "f"));
        __classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_syncAll).call(this);
    }
    disconnectedCallback() {
        this.removeEventListener('pointerdown', __classPrivateFieldGet(this, _DadsCard_handlePointerDown, "f"));
        this.removeEventListener('pointermove', __classPrivateFieldGet(this, _DadsCard_handlePointerMove, "f"));
        this.removeEventListener('pointerup', __classPrivateFieldGet(this, _DadsCard_handlePointerUp, "f"));
        this.removeEventListener('pointercancel', __classPrivateFieldGet(this, _DadsCard_handlePointerUp, "f"));
        this.removeEventListener('click', __classPrivateFieldGet(this, _DadsCard_handleClick, "f"));
        this.removeEventListener('focusin', __classPrivateFieldGet(this, _DadsCard_handleFocusIn, "f"));
        this.removeEventListener('focusout', __classPrivateFieldGet(this, _DadsCard_handleFocusOut, "f"));
        __classPrivateFieldGet(this, _DadsCard_mutationObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsCard_mutationObserver, null, "f");
        super.disconnectedCallback();
    }
}
_DadsCard_mediaSlot = new WeakMap(), _DadsCard_mainSlot = new WeakMap(), _DadsCard_subSlot = new WeakMap(), _DadsCard_media = new WeakMap(), _DadsCard_sub = new WeakMap(), _DadsCard_primary = new WeakMap(), _DadsCard_mutationObserver = new WeakMap(), _DadsCard_pointer = new WeakMap(), _DadsCard_handlePointerDown = new WeakMap(), _DadsCard_handlePointerMove = new WeakMap(), _DadsCard_handlePointerUp = new WeakMap(), _DadsCard_handleClick = new WeakMap(), _DadsCard_handleFocusIn = new WeakMap(), _DadsCard_handleFocusOut = new WeakMap(), _DadsCard_instances = new WeakSet(), _DadsCard_syncAll = function _DadsCard_syncAll() {
    __classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_syncAreasVisibility).call(this);
    __classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_syncPrimary).call(this);
}, _DadsCard_syncAreasVisibility = function _DadsCard_syncAreasVisibility() {
    const hasLightDomSlot = (name) => this.querySelector(`[slot="${name}"]`) !== null;
    const hasMedia = hasSlotContent(__classPrivateFieldGet(this, _DadsCard_mediaSlot, "f")) || hasLightDomSlot('media');
    const hasSub = hasSlotContent(__classPrivateFieldGet(this, _DadsCard_subSlot, "f")) || hasLightDomSlot('sub');
    __classPrivateFieldGet(this, _DadsCard_media, "f")?.toggleAttribute('hidden', !hasMedia);
    __classPrivateFieldGet(this, _DadsCard_sub, "f")?.toggleAttribute('hidden', !hasSub);
    this.toggleAttribute('data-has-media', hasMedia);
    this.toggleAttribute('data-has-sub', hasSub);
}, _DadsCard_syncPrimary = function _DadsCard_syncPrimary() {
    const primary = this.querySelector('[data-dads-card-primary]');
    __classPrivateFieldSet(this, _DadsCard_primary, primary instanceof HTMLElement ? primary : null, "f");
    this.toggleAttribute('data-dads-card-delegate', __classPrivateFieldGet(this, _DadsCard_instances, "m", _DadsCard_isDelegateEnabled).call(this));
}, _DadsCard_isDelegateEnabled = function _DadsCard_isDelegateEnabled() {
    return __classPrivateFieldGet(this, _DadsCard_primary, "f") !== null && __classPrivateFieldGet(this, _DadsCard_primary, "f").hasAttribute('data-dads-card-delegate');
}, _DadsCard_isSelectionInsideHost = function _DadsCard_isSelectionInsideHost() {
    const sel = document.getSelection?.() ?? null;
    if (!sel || sel.isCollapsed)
        return false;
    const anchor = sel.anchorNode;
    const focus = sel.focusNode;
    if (anchor && this.contains(anchor))
        return true;
    if (focus && this.contains(focus))
        return true;
    return false;
};
DadsCard.definition = {
    name: 'dads-card',
    template: html `
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
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        cardTokens,
        cardStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [PropertyAttr('layout')],
};
