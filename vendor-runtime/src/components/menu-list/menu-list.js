/**
 * @module menu-list
 * デジタル庁デザインシステム Menu List / Menu List Item
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
var _DadsMenuList_instances, _DadsMenuList_syncIndentation, _DadsMenuListItem_instances, _DadsMenuListItem_base, _DadsMenuListItem_startSlot, _DadsMenuListItem_tailSlot, _DadsMenuListItem_childObserver, _DadsMenuListItem_isEndIconAuto, _DadsMenuListItem_isSyncingAutoEndIcon, _DadsMenuListItem_isLink, _DadsMenuListItem_isInsideMenuListBox, _DadsMenuListItem_renderTemplate, _DadsMenuListItem_createTemplate, _DadsMenuListItem_syncChildSlotting, _DadsMenuListItem_hasChildrenMenuList, _DadsMenuListItem_syncAutoEndIcon, _DadsMenuListItem_syncLinkAttributes, _DadsMenuListItem_handleSlotsChanged, _DadsMenuListItem_setupSlotListeners, _DadsMenuListItem_hasSlottedContent, _DadsMenuListItem_syncIconFallbackVisibility;
import { html, PropertyAttr, BooleanAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { menuListTokens } from './menu-list-tokens.js';
import { menuListStyles, menuListItemStyles } from './menu-list-styles.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
/**
 * メニューリストコンポーネント
 *
 * @customElement dads-menu-list
 * @tagname dads-menu-list
 *
 * @slot default - メニュー項目（dads-menu-list-item）
 *
 * @csspart base - role="list" のルート
 *
 * @attr {number} indentation - インデント（CSS変数 --menu-list-indentation に反映）
 */
