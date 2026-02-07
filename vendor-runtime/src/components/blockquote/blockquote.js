/**
 * @module blockquote
 * デジタル庁デザインシステム 引用ブロックコンポーネント
 * @version 1.1.0
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
var _DadsBlockquote_instances, _DadsBlockquote_observer, _DadsBlockquote_blockquote_get, _DadsBlockquote_getSlot, _DadsBlockquote_leadSlot_get, _DadsBlockquote_bodySlot_get, _DadsBlockquote_closeSlot_get, _DadsBlockquote_updateSlotVisibility, _DadsBlockquote_collectChildren, _DadsBlockquote_distributeUnslotted, _DadsBlockquote_distributeWithExplicitLead, _DadsBlockquote_distributeWithExplicitClose, _DadsBlockquote_distributeByCount, _DadsBlockquote_assignSlots;
import { html, PropertyAttr, } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { blockquoteTokens } from './blockquote-tokens.js';
import { blockquoteStyles } from './blockquote-styles.js';
import { withReset } from '../../styles/reset-css.js';
/**
 * 引用ブロックコンポーネント
 *
 * ## 自動スロット割り当て
 * slot属性を指定しない要素は、明示的slot指定の有無に応じて振り分けられる：
 *
 * ### 明示的slot指定がない場合（要素数ベース）
 * - 1要素: lead
 * - 2要素: 最初→lead, 最後→body
 * - 3要素以上: 最初→lead, 中間→body, 最後→close
 *
 * ### 明示的slot指定がある場合
 * - lead/close両方指定: 残り全て→body
 * - leadのみ指定: 最後→close, 残り→body
 * - closeのみ指定: 最初→lead, 残り→body
 *
 * @customElement dads-blockquote
 * @tagname dads-blockquote
 *
 * @slot lead - 冒頭コンテンツ（最初の段落など）
 * @slot default - 本文コンテンツ（中間の段落群）
 * @slot close - 締め括りコンテンツ（最後の段落、出典など）
 *
 * @csspart blockquote - 引用ブロック要素（セマンティック・グリッドレイアウト・視覚スタイル）
 * @csspart lead - 冒頭スロット
 * @csspart body - 本文スロット
 * @csspart close - 締め括りスロット
 *
 * @attr {string} cite - 引用元URL
 *
 * @example
 * ```html
 * <!-- 自動スロット割り当て（3要素以上） -->
 * <dads-blockquote>
 *   <p>冒頭の段落（自動的にleadへ）</p>
 *   <p>本文の段落（自動的にbodyへ）</p>
 *   <p>締め括りの段落（自動的にcloseへ）</p>
 * </dads-blockquote>
 *
 * <!-- 明示的slot指定との混在（残りは全てbodyへ） -->
 * <dads-blockquote cite="https://example.com">
 *   <p slot="lead">冒頭の段落です。</p>
 *   <p>本文の段落1です。（bodyへ）</p>
 *   <p>本文の段落2です。（bodyへ）</p>
 *   <p slot="close">締め括りの段落です。</p>
 * </dads-blockquote>
 * ```
 */
