/**
 * @module utility-link
 * デジタル庁デザインシステム Utility Link コンポーネント
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
var _DadsUtilityLink_instances, _DadsUtilityLink_base, _DadsUtilityLink_leadIconSlot, _DadsUtilityLink_tailIconSlot, _DadsUtilityLink_tailIcon, _DadsUtilityLink_tailIconSvg, _DadsUtilityLink_tailIconPath, _DadsUtilityLink_slotMutationObserver, _DadsUtilityLink_handleLeadIconSlotChange, _DadsUtilityLink_handleTailIconSlotChange, _DadsUtilityLink_syncAll, _DadsUtilityLink_observeSlotMutations, _DadsUtilityLink_syncLinkAttributes, _DadsUtilityLink_syncTailIconKind, _DadsUtilityLink_syncLeadIconVisibility, _DadsUtilityLink_syncTailIconVisibility, _DadsUtilityLink_computeAutoTailIconKind, _DadsUtilityLink_hasMeaningfulSlottedContent, _DadsUtilityLink_getAssignedNodesWithoutFallback;
import { html, PropertyAttr, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { iconPaths } from '../../utils/icons.js';
import { isSafeHref } from '../../utils/safe-href.js';
import { utilityLinkTokens } from './utility-link-tokens.js';
import { utilityLinkStyles } from './utility-link-styles.js';
const NEW_WINDOW_ICON_PATH = 'M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z';
const NEW_WINDOW_ICON_LABEL = '新規タブで開きます';
const NEW_WINDOW_ICON_VIEWBOX = '0 0 48 48';
const DOWNLOAD_ICON_PATH = iconPaths.download;
const DOWNLOAD_ICON_LABEL = 'ダウンロードします';
const DOWNLOAD_ICON_VIEWBOX = '0 0 24 24';
function getRef(host, id) {
    const el = host.refs?.[id];
    return el instanceof Element ? el : null;
}
function isMeaningfulNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        if (element.hasAttribute('hidden'))
            return false;
        return true;
    }
    if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '')
        return true;
    return false;
}
/**
 * Utility Link コンポーネント
 *
 * @customElement
 * @tagname dads-utility-link
 *
 * @slot default - リンクラベル
 * @slot lead-icon - 先頭アイコン（任意）
 * @slot tail-icon - 末尾アイコン（任意、指定時は自動末尾アイコンより優先）
 *
 * @csspart base - リンク本体（a要素）
 * @csspart lead-icon - 先頭アイコン領域
 * @csspart label - ラベル領域
 * @csspart tail-icon - 末尾アイコン領域（tail-icon slot または target="_blank"/download フォールバックを表示）
 *
 * @attr {string} href - リンク先URL
 * @attr {string} target - リンクターゲット（download 指定時は内部リンクへは反映しない）
 * @attr {string} rel - リンクrel
 * @attr {boolean} download - download属性
 *
 * @cssprop --dads-utility-link-label-color - ラベル色
 * @cssprop --dads-utility-link-label-color-hover - ホバー時ラベル色
 * @cssprop --dads-utility-link-label-color-active - アクティブ時ラベル色
 * @cssprop --dads-utility-link-icon-color - アイコン色
 * @cssprop --dads-utility-link-underline-thickness - 下線太さ
 * @cssprop --dads-utility-link-underline-thickness-hover - ホバー時下線太さ
 * @cssprop --dads-utility-link-underline-offset - 下線オフセット
 * @cssprop --dads-utility-link-focus-outline-color - フォーカス時アウトライン色
 * @cssprop --dads-utility-link-focus-ring-color - フォーカス時リング色
 * @cssprop --dads-utility-link-focus-background - フォーカス時背景色
 */
