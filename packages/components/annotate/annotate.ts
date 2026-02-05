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
import {
  buildAutoPath,
  clampBoundaryPointAwayFromCorners,
  computeInsetPx,
  insetPointTowards,
  pickRectBoundaryPoint,
  rectCenter,
} from './annotate-geometry.js';

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

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
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

const CEM_URL = '/custom-elements.json';
const A11Y_QUERY_PARAM = 'a11y';
const A11Y_STORAGE_KEY = 'dads:a11y';

let cemAnnotations: Map<string, A11yAnnotations> | null = null;
let cemAnnotationsPromise: Promise<Map<string, A11yAnnotations>> | null = null;

function isA11yAnnotationsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get(A11Y_QUERY_PARAM) === '1') return true;
  try {
    return window.localStorage.getItem(A11Y_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

type CemDeclaration = { tagName?: string; custom?: { a11yAnnotations?: A11yAnnotations } };
type CemModule = { declarations?: CemDeclaration[] };
type CemManifest = { modules?: CemModule[] };

function parseCemAnnotations(manifest: CemManifest | null | undefined): Map<string, A11yAnnotations> {
  const map = new Map<string, A11yAnnotations>();
  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      const tagName = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : '';
      if (!tagName) continue;
      const spec = decl.custom?.a11yAnnotations;
      if (spec && spec.version === 1) map.set(tagName, spec);
    }
  }
  return map;
}

