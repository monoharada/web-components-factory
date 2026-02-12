/**
 * @module emergency-banner
 * デジタル庁デザインシステム 緊急時バナーコンポーネント
 * @version 1.0.0
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
var _DadsEmergencyBanner_instances, _DadsEmergencyBanner_heading, _DadsEmergencyBanner_prefix, _DadsEmergencyBanner_timestamp, _DadsEmergencyBanner_body, _DadsEmergencyBanner_action, _DadsEmergencyBanner_actionLink, _DadsEmergencyBanner_actionIcon, _DadsEmergencyBanner_timestampSlot, _DadsEmergencyBanner_bodySlot, _DadsEmergencyBanner_actionSlot, _DadsEmergencyBanner_observer, _DadsEmergencyBanner_onSlotChange, _DadsEmergencyBanner_ensureDefaultAttributes, _DadsEmergencyBanner_bindEvents, _DadsEmergencyBanner_syncAll, _DadsEmergencyBanner_normalizeHeadingLevel, _DadsEmergencyBanner_normalizePrefixMode, _DadsEmergencyBanner_normalizePrefixLabel, _DadsEmergencyBanner_normalizeTarget, _DadsEmergencyBanner_syncHeading, _DadsEmergencyBanner_syncTargetAttribute, _DadsEmergencyBanner_syncPrefix, _DadsEmergencyBanner_syncTimestamp, _DadsEmergencyBanner_syncBody, _DadsEmergencyBanner_syncAction, _DadsEmergencyBanner_hasMeaningfulSlotContent, _DadsEmergencyBanner_readActionLabelText;
import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { isSafeHref } from '../../utils/safe-href.js';
import { emergencyBannerTokens } from './emergency-banner-tokens.js';
import { emergencyBannerStyles } from './emergency-banner-styles.js';
const NEW_TAB_ANNOUNCEMENT = '新規タブで開きます';
const VALID_HEADING_LEVELS = new Set(['2', '3', '4', '5', '6']);
const VALID_PREFIX_MODES = new Set(['auto', 'manual']);
const VALID_TARGETS = new Set(['_self', '_blank']);
const DEFAULT_ATTRIBUTE_VALUES = [
    ['heading-level', '2'],
    ['prefix-mode', 'auto'],
    ['prefix-label', '【緊急】'],
    ['target', '_self'],
];
function normalizeText(value) {
    return (value ?? '').replace(/\s+/g, ' ').trim();
}
function parseIdRefs(value) {
    const normalized = normalizeText(value);
    if (!normalized)
        return [];
    return normalized.split(' ').filter((id) => id.length > 0);
}
function escapeAttributeValue(value) {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
function findElementById(source, id) {
    if (!id)
        return null;
    const selector = `[id="${escapeAttributeValue(id)}"]`;
    const root = source.getRootNode();
    if (root instanceof Document || root instanceof ShadowRoot) {
        const inRoot = root.querySelector(selector);
        if (inRoot)
            return inRoot;
    }
    const ownerDocument = source.ownerDocument;
    if (!ownerDocument)
        return null;
    const byId = ownerDocument.getElementById(id);
    if (byId)
        return byId;
    return ownerDocument.querySelector(selector);
}
function getAriaLabelledbyText(element, visited) {
    const ids = parseIdRefs(element.getAttribute('aria-labelledby'));
    if (ids.length === 0)
        return '';
    const label = ids
        .map((id) => {
        const labelledElement = findElementById(element, id);
        if (!labelledElement || labelledElement === element)
            return '';
        return getNodeAccessibleText(labelledElement, visited, true);
    })
        .filter((segment) => segment.length > 0)
        .join(' ');
    return normalizeText(label);
}
function isMeaningfulNode(node) {
    return getNodeAccessibleText(node).length > 0;
}
function getNodeAccessibleText(node, visited = new Set(), includeHidden = false) {
    if (node.nodeType === Node.TEXT_NODE) {
        return normalizeText(node.textContent);
    }
    if (node.nodeType !== Node.ELEMENT_NODE)
        return '';
    const element = node;
    if (!includeHidden && element.hasAttribute('hidden'))
        return '';
    if (visited.has(element))
        return '';
    visited.add(element);
    const ariaLabel = normalizeText(element.getAttribute('aria-label'));
    if (ariaLabel)
        return ariaLabel;
    const ariaLabelledbyText = getAriaLabelledbyText(element, visited);
    if (ariaLabelledbyText)
        return ariaLabelledbyText;
    return normalizeText(element.textContent);
}
/**
 * 緊急時バナーコンポーネント
 *
 * @customElement
 * @tagname dads-emergency-banner
 *
 * @slot heading - 見出し本文
 * @slot timestamp - 更新日時
 * @slot default - 本文
 * @slot action - CTAラベル
 *
 * @csspart base - ルート要素
 * @csspart header - ヘッダー領域
 * @csspart heading - 見出し領域
 * @csspart prefix - 見出し接頭辞
 * @csspart timestamp - 更新日時領域
 * @csspart body - 本文領域
 * @csspart action - CTAコンテナ
 * @csspart action-link - CTAリンク
 * @csspart action-label - CTAラベル
 * @csspart action-icon - 新規タブアイコン
 *
 * @attr {'2' | '3' | '4' | '5' | '6'} heading-level - 見出しレベル
 * @attr {'auto' | 'manual'} prefix-mode - 接頭辞表示モード
 * @attr {string} prefix-label - 接頭辞テキスト
 * @attr {string} href - CTAリンク先
 * @attr {'_self' | '_blank'} target - CTAリンクターゲット
 * @attr {string} rel - CTAリンクrel
 *
 * @cssprop --dads-emergency-banner-border-color - 外枠色
 * @cssprop --dads-emergency-banner-background - 背景色
 * @cssprop --dads-emergency-banner-color - 本文文字色
 * @cssprop --dads-emergency-banner-heading-color - 見出し色
 * @cssprop --dads-emergency-banner-action-background - CTA背景色
 * @cssprop --dads-emergency-banner-action-background-hover - CTAホバー背景色
 * @cssprop --dads-emergency-banner-action-color - CTA文字色
 * @cssprop --dads-emergency-banner-action-border-radius - CTA角丸
 *
 * @example
 * ```html
 * <dads-emergency-banner href="https://example.com/evacuation" target="_blank">
 *   <span slot="heading">〇〇地区に避難準備情報が発令されました</span>
 *   <time slot="timestamp" datetime="2024-01-01T06:00:00+09:00">2024年1月1日 06:00更新</time>
 *   <p>お年寄りの方等避難に時間がかかる方は、直ちに指定避難所へ避難してください。</p>
 *   <span slot="action">指定避難所を確認する</span>
 * </dads-emergency-banner>
 * ```
 */
