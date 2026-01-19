type ControlKind = 'attr' | 'prop' | 'css-var';

type ControlDescriptor = Readonly<{
  kind: ControlKind;
  name: string;
  el: Element;
  defaultValue: string | null;
}>;

type Cleanup = () => void;

const CONTROL_EVENTS = ['dads-change', 'dads-input', 'change', 'input'] as const;

function getEventDetail(event?: Event): unknown {
  if (!event) return null;
  return (event as CustomEvent).detail;
}

function isBooleanControl(control: Element): boolean {
  if (control instanceof HTMLInputElement) return control.type === 'checkbox';

  const anyControl = control as any;
  if (typeof anyControl.checked === 'boolean') return anyControl.checked;
  return control.tagName.toLowerCase() === 'dads-switch';
}

function readControlValue(control: Element, event?: Event): string | boolean {
  const detail = getEventDetail(event) as any;
  if (detail && typeof detail.checked === 'boolean') return detail.checked;
  if (detail && typeof detail.value === 'string') return detail.value;

  const anyControl = control as any;
  if (typeof anyControl.checked === 'boolean') return anyControl.checked;
  if (typeof anyControl.value === 'string') return anyControl.value;

  if (control instanceof HTMLInputElement) {
    return control.type === 'checkbox' ? control.checked : control.value;
  }

  if (control instanceof HTMLSelectElement) return control.value;

  return isBooleanControl(control) ? control.hasAttribute('checked') : '';
}

function parseDefaultValue(desc: ControlDescriptor): string | boolean {
  const def = desc.defaultValue ?? '';
  return isBooleanControl(desc.el) ? def === 'true' : def;
}

function setControlValue(control: Element, value: string | boolean): void {
  if (typeof value === 'boolean') {
    const anyControl = control as any;
    if (typeof anyControl.checked === 'boolean') anyControl.checked = value;
    control.toggleAttribute('checked', value);
    return;
  }

  const anyControl = control as any;
  if (typeof anyControl.value === 'string') {
    anyControl.value = value;
    return;
  }

  if (control instanceof HTMLInputElement) {
    control.value = value;
    return;
  }

  if (control instanceof HTMLSelectElement) {
    control.value = value;
  }
}

function applyToTarget(target: Element, desc: ControlDescriptor, value: string | boolean): void {
  if (desc.kind === 'attr') {
    if (typeof value === 'boolean') {
      target.toggleAttribute(desc.name, value);
      return;
    }

    if (value === '') {
      target.removeAttribute(desc.name);
      return;
    }

    target.setAttribute(desc.name, value);
    return;
  }

  if (desc.kind === 'prop') {
    (target as any)[desc.name] = value;
    return;
  }

  // css-var
  if (!(target instanceof HTMLElement)) return;
  if (typeof value !== 'string' || value === '') {
    target.style.removeProperty(desc.name);
    return;
  }
  target.style.setProperty(desc.name, value);
}

function resolveTarget(root: Element): Element | null {
  if (root.hasAttribute('data-api-target')) return root;

  const explicit = root.querySelector('[data-api-target]');
  if (explicit) return explicit;

  const selector = root.getAttribute('data-api-target-selector');
  if (selector) return root.querySelector(selector);

  return null;
}

export function bindApiControls(root: Element): Cleanup {
  const target = resolveTarget(root);
  if (!target) return () => {};

  const controls: ControlDescriptor[] = [];
  root.querySelectorAll('[data-api-attr]').forEach((el) => {
    const name = el.getAttribute('data-api-attr');
    if (!name) return;
    controls.push({ kind: 'attr', name, el, defaultValue: el.getAttribute('data-default') });
  });
  root.querySelectorAll('[data-api-prop]').forEach((el) => {
    const name = el.getAttribute('data-api-prop');
    if (!name) return;
    controls.push({ kind: 'prop', name, el, defaultValue: el.getAttribute('data-default') });
  });
  root.querySelectorAll('[data-api-css-var]').forEach((el) => {
    const name = el.getAttribute('data-api-css-var');
    if (!name) return;
    controls.push({ kind: 'css-var', name, el, defaultValue: el.getAttribute('data-default') });
  });

  const cleanups: Cleanup[] = [];

  const handle = (desc: ControlDescriptor) => (event: Event) => {
    const value = readControlValue(desc.el, event);
    applyToTarget(target, desc, value);
  };

  for (const desc of controls) {
    const onChange = handle(desc);

    for (const eventName of CONTROL_EVENTS) {
      desc.el.addEventListener(eventName, onChange as EventListener);
    }

    cleanups.push(() => {
      for (const eventName of CONTROL_EVENTS) {
        desc.el.removeEventListener(eventName, onChange as EventListener);
      }
    });
  }

  const resetters = root.querySelectorAll('[data-api-reset]');
  resetters.forEach((el) => {
    const onClick = () => {
      for (const desc of controls) {
        const nextValue = parseDefaultValue(desc);
        setControlValue(desc.el, nextValue);
        applyToTarget(target, desc, nextValue);
      }
    };
    el.addEventListener('click', onClick);
    cleanups.push(() => el.removeEventListener('click', onClick));
  });

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