function loadCemAnnotations(): Promise<Map<string, A11yAnnotations>> {
  if (cemAnnotations) return Promise.resolve(cemAnnotations);
  if (!cemAnnotationsPromise) {
    cemAnnotationsPromise = fetch(CEM_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load CEM: ${res.status}`);
        return res.json();
      })
      .then((manifest) => {
        const map = parseCemAnnotations(manifest);
        cemAnnotations = map;
        return map;
      })
      .catch((err) => {
        console.warn('[a11y-annotate] Failed to load custom-elements.json', err);
        const empty = new Map<string, A11yAnnotations>();
        cemAnnotations = empty;
        return empty;
      });
  }
  return cemAnnotationsPromise;
}

function readAnnotations(
  el: ElementWithAnnotations,
  onCemLoaded?: () => void
): A11yAnnotations | null {
  if (isA11yAnnotationsEnabled()) {
    const tagName = el.localName;
    const spec = cemAnnotations?.get(tagName) ?? null;
    if (spec) return spec;
    void loadCemAnnotations().then(() => onCemLoaded?.());
  }

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

/**
 * アクセシビリティ注釈（ドキュメンテーション用途）コンポーネント
 *
 * @customElement a11y-annotate
 * @tagname a11y-annotate
 *
 * @csspart layout - 全体レイアウト
 * @csspart preview - プレビュー領域
 * @csspart target-root - 注釈対象の描画ルート
 * @csspart callout-layer - コールアウト描画レイヤ
 * @csspart panel - サイドパネル
 *
 * @attr {string} target-selector - 対象要素セレクタ
 * @attr {string} mode - 表示モード
 * @attr {boolean} no-live - aria-live を無効化
 */
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
        --a11y-annotate-callout-color-solid: var(--color-semantic-error-1, #ec0000);
        --a11y-annotate-callout-color: var(--a11y-annotate-callout-color-solid);
        --a11y-annotate-callout-line-inset: var(--spacing-0-5, 2px);
        --a11y-annotate-callout-line-inset-ratio: 0.35;
        --a11y-annotate-callout-anchor-corner-margin: var(--spacing-2-5, 10px);
        /* callout-layer の拡張量（= レーンの外側距離）。大きすぎると視認性が落ちるため clamp で抑える。 */
        --a11y-annotate-callout-gutter: clamp(var(--spacing-12, 3rem), 8vw, var(--spacing-24, 6rem));
        /* レーン（ラベル位置）のターゲット範囲からの距離 */
        --a11y-annotate-callout-lane-offset: var(--spacing-14, 56px);

        /* Typography */
        --a11y-annotate-font-size: var(--font-size-16, 1rem);
        --a11y-annotate-circle-size: var(--spacing-6, 24px);
        --a11y-annotate-body-line-height: var(--line-height-170, 1.7);

        /* Spacing */
        --a11y-annotate-space-xs: var(--spacing-2, 8px);
        --a11y-annotate-space-sm: var(--spacing-3, 12px);
        --a11y-annotate-space-md: var(--spacing-4, 16px);

        /* パネル・レイアウト用カラー */
        --a11y-annotate-border-color: var(--color-border-light, #e5e7eb);
        --a11y-annotate-background: var(--color-neutral-white, #ffffff);
        --a11y-annotate-background-muted: var(--color-background-hover, #f8fafc);
        --a11y-annotate-text-primary: var(--color-text-primary, #0f172a);
        --a11y-annotate-text-secondary: var(--color-text-secondary, #475569);
        --a11y-annotate-text-muted: var(--color-text-secondary, #475569);

        /* バッジ用カラー */
        --a11y-annotate-badge-bg: var(--color-primitive-light-blue-50, #e0f2fe);
        --a11y-annotate-badge-color: var(--color-primitive-light-blue-1000, #075985);
        --a11y-annotate-badge-border: var(--color-primitive-light-blue-200, #bae6fd);

        /* スナップショット用 */
        --a11y-annotate-snapshot-border: var(--a11y-annotate-border-color);

        /* シャドウ */
        --a11y-annotate-shadow: var(
          --component-shadow,
          var(
            --elevation-2,
            0 2px 12px 2px rgba(0, 0, 0, 0.1),
            0 1px 6px 0 rgba(0, 0, 0, 0.3)
          )
        );
      }

      a11y-annotate [part="layout"] {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-6, 24px);
      }

      a11y-annotate [part="preview"] {
        min-width: 0;
        border: 1px solid var(--a11y-annotate-border-color);
        border-radius: var(--border-radius-12, 0.75rem);
        background: var(--a11y-annotate-background);
        padding: var(--spacing-12, 48px);
        position: relative;
        overflow: visible;
      }

      a11y-annotate [part="preview-inner"] {
        position: relative;
        min-width: 0;
      }

      a11y-annotate [part="callout-layer"] {
        position: absolute;
        /* Expand all sides so callout tags can be placed outside the preview frame (including the right side). */
        inset: calc(var(--a11y-annotate-callout-gutter) * -1);
        pointer-events: none;
      }

      a11y-annotate [part="panel"] {
        border: 1px solid var(--a11y-annotate-border-color);
        border-radius: var(--border-radius-12, 0.75rem);
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
        font-size: var(--a11y-annotate-font-size);
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
        font-size: var(--a11y-annotate-font-size);
        line-height: 1.4;
        color: var(--a11y-annotate-text-secondary);
      }

      a11y-annotate [part="panel-body"] {
        padding: var(--a11y-annotate-space-md);
        display: grid;
        gap: var(--a11y-annotate-space-md);
      }

      a11y-annotate section {
        display: grid;
        gap: var(--a11y-annotate-space-xs);
      }

      a11y-annotate section > h3 {
        font-size: var(--a11y-annotate-font-size);
        line-height: 1.2;
        font-weight: 700;
        margin: 0;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate section > ul {
        margin: 0;
        padding-left: calc(var(--spacing-4, 16px) + var(--spacing-0-5, 2px));
        display: grid;
        gap: var(--a11y-annotate-space-xs);
        color: var(--a11y-annotate-text-primary);
        font-size: var(--a11y-annotate-font-size);
        line-height: var(--a11y-annotate-body-line-height);
      }

      a11y-annotate section > p {
        margin: 0;
        color: var(--a11y-annotate-text-primary);
        font-size: var(--a11y-annotate-font-size);
        line-height: var(--a11y-annotate-body-line-height);
      }

      a11y-annotate .badge {
        font-size: var(--a11y-annotate-font-size);
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
        border-radius: var(--border-radius-8, 0.5rem);
        background: transparent;
      }

      a11y-annotate .callout-box[hidden] {
        display: none;
      }

      a11y-annotate .callout-tag {
        position: absolute;
        z-index: 50;
        max-width: min(320px, calc(100vw - 40px));
        padding: var(--spacing-1-5, 6px) var(--spacing-2-5, 10px);
        border-radius: var(--border-radius-8, 0.5rem);
        background: var(--a11y-annotate-callout-color);
        border: 1px solid var(--a11y-annotate-callout-color);
        color: var(--a11y-annotate-background);
        font-size: var(--a11y-annotate-font-size);
        line-height: 1.3;
        font-weight: 700;
        box-shadow: var(--a11y-annotate-shadow);
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--spacing-1-5, 6px);
        white-space: normal;
      }

      a11y-annotate .callout-tag-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: var(--a11y-annotate-circle-size);
        height: var(--a11y-annotate-circle-size);
        padding: 0 var(--spacing-1, 4px);
        border-radius: 999px;
        background: var(--a11y-annotate-background);
        color: var(--a11y-annotate-callout-color-solid);
        font-size: var(--a11y-annotate-font-size);
        font-weight: 700;
        flex-shrink: 0;
      }

      a11y-annotate .callout-tag code {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        flex: 1 1 auto;
        min-width: 0;
        font-weight: inherit;
        background: transparent;
        border: 0;
        padding: 0;
        color: inherit;
        white-space: normal;
        overflow-wrap: anywhere;
      }

      a11y-annotate .callout-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: var(--a11y-annotate-space-sm);
      }

      a11y-annotate .callout-item {
        display: grid;
        grid-template-columns: minmax(var(--a11y-annotate-circle-size), max-content) minmax(0, 1fr);
        gap: var(--spacing-2-5, 10px);
        align-items: start;
      }

      a11y-annotate .callout-number {
        box-sizing: border-box;
        min-width: var(--a11y-annotate-circle-size);
        height: var(--a11y-annotate-circle-size);
        padding: 0 var(--spacing-1, 4px);
        border-radius: 999px;
        border: 2px solid var(--a11y-annotate-callout-color);
        background: var(--a11y-annotate-background);
        color: var(--a11y-annotate-callout-color-solid);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: var(--a11y-annotate-font-size);
        font-weight: 700;
      }

      a11y-annotate .callout-text {
        display: grid;
        gap: var(--a11y-annotate-space-xs);
      }

      a11y-annotate .callout-title {
        font-size: var(--a11y-annotate-font-size);
        line-height: 1.4;
        font-weight: 700;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate .callout-desc {
        font-size: var(--a11y-annotate-font-size);
        line-height: 1.5;
        color: var(--a11y-annotate-text-muted);
      }

      a11y-annotate .snapshot {
        margin: 0;
        padding: var(--spacing-2-5, 10px) var(--spacing-3, 12px);
        border-radius: var(--border-radius-8, 0.5rem);
        border: 1px solid var(--a11y-annotate-snapshot-border);
        background: var(--a11y-annotate-background-muted);
        font-size: var(--a11y-annotate-font-size);
        line-height: 1.5;
        color: var(--a11y-annotate-text-primary);
      }

      a11y-annotate .snapshot code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
          'Courier New', monospace;
        font-size: var(--a11y-annotate-font-size);
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
  #refreshQueued = false;

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

  #scheduleRefresh() {
    if (this.#refreshQueued) return;
    this.#refreshQueued = true;
    queueMicrotask(() => {
      this.#refreshQueued = false;
      this.#refresh();
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

    const spec = readAnnotations(this.#target, () => this.#scheduleRefresh());
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
    this.#applyCalloutBoxHints(callouts);

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
      box.toggleAttribute('hidden', true);

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

  #applyCalloutBoxHints(callouts: CalloutRender[]) {
    for (const item of callouts) {
      const hint = item.callout.targetHint ?? 'auto';
      if (hint === 'box') {
        item.boxEl.toggleAttribute('hidden', false);
        continue;
      }
      if (hint === 'none') {
        item.boxEl.toggleAttribute('hidden', true);
        continue;
      }

      const el = item.targetEl;
      if (!el) {
        item.boxEl.toggleAttribute('hidden', true);
        continue;
      }

      const isContainer = callouts.some((other) => {
        if (other === item) return false;
        if (!other.targetEl) return false;
        if (other.targetEl === el) return false;
        return el.contains(other.targetEl);
      });

      item.boxEl.toggleAttribute('hidden', !isContainer);
    }
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

    const parseRadiusPx = (value: string, fontSize: number): number => {
      const trimmed = value.trim();
      if (!trimmed) return 0;
      const first = trimmed.split(/\s+/)[0] ?? '';
      if (!first || first.endsWith('%')) return 0;
      if (first.endsWith('px')) {
        const n = Number.parseFloat(first);
        return Number.isFinite(n) ? n : 0;
      }
      if (first.endsWith('rem')) {
        const n = Number.parseFloat(first);
        return Number.isFinite(n) ? n * fontSize : 0;
      }
      if (first.endsWith('em')) {
        const n = Number.parseFloat(first);
        return Number.isFinite(n) ? n * fontSize : 0;
      }
      const n = Number.parseFloat(first);
      return Number.isFinite(n) ? n : 0;
    };

    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

    if (this.#calloutSvg) {
      this.#calloutSvg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
      this.#calloutSvg.setAttribute('width', String(containerRect.width));
      this.#calloutSvg.setAttribute('height', String(containerRect.height));
    }

    const lineInsetMin = this.#readCssPx('--a11y-annotate-callout-line-inset', 2);
    const cornerMargin = this.#readCssPx('--a11y-annotate-callout-anchor-corner-margin', 10);
    const ratioRaw = getComputedStyle(this).getPropertyValue('--a11y-annotate-callout-line-inset-ratio').trim();
    const ratio = Number.parseFloat(ratioRaw);

    const clampMargin = 10;
    const laneGap = 8;
    const laneOffset = this.#readCssPx('--a11y-annotate-callout-lane-offset', 24);

    type FocusRectLocal = {
      left: number;
      top: number;
      right: number;
      bottom: number;
    };

    type TargetInfo = {
      targetRectLocal: { left: number; top: number; width: number; height: number };
      targetCenter: ReturnType<typeof rectCenter>;
    };

    const targetInfo = new Map<CalloutRender, TargetInfo>();
    let focusRectLocal: FocusRectLocal | null = null;

    type LaneItem = {
      item: CalloutRender;
      desiredY: number;
      height: number;
      side: 'left' | 'right';
    };
    const laneItems: LaneItem[] = [];

    // Pass 1: show/hide + box layout + focusRect (targets union) collection
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

      if (!item.boxEl.hasAttribute('hidden')) {
        const pad = 6;
        item.boxEl.style.left = `${localLeft - pad}px`;
        item.boxEl.style.top = `${localTop - pad}px`;
        item.boxEl.style.width = `${localWidth + pad * 2}px`;
        item.boxEl.style.height = `${localHeight + pad * 2}px`;

        const computed = getComputedStyle(anchorEl);
        const baseRadii = {
          topLeft: parseRadiusPx(computed.borderTopLeftRadius, rootFontSize),
          topRight: parseRadiusPx(computed.borderTopRightRadius, rootFontSize),
          bottomRight: parseRadiusPx(computed.borderBottomRightRadius, rootFontSize),
          bottomLeft: parseRadiusPx(computed.borderBottomLeftRadius, rootFontSize),
        };

        const maxRadius = Math.min((localWidth + pad * 2) / 2, (localHeight + pad * 2) / 2);
        const toBoxRadius = (base: number): number => {
          if (base <= 0) return 0;
          const padded = base + pad;
          return Math.max(0, Math.min(padded, maxRadius));
        };

        item.boxEl.style.borderTopLeftRadius = `${toBoxRadius(baseRadii.topLeft)}px`;
        item.boxEl.style.borderTopRightRadius = `${toBoxRadius(baseRadii.topRight)}px`;
        item.boxEl.style.borderBottomRightRadius = `${toBoxRadius(baseRadii.bottomRight)}px`;
        item.boxEl.style.borderBottomLeftRadius = `${toBoxRadius(baseRadii.bottomLeft)}px`;
      }

      const targetRectLocal = {
        left: localLeft,
        top: localTop,
        width: localWidth,
        height: localHeight,
      };
      const targetCenter = rectCenter(targetRectLocal);

      targetInfo.set(item, { targetRectLocal, targetCenter });

      const right = localLeft + localWidth;
      const bottom = localTop + localHeight;
      if (!focusRectLocal) {
        focusRectLocal = { left: localLeft, top: localTop, right, bottom };
      } else {
        focusRectLocal.left = Math.min(focusRectLocal.left, localLeft);
        focusRectLocal.top = Math.min(focusRectLocal.top, localTop);
        focusRectLocal.right = Math.max(focusRectLocal.right, right);
        focusRectLocal.bottom = Math.max(focusRectLocal.bottom, bottom);
      }
    }

    if (!focusRectLocal) return;

    // レーンの基準は「注釈対象の実範囲（focusRect）」だが、
    // ここにホスト（display:blockで幅100%）が混ざると「実際の見た目の寄せ」が判定できない。
    // そのため、preview-inner 幅に対して「ほぼフル幅」のターゲットは除外し、
    // 小さめのターゲット群の union を laneFocusRect として使う（無い場合は focusRect にフォールバック）。
    const previewInnerRect = this.#previewInner?.getBoundingClientRect();
    const previewInnerLocal =
      previewInnerRect && previewInnerRect.width > 0 && previewInnerRect.height > 0
        ? {
            left: previewInnerRect.left - containerRect.left,
            top: previewInnerRect.top - containerRect.top,
            width: previewInnerRect.width,
            height: previewInnerRect.height,
          }
        : null;

    let laneFocusRectLocal: FocusRectLocal | null = null;
    if (previewInnerLocal) {
      const maxLaneTargetWidth = previewInnerLocal.width * 0.9;
      const maxLaneTargetHeight = previewInnerLocal.height * 0.98;
      for (const { targetRectLocal } of targetInfo.values()) {
        if (targetRectLocal.width >= maxLaneTargetWidth) continue;
        if (targetRectLocal.height >= maxLaneTargetHeight) continue;
        const right = targetRectLocal.left + targetRectLocal.width;
        const bottom = targetRectLocal.top + targetRectLocal.height;
        if (!laneFocusRectLocal) {
          laneFocusRectLocal = { left: targetRectLocal.left, top: targetRectLocal.top, right, bottom };
        } else {
          laneFocusRectLocal.left = Math.min(laneFocusRectLocal.left, targetRectLocal.left);
          laneFocusRectLocal.top = Math.min(laneFocusRectLocal.top, targetRectLocal.top);
          laneFocusRectLocal.right = Math.max(laneFocusRectLocal.right, right);
          laneFocusRectLocal.bottom = Math.max(laneFocusRectLocal.bottom, bottom);
        }
      }
    }
    if (!laneFocusRectLocal) laneFocusRectLocal = focusRectLocal;

    const focusCenterXLocal = (laneFocusRectLocal.left + laneFocusRectLocal.right) / 2;

    // レーン固定（left-only/right-only）の判定には、コールアウト対象の union ではなく
    // 「プレビュー内でのコンポーネント自体の寄せ」を優先して使う。
    // - コールアウト対象が左右に散っている場合でも、コンポーネントが右寄せなら左にまとめたい
    // - 逆に、左寄せなら右へまとめたい
    // ただし、ターゲットがほぼフル幅の場合は寄せ判定ができないため、laneFocusRect にフォールバックする。
    const targetRect = this.#target?.getBoundingClientRect();
    const targetRectLocal =
      previewInnerLocal &&
      targetRect &&
      targetRect.width > 0 &&
      targetRect.height > 0 &&
      Number.isFinite(targetRect.left) &&
      Number.isFinite(targetRect.top)
        ? {
            left: targetRect.left - containerRect.left,
            top: targetRect.top - containerRect.top,
            width: targetRect.width,
            height: targetRect.height,
          }
        : null;

    const laneAlignRectLocal: FocusRectLocal = (() => {
      if (!previewInnerLocal || !targetRectLocal) return laneFocusRectLocal;
      const isFullWidth = targetRectLocal.width >= previewInnerLocal.width * 0.95;
      if (isFullWidth) return laneFocusRectLocal;
      return {
        left: targetRectLocal.left,
        top: targetRectLocal.top,
        right: targetRectLocal.left + targetRectLocal.width,
        bottom: targetRectLocal.top + targetRectLocal.height,
      };
    })();

    // コンポーネント（実ターゲット範囲）が右/左どちらに寄っているかを判定し、
    // 空いている側へレーンを固定する（寄せが無い場合は split）。
    let laneMode: 'split' | 'left-only' | 'right-only' = 'split';
    const inferLaneMode = (): typeof laneMode => {
      if (!previewInnerLocal) return 'split';

      const previewLeft = previewInnerLocal.left;
      const previewRight = previewInnerLocal.left + previewInnerLocal.width;
      const spaceLeft = laneAlignRectLocal.left - previewLeft;
      const spaceRight = previewRight - laneAlignRectLocal.right;
      if (spaceLeft < 0 || spaceRight < 0) return 'split';

      const diff = spaceLeft - spaceRight;

      // 差分がレーン距離以上なら固定を優先（小さいズレでも読みやすくするため）。
      if (diff >= laneOffset) return 'left-only'; // right aligned → labels on the left
      if (diff <= -laneOffset) return 'right-only'; // left aligned → labels on the right

      const absDiff = Math.abs(diff);
      const dominant = Math.max(spaceLeft, spaceRight);
      const minor = Math.min(spaceLeft, spaceRight);
      const ratio = (dominant + 1) / (minor + 1);

      // ズレの閾値はプレビュー幅に比例（極端にならないように clamp）
      // - 小さいプレビューでも寄せを検出したい（例: heading の shoulder）
      // - 大きいプレビューでも過剰に片寄せしない
      const minDiff = clamp(previewInnerLocal.width * 0.05, 32, 80);
      if (absDiff < minDiff || ratio < 1.4) return 'split';

      if (diff > 0) return 'left-only';
      if (diff < 0) return 'right-only';
      return 'split';
    };

    laneMode = inferLaneMode();

    const resolveSide = (placement: A11yCalloutPlacement | undefined, targetCenterX: number): 'left' | 'right' => {
      if (laneMode === 'left-only') return 'left';
      if (laneMode === 'right-only') return 'right';
      if (placement === 'top-left' || placement === 'bottom-left') return 'left';
      if (placement === 'top-right' || placement === 'bottom-right') return 'right';
      return targetCenterX < focusCenterXLocal ? 'left' : 'right';
    };

    const viewportMargin = clampMargin;
    const viewportMinXLocal = viewportMargin - containerRect.left;
    const viewportMaxXLocal = window.innerWidth - viewportMargin - containerRect.left;
    const minXLocal = Math.max(clampMargin, viewportMinXLocal);
    const maxXLocal = Math.min(containerRect.width - clampMargin, viewportMaxXLocal);

    const dockToSide = (
      item: CalloutRender,
      side: 'left' | 'right',
      y: number
    ): { side: 'left' | 'right'; desiredY: number; height: number; penalty: number } => {
      const laneXBase =
        side === 'left' ? laneFocusRectLocal.left - laneOffset : laneFocusRectLocal.right + laneOffset;
      const transform = side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)';

      // まず lane へドックし、サイズ計測のために暫定 top/left を入れる
      item.tagEl.style.transform = transform;
      item.tagEl.style.top = `${y}px`;
      item.tagEl.style.left = `${laneXBase}px`;

      const measured = item.tagEl.getBoundingClientRect();
      const w = measured.width || 0;
      const h = measured.height || 0;

      // はみ出し防止（viewport と callout-layer の両方に収める）
      const minForLeft = Math.min(minXLocal + w, maxXLocal);
      const maxForLeft = maxXLocal;
      const minForRight = minXLocal;
      const maxForRight = Math.max(minXLocal, maxXLocal - w);

      // left側は right-edge を clamp、right側は left-edge を clamp
      const laneX =
        side === 'left'
          ? clamp(laneXBase, minForLeft, maxForLeft)
          : clamp(laneXBase, minForRight, maxForRight);
      item.tagEl.style.left = `${laneX}px`;

      const penalty = Math.abs(laneX - laneXBase);
      return { side, desiredY: y, height: h, penalty };
    };

    // Pass 2: lane docking + measurement (height) + per-side stacking
    for (const item of this.#callouts) {
      const info = targetInfo.get(item);
      if (!info) continue;

      const { targetCenter } = info;
      const preferredSide = resolveSide(item.callout.placement, targetCenter.x);
      const preferred = dockToSide(item, preferredSide, targetCenter.y);

      // split の場合のみ、viewport clamp が強く効いている側は反転を試す（見た目の破綻回避）。
      let chosen = preferred;
      if (laneMode === 'split' && preferred.penalty > 1) {
        const otherSide = preferredSide === 'left' ? 'right' : 'left';
        const other = dockToSide(item, otherSide, targetCenter.y);
        if (other.penalty < preferred.penalty) chosen = other;
        else dockToSide(item, preferredSide, targetCenter.y); // revert (other sideを試したため)
      }

      laneItems.push({ item, desiredY: chosen.desiredY, height: chosen.height, side: chosen.side });
    }

    const packLane = (items: LaneItem[], side: 'left' | 'right') => {
      const list = items.filter((x) => x.side === side).sort((a, b) => a.desiredY - b.desiredY);
      if (list.length === 0) return;

      const minY = (h: number) => clampMargin + h / 2;
      const maxY = (h: number) => containerRect.height - clampMargin - h / 2;

      const centers = list.map((x) => ({
        ...x,
        centerY: clamp(x.desiredY, minY(x.height), maxY(x.height)),
      }));

      // forward: push down to resolve overlaps
      for (let i = 1; i < centers.length; i += 1) {
        const prev = centers[i - 1]!;
        const cur = centers[i]!;
        const minCenterY = prev.centerY + prev.height / 2 + laneGap + cur.height / 2;
        cur.centerY = Math.max(cur.centerY, minCenterY);
        cur.centerY = Math.min(cur.centerY, maxY(cur.height));
      }

      // backward: pull up if overflowed
      for (let i = centers.length - 2; i >= 0; i -= 1) {
        const next = centers[i + 1]!;
        const cur = centers[i]!;
        const maxCenterY = next.centerY - next.height / 2 - laneGap - cur.height / 2;
        cur.centerY = Math.min(cur.centerY, maxCenterY);
        cur.centerY = Math.max(cur.centerY, minY(cur.height));
      }

      // apply
      for (const c of centers) {
        c.item.tagEl.style.top = `${c.centerY}px`;
      }
    };

    packLane(laneItems, 'left');
    packLane(laneItems, 'right');

    // line calculation after final tag placement
    for (const { item } of laneItems) {
      const info = targetInfo.get(item);
      if (!info) continue;

      const { targetRectLocal, targetCenter } = info;

      const tagRect = item.tagEl.getBoundingClientRect();
      const tagRectLocal = {
        left: tagRect.left - containerRect.left,
        top: tagRect.top - containerRect.top,
        width: tagRect.width,
        height: tagRect.height,
      };
      const tagCenter = rectCenter(tagRectLocal);

      const start =
        pickRectBoundaryPoint(tagCenter, targetCenter, tagRectLocal) ??
        // fallback (should be rare)
        { x: tagCenter.x, y: tagCenter.y };

      const hit =
        pickRectBoundaryPoint(tagCenter, targetCenter, targetRectLocal) ??
        { x: targetCenter.x, y: targetCenter.y };

      const dir = { x: targetCenter.x - tagCenter.x, y: targetCenter.y - tagCenter.y };
      const safeHit = clampBoundaryPointAwayFromCorners(hit, targetRectLocal, cornerMargin, dir);

      const insetPx = computeInsetPx(targetRectLocal, lineInsetMin, Number.isFinite(ratio) ? ratio : 0.35);
      const end = insetPointTowards(safeHit, targetCenter, insetPx);

      item.lineEl.setAttribute('d', buildAutoPath(start, end, targetRectLocal));
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