export class DadsEmergencyBanner extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsEmergencyBanner_instances.add(this);
        _DadsEmergencyBanner_heading.set(this, null);
        _DadsEmergencyBanner_prefix.set(this, null);
        _DadsEmergencyBanner_timestamp.set(this, null);
        _DadsEmergencyBanner_body.set(this, null);
        _DadsEmergencyBanner_action.set(this, null);
        _DadsEmergencyBanner_actionLink.set(this, null);
        _DadsEmergencyBanner_actionIcon.set(this, null);
        _DadsEmergencyBanner_timestampSlot.set(this, null);
        _DadsEmergencyBanner_bodySlot.set(this, null);
        _DadsEmergencyBanner_actionSlot.set(this, null);
        _DadsEmergencyBanner_observer.set(this, null);
        _DadsEmergencyBanner_onSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncTimestamp).call(this);
            __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncBody).call(this);
            __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAction).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsEmergencyBanner_heading, this.shadowRoot?.querySelector('#heading') ?? null, "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_prefix, this.shadowRoot?.querySelector('#prefix') ?? null, "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_timestamp, this.shadowRoot?.querySelector('#timestamp') ?? null, "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_body, this.shadowRoot?.querySelector('#body') ?? null, "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_action, this.shadowRoot?.querySelector('#action') ?? null, "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_actionLink, this.shadowRoot?.querySelector('#action-link'), "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_actionIcon, this.shadowRoot?.querySelector('#action-icon') ?? null, "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_timestampSlot, this.shadowRoot?.querySelector('#timestamp-slot'), "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_bodySlot, this.shadowRoot?.querySelector('#body-slot'), "f");
        __classPrivateFieldSet(this, _DadsEmergencyBanner_actionSlot, this.shadowRoot?.querySelector('#action-slot'), "f");
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_ensureDefaultAttributes).call(this);
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_bindEvents).call(this);
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_timestampSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsEmergencyBanner_bodySlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsEmergencyBanner_observer, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsEmergencyBanner_observer, null, "f");
        super.disconnectedCallback();
    }
    headingLevelChanged() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncHeading).call(this);
    }
    prefixModeChanged() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncPrefix).call(this);
    }
    prefixLabelChanged() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncPrefix).call(this);
    }
    hrefChanged() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAction).call(this);
    }
    targetChanged() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncTargetAttribute).call(this);
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAction).call(this);
    }
    relChanged() {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAction).call(this);
    }
}
_DadsEmergencyBanner_heading = new WeakMap(), _DadsEmergencyBanner_prefix = new WeakMap(), _DadsEmergencyBanner_timestamp = new WeakMap(), _DadsEmergencyBanner_body = new WeakMap(), _DadsEmergencyBanner_action = new WeakMap(), _DadsEmergencyBanner_actionLink = new WeakMap(), _DadsEmergencyBanner_actionIcon = new WeakMap(), _DadsEmergencyBanner_timestampSlot = new WeakMap(), _DadsEmergencyBanner_bodySlot = new WeakMap(), _DadsEmergencyBanner_actionSlot = new WeakMap(), _DadsEmergencyBanner_observer = new WeakMap(), _DadsEmergencyBanner_onSlotChange = new WeakMap(), _DadsEmergencyBanner_instances = new WeakSet(), _DadsEmergencyBanner_ensureDefaultAttributes = function _DadsEmergencyBanner_ensureDefaultAttributes() {
    for (const [name, value] of DEFAULT_ATTRIBUTE_VALUES) {
        if (!this.hasAttribute(name))
            this.setAttribute(name, value);
    }
}, _DadsEmergencyBanner_bindEvents = function _DadsEmergencyBanner_bindEvents() {
    __classPrivateFieldGet(this, _DadsEmergencyBanner_timestampSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsEmergencyBanner_bodySlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsEmergencyBanner_actionSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsEmergencyBanner_timestampSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsEmergencyBanner_bodySlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsEmergencyBanner_actionSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsEmergencyBanner_onSlotChange, "f"));
    __classPrivateFieldGet(this, _DadsEmergencyBanner_observer, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsEmergencyBanner_observer, new MutationObserver(() => {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncTimestamp).call(this);
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncBody).call(this);
        __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAction).call(this);
    }), "f");
    __classPrivateFieldGet(this, _DadsEmergencyBanner_observer, "f").observe(this, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['slot', 'hidden', 'aria-label', 'aria-labelledby', 'id'],
    });
}, _DadsEmergencyBanner_syncAll = function _DadsEmergencyBanner_syncAll() {
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncHeading).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncPrefix).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncTargetAttribute).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncTimestamp).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncBody).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_syncAction).call(this);
}, _DadsEmergencyBanner_normalizeHeadingLevel = function _DadsEmergencyBanner_normalizeHeadingLevel() {
    const raw = this.getAttribute('heading-level');
    if (!raw) {
        this.setAttribute('heading-level', '2');
        return '2';
    }
    const normalized = raw.trim().toLowerCase();
    const valid = VALID_HEADING_LEVELS.has(normalized) ? normalized : '2';
    if (raw !== valid)
        this.setAttribute('heading-level', valid);
    return valid;
}, _DadsEmergencyBanner_normalizePrefixMode = function _DadsEmergencyBanner_normalizePrefixMode() {
    const raw = this.getAttribute('prefix-mode');
    if (!raw) {
        this.setAttribute('prefix-mode', 'auto');
        return 'auto';
    }
    const normalized = raw.trim().toLowerCase();
    const valid = VALID_PREFIX_MODES.has(normalized) ? normalized : 'auto';
    if (raw !== valid)
        this.setAttribute('prefix-mode', valid);
    return valid;
}, _DadsEmergencyBanner_normalizePrefixLabel = function _DadsEmergencyBanner_normalizePrefixLabel() {
    const raw = this.getAttribute('prefix-label');
    const normalized = raw?.trim() ?? '';
    if (!normalized) {
        if (raw !== '【緊急】')
            this.setAttribute('prefix-label', '【緊急】');
        return '【緊急】';
    }
    if (raw !== normalized)
        this.setAttribute('prefix-label', normalized);
    return normalized;
}, _DadsEmergencyBanner_normalizeTarget = function _DadsEmergencyBanner_normalizeTarget() {
    const raw = this.getAttribute('target');
    if (!raw) {
        this.setAttribute('target', '_self');
        return '_self';
    }
    const normalized = raw.trim().toLowerCase();
    const valid = VALID_TARGETS.has(normalized) ? normalized : '_self';
    if (raw !== valid)
        this.setAttribute('target', valid);
    return valid;
}, _DadsEmergencyBanner_syncHeading = function _DadsEmergencyBanner_syncHeading() {
    const level = __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_normalizeHeadingLevel).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_heading, "f")?.setAttribute('aria-level', level);
}, _DadsEmergencyBanner_syncTargetAttribute = function _DadsEmergencyBanner_syncTargetAttribute() {
    __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_normalizeTarget).call(this);
}, _DadsEmergencyBanner_syncPrefix = function _DadsEmergencyBanner_syncPrefix() {
    if (!__classPrivateFieldGet(this, _DadsEmergencyBanner_prefix, "f"))
        return;
    const mode = __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_normalizePrefixMode).call(this);
    __classPrivateFieldGet(this, _DadsEmergencyBanner_prefix, "f").hidden = mode === 'manual';
    __classPrivateFieldGet(this, _DadsEmergencyBanner_prefix, "f").textContent = __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_normalizePrefixLabel).call(this);
}, _DadsEmergencyBanner_syncTimestamp = function _DadsEmergencyBanner_syncTimestamp() {
    if (!__classPrivateFieldGet(this, _DadsEmergencyBanner_timestamp, "f"))
        return;
    __classPrivateFieldGet(this, _DadsEmergencyBanner_timestamp, "f").hidden = !__classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_hasMeaningfulSlotContent).call(this, __classPrivateFieldGet(this, _DadsEmergencyBanner_timestampSlot, "f"));
}, _DadsEmergencyBanner_syncBody = function _DadsEmergencyBanner_syncBody() {
    if (!__classPrivateFieldGet(this, _DadsEmergencyBanner_body, "f"))
        return;
    __classPrivateFieldGet(this, _DadsEmergencyBanner_body, "f").hidden = !__classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_hasMeaningfulSlotContent).call(this, __classPrivateFieldGet(this, _DadsEmergencyBanner_bodySlot, "f"));
}, _DadsEmergencyBanner_syncAction = function _DadsEmergencyBanner_syncAction() {
    if (!__classPrivateFieldGet(this, _DadsEmergencyBanner_action, "f") || !__classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f") || !__classPrivateFieldGet(this, _DadsEmergencyBanner_actionIcon, "f"))
        return;
    const href = (this.getAttribute('href') ?? '').trim();
    const hasHref = href.length > 0;
    const hasActionLabel = __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_hasMeaningfulSlotContent).call(this, __classPrivateFieldGet(this, _DadsEmergencyBanner_actionSlot, "f"));
    const shouldShowAction = hasHref && hasActionLabel;
    __classPrivateFieldGet(this, _DadsEmergencyBanner_action, "f").hidden = !shouldShowAction;
    if (!shouldShowAction) {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('href');
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('target');
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('rel');
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('aria-label');
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionIcon, "f").hidden = true;
        return;
    }
    __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").setAttribute('href', isSafeHref(href) ? href : '#');
    const target = __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_normalizeTarget).call(this);
    if (target === '_blank') {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").setAttribute('target', '_blank');
    }
    else {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('target');
    }
    const rawRel = (this.getAttribute('rel') ?? '').trim();
    const effectiveRel = target === '_blank' ? rawRel || 'noopener noreferrer' : rawRel;
    if (effectiveRel) {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").setAttribute('rel', effectiveRel);
    }
    else {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('rel');
    }
    const actionLabelText = __classPrivateFieldGet(this, _DadsEmergencyBanner_instances, "m", _DadsEmergencyBanner_readActionLabelText).call(this);
    if (target === '_blank' && actionLabelText) {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").setAttribute('aria-label', `${actionLabelText}（${NEW_TAB_ANNOUNCEMENT}）`);
    }
    else {
        __classPrivateFieldGet(this, _DadsEmergencyBanner_actionLink, "f").removeAttribute('aria-label');
    }
    __classPrivateFieldGet(this, _DadsEmergencyBanner_actionIcon, "f").hidden = target !== '_blank';
}, _DadsEmergencyBanner_hasMeaningfulSlotContent = function _DadsEmergencyBanner_hasMeaningfulSlotContent(slot) {
    if (!slot)
        return false;
    const nodes = slot.assignedNodes({ flatten: true });
    return nodes.some((node) => isMeaningfulNode(node));
}, _DadsEmergencyBanner_readActionLabelText = function _DadsEmergencyBanner_readActionLabelText() {
    if (!__classPrivateFieldGet(this, _DadsEmergencyBanner_actionSlot, "f"))
        return '';
    const text = __classPrivateFieldGet(this, _DadsEmergencyBanner_actionSlot, "f")
        .assignedNodes({ flatten: true })
        .map((node) => getNodeAccessibleText(node))
        .filter((segment) => segment.length > 0)
        .join(' ')
        .trim();
    return text.replace(/\s+/g, ' ');
};
DadsEmergencyBanner.definition = {
    name: 'dads-emergency-banner',
    template: html `
      <div part="base" id="base" role="region" aria-labelledby="heading">
        <div part="header" id="header">
          <div part="heading" id="heading" role="heading" aria-level="2">
            <span part="prefix" id="prefix">【緊急】</span>
            <slot name="heading" id="heading-slot">緊急情報</slot>
          </div>
          <div part="timestamp" id="timestamp" hidden>
            <slot name="timestamp" id="timestamp-slot"></slot>
          </div>
        </div>

        <div part="body" id="body" hidden>
          <slot id="body-slot"></slot>
        </div>

        <div part="action" id="action" hidden>
          <a part="action-link" id="action-link">
            <span part="action-label" id="action-label">
              <slot name="action" id="action-slot"></slot>
            </span>
            <span part="action-icon" id="action-icon" hidden>
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                <path d="M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z" fill="currentcolor"></path>
              </svg>
            </span>
          </a>
        </div>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), emergencyBannerTokens, emergencyBannerStyles], 'minimal'),
    attributes: [
        PropertyAttr('headingLevel', 'heading-level'),
        PropertyAttr('prefixMode', 'prefix-mode'),
        PropertyAttr('prefixLabel', 'prefix-label'),
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
    ],
};
