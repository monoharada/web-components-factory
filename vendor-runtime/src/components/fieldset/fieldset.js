/**
 * @module fieldset
 * デジタル庁デザインシステム Fieldsetコンポーネント
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
var _DadsFieldset_instances, _DadsFieldset_uniqueId, _DadsFieldset_lastSupportTextId, _DadsFieldset_legendSlot, _DadsFieldset_supportSlot, _DadsFieldset_defaultSlot, _DadsFieldset_legendFallback, _DadsFieldset_supportText, _DadsFieldset_supportFallback, _DadsFieldset_requirement, _DadsFieldset_childObserver, _DadsFieldset_syncAll, _DadsFieldset_syncLegend, _DadsFieldset_syncSupportText, _DadsFieldset_handleSupportSlotChange, _DadsFieldset_handleDefaultSlotChange, _DadsFieldset_syncRequirement, _DadsFieldset_setupChildAriaDescribedBy, _DadsFieldset_propagateDisabled, _DadsFieldset_syncChildRequirements;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { withReset } from '../../styles/reset-css.js';
import { setupSlotChangeListeners, updateLabelFallback, updateSupportFallback, updateRequirement, } from '../../utils/form-component-helpers.js';
import { fieldsetStyles } from './fieldset-styles.js';
/**
 * Fieldsetコンポーネント
 *
 * フォーム要素をグループ化し、legend（凡例）とsupport-text（サポートテキスト）を提供します。
 * 子要素のdads-checkboxやdads-radioにaria-describedbyを自動設定します。
 *
 * @customElement dads-fieldset
 * @tagname dads-fieldset
 *
 * @csspart fieldset - fieldset要素
 * @csspart legend - legend要素
 * @csspart legend-fallback - legend属性のフォールバック表示
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart support-text - サポートテキストコンテナ
 * @csspart support-fallback - support-text属性のフォールバック表示
 * @csspart content - 子要素コンテナ
 *
 * @attr {string} legend - レジェンドテキスト（フォールバック用）
 * @attr {string} support-text - サポートテキスト（フォールバック用）
 * @attr {boolean} required - ※必須ラベルを表示
 * @attr {boolean} disabled - 無効状態（子要素に伝播）
 *
 * @slot legend - カスタムレジェンド
 * @slot support-text - カスタムサポートテキスト
 * @slot - デフォルト（子要素）
 */
