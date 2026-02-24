/**
 * @module figma-export/flatten
 * Shadow DOM を展開して light DOM に変換し、computed style をインライン化するユーティリティ。
 * Figma 取り込み用 HTML 生成で使用。
 */

export type FlattenOptions = {
  /** display:none の要素を除外する（default: true） */
  dropDisplayNone?: boolean;
  /** computed style の全プロパティをインライン化する（default: true） */
  inlineAllComputed?: boolean;
  /** 保持する属性パターン（例: ['aria-*','data-*','role','part']） */
  keepAttributes?: string[];
};

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * 属性名がパターンにマッチするかチェック
 */
function matchesAttributePattern(attrName: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (attrName.startsWith(prefix)) return true;
    } else if (attrName === pattern) {
      return true;
    }
  }
  return false;
}

/**
 * 擬似要素（::before / ::after）の computed style を取得し、
 * content が有効なら <span data-pseudo="..."> を生成して返す。
 */
function createPseudoElement(
  src: Element,
  pseudo: '::before' | '::after',
  doc: Document,
): HTMLElement | null {
  const cs = getComputedStyle(src, pseudo);
  const content = cs.getPropertyValue('content');

  // content が none / normal / 空なら生成しない
  if (!content || content === 'none' || content === 'normal' || content === '""' || content === "''") {
    return null;
  }

  const span = doc.createElement('span');
  span.setAttribute('data-pseudo', pseudo === '::before' ? 'before' : 'after');

  // content 値からテキストを抽出（引用符を除去）
  const textContent = content.replace(/^["']|["']$/g, '');
  if (textContent) {
    span.textContent = textContent;
  }

  // 擬似要素のスタイルをインライン化
  inlineComputedStyles(span, cs);

  return span;
}

/**
 * getComputedStyle の結果を要素の style 属性にインライン化
 */
function inlineComputedStyles(
  dst: HTMLElement | SVGElement,
  cs: CSSStyleDeclaration,
): void {
  for (const prop of cs) {
    const value = cs.getPropertyValue(prop);
    if (value) {
      dst.style.setProperty(prop, value, cs.getPropertyPriority(prop));
    }
  }
}

/**
 * 要素の保持すべき属性をコピー
 */
function copyKeptAttributes(
  src: Element,
  dst: Element,
  patterns: string[],
): void {
  for (let i = 0; i < src.attributes.length; i++) {
    const attr = src.attributes[i];
    if (attr.name === 'style') continue; // style は別途処理
    if (attr.name === 'class') continue; // class は不要
    if (matchesAttributePattern(attr.name, patterns)) {
      dst.setAttribute(attr.name, attr.value);
    }
  }
}

/**
 * keepAttributes とは独立に、HTML として機能するために必要な属性をコピー。
 * keepAttributes のパターンマッチとは別枠で常にコピーする。
 */
const ESSENTIAL_HTML_ATTRS = ['type', 'href', 'target', 'rel', 'download', 'id', 'name', 'tabindex', 'disabled'];

function copyEssentialHtmlAttributes(src: Element, dst: Element): void {
  for (const attrName of ESSENTIAL_HTML_ATTRS) {
    if (src.hasAttribute(attrName) && !dst.hasAttribute(attrName)) {
      dst.setAttribute(attrName, src.getAttribute(attrName) ?? '');
    }
  }
}

/**
 * SVG 要素かどうかを判定
 */
function isSVGElement(el: Element): el is SVGElement {
  return el.namespaceURI === SVG_NS;
}

/**
 * 要素がカスタム要素（ハイフン付きタグ名）かどうかを判定
 */
function isCustomElement(el: Element): boolean {
  return el.tagName.includes('-');
}

/**
 * ノードの子ノードを再帰的にフラット化して dst に追加
 */
function flattenChildren(
  children: Iterable<Node>,
  dst: Element,
  opts: Required<FlattenOptions>,
  doc: Document,
): void {
  for (const child of children) {
    const flattened = flattenNode(child, opts, doc);
    if (flattened) {
      dst.appendChild(flattened);
    }
  }
}

/**
 * 単一ノードをフラット化
 */
function flattenNode(
  node: Node,
  opts: Required<FlattenOptions>,
  doc: Document,
): Node | null {
  // テキストノードはそのままコピー
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent ?? '');
  }

  // コメントノードはスキップ
  if (node.nodeType === Node.COMMENT_NODE) {
    return null;
  }

  // 要素ノード以外はスキップ
  if (!(node instanceof Element)) {
    return null;
  }

  const el = node;

  // <style> タグはスキップ（インライン化するため不要）
  if (el.tagName.toLowerCase() === 'style') {
    return null;
  }

  // dropDisplayNone: display が none の要素はスキップ
  if (opts.dropDisplayNone) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') {
      return null;
    }
  }

  // <slot> 要素: assignedNodes を展開
  if (el instanceof HTMLSlotElement) {
    const assigned = el.assignedNodes({ flatten: true });
    // slot の割り当てノードを DocumentFragment にまとめる
    const frag = doc.createDocumentFragment();
    for (const assignedNode of assigned) {
      const flattened = flattenNode(assignedNode, opts, doc);
      if (flattened) {
        frag.appendChild(flattened);
      }
    }
    return frag.childNodes.length > 0 ? frag : null;
  }

  // Shadow DOM を持つカスタム要素
  if (el.shadowRoot) {
    return flattenShadowHost(el, opts, doc);
  }

  // 通常のカスタム要素（Shadow DOM なし）→ div にフォールバック
  if (isCustomElement(el)) {
    const wrapper = doc.createElement('div');
    wrapper.setAttribute('data-wcf-host', el.tagName.toLowerCase());
    const cs = getComputedStyle(el);
    if (opts.inlineAllComputed) {
      inlineComputedStyles(wrapper, cs);
    }
    copyKeptAttributes(el, wrapper, opts.keepAttributes);
    flattenChildren(el.childNodes, wrapper, opts, doc);
    return wrapper;
  }

  // SVG 要素
  if (isSVGElement(el)) {
    return flattenSVGElement(el, opts, doc);
  }

  // 通常の HTML 要素
  return flattenHTMLElement(el as HTMLElement, opts, doc);
}

