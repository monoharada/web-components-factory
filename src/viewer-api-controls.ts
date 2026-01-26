type ControlKind = 'attr' | 'prop' | 'css-var';

type ControlDescriptor = Readonly<{
  kind: ControlKind;
  name: string;
  el: Element;
  defaultValue: string | null;
}>;

type Cleanup = () => void;

const CONTROL_EVENTS = ['dads-change', 'dads-input', 'change', 'input'] as const;

type CodeBlockLike = HTMLElement & {
  setCode?: (code: string) => void;
};

type UsageModel = Readonly<{
  fragment: DocumentFragment;
  target: Element | null;
}>;

function getEventDetail(event?: Event): unknown {
  if (!event) return null;
  return (event as CustomEvent).detail;
}

function isBooleanControl(control: Element): boolean {
  if (control instanceof HTMLInputElement) return control.type === 'checkbox';

  const anyControl = control as any;
  if (typeof anyControl.checked === 'boolean') return true;
  return control.tagName.toLowerCase() === 'dads-switch';
}

function readControlValue(control: Element, event?: Event): string | boolean {
  const detail = getEventDetail(event) as any;
  if (detail && typeof detail.checked === 'boolean') return detail.checked;
  if (detail && typeof detail.value === 'string') return detail.value;

  if (control instanceof HTMLInputElement) {
    return control.type === 'checkbox' ? control.checked : control.value;
  }

  if (control instanceof HTMLSelectElement) return control.value;

  const anyControl = control as any;
  if (typeof anyControl.checked === 'boolean') return anyControl.checked;
  if (typeof anyControl.value === 'string') return anyControl.value;

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

function resolveCodeBlock(root: Element): CodeBlockLike | null {
  const explicit = root.querySelector<HTMLElement>('[data-api-code]');
  if (explicit) return explicit as CodeBlockLike;

  const fallback = root.querySelector<HTMLElement>('dads-code-block');
  if (fallback) return fallback as CodeBlockLike;

  return null;
}

function escapeHtmlAttrValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function escapeHtmlText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function kebabCase(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const VOID_HTML_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

function isWhitespaceOnlyTextNode(node: Node): boolean {
  if (!(node instanceof Text)) return false;
  return (node.textContent ?? '').trim() === '';
}

function serializeAttributes(el: Element): string {
  const attrs: string[] = [];
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name;
    const value = attr.value;

    if (value === '') {
      attrs.push(name);
      continue;
    }
    attrs.push(`${name}="${escapeHtmlAttrValue(value)}"`);
  }

  const attrText = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  return attrText;
}

function formatHtmlNodes(nodes: ReadonlyArray<Node>, indentUnit = '  '): string {
  const indent = (depth: number): string => indentUnit.repeat(depth);

  function formatNodes(list: ReadonlyArray<Node>, depth: number): string {
    const out: string[] = [];
    for (const node of list) {
      const formatted = formatNode(node, depth);
      if (formatted === '') continue;
      out.push(formatted);
    }
    return out.join('\n');
  }

  function formatNode(node: Node, depth: number): string {
    if (node instanceof DocumentFragment) {
      return formatNodes(Array.from(node.childNodes), depth);
    }

    if (node instanceof Text) {
      const raw = (node.textContent ?? '').replace(/\r\n?/g, '\n');
      const trimmed = raw.trim();
      if (trimmed === '') return '';

      const lines = trimmed.split('\n').map((line) => `${indent(depth)}${escapeHtmlText(line)}`);
      return lines.join('\n');
    }

    if (!(node instanceof Element)) return '';

    const isHtml = node.namespaceURI === 'http://www.w3.org/1999/xhtml';
    const rawTag = node.tagName;
    const tag = isHtml
      ? rawTag.toLowerCase()
      : rawTag.toUpperCase() === rawTag
        ? rawTag.toLowerCase()
        : rawTag;
    const attrText = serializeAttributes(node);

    const isVoid = isHtml && VOID_HTML_ELEMENTS.has(tag);
    if (isVoid) return `${indent(depth)}<${tag}${attrText}>`;

    const children = Array.from(node.childNodes).filter((child) => !isWhitespaceOnlyTextNode(child));
    if (children.length === 0) return `${indent(depth)}<${tag}${attrText}></${tag}>`;

    if (children.length === 1 && children[0] instanceof Text) {
      const raw = (children[0].textContent ?? '').replace(/\r\n?/g, '\n');
      const trimmed = raw.trim();
      if (trimmed !== '' && !trimmed.includes('\n')) {
        return `${indent(depth)}<${tag}${attrText}>${escapeHtmlText(trimmed)}</${tag}>`;
      }
    }

    const out: string[] = [];
    out.push(`${indent(depth)}<${tag}${attrText}>`);
    for (const child of children) {
      const childStr = formatNode(child, depth + 1);
      if (childStr === '') continue;
      out.push(childStr);
    }
    out.push(`${indent(depth)}</${tag}>`);
    return out.join('\n');
  }

  return formatNodes(nodes, 0).trim();
}

function createUsageModel(block: Element, liveTarget: Element): UsageModel | null {
  const template = block.querySelector('template');
  if (!(template instanceof HTMLTemplateElement)) return null;

  const fragment = template.content.cloneNode(true) as DocumentFragment;

  const liveTag = liveTarget.tagName.toLowerCase();
  const usageTarget =
    fragment.querySelector(liveTag) ??
    fragment.firstElementChild ??
    null;

  return { fragment, target: usageTarget };
}

function syncUsageCode(block: CodeBlockLike | null, usage: UsageModel | null, liveTarget: Element): void {
  if (!block) return;

  const snippet = usage
    ? formatHtmlNodes(Array.from(usage.fragment.childNodes))
    : formatHtmlNodes([liveTarget.cloneNode(true)]);

  if (typeof block.setCode === 'function') {
    block.setCode(snippet);
    return;
  }

  block.textContent = snippet;
}

function applyToUsage(usageTarget: Element, desc: ControlDescriptor, value: string | boolean): void {
  if (desc.kind === 'attr') {
    if (typeof value === 'boolean') {
      usageTarget.toggleAttribute(desc.name, value);
      return;
    }
    if (value === '') {
      usageTarget.removeAttribute(desc.name);
      return;
    }
    const attrNode = usageTarget.getAttributeNode(desc.name);
    if (attrNode) {
      attrNode.value = value;
      return;
    }
    usageTarget.setAttribute(desc.name, value);
    return;
  }

  if (desc.kind === 'prop') {
    if (desc.name === 'textContent' && typeof value === 'string') {
      usageTarget.textContent = value;
      return;
    }

    const attrName = kebabCase(desc.name);
    if (typeof value === 'boolean') {
      usageTarget.toggleAttribute(attrName, value);
      return;
    }
    if (typeof value === 'string') {
      if (value === '') {
        usageTarget.removeAttribute(attrName);
        return;
      }
      usageTarget.setAttribute(attrName, value);
    }
    return;
  }

  // css-var
  if (!(usageTarget instanceof HTMLElement)) return;
  if (typeof value !== 'string' || value === '') {
    usageTarget.style.removeProperty(desc.name);
    return;
  }
  usageTarget.style.setProperty(desc.name, value);
}

export function bindApiControls(root: Element): Cleanup {
  const target = resolveTarget(root);
  if (!target) return () => {};

  const block = resolveCodeBlock(root);
  const usage = block ? createUsageModel(block, target) : null;

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
    if (usage?.target) applyToUsage(usage.target, desc, value);
    syncUsageCode(block, usage, target);
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
        if (usage?.target) applyToUsage(usage.target, desc, nextValue);
      }
      syncUsageCode(block, usage, target);
    };
    el.addEventListener('click', onClick);
    cleanups.push(() => el.removeEventListener('click', onClick));
  });

  syncUsageCode(block, usage, target);

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
