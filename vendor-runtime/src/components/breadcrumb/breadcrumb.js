/**
 * @module breadcrumb
 * デジタル庁デザインシステム 現在位置ナビゲーション（パンくず）コンポーネント
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
var _DadsBreadcrumb_instances, _DadsBreadcrumb_itemsSlot, _DadsBreadcrumb_label, _DadsBreadcrumb_observer, _DadsBreadcrumb_isSyncing, _DadsBreadcrumb_labelId, _DadsBreadcrumb_handleSlotChange, _DadsBreadcrumb_handleMutations, _DadsBreadcrumb_startObservingMutations, _DadsBreadcrumb_getItemTagName, _DadsBreadcrumb_getItems, _DadsBreadcrumb_syncAll, _DadsBreadcrumb_syncNavLabel, _DadsBreadcrumb_syncItems, _DadsBreadcrumb_syncStructuredData, _DadsBreadcrumb_ensureStructuredDataMirror, _DadsBreadcrumb_removeStructuredDataMirror, _DadsBreadcrumb_readStructuredDataName, _DadsBreadcrumb_resolveStructuredDataUrl, _DadsBreadcrumbItem_instances, _DadsBreadcrumbItem_link, _DadsBreadcrumbItem_current, _DadsBreadcrumbItem_separator, _DadsBreadcrumbItem_separatorIcon, _DadsBreadcrumbItem_separatorText, _DadsBreadcrumbItem_homeIcon, _DadsBreadcrumbItem_contentSlot, _DadsBreadcrumbItem_handleSlotChange, _DadsBreadcrumbItem_isCurrent, _DadsBreadcrumbItem_sync, _DadsBreadcrumbItem_readAssignedText;
import { html, BooleanAttr, PropertyAttr, TransferringPropertyAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { breadcrumbTokens, breadcrumbSemanticTokens } from './breadcrumb-tokens.js';
import { breadcrumbStyles, breadcrumbItemStyles } from './breadcrumb-styles.js';
let labelIdSeed = 0;
function getRef(host, id) {
    const el = host.refs?.[id];
    return el instanceof Element ? el : null;
}
function normalizeStructuredDataMode(value) {
    return value === 'microdata' ? 'microdata' : 'off';
}
function normalizeSeparator(value) {
    if (value === 'slash' || value === 'pipe')
        return value;
    return 'chevron';
}
function normalizeText(value) {
    if (!value)
        return '';
    return value.replace(/\s+/g, ' ').trim();
}
function isExplicitCurrent(item) {
    return item.hasAttribute('current') || item.getAttribute('aria-current') === 'page';
}
function setOrRemoveAttribute(el, name, value) {
    if (value) {
        el.setAttribute(name, value);
        return;
    }
    el.removeAttribute(name);
}
const BREADCRUMB_OBSERVER_OPTIONS = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['current', 'aria-current', 'href', 'home'],
};
/**
 * 現在位置ナビゲーション（パンくず）コンテナ
 *
 * @customElement dads-breadcrumb
 * @tagname dads-breadcrumb
 *
 * @slot default - dads-breadcrumb-item 群
 * @slot label - ナビゲーションラベル（デフォルト: 現在位置）
 *
 * @csspart nav - ナビゲーションルート（nav要素）
 * @csspart label - ナビゲーションラベル
 * @csspart list - パンくず一覧（p要素）
 *
 * @attr {boolean} show-label - ラベルを視覚表示する
 * @attr {'chevron' | 'slash' | 'pipe'} separator - 区切り表示種別
 * @attr {'off' | 'microdata'} structured-data - 構造化データ出力モード
 * @attr {string} base-url - 構造化データURL解決用ベースURL
 * @attr {string} aria-label - ナビゲーションのラベル
 * @attr {string} aria-labelledby - ナビゲーションラベルの参照先ID
 */
