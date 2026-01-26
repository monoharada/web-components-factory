type ControlKind = 'attr' | 'prop' | 'css-var';

type ControlDescriptor = Readonly<{
  kind: ControlKind;
  name: string;
  el: Element;
  defaultValue: string | null;
  targetSelector: string | null;
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

const CODE_BLOCK_COLLAPSE_MIN_LINES = 5;
const CODE_BLOCK_DISCLOSURE_ATTR = 'data-api-code-disclosure';
const CODE_BLOCK_COLLAPSE_ATTR = 'data-api-code-collapse';
const CODE_BLOCK_COLLAPSE_OPT_OUT_VALUE = 'off';
const CODE_BLOCK_DISCLOSURE_SUMMARY_TEXT = 'コードを表示';

interface CustomEventDetail {
  checked?: boolean;
  value?: string;
}

interface ControlLikeElement extends Element {
  checked?: boolean;
  value?: string;
}

function getEventDetail(event?: Event): CustomEventDetail | null {
  if (!event) return null;
  return (event as CustomEvent<CustomEventDetail>).detail ?? null;
}

function isBooleanControl(control: Element): boolean {
  if (control instanceof HTMLInputElement) return control.type === 'checkbox';

  const controlLike = control as ControlLikeElement;
  if (typeof controlLike.checked === 'boolean') return true;
  return control.tagName.toLowerCase() === 'dads-switch';
}

function readControlValue(control: Element, event?: Event): string | boolean {
  const detail = getEventDetail(event);
  if (detail && typeof detail.checked === 'boolean') return detail.checked;
  if (detail && typeof detail.value === 'string') return detail.value;

  if (control instanceof HTMLInputElement) {
    return control.type === 'checkbox' ? control.checked : control.value;
  }

  if (control instanceof HTMLSelectElement) return control.value;

  const controlLike = control as ControlLikeElement;
  if (typeof controlLike.checked === 'boolean') return controlLike.checked;
  if (typeof controlLike.value === 'string') return controlLike.value;

  return isBooleanControl(control) ? control.hasAttribute('checked') : '';
}

function parseDefaultValue(desc: ControlDescriptor): string | boolean {
  const def = desc.defaultValue ?? '';
  return isBooleanControl(desc.el) ? def === 'true' : def;
}

function setControlValue(control: Element, value: string | boolean): void {
  const controlLike = control as ControlLikeElement;

  if (typeof value === 'boolean') {
    if (typeof controlLike.checked === 'boolean') controlLike.checked = value;
    control.toggleAttribute('checked', value);
    return;
  }

  if (typeof controlLike.value === 'string') {
    controlLike.value = value;
  }
}

interface PropertyTarget {
  [key: string]: unknown;
}

function applyAttributeValue(el: Element, name: string, value: string | boolean, preserveOrder = false): void {
  if (typeof value === 'boolean') {
    el.toggleAttribute(name, value);
    return;
  }
  if (value === '') {
    el.removeAttribute(name);
    return;
  }
  if (preserveOrder) {
    const attrNode = el.getAttributeNode(name);
    if (attrNode) {
      attrNode.value = value;
      return;
    }
  }
  el.setAttribute(name, value);
}

function applyCssVariable(el: Element, name: string, value: string | boolean): void {
  if (!(el instanceof HTMLElement)) return;
  if (typeof value !== 'string' || value === '') {
    el.style.removeProperty(name);
    return;
  }
  el.style.setProperty(name, value);
}

function applyToTarget(target: Element, desc: ControlDescriptor, value: string | boolean): void {
  if (desc.kind === 'attr') {
    applyAttributeValue(target, desc.name, value);
    return;
  }

  if (desc.kind === 'prop') {
    (target as unknown as PropertyTarget)[desc.name] = value;
    return;
  }

  applyCssVariable(target, desc.name, value);
}

function resolveTarget(root: Element): Element | null {
  if (root.hasAttribute('data-api-target')) return root;

  const explicit = root.querySelector('[data-api-target]');
  if (explicit) return explicit;

  const selector = root.getAttribute('data-api-target-selector');
  if (selector) return root.querySelector(selector);

  return null;
}

function resolveEffectiveTarget(root: Element, defaultTarget: Element, desc: ControlDescriptor): Element | null {
  if (!desc.targetSelector) return defaultTarget;
  return root.querySelector(desc.targetSelector);
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

  const shouldCollapse =
    !isCodeBlockCollapseOptedOut(block) &&
    countLines(snippet) >= CODE_BLOCK_COLLAPSE_MIN_LINES;
  ensureCodeBlockDisclosure(block, shouldCollapse);

  if (typeof block.setCode === 'function') {
    block.setCode(snippet);
    return;
  }

  block.textContent = snippet;
}

function isCodeBlockCollapseOptedOut(block: Element): boolean {
  return block.getAttribute(CODE_BLOCK_COLLAPSE_ATTR) === CODE_BLOCK_COLLAPSE_OPT_OUT_VALUE;
}

function countLines(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split('\n').length;
}

function resolveCodeBlockDisclosure(block: Element): HTMLElement | null {
  return block.closest(`dads-disclosure[${CODE_BLOCK_DISCLOSURE_ATTR}]`) as HTMLElement | null;
}

function createDisclosureSummary(): HTMLSpanElement {
  const summary = document.createElement('span');
  summary.setAttribute('slot', 'summary');
  summary.textContent = CODE_BLOCK_DISCLOSURE_SUMMARY_TEXT;
  return summary;
}

function ensureCodeBlockDisclosure(block: CodeBlockLike, shouldCollapse: boolean): void {
  const wrapper = resolveCodeBlockDisclosure(block);

  if (!shouldCollapse) {
    if (!wrapper) return;
    block.removeAttribute('slot');
    wrapper.replaceWith(block);
    return;
  }

  block.setAttribute('slot', 'content');

  if (wrapper) {
    if (!wrapper.querySelector('[slot="summary"]')) {
      wrapper.prepend(createDisclosureSummary());
    }
    return;
  }

  const disclosure = document.createElement('dads-disclosure');
  disclosure.setAttribute(CODE_BLOCK_DISCLOSURE_ATTR, '');
  block.replaceWith(disclosure);
  disclosure.append(createDisclosureSummary(), block);
}

function applyToUsage(usageTarget: Element, desc: ControlDescriptor, value: string | boolean): void {
  if (desc.kind === 'attr') {
    applyAttributeValue(usageTarget, desc.name, value, true);
    return;
  }

  if (desc.kind === 'prop') {
    if (desc.name === 'textContent' && typeof value === 'string') {
      usageTarget.textContent = value;
      return;
    }

    const attrName = kebabCase(desc.name);
    applyAttributeValue(usageTarget, attrName, value, true);
    return;
  }

  applyCssVariable(usageTarget, desc.name, value);
}

export function bindApiControls(root: Element): Cleanup {
  const target = resolveTarget(root);
  if (!target) return () => {};

  const block = resolveCodeBlock(root);
  const usage = block ? createUsageModel(block, target) : null;

  const controls: ControlDescriptor[] = [];

  const CONTROL_KINDS: readonly [ControlKind, string][] = [
    ['attr', 'data-api-attr'],
    ['prop', 'data-api-prop'],
    ['css-var', 'data-api-css-var'],
  ];

  for (const [kind, dataAttr] of CONTROL_KINDS) {
    for (const el of root.querySelectorAll(`[${dataAttr}]`)) {
      const name = el.getAttribute(dataAttr);
      if (!name) continue;
      controls.push({
        kind,
        name,
        el,
        defaultValue: el.getAttribute('data-default'),
        targetSelector: el.getAttribute('data-api-target-selector'),
      });
    }
  }

  const cleanups: Cleanup[] = [];

  const applyControlValue = (desc: ControlDescriptor, value: string | boolean): void => {
    const effectiveTarget = resolveEffectiveTarget(root, target, desc);
    if (effectiveTarget) applyToTarget(effectiveTarget, desc, value);

    if (!usage) return;
    const usageTarget = desc.targetSelector ? usage.fragment.querySelector(desc.targetSelector) : usage.target;
    if (usageTarget) applyToUsage(usageTarget, desc, value);
  };

  const handle = (desc: ControlDescriptor): EventListener => {
    return (event: Event): void => {
      const value = readControlValue(desc.el, event);
      applyControlValue(desc, value);
      syncUsageCode(block, usage, target);
    };
  };

  for (const desc of controls) {
    const onChange = handle(desc);

    for (const eventName of CONTROL_EVENTS) {
      desc.el.addEventListener(eventName, onChange);
    }

    cleanups.push(() => {
      for (const eventName of CONTROL_EVENTS) {
        desc.el.removeEventListener(eventName, onChange);
      }
    });
  }

  for (const el of root.querySelectorAll('[data-api-reset]')) {
    const onClick = (): void => {
      for (const desc of controls) {
        const nextValue = parseDefaultValue(desc);
        setControlValue(desc.el, nextValue);
        applyControlValue(desc, nextValue);
      }
      syncUsageCode(block, usage, target);
    };
    el.addEventListener('click', onClick);
    cleanups.push(() => el.removeEventListener('click', onClick));
  }

  syncUsageCode(block, usage, target);

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