export class DadsBlockquote extends TypographyWebComponent {
    constructor() {
        super(...arguments);
        _DadsBlockquote_instances.add(this);
        _DadsBlockquote_observer.set(this, null);
    }
    // cite属性を監視対象として明示的に定義（ベースクラスでは自動処理されないため必須）
    static get observedAttributes() {
        return ['cite'];
    }
    connectedCallback() {
        super.connectedCallback();
        // cite属性の初期同期
        const cite = this.getAttribute('cite');
        if (cite && __classPrivateFieldGet(this, _DadsBlockquote_instances, "a", _DadsBlockquote_blockquote_get)) {
            __classPrivateFieldGet(this, _DadsBlockquote_instances, "a", _DadsBlockquote_blockquote_get).setAttribute('cite', cite);
        }
        // 子要素の変更を監視
        __classPrivateFieldSet(this, _DadsBlockquote_observer, new MutationObserver(() => __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_assignSlots).call(this)), "f");
        __classPrivateFieldGet(this, _DadsBlockquote_observer, "f").observe(this, { childList: true });
        // 初期スロット割り当て
        __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_assignSlots).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsBlockquote_observer, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsBlockquote_observer, null, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        const blockquote = __classPrivateFieldGet(this, _DadsBlockquote_instances, "a", _DadsBlockquote_blockquote_get);
        if (name === 'cite' && blockquote) {
            if (newValue) {
                blockquote.setAttribute('cite', newValue);
            }
            else {
                blockquote.removeAttribute('cite');
            }
        }
    }
}
_DadsBlockquote_observer = new WeakMap(), _DadsBlockquote_instances = new WeakSet(), _DadsBlockquote_blockquote_get = function _DadsBlockquote_blockquote_get() {
    return this.shadowRoot?.querySelector('[part="blockquote"]');
}, _DadsBlockquote_getSlot = function _DadsBlockquote_getSlot(id) {
    return this.shadowRoot?.getElementById(id);
}, _DadsBlockquote_leadSlot_get = function _DadsBlockquote_leadSlot_get() { return __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_getSlot).call(this, 'lead-slot'); }, _DadsBlockquote_bodySlot_get = function _DadsBlockquote_bodySlot_get() { return __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_getSlot).call(this, 'body-slot'); }, _DadsBlockquote_closeSlot_get = function _DadsBlockquote_closeSlot_get() { return __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_getSlot).call(this, 'close-slot'); }, _DadsBlockquote_updateSlotVisibility = function _DadsBlockquote_updateSlotVisibility(slot) {
    slot.toggleAttribute('hidden', slot.assignedNodes().length === 0);
}, _DadsBlockquote_collectChildren = function _DadsBlockquote_collectChildren() {
    const explicitLead = [];
    const explicitClose = [];
    const unslotted = [];
    for (const child of this.children) {
        const slotAttr = child.getAttribute('slot');
        if (slotAttr === 'lead') {
            explicitLead.push(child);
        }
        else if (slotAttr === 'close') {
            explicitClose.push(child);
        }
        else if (!slotAttr) {
            unslotted.push(child);
        }
        // slot属性が他の値の場合は無視
    }
    return { explicitLead, explicitClose, unslotted };
}, _DadsBlockquote_distributeUnslotted = function _DadsBlockquote_distributeUnslotted(unslotted, hasExplicitLead, hasExplicitClose) {
    if (unslotted.length === 0) {
        return { lead: [], body: [], close: [] };
    }
    if (hasExplicitLead && hasExplicitClose) {
        // lead/close両方が明示指定 → 全てbodyへ
        return { lead: [], body: unslotted, close: [] };
    }
    if (hasExplicitLead) {
        return __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_distributeWithExplicitLead).call(this, unslotted);
    }
    if (hasExplicitClose) {
        return __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_distributeWithExplicitClose).call(this, unslotted);
    }
    return __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_distributeByCount).call(this, unslotted);
}, _DadsBlockquote_distributeWithExplicitLead = function _DadsBlockquote_distributeWithExplicitLead(unslotted) {
    if (unslotted.length >= 2) {
        return {
            lead: [],
            body: unslotted.slice(0, -1),
            close: [unslotted[unslotted.length - 1]],
        };
    }
    return { lead: [], body: unslotted, close: [] };
}, _DadsBlockquote_distributeWithExplicitClose = function _DadsBlockquote_distributeWithExplicitClose(unslotted) {
    return {
        lead: [unslotted[0]],
        body: unslotted.slice(1),
        close: [],
    };
}, _DadsBlockquote_distributeByCount = function _DadsBlockquote_distributeByCount(unslotted) {
    const count = unslotted.length;
    if (count === 1) {
        return { lead: [unslotted[0]], body: [], close: [] };
    }
    if (count === 2) {
        return { lead: [unslotted[0]], body: [unslotted[1]], close: [] };
    }
    // 3要素以上
    return {
        lead: [unslotted[0]],
        body: unslotted.slice(1, -1),
        close: [unslotted[unslotted.length - 1]],
    };
}, _DadsBlockquote_assignSlots = function _DadsBlockquote_assignSlots() {
    const leadSlot = __classPrivateFieldGet(this, _DadsBlockquote_instances, "a", _DadsBlockquote_leadSlot_get);
    const bodySlot = __classPrivateFieldGet(this, _DadsBlockquote_instances, "a", _DadsBlockquote_bodySlot_get);
    const closeSlot = __classPrivateFieldGet(this, _DadsBlockquote_instances, "a", _DadsBlockquote_closeSlot_get);
    if (!leadSlot || !bodySlot || !closeSlot)
        return;
    const { explicitLead, explicitClose, unslotted } = __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_collectChildren).call(this);
    const auto = __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_distributeUnslotted).call(this, unslotted, explicitLead.length > 0, explicitClose.length > 0);
    // スロットに割り当て
    leadSlot.assign(...explicitLead, ...auto.lead);
    bodySlot.assign(...auto.body);
    closeSlot.assign(...explicitClose, ...auto.close);
    // 可視性更新
    __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_updateSlotVisibility).call(this, leadSlot);
    __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_updateSlotVisibility).call(this, bodySlot);
    __classPrivateFieldGet(this, _DadsBlockquote_instances, "m", _DadsBlockquote_updateSlotVisibility).call(this, closeSlot);
};
DadsBlockquote.definition = {
    name: 'dads-blockquote',
    template: html `
      <blockquote part="blockquote">
        <slot name="lead" id="lead-slot" part="lead"></slot>
        <slot id="body-slot" part="body"></slot>
        <slot name="close" id="close-slot" part="close"></slot>
      </blockquote>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        blockquoteTokens,
        blockquoteStyles,
    ], 'full'),
    attributes: [
        PropertyAttr('cite'),
    ],
    shadowOptions: { mode: 'open', slotAssignment: 'manual' },
};
