/**
 * @module description-list
 * デジタル庁デザインシステム Description List コンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _DadsDescriptionList_instances, _DadsDescriptionList_isSyncing, _DadsDescriptionList_isStructuring, _DadsDescriptionList_structureObserver, _DadsDescriptionList_syncInitialMarker, _DadsDescriptionList_ensureDefinitionListStructure, _DadsDescriptionList_observeStructureChanges, _DadsDescriptionList_findOrCreateBaseList, _DadsDescriptionList_syncBasePart, _DadsDescriptionList_syncMarker, _DadsDescriptionList_setAttributeIfChanged;
import { PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { createDescriptionListTokens } from './description-list-tokens.js';
import { createDescriptionListStyles } from './description-list-styles.js';
const VALID_MARKERS = ['none', 'bullet', 'custom'];
const DEFAULT_MARKER = 'none';
const MARKER_ATTR = 'marker';
const DATA_MARKER_ATTR = 'data-marker';
const BASE_ATTR = 'data-dads-description-list-base';
function normalizeMarker(value) {
    if (!value)
        return DEFAULT_MARKER;
    const trimmed = value.trim().toLowerCase();
    return VALID_MARKERS.includes(trimmed)
        ? trimmed
        : DEFAULT_MARKER;
}
/**
 * 説明リストコンポーネント
 *
 * DADS HTML 実装と互換の `dt` / `dd` 構造を受け入れる light DOM コンポーネント。
 *
 * @customElement dads-description-list
 * @tagname dads-description-list
 *
 * @slot default - 説明リスト項目（例: div > dt + dd）
 *
 * @attr {'none' | 'bullet' | 'custom'} marker - マーカー表示種別
 * @attr {'none' | 'bullet' | 'custom'} data-marker - DADS HTML 互換属性（marker と同期）
 *
 * @cssprop --dads-description-list-margin-block - ブロック方向マージン
 * @cssprop --dads-description-list-item-gap - 項目間の行間
 * @cssprop --dads-description-list-indent - dt/dd のインデント
 * @cssprop --dads-description-list-term-font-weight - 用語（dt）の文字ウェイト
 * @cssprop --dads-description-list-overflow-wrap - 折り返し規則
 *
 * @example
 * ```html
 * <dads-description-list marker="none">
 *   <div>
 *     <dt>項目名1</dt>
 *     <dd>これは項目1の説明文です。</dd>
 *   </div>
 *   <div>
 *     <dt>項目名2</dt>
 *     <dd>これは項目2の説明文です。</dd>
 *   </div>
 * </dads-description-list>
 * ```
 */
