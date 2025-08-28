// behaviors.ts
// TypeScript port of behaviors.js

import { isNotWhitespace } from './dom';

function updateLabel(slot: HTMLSlotElement, target: HTMLElement): void {
  const nodes = slot.assignedNodes().filter(isNotWhitespace);
  if (nodes.length > 0) {
    target.style.removeProperty('display');
  } else {
    target.style.display = 'none';
  }
}

type WithRefs = { refs: Record<string, any> };

export function applyHideEmptySlotBehavior(
  type: { prototype: HTMLElement & WithRefs & { connectedCallback?: () => void } },
  slotId: string = 'defaultSlot',
  targetId: string = 'label',
): void {
  const handler: EventListenerObject = {
    handleEvent(event: Event) {
      const slot = event.target as HTMLSlotElement;
      const root = slot.getRootNode();

      let target: HTMLElement | null = null;
      if (root instanceof Document || root instanceof ShadowRoot) {
        const el = root.getElementById(targetId);
        target = el instanceof HTMLElement ? el : null;
      }

      if (target) updateLabel(slot, target);
    },
  };

  const proto = type.prototype as HTMLElement & WithRefs & { connectedCallback?: () => void };
  const originalConnectedCallback = proto.connectedCallback;
  proto.connectedCallback = function (this: HTMLElement & WithRefs) {
    originalConnectedCallback?.call(this as any);
    const slotEl = this.refs[slotId] as HTMLSlotElement;
    const targetEl = this.refs[targetId] as HTMLElement;
    slotEl.addEventListener('slotchange', handler);
    updateLabel(slotEl, targetEl);
  };
}

export function applyStandardFormElementBehavior(
  type: {
    prototype: HTMLElement &
      WithRefs & {
        formResetCallback?: () => void;
        formStateRestoreCallback?: (state: unknown, mode: unknown) => void;
        formDisabledCallback?: (disabled: boolean) => void;
        readOnlyChanged?: (oldValue: unknown, newValue: unknown) => void;
        _internals?: ElementInternals;
        readOnly?: boolean;
        value?: unknown;
        getAttribute: (name: string) => string | null;
      };
  },
  resetProperty: string = 'value',
  resetAttribute: string = resetProperty,
): void {
  const proto = type.prototype;

  if (!proto.formResetCallback) {
    proto.formResetCallback = function () {
      (this as any)[resetProperty] = this.getAttribute(resetAttribute as string);
    };
  }

  if (!proto.formStateRestoreCallback) {
    proto.formStateRestoreCallback = function (state: unknown, _mode: unknown) {
      if (state != null) {
        (this as any).value = state as any;
      }
    };
  }

  const originalDisabledCallback = proto.formDisabledCallback;
  proto.formDisabledCallback = function (disabled: boolean) {
    originalDisabledCallback?.call(this as any, disabled);
    if (this.refs?.control) {
      this.refs.control.disabled = disabled;
    }
  };

  const originalReadOnlyChanged = proto.readOnlyChanged;
  proto.readOnlyChanged = function (ov: unknown, nv: unknown) {
    originalReadOnlyChanged?.call(this as any, ov, nv);
    if (this.refs?.control) {
      this.refs.control.readOnly = !!(this as any).readOnly;
    }
    if ((this as any)._internals) {
      (this as any)._internals.ariaReadOnly = (this as any).readOnly ? 'true' : 'false';
    }
  };
}