export class DadsBreadcrumb extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsBreadcrumb_instances.add(this);
        _DadsBreadcrumb_itemsSlot.set(this, null);
        _DadsBreadcrumb_label.set(this, null);
        _DadsBreadcrumb_observer.set(this, null);
        _DadsBreadcrumb_isSyncing.set(this, false);
        _DadsBreadcrumb_labelId.set(this, '');
        _DadsBreadcrumb_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
        });
        _DadsBreadcrumb_handleMutations.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsBreadcrumb_isSyncing, "f"))
                return;
            __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsBreadcrumb_itemsSlot, getRef(this, 'items-slot'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumb_label, getRef(this, 'label'), "f");
        __classPrivateFieldGet(this, _DadsBreadcrumb_itemsSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsBreadcrumb_handleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsBreadcrumb_observer, new MutationObserver(__classPrivateFieldGet(this, _DadsBreadcrumb_handleMutations, "f")), "f");
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_startObservingMutations).call(this);
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsBreadcrumb_itemsSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsBreadcrumb_handleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsBreadcrumb_itemsSlot, null, "f");
        __classPrivateFieldGet(this, _DadsBreadcrumb_observer, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsBreadcrumb_observer, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumb_label, null, "f");
        super.disconnectedCallback();
    }
    structuredDataChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
    }
    separatorChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
    }
    baseUrlChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
    }
    ariaLabelChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
    }
    ariaLabelledbyChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncAll).call(this);
    }
}
_DadsBreadcrumb_itemsSlot = new WeakMap(), _DadsBreadcrumb_label = new WeakMap(), _DadsBreadcrumb_observer = new WeakMap(), _DadsBreadcrumb_isSyncing = new WeakMap(), _DadsBreadcrumb_labelId = new WeakMap(), _DadsBreadcrumb_handleSlotChange = new WeakMap(), _DadsBreadcrumb_handleMutations = new WeakMap(), _DadsBreadcrumb_instances = new WeakSet(), _DadsBreadcrumb_startObservingMutations = function _DadsBreadcrumb_startObservingMutations() {
    if (!__classPrivateFieldGet(this, _DadsBreadcrumb_observer, "f") || !this.isConnected)
        return;
    __classPrivateFieldGet(this, _DadsBreadcrumb_observer, "f").observe(this, BREADCRUMB_OBSERVER_OPTIONS);
}, _DadsBreadcrumb_getItemTagName = function _DadsBreadcrumb_getItemTagName() {
    const tag = this.localName;
    return tag.endsWith('-breadcrumb') ? `${tag}-item` : 'dads-breadcrumb-item';
}, _DadsBreadcrumb_getItems = function _DadsBreadcrumb_getItems() {
    const itemTag = __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_getItemTagName).call(this);
    const items = [];
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (child.tagName.toLowerCase() !== itemTag)
            continue;
        items.push(child);
    }
    return items;
}, _DadsBreadcrumb_syncAll = function _DadsBreadcrumb_syncAll() {
    __classPrivateFieldGet(this, _DadsBreadcrumb_observer, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsBreadcrumb_isSyncing, true, "f");
    try {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncNavLabel).call(this);
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncItems).call(this);
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_syncStructuredData).call(this);
    }
    finally {
        __classPrivateFieldSet(this, _DadsBreadcrumb_isSyncing, false, "f");
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_startObservingMutations).call(this);
    }
}, _DadsBreadcrumb_syncNavLabel = function _DadsBreadcrumb_syncNavLabel() {
    const nav = getRef(this, 'nav');
    const label = __classPrivateFieldGet(this, _DadsBreadcrumb_label, "f") ?? getRef(this, 'label');
    if (!nav || !label)
        return;
    if (!__classPrivateFieldGet(this, _DadsBreadcrumb_labelId, "f")) {
        labelIdSeed += 1;
        __classPrivateFieldSet(this, _DadsBreadcrumb_labelId, `${this.localName}-label-${labelIdSeed}`, "f");
    }
    label.id = __classPrivateFieldGet(this, _DadsBreadcrumb_labelId, "f");
    const hasHostLabel = this.hasAttribute('aria-label') || this.hasAttribute('aria-labelledby');
    if (hasHostLabel) {
        if (nav.getAttribute('aria-labelledby') === __classPrivateFieldGet(this, _DadsBreadcrumb_labelId, "f")) {
            nav.removeAttribute('aria-labelledby');
        }
        return;
    }
    nav.setAttribute('aria-labelledby', __classPrivateFieldGet(this, _DadsBreadcrumb_labelId, "f"));
}, _DadsBreadcrumb_syncItems = function _DadsBreadcrumb_syncItems() {
    const items = __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_getItems).call(this);
    const total = items.length;
    const separator = normalizeSeparator(this.getAttribute('separator'));
    if (total === 0)
        return;
    const explicitCurrentIndex = items.findIndex(item => isExplicitCurrent(item));
    const currentIndex = explicitCurrentIndex >= 0 ? explicitCurrentIndex : total - 1;
    for (let i = 0; i < total; i++) {
        const item = items[i];
        const isCurrent = i === currentIndex;
        item.toggleAttribute('current', isCurrent);
        if (isCurrent)
            item.setAttribute('aria-current', 'page');
        else
            item.removeAttribute('aria-current');
        if (!item.hasAttribute('role'))
            item.setAttribute('role', 'listitem');
        item.setAttribute('aria-posinset', String(i + 1));
        item.setAttribute('aria-setsize', String(total));
        if (item.getAttribute('data-separator-style') !== separator) {
            item.setAttribute('data-separator-style', separator);
        }
    }
}, _DadsBreadcrumb_syncStructuredData = function _DadsBreadcrumb_syncStructuredData() {
    const mode = normalizeStructuredDataMode(this.getAttribute('structured-data'));
    if (mode === 'off') {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_removeStructuredDataMirror).call(this);
        return;
    }
    const items = __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_getItems).call(this);
    if (items.length === 0) {
        __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_removeStructuredDataMirror).call(this);
        return;
    }
    const mirror = __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_ensureStructuredDataMirror).call(this);
    if (!mirror)
        return;
    mirror.replaceChildren();
    const root = document.createElement('div');
    root.setAttribute('itemscope', '');
    root.setAttribute('itemtype', 'https://schema.org/BreadcrumbList');
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const name = __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_readStructuredDataName).call(this, item);
        if (!name)
            continue;
        const listItemEl = document.createElement('span');
        listItemEl.setAttribute('itemprop', 'itemListElement');
        listItemEl.setAttribute('itemscope', '');
        listItemEl.setAttribute('itemtype', 'https://schema.org/ListItem');
        const resolvedUrl = __classPrivateFieldGet(this, _DadsBreadcrumb_instances, "m", _DadsBreadcrumb_resolveStructuredDataUrl).call(this, item.getAttribute('href'));
        if (resolvedUrl) {
            const link = document.createElement('a');
            link.setAttribute('itemprop', 'item');
            link.href = resolvedUrl;
            const nameEl = document.createElement('span');
            nameEl.setAttribute('itemprop', 'name');
            nameEl.textContent = name;
            link.appendChild(nameEl);
            listItemEl.appendChild(link);
        }
        else {
            const nameEl = document.createElement('span');
            nameEl.setAttribute('itemprop', 'name');
            nameEl.textContent = name;
            listItemEl.appendChild(nameEl);
        }
        const position = document.createElement('meta');
        position.setAttribute('itemprop', 'position');
        position.content = String(i + 1);
        listItemEl.appendChild(position);
        root.appendChild(listItemEl);
    }
    mirror.appendChild(root);
}, _DadsBreadcrumb_ensureStructuredDataMirror = function _DadsBreadcrumb_ensureStructuredDataMirror() {
    const selector = ':scope > [data-breadcrumb-structured-data]';
    const existing = this.querySelector(selector);
    if (existing instanceof HTMLElement)
        return existing;
    const mirror = document.createElement('div');
    mirror.setAttribute('data-breadcrumb-structured-data', '');
    mirror.setAttribute('slot', 'structured-data');
    mirror.setAttribute('hidden', '');
    mirror.setAttribute('aria-hidden', 'true');
    this.appendChild(mirror);
    return mirror;
}, _DadsBreadcrumb_removeStructuredDataMirror = function _DadsBreadcrumb_removeStructuredDataMirror() {
    const mirror = this.querySelector(':scope > [data-breadcrumb-structured-data]');
    if (mirror instanceof HTMLElement)
        mirror.remove();
}, _DadsBreadcrumb_readStructuredDataName = function _DadsBreadcrumb_readStructuredDataName(item) {
    const fromMethod = item.getStructuredDataName?.();
    if (fromMethod)
        return normalizeText(fromMethod);
    return normalizeText(item.textContent);
}, _DadsBreadcrumb_resolveStructuredDataUrl = function _DadsBreadcrumb_resolveStructuredDataUrl(href) {
    if (!href)
        return null;
    const absolute = href.trim();
    if (absolute.length === 0)
        return null;
    try {
        return new URL(absolute).href;
    }
    catch {
        // continue
    }
    const base = this.getAttribute('base-url')?.trim() || document.baseURI;
    try {
        return new URL(absolute, base).href;
    }
    catch {
        return null;
    }
};
DadsBreadcrumb.version = '0.1.0';
DadsBreadcrumb.definition = {
    name: 'dads-breadcrumb',
    template: html `
      <nav part="nav" id="nav">
        <span part="label" id="label">
          <slot name="label" id="label-slot">現在位置</slot>
        </span>
        <p part="list" id="list" role="list">
          <slot id="items-slot"></slot>
        </p>
      </nav>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        breadcrumbTokens,
        breadcrumbStyles,
    ], 'minimal'),
    attributes: [
        BooleanAttr('showLabel', 'show-label'),
        PropertyAttr('separator'),
        PropertyAttr('structuredData', 'structured-data'),
        PropertyAttr('baseUrl', 'base-url'),
        TransferringPropertyAttr('nav', 'ariaLabel', 'aria-label'),
        TransferringPropertyAttr('nav', 'ariaLabelledby', 'aria-labelledby'),
    ],
};
/**
 * 現在位置ナビゲーション（パンくず）項目
 *
 * @customElement dads-breadcrumb-item
 * @tagname dads-breadcrumb-item
 *
 * @slot default - 項目テキスト
 *
 * @csspart item - アイテムルート（p要素）
 * @csspart home-icon - ホームアイコン
 * @csspart link - 非現在項目リンク
 * @csspart current - 現在項目テキスト
 * @csspart separator - 区切り
 * @csspart separator-icon - 区切りアイコン
 * @csspart separator-text - 区切りテキスト（slash / pipe）
 *
 * @attr {string} href - リンク先URL
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {boolean} current - 現在ページ
 * @attr {boolean} home - ホームアイコン表示
 * @attr {string} aria-current - 現在位置（page）
 */
export class DadsBreadcrumbItem extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsBreadcrumbItem_instances.add(this);
        _DadsBreadcrumbItem_link.set(this, null);
        _DadsBreadcrumbItem_current.set(this, null);
        _DadsBreadcrumbItem_separator.set(this, null);
        _DadsBreadcrumbItem_separatorIcon.set(this, null);
        _DadsBreadcrumbItem_separatorText.set(this, null);
        _DadsBreadcrumbItem_homeIcon.set(this, null);
        _DadsBreadcrumbItem_contentSlot.set(this, null);
        _DadsBreadcrumbItem_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_link, getRef(this, 'link'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_current, getRef(this, 'current'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_separator, getRef(this, 'separator'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_separatorIcon, getRef(this, 'separator-icon'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_separatorText, getRef(this, 'separator-text'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_homeIcon, getRef(this, 'home-icon'), "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_contentSlot, getRef(this, 'content-slot'), "f");
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_contentSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsBreadcrumbItem_handleSlotChange, "f"));
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'listitem');
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_contentSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsBreadcrumbItem_handleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_contentSlot, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_link, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_current, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_separator, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_separatorIcon, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_separatorText, null, "f");
        __classPrivateFieldSet(this, _DadsBreadcrumbItem_homeIcon, null, "f");
        super.disconnectedCallback();
    }
    hrefChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    targetChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    relChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    currentChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    homeChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    separatorStyleChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    ariaCurrentChanged() {
        __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_sync).call(this);
    }
    getStructuredDataName() {
        const text = __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_readAssignedText).call(this);
        return text.length > 0 ? text : null;
    }
}
_DadsBreadcrumbItem_link = new WeakMap(), _DadsBreadcrumbItem_current = new WeakMap(), _DadsBreadcrumbItem_separator = new WeakMap(), _DadsBreadcrumbItem_separatorIcon = new WeakMap(), _DadsBreadcrumbItem_separatorText = new WeakMap(), _DadsBreadcrumbItem_homeIcon = new WeakMap(), _DadsBreadcrumbItem_contentSlot = new WeakMap(), _DadsBreadcrumbItem_handleSlotChange = new WeakMap(), _DadsBreadcrumbItem_instances = new WeakSet(), _DadsBreadcrumbItem_isCurrent = function _DadsBreadcrumbItem_isCurrent() {
    return isExplicitCurrent(this);
}, _DadsBreadcrumbItem_sync = function _DadsBreadcrumbItem_sync() {
    const link = __classPrivateFieldGet(this, _DadsBreadcrumbItem_link, "f") ?? getRef(this, 'link');
    const current = __classPrivateFieldGet(this, _DadsBreadcrumbItem_current, "f") ?? getRef(this, 'current');
    const separator = __classPrivateFieldGet(this, _DadsBreadcrumbItem_separator, "f") ?? getRef(this, 'separator');
    const separatorIcon = __classPrivateFieldGet(this, _DadsBreadcrumbItem_separatorIcon, "f") ?? getRef(this, 'separator-icon');
    const separatorText = __classPrivateFieldGet(this, _DadsBreadcrumbItem_separatorText, "f") ?? getRef(this, 'separator-text');
    const homeIcon = __classPrivateFieldGet(this, _DadsBreadcrumbItem_homeIcon, "f") ?? getRef(this, 'home-icon');
    if (!link || !current || !separator || !separatorIcon || !separatorText || !homeIcon)
        return;
    const href = this.getAttribute('href');
    const isCurrent = __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_isCurrent).call(this);
    const separatorStyle = normalizeSeparator(this.getAttribute('data-separator-style'));
    homeIcon.toggleAttribute('hidden', !this.hasAttribute('home'));
    const showChevron = separatorStyle === 'chevron';
    separatorIcon.toggleAttribute('hidden', !showChevron);
    separatorText.toggleAttribute('hidden', showChevron);
    separatorText.textContent = showChevron ? '' : (separatorStyle === 'pipe' ? '|' : '/');
    if (!isCurrent && href) {
        link.hidden = false;
        link.setAttribute('href', href);
        setOrRemoveAttribute(link, 'target', this.getAttribute('target'));
        setOrRemoveAttribute(link, 'rel', this.getAttribute('rel'));
        current.hidden = true;
        current.textContent = '';
    }
    else {
        link.hidden = true;
        link.removeAttribute('href');
        link.removeAttribute('target');
        link.removeAttribute('rel');
        current.hidden = false;
        current.textContent = __classPrivateFieldGet(this, _DadsBreadcrumbItem_instances, "m", _DadsBreadcrumbItem_readAssignedText).call(this);
    }
    separator.hidden = isCurrent;
}, _DadsBreadcrumbItem_readAssignedText = function _DadsBreadcrumbItem_readAssignedText() {
    const slot = __classPrivateFieldGet(this, _DadsBreadcrumbItem_contentSlot, "f") ?? getRef(this, 'content-slot');
    if (!slot)
        return normalizeText(this.textContent);
    const text = slot
        .assignedNodes({ flatten: true })
        .map(node => node.textContent ?? '')
        .join('');
    return normalizeText(text);
};
DadsBreadcrumbItem.version = '0.1.0';
DadsBreadcrumbItem.definition = {
    name: 'dads-breadcrumb-item',
    template: html `
      <p part="item" id="item">
        <span part="home-icon" id="home-icon" aria-hidden="true" hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 13.666V6.166L7.99998 2.4032L12.99997 6.166V13.666H9.26922V9.20443H6.73075V13.666H3Z" fill="currentColor"></path>
          </svg>
        </span>

        <a part="link" id="link">
          <slot id="content-slot"></slot>
        </a>

        <span part="current" id="current" hidden></span>

        <span part="separator" id="separator" aria-hidden="true">
          <svg part="separator-icon" id="separator-icon" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M4.5 10.5L4 10L8 6L4 2L4.5 1.5L9.05 6L4.5 10.5Z" fill="currentColor"></path>
          </svg>
          <span part="separator-text" id="separator-text" hidden></span>
        </span>
      </p>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        breadcrumbSemanticTokens,
        breadcrumbItemStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        BooleanAttr('current'),
        BooleanAttr('home'),
        PropertyAttr('separatorStyle', 'data-separator-style'),
        PropertyAttr('ariaCurrent', 'aria-current'),
    ],
};