export class DadsDescriptionList extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsDescriptionList_instances.add(this);
        _DadsDescriptionList_isSyncing.set(this, false);
        _DadsDescriptionList_isStructuring.set(this, false);
        _DadsDescriptionList_structureObserver.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_ensureDefinitionListStructure).call(this);
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_observeStructureChanges).call(this);
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncInitialMarker).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsDescriptionList_structureObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsDescriptionList_structureObserver, null, "f");
        super.disconnectedCallback();
    }
    markerChanged(_oldValue, newValue) {
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncMarker).call(this, MARKER_ATTR, newValue);
    }
    dataMarkerChanged(_oldValue, newValue) {
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncMarker).call(this, DATA_MARKER_ATTR, newValue);
    }
}
_DadsDescriptionList_isSyncing = new WeakMap(), _DadsDescriptionList_isStructuring = new WeakMap(), _DadsDescriptionList_structureObserver = new WeakMap(), _DadsDescriptionList_instances = new WeakSet(), _DadsDescriptionList_syncInitialMarker = function _DadsDescriptionList_syncInitialMarker() {
    if (this.hasAttribute(MARKER_ATTR)) {
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncMarker).call(this, MARKER_ATTR, this.getAttribute(MARKER_ATTR));
        return;
    }
    if (this.hasAttribute(DATA_MARKER_ATTR)) {
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncMarker).call(this, DATA_MARKER_ATTR, this.getAttribute(DATA_MARKER_ATTR));
        return;
    }
    __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncMarker).call(this, MARKER_ATTR, DEFAULT_MARKER);
}, _DadsDescriptionList_ensureDefinitionListStructure = function _DadsDescriptionList_ensureDefinitionListStructure() {
    if (__classPrivateFieldGet(this, _DadsDescriptionList_isStructuring, "f"))
        return;
    __classPrivateFieldSet(this, _DadsDescriptionList_isStructuring, true, "f");
    try {
        const base = __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_findOrCreateBaseList).call(this);
        const nodesToMove = Array.from(this.childNodes).filter((node) => node !== base);
        if (nodesToMove.length > 0)
            base.append(...nodesToMove);
        __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_syncBasePart).call(this, base);
    }
    finally {
        __classPrivateFieldSet(this, _DadsDescriptionList_isStructuring, false, "f");
    }
}, _DadsDescriptionList_observeStructureChanges = function _DadsDescriptionList_observeStructureChanges() {
    if (typeof MutationObserver === 'undefined' || __classPrivateFieldGet(this, _DadsDescriptionList_structureObserver, "f"))
        return;
    __classPrivateFieldSet(this, _DadsDescriptionList_structureObserver, new MutationObserver((mutations) => {
        if (__classPrivateFieldGet(this, _DadsDescriptionList_isStructuring, "f"))
            return;
        for (const mutation of mutations) {
            if (mutation.type !== 'childList')
                continue;
            if (mutation.target !== this)
                continue;
            if (mutation.addedNodes.length === 0 && mutation.removedNodes.length === 0)
                continue;
            __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_ensureDefinitionListStructure).call(this);
            break;
        }
    }), "f");
    __classPrivateFieldGet(this, _DadsDescriptionList_structureObserver, "f").observe(this, { childList: true });
}, _DadsDescriptionList_findOrCreateBaseList = function _DadsDescriptionList_findOrCreateBaseList() {
    const existing = Array.from(this.children).find((el) => el.tagName.toLowerCase() === 'dl');
    if (existing)
        return existing;
    const created = document.createElement('dl');
    this.append(created);
    return created;
}, _DadsDescriptionList_syncBasePart = function _DadsDescriptionList_syncBasePart(base) {
    base.setAttribute(BASE_ATTR, '');
    const part = new Set((base.getAttribute('part') ?? '').split(/\s+/).filter(Boolean));
    part.add('base');
    base.setAttribute('part', Array.from(part).join(' '));
}, _DadsDescriptionList_syncMarker = function _DadsDescriptionList_syncMarker(source, value) {
    if (__classPrivateFieldGet(this, _DadsDescriptionList_isSyncing, "f"))
        return;
    const normalized = normalizeMarker(value);
    const attrs = source === MARKER_ATTR
        ? [MARKER_ATTR, DATA_MARKER_ATTR]
        : [DATA_MARKER_ATTR, MARKER_ATTR];
    __classPrivateFieldSet(this, _DadsDescriptionList_isSyncing, true, "f");
    try {
        for (const attr of attrs)
            __classPrivateFieldGet(this, _DadsDescriptionList_instances, "m", _DadsDescriptionList_setAttributeIfChanged).call(this, attr, normalized);
    }
    finally {
        __classPrivateFieldSet(this, _DadsDescriptionList_isSyncing, false, "f");
    }
}, _DadsDescriptionList_setAttributeIfChanged = function _DadsDescriptionList_setAttributeIfChanged(name, value) {
    if (this.getAttribute(name) !== value)
        this.setAttribute(name, value);
};
DadsDescriptionList.version = '1.0.0';
DadsDescriptionList.definition = {
    name: 'dads-description-list',
    shadowOptions: null,
    styles: [
        createDescriptionListTokens('dads-description-list'),
        createDescriptionListStyles('dads-description-list'),
    ],
    attributes: [
        PropertyAttr('marker'),
        PropertyAttr('dataMarker', 'data-marker'),
    ],
};
