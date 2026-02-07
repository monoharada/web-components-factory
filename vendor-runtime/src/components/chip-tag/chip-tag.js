/**
 * @module chip-tag
 * デジタル庁デザインシステム チップタグコンポーネント
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
var _DadsChipTag_instances, _DadsChipTag_base, _DadsChipTag_action, _DadsChipTag_labelSlot, _DadsChipTag_valueText, _DadsChipTag_syncActionState, _DadsChipTag_syncActionLabel, _DadsChipTag_syncValueLabel, _DadsChipTag_handleActionClick, _DadsChipTag_handleDadsCommand, _DadsChipTag_requestRemove, _DadsChipTag_handleBaseClick, _DadsChipTag_handleBaseKeydown, _DadsChipTag_getLabelText;
import { html, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { chipTagTokens } from './chip-tag-tokens.js';
import { chipTagStyles } from './chip-tag-styles.js';
/**
 * チップタグコンポーネント
 *
 * @customElement dads-chip-tag
 * @tagname dads-chip-tag
 *
 * @slot start-icon - 先頭アイコン（オプション）
 * @slot default - ラベルテキスト
 * @slot end-icon - 末尾アイコン（オプション / 削除アクション用）
 *
 * @csspart base - チップタグ本体
 * @csspart start-icon - 先頭アイコンスロット
 * @csspart label - ラベルテキストコンテナ
 * @csspart value - value属性の表示テキスト
 * @csspart action - 末尾アクションボタン
 * @csspart action-icon - 末尾アイコンコンテナ
 *
 * @attr {'remove' | 'none'} action - 末尾アクションの表示制御
 * @attr {string} remove-label - 末尾アクションのaria-label
 * @attr {string} value - 任意の値（イベントdetailに含まれる）
 * @attr {string} size - サイズ (sm | md | lg)
 *
 * @cssprop --dads-chip-tag-background - 背景色
 * @cssprop --dads-chip-tag-border-color - 枠線色
 * @cssprop --dads-chip-tag-border-width - 枠線の太さ
 * @cssprop --dads-chip-tag-border-shadow - 外周の補助線
 * @cssprop --dads-chip-tag-border-shadow-hover - hover時の外周補助線
 * @cssprop --dads-chip-tag-text-color - テキスト色
 * @cssprop --dads-chip-tag-text-color-hover - hover時のテキスト色
 * @cssprop --dads-chip-tag-text-color-active - active時のテキスト色
 * @cssprop --dads-chip-tag-border-radius - 角丸
 * @cssprop --dads-chip-tag-min-height - 最小高さ
 * @cssprop --dads-chip-tag-padding-block - 上下パディング
 * @cssprop --dads-chip-tag-padding-inline - 左右パディング
 * @cssprop --dads-chip-tag-label-padding-inline - ラベルの左右パディング
 * @cssprop --dads-chip-tag-label-padding-bottom - ラベルの下パディング
 * @cssprop --dads-chip-tag-label-text-decoration - ラベルの装飾線
 * @cssprop --dads-chip-tag-label-underline-thickness - ラベル下線の太さ
 * @cssprop --dads-chip-tag-label-underline-thickness-hover - hover/active時のラベル下線の太さ
 * @cssprop --dads-chip-tag-label-underline-offset - ラベル下線のオフセット
 * @cssprop --dads-chip-tag-icon-size - アイコンサイズ
 * @cssprop --dads-chip-tag-action-hit-area - アクションのヒット領域（見た目は維持したまま拡張）
 * @cssprop --dads-chip-tag-action-icon-size - アクション内アイコンサイズ
 *
 * @fires dads-chip-tag-remove - 末尾アクション押下時に発火（detail: { label, value, remove() })
 * @fires dads-chip-tag-click - action="none"時、チップ本体押下で発火（detail: { label, value })
 *
 * NOTE: Invoker API / commandfor は現時点では採用せず、CustomEvent で操作を公開します。
 *
 * @example
 * ```html
 * <dads-chip-tag>
 *   <svg slot="start-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
 *     <path d="..."/>
 *   </svg>
 *   ラベル
 * </dads-chip-tag>
 * ```
 */
