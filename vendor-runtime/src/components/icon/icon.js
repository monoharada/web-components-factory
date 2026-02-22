/**
 * @module icon
 * デジタル庁デザインシステム Iconコンポーネント
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
var _DadsIcon_instances, _DadsIcon_svg, _DadsIcon_render, _DadsIcon_syncAccessibility;
import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { iconPaths } from '../../utils/icons.js';
import { iconTokens } from './icon-tokens.js';
import { iconStyles } from './icon-styles.js';
/**
 * アイコンコンポーネント
 *
 * iconPaths に登録されたSVGアイコンを宣言的に表示する汎用コンポーネント。
 * 他コンポーネントのスロット（button の icon-start/icon-end、menu-list の start-icon 等）に配置可能。
 *
 * @customElement
 * @tagname dads-icon
 *
 * @csspart svg - SVG要素
 *
 * @attr {string} name - アイコン名（iconPathsのキー: dummy, checkmark, check, edit, delete, duplicate, download, add, subtract, search, print, update, menu, close, home, language, favorite, lock, dragIndicator, more, moreVert, mic, scanner, login, logout, settings, caret, arrowRight, arrowLeft, arrowDown, arrowUp, arrowDropUp, arrowDropDown, arrowUpward, arrowDownward, arrowForward, arrowBack, error, attention, warning, information, help, complete, checkCircle, cancel, notification, history, visibility, visibilityOff, externalLink, document, pdf, image, folder, person, location, checkbox, checkboxBlank, indeterminateCheckbox, radioChecked, radioUnchecked, circle）
 * @attr {string} size - サイズpx（デフォルト: '20'）
 * @attr {string} label - アクセシブルラベル（指定時はaria-hidden解除、role="img"、title要素追加）
 *
 * @cssprop --dads-icon-color - アイコン色（デフォルト: currentColor）
 *
 * @example
 * ```html
 * <dads-icon name="search" size="24"></dads-icon>
 * <dads-icon name="search" size="24" label="検索"></dads-icon>
 * <dads-button>
 *   <dads-icon slot="icon-start" name="search"></dads-icon>
 *   検索
 * </dads-button>
 * ```
 */
export class DadsIcon extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsIcon_instances.add(this);
        _DadsIcon_svg.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsIcon_svg, this.shadowRoot?.querySelector('svg') ?? null, "f");
        __classPrivateFieldGet(this, _DadsIcon_instances, "m", _DadsIcon_render).call(this);
    }
    nameChanged() { __classPrivateFieldGet(this, _DadsIcon_instances, "m", _DadsIcon_render).call(this); }
    sizeChanged() { __classPrivateFieldGet(this, _DadsIcon_instances, "m", _DadsIcon_render).call(this); }
    labelChanged() { __classPrivateFieldGet(this, _DadsIcon_instances, "m", _DadsIcon_render).call(this); }
}
_DadsIcon_svg = new WeakMap(), _DadsIcon_instances = new WeakSet(), _DadsIcon_render = function _DadsIcon_render() {
    if (!__classPrivateFieldGet(this, _DadsIcon_svg, "f"))
        return;
    const iconName = this.getAttribute('name');
    const pathData = iconName !== null && iconName in iconPaths
        ? iconPaths[iconName]
        : '';
    const sizeStr = this.getAttribute('size') ?? '20';
    const size = /^\d+$/.test(sizeStr) ? sizeStr : '20';
    __classPrivateFieldGet(this, _DadsIcon_svg, "f").setAttribute('width', size);
    __classPrivateFieldGet(this, _DadsIcon_svg, "f").setAttribute('height', size);
    __classPrivateFieldGet(this, _DadsIcon_svg, "f").setAttribute('viewBox', '0 0 24 24');
    let path = __classPrivateFieldGet(this, _DadsIcon_svg, "f").querySelector('path');
    if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").appendChild(path);
    }
    path.setAttribute('d', pathData);
    if (iconName !== null && iconName.length > 0 && !(iconName in iconPaths)) {
        console.warn(`[dads-icon] Unknown icon name: "${iconName}". Available: ${Object.keys(iconPaths).join(', ')}`);
    }
    __classPrivateFieldGet(this, _DadsIcon_instances, "m", _DadsIcon_syncAccessibility).call(this);
}, _DadsIcon_syncAccessibility = function _DadsIcon_syncAccessibility() {
    if (!__classPrivateFieldGet(this, _DadsIcon_svg, "f"))
        return;
    const labelText = this.label;
    if (labelText && labelText.length > 0) {
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").removeAttribute('aria-hidden');
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").setAttribute('role', 'img');
        this.removeAttribute('aria-hidden');
        let title = __classPrivateFieldGet(this, _DadsIcon_svg, "f").querySelector(':scope > title');
        if (!title) {
            title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            __classPrivateFieldGet(this, _DadsIcon_svg, "f").prepend(title);
        }
        title.textContent = labelText;
        title.id = 'icon-title';
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").setAttribute('aria-labelledby', 'icon-title');
    }
    else {
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").setAttribute('aria-hidden', 'true');
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").removeAttribute('role');
        __classPrivateFieldGet(this, _DadsIcon_svg, "f").removeAttribute('aria-labelledby');
        this.setAttribute('aria-hidden', 'true');
        const title = __classPrivateFieldGet(this, _DadsIcon_svg, "f").querySelector(':scope > title');
        if (title)
            title.remove();
    }
};
DadsIcon.version = '1.0.0';
DadsIcon.definition = {
    name: 'dads-icon',
    template: html `<svg part="svg" xmlns="http://www.w3.org/2000/svg"
      fill="currentColor" aria-hidden="true" focusable="false"></svg>`,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        iconTokens,
        iconStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('name'),
        PropertyAttr('size'),
        PropertyAttr('label'),
    ],
};