export class DadsFieldset extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsFieldset_instances.add(this);
        // 一意ID（aria-describedby用）
        _DadsFieldset_uniqueId.set(this, `dads-fieldset-${crypto.randomUUID().slice(0, 8)}`);
        _DadsFieldset_lastSupportTextId.set(this, null);
        // Slot references
        _DadsFieldset_legendSlot.set(this, null);
        _DadsFieldset_supportSlot.set(this, null);
        _DadsFieldset_defaultSlot.set(this, null);
        // Element references
        _DadsFieldset_legendFallback.set(this, null);
        _DadsFieldset_supportText.set(this, null);
        _DadsFieldset_supportFallback.set(this, null);
        _DadsFieldset_requirement.set(this, null);
        // MutationObserver for child changes
        _DadsFieldset_childObserver.set(this, null);
    }
    static get observedAttributes() {
        return ['legend', 'support-text', 'required', 'disabled'];
    }
    connectedCallback() {
        super.connectedCallback();
        // 要素参照を取得
        __classPrivateFieldSet(this, _DadsFieldset_legendSlot, this.shadowRoot?.querySelector('#legend-slot'), "f");
        __classPrivateFieldSet(this, _DadsFieldset_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsFieldset_defaultSlot, this.shadowRoot?.querySelector('#default-slot'), "f");
        __classPrivateFieldSet(this, _DadsFieldset_legendFallback, this.shadowRoot?.querySelector('#legend-fallback'), "f");
        __classPrivateFieldSet(this, _DadsFieldset_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsFieldset_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsFieldset_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        // スロット変更監視
        setupSlotChangeListeners({
            label: __classPrivateFieldGet(this, _DadsFieldset_legendSlot, "f"),
            support: __classPrivateFieldGet(this, _DadsFieldset_supportSlot, "f"),
        }, {
            onLabelChange: () => __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncLegend).call(this),
            onSupportChange: () => __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_handleSupportSlotChange).call(this),
        });
        // デフォルトスロット監視（子要素のaria設定用）
        __classPrivateFieldGet(this, _DadsFieldset_defaultSlot, "f")?.addEventListener('slotchange', () => __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_handleDefaultSlotChange).call(this));
        // MutationObserverで子要素の変更を監視（happy-domなど一部環境でslotchangeが発火しないため）
        __classPrivateFieldSet(this, _DadsFieldset_childObserver, new MutationObserver(() => {
            __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_setupChildAriaDescribedBy).call(this);
        }), "f");
        __classPrivateFieldGet(this, _DadsFieldset_childObserver, "f").observe(this, { childList: true, subtree: false });
        __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncAll).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsFieldset_childObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsFieldset_childObserver, null, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'legend':
                __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncLegend).call(this);
                break;
            case 'support-text':
                __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_handleSupportSlotChange).call(this);
                break;
            case 'required':
                __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncRequirement).call(this);
                __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncChildRequirements).call(this);
                break;
            case 'disabled':
                __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_propagateDisabled).call(this);
                break;
        }
    }
}
_DadsFieldset_uniqueId = new WeakMap(), _DadsFieldset_lastSupportTextId = new WeakMap(), _DadsFieldset_legendSlot = new WeakMap(), _DadsFieldset_supportSlot = new WeakMap(), _DadsFieldset_defaultSlot = new WeakMap(), _DadsFieldset_legendFallback = new WeakMap(), _DadsFieldset_supportText = new WeakMap(), _DadsFieldset_supportFallback = new WeakMap(), _DadsFieldset_requirement = new WeakMap(), _DadsFieldset_childObserver = new WeakMap(), _DadsFieldset_instances = new WeakSet(), _DadsFieldset_syncAll = function _DadsFieldset_syncAll() {
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncLegend).call(this);
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncSupportText).call(this);
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncRequirement).call(this);
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_setupChildAriaDescribedBy).call(this);
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_propagateDisabled).call(this);
}, _DadsFieldset_syncLegend = function _DadsFieldset_syncLegend() {
    updateLabelFallback(__classPrivateFieldGet(this, _DadsFieldset_legendSlot, "f"), __classPrivateFieldGet(this, _DadsFieldset_legendFallback, "f"), this.getAttribute('legend'));
}, _DadsFieldset_syncSupportText = function _DadsFieldset_syncSupportText() {
    updateSupportFallback(__classPrivateFieldGet(this, _DadsFieldset_supportSlot, "f"), __classPrivateFieldGet(this, _DadsFieldset_supportText, "f"), __classPrivateFieldGet(this, _DadsFieldset_supportFallback, "f"), this.getAttribute('support-text'));
}, _DadsFieldset_handleSupportSlotChange = function _DadsFieldset_handleSupportSlotChange() {
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncSupportText).call(this);
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_setupChildAriaDescribedBy).call(this);
}, _DadsFieldset_handleDefaultSlotChange = function _DadsFieldset_handleDefaultSlotChange() {
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_setupChildAriaDescribedBy).call(this);
    __classPrivateFieldGet(this, _DadsFieldset_instances, "m", _DadsFieldset_syncChildRequirements).call(this);
}, _DadsFieldset_syncRequirement = function _DadsFieldset_syncRequirement() {
    updateRequirement(__classPrivateFieldGet(this, _DadsFieldset_requirement, "f"), this.hasAttribute('required'), false);
}, _DadsFieldset_setupChildAriaDescribedBy = function _DadsFieldset_setupChildAriaDescribedBy() {
    const previousId = __classPrivateFieldGet(this, _DadsFieldset_lastSupportTextId, "f");
    // Light DOM側のsupport-text要素にIDを付与（既存IDがあれば保持）
    const assignedSupport = __classPrivateFieldGet(this, _DadsFieldset_supportSlot, "f")?.assignedElements()[0];
    let nextId = null;
    if (assignedSupport) {
        const existingId = assignedSupport.id.trim();
        if (existingId) {
            nextId = existingId;
        }
        else {
            nextId = `${__classPrivateFieldGet(this, _DadsFieldset_uniqueId, "f")}-support`;
            assignedSupport.id = nextId;
        }
    }
    // スロット要素が無く、かつ過去に設定したIDも無い場合は何もしない
    if (!previousId && !nextId)
        return;
    // 2. 子form要素にaria-describedbyを設定
    const formChildren = this.querySelectorAll('dads-checkbox, dads-radio, dads-input-text, dads-textarea, dads-date-picker, input, select, textarea');
    for (const child of formChildren) {
        const existing = child.getAttribute('aria-describedby') || '';
        const ids = new Set(existing.split(' ').filter(Boolean));
        if (previousId)
            ids.delete(previousId);
        if (nextId)
            ids.add(nextId);
        const describedBy = [...ids].join(' ');
        if (describedBy)
            child.setAttribute('aria-describedby', describedBy);
        else
            child.removeAttribute('aria-describedby');
    }
    __classPrivateFieldSet(this, _DadsFieldset_lastSupportTextId, nextId, "f");
}, _DadsFieldset_propagateDisabled = function _DadsFieldset_propagateDisabled() {
    const isDisabled = this.hasAttribute('disabled');
    const formChildren = this.querySelectorAll('dads-checkbox, dads-radio, dads-input-text, dads-textarea, dads-date-picker');
    for (const child of formChildren) {
        child.toggleAttribute('disabled', isDisabled);
    }
}, _DadsFieldset_syncChildRequirements = function _DadsFieldset_syncChildRequirements() {
    const formChildren = this.querySelectorAll('dads-checkbox, dads-radio');
    for (const child of formChildren) {
        // 子要素のsyncRequirement()メソッドを呼び出す（存在する場合）
        const anyChild = child;
        if (typeof anyChild.syncRequirement === 'function') {
            anyChild.syncRequirement();
        }
    }
};
DadsFieldset.formAssociated = true;
DadsFieldset.version = '1.0.0';
DadsFieldset.definition = {
    name: 'dads-fieldset',
    template: html `
      <fieldset part="fieldset" id="fieldset">
        <legend part="legend" id="legend">
          <slot name="legend" id="legend-slot"></slot>
          <span part="legend-fallback" id="legend-fallback"></span>
          <span part="requirement" id="requirement"></span>
        </legend>

        <div part="support-text" id="support-text">
          <slot name="support-text" id="support-slot"></slot>
          <span part="support-fallback" id="support-fallback"></span>
        </div>

        <div part="content" id="content">
          <slot id="default-slot"></slot>
        </div>
      </fieldset>
    `,
    styles: withReset([applyDADSTokens(), fieldsetStyles], 'minimal'),
    attributes: [
        PropertyAttr('legend'),
        PropertyAttr('support-text'),
        BooleanAttr('required'),
        BooleanAttr('disabled'),
    ],
};
