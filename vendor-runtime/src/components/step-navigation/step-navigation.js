/**
 * @module step-navigation
 * デジタル庁デザインシステム Step Navigation コンポーネント
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
var _DadsStepNavigation_instances, _DadsStepNavigation_slot, _DadsStepNavigation_statusSlot, _DadsStepNavigation_itemsObserver, _DadsStepNavigation_childObserver, _DadsStepNavigation_handleStatusSlotChange, _DadsStepNavigation_handleSlotChange, _DadsStepNavigation_getItemTagName, _DadsStepNavigation_syncStatusVisibility, _DadsStepNavigation_syncStatusLive, _DadsStepNavigation_syncContainerSemantics, _DadsStepNavigation_syncItems, _DadsStepNavigationItem_instances, _DadsStepNavigationItem_header, _DadsStepNavigationItem_titleSlot, _DadsStepNavigationItem_titleFallbackSlot, _DadsStepNavigationItem_descriptionSlot, _DadsStepNavigationItem_syncNumber, _DadsStepNavigationItem_syncLabels, _DadsStepNavigationItem_isButtonInteraction, _DadsStepNavigationItem_syncInteraction, _DadsStepNavigationItem_syncLink, _DadsStepNavigationItem_handleTitleSlotChange, _DadsStepNavigationItem_handleDescriptionSlotChange, _DadsStepNavigationItem_syncTitleVisibility, _DadsStepNavigationItem_syncDescriptionVisibility, _DadsStepNavigationItem_handleHeaderClick, _DadsStepNavigationItem_handleHeaderKeydown, _DadsStepNavigationItem_emitActivateEvent;
import { html, PropertyAttr, TransferringPropertyAttr, Keys } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import { stepNavigationTokens, stepNavigationSemanticTokens, } from './step-navigation-tokens.js';
import { stepNavigationStyles, stepNavigationItemStyles } from './step-navigation-styles.js';
function getRef(host, id) {
    const el = host.refs?.[id];
    return el instanceof Element ? el : null;
}
function normalizeOrientation(v) {
    return v === 'vertical' ? 'vertical' : 'horizontal';
}
function normalizeSize(v) {
    return v === 'small' ? 'small' : 'normal';
}
function normalizeInteraction(v) {
    return v === 'button' ? 'button' : 'none';
}
function normalizeStatusLive(v) {
    if (v === 'polite' || v === 'assertive')
        return v;
    return 'off';
}
function hasMeaningfulAssignedText(slot) {
    const nodes = slot.assignedNodes({ flatten: true });
    for (const node of nodes) {
        const text = node.textContent;
        if (text && text.trim().length > 0)
            return true;
    }
    return false;
}
function hasDirectMeaningfulSlottedContent(host, slotName) {
    for (const child of host.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (child.getAttribute('slot') !== slotName)
            continue;
        const text = child.textContent?.trim();
        if (text && text.length > 0)
            return true;
        const ariaLabel = child.getAttribute('aria-label');
        const ariaLabelledby = child.getAttribute('aria-labelledby');
        if (ariaLabel || ariaLabelledby)
            return true;
    }
    return false;
}
/**
 * Step Navigation（コンテナ）
 *
 * @customElement dads-step-navigation
 * @tagname dads-step-navigation
 *
 * @slot status - 進捗文言（スクリーンリーダー向け、visually-hidden）
 * @slot default - dads-step-navigation-item 群
 *
 * @csspart container - ナビゲーションコンテナ
 * @csspart status - 進捗文言のラッパー
 * @csspart list - ステップ一覧（リスト）
 *
 * @attr {string} orientation - 表示方向 (horizontal | vertical)
 * @attr {string} size - サイズ (normal | small)
 * @attr {string} status-live - ステータスの読み上げ (off | polite | assertive)
 */
