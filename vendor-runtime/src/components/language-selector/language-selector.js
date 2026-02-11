/**
 * @module language-selector
 * デジタル庁デザインシステム Language Selector
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
var _DadsLanguageSelector_instances, _DadsLanguageSelector_iconSlot, _DadsLanguageSelector_labelSlot, _DadsLanguageSelector_itemsObserver, _DadsLanguageSelector_isSyncing, _DadsLanguageSelector_isSyncingAutoLabel, _DadsLanguageSelector_autoLabelManaged, _DadsLanguageSelector_findCurrentItemIndex, _DadsLanguageSelector_removeElements, _DadsLanguageSelector_removeDuplicateAutoElements, _DadsLanguageSelector_getAutoCheckIcons, _DadsLanguageSelector_hasCustomStartIcon, _DadsLanguageSelector_hasCustomLabelSlotContent, _DadsLanguageSelector_syncOpenerIcon, _DadsLanguageSelector_syncMenuItems, _DadsLanguageSelector_normalizeCurrentSelection, _DadsLanguageSelector_syncSelectionCheckIcons, _DadsLanguageSelector_getMenuItems, _DadsLanguageSelector_handleSlotChange, _DadsLanguageSelector_handleItemsMutation, _DadsLanguageSelector_handleMenuItemSelect, _DadsLanguageSelector_syncAll, _DadsLanguageSelector_startObservingItems, _DadsLanguageSelector_getNormalizedOpener, _DadsLanguageSelector_syncOpenerLabel, _DadsLanguageSelector_syncMenuItemDefaults, _DadsLanguageSelector_applyCurrentSelection, _DadsLanguageSelector_resolveSelectedValue;
import { PropertyAttr } from '../../core/web-components.js';
import { isNotWhitespace } from '../../utils/dom.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { DadsMenuListBox } from '../menu-list-box/menu-list-box.js';
import { languageSelectorStyles } from './language-selector-styles.js';
import { languageSelectorTokens } from './language-selector-tokens.js';
const AUTO_OPENER_ICON_ATTR = 'data-language-selector-auto-opener-icon';
const AUTO_CHECK_ICON_ATTR = 'data-language-selector-auto-check-icon';
const AUTO_ITEM_SIZE_ATTR = 'data-language-selector-auto-item-size';
const MENU_LIST_ITEM_SUFFIX = '-menu-list-item';
const SVG_NS = 'http://www.w3.org/2000/svg';
const MENU_LIST_ITEM_DEFAULT_SIZE = 'regular';
const openerIconPath = 'M22 27.067C20.3718 27.067 18.8353 26.7549 17.3906 26.1306C15.9459 25.5065 14.6859 24.6567 13.6106 23.5814C12.5353 22.5061 11.6855 21.246 11.0613 19.8013C10.4371 18.3566 10.125 16.8202 10.125 15.192C10.125 13.551 10.4371 12.0113 11.0613 10.573C11.6855 9.13473 12.5353 7.87791 13.6106 6.80258C14.6859 5.72727 15.9459 4.87752 17.3906 4.25333C18.8353 3.62912 20.3718 3.31702 22 3.31702C23.641 3.31702 25.1806 3.62912 26.6189 4.25333C28.0572 4.87752 29.314 5.72727 30.3894 6.80258C31.4647 7.87791 32.3144 9.13473 32.9386 10.573C33.5628 12.0113 33.8749 13.551 33.8749 15.192C33.8749 16.8202 33.5628 18.3566 32.9386 19.8013C32.3144 21.246 31.4647 22.5061 30.3894 23.5814C29.314 24.6567 28.0572 25.5065 26.6189 26.1306C25.1806 26.7549 23.641 27.067 22 27.067ZM22 25.1656C22.6378 24.3194 23.1747 23.466 23.6106 22.6054C24.0465 21.7448 24.4014 20.8041 24.6755 19.7833H19.3245C19.6145 20.8362 19.9735 21.7929 20.4014 22.6535C20.8293 23.5141 21.3621 24.3514 22 25.1656ZM19.5793 24.8218C19.1002 24.1343 18.6699 23.3526 18.2885 22.4768C17.9071 21.601 17.6106 20.7032 17.399 19.7833H13.1586C13.8189 21.0814 14.7043 22.172 15.8149 23.055C16.9255 23.938 18.1803 24.5269 19.5793 24.8218ZM24.4206 24.8218C25.8196 24.5269 27.0745 23.938 28.1851 23.055C29.2956 22.172 30.1811 21.0814 30.8413 19.7833H26.6009C26.3493 20.7112 26.0328 21.6131 25.6514 22.4889C25.27 23.3647 24.8597 24.1423 24.4206 24.8218ZM12.3726 17.9084H17.0192C16.9407 17.4436 16.8838 16.9881 16.8486 16.5418C16.8133 16.0954 16.7957 15.6455 16.7957 15.192C16.7957 14.7385 16.8133 14.2885 16.8486 13.8422C16.8838 13.3959 16.9407 12.9404 17.0192 12.4756H12.3726C12.2524 12.9003 12.1602 13.3418 12.0961 13.8001C12.032 14.2585 12 14.7224 12 15.192C12 15.6615 12.032 16.1255 12.0961 16.5838C12.1602 17.0422 12.2524 17.4837 12.3726 17.9084ZM18.8942 17.9084H25.1058C25.1843 17.4436 25.2412 16.9921 25.2764 16.5538C25.3117 16.1155 25.3293 15.6615 25.3293 15.192C25.3293 14.7224 25.3117 14.2685 25.2764 13.8302C25.2412 13.3919 25.1843 12.9404 25.1058 12.4756H18.8942C18.8157 12.9404 18.7588 13.3919 18.7235 13.8302C18.6883 14.2685 18.6706 14.7224 18.6706 15.192C18.6706 15.6615 18.6883 16.1155 18.7235 16.5538C18.7588 16.9921 18.8157 17.4436 18.8942 17.9084ZM26.9807 17.9084H31.6274C31.7476 17.4837 31.8397 17.0422 31.9038 16.5838C31.9679 16.1255 32 15.6615 32 15.192C32 14.7224 31.9679 14.2585 31.9038 13.8001C31.8397 13.3418 31.7476 12.9003 31.6274 12.4756H26.9807C27.0592 12.9404 27.1161 13.3959 27.1514 13.8422C27.1866 14.2885 27.2043 14.7385 27.2043 15.192C27.2043 15.6455 27.1866 16.0954 27.1514 16.5418C27.1161 16.9881 27.0592 17.4436 26.9807 17.9084ZM26.6009 10.6007H30.8413C30.1731 9.28655 29.2936 8.19599 28.2031 7.32899C27.1125 6.46201 25.8517 5.86906 24.4206 5.55014C24.8998 6.2777 25.326 7.07338 25.6994 7.93717C26.0729 8.80097 26.3733 9.6888 26.6009 10.6007ZM19.3245 10.6007H24.6755C24.3854 9.5558 24.0204 8.59305 23.5805 7.71242C23.1406 6.83182 22.6138 6.00049 22 5.21842C21.3862 6.00049 20.8593 6.83182 20.4194 7.71242C19.9795 8.59305 19.6145 9.5558 19.3245 10.6007ZM13.1586 10.6007H17.399C17.6266 9.6888 17.9271 8.80097 18.3005 7.93717C18.6739 7.07338 19.1002 6.2777 19.5793 5.55014C18.1402 5.86906 16.8774 6.46402 15.7908 7.33502C14.7043 8.20602 13.8269 9.29457 13.1586 10.6007Z';
const checkIconPath = 'm9.5 18-5.7-5.7 1.5-1.4 4.2 4.3L18.7 6l1.4 1.4L9.5 18Z';
const baseDefinition = DadsMenuListBox.definition;
const baseStyles = Array.isArray(baseDefinition.styles)
    ? baseDefinition.styles
    : [baseDefinition.styles];
function createSvg(pathData, options) {
    const viewBox = options?.viewBox ?? '0 0 24 24';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', 'currentcolor');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    return svg;
}
function hasAriaCurrent(item) {
    const ariaCurrent = item.getAttribute('aria-current');
    return ariaCurrent !== null && ariaCurrent !== 'false';
}
function getSlottedElements(host, slotName) {
    const elements = [];
    for (const child of Array.from(host.children)) {
        if (!(child instanceof Element))
            continue;
        if (child.getAttribute('slot') !== slotName)
            continue;
        elements.push(child);
    }
    return elements;
}
function getAutoSlottedElements(host, slotName, autoAttr) {
    return getSlottedElements(host, slotName).filter((element) => element.hasAttribute(autoAttr));
}
function hasCustomSlottedElement(host, slotName, autoAttr) {
    return getSlottedElements(host, slotName).some((element) => !element.hasAttribute(autoAttr));
}
const LANGUAGE_SELECTOR_OBSERVER_OPTIONS = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['current', 'aria-current', 'slot'],
};
/**
 * ランゲージセレクターコンポーネント
 *
 * @customElement
 * @tagname dads-language-selector
 *
 * @slot default - 言語メニュー項目（dads-menu-list-item）
 * @slot icon - opener 先頭アイコン（省略時は地球アイコン）
 * @slot label - opener ラベル（省略時は opener に応じて Language/LANG）
 *
 * @csspart opener - opener ボタン
 * @csspart opener-icon - opener 先頭アイコン領域
 * @csspart opener-label - opener ラベル領域
 * @csspart opener-arrow - opener 末尾矢印アイコン
 * @csspart popup - ポップアップ領域
 * @csspart menu - role="menu" のメニュー領域
 *
 * @attr {'text' | 'icon'} opener - opener 表示タイプ（text | icon）
 * @attr {'sm' | 'md'} size - サイズ（sm=36px相当 / md=44px相当）
 * @attr {string} label - opener ラベル（slot未使用時のフォールバック）
 * @attr {boolean} open - 開閉状態
 *
 * @fires menuitemselect - 項目選択時に発火（継承）
 * @fires dads-change - 項目選択確定時に発火（detail: { value, selectedValue, selectedIndex, selectedItem }）
 *
 * @method getSelectedLanguage - 現在選択されている言語情報を返す（選択なしは null）
 */
