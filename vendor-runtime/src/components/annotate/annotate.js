/**
 * @module annotate
 * アクセシビリティ注釈（ドキュメンテーション用途）のラッパー
 * @version 0.1.0
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
var _DadsAnnotate_instances, _a, _DadsAnnotate_targetRoot, _DadsAnnotate_panelBody, _DadsAnnotate_panelSubtitle, _DadsAnnotate_panelBadges, _DadsAnnotate_calloutLayer, _DadsAnnotate_calloutSvg, _DadsAnnotate_previewInner, _DadsAnnotate_refreshQueued, _DadsAnnotate_target, _DadsAnnotate_callouts, _DadsAnnotate_observers, _DadsAnnotate_resizeObserver, _DadsAnnotate_raf, _DadsAnnotate_supportsAnchors, _DadsAnnotate_readCssPx, _DadsAnnotate_instanceCounter, _DadsAnnotate_instanceId, _DadsAnnotate_moveInitialContentIntoTargetRoot, _DadsAnnotate_setupResizeObserver, _DadsAnnotate_scheduleLayout, _DadsAnnotate_scheduleRefresh, _DadsAnnotate_refresh, _DadsAnnotate_resolveTarget, _DadsAnnotate_render, _DadsAnnotate_formatCalloutTag, _DadsAnnotate_renderSnapshot, _DadsAnnotate_normalizeCallouts, _DadsAnnotate_resolveElementRef, _DadsAnnotate_hasRenderableBox, _DadsAnnotate_isEmptyOrHidden, _DadsAnnotate_layoutCallouts, _DadsAnnotate_setupLiveObservers, _DadsAnnotate_windowCleanup, _DadsAnnotate_teardownObservers, _DadsAnnotate_refreshSnapshotsOnly;
import { css, html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
const CATEGORY_ORDER = Object.freeze([
    'semantics',
    'keyboard',
    'zoom',
    'states',
    'labels',
    'motion',
]);
const CATEGORY_LABELS = Object.freeze({
    semantics: 'セマンティクス / 関係性 / 構造',
    keyboard: 'キーボード操作',
    zoom: 'ズーム / レスポンシブ',
    states: '状態 / フィードバック',
    labels: 'ラベル / インストラクション',
    motion: 'モーション / アニメーション / タイミング',
});
function asArray(v) {
    if (!v)
        return [];
    return typeof v === 'string' ? [v] : v;
}
function isHTMLElement(v) {
    return v instanceof HTMLElement;
}
function getAriaAttrs(el) {
    const out = [];
    for (const attr of el.attributes) {
        if (attr.name.startsWith('aria-'))
            out.push([attr.name, attr.value]);
    }
    return out;
}
const CEM_URL = '/custom-elements.json';
const A11Y_QUERY_PARAM = 'a11y';
const A11Y_STORAGE_KEY = 'dads:a11y';
let cemAnnotations = null;
let cemAnnotationsPromise = null;
function isA11yAnnotationsEnabled() {
    if (typeof window === 'undefined')
        return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get(A11Y_QUERY_PARAM) === '1')
        return true;
    try {
        return window.localStorage.getItem(A11Y_STORAGE_KEY) === '1';
    }
    catch {
        return false;
    }
}
function parseCemAnnotations(manifest) {
    const map = new Map();
    const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
    for (const mod of modules) {
        const declarations = Array.isArray(mod.declarations) ? mod.declarations : [];
        for (const decl of declarations) {
            const tagName = typeof decl.tagName === 'string' ? decl.tagName.toLowerCase() : '';
            if (!tagName)
                continue;
            const spec = decl.custom?.a11yAnnotations;
            if (spec && spec.version === 1)
                map.set(tagName, spec);
        }
    }
    return map;
}
function loadCemAnnotations() {
    if (cemAnnotations)
        return Promise.resolve(cemAnnotations);
    if (!cemAnnotationsPromise) {
        cemAnnotationsPromise = fetch(CEM_URL)
            .then((res) => {
            if (!res.ok)
                throw new Error(`Failed to load CEM: ${res.status}`);
            return res.json();
        })
            .then((manifest) => {
            const map = parseCemAnnotations(manifest);
            cemAnnotations = map;
            return map;
        })
            .catch((err) => {
            console.warn('[a11y-annotate] Failed to load custom-elements.json', err);
            const empty = new Map();
            cemAnnotations = empty;
            return empty;
        });
    }
    return cemAnnotationsPromise;
}
function readAnnotations(el, onCemLoaded) {
    if (isA11yAnnotationsEnabled()) {
        const tagName = el.localName;
        const spec = cemAnnotations?.get(tagName) ?? null;
        if (spec)
            return spec;
        void loadCemAnnotations().then(() => onCemLoaded?.());
    }
    const inst = el.a11yAnnotations;
    if (inst && inst.version === 1)
        return inst;
    const ctor = el.constructor?.a11yAnnotations;
    if (ctor && ctor.version === 1)
        return ctor;
    return null;
}
function supportsAnchorPositioning() {
    if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
        return false;
    }
    return (CSS.supports('anchor-name: --a11y-annotate-test') &&
        CSS.supports('position-anchor: --a11y-annotate-test'));
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
    constructor() {
        var _b, _c;
        super(...arguments);
        _DadsAnnotate_instances.add(this);
        _DadsAnnotate_targetRoot.set(this, null);
        _DadsAnnotate_panelBody.set(this, null);
        _DadsAnnotate_panelSubtitle.set(this, null);
        _DadsAnnotate_panelBadges.set(this, null);
        _DadsAnnotate_calloutLayer.set(this, null);
        _DadsAnnotate_calloutSvg.set(this, null);
        _DadsAnnotate_previewInner.set(this, null);
        _DadsAnnotate_refreshQueued.set(this, false);
        _DadsAnnotate_target.set(this, null);
        _DadsAnnotate_callouts.set(this, []);
        _DadsAnnotate_observers.set(this, []);
        _DadsAnnotate_resizeObserver.set(this, null);
        _DadsAnnotate_raf.set(this, 0);
        _DadsAnnotate_supportsAnchors.set(this, supportsAnchorPositioning());
        _DadsAnnotate_instanceId.set(this, __classPrivateFieldSet(_b = _a, _a, (_c = __classPrivateFieldGet(_b, _a, "f", _DadsAnnotate_instanceCounter), ++_c), "f", _DadsAnnotate_instanceCounter));
        _DadsAnnotate_windowCleanup.set(this, null);
    }
    connectedCallback() {
        super.connectedCallback();
        __classPrivateFieldSet(this, _DadsAnnotate_targetRoot, this.querySelector('[part="target-root"]'), "f");
        __classPrivateFieldSet(this, _DadsAnnotate_panelBody, this.querySelector('[part="panel-body"]'), "f");
        __classPrivateFieldSet(this, _DadsAnnotate_panelSubtitle, this.querySelector('[part="panel-subtitle"]'), "f");
        __classPrivateFieldSet(this, _DadsAnnotate_panelBadges, this.querySelector('[part="panel-badges"]'), "f");
        __classPrivateFieldSet(this, _DadsAnnotate_calloutLayer, this.querySelector('[part="callout-layer"]'), "f");
        __classPrivateFieldSet(this, _DadsAnnotate_previewInner, this.querySelector('[part="preview-inner"]'), "f");
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_moveInitialContentIntoTargetRoot).call(this);
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_setupResizeObserver).call(this);
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_refresh).call(this);
    }
    disconnectedCallback() {
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_teardownObservers).call(this);
        __classPrivateFieldGet(this, _DadsAnnotate_resizeObserver, "f")?.disconnect();
        __classPrivateFieldSet(this, _DadsAnnotate_resizeObserver, null, "f");
        if (__classPrivateFieldGet(this, _DadsAnnotate_raf, "f"))
            cancelAnimationFrame(__classPrivateFieldGet(this, _DadsAnnotate_raf, "f"));
        __classPrivateFieldSet(this, _DadsAnnotate_raf, 0, "f");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue)
            return;
        if (name === 'target-selector' || name === 'mode' || name === 'no-live') {
            __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_refresh).call(this);
        }
    }
}
_a = DadsAnnotate, _DadsAnnotate_targetRoot = new WeakMap(), _DadsAnnotate_panelBody = new WeakMap(), _DadsAnnotate_panelSubtitle = new WeakMap(), _DadsAnnotate_panelBadges = new WeakMap(), _DadsAnnotate_calloutLayer = new WeakMap(), _DadsAnnotate_calloutSvg = new WeakMap(), _DadsAnnotate_previewInner = new WeakMap(), _DadsAnnotate_refreshQueued = new WeakMap(), _DadsAnnotate_target = new WeakMap(), _DadsAnnotate_callouts = new WeakMap(), _DadsAnnotate_observers = new WeakMap(), _DadsAnnotate_resizeObserver = new WeakMap(), _DadsAnnotate_raf = new WeakMap(), _DadsAnnotate_supportsAnchors = new WeakMap(), _DadsAnnotate_instanceId = new WeakMap(), _DadsAnnotate_windowCleanup = new WeakMap(), _DadsAnnotate_instances = new WeakSet(), _DadsAnnotate_readCssPx = function _DadsAnnotate_readCssPx(varName, fallback) {
    if (typeof window === 'undefined')
        return fallback;
    const value = getComputedStyle(this).getPropertyValue(varName).trim();
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}, _DadsAnnotate_moveInitialContentIntoTargetRoot = function _DadsAnnotate_moveInitialContentIntoTargetRoot() {
    if (!__classPrivateFieldGet(this, _DadsAnnotate_targetRoot, "f"))
        return;
    const layout = this.querySelector('[part="layout"]');
    if (!layout)
        return;
    const nodes = Array.from(this.childNodes);
    for (const node of nodes) {
        // layout 自体とその内部は移動しない
        if (node === layout)
            continue;
        if (node instanceof Node && layout.contains(node))
            continue;
        // それ以外は注釈対象（プレビュー）へ移動
        // 余計な空白テキストは無視
        if (node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() === '') {
            node.parentNode?.removeChild(node);
            continue;
        }
        __classPrivateFieldGet(this, _DadsAnnotate_targetRoot, "f").appendChild(node);
    }
}, _DadsAnnotate_setupResizeObserver = function _DadsAnnotate_setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined')
        return;
    if (__classPrivateFieldGet(this, _DadsAnnotate_resizeObserver, "f"))
        return;
    __classPrivateFieldSet(this, _DadsAnnotate_resizeObserver, new ResizeObserver(() => __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_scheduleLayout).call(this)), "f");
    if (__classPrivateFieldGet(this, _DadsAnnotate_previewInner, "f"))
        __classPrivateFieldGet(this, _DadsAnnotate_resizeObserver, "f").observe(__classPrivateFieldGet(this, _DadsAnnotate_previewInner, "f"));
}, _DadsAnnotate_scheduleLayout = function _DadsAnnotate_scheduleLayout() {
    if (__classPrivateFieldGet(this, _DadsAnnotate_raf, "f"))
        cancelAnimationFrame(__classPrivateFieldGet(this, _DadsAnnotate_raf, "f"));
    __classPrivateFieldSet(this, _DadsAnnotate_raf, requestAnimationFrame(() => {
        __classPrivateFieldSet(this, _DadsAnnotate_raf, 0, "f");
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_layoutCallouts).call(this);
    }), "f");
}, _DadsAnnotate_scheduleRefresh = function _DadsAnnotate_scheduleRefresh() {
    if (__classPrivateFieldGet(this, _DadsAnnotate_refreshQueued, "f"))
        return;
    __classPrivateFieldSet(this, _DadsAnnotate_refreshQueued, true, "f");
    queueMicrotask(() => {
        __classPrivateFieldSet(this, _DadsAnnotate_refreshQueued, false, "f");
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_refresh).call(this);
    });
}, _DadsAnnotate_refresh = function _DadsAnnotate_refresh() {
    if (!__classPrivateFieldGet(this, _DadsAnnotate_targetRoot, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_panelBody, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_panelSubtitle, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_panelBadges, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f")) {
        return;
    }
    const nextTarget = __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_resolveTarget).call(this);
    const targetChanged = nextTarget !== __classPrivateFieldGet(this, _DadsAnnotate_target, "f");
    __classPrivateFieldSet(this, _DadsAnnotate_target, nextTarget, "f");
    if (!__classPrivateFieldGet(this, _DadsAnnotate_target, "f")) {
        __classPrivateFieldGet(this, _DadsAnnotate_panelSubtitle, "f").textContent = '注釈対象が見つかりません。';
        __classPrivateFieldGet(this, _DadsAnnotate_panelBadges, "f").textContent = '';
        __classPrivateFieldGet(this, _DadsAnnotate_panelBody, "f").textContent = '';
        __classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f").textContent = '';
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_teardownObservers).call(this);
        return;
    }
    const spec = readAnnotations(__classPrivateFieldGet(this, _DadsAnnotate_target, "f"), () => __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_scheduleRefresh).call(this));
    __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_render).call(this, spec);
    if (targetChanged) {
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_teardownObservers).call(this);
        if (!this.hasAttribute('no-live')) {
            __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_setupLiveObservers).call(this);
        }
    }
    __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_scheduleLayout).call(this);
}, _DadsAnnotate_resolveTarget = function _DadsAnnotate_resolveTarget() {
    const container = __classPrivateFieldGet(this, _DadsAnnotate_targetRoot, "f");
    if (!container)
        return null;
    const directChildren = Array.from(container.children).filter(isHTMLElement);
    const root = directChildren.find((el) => el.tagName.includes('-')) ?? directChildren[0] ?? null;
    if (!root)
        return null;
    const selector = this.getAttribute('target-selector')?.trim();
    if (!selector)
        return root;
    if (root.matches(selector))
        return root;
    const found = root.querySelector(selector);
    return isHTMLElement(found) ? found : root;
}, _DadsAnnotate_render = function _DadsAnnotate_render(spec) {
    if (!__classPrivateFieldGet(this, _DadsAnnotate_panelBody, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_panelSubtitle, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_panelBadges, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f") || !__classPrivateFieldGet(this, _DadsAnnotate_target, "f")) {
        return;
    }
    const mode = (this.getAttribute('mode') ?? 'both').toLowerCase();
    const showPanel = mode === 'both' || mode === 'panel';
    const showMarkers = mode === 'both' || mode === 'callouts';
    this.querySelector('[part="panel"]')?.toggleAttribute('hidden', !showPanel);
    __classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f").toggleAttribute('hidden', !showMarkers);
    const tagName = __classPrivateFieldGet(this, _DadsAnnotate_target, "f").tagName.toLowerCase();
    const summary = spec?.summary ? `— ${spec.summary}` : '';
    __classPrivateFieldGet(this, _DadsAnnotate_panelSubtitle, "f").textContent = `${tagName}${summary}`;
    __classPrivateFieldGet(this, _DadsAnnotate_panelBadges, "f").textContent = '';
    const targetVersion = __classPrivateFieldGet(this, _DadsAnnotate_target, "f").constructor.version;
    const badges = [
        !this.hasAttribute('no-live') && 'Live',
        'Overlay',
        __classPrivateFieldGet(this, _DadsAnnotate_supportsAnchors, "f") && 'Anchor-ready',
        `Annotate v${_a.version}`,
        spec && `Spec v${spec.version}`,
        typeof targetVersion === 'string' && `${tagName} v${targetVersion}`,
    ].filter(Boolean);
    for (const label of badges) {
        const span = document.createElement('span');
        span.className = 'badge';
        span.textContent = label;
        __classPrivateFieldGet(this, _DadsAnnotate_panelBadges, "f").appendChild(span);
    }
    __classPrivateFieldGet(this, _DadsAnnotate_panelBody, "f").textContent = '';
    const categories = spec?.categories ?? {};
    const callouts = __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_normalizeCallouts).call(this, spec);
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
            const snapshot = __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_renderSnapshot).call(this, item.targetEl);
            if (snapshot)
                text.appendChild(snapshot);
            li.appendChild(text);
            list.appendChild(li);
        }
        calloutSection.appendChild(list);
        __classPrivateFieldGet(this, _DadsAnnotate_panelBody, "f").appendChild(calloutSection);
    }
    // カテゴリごとの説明
    for (const category of CATEGORY_ORDER) {
        const content = asArray(categories[category]);
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
        }
        else {
            const p = document.createElement('p');
            p.textContent = '（未記載）';
            section.appendChild(p);
        }
        __classPrivateFieldGet(this, _DadsAnnotate_panelBody, "f").appendChild(section);
    }
    // Markers
    __classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f").textContent = '';
    __classPrivateFieldSet(this, _DadsAnnotate_calloutSvg, null, "f");
    __classPrivateFieldSet(this, _DadsAnnotate_callouts, [], "f");
    for (const item of callouts) {
        if (!showMarkers)
            continue;
        const mode = item.callout.mode ?? 'both';
        if (mode === 'panel')
            continue;
        if (!__classPrivateFieldGet(this, _DadsAnnotate_calloutSvg, "f")) {
            const svg = document.createElementNS(SVG_NS, 'svg');
            svg.classList.add('callout-svg');
            svg.setAttribute('aria-hidden', 'true');
            __classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f").appendChild(svg);
            __classPrivateFieldSet(this, _DadsAnnotate_calloutSvg, svg, "f");
        }
        __classPrivateFieldGet(this, _DadsAnnotate_calloutSvg, "f").appendChild(item.lineEl);
        __classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f").appendChild(item.overlayEl);
        __classPrivateFieldGet(this, _DadsAnnotate_callouts, "f").push(item);
    }
}, _DadsAnnotate_formatCalloutTag = function _DadsAnnotate_formatCalloutTag(callout, el) {
    if (callout.label)
        return callout.label;
    if (!el)
        return callout.title;
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
    ];
    for (const k of stateAttrs) {
        const v = el.getAttribute(k);
        if (v !== null)
            return `${k}="${v}"`;
    }
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel !== null)
        return `<${tag} aria-label="${ariaLabel}">`;
    if (role !== null)
        return `<${tag} role="${role}">`;
    if (slot !== null)
        return `slot="${slot}"`;
    const aria = getAriaAttrs(el);
    if (aria.length > 0)
        return `${aria[0][0]}="${aria[0][1]}"`;
    return `<${tag}>`;
}, _DadsAnnotate_renderSnapshot = function _DadsAnnotate_renderSnapshot(el) {
    if (!el)
        return null;
    const role = el.getAttribute('role');
    const aria = getAriaAttrs(el);
    const pre = document.createElement('pre');
    pre.className = 'snapshot';
    const lines = [];
    lines.push(`要素: <${el.tagName.toLowerCase()}>`);
    if (role)
        lines.push(`role: ${role}`);
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
}, _DadsAnnotate_normalizeCallouts = function _DadsAnnotate_normalizeCallouts(spec) {
    const raw = spec?.callouts ?? [];
    const out = [];
    let n = 0;
    for (const callout of raw) {
        const targetEl = __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_resolveElementRef).call(this, callout.target);
        if (!targetEl) {
            continue;
        }
        // ターゲット要素が空または非表示の場合はスキップ
        if (__classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_isEmptyOrHidden).call(this, targetEl)) {
            continue;
        }
        n += 1;
        const anchorName = `--a11y-annotate-${__classPrivateFieldGet(this, _DadsAnnotate_instanceId, "f")}-${n}`;
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
        code.textContent = __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_formatCalloutTag).call(this, callout, targetEl);
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
}, _DadsAnnotate_resolveElementRef = function _DadsAnnotate_resolveElementRef(ref) {
    const host = ref.host ?? 'target';
    const hostBase = host === 'annotate' ? this : __classPrivateFieldGet(this, _DadsAnnotate_target, "f");
    if (!hostBase)
        return null;
    const hostEl = ref.hostSelector
        ? hostBase.querySelector(ref.hostSelector)
        : hostBase;
    if (!hostEl)
        return null;
    const scope = ref.scope ?? 'light';
    if (scope === 'shadow') {
        const root = hostEl.shadowRoot;
        if (!root)
            return null;
        return root.querySelector(ref.selector);
    }
    return hostEl.querySelector(ref.selector);
}, _DadsAnnotate_hasRenderableBox = function _DadsAnnotate_hasRenderableBox(el) {
    // display:none / detached / not rendered
    if (!el.isConnected)
        return false;
    const anyEl = el;
    if (typeof anyEl.checkVisibility === 'function') {
        try {
            if (!anyEl.checkVisibility())
                return false;
        }
        catch {
            // ignore and fallback to heuristics below
        }
    }
    if (el.getClientRects().length === 0)
        return false;
    const rect = el.getBoundingClientRect();
    return rect.width !== 0 || rect.height !== 0;
}, _DadsAnnotate_isEmptyOrHidden = function _DadsAnnotate_isEmptyOrHidden(el) {
    // hidden属性
    if (el.hasAttribute('hidden'))
        return true;
    // CSSで非表示（getComputedStyleはDOMに接続されている場合のみ有効）
    if (el.isConnected) {
        const style = getComputedStyle(el);
        if (style.display === 'none')
            return true;
    }
    // ARIA属性またはrole属性を持つ場合は空でもスキップしない
    const hasAriaAttrs = getAriaAttrs(el).length > 0;
    const hasRole = el.hasAttribute('role');
    if (hasAriaAttrs || hasRole)
        return false;
    // 子要素がある場合は空ではない（例：アイコンなど）
    if (el.children.length > 0)
        return false;
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
}, _DadsAnnotate_layoutCallouts = function _DadsAnnotate_layoutCallouts() {
    if (!__classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f"))
        return;
    const containerRect = __classPrivateFieldGet(this, _DadsAnnotate_calloutLayer, "f").getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0)
        return;
    const parseRadiusPx = (value, fontSize) => {
        const trimmed = value.trim();
        if (!trimmed)
            return 0;
        const first = trimmed.split(/\s+/)[0] ?? '';
        if (!first || first.endsWith('%'))
            return 0;
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
    if (__classPrivateFieldGet(this, _DadsAnnotate_calloutSvg, "f")) {
        __classPrivateFieldGet(this, _DadsAnnotate_calloutSvg, "f").setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);
        __classPrivateFieldGet(this, _DadsAnnotate_calloutSvg, "f").setAttribute('width', String(containerRect.width));
        __classPrivateFieldGet(this, _DadsAnnotate_calloutSvg, "f").setAttribute('height', String(containerRect.height));
    }
    const placedTags = [];
    const overlapMargin = 8;
    for (const item of __classPrivateFieldGet(this, _DadsAnnotate_callouts, "f")) {
        const anchorEl = item.targetEl;
        if (!anchorEl) {
            item.overlayEl.style.display = 'none';
            item.lineEl.style.display = 'none';
            continue;
        }
        if (!__classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_hasRenderableBox).call(this, anchorEl)) {
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
        const computed = getComputedStyle(anchorEl);
        const baseRadii = {
            topLeft: parseRadiusPx(computed.borderTopLeftRadius, rootFontSize),
            topRight: parseRadiusPx(computed.borderTopRightRadius, rootFontSize),
            bottomRight: parseRadiusPx(computed.borderBottomRightRadius, rootFontSize),
            bottomLeft: parseRadiusPx(computed.borderBottomLeftRadius, rootFontSize),
        };
        const maxRadius = Math.min((localWidth + pad * 2) / 2, (localHeight + pad * 2) / 2);
        const toBoxRadius = (base) => {
            if (base <= 0)
                return 0;
            const padded = base + pad;
            return Math.max(0, Math.min(padded, maxRadius));
        };
        item.boxEl.style.borderTopLeftRadius = `${toBoxRadius(baseRadii.topLeft)}px`;
        item.boxEl.style.borderTopRightRadius = `${toBoxRadius(baseRadii.topRight)}px`;
        item.boxEl.style.borderBottomRightRadius = `${toBoxRadius(baseRadii.bottomRight)}px`;
        item.boxEl.style.borderBottomLeftRadius = `${toBoxRadius(baseRadii.bottomLeft)}px`;
        const placement = item.callout.placement ?? 'top-right';
        const isLeft = placement === 'top-left' || placement === 'bottom-left';
        const isTop = placement === 'top-left' || placement === 'top-right';
        const anchorX = isLeft ? localLeft : localLeft + localWidth;
        const anchorY = isTop ? localTop : localTop + localHeight;
        const gap = __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_readCssPx).call(this, '--spacing-6', 24);
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
            }
            else if (tagRect.right > containerRect.right - clampMargin) {
                dx = containerRect.right - clampMargin - tagRect.right;
            }
            if (tagRect.top < containerRect.top + clampMargin) {
                dy = containerRect.top + clampMargin - tagRect.top;
            }
            else if (tagRect.bottom > containerRect.bottom - clampMargin) {
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
            if (!hit)
                break;
            const shift = 10;
            tagTop += isTop
                ? hit.bottom - tagRect.top + shift
                : -(tagRect.bottom - hit.top + shift);
            item.tagEl.style.top = `${tagTop}px`;
            tagRect = clampToContainer();
        }
        // ターゲットと重なる場合は、少しだけ離す
        const intersectsTarget = tagRect.left < rect.right &&
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
}, _DadsAnnotate_setupLiveObservers = function _DadsAnnotate_setupLiveObservers() {
    if (!__classPrivateFieldGet(this, _DadsAnnotate_target, "f"))
        return;
    const onMutation = () => {
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_refreshSnapshotsOnly).call(this);
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_scheduleLayout).call(this);
    };
    const onLayout = () => {
        __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_scheduleLayout).call(this);
    };
    const observeNode = (node) => {
        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type !== 'attributes')
                    return onMutation();
                if (m.attributeName && m.attributeName !== 'style')
                    return onMutation();
            }
        });
        mo.observe(node, { attributes: true, childList: true, subtree: true });
        __classPrivateFieldGet(this, _DadsAnnotate_observers, "f").push(mo);
    };
    observeNode(__classPrivateFieldGet(this, _DadsAnnotate_target, "f"));
    if (__classPrivateFieldGet(this, _DadsAnnotate_target, "f").shadowRoot)
        observeNode(__classPrivateFieldGet(this, _DadsAnnotate_target, "f").shadowRoot);
    // calloutsが参照するshadowRootも監視
    const spec = readAnnotations(__classPrivateFieldGet(this, _DadsAnnotate_target, "f"));
    for (const c of spec?.callouts ?? []) {
        if (c.target.scope !== 'shadow')
            continue;
        const hostBase = (c.target.host ?? 'target') === 'annotate' ? this : __classPrivateFieldGet(this, _DadsAnnotate_target, "f");
        const hostEl = c.target.hostSelector
            ? hostBase?.querySelector(c.target.hostSelector)
            : hostBase;
        if (hostEl?.shadowRoot)
            observeNode(hostEl.shadowRoot);
    }
    window.addEventListener('resize', onLayout, { passive: true });
    window.addEventListener('scroll', onLayout, { passive: true, capture: true });
    // teardownで消すために、リスナーをObserverに紐付けず、専用フラグで管理
    __classPrivateFieldSet(this, _DadsAnnotate_windowCleanup, () => {
        window.removeEventListener('resize', onLayout);
        window.removeEventListener('scroll', onLayout, true);
    }, "f");
}, _DadsAnnotate_teardownObservers = function _DadsAnnotate_teardownObservers() {
    for (const o of __classPrivateFieldGet(this, _DadsAnnotate_observers, "f"))
        o.disconnect();
    __classPrivateFieldSet(this, _DadsAnnotate_observers, [], "f");
    __classPrivateFieldGet(this, _DadsAnnotate_windowCleanup, "f")?.call(this);
    __classPrivateFieldSet(this, _DadsAnnotate_windowCleanup, null, "f");
}, _DadsAnnotate_refreshSnapshotsOnly = function _DadsAnnotate_refreshSnapshotsOnly() {
    // 現状は #render がスナップショットも含めて作り直すので、
    // まずはシンプルに全体再レンダーに寄せる。
    // （将来: 差分更新に最適化）
    const spec = __classPrivateFieldGet(this, _DadsAnnotate_target, "f") ? readAnnotations(__classPrivateFieldGet(this, _DadsAnnotate_target, "f")) : null;
    __classPrivateFieldGet(this, _DadsAnnotate_instances, "m", _DadsAnnotate_render).call(this, spec);
};
DadsAnnotate.version = '0.1.0';
DadsAnnotate.definition = {
    name: 'a11y-annotate',
    shadowOptions: null,
    template: html `
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
    styles: css `
      a11y-annotate {
        display: block;

        /* カスタマイズ可能な注釈カラー */
        --a11y-annotate-callout-color-solid: var(--color-semantic-error-1, #ec0000);
        --a11y-annotate-callout-color: var(--a11y-annotate-callout-color-solid);

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
        --a11y-annotate-callout-gutter: var(--spacing-16, 64px);
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
_DadsAnnotate_instanceCounter = { value: 0 };