export class DadsStepNavigation extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsStepNavigation_instances.add(this);
        _DadsStepNavigation_slot.set(this, null);
        _DadsStepNavigation_statusSlot.set(this, null);
        _DadsStepNavigation_itemsObserver.set(this, null);
        _DadsStepNavigation_childObserver.set(this, null);
        _DadsStepNavigation_handleStatusSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncStatusVisibility).call(this);
        });
        _DadsStepNavigation_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncItems).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute('orientation')) {
            this.setAttribute('orientation', 'horizontal');
        }
        if (!this.hasAttribute('size')) {
            this.setAttribute('size', 'normal');
        }
        __classPrivateFieldSet(this, _DadsStepNavigation_statusSlot, getRef(this, 'status-slot'), "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_statusSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigation_handleStatusSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncStatusVisibility).call(this);
        __classPrivateFieldSet(this, _DadsStepNavigation_slot, getRef(this, 'items-slot'), "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_slot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigation_handleSlotChange, "f"));
        // スロット変更が発火しない環境向け（子の増減）
        __classPrivateFieldSet(this, _DadsStepNavigation_childObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncItems).call(this)), "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_childObserver, "f").observe(this, { childList: true });
        // 子のインタラクション変更（href/interaction）に追従
        __classPrivateFieldSet(this, _DadsStepNavigation_itemsObserver, new MutationObserver(() => __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncItems).call(this)), "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncStatusLive).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncItems).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsStepNavigation_statusSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigation_handleStatusSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigation_statusSlot, null, "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_slot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigation_handleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigation_slot, null, "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_itemsObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsStepNavigation_itemsObserver, null, "f");
        __classPrivateFieldGet(this, _DadsStepNavigation_childObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsStepNavigation_childObserver, null, "f");
        super.disconnectedCallback();
    }
    orientationChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncItems).call(this);
    }
    sizeChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncItems).call(this);
    }
    statusLiveChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncStatusLive).call(this);
    }
}
_DadsStepNavigation_slot = new WeakMap(), _DadsStepNavigation_statusSlot = new WeakMap(), _DadsStepNavigation_itemsObserver = new WeakMap(), _DadsStepNavigation_childObserver = new WeakMap(), _DadsStepNavigation_handleStatusSlotChange = new WeakMap(), _DadsStepNavigation_handleSlotChange = new WeakMap(), _DadsStepNavigation_instances = new WeakSet(), _DadsStepNavigation_getItemTagName = function _DadsStepNavigation_getItemTagName() {
    const tag = this.localName;
    return tag.endsWith('-step-navigation') ? `${tag}-item` : 'dads-step-navigation-item';
}, _DadsStepNavigation_syncStatusVisibility = function _DadsStepNavigation_syncStatusVisibility() {
    const status = getRef(this, 'status');
    if (!status)
        return;
    const slot = __classPrivateFieldGet(this, _DadsStepNavigation_statusSlot, "f") ?? getRef(this, 'status-slot');
    if (!slot)
        return;
    // Safari/WebKit: :has(slot:empty) が信頼できないため、JSで制御する。
    const hasStatus = hasMeaningfulAssignedText(slot) || hasDirectMeaningfulSlottedContent(this, 'status');
    status.toggleAttribute('hidden', !hasStatus);
}, _DadsStepNavigation_syncStatusLive = function _DadsStepNavigation_syncStatusLive() {
    const status = getRef(this, 'status');
    if (!status)
        return;
    const live = normalizeStatusLive(this.getAttribute('status-live'));
    if (live === 'off') {
        status.removeAttribute('aria-live');
        status.removeAttribute('aria-atomic');
        return;
    }
    status.setAttribute('aria-live', live);
    status.setAttribute('aria-atomic', 'true');
}, _DadsStepNavigation_syncContainerSemantics = function _DadsStepNavigation_syncContainerSemantics(hasInteractiveItems) {
    const nav = getRef(this, 'nav');
    if (!nav)
        return;
    if (hasInteractiveItems) {
        nav.removeAttribute('role');
        return;
    }
    nav.setAttribute('role', 'group');
}, _DadsStepNavigation_syncItems = function _DadsStepNavigation_syncItems() {
    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    const size = normalizeSize(this.getAttribute('size'));
    const itemTag = __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_getItemTagName).call(this);
    const items = [];
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (child.tagName.toLowerCase() !== itemTag)
            continue;
        items.push(child);
    }
    __classPrivateFieldGet(this, _DadsStepNavigation_itemsObserver, "f")?.disconnect();
    for (const item of items) {
        __classPrivateFieldGet(this, _DadsStepNavigation_itemsObserver, "f")?.observe(item, {
            attributes: true,
            attributeFilter: ['href', 'interaction'],
        });
    }
    const total = items.length;
    let hasInteractiveItems = false;
    for (let i = 0; i < total; i++) {
        const item = items[i];
        item.setAttribute('data-orientation', orientation);
        item.setAttribute('data-size', size);
        item.setAttribute('step', String(i + 1));
        item.toggleAttribute('data-first', i === 0);
        item.toggleAttribute('data-last', i === total - 1);
        item.setAttribute('role', 'listitem');
        item.setAttribute('aria-posinset', String(i + 1));
        item.setAttribute('aria-setsize', String(total));
        const href = item.getAttribute('href');
        if (href)
            hasInteractiveItems = true;
        else if (normalizeInteraction(item.getAttribute('interaction')) === 'button') {
            hasInteractiveItems = true;
        }
    }
    __classPrivateFieldGet(this, _DadsStepNavigation_instances, "m", _DadsStepNavigation_syncContainerSemantics).call(this, hasInteractiveItems);
};
DadsStepNavigation.version = '0.1.0';
DadsStepNavigation.definition = {
    name: 'dads-step-navigation',
    template: html `
      <nav part="container" id="nav">
        <p part="visually-hidden status" id="status">
          <slot name="status" id="status-slot"></slot>
        </p>
        <ul part="list" id="list" role="list">
          <slot id="items-slot"></slot>
        </ul>
      </nav>
    `,
    styles: withReset([
        applyDADSTokens(),
        stepNavigationTokens,
        stepNavigationStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('orientation'),
        PropertyAttr('size'),
        PropertyAttr('statusLive', 'status-live'),
        TransferringPropertyAttr('nav', 'ariaLabel', 'aria-label'),
        TransferringPropertyAttr('nav', 'ariaLabelledby', 'aria-labelledby'),
    ],
};
/**
 * Step Navigation Item（各ステップ）
 *
 * @customElement dads-step-navigation-item
 * @tagname dads-step-navigation-item
 *
 * @slot title - ステップのタイトル
 * @slot description - ステップの説明（任意）
 *
 * @csspart step - ステップ要素（コネクタ線含む）
 * @csspart header - ヘッダー（リンクの場合は <a>）
 * @csspart number - ステップ番号（円形）
 * @csspart state-icon - 状態アイコン（completed/editing/error）
 * @csspart state-label - 状態ラベル（editing/error）
 * @csspart title - タイトル
 * @csspart description - 説明
 *
 * @attr {string} state - 状態 (reached | completed | editing | error | skipped)
 * @attr {string} href - リンクURL（指定時のみリンク表示）
 * @attr {string} interaction - ボタン相当のインタラクション (button)
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {string} step - 親が付与する表示番号（1始まり）
 * @attr {string} label-step - スクリーンリーダー向け「ステップ」ラベル
 * @attr {string} label-completed - スクリーンリーダー向け「完了」ラベル
 * @attr {string} label-editing - 「編集中」ラベル
 * @attr {string} label-error - 「エラー」ラベル
 * @attr {string} label-skipped - スクリーンリーダー向け「スキップ」ラベル
 *
 * @fires dads-step-activate - interaction="button" のアクティベート時に発火（detail: {step, state, trigger}）
 */
export class DadsStepNavigationItem extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsStepNavigationItem_instances.add(this);
        _DadsStepNavigationItem_header.set(this, null);
        _DadsStepNavigationItem_titleSlot.set(this, null);
        _DadsStepNavigationItem_titleFallbackSlot.set(this, null);
        _DadsStepNavigationItem_descriptionSlot.set(this, null);
        _DadsStepNavigationItem_handleTitleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncTitleVisibility).call(this);
        });
        _DadsStepNavigationItem_handleDescriptionSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncDescriptionVisibility).call(this);
        });
        _DadsStepNavigationItem_handleHeaderClick.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_isButtonInteraction).call(this))
                return;
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_emitActivateEvent).call(this, 'click');
        });
        _DadsStepNavigationItem_handleHeaderKeydown.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_isButtonInteraction).call(this))
                return;
            if (event.key !== Keys.enter && event.key !== Keys.space)
                return;
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_emitActivateEvent).call(this, 'keyboard');
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsStepNavigationItem_header, getRef(this, 'header'), "f");
        __classPrivateFieldGet(this, _DadsStepNavigationItem_header, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleHeaderClick, "f"));
        __classPrivateFieldGet(this, _DadsStepNavigationItem_header, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleHeaderKeydown, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigationItem_titleSlot, getRef(this, 'title-slot'), "f");
        __classPrivateFieldSet(this, _DadsStepNavigationItem_titleFallbackSlot, getRef(this, 'title-fallback-slot'), "f");
        __classPrivateFieldSet(this, _DadsStepNavigationItem_descriptionSlot, getRef(this, 'description-slot'), "f");
        __classPrivateFieldGet(this, _DadsStepNavigationItem_titleSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleTitleSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsStepNavigationItem_titleFallbackSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleTitleSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsStepNavigationItem_descriptionSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleDescriptionSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncNumber).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLink).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLabels).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncInteraction).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncTitleVisibility).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncDescriptionVisibility).call(this);
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'listitem');
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_header, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleHeaderClick, "f"));
        __classPrivateFieldGet(this, _DadsStepNavigationItem_header, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleHeaderKeydown, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigationItem_header, null, "f");
        __classPrivateFieldGet(this, _DadsStepNavigationItem_titleSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleTitleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigationItem_titleSlot, null, "f");
        __classPrivateFieldGet(this, _DadsStepNavigationItem_titleFallbackSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleTitleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigationItem_titleFallbackSlot, null, "f");
        __classPrivateFieldGet(this, _DadsStepNavigationItem_descriptionSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsStepNavigationItem_handleDescriptionSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsStepNavigationItem_descriptionSlot, null, "f");
        super.disconnectedCallback();
    }
    stepChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncNumber).call(this);
    }
    hrefChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLink).call(this);
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncInteraction).call(this);
    }
    interactionChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncInteraction).call(this);
    }
    targetChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLink).call(this);
    }
    relChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLink).call(this);
    }
    labelStepChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLabels).call(this);
    }
    labelCompletedChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLabels).call(this);
    }
    labelEditingChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLabels).call(this);
    }
    labelErrorChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLabels).call(this);
    }
    labelSkippedChanged() {
        __classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_syncLabels).call(this);
    }
}
_DadsStepNavigationItem_header = new WeakMap(), _DadsStepNavigationItem_titleSlot = new WeakMap(), _DadsStepNavigationItem_titleFallbackSlot = new WeakMap(), _DadsStepNavigationItem_descriptionSlot = new WeakMap(), _DadsStepNavigationItem_handleTitleSlotChange = new WeakMap(), _DadsStepNavigationItem_handleDescriptionSlotChange = new WeakMap(), _DadsStepNavigationItem_handleHeaderClick = new WeakMap(), _DadsStepNavigationItem_handleHeaderKeydown = new WeakMap(), _DadsStepNavigationItem_instances = new WeakSet(), _DadsStepNavigationItem_syncNumber = function _DadsStepNavigationItem_syncNumber() {
    const num = this.getAttribute('step') ?? '';
    const el = getRef(this, 'number-value');
    if (el)
        el.textContent = num;
}, _DadsStepNavigationItem_syncLabels = function _DadsStepNavigationItem_syncLabels() {
    const srStep = this.shadowRoot?.querySelector('[part~="step-label"]');
    if (srStep)
        srStep.textContent = this.getAttribute('label-step') ?? 'ステップ';
    const srCompleted = this.shadowRoot?.querySelector('[data-state-sr="completed"]');
    if (srCompleted)
        srCompleted.textContent = this.getAttribute('label-completed') ?? '完了';
    const srSkipped = this.shadowRoot?.querySelector('[data-state-sr="skipped"]');
    if (srSkipped)
        srSkipped.textContent = this.getAttribute('label-skipped') ?? 'スキップされました';
    const labelEditing = this.shadowRoot?.querySelector('[data-state-label="editing"]');
    if (labelEditing)
        labelEditing.textContent = this.getAttribute('label-editing') ?? '編集中';
    const labelError = this.shadowRoot?.querySelector('[data-state-label="error"]');
    if (labelError)
        labelError.textContent = this.getAttribute('label-error') ?? 'エラー';
}, _DadsStepNavigationItem_isButtonInteraction = function _DadsStepNavigationItem_isButtonInteraction() {
    if (this.getAttribute('href'))
        return false;
    return normalizeInteraction(this.getAttribute('interaction')) === 'button';
}, _DadsStepNavigationItem_syncInteraction = function _DadsStepNavigationItem_syncInteraction() {
    const header = __classPrivateFieldGet(this, _DadsStepNavigationItem_header, "f") ?? getRef(this, 'header');
    if (!header)
        return;
    if (this.getAttribute('href')) {
        header.removeAttribute('role');
        header.removeAttribute('tabindex');
        return;
    }
    if (__classPrivateFieldGet(this, _DadsStepNavigationItem_instances, "m", _DadsStepNavigationItem_isButtonInteraction).call(this)) {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        return;
    }
    header.removeAttribute('role');
    header.removeAttribute('tabindex');
}, _DadsStepNavigationItem_syncLink = function _DadsStepNavigationItem_syncLink() {
    const header = (__classPrivateFieldGet(this, _DadsStepNavigationItem_header, "f") ?? getRef(this, 'header'));
    if (!header)
        return;
    const href = this.getAttribute('href');
    if (href)
        header.setAttribute('href', href);
    else
        header.removeAttribute('href');
    const target = this.getAttribute('target');
    if (target)
        header.setAttribute('target', target);
    else
        header.removeAttribute('target');
    const rel = this.getAttribute('rel');
    if (rel)
        header.setAttribute('rel', rel);
    else
        header.removeAttribute('rel');
}, _DadsStepNavigationItem_syncTitleVisibility = function _DadsStepNavigationItem_syncTitleVisibility() {
    const wrap = getRef(this, 'title');
    if (!wrap)
        return;
    const titleSlot = __classPrivateFieldGet(this, _DadsStepNavigationItem_titleSlot, "f") ?? getRef(this, 'title-slot');
    const fallbackSlot = __classPrivateFieldGet(this, _DadsStepNavigationItem_titleFallbackSlot, "f") ?? getRef(this, 'title-fallback-slot');
    if (!titleSlot || !fallbackSlot)
        return;
    const hasTitle = hasMeaningfulAssignedText(titleSlot) || hasMeaningfulAssignedText(fallbackSlot);
    wrap.toggleAttribute('hidden', !hasTitle);
}, _DadsStepNavigationItem_syncDescriptionVisibility = function _DadsStepNavigationItem_syncDescriptionVisibility() {
    const wrap = getRef(this, 'description');
    if (!wrap)
        return;
    const slot = __classPrivateFieldGet(this, _DadsStepNavigationItem_descriptionSlot, "f") ?? getRef(this, 'description-slot');
    if (!slot)
        return;
    // Safari/WebKit: :has(slot:empty) が信頼できないため、JSで制御する。
    const hasDescription = hasMeaningfulAssignedText(slot) || hasDirectMeaningfulSlottedContent(this, 'description');
    wrap.toggleAttribute('hidden', !hasDescription);
}, _DadsStepNavigationItem_emitActivateEvent = function _DadsStepNavigationItem_emitActivateEvent(trigger) {
    this.dispatchEvent(new CustomEvent('dads-step-activate', {
        detail: {
            step: this.getAttribute('step'),
            state: this.getAttribute('state'),
            trigger,
        },
        bubbles: true,
        composed: true,
    }));
};
DadsStepNavigationItem.version = '0.1.0';
DadsStepNavigationItem.definition = {
    name: 'dads-step-navigation-item',
    template: html `
      <div part="step" id="step">
        <a part="header" id="header">
          <span part="visually-hidden step-label">ステップ</span>
          <span part="number" id="number">
            <span part="number-value" id="number-value"></span>

            <span part="state-icon" data-state-icon="completed" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11.5"></circle>
                <path d="M10 17.5 19.8 8l-1.5-1.5-8.1 8-4.1-4L4.5 12l5.6 5.5Z"></path>
              </svg>
            </span>
            <span part="visually-hidden state-sr" data-state-sr="completed">完了</span>

            <span part="state-icon" data-state-icon="editing" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.8 20c-.5 0-1-.2-1.3-.5-.3-.4-.5-.8-.5-1.3V5.6c0-.5.2-.9.5-1.3.4-.3.8-.5 1.3-.5h8L12 5.6H5.8v12.6h12.6V12l1.8-1.8v8c0 .5-.2 1-.5 1.3-.4.3-.8.5-1.3.5H5.8Zm3.6-5.4v-3.8l8.3-8.3a1.8 1.8 0 0 1 2.5 0l1.3 1.3.4.6a1.7 1.7 0 0 1 0 1.3c-.1.3-.2.5-.4.6l-8.3 8.3H9.4Zm1.8-1.8h1.3l5.2-5.2L17 7l-.7-.7-5.2 5.2v1.3Z"></path>
              </svg>
            </span>
            <span part="state-label" data-state-label="editing">編集中</span>

            <span part="state-icon" data-state-icon="error" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M1 21 12 2l11 19H1Zm3.5-2h15L12 6 4.5 19Zm7.5-1c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 0 0-.3-.7 1 1 0 0 0-.7-.3 1 1 0 0 0-.7.3 1 1 0 0 0-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3Zm-1-3h2v-5h-2v5Z"></path>
              </svg>
            </span>
            <span part="state-label" data-state-label="error">エラー</span>

            <span part="visually-hidden state-sr" data-state-sr="skipped">スキップされました</span>
          </span>
          <span part="title" id="title">
            <slot name="title" id="title-slot"><slot id="title-fallback-slot"></slot></slot>
          </span>
        </a>
        <p part="description" id="description">
          <slot name="description" id="description-slot"></slot>
        </p>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        stepNavigationSemanticTokens,
        stepNavigationItemStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('state'),
        PropertyAttr('step'),
        PropertyAttr('href'),
        PropertyAttr('interaction'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        PropertyAttr('labelStep', 'label-step'),
        PropertyAttr('labelCompleted', 'label-completed'),
        PropertyAttr('labelEditing', 'label-editing'),
        PropertyAttr('labelError', 'label-error'),
        PropertyAttr('labelSkipped', 'label-skipped'),
    ],
};
