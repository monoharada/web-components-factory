/**
 * @module tab
 * デジタル庁デザインシステム Tab コンポーネント
 * APG Tabs Pattern 準拠の4方向レイアウト・reflow・auto/manual アクティベーション対応
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
var _DadsTab_instances, _DadsTab_tablist, _DadsTab_slot, _DadsTab_tabs, _DadsTab_panels, _DadsTab_childObserver, _DadsTab_layoutObserver, _DadsTab_idCounter, _DadsTab_lastTablistBlockSize, _DadsTab_handleSlotChange, _DadsTab_handleChildMutation, _DadsTab_generateId, _DadsTab_getPanelChildren, _DadsTab_getSelectedIndex, _DadsTab_syncTabs, _DadsTab_syncAriaOrientation, _DadsTab_syncPanelMinBlockSize, _DadsTab_syncSelection, _DadsTab_getEnabledTabs, _DadsTab_handleTabClick, _DadsTab_handleKeyDown, _DadsTab_focusActivePanel, _DadsTab_activateTab, _DadsTab_selectTab;
import { html, PropertyAttr, Keys, ElementSelection, Orientation, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { withReset } from '../../styles/reset-css.js';
import { tabTokens } from './tab-tokens.js';
import { tabStyles } from './tab-styles.js';
const navigationKeys = new Set([
    Keys.arrowUp,
    Keys.arrowDown,
    Keys.arrowLeft,
    Keys.arrowRight,
    Keys.home,
    Keys.end,
]);
function normalizeOrientation(v) {
    if (v === 'bottom' || v === 'left' || v === 'right')
        return v;
    return 'top';
}
function normalizeActivationMode(v) {
    return v === 'manual' ? 'manual' : 'auto';
}
function isHorizontalOrientation(orientation) {
    return orientation === 'top' || orientation === 'bottom';
}
/**
 * DadsTab コンポーネント
 *
 * Light DOM の子要素をタブパネルとして扱い、各子要素の `data-tab-label` 属性から
 * タブラベルを動的に生成する単一コンポーネントタブ。
 *
 * @customElement
 * @tagname dads-tab
 *
 * @slot default - タブパネルの内容（各子要素に data-tab-label でラベル、data-tab-disabled で無効化を指定）
 *
 * @csspart base - ルートコンテナ
 * @csspart tablist - タブリスト（role="tablist"）
 * @csspart tab - 各タブボタン（role="tab"）
 * @csspart indicator - 各タブの選択マーク
 * @csspart label - 各タブのラベルテキスト
 * @csspart tabpanel - 各タブパネル（role="tabpanel"）
 *
 * @attr {'top' | 'bottom' | 'left' | 'right'} [orientation='top'] - タブリストの配置方向
 * @attr {'auto' | 'manual'} [activation-mode='auto'] - アクティベーションモード
 * @attr {string} [selected-index='0'] - 選択中のタブインデックス
 *
 * @cssprop --dads-tab-background - タブ背景色
 * @cssprop --dads-tab-background-hover - タブホバー時背景色
 * @cssprop --dads-tab-color - タブテキスト色
 * @cssprop --dads-tab-color-selected - 選択タブテキスト色
 * @cssprop --dads-tab-color-disabled - 無効タブテキスト色
 * @cssprop --dads-tab-border-color - ボーダー色
 * @cssprop --dads-tab-indicator-color - インジケーター色
 * @cssprop --dads-tab-indicator-height - インジケーター高さ
 * @cssprop --dads-tab-focus-outline-color - フォーカスアウトライン色
 * @cssprop --dads-tab-focus-ring-color - フォーカスリング色
 * @cssprop --dads-tab-focus-border-radius - フォーカスリングの角丸
 *
 * @fires dads-tab-change - タブ選択変更時（detail: { selectedIndex: number, previousIndex: number }）
 *
 * @example
 * ```html
 * <dads-tab>
 *   <div data-tab-label="タブ1">タブ1の内容</div>
 *   <div data-tab-label="タブ2">タブ2の内容</div>
 *   <div data-tab-label="タブ3">タブ3の内容</div>
 * </dads-tab>
 * ```
 */