export class DadsChipTag extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsChipTag_instances.add(this);
        _DadsChipTag_base.set(this, null);
        _DadsChipTag_action.set(this, null);
        _DadsChipTag_labelSlot.set(this, null);
        _DadsChipTag_valueText.set(this, null);
        _DadsChipTag_handleActionClick.set(this, (event) => {
            if (this.getAttribute('action') === 'none')
                return;
            event.stopPropagation();
            __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_requestRemove).call(this);
        });
        _DadsChipTag_handleDadsCommand.set(this, (event) => {
            if (event.target !== this)
                return;
            const command = event.detail?.command ?? '';
            if (command === 'remove') {
                if (this.getAttribute('action') === 'none')
                    return;
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_requestRemove).call(this);
                return;
            }
            if (command === 'click') {
                if (this.getAttribute('action') !== 'none')
                    return;
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsChipTag_handleBaseClick, "f").call(this);
            }
        });
        _DadsChipTag_handleBaseClick.set(this, () => {
            if (this.getAttribute('action') !== 'none')
                return;
            this.dispatchEvent(new CustomEvent('dads-chip-tag-click', {
                bubbles: true,
                composed: true,
                detail: {
                    label: __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_getLabelText).call(this),
                    value: this.getAttribute('value'),
                },
            }));
        });
        _DadsChipTag_handleBaseKeydown.set(this, (event) => {
            if (this.getAttribute('action') !== 'none')
                return;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                __classPrivateFieldGet(this, _DadsChipTag_handleBaseClick, "f").call(this);
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        setDefaultAttributes(this, { action: 'remove', 'remove-label': '削除', size: 'md' });
        __classPrivateFieldSet(this, _DadsChipTag_base, this.shadowRoot?.querySelector('[part="base"]') ?? null, "f");
        __classPrivateFieldSet(this, _DadsChipTag_action, this.shadowRoot?.querySelector('[part="action"]') ?? null, "f");
        __classPrivateFieldSet(this, _DadsChipTag_labelSlot, this.shadowRoot?.querySelector('slot:not([name])') ?? null, "f");
        __classPrivateFieldSet(this, _DadsChipTag_valueText, this.shadowRoot?.querySelector('[data-value-text]') ?? null, "f");
        __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_syncActionState).call(this);
        __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_syncActionLabel).call(this);
        __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_syncValueLabel).call(this);
        this.addEventListener('dads-command', __classPrivateFieldGet(this, _DadsChipTag_handleDadsCommand, "f"));
        __classPrivateFieldGet(this, _DadsChipTag_base, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsChipTag_handleBaseClick, "f"));
        __classPrivateFieldGet(this, _DadsChipTag_base, "f")?.addEventListener('keydown', __classPrivateFieldGet(this, _DadsChipTag_handleBaseKeydown, "f"));
        __classPrivateFieldGet(this, _DadsChipTag_action, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsChipTag_handleActionClick, "f"));
    }
    disconnectedCallback() {
        this.removeEventListener('dads-command', __classPrivateFieldGet(this, _DadsChipTag_handleDadsCommand, "f"));
        __classPrivateFieldGet(this, _DadsChipTag_base, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsChipTag_handleBaseClick, "f"));
        __classPrivateFieldGet(this, _DadsChipTag_base, "f")?.removeEventListener('keydown', __classPrivateFieldGet(this, _DadsChipTag_handleBaseKeydown, "f"));
        __classPrivateFieldGet(this, _DadsChipTag_action, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsChipTag_handleActionClick, "f"));
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === 'action') {
            __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_syncActionState).call(this);
        }
        if (name === 'remove-label') {
            __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_syncActionLabel).call(this);
        }
        if (name === 'value') {
            __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_syncValueLabel).call(this);
        }
    }
}
_DadsChipTag_base = new WeakMap(), _DadsChipTag_action = new WeakMap(), _DadsChipTag_labelSlot = new WeakMap(), _DadsChipTag_valueText = new WeakMap(), _DadsChipTag_handleActionClick = new WeakMap(), _DadsChipTag_handleDadsCommand = new WeakMap(), _DadsChipTag_handleBaseClick = new WeakMap(), _DadsChipTag_handleBaseKeydown = new WeakMap(), _DadsChipTag_instances = new WeakSet(), _DadsChipTag_syncActionState = function _DadsChipTag_syncActionState() {
    const isActionNone = this.getAttribute('action') === 'none';
    if (__classPrivateFieldGet(this, _DadsChipTag_base, "f")) {
        if (isActionNone) {
            __classPrivateFieldGet(this, _DadsChipTag_base, "f").setAttribute('role', 'button');
            __classPrivateFieldGet(this, _DadsChipTag_base, "f").setAttribute('tabindex', '0');
        }
        else {
            __classPrivateFieldGet(this, _DadsChipTag_base, "f").removeAttribute('role');
            __classPrivateFieldGet(this, _DadsChipTag_base, "f").removeAttribute('tabindex');
        }
    }
    if (__classPrivateFieldGet(this, _DadsChipTag_action, "f")) {
        __classPrivateFieldGet(this, _DadsChipTag_action, "f").tabIndex = isActionNone ? -1 : 0;
        __classPrivateFieldGet(this, _DadsChipTag_action, "f").setAttribute('aria-hidden', isActionNone ? 'true' : 'false');
    }
}, _DadsChipTag_syncActionLabel = function _DadsChipTag_syncActionLabel() {
    if (!__classPrivateFieldGet(this, _DadsChipTag_action, "f"))
        return;
    const label = this.getAttribute('remove-label') || '削除';
    __classPrivateFieldGet(this, _DadsChipTag_action, "f").setAttribute('aria-label', label);
}, _DadsChipTag_syncValueLabel = function _DadsChipTag_syncValueLabel() {
    const value = this.getAttribute('value') ?? '';
    const hasValue = value.trim().length > 0;
    this.toggleAttribute('data-has-value', hasValue);
    if (__classPrivateFieldGet(this, _DadsChipTag_valueText, "f")) {
        __classPrivateFieldGet(this, _DadsChipTag_valueText, "f").textContent = hasValue ? value : '';
    }
}, _DadsChipTag_requestRemove = function _DadsChipTag_requestRemove() {
    const removeEvent = new CustomEvent('dads-chip-tag-remove', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
            label: __classPrivateFieldGet(this, _DadsChipTag_instances, "m", _DadsChipTag_getLabelText).call(this),
            value: this.getAttribute('value'),
            remove: () => this.remove(),
        },
    });
    this.dispatchEvent(removeEvent);
    if (!removeEvent.defaultPrevented) {
        this.remove();
    }
}, _DadsChipTag_getLabelText = function _DadsChipTag_getLabelText() {
    const slot = __classPrivateFieldGet(this, _DadsChipTag_labelSlot, "f");
    if (!slot)
        return '';
    const nodes = slot.assignedNodes({ flatten: true });
    return nodes.map((node) => node.textContent ?? '').join('').trim();
};
DadsChipTag.definition = {
    name: 'dads-chip-tag',
    template: html `
      <span part="base">
        <slot name="start-icon" part="start-icon"></slot>
        <span part="label">
          <span part="value" data-value-text></span>
          <slot></slot>
        </span>
        <button part="action" type="button">
          <span part="action-icon">
            <slot name="end-icon">
              <svg width="24" height="24" viewBox="0 0 19 19" fill="currentcolor" aria-hidden="true">
                <path d="M5.89998 14.1538L9.49998 10.5538L13.1 14.1538L14.1538 13.1L10.5538 9.49998L14.1538 5.89998L13.1 4.84615L9.49998 8.44615L5.89998 4.84615L4.84615 5.89998L8.44615 9.49998L4.84615 13.1L5.89998 14.1538Z" />
              </svg>
            </slot>
          </span>
        </button>
      </span>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        chipTagTokens,
        chipTagStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('action'),
        PropertyAttr('remove-label'),
        PropertyAttr('value'),
        PropertyAttr('size'),
    ],
};