export class DadsMenuList extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsMenuList_instances.add(this);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldGet(this, _DadsMenuList_instances, "m", _DadsMenuList_syncIndentation).call(this);
    }
    indentationChanged() {
        __classPrivateFieldGet(this, _DadsMenuList_instances, "m", _DadsMenuList_syncIndentation).call(this);
    }
}
_DadsMenuList_instances = new WeakSet(), _DadsMenuList_syncIndentation = function _DadsMenuList_syncIndentation() {
    const raw = (this.getAttribute('indentation') ?? '').trim();
    if (!raw) {
        this.style.removeProperty('--menu-list-indentation');
        return;
    }
    const n = Number(raw);
    if (Number.isNaN(n) || n < 0) {
        this.style.removeProperty('--menu-list-indentation');
        return;
    }
    this.style.setProperty('--menu-list-indentation', String(n));
};
DadsMenuList.definition = {
    name: 'dads-menu-list',
    template: html `
      <div part="base" role="list" id="base">
        <slot></slot>
      </div>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), menuListTokens, menuListStyles], 'minimal'),
    attributes: [PropertyAttr('indentation')],
};
const menuListItemInnerHtml = `
  <span part="start-icon" id="start-icon">
    <slot name="start-icon" id="start-icon-slot"></slot>
  </span>
  <span part="label" id="label">
    <slot></slot>
    <span part="tail-icon" id="tail-icon">
      <slot name="tail-icon" id="tail-icon-slot">
        <svg width="16" height="16" viewBox="0 0 48 48" role="img" aria-label="新規タブで開きます">
          <path d="M22 6V9H9V39H39V26H42V42H6V6H22ZM42 6V20H39V11.2L21 29L19 27L36.8 9H28V6H42Z" fill="currentcolor"/>
        </svg>
      </slot>
    </span>
  </span>
  <span part="end-icon" id="end-icon">
    <slot name="end-icon" id="end-icon-slot">
      <svg data-icon="arrow-right" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
        <path d="M12 17L3 8L4 7L12 15L20 7L21 8L12 17Z"/>
      </svg>
      <svg data-icon="caret" width="16" height="16" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
        <path d="M12.5 17.1 3.5 8l1-1 8 8 8-8 1 1-9 9.1Z"/>
      </svg>
    </slot>
  </span>
`;
/**
 * メニューリスト項目コンポーネント
 *
 * @customElement dads-menu-list-item
 * @tagname dads-menu-list-item
 *
 * @slot default - ラベル
 * @slot start-icon - 先頭アイコン
 * @slot tail-icon - ラベル末尾アイコン（デフォルト: 新規タブで開く）
 * @slot end-icon - 末尾アイコン（arrow-right / caret）
 * @slot children - 子メニュー（ネスト）
 *
 * @csspart base - ボタン/リンク本体
 * @csspart start-icon - 先頭アイコン領域
 * @csspart label - ラベル領域
 * @csspart tail-icon - ラベル末尾アイコン領域
 * @csspart end-icon - 末尾アイコン領域
 *
 * @attr {string} variant - 表示タイプ（standard | box）
 * @attr {string} size - サイズ（regular | small）
 * @attr {boolean} current - 現在地
 * @attr {boolean} expanded - 展開状態
 * @attr {string} end-icon - 末尾アイコン（arrow-right | caret | none）
 * @attr {string} tail-icon - ラベル末尾アイコン（new-window | none）
 * @attr {string} href - リンクURL（指定時は <a> として動作）
 * @attr {string} target - リンクターゲット
 * @attr {string} rel - リンクrel
 * @attr {boolean} download - download属性
 */
export class DadsMenuListItem extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsMenuListItem_instances.add(this);
        _DadsMenuListItem_base.set(this, null);
        _DadsMenuListItem_startSlot.set(this, null);
        _DadsMenuListItem_tailSlot.set(this, null);
        _DadsMenuListItem_childObserver.set(this, null);
        _DadsMenuListItem_isEndIconAuto.set(this, false);
        _DadsMenuListItem_isSyncingAutoEndIcon.set(this, false);
        _DadsMenuListItem_handleSlotsChanged.set(this, () => {
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncIconFallbackVisibility).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        const hasExplicitEndIcon = this.hasAttribute('end-icon');
        const isInsideMenuListBox = __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_isInsideMenuListBox).call(this);
        const hasChildrenMenuList = __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncChildSlotting).call(this);
        setDefaultAttributes(this, {
            variant: isInsideMenuListBox ? 'box' : 'standard',
            size: 'regular',
            'tail-icon': 'none',
        });
        if (isInsideMenuListBox && !hasExplicitEndIcon) {
            // Menu List Box items are "box" style and have no end icon by default.
            // (If needed, users can explicitly set end-icon.)
            this.setAttribute('end-icon', 'none');
        }
        else if (!hasExplicitEndIcon) {
            __classPrivateFieldSet(this, _DadsMenuListItem_isEndIconAuto, true, "f");
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncAutoEndIcon).call(this, hasChildrenMenuList);
        }
        __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_renderTemplate).call(this);
        // MutationObserver fallback (happy-dom などで slotchange が発火しないケースに対応)
        if (!__classPrivateFieldGet(this, _DadsMenuListItem_childObserver, "f")) {
            __classPrivateFieldSet(this, _DadsMenuListItem_childObserver, new MutationObserver(() => {
                const hasChildren = __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncChildSlotting).call(this);
                __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncAutoEndIcon).call(this, hasChildren);
                __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncIconFallbackVisibility).call(this);
            }), "f");
            __classPrivateFieldGet(this, _DadsMenuListItem_childObserver, "f").observe(this, {
                childList: true,
                // slot 属性変更を子要素で検知するため subtree を有効化する
                subtree: true,
                attributes: true,
                attributeFilter: ['slot'],
            });
        }
    }
    disconnectedCallback() {
        if (__classPrivateFieldGet(this, _DadsMenuListItem_startSlot, "f"))
            __classPrivateFieldGet(this, _DadsMenuListItem_startSlot, "f").removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsMenuListItem_handleSlotsChanged, "f"));
        if (__classPrivateFieldGet(this, _DadsMenuListItem_tailSlot, "f"))
            __classPrivateFieldGet(this, _DadsMenuListItem_tailSlot, "f").removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsMenuListItem_handleSlotsChanged, "f"));
        __classPrivateFieldGet(this, _DadsMenuListItem_childObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsMenuListItem_childObserver, null, "f");
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'href') {
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_renderTemplate).call(this);
            return;
        }
        if (name === 'target' || name === 'rel' || name === 'download') {
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncLinkAttributes).call(this);
            return;
        }
        if (name === 'expanded') {
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncAutoEndIcon).call(this, __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_hasChildrenMenuList).call(this));
            return;
        }
        if (name === 'end-icon') {
            if (__classPrivateFieldGet(this, _DadsMenuListItem_isEndIconAuto, "f") && !__classPrivateFieldGet(this, _DadsMenuListItem_isSyncingAutoEndIcon, "f")) {
                // User override
                __classPrivateFieldSet(this, _DadsMenuListItem_isEndIconAuto, false, "f");
            }
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncIconFallbackVisibility).call(this);
            return;
        }
        if (name === 'tail-icon') {
            __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncIconFallbackVisibility).call(this);
            return;
        }
    }
    /**
     * MenuListBox等が内部のフォーカス対象を参照するためのAPI
     */
    getFocusTarget() {
        return __classPrivateFieldGet(this, _DadsMenuListItem_base, "f");
    }
    focus(options) {
        __classPrivateFieldGet(this, _DadsMenuListItem_base, "f")?.focus(options);
    }
}
_DadsMenuListItem_base = new WeakMap(), _DadsMenuListItem_startSlot = new WeakMap(), _DadsMenuListItem_tailSlot = new WeakMap(), _DadsMenuListItem_childObserver = new WeakMap(), _DadsMenuListItem_isEndIconAuto = new WeakMap(), _DadsMenuListItem_isSyncingAutoEndIcon = new WeakMap(), _DadsMenuListItem_handleSlotsChanged = new WeakMap(), _DadsMenuListItem_instances = new WeakSet(), _DadsMenuListItem_isLink = function _DadsMenuListItem_isLink() {
    return this.hasAttribute('href');
}, _DadsMenuListItem_isInsideMenuListBox = function _DadsMenuListItem_isInsideMenuListBox() {
    let current = this.parentElement;
    while (current) {
        if (current.localName.endsWith('-menu-list-box'))
            return true;
        current = current.parentElement;
    }
    return false;
}, _DadsMenuListItem_renderTemplate = function _DadsMenuListItem_renderTemplate() {
    if (!this.shadowRoot)
        return;
    const template = __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_createTemplate).call(this, __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_isLink).call(this));
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    __classPrivateFieldSet(this, _DadsMenuListItem_base, this.shadowRoot.querySelector('#base'), "f");
    __classPrivateFieldSet(this, _DadsMenuListItem_startSlot, this.shadowRoot.querySelector('#start-icon-slot'), "f");
    __classPrivateFieldSet(this, _DadsMenuListItem_tailSlot, this.shadowRoot.querySelector('#tail-icon-slot'), "f");
    __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_setupSlotListeners).call(this);
    __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncIconFallbackVisibility).call(this);
    __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_syncLinkAttributes).call(this);
}, _DadsMenuListItem_createTemplate = function _DadsMenuListItem_createTemplate(isLink) {
    const template = document.createElement('template');
    const inner = menuListItemInnerHtml;
    if (isLink) {
        // Create anchor element safely to prevent XSS via javascript: URLs
        const anchor = document.createElement('a');
        anchor.setAttribute('part', 'base');
        anchor.setAttribute('id', 'base');
        const href = this.getAttribute('href') || '#';
        // Validate URL scheme - only allow safe URL types
        const isValidUrl = href === '#' ||
            href.startsWith('/') ||
            href.startsWith('#') ||
            href.startsWith('./') ||
            href.startsWith('../') ||
            /^https?:\/\//i.test(href) ||
            /^mailto:/i.test(href) ||
            /^tel:/i.test(href);
        if (isValidUrl) {
            anchor.href = href;
        }
        else {
            // Fallback to '#' for potentially malicious URLs (e.g., javascript:)
            anchor.href = '#';
        }
        anchor.innerHTML = inner;
        const childrenSlot = document.createElement('slot');
        childrenSlot.setAttribute('name', 'children');
        template.content.append(anchor, childrenSlot);
    }
    else {
        template.innerHTML = `
        <button part="base" id="base" type="button">
          ${inner}
        </button>
        <slot name="children"></slot>
      `;
    }
    return template;
}, _DadsMenuListItem_syncChildSlotting = function _DadsMenuListItem_syncChildSlotting() {
    const children = Array.from(this.children);
    let hasChildrenMenuList = false;
    for (const child of children) {
        const slot = child.getAttribute('slot');
        if (child.localName.endsWith('-menu-list')) {
            hasChildrenMenuList = true;
        }
        if (slot)
            continue;
        if (child.localName.endsWith('-menu-list')) {
            child.setAttribute('slot', 'children');
        }
    }
    return hasChildrenMenuList;
}, _DadsMenuListItem_hasChildrenMenuList = function _DadsMenuListItem_hasChildrenMenuList() {
    return Array.from(this.children).some((child) => child.localName.endsWith('-menu-list'));
}, _DadsMenuListItem_syncAutoEndIcon = function _DadsMenuListItem_syncAutoEndIcon(hasChildrenMenuList) {
    if (!__classPrivateFieldGet(this, _DadsMenuListItem_isEndIconAuto, "f"))
        return;
    const hasEndIconAttr = this.hasAttribute('end-icon');
    const endIcon = (this.getAttribute('end-icon') ?? 'none');
    const shouldShowCaret = this.hasAttribute('expanded') || hasChildrenMenuList;
    const next = shouldShowCaret ? 'caret' : 'none';
    if (hasEndIconAttr && endIcon === next)
        return;
    __classPrivateFieldSet(this, _DadsMenuListItem_isSyncingAutoEndIcon, true, "f");
    this.setAttribute('end-icon', next);
    __classPrivateFieldSet(this, _DadsMenuListItem_isSyncingAutoEndIcon, false, "f");
}, _DadsMenuListItem_syncLinkAttributes = function _DadsMenuListItem_syncLinkAttributes() {
    const base = __classPrivateFieldGet(this, _DadsMenuListItem_base, "f");
    if (!base)
        return;
    if (!(base instanceof HTMLAnchorElement))
        return;
    const target = this.getAttribute('target');
    const rel = this.getAttribute('rel');
    const download = this.hasAttribute('download');
    if (target)
        base.setAttribute('target', target);
    else
        base.removeAttribute('target');
    if (rel)
        base.setAttribute('rel', rel);
    else
        base.removeAttribute('rel');
    if (download)
        base.setAttribute('download', '');
    else
        base.removeAttribute('download');
}, _DadsMenuListItem_setupSlotListeners = function _DadsMenuListItem_setupSlotListeners() {
    if (__classPrivateFieldGet(this, _DadsMenuListItem_startSlot, "f")) {
        __classPrivateFieldGet(this, _DadsMenuListItem_startSlot, "f").removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsMenuListItem_handleSlotsChanged, "f"));
        __classPrivateFieldGet(this, _DadsMenuListItem_startSlot, "f").addEventListener('slotchange', __classPrivateFieldGet(this, _DadsMenuListItem_handleSlotsChanged, "f"));
    }
    if (__classPrivateFieldGet(this, _DadsMenuListItem_tailSlot, "f")) {
        __classPrivateFieldGet(this, _DadsMenuListItem_tailSlot, "f").removeEventListener('slotchange', __classPrivateFieldGet(this, _DadsMenuListItem_handleSlotsChanged, "f"));
        __classPrivateFieldGet(this, _DadsMenuListItem_tailSlot, "f").addEventListener('slotchange', __classPrivateFieldGet(this, _DadsMenuListItem_handleSlotsChanged, "f"));
    }
}, _DadsMenuListItem_hasSlottedContent = function _DadsMenuListItem_hasSlottedContent(slot, slotName) {
    const hasAssigned = (() => {
        const s = slot;
        if (!s)
            return false;
        const nodes = s.assignedNodes({ flatten: true });
        for (const node of nodes) {
            // Some environments may incorrectly include fallback nodes as "assigned".
            // Fallback nodes are contained in the <slot> itself; real slotted nodes are not.
            if (s.contains(node))
                continue;
            if (node.nodeType === Node.ELEMENT_NODE)
                return true;
            if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() !== '')
                return true;
        }
        return false;
    })();
    if (hasAssigned)
        return true;
    // Fallback: some environments (e.g. happy-dom) may not fully implement slot assignment.
    return this.querySelector(`[slot="${slotName}"]`) !== null;
}, _DadsMenuListItem_syncIconFallbackVisibility = function _DadsMenuListItem_syncIconFallbackVisibility() {
    const hasStartSlot = __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_hasSlottedContent).call(this, __classPrivateFieldGet(this, _DadsMenuListItem_startSlot, "f"), 'start-icon');
    this.toggleAttribute('data-has-start-icon', hasStartSlot);
    // Tail icon wrapper is only shown when:
    // - slot has assigned nodes, OR
    // - tail-icon attribute is not "none"
    const tailKind = (this.getAttribute('tail-icon') ?? 'none');
    const hasTailSlot = __classPrivateFieldGet(this, _DadsMenuListItem_instances, "m", _DadsMenuListItem_hasSlottedContent).call(this, __classPrivateFieldGet(this, _DadsMenuListItem_tailSlot, "f"), 'tail-icon');
    const shouldShowTail = tailKind !== 'none' || hasTailSlot;
    this.toggleAttribute('data-has-tail-icon', shouldShowTail);
    // End icon fallbacks: show one of the fallback svgs
    const endKind = (this.getAttribute('end-icon') ?? 'arrow-right');
    const endIcon = this.shadowRoot?.querySelector('[part="end-icon"]');
    if (endIcon) {
        const arrow = endIcon.querySelector('[data-icon="arrow-right"]');
        const caret = endIcon.querySelector('[data-icon="caret"]');
        if (arrow)
            arrow.toggleAttribute('hidden', endKind !== 'arrow-right');
        if (caret)
            caret.toggleAttribute('hidden', endKind !== 'caret');
    }
};
DadsMenuListItem.definition = {
    name: 'dads-menu-list-item',
    template: html `
      <button part="base" type="button" id="base">
        ${menuListItemInnerHtml}
      </button>
      <slot name="children"></slot>
    `,
    styles: withReset([applyDADSTokens(), applySpacingTokens(), menuListTokens, menuListItemStyles], 'minimal'),
    attributes: [
        PropertyAttr('variant'),
        PropertyAttr('size'),
        BooleanAttr('current'),
        BooleanAttr('expanded'),
        PropertyAttr('end-icon'),
        PropertyAttr('tail-icon'),
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        BooleanAttr('download'),
    ],
};
