// behaviors.ts
// TypeScript port of behaviors.js
import { isNotWhitespace } from './dom.js';
function updateLabel(slot, target) {
    const nodes = slot.assignedNodes().filter(isNotWhitespace);
    if (nodes.length > 0) {
        target.style.removeProperty('display');
    }
    else {
        target.style.display = 'none';
    }
}
export function applyHideEmptySlotBehavior(type, slotId = 'defaultSlot', targetId = 'label') {
    const handler = {
        handleEvent(event) {
            const slot = event.target;
            const root = slot.getRootNode();
            let target = null;
            if (root instanceof Document || root instanceof ShadowRoot) {
                const el = root.getElementById(targetId);
                target = el instanceof HTMLElement ? el : null;
            }
            if (target)
                updateLabel(slot, target);
        },
    };
    const proto = type.prototype;
    const originalConnectedCallback = proto.connectedCallback;
    proto.connectedCallback = function () {
        originalConnectedCallback?.call(this);
        if (!this.refs)
            return;
        const slotEl = this.refs[slotId];
        const targetEl = this.refs[targetId];
        slotEl.addEventListener('slotchange', handler);
        updateLabel(slotEl, targetEl);
    };
}
export function applyStandardFormElementBehavior(type, resetProperty = 'value', resetAttribute = resetProperty) {
    const proto = type.prototype;
    if (!proto.formResetCallback) {
        proto.formResetCallback = function () {
            const self = this;
            self[resetProperty] = this.getAttribute(resetAttribute);
        };
    }
    if (!proto.formStateRestoreCallback) {
        proto.formStateRestoreCallback = function (state, _mode) {
            if (state != null) {
                const self = this;
                self.value = state;
            }
        };
    }
    const originalDisabledCallback = proto.formDisabledCallback;
    proto.formDisabledCallback = function (disabled) {
        originalDisabledCallback?.call(this, disabled);
        const control = this.refs?.control;
        if (control) {
            control.disabled = disabled;
        }
    };
    const originalReadOnlyChanged = proto.readOnlyChanged;
    proto.readOnlyChanged = function (ov, nv) {
        originalReadOnlyChanged?.call(this, ov, nv);
        const control = this.refs?.control;
        if (control) {
            control.readOnly = !!this.readOnly;
        }
        const internals = this._internals;
        if (internals) {
            internals.ariaReadOnly = this.readOnly ? 'true' : 'false';
        }
    };
}