export class DadsTab extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsTab_instances.add(this);
        _DadsTab_tablist.set(this, null);
        _DadsTab_slot.set(this, null);
        _DadsTab_tabs.set(this, []);
        _DadsTab_panels.set(this, []);
        _DadsTab_childObserver.set(this, null);
        _DadsTab_layoutObserver.set(this, null);
        _DadsTab_idCounter.set(this, 0);
        _DadsTab_lastTablistBlockSize.set(this, '');
        _DadsTab_handleSlotChange.set(this, () => {
            __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncTabs).call(this);
        });
        _DadsTab_handleChildMutation.set(this, (records) => {
            let shouldSyncTabs = false;
            let shouldSyncAria = false;
            for (const record of records) {
                if (record.type === 'childList') {
                    if (record.target === this) {
                        shouldSyncTabs = true;
                    }
                    continue;
                }
                if (record.type !== 'attributes')
                    continue;
                const attrName = record.attributeName ?? '';
                const target = record.target;
                if (target === this) {
                    if (attrName === 'aria-label' || attrName === 'aria-labelledby') {
                        shouldSyncAria = true;
                    }
                    continue;
                }
                if (target.parentElement !== this)
                    continue;
                if (attrName === 'data-tab-label' || attrName === 'data-tab-disabled') {
                    shouldSyncTabs = true;
                }
            }
            if (shouldSyncTabs) {
                __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncTabs).call(this);
                return;
            }
            if (shouldSyncAria) {
                __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncAriaOrientation).call(this);
            }
        });
        _DadsTab_handleTabClick.set(this, (event) => {
            const tab = event.currentTarget;
            if (tab.getAttribute('aria-disabled') === 'true')
                return;
            const index = __classPrivateFieldGet(this, _DadsTab_tabs, "f").indexOf(tab);
            if (index < 0)
                return;
            __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_selectTab).call(this, index);
        });
        _DadsTab_handleKeyDown.set(this, (event) => {
            const currentTab = event.currentTarget;
            const isDisabled = currentTab.getAttribute('aria-disabled') === 'true';
            if (isDisabled && !navigationKeys.has(event.key))
                return;
            const mode = normalizeActivationMode(this.getAttribute('activation-mode'));
            const orientation = normalizeOrientation(this.getAttribute('orientation'));
            const ariaOrientation = isHorizontalOrientation(orientation)
                ? Orientation.horizontal
                : Orientation.vertical;
            // Enter: タブパネルへフォーカスを移す（manual モードでは先に選択確定）
            if (event.key === Keys.enter) {
                event.preventDefault();
                if (mode === 'manual') {
                    __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_activateTab).call(this, currentTab);
                }
                __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_focusActivePanel).call(this);
                return;
            }
            // Space: manual モードでは選択確定（フォーカスはタブに留まる）
            if (mode === 'manual' && event.key === Keys.space) {
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_activateTab).call(this, currentTab);
                return;
            }
            const enabledTabs = __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_getEnabledTabs).call(this);
            if (enabledTabs.length <= 1)
                return;
            const selection = new ElementSelection(enabledTabs, currentTab);
            selection.processKey(event, (target) => {
                target.focus();
                if (mode === 'auto') {
                    __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_activateTab).call(this, target);
                }
            }, {
                orientation: ariaOrientation,
                wrap: true,
                preventDefaultHomeEnd: true,
            });
        });
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.hasAttribute('orientation')) {
            this.setAttribute('orientation', 'top');
        }
        if (!this.hasAttribute('activation-mode')) {
            this.setAttribute('activation-mode', 'auto');
        }
        if (!this.hasAttribute('selected-index')) {
            this.setAttribute('selected-index', '0');
        }
        __classPrivateFieldSet(this, _DadsTab_tablist, this.shadowRoot?.querySelector('#tablist') ?? null, "f");
        __classPrivateFieldSet(this, _DadsTab_slot, this.shadowRoot?.querySelector('#default-slot') ?? null, "f");
        __classPrivateFieldGet(this, _DadsTab_slot, "f")?.addEventListener('slotchange', __classPrivateFieldGet(this, _DadsTab_handleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsTab_childObserver, new MutationObserver(__classPrivateFieldGet(this, _DadsTab_handleChildMutation, "f")), "f");
        __classPrivateFieldGet(this, _DadsTab_childObserver, "f").observe(this, {
            childList: true,
            attributes: true,
            attributeFilter: ['data-tab-label', 'data-tab-disabled', 'aria-label', 'aria-labelledby'],
            subtree: true,
        });
        if (typeof ResizeObserver !== 'undefined') {
            __classPrivateFieldSet(this, _DadsTab_layoutObserver, new ResizeObserver(() => {
                __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncPanelMinBlockSize).call(this);
            }), "f");
            __classPrivateFieldGet(this, _DadsTab_layoutObserver, "f").observe(this);
            if (__classPrivateFieldGet(this, _DadsTab_tablist, "f")) {
                __classPrivateFieldGet(this, _DadsTab_layoutObserver, "f").observe(__classPrivateFieldGet(this, _DadsTab_tablist, "f"));
            }
        }
        __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncTabs).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsTab_slot, "f")?.removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsTab_handleSlotChange, "f"));
        __classPrivateFieldSet(this, _DadsTab_slot, null, "f");
        __classPrivateFieldSet(this, _DadsTab_tablist, null, "f");
        __classPrivateFieldGet(this, _DadsTab_childObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsTab_childObserver, null, "f");
        __classPrivateFieldGet(this, _DadsTab_layoutObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsTab_layoutObserver, null, "f");
        __classPrivateFieldSet(this, _DadsTab_tabs, [], "f");
        __classPrivateFieldSet(this, _DadsTab_panels, [], "f");
        this.style.removeProperty('--_dads-tab-tablist-block-size');
        __classPrivateFieldSet(this, _DadsTab_lastTablistBlockSize, '', "f");
        super.disconnectedCallback();
    }
    orientationChanged() {
        __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncAriaOrientation).call(this);
        __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncPanelMinBlockSize).call(this);
    }
    selectedIndexChanged() {
        __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncSelection).call(this);
    }
    activationModeChanged() {
        // No DOM changes needed for mode change
    }
}
_DadsTab_tablist = new WeakMap(), _DadsTab_slot = new WeakMap(), _DadsTab_tabs = new WeakMap(), _DadsTab_panels = new WeakMap(), _DadsTab_childObserver = new WeakMap(), _DadsTab_layoutObserver = new WeakMap(), _DadsTab_idCounter = new WeakMap(), _DadsTab_lastTablistBlockSize = new WeakMap(), _DadsTab_handleSlotChange = new WeakMap(), _DadsTab_handleChildMutation = new WeakMap(), _DadsTab_handleTabClick = new WeakMap(), _DadsTab_handleKeyDown = new WeakMap(), _DadsTab_instances = new WeakSet(), _DadsTab_generateId = function _DadsTab_generateId(prefix) {
    __classPrivateFieldSet(this, _DadsTab_idCounter, __classPrivateFieldGet(this, _DadsTab_idCounter, "f") + 1, "f");
    return `${this.localName}-${prefix}-${__classPrivateFieldGet(this, _DadsTab_idCounter, "f")}`;
}, _DadsTab_getPanelChildren = function _DadsTab_getPanelChildren() {
    const children = [];
    for (const child of this.children) {
        if (!(child instanceof HTMLElement))
            continue;
        if (!child.hasAttribute('data-tab-label'))
            continue;
        children.push(child);
    }
    return children;
}, _DadsTab_getSelectedIndex = function _DadsTab_getSelectedIndex() {
    return Math.max(0, parseInt(this.getAttribute('selected-index') ?? '0', 10) || 0);
}, _DadsTab_syncTabs = function _DadsTab_syncTabs() {
    const tablist = __classPrivateFieldGet(this, _DadsTab_tablist, "f");
    if (!tablist)
        return;
    const panelChildren = __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_getPanelChildren).call(this);
    // Remove existing tabs
    while (tablist.firstChild) {
        tablist.removeChild(tablist.firstChild);
    }
    __classPrivateFieldSet(this, _DadsTab_tabs, [], "f");
    __classPrivateFieldSet(this, _DadsTab_panels, [], "f");
    for (const child of panelChildren) {
        const label = child.getAttribute('data-tab-label') ?? '';
        const disabled = child.hasAttribute('data-tab-disabled');
        // Ensure IDs for ARIA linking
        if (!child.id) {
            child.id = __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_generateId).call(this, 'panel');
        }
        const tabId = __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_generateId).call(this, 'tab');
        // Create tab button
        const tab = document.createElement('button');
        tab.setAttribute('part', 'tab');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('id', tabId);
        tab.setAttribute('aria-controls', child.id);
        tab.setAttribute('tabindex', '0');
        tab.type = 'button';
        tab.addEventListener('click', __classPrivateFieldGet(this, _DadsTab_handleTabClick, "f"));
        tab.addEventListener('keydown', __classPrivateFieldGet(this, _DadsTab_handleKeyDown, "f"));
        const indicator = document.createElement('span');
        indicator.setAttribute('part', 'indicator');
        indicator.setAttribute('aria-hidden', 'true');
        const labelNode = document.createElement('span');
        labelNode.setAttribute('part', 'label');
        labelNode.textContent = label;
        tab.append(indicator, labelNode);
        if (disabled) {
            tab.setAttribute('aria-disabled', 'true');
        }
        // Set panel ARIA
        child.setAttribute('role', 'tabpanel');
        child.setAttribute('part', 'tabpanel');
        child.setAttribute('aria-labelledby', tabId);
        child.setAttribute('tabindex', '-1');
        tablist.appendChild(tab);
        __classPrivateFieldGet(this, _DadsTab_tabs, "f").push(tab);
        __classPrivateFieldGet(this, _DadsTab_panels, "f").push(child);
    }
    __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncAriaOrientation).call(this);
    __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncPanelMinBlockSize).call(this);
    __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_syncSelection).call(this);
}, _DadsTab_syncAriaOrientation = function _DadsTab_syncAriaOrientation() {
    const tablist = __classPrivateFieldGet(this, _DadsTab_tablist, "f");
    if (!tablist)
        return;
    const orientation = normalizeOrientation(this.getAttribute('orientation'));
    const ariaOrientation = isHorizontalOrientation(orientation) ? 'horizontal' : 'vertical';
    tablist.setAttribute('aria-orientation', ariaOrientation);
    const labelledBy = this.getAttribute('aria-labelledby');
    const label = this.getAttribute('aria-label');
    if (labelledBy) {
        tablist.setAttribute('aria-labelledby', labelledBy);
        tablist.removeAttribute('aria-label');
        return;
    }
    tablist.removeAttribute('aria-labelledby');
    tablist.setAttribute('aria-label', label || 'タブ');
}, _DadsTab_syncPanelMinBlockSize = function _DadsTab_syncPanelMinBlockSize() {
    const tablist = __classPrivateFieldGet(this, _DadsTab_tablist, "f");
    if (!tablist)
        return;
    const blockSize = Math.max(0, Math.ceil(tablist.getBoundingClientRect().height));
    const nextValue = `${blockSize}px`;
    if (__classPrivateFieldGet(this, _DadsTab_lastTablistBlockSize, "f") === nextValue)
        return;
    __classPrivateFieldSet(this, _DadsTab_lastTablistBlockSize, nextValue, "f");
    this.style.setProperty('--_dads-tab-tablist-block-size', nextValue);
}, _DadsTab_syncSelection = function _DadsTab_syncSelection() {
    const clampedIndex = Math.min(__classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_getSelectedIndex).call(this), __classPrivateFieldGet(this, _DadsTab_tabs, "f").length - 1);
    for (let i = 0; i < __classPrivateFieldGet(this, _DadsTab_tabs, "f").length; i++) {
        const isSelected = i === clampedIndex;
        __classPrivateFieldGet(this, _DadsTab_tabs, "f")[i].setAttribute('aria-selected', String(isSelected));
        if (isSelected) {
            __classPrivateFieldGet(this, _DadsTab_panels, "f")[i].removeAttribute('hidden');
        }
        else {
            __classPrivateFieldGet(this, _DadsTab_panels, "f")[i].setAttribute('hidden', '');
        }
    }
}, _DadsTab_getEnabledTabs = function _DadsTab_getEnabledTabs() {
    const enabled = [];
    for (const tab of __classPrivateFieldGet(this, _DadsTab_tabs, "f")) {
        if (tab.getAttribute('aria-disabled') === 'true')
            continue;
        enabled.push(tab);
    }
    return enabled;
}, _DadsTab_focusActivePanel = function _DadsTab_focusActivePanel() {
    const clampedIndex = Math.min(__classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_getSelectedIndex).call(this), __classPrivateFieldGet(this, _DadsTab_panels, "f").length - 1);
    if (clampedIndex >= 0 && __classPrivateFieldGet(this, _DadsTab_panels, "f")[clampedIndex]) {
        __classPrivateFieldGet(this, _DadsTab_panels, "f")[clampedIndex].focus();
    }
}, _DadsTab_activateTab = function _DadsTab_activateTab(tab) {
    if (tab.getAttribute('aria-disabled') === 'true')
        return;
    const index = __classPrivateFieldGet(this, _DadsTab_tabs, "f").indexOf(tab);
    if (index >= 0) {
        __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_selectTab).call(this, index);
    }
}, _DadsTab_selectTab = function _DadsTab_selectTab(index) {
    const previousIndex = __classPrivateFieldGet(this, _DadsTab_instances, "m", _DadsTab_getSelectedIndex).call(this);
    if (index === previousIndex)
        return;
    this.setAttribute('selected-index', String(index));
    this.dispatchEvent(new CustomEvent('dads-tab-change', {
        detail: { selectedIndex: index, previousIndex },
        bubbles: true,
        composed: true,
    }));
};
DadsTab.version = '0.1.0';
DadsTab.definition = {
    name: 'dads-tab',
    template: html `
      <div part="base" id="base">
        <div part="tablist" role="tablist" id="tablist"></div>
        <slot id="default-slot"></slot>
      </div>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        tabTokens,
        tabStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('orientation'),
        PropertyAttr('activationMode', 'activation-mode'),
        PropertyAttr('selectedIndex', 'selected-index'),
    ],
};