export class DadsUtilityLink extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsUtilityLink_instances.add(this);
        _DadsUtilityLink_base.set(this, null);
        _DadsUtilityLink_leadIconSlot.set(this, null);
        _DadsUtilityLink_tailIconSlot.set(this, null);
        _DadsUtilityLink_tailIcon.set(this, null);
        _DadsUtilityLink_tailIconSvg.set(this, null);
        _DadsUtilityLink_tailIconPath.set(this, null);
        _DadsUtilityLink_slotMutationObserver.set(this, null);
        _DadsUtilityLink_handleLeadIconSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLeadIconVisibility).call(this);
        });
        _DadsUtilityLink_handleTailIconSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncTailIconVisibility).call(this, __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_computeAutoTailIconKind).call(this));
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsUtilityLink_base, getRef(this, 'base'), "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_leadIconSlot, getRef(this, 'lead-icon-slot'), "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIconSlot, getRef(this, 'tail-icon-slot'), "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIcon, getRef(this, 'tail-icon'), "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIconSvg, getRef(this, 'tail-icon-svg'), "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIconPath, getRef(this, 'tail-icon-path'), "f");
        __classPrivateFieldGet(this, _DadsUtilityLink_leadIconSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsUtilityLink_handleLeadIconSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsUtilityLink_tailIconSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsUtilityLink_handleTailIconSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_observeSlotMutations).call(this);
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsUtilityLink_leadIconSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsUtilityLink_handleLeadIconSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsUtilityLink_tailIconSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsUtilityLink_handleTailIconSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsUtilityLink_slotMutationObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsUtilityLink_slotMutationObserver, null, "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_base, null, "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_leadIconSlot, null, "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIconSlot, null, "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIcon, null, "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIconSvg, null, "f");
        __classPrivateFieldSet(this, _DadsUtilityLink_tailIconPath, null, "f");
        super.disconnectedCallback();
    }
    hrefChanged() {
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLinkAttributes).call(this);
    }
    targetChanged() {
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLinkAttributes).call(this);
    }
    relChanged() {
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLinkAttributes).call(this);
    }
    downloadChanged() {
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLinkAttributes).call(this);
    }
}
_DadsUtilityLink_base = new WeakMap(), _DadsUtilityLink_leadIconSlot = new WeakMap(), _DadsUtilityLink_tailIconSlot = new WeakMap(), _DadsUtilityLink_tailIcon = new WeakMap(), _DadsUtilityLink_tailIconSvg = new WeakMap(), _DadsUtilityLink_tailIconPath = new WeakMap(), _DadsUtilityLink_slotMutationObserver = new WeakMap(), _DadsUtilityLink_handleLeadIconSlotChange = new WeakMap(), _DadsUtilityLink_handleTailIconSlotChange = new WeakMap(), _DadsUtilityLink_instances = new WeakSet(), _DadsUtilityLink_syncAll = function _DadsUtilityLink_syncAll() {
    __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLinkAttributes).call(this);
    __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLeadIconVisibility).call(this);
}, _DadsUtilityLink_observeSlotMutations = function _DadsUtilityLink_observeSlotMutations() {
    __classPrivateFieldGet(this, _DadsUtilityLink_slotMutationObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsUtilityLink_slotMutationObserver, new MutationObserver(() => {
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncLeadIconVisibility).call(this);
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncTailIconVisibility).call(this, __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_computeAutoTailIconKind).call(this));
    }), "f");
    __classPrivateFieldGet(this, _DadsUtilityLink_slotMutationObserver, "f").observe(this, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['slot', 'hidden'],
    });
}, _DadsUtilityLink_syncLinkAttributes = function _DadsUtilityLink_syncLinkAttributes() {
    const base = __classPrivateFieldGet(this, _DadsUtilityLink_base, "f") ?? getRef(this, 'base');
    const tailIcon = __classPrivateFieldGet(this, _DadsUtilityLink_tailIcon, "f") ?? getRef(this, 'tail-icon');
    if (!base || !tailIcon)
        return;
    const href = this.getAttribute('href');
    base.setAttribute('href', href && isSafeHref(href) ? href : '#');
    const rel = this.getAttribute('rel');
    if (rel)
        base.setAttribute('rel', rel);
    else
        base.removeAttribute('rel');
    const hasDownload = this.hasAttribute('download');
    if (hasDownload)
        base.setAttribute('download', '');
    else
        base.removeAttribute('download');
    const target = this.getAttribute('target');
    const effectiveTarget = hasDownload ? null : target;
    if (effectiveTarget)
        base.setAttribute('target', effectiveTarget);
    else
        base.removeAttribute('target');
    const tailIconKind = hasDownload ? 'download' : effectiveTarget === '_blank' ? 'new-window' : 'none';
    if (tailIconKind === 'none') {
        this.removeAttribute('data-tail-icon-kind');
    }
    else {
        this.setAttribute('data-tail-icon-kind', tailIconKind);
        __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncTailIconKind).call(this, tailIconKind);
    }
    __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_syncTailIconVisibility).call(this, tailIconKind);
}, _DadsUtilityLink_syncTailIconKind = function _DadsUtilityLink_syncTailIconKind(kind) {
    const svg = __classPrivateFieldGet(this, _DadsUtilityLink_tailIconSvg, "f") ?? getRef(this, 'tail-icon-svg');
    const path = __classPrivateFieldGet(this, _DadsUtilityLink_tailIconPath, "f") ?? getRef(this, 'tail-icon-path');
    if (!svg || !path)
        return;
    if (kind === 'download') {
        svg.setAttribute('aria-label', DOWNLOAD_ICON_LABEL);
        svg.setAttribute('viewBox', DOWNLOAD_ICON_VIEWBOX);
        path.setAttribute('d', DOWNLOAD_ICON_PATH);
        return;
    }
    svg.setAttribute('aria-label', NEW_WINDOW_ICON_LABEL);
    svg.setAttribute('viewBox', NEW_WINDOW_ICON_VIEWBOX);
    path.setAttribute('d', NEW_WINDOW_ICON_PATH);
}, _DadsUtilityLink_syncLeadIconVisibility = function _DadsUtilityLink_syncLeadIconVisibility() {
    const slot = __classPrivateFieldGet(this, _DadsUtilityLink_leadIconSlot, "f") ?? getRef(this, 'lead-icon-slot');
    const hasLeadIcon = __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_hasMeaningfulSlottedContent).call(this, slot, 'lead-icon');
    this.toggleAttribute('data-has-lead-icon', hasLeadIcon);
}, _DadsUtilityLink_syncTailIconVisibility = function _DadsUtilityLink_syncTailIconVisibility(autoTailIconKind) {
    const tailIcon = __classPrivateFieldGet(this, _DadsUtilityLink_tailIcon, "f") ?? getRef(this, 'tail-icon');
    const tailSlot = __classPrivateFieldGet(this, _DadsUtilityLink_tailIconSlot, "f") ?? getRef(this, 'tail-icon-slot');
    const tailIconSvg = __classPrivateFieldGet(this, _DadsUtilityLink_tailIconSvg, "f") ?? getRef(this, 'tail-icon-svg');
    if (!tailIcon)
        return;
    const hasCustomTailIcon = __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_hasMeaningfulSlottedContent).call(this, tailSlot, 'tail-icon');
    tailSlot?.toggleAttribute('hidden', !hasCustomTailIcon);
    const showAutoTailIcon = !hasCustomTailIcon && autoTailIconKind !== 'none';
    tailIconSvg?.toggleAttribute('hidden', !showAutoTailIcon);
    const showTailIcon = hasCustomTailIcon || showAutoTailIcon;
    tailIcon.toggleAttribute('hidden', !showTailIcon);
    this.toggleAttribute('data-show-tail-icon', showTailIcon);
}, _DadsUtilityLink_computeAutoTailIconKind = function _DadsUtilityLink_computeAutoTailIconKind() {
    if (this.hasAttribute('download'))
        return 'download';
    return this.getAttribute('target') === '_blank' ? 'new-window' : 'none';
}, _DadsUtilityLink_hasMeaningfulSlottedContent = function _DadsUtilityLink_hasMeaningfulSlottedContent(slot, slotName) {
    for (const node of __classPrivateFieldGet(this, _DadsUtilityLink_instances, "m", _DadsUtilityLink_getAssignedNodesWithoutFallback).call(this, slot)) {
        if (isMeaningfulNode(node))
            return true;
    }
    const directSlottedElements = Array.from(this.children).filter((element) => element.getAttribute('slot') === slotName);
    return directSlottedElements.some((element) => !element.hasAttribute('hidden'));
}, _DadsUtilityLink_getAssignedNodesWithoutFallback = function _DadsUtilityLink_getAssignedNodesWithoutFallback(slot) {
    if (!slot)
        return [];
    return slot.assignedNodes({ flatten: true }).filter((node) => !slot.contains(node));
};
DadsUtilityLink.definition = {
    name: 'dads-utility-link',
    template: html `
      <a part="base" id="base">
        <span part="lead-icon" id="lead-icon">
          <slot name="lead-icon" id="lead-icon-slot"></slot>
        </span>
        <span part="label" id="label">
          <slot></slot>
        </span>
        <span part="tail-icon" id="tail-icon" hidden>
          <slot name="tail-icon" id="tail-icon-slot"></slot>
          <svg
            id="tail-icon-svg"
            width="16"
            height="16"
            viewBox="${NEW_WINDOW_ICON_VIEWBOX}"
            fill="currentcolor"
            role="img"
            aria-label="${NEW_WINDOW_ICON_LABEL}"
            hidden
          >
            <path id="tail-icon-path" d="${NEW_WINDOW_ICON_PATH}" />
          </svg>
        </span>
      </a>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), utilityLinkTokens, utilityLinkStyles], 'minimal'),
    attributes: [
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        BooleanAttr('download'),
    ],
};
