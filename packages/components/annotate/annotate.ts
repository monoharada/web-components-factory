/**
 * @module annotate
 * アクセシビリティ注釈（ドキュメンテーション用途）のラッパー
 * @version 0.1.0
 */

import { css, html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import type {
  A11yAnnotations,
  A11yAnnotationCategory,
  A11yCallout,
  A11yCalloutPlacement,
  A11yElementRef,
} from '../../utils/a11y-annotations.js';

type ElementWithAnnotations = HTMLElement & {
  a11yAnnotations?: A11yAnnotations;
  constructor: { a11yAnnotations?: A11yAnnotations };
};

type CalloutRender = {
  callout: A11yCallout;
  number: number;
  targetEl: Element | null;
  overlayEl: HTMLElement;
  boxEl: HTMLElement;
  tagEl: HTMLElement;
  lineEl: SVGPathElement;
  anchorName: string;
};

const CATEGORY_ORDER: readonly A11yAnnotationCategory[] = Object.freeze([
  'semantics',
  'keyboard',
  'zoom',
  'states',
  'labels',
  'motion',
]);

const CATEGORY_LABELS: Readonly<Record<A11yAnnotationCategory, string>> = Object.freeze({
  semantics: 'セマンティクス / 関係性 / 構造',
  keyboard: 'キーボード操作',
  zoom: 'ズーム / レスポンシブ',
  states: '状態 / フィードバック',
  labels: 'ラベル / インストラクション',
  motion: 'モーション / アニメーション / タイミング',
});

function asArray(v: string | readonly string[] | undefined): readonly string[] {
  if (!v) return [];
  return typeof v === 'string' ? [v] : v;
}

function isHTMLElement(v: unknown): v is HTMLElement {
  return v instanceof HTMLElement;
}

function getAriaAttrs(el: Element): readonly [string, string][] {
  const out: [string, string][] = [];
  for (const attr of el.attributes) {
    if (attr.name.startsWith('aria-')) out.push([attr.name, attr.value]);
  }
  return out;
}

function readAnnotations(el: ElementWithAnnotations): A11yAnnotations | null {
  const inst = el.a11yAnnotations;
  if (inst && inst.version === 1) return inst;
  const ctor = el.constructor?.a11yAnnotations;
  if (ctor && ctor.version === 1) return ctor;
  return null;
}

function supportsAnchorPositioning(): boolean {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false;
  }
  return (
    CSS.supports('anchor-name: --a11y-annotate-test') &&
    CSS.supports('position-anchor: --a11y-annotate-test')
  );
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export class DadsAnnotate extends TypographyWebComponent {
  static readonly version = '0.1.0';

  static definition = {
    name: 'a11y-annotate',
    shadowOptions: null,
    template: html`
      <div part="layout">
        <div part="preview">
          <div part="preview-inner">
            <div part="target-root"></div>
          </div>
          <div part="callout-layer" aria-hidden="true"></div>
        </div>

        <aside part="panel" aria-label="アクセシビリティ注釈">
          <div part="panel-header">
            <div part="panel-title-row">
              <h2 part="panel-title">アクセシビリティ注釈</h2>
              <div part="panel-badges"></div>
            </div>
            <p part="panel-subtitle"></p>
          </div>
          <div part="panel-body"></div>
        </aside>
      </div>
    `,
    styles: css`
      a11y-annotate {
        display: block;

        /* カスタマイズ可能な注釈カラー */
        --a11y-annotate-callout-color: rgba(220, 38, 38, 0.95);
        --a11y-annotate-callout-color-solid: rgb(220, 38, 38);

        /* パネル・レイアウト用カラー */
        --a11y-annotate-border-color: var(--color-border-light, #e5e7eb);
        --a11y-annotate-background: var(--color-neutral-white, #ffffff);
        --a11y-annotate-background-muted: var(--color-background-hover, #f8fafc);
        --a11y-annotate-text-primary: var(--color-text-primary, #0f172a);
        --a11y-annotate-text-secondary: var(--color-text-secondary, #475569);
        --a11y-annotate-text-muted: #334155;

        /* バッジ用カラー */
        --a11y-annotate-badge-bg: var(--color-primitive-light-blue-50, #e0f2fe);
        --a11y-annotate-badge-color: var(--color-primitive-light-blue-1000, #075985);
        --a11y-annotate-badge-border: var(--color-primitive-light-blue-200, #bae6fd);

        /* スナップショット用 */
        --a11y-annotate-snapshot-border: #e2e8f0;

        /* シャドウ */
        --a11y-annotate-shadow: 0 10px 30px rgba(2, 6, 23, 0.25);
      }

      a11y-annotate [part="layout"] {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-6, 24px);
      }

      a11y-annotate [part="preview"] {
        min-width: 0;
        border: 1px solid var(--a11y-annotate-border-color);
        border-radius: 12px;
        background: var(--a11y-annotate-background);
        padding: var(--spacing-12, 48px);
        position: relative;
        overflow: visible;
        --a11y-annotate-callout-gutter: 64px;
      }

      a11y-annotate [part="preview-inner"] {
        position: relative;
        min-width: 0;
      }

      a11y-annotate [part="callout-layer"] {
        position: absolute;
        inset: calc(var(--a11y-annotate-callout-gutter) * -1) 0
          calc(var(--a11y-annotate-callout-gutter) * -1)
          calc(var(--a11y-annotate-callout-gutter) * -1);
        pointer-events: none;
      }

      a11y-annotate [part="panel"] {
        border: 1px solid var(--a11y-annotate-border-color);
        border-radius: 12px;
        background: var(--a11y-annotate-background);
        overflow: hidden;
      }

      a11y-annotate [part="panel-header"] {
        padding: var(--spacing-4, 16px) var(--spacing-4, 16px) var(--spacing-3, 12px);
        border-bottom: 1px solid var(--a11y-annotate-border-color);
        background: var(--a11y-annotate-background-muted);
      }

      a11y-annotate [part="panel-title-row"] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-2-5, 10px);
      }

      a11y-annotate [part="panel-title"] {
        font-size: 14px;
        line-height: 1.2;
        font-weight: 700;
        margin: 0;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate [part="panel-badges"] {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-1-5, 6px);
        justify-content: flex-end;
      }

      a11y-annotate [part="panel-subtitle"] {
        margin: var(--spacing-2, 8px) 0 0;
        font-size: 12px;
        line-height: 1.4;
        color: var(--a11y-annotate-text-secondary);
      }

      a11y-annotate [part="panel-body"] {
        padding: var(--spacing-3, 12px);
        display: grid;
        gap: var(--spacing-3, 12px);
      }

      a11y-annotate section {
        display: grid;
        gap: var(--spacing-1-5, 6px);
      }

      a11y-annotate section > h3 {
        font-size: 12px;
        line-height: 1.2;
        font-weight: 700;
        margin: 0;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate section > ul {
        margin: 0;
        padding-left: calc(var(--spacing-4, 16px) + var(--spacing-0-5, 2px));
        display: grid;
        gap: var(--spacing-1, 4px);
        color: var(--a11y-annotate-text-primary);
        font-size: 12px;
        line-height: 1.5;
      }

      a11y-annotate section > p {
        margin: 0;
        color: var(--a11y-annotate-text-primary);
        font-size: 12px;
        line-height: 1.6;
      }

      a11y-annotate .badge {
        font-size: 11px;
        line-height: 1;
        padding: var(--spacing-1, 4px) var(--spacing-2, 8px);
        border-radius: 999px;
        background: var(--a11y-annotate-badge-bg);
        color: var(--a11y-annotate-badge-color);
        border: 1px solid var(--a11y-annotate-badge-border);
        white-space: nowrap;
      }

      a11y-annotate .callout-svg {
        position: absolute;
        inset: 0;
        overflow: visible;
        pointer-events: none;
        z-index: 40;
      }

      a11y-annotate .callout-line {
        fill: none;
        stroke: var(--a11y-annotate-callout-color);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
      }

      a11y-annotate .callout-overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 30;
      }

      a11y-annotate .callout-box {
        position: absolute;
        border: 2px dashed var(--a11y-annotate-callout-color);
        border-radius: 10px;
        background: transparent;
      }

      a11y-annotate .callout-tag {
        position: absolute;
        z-index: 50;
        max-width: min(320px, calc(100vw - 40px));
        padding: var(--spacing-1-5, 6px) var(--spacing-2-5, 10px);
        border-radius: 10px;
        background: var(--a11y-annotate-callout-color);
        border: 1px solid var(--a11y-annotate-callout-color);
        color: var(--a11y-annotate-background);
        font-size: 12px;
        line-height: 1.3;
        font-weight: 700;
        box-shadow: var(--a11y-annotate-shadow);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: var(--spacing-1-5, 6px);
      }

      a11y-annotate .callout-tag-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        height: 20px;
        padding: 0 var(--spacing-1, 4px);
        border-radius: 999px;
        background: var(--a11y-annotate-background);
        color: var(--a11y-annotate-callout-color-solid);
        font-size: 11px;
        font-weight: 700;
        flex-shrink: 0;
      }

      a11y-annotate .callout-tag code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
          'Courier New', monospace;
        font-weight: 700;
        background: transparent;
        border: 0;
        padding: 0;
        color: inherit;
      }

      a11y-annotate .callout-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: var(--spacing-1-5, 6px);
      }

      a11y-annotate .callout-item {
        display: grid;
        grid-template-columns: 22px minmax(0, 1fr);
        gap: var(--spacing-2-5, 10px);
        align-items: start;
      }

      a11y-annotate .callout-number {
        width: 22px;
        height: 22px;
        border-radius: 999px;
        background: var(--a11y-annotate-text-primary);
        color: var(--a11y-annotate-background);
        display: grid;
        place-items: center;
        font-size: 12px;
        font-weight: 700;
      }

      a11y-annotate .callout-text {
        display: grid;
        gap: var(--spacing-1, 4px);
      }

      a11y-annotate .callout-title {
        font-size: 12px;
        line-height: 1.4;
        font-weight: 700;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate .callout-desc {
        font-size: 12px;
        line-height: 1.5;
        color: var(--a11y-annotate-text-muted);
      }

      a11y-annotate .snapshot {
        margin: 0;
        padding: var(--spacing-2-5, 10px) var(--spacing-3, 12px);
        border-radius: 10px;
        border: 1px solid var(--a11y-annotate-snapshot-border);
        background: var(--a11y-annotate-background-muted);
        font-size: 12px;
        line-height: 1.5;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate .snapshot code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
          'Courier New', monospace;
        font-size: 11px;
      }

      @media (max-width: 900px) {
        a11y-annotate [part="layout"] {
          grid-template-columns: 1fr;
        }
      }
    `,
    attributes: [
      PropertyAttr('target-selector'),
      PropertyAttr('mode'),
      BooleanAttr('no-live'),
    ],
  };

  #targetRoot: HTMLElement | null = null;
  #panelBody: HTMLElement | null = null;
  #panelSubtitle: HTMLElement | null = null;
  #panelBadges: HTMLElement | null = null;
  #calloutLayer: HTMLElement | null = null;
  #calloutSvg: SVGSVGElement | null = null;
  #previewInner: HTMLElement | null = null;

  #target: ElementWithAnnotations | null = null;
  #callouts: CalloutRender[] = [];
  #observers: MutationObserver[] = [];
  #resizeObserver: ResizeObserver | null = null;
  #raf = 0;
  #supportsAnchors = supportsAnchorPositioning();

  #readCssPx(varName: string, fallback: number): number {
    if (typeof window === 'undefined') return fallback;
    const value = getComputedStyle(this).getPropertyValue(varName).trim();
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  static #instanceCounter = 0;
  readonly #instanceId = ++DadsAnnotate.#instanceCounter;

  connectedCallback() {
    super.connectedCallback();

    this.#targetRoot = this.querySelector<HTMLElement>('[part="target-root"]');
    this.#panelBody = this.querySelector<HTMLElement>('[part="panel-body"]');
    this.#panelSubtitle = this.querySelector<HTMLElement>('[part="panel-subtitle"]');
    this.#panelBadges = this.querySelector<HTMLElement>('[part="panel-badges"]');
    this.#calloutLayer = this.querySelector<HTMLElement>('[part="callout-layer"]');
    this.#previewInner = this.querySelector<HTMLElement>('[part="preview-inner"]');

    this.#moveInitialContentIntoTargetRoot();

    this.#setupResizeObserver();
    this.#refresh();
  }

  disconnectedCallback() {
    this.#teardownObservers();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#raf = 0;
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;
    if (name === 'target-selector' || name === 'mode' || name === 'no-live') {
      this.#refresh();
    }
  }

  #moveInitialContentIntoTargetRoot() {
    if (!this.#targetRoot) return;
    const layout = this.querySelector<HTMLElement>('[part="layout"]');
    if (!layout) return;

    const nodes = Array.from(this.childNodes);
    for (const node of nodes) {
      // layout 自体とその内部は移動しない
      if (node === layout) continue;
      if (node instanceof Node && layout.contains(node)) continue;

      // それ以外は注釈対象（プレビュー）へ移動
      // 余計な空白テキストは無視
      if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() === '') {
        node.parentNode?.removeChild(node);
        continue;
      }
      this.#targetRoot.appendChild(node);
    }
  }

  #setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    if (this.#resizeObserver) return;

    this.#resizeObserver = new ResizeObserver(() => this.#scheduleLayout());
    if (this.#previewInner) this.#resizeObserver.observe(this.#previewInner);
  }

  #scheduleLayout() {
    if (this.#raf) cancelAnimationFrame(this.#raf);
    this.#raf = requestAnimationFrame(() => {
      this.#raf = 0;
      this.#layoutCallouts();
    });
  }

  #refresh() {
    if (!this.#targetRoot || !this.#panelBody || !this.#panelSubtitle || !this.#panelBadges || !this.#calloutLayer) {
      return;
    }

    const nextTarget = this.#resolveTarget();
    const targetChanged = nextTarget !== this.#target;
    this.#target = nextTarget;

    if (!this.#target) {
      this.#panelSubtitle.textContent = '注釈対象が見つかりません。';
      this.#panelBadges.textContent = '';
      this.#panelBody.textContent = '';
      this.#calloutLayer.textContent = '';
      this.#teardownObservers();
      return;
    }

    const spec = readAnnotations(this.#target);
    this.#render(spec);

    if (targetChanged) {
      this.#teardownObservers();
      if (!this.hasAttribute('no-live')) {
        this.#setupLiveObservers();
      }
    }

    this.#scheduleLayout();
  }

  #resolveTarget(): ElementWithAnnotations | null {
    const container = this.#targetRoot;
    if (!container) return null;

    const directChildren = Array.from(container.children).filter(isHTMLElement) as ElementWithAnnotations[];
    const root = directChildren.find((el) => el.tagName.includes('-')) ?? directChildren[0] ?? null;
    if (!root) return null;

    const selector = this.getAttribute('target-selector')?.trim();
    if (!selector) return root;
    if (root.matches(selector)) return root;

    const found = root.querySelector(selector);
    return isHTMLElement(found) ? (found as ElementWithAnnotations) : root;
  }

  #render(spec: A11yAnnotations | null) {
    if (!this.#panelBody || !this.#panelSubtitle || !this.#panelBadges || !this.#calloutLayer || !this.#target) {
      return;
    }

    const mode = (this.getAttribute('mode') ?? 'both').toLowerCase();
    const showPanel = mode === 'both' || mode === 'panel';
    const showMarkers = mode === 'both' || mode === 'callouts';

    this.querySelector('[part="panel"]')?.toggleAttribute('hidden', !showPanel);
    this.#calloutLayer.toggleAttribute('hidden', !showMarkers);

    const tagName = this.#target.tagName.toLowerCase();
    const summary = spec?.summary ? `— ${spec.summary}` : '';
    this.#panelSubtitle.textContent = `${tagName}${summary}`;

    this.#panelBadges.textContent = '';
    const targetVersion = (this.#target.constructor as { version?: unknown }).version;
    const badges = [
      !this.hasAttribute('no-live') && 'Live',
      'Overlay',
      this.#supportsAnchors && 'Anchor-ready',
      `Annotate v${DadsAnnotate.version}`,
      spec && `Spec v${spec.version}`,
      typeof targetVersion === 'string' && `${tagName} v${targetVersion}`,
    ].filter(Boolean) as string[];

    for (const label of badges) {
      const span = document.createElement('span');
      span.className = 'badge';
      span.textContent = label;
      this.#panelBadges.appendChild(span);
    }

    this.#panelBody.textContent = '';

    const categories = spec?.categories ?? {};
    const callouts = this.#normalizeCallouts(spec);

    // アノテーション一覧を最初に表示
    const panelCallouts = callouts.filter((c) => (c.callout.mode ?? 'both') !== 'marker');
    if (panelCallouts.length > 0) {
      const calloutSection = document.createElement('section');
      const calloutH3 = document.createElement('h3');
      calloutH3.textContent = 'アノテーション一覧';
      calloutSection.appendChild(calloutH3);

      const list = document.createElement('ol');
      list.className = 'callout-list';
      for (const item of panelCallouts) {
        const li = document.createElement('li');
        li.className = 'callout-item';

        const n = document.createElement('div');
        n.className = 'callout-number';
        n.textContent = String(item.number);
        li.appendChild(n);

        const text = document.createElement('div');
        text.className = 'callout-text';

        const title = document.createElement('div');
        title.className = 'callout-title';
        title.textContent = item.callout.title;
        text.appendChild(title);

        if (item.callout.description) {
          const desc = document.createElement('div');
          desc.className = 'callout-desc';
          desc.textContent = item.callout.description;
          text.appendChild(desc);
        }

        const snapshot = this.#renderSnapshot(item.targetEl);
        if (snapshot) text.appendChild(snapshot);

        li.appendChild(text);
        list.appendChild(li);
      }
      calloutSection.appendChild(list);
      this.#panelBody.appendChild(calloutSection);
    }

    // カテゴリごとの説明
    for (const category of CATEGORY_ORDER) {
      const content = asArray(categories[category] as string | readonly string[] | undefined);
      const section = document.createElement('section');

      const h3 = document.createElement('h3');
      h3.textContent = CATEGORY_LABELS[category];
      section.appendChild(h3);

      if (content.length > 0) {
        const ul = document.createElement('ul');
        for (const line of content) {
          const li = document.createElement('li');
          li.textContent = line;
          ul.appendChild(li);
        }
        section.appendChild(ul);
      } else {
        const p = document.createElement('p');
        p.textContent = '（未記載）';
        section.appendChild(p);
      }

      this.#panelBody.appendChild(section);
    }

    // Markers
    this.#calloutLayer.textContent = '';
    this.#calloutSvg = null;
    this.#callouts = [];
    for (const item of callouts) {
      if (!showMarkers) continue;
      const mode = item.callout.mode ?? 'both';
      if (mode === 'panel') continue;

      if (!this.#calloutSvg) {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.classList.add('callout-svg');
        svg.setAttribute('aria-hidden', 'true');
        this.#calloutLayer.appendChild(svg);
        this.#calloutSvg = svg;
      }

      this.#calloutSvg.appendChild(item.lineEl);
      this.#calloutLayer.appendChild(item.overlayEl);
      this.#callouts.push(item);
    }
  }

  #formatCalloutTag(callout: A11yCallout, el: Element | null): string {
    if (callout.label) return callout.label;
    if (!el) return callout.title;

    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const slot = el.getAttribute('slot');

    const stateAttrs = [
      'aria-current',
      'aria-disabled',
      'aria-expanded',
      'aria-selected',
      'aria-pressed',
      'aria-checked',
      'aria-hidden',
    ] as const;
    for (const k of stateAttrs) {
      const v = el.getAttribute(k);
      if (v !== null) return `${k}="${v}"`;
    }

    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel !== null) return `<${tag} aria-label="${ariaLabel}">`;
    if (role !== null) return `<${tag} role="${role}">`;
    if (slot !== null) return `slot="${slot}"`;

    const aria = getAriaAttrs(el);
    if (aria.length > 0) return `${aria[0][0]}="${aria[0][1]}"`;

    return `<${tag}>`;
  }

  #renderSnapshot(el: Element | null): HTMLElement | null {
    if (!el) return null;
    const role = el.getAttribute('role');
    const aria = getAriaAttrs(el);

    const pre = document.createElement('pre');
    pre.className = 'snapshot';

    const lines: string[] = [];
    lines.push(`要素: <${el.tagName.toLowerCase()}>`);
    if (role) lines.push(`role: ${role}`);
    if (aria.length > 0) {
      for (const [k, v] of aria) {
        lines.push(`${k}: ${v}`);
      }
    }
    if (!role && aria.length === 0) {
      lines.push('role/aria-*: （なし）');
    }

    const code = document.createElement('code');
    code.textContent = lines.join('\n');
    pre.replaceChildren(code);
    return pre;
  }

  #normalizeCallouts(spec: A11yAnnotations | null): CalloutRender[] {
    const raw = spec?.callouts ?? [];
    const out: CalloutRender[] = [];
    let n = 0;

    for (const callout of raw) {
      const targetEl = this.#resolveElementRef(callout.target);
      if (!targetEl) {
        continue;
      }

      // ターゲット要素が空または非表示の場合はスキップ
      if (this.#isEmptyOrHidden(targetEl)) {
        continue;
      }

      n += 1;
      const anchorName = `--a11y-annotate-${this.#instanceId}-${n}`;

      const overlay = document.createElement('div');
      overlay.className = 'callout-overlay';
      overlay.setAttribute('data-callout-id', callout.id);

      const box = document.createElement('div');
      box.className = 'callout-box';

      const tag = document.createElement('div');
      tag.className = 'callout-tag';
      const numBadge = document.createElement('span');
      numBadge.className = 'callout-tag-number';
      numBadge.textContent = String(n);
      tag.appendChild(numBadge);
      const code = document.createElement('code');
      code.textContent = this.#formatCalloutTag(callout, targetEl);
      tag.appendChild(code);

      overlay.appendChild(box);
      overlay.appendChild(tag);

      const line = document.createElementNS(SVG_NS, 'path');
      line.classList.add('callout-line');

      out.push({
        callout,
        number: n,
        targetEl,
        overlayEl: overlay,
        boxEl: box,
        tagEl: tag,
        lineEl: line,
        anchorName,
      });
    }

    return out;
  }

  #resolveElementRef(ref: A11yElementRef): Element | null {
    const host = ref.host ?? 'target';
    const hostBase = host === 'annotate' ? this : this.#target;
    if (!hostBase) return null;

    const hostEl = ref.hostSelector
      ? (hostBase.querySelector(ref.hostSelector) as HTMLElement | null)
      : (hostBase as unknown as HTMLElement);

    if (!hostEl) return null;

    const scope = ref.scope ?? 'light';
    if (scope === 'shadow') {
      const root = hostEl.shadowRoot;
      if (!root) return null;
      return root.querySelector(ref.selector);
    }

    return hostEl.querySelector(ref.selector);
  }

  #hasRenderableBox(el: Element): boolean {
    // display:none / detached / not rendered
    if (!el.isConnected) return false;
    const anyEl = el as unknown as { checkVisibility?: (options?: unknown) => boolean };
    if (typeof anyEl.checkVisibility === 'function') {
      try {
        if (!anyEl.checkVisibility()) return false;
      } catch {
        // ignore and fallback to heuristics below
      }
    }
    if (el.getClientRects().length === 0) return false;
    const rect = el.getBoundingClientRect();
    return rect.width !== 0 || rect.height !== 0;
  }

  /**
   * 要素が空または非表示かを判定（アノテーション対象としてスキップすべきか）
   *
   * スキップ対象:
   * - hidden属性がある
   * - display: none
   * - テキストのみを表示する要素（part="requirement"等）で空の場合
   *
   * スキップしない:
   * - ARIA属性を持つ要素（空でもアクセシビリティ的に重要）
   * - role属性を持つ要素
   * - 子要素を持つ要素
   */
  #isEmptyOrHidden(el: Element): boolean {
    // hidden属性
    if (el.hasAttribute('hidden')) return true;

    // CSSで非表示（getComputedStyleはDOMに接続されている場合のみ有効）
    if (el.isConnected) {
      const style = getComputedStyle(el);
      if (style.display === 'none') return true;
    }

    // ARIA属性またはrole属性を持つ場合は空でもスキップしない
    const hasAriaAttrs = getAriaAttrs(el).length > 0;
    const hasRole = el.hasAttribute('role');
    if (hasAriaAttrs || hasRole) return false;

    // 子要素がある場合は空ではない（例：アイコンなど）
    if (el.children.length > 0) return false;

    // スロット要素の場合：assignedNodesが空かチェック
    if (el instanceof HTMLSlotElement) {
      const assigned = el.assignedNodes({ flatten: true });
      const hasContent = assigned.some((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() !== '';
        }
        return node.nodeType === Node.ELEMENT_NODE;
      });
      return !hasContent;
    }

    // テキストコンテンツが空の場合のみスキップ
    const hasVisibleText = el.textContent?.trim() !== '';
    return !hasVisibleText;
  }

  #layoutCallouts() {
    if (!this.#calloutLayer) return;
    const containerRect = this.#calloutLayer.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) return;

    if (this.#calloutSvg) {
      this.#calloutSvg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
      this.#calloutSvg.setAttribute('width', String(containerRect.width));
      this.#calloutSvg.setAttribute('height', String(containerRect.height));
    }

    const placedTags: DOMRect[] = [];
    const overlapMargin = 8;

    for (const item of this.#callouts) {
      const anchorEl = item.targetEl;
      if (!anchorEl) {
        item.overlayEl.style.display = 'none';
        item.lineEl.style.display = 'none';
        continue;
      }

      if (!this.#hasRenderableBox(anchorEl)) {
        item.overlayEl.style.display = 'none';
        item.lineEl.style.display = 'none';
        continue;
      }

      item.overlayEl.style.display = '';
      item.lineEl.style.display = '';

      const rect = anchorEl.getBoundingClientRect();

      const localLeft = rect.left - containerRect.left;
      const localTop = rect.top - containerRect.top;
      const localWidth = rect.width;
      const localHeight = rect.height;

      const pad = 6;
      item.boxEl.style.left = `${localLeft - pad}px`;
      item.boxEl.style.top = `${localTop - pad}px`;
      item.boxEl.style.width = `${localWidth + pad * 2}px`;
      item.boxEl.style.height = `${localHeight + pad * 2}px`;

      const placement = item.callout.placement ?? 'top-right';
      const isLeft = placement === 'top-left' || placement === 'bottom-left';
      const isTop = placement === 'top-left' || placement === 'top-right';
      const anchorX = isLeft ? localLeft : localLeft + localWidth;
      const anchorY = isTop ? localTop : localTop + localHeight;

      const gap = this.#readCssPx('--spacing-6', 24);
      let tagLeft = isLeft ? anchorX - gap : anchorX + gap;
      let tagTop = isTop ? anchorY - gap : anchorY + gap;
      const tagTransform = `translate(${isLeft ? '-100%' : '0'}, ${isTop ? '-100%' : '0'})`;

      item.tagEl.style.left = `${tagLeft}px`;
      item.tagEl.style.top = `${tagTop}px`;
      item.tagEl.style.transform = tagTransform;

      // タグがプレビュー領域からはみ出す場合はクランプする（padding領域も含めて配置できる）
      const clampMargin = 10;
      const clampToContainer = () => {
        let tagRect = item.tagEl.getBoundingClientRect();
        let dx = 0;
        let dy = 0;
        if (tagRect.left < containerRect.left + clampMargin) {
          dx = containerRect.left + clampMargin - tagRect.left;
        } else if (tagRect.right > containerRect.right - clampMargin) {
          dx = containerRect.right - clampMargin - tagRect.right;
        }
        if (tagRect.top < containerRect.top + clampMargin) {
          dy = containerRect.top + clampMargin - tagRect.top;
        } else if (tagRect.bottom > containerRect.bottom - clampMargin) {
          dy = containerRect.bottom - clampMargin - tagRect.bottom;
        }
        if (dx !== 0 || dy !== 0) {
          tagLeft += dx;
          tagTop += dy;
          item.tagEl.style.left = `${tagLeft}px`;
          item.tagEl.style.top = `${tagTop}px`;
          tagRect = item.tagEl.getBoundingClientRect();
        }
        return tagRect;
      };

      // 初回クランプ
      let tagRect = clampToContainer();

      // 既存タグとの衝突を回避（簡易）
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const hit = placedTags.find((r) => {
          const ax1 = tagRect.left - overlapMargin;
          const ay1 = tagRect.top - overlapMargin;
          const ax2 = tagRect.right + overlapMargin;
          const ay2 = tagRect.bottom + overlapMargin;
          const bx1 = r.left;
          const by1 = r.top;
          const bx2 = r.right;
          const by2 = r.bottom;
          return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
        });
        if (!hit) break;

        const shift = 10;
        tagTop += isTop
          ? hit.bottom - tagRect.top + shift
          : -(tagRect.bottom - hit.top + shift);
        item.tagEl.style.top = `${tagTop}px`;
        tagRect = clampToContainer();
      }

      // ターゲットと重なる場合は、少しだけ離す
      const intersectsTarget =
        tagRect.left < rect.right &&
        tagRect.right > rect.left &&
        tagRect.top < rect.bottom &&
        tagRect.bottom > rect.top;
      if (intersectsTarget) {
        const nudge = 14;
        tagTop += isTop ? -nudge : nudge;
        item.tagEl.style.top = `${tagTop}px`;
        tagRect = clampToContainer();
      }

      placedTags.push(tagRect);

      const tagLocalLeft = tagRect.left - containerRect.left;
      const tagLocalTop = tagRect.top - containerRect.top;
      const startX = isLeft ? tagLocalLeft + tagRect.width : tagLocalLeft;
      const startY = isTop ? tagLocalTop + tagRect.height : tagLocalTop;

      item.lineEl.setAttribute('d', `M ${startX} ${startY} L ${anchorX} ${startY} L ${anchorX} ${anchorY}`);
    }
  }

  #setupLiveObservers() {
    if (!this.#target) return;

    const onMutation = () => {
      this.#refreshSnapshotsOnly();
      this.#scheduleLayout();
    };

    const onLayout = () => {
      this.#scheduleLayout();
    };

    const observeNode = (node: Node) => {
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type !== 'attributes') return onMutation();
          if (m.attributeName && m.attributeName !== 'style') return onMutation();
        }
      });
      mo.observe(node, { attributes: true, childList: true, subtree: true });
      this.#observers.push(mo);
    };

    observeNode(this.#target);
    if (this.#target.shadowRoot) observeNode(this.#target.shadowRoot);

    // calloutsが参照するshadowRootも監視
    const spec = readAnnotations(this.#target);
    for (const c of spec?.callouts ?? []) {
      if (c.target.scope !== 'shadow') continue;
      const hostBase = (c.target.host ?? 'target') === 'annotate' ? this : this.#target;
      const hostEl = c.target.hostSelector
        ? (hostBase?.querySelector(c.target.hostSelector) as HTMLElement | null)
        : (hostBase as unknown as HTMLElement);
      if (hostEl?.shadowRoot) observeNode(hostEl.shadowRoot);
    }

    window.addEventListener('resize', onLayout, { passive: true });
    window.addEventListener('scroll', onLayout, { passive: true, capture: true });

    // teardownで消すために、リスナーをObserverに紐付けず、専用フラグで管理
    this.#windowCleanup = () => {
      window.removeEventListener('resize', onLayout);
      window.removeEventListener('scroll', onLayout, true);
    };
  }

  #windowCleanup: (() => void) | null = null;

  #teardownObservers() {
    for (const o of this.#observers) o.disconnect();
    this.#observers = [];
    this.#windowCleanup?.();
    this.#windowCleanup = null;
  }

  #refreshSnapshotsOnly() {
    // 現状は #render がスナップショットも含めて作り直すので、
    // まずはシンプルに全体再レンダーに寄せる。
    // （将来: 差分更新に最適化）
    const spec = this.#target ? readAnnotations(this.#target) : null;
    this.#render(spec);
  }
}
