/**
 * @module avatar
 * デジタル庁デザインシステム Avatarコンポーネント
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
var _DadsAvatar_instances, _DadsAvatar_svg, _DadsAvatar_img, _DadsAvatar_circle, _DadsAvatar_text, _DadsAvatar_render, _DadsAvatar_syncSvgAccessibility;
import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { avatarTokens } from './avatar-tokens.js';
import { avatarStyles } from './avatar-styles.js';
const DEFAULT_SIZE = '32';
const DEFAULT_FILL = 'var(--dads-avatar-background, #949494)';
/**
 * アバターコンポーネント
 *
 * テキストイニシャルまたは写真を円形で表示するアバター。
 * コンボボックスなどの人名選択UIでアイコンとして使用可能。
 *
 * @customElement
 * @tagname dads-avatar
 *
 * @csspart svg - SVG要素（イニシャルモード）
 * @csspart img - img要素（写真モード）
 *
 * @attr {string} src - 写真URL（指定時は写真モード）
 * @attr {string} initials - 表示文字（1〜2文字、写真未指定時のフォールバック）
 * @attr {string} color - 背景色（CSSカスタムプロパティ名, 例: --color-primitive-blue-600）
 * @attr {string} size - サイズpx（デフォルト: '32'）
 * @attr {string} label - アクセシブルラベル（指定時はaria-hidden解除）
 *
 * @cssprop --dads-avatar-background - 背景色（デフォルト: #949494）
 * @cssprop --dads-avatar-text-color - テキスト色（デフォルト: white）
 *
 * @example
 * ```html
 * <dads-avatar src="/photos/taro.jpg" size="32" label="太郎"></dads-avatar>
 * <dads-avatar initials="太" color="--color-primitive-blue-600" size="32"></dads-avatar>
 * ```
 */
export class DadsAvatar extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsAvatar_instances.add(this);
        _DadsAvatar_svg.set(this, null);
        _DadsAvatar_img.set(this, null);
        _DadsAvatar_circle.set(this, null);
        _DadsAvatar_text.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsAvatar_svg, this.shadowRoot?.querySelector('svg') ?? null, "f");
        __classPrivateFieldSet(this, _DadsAvatar_img, this.shadowRoot?.querySelector('img') ?? null, "f");
        __classPrivateFieldSet(this, _DadsAvatar_circle, __classPrivateFieldGet(this, _DadsAvatar_svg, "f")?.querySelector('circle') ?? null, "f");
        __classPrivateFieldSet(this, _DadsAvatar_text, __classPrivateFieldGet(this, _DadsAvatar_svg, "f")?.querySelector('text') ?? null, "f");
        __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_render).call(this);
    }
    srcChanged() { __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_render).call(this); }
    initialsChanged() { __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_render).call(this); }
    colorChanged() { __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_render).call(this); }
    sizeChanged() { __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_render).call(this); }
    labelChanged() { __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_render).call(this); }
}
_DadsAvatar_svg = new WeakMap(), _DadsAvatar_img = new WeakMap(), _DadsAvatar_circle = new WeakMap(), _DadsAvatar_text = new WeakMap(), _DadsAvatar_instances = new WeakSet(), _DadsAvatar_render = function _DadsAvatar_render() {
    if (!__classPrivateFieldGet(this, _DadsAvatar_svg, "f") || !__classPrivateFieldGet(this, _DadsAvatar_img, "f") || !__classPrivateFieldGet(this, _DadsAvatar_circle, "f") || !__classPrivateFieldGet(this, _DadsAvatar_text, "f"))
        return;
    const src = (this.getAttribute('src') ?? '').trim();
    const sizeStr = this.getAttribute('size') ?? DEFAULT_SIZE;
    const size = /^\d+$/.test(sizeStr) ? sizeStr : DEFAULT_SIZE;
    const isPhoto = src.length > 0;
    // モード切替
    __classPrivateFieldGet(this, _DadsAvatar_svg, "f").style.display = isPhoto ? 'none' : '';
    __classPrivateFieldGet(this, _DadsAvatar_img, "f").style.display = isPhoto ? '' : 'none';
    if (isPhoto) {
        __classPrivateFieldGet(this, _DadsAvatar_img, "f").src = src;
        __classPrivateFieldGet(this, _DadsAvatar_img, "f").width = Number(size);
        __classPrivateFieldGet(this, _DadsAvatar_img, "f").height = Number(size);
    }
    else {
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").setAttribute('width', size);
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").setAttribute('height', size);
        const colorValue = this.getAttribute('color') ?? '';
        __classPrivateFieldGet(this, _DadsAvatar_circle, "f").setAttribute('fill', colorValue.length > 0
            ? (colorValue.startsWith('--') ? `var(${colorValue})` : colorValue)
            : DEFAULT_FILL);
        __classPrivateFieldGet(this, _DadsAvatar_text, "f").textContent = (this.getAttribute('initials') ?? '').slice(0, 2);
    }
    // アクセシビリティ
    const labelText = this.label;
    const hasLabel = labelText != null && labelText.length > 0;
    if (hasLabel) {
        this.removeAttribute('aria-hidden');
    }
    else {
        this.setAttribute('aria-hidden', 'true');
    }
    if (isPhoto) {
        __classPrivateFieldGet(this, _DadsAvatar_img, "f").alt = hasLabel ? labelText : '';
    }
    else {
        __classPrivateFieldGet(this, _DadsAvatar_instances, "m", _DadsAvatar_syncSvgAccessibility).call(this, hasLabel, labelText ?? '');
    }
}, _DadsAvatar_syncSvgAccessibility = function _DadsAvatar_syncSvgAccessibility(hasLabel, labelText) {
    if (!__classPrivateFieldGet(this, _DadsAvatar_svg, "f"))
        return;
    if (hasLabel) {
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").removeAttribute('aria-hidden');
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").setAttribute('role', 'img');
        let title = __classPrivateFieldGet(this, _DadsAvatar_svg, "f").querySelector(':scope > title');
        if (!title) {
            title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            __classPrivateFieldGet(this, _DadsAvatar_svg, "f").prepend(title);
        }
        title.textContent = labelText;
        title.id = 'avatar-title';
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").setAttribute('aria-labelledby', 'avatar-title');
    }
    else {
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").setAttribute('aria-hidden', 'true');
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").removeAttribute('role');
        __classPrivateFieldGet(this, _DadsAvatar_svg, "f").removeAttribute('aria-labelledby');
        const title = __classPrivateFieldGet(this, _DadsAvatar_svg, "f").querySelector(':scope > title');
        if (title)
            title.remove();
    }
};
DadsAvatar.version = '1.0.0';
DadsAvatar.definition = {
    name: 'dads-avatar',
    template: html `<svg part="svg" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="24" />
      <text x="24" y="31" text-anchor="middle" font-size="20"
        font-weight="bold" font-family="sans-serif"
        fill="var(--dads-avatar-text-color, white)"></text>
    </svg><img part="img" alt="" />`,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        avatarTokens,
        avatarStyles,
    ], 'minimal'),
    attributes: [
        PropertyAttr('src'),
        PropertyAttr('initials'),
        PropertyAttr('color'),
        PropertyAttr('size'),
        PropertyAttr('label'),
    ],
};