/**
 * Shadow DOM ホスト要素をフラット化
 */
function flattenShadowHost(
  el: Element,
  opts: Required<FlattenOptions>,
  doc: Document,
): HTMLElement {
  const wrapper = doc.createElement('div');
  wrapper.setAttribute('data-wcf-host', el.tagName.toLowerCase());

  // ホスト要素の computed style をインライン化
  const cs = getComputedStyle(el);
  if (opts.inlineAllComputed) {
    inlineComputedStyles(wrapper, cs);
  }

  // 保持する属性をコピー
  copyKeptAttributes(el, wrapper, opts.keepAttributes);

  // shadowRoot の子ノードを再帰的にフラット化
  const shadowRoot = el.shadowRoot;
  if (shadowRoot) {
    flattenChildren(shadowRoot.childNodes, wrapper, opts, doc);
  }

  return wrapper;
}

/**
 * SVG 要素を再帰的にフラット化
 */
function flattenSVGElement(
  el: SVGElement,
  opts: Required<FlattenOptions>,
  doc: Document,
): SVGElement {
  const tagName = el.tagName.toLowerCase();
  const clone = doc.createElementNS(SVG_NS, tagName) as SVGElement;

  // SVG 属性をコピー（class 以外の全属性）
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (attr.name === 'class') continue;
    if (attr.namespaceURI) {
      clone.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    } else {
      clone.setAttribute(attr.name, attr.value);
    }
  }

  // computed style をインライン化
  if (opts.inlineAllComputed) {
    const cs = getComputedStyle(el);
    inlineComputedStyles(clone, cs);
  }

  // 子要素を再帰的に処理
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      clone.appendChild(doc.createTextNode(child.textContent ?? ''));
    } else if (child instanceof SVGElement) {
      clone.appendChild(flattenSVGElement(child, opts, doc));
    } else if (child instanceof Element) {
      const flattened = flattenNode(child, opts, doc);
      if (flattened) clone.appendChild(flattened);
    }
  }

  return clone;
}

/**
 * 通常の HTML 要素をフラット化
 */
function flattenHTMLElement(
  el: HTMLElement,
  opts: Required<FlattenOptions>,
  doc: Document,
): HTMLElement {
  const tagName = el.tagName.toLowerCase();
  const clone = doc.createElement(tagName);

  // 保持する属性をコピー（keepAttributes パターン + HTML 標準の必須属性）
  copyKeptAttributes(el, clone, opts.keepAttributes);
  copyEssentialHtmlAttributes(el, clone);

  // computed style をインライン化
  if (opts.inlineAllComputed) {
    const cs = getComputedStyle(el);
    inlineComputedStyles(clone, cs);
  }

  // ::before 擬似要素
  const before = createPseudoElement(el, '::before', doc);
  if (before) {
    clone.appendChild(before);
  }

  // 子ノードを再帰処理
  flattenChildren(el.childNodes, clone, opts, doc);

  // ::after 擬似要素
  const after = createPseudoElement(el, '::after', doc);
  if (after) {
    clone.appendChild(after);
  }

  return clone;
}

/**
 * Shadow DOM を持つ Web Component ツリーを light DOM に変換し、
 * computed style をインライン化する。
 *
 * @param root - 変換対象のルート要素（通常はカスタム要素）
 * @param opts - オプション
 * @returns フラット化された HTMLElement
 */
export function flattenElementToLightDom(
  root: Element,
  opts?: FlattenOptions,
): HTMLElement {
  const resolved: Required<FlattenOptions> = {
    dropDisplayNone: opts?.dropDisplayNone ?? true,
    inlineAllComputed: opts?.inlineAllComputed ?? true,
    keepAttributes: opts?.keepAttributes ?? ['aria-*', 'data-*', 'role', 'part'],
  };

  const doc = root.ownerDocument;
  const result = flattenNode(root, resolved, doc);

  if (result instanceof HTMLElement) {
    return result;
  }

  // DocumentFragment などの場合は div でラップ
  const wrapper = doc.createElement('div');
  if (result) {
    wrapper.appendChild(result);
  }
  return wrapper;
}

/**
 * ノードを HTML 文字列にシリアライズ
 */
export function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }

  if (node instanceof Element) {
    return node.outerHTML;
  }

  if (node instanceof DocumentFragment) {
    let html = '';
    for (const child of node.childNodes) {
      html += serializeNode(child);
    }
    return html;
  }

  return '';
}