export class DadsLanguageSelector extends DadsMenuListBox {
    constructor() {
        super(...arguments);
        _DadsLanguageSelector_instances.add(this);
        _DadsLanguageSelector_iconSlot.set(this, null);
        _DadsLanguageSelector_labelSlot.set(this, null);
        _DadsLanguageSelector_itemsObserver.set(this, null);
        _DadsLanguageSelector_isSyncing.set(this, false);
        _DadsLanguageSelector_isSyncingAutoLabel.set(this, false);
        _DadsLanguageSelector_autoLabelManaged.set(this, true);
        _DadsLanguageSelector_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncAll).call(this);
        });
        _DadsLanguageSelector_handleItemsMutation.set(this, () => {
            if (__classPrivateFieldGet(this, _DadsLanguageSelector_isSyncing, "f"))
                return;
            __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncAll).call(this);
        });
        _DadsLanguageSelector_handleMenuItemSelect.set(this, (event) => {
            const detail = event.detail;
            if (!detail)
                return;
            const selectedItem = detail.selectedItem;
            if (!(selectedItem instanceof HTMLElement))
                return;
            if (!selectedItem.localName.endsWith(MENU_LIST_ITEM_SUFFIX))
                return;
            const items = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_getMenuItems).call(this);
            if (!items.includes(selectedItem))
                return;
            __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_applyCurrentSelection).call(this, items, selectedItem);
            __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncSelectionCheckIcons).call(this, items, selectedItem);
            const selectedValue = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_resolveSelectedValue).call(this, selectedItem, detail.selectedValue);
            const selectedIndex = Number.isFinite(detail.selectedIndex)
                ? Number(detail.selectedIndex)
                : items.indexOf(selectedItem);
            const changeDetail = {
                value: selectedValue,
                selectedValue,
                selectedIndex,
                selectedItem,
            };
            this.dispatchEvent(new CustomEvent('dads-change', {
                bubbles: true,
                composed: true,
                detail: changeDetail,
            }));
        });
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsLanguageSelector_autoLabelManaged, !this.hasAttribute('label'), "f");
        setDefaultAttributes(this, {
            opener: 'text',
        });
        __classPrivateFieldSet(this, _DadsLanguageSelector_iconSlot, this.shadowRoot?.querySelector('#icon-slot'), "f");
        __classPrivateFieldSet(this, _DadsLanguageSelector_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldGet(this, _DadsLanguageSelector_iconSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsLanguageSelector_handleSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsLanguageSelector_labelSlot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsLanguageSelector_handleSlotChange, "f"));
        this.addEventListener('menuitemselect', __classPrivateFieldGet(this, _DadsLanguageSelector_handleMenuItemSelect, "f"));
        __classPrivateFieldSet(this, _DadsLanguageSelector_itemsObserver, new MutationObserver(__classPrivateFieldGet(this, _DadsLanguageSelector_handleItemsMutation, "f")), "f");
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsLanguageSelector_iconSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsLanguageSelector_handleSlotChange, "f"));
        __classPrivateFieldGet(this, _DadsLanguageSelector_labelSlot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsLanguageSelector_handleSlotChange, "f"));
        this.removeEventListener('menuitemselect', __classPrivateFieldGet(this, _DadsLanguageSelector_handleMenuItemSelect, "f"));
        __classPrivateFieldGet(this, _DadsLanguageSelector_itemsObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsLanguageSelector_itemsObserver, null, "f");
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'label' && !__classPrivateFieldGet(this, _DadsLanguageSelector_isSyncingAutoLabel, "f")) {
            __classPrivateFieldSet(this, _DadsLanguageSelector_autoLabelManaged, newValue === null, "f");
            if (__classPrivateFieldGet(this, _DadsLanguageSelector_autoLabelManaged, "f"))
                __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncOpenerLabel).call(this, __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_getNormalizedOpener).call(this));
            return;
        }
        if (name === 'opener' || name === 'size') {
            __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncAll).call(this);
        }
    }
    /**
     * 現在選択されている言語情報を取得します。
     * 言語選択イベントは `dads-change` を利用し、現在値取得はこのメソッドを利用します。
     */
    getSelectedLanguage() {
        const items = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_getMenuItems).call(this);
        const selectedIndex = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_findCurrentItemIndex).call(this, items);
        if (selectedIndex < 0)
            return null;
        const selectedItem = items[selectedIndex];
        return {
            value: __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_resolveSelectedValue).call(this, selectedItem, undefined),
            label: (selectedItem.textContent ?? '').trim(),
            selectedIndex,
            selectedItem,
        };
    }
}
_DadsLanguageSelector_iconSlot = new WeakMap(), _DadsLanguageSelector_labelSlot = new WeakMap(), _DadsLanguageSelector_itemsObserver = new WeakMap(), _DadsLanguageSelector_isSyncing = new WeakMap(), _DadsLanguageSelector_isSyncingAutoLabel = new WeakMap(), _DadsLanguageSelector_autoLabelManaged = new WeakMap(), _DadsLanguageSelector_handleSlotChange = new WeakMap(), _DadsLanguageSelector_handleItemsMutation = new WeakMap(), _DadsLanguageSelector_handleMenuItemSelect = new WeakMap(), _DadsLanguageSelector_instances = new WeakSet(), _DadsLanguageSelector_findCurrentItemIndex = function _DadsLanguageSelector_findCurrentItemIndex(items) {
    const explicitCurrentIndex = items.findIndex((item) => item.hasAttribute('current'));
    if (explicitCurrentIndex >= 0)
        return explicitCurrentIndex;
    return items.findIndex((item) => hasAriaCurrent(item));
}, _DadsLanguageSelector_removeElements = function _DadsLanguageSelector_removeElements(elements) {
    for (const element of elements)
        element.remove();
}, _DadsLanguageSelector_removeDuplicateAutoElements = function _DadsLanguageSelector_removeDuplicateAutoElements(autoElements) {
    for (let i = 1; i < autoElements.length; i += 1) {
        autoElements[i].remove();
    }
}, _DadsLanguageSelector_getAutoCheckIcons = function _DadsLanguageSelector_getAutoCheckIcons(item) {
    return getAutoSlottedElements(item, 'start-icon', AUTO_CHECK_ICON_ATTR);
}, _DadsLanguageSelector_hasCustomStartIcon = function _DadsLanguageSelector_hasCustomStartIcon(item) {
    return hasCustomSlottedElement(item, 'start-icon', AUTO_CHECK_ICON_ATTR);
}, _DadsLanguageSelector_hasCustomLabelSlotContent = function _DadsLanguageSelector_hasCustomLabelSlotContent() {
    const slot = __classPrivateFieldGet(this, _DadsLanguageSelector_labelSlot, "f");
    if (!slot)
        return false;
    return slot.assignedNodes({ flatten: true }).some((node) => isNotWhitespace(node));
}, _DadsLanguageSelector_syncOpenerIcon = function _DadsLanguageSelector_syncOpenerIcon() {
    const autoIcons = getAutoSlottedElements(this, 'icon', AUTO_OPENER_ICON_ATTR);
    if (hasCustomSlottedElement(this, 'icon', AUTO_OPENER_ICON_ATTR)) {
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_removeElements).call(this, autoIcons);
        return;
    }
    if (autoIcons.length > 0) {
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_removeDuplicateAutoElements).call(this, autoIcons);
        return;
    }
    const icon = createSvg(openerIconPath, { viewBox: '10 3 24 24' });
    icon.setAttribute('slot', 'icon');
    icon.setAttribute(AUTO_OPENER_ICON_ATTR, '');
    this.appendChild(icon);
}, _DadsLanguageSelector_syncMenuItems = function _DadsLanguageSelector_syncMenuItems() {
    const items = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_getMenuItems).call(this);
    __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncMenuItemDefaults).call(this, items);
    const selected = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_normalizeCurrentSelection).call(this, items);
    __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncSelectionCheckIcons).call(this, items, selected);
}, _DadsLanguageSelector_normalizeCurrentSelection = function _DadsLanguageSelector_normalizeCurrentSelection(items) {
    const selectedIndex = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_findCurrentItemIndex).call(this, items);
    if (selectedIndex < 0)
        return null;
    const selected = items[selectedIndex];
    __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_applyCurrentSelection).call(this, items, selected);
    return selected;
}, _DadsLanguageSelector_syncSelectionCheckIcons = function _DadsLanguageSelector_syncSelectionCheckIcons(items, selected) {
    for (const item of items) {
        const autoIcons = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_getAutoCheckIcons).call(this, item);
        const isSelected = item === selected;
        if (!isSelected || __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_hasCustomStartIcon).call(this, item)) {
            __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_removeElements).call(this, autoIcons);
            continue;
        }
        if (autoIcons.length === 0) {
            const icon = createSvg(checkIconPath);
            icon.setAttribute('slot', 'start-icon');
            icon.setAttribute(AUTO_CHECK_ICON_ATTR, '');
            item.appendChild(icon);
            continue;
        }
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_removeDuplicateAutoElements).call(this, autoIcons);
    }
}, _DadsLanguageSelector_getMenuItems = function _DadsLanguageSelector_getMenuItems() {
    const children = Array.from(this.children);
    const items = [];
    for (const child of children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (child.getAttribute('slot'))
            continue;
        if (!child.localName.endsWith(MENU_LIST_ITEM_SUFFIX))
            continue;
        items.push(child);
    }
    return items;
}, _DadsLanguageSelector_syncAll = function _DadsLanguageSelector_syncAll() {
    if (__classPrivateFieldGet(this, _DadsLanguageSelector_isSyncing, "f"))
        return;
    __classPrivateFieldGet(this, _DadsLanguageSelector_itemsObserver, "f")?.disconnect();
    __classPrivateFieldSet(this, _DadsLanguageSelector_isSyncing, true, "f");
    try {
        const opener = __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_getNormalizedOpener).call(this);
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncOpenerLabel).call(this, opener);
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncOpenerIcon).call(this);
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_syncMenuItems).call(this);
    }
    finally {
        __classPrivateFieldSet(this, _DadsLanguageSelector_isSyncing, false, "f");
        __classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_startObservingItems).call(this);
    }
}, _DadsLanguageSelector_startObservingItems = function _DadsLanguageSelector_startObservingItems() {
    if (!__classPrivateFieldGet(this, _DadsLanguageSelector_itemsObserver, "f") || !this.isConnected)
        return;
    __classPrivateFieldGet(this, _DadsLanguageSelector_itemsObserver, "f").observe(this, LANGUAGE_SELECTOR_OBSERVER_OPTIONS);
}, _DadsLanguageSelector_getNormalizedOpener = function _DadsLanguageSelector_getNormalizedOpener() {
    const opener = this.getAttribute('opener');
    if (opener === 'icon')
        return 'icon';
    if (opener === 'text')
        return 'text';
    this.setAttribute('opener', 'text');
    return 'text';
}, _DadsLanguageSelector_syncOpenerLabel = function _DadsLanguageSelector_syncOpenerLabel(opener) {
    if (__classPrivateFieldGet(this, _DadsLanguageSelector_instances, "m", _DadsLanguageSelector_hasCustomLabelSlotContent).call(this))
        return;
    if (!__classPrivateFieldGet(this, _DadsLanguageSelector_autoLabelManaged, "f") && this.hasAttribute('label'))
        return;
    const nextLabel = opener === 'icon' ? 'LANG' : 'Language';
    if (this.getAttribute('label') === nextLabel && __classPrivateFieldGet(this, _DadsLanguageSelector_autoLabelManaged, "f"))
        return;
    __classPrivateFieldSet(this, _DadsLanguageSelector_isSyncingAutoLabel, true, "f");
    this.setAttribute('label', nextLabel);
    __classPrivateFieldSet(this, _DadsLanguageSelector_isSyncingAutoLabel, false, "f");
    __classPrivateFieldSet(this, _DadsLanguageSelector_autoLabelManaged, true, "f");
}, _DadsLanguageSelector_syncMenuItemDefaults = function _DadsLanguageSelector_syncMenuItemDefaults(items) {
    const itemSize = this.getAttribute('size') === 'md' ? 'regular' : 'small';
    for (const item of items) {
        if (!item.hasAttribute('variant'))
            item.setAttribute('variant', 'box');
        if (!item.hasAttribute('end-icon'))
            item.setAttribute('end-icon', 'none');
        if (!item.hasAttribute('size')) {
            item.setAttribute('size', itemSize);
            item.setAttribute(AUTO_ITEM_SIZE_ATTR, '');
            continue;
        }
        const currentSize = item.getAttribute('size');
        const isAutoManaged = item.hasAttribute(AUTO_ITEM_SIZE_ATTR);
        const isDefaultSized = currentSize === MENU_LIST_ITEM_DEFAULT_SIZE;
        if (isAutoManaged || isDefaultSized) {
            item.setAttribute(AUTO_ITEM_SIZE_ATTR, '');
            if (currentSize !== itemSize)
                item.setAttribute('size', itemSize);
        }
    }
}, _DadsLanguageSelector_applyCurrentSelection = function _DadsLanguageSelector_applyCurrentSelection(items, selected) {
    for (const item of items) {
        if (item === selected) {
            if (!item.hasAttribute('current'))
                item.setAttribute('current', '');
            if (item.getAttribute('aria-current') !== 'true')
                item.setAttribute('aria-current', 'true');
            continue;
        }
        if (item.hasAttribute('current'))
            item.removeAttribute('current');
        if (item.hasAttribute('aria-current'))
            item.removeAttribute('aria-current');
    }
}, _DadsLanguageSelector_resolveSelectedValue = function _DadsLanguageSelector_resolveSelectedValue(item, preferred) {
    if (preferred && preferred.trim() !== '')
        return preferred;
    const value = item.getAttribute('value');
    if (value && value.trim() !== '')
        return value;
    const dataValue = item.getAttribute('data-value');
    if (dataValue && dataValue.trim() !== '')
        return dataValue;
    return (item.textContent ?? '').trim();
};
DadsLanguageSelector.definition = {
    ...baseDefinition,
    name: 'dads-language-selector',
    styles: [...baseStyles, languageSelectorTokens, languageSelectorStyles],
    attributes: [...baseDefinition.attributes, PropertyAttr('opener')],
};
