/**
 * Web Components Autoloader
 * Import Maps + TreeWalker + IntersectionObserver + Shadow DOM監視
 *
 * 特徴:
 * - TreeWalkerによる効率的なDOM走査（カスタム要素のみ）
 * - IntersectionObserverによる遅延ロード（画面内に入った時のみ）
 * - Shadow DOM内のカスタム要素も自動検出・ロード
 * - Import Mapsを使用したモジュール解決
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
var _Autoloader_instances, _Autoloader_mutationObserver, _Autoloader_intersectionObserver, _Autoloader_loaded, _Autoloader_loading, _Autoloader_pending, _Autoloader_observedShadowRoots, _Autoloader_debug, _Autoloader_onLoad, _Autoloader_lazyLoad, _Autoloader_scan, _Autoloader_processElement, _Autoloader_loadComponent, _Autoloader_observeShadowRoots, _Autoloader_log, _Autoloader_isCustomElement;
export class Autoloader {
    constructor(options = {}) {
        _Autoloader_instances.add(this);
        _Autoloader_mutationObserver.set(this, void 0);
        _Autoloader_intersectionObserver.set(this, null);
        _Autoloader_loaded.set(this, new Set());
        _Autoloader_loading.set(this, new Map());
        _Autoloader_pending.set(this, new Set());
        _Autoloader_observedShadowRoots.set(this, new WeakSet());
        _Autoloader_debug.set(this, void 0);
        _Autoloader_onLoad.set(this, void 0);
        _Autoloader_lazyLoad.set(this, void 0);
        __classPrivateFieldSet(this, _Autoloader_debug, options.debug ?? false, "f");
        __classPrivateFieldSet(this, _Autoloader_onLoad, options.onLoad ?? (() => { }), "f");
        __classPrivateFieldSet(this, _Autoloader_lazyLoad, options.lazyLoad ?? true, "f");
        __classPrivateFieldSet(this, _Autoloader_mutationObserver, new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node instanceof Element) {
                        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_scan).call(this, node);
                    }
                }
            }
        }), "f");
        if (__classPrivateFieldGet(this, _Autoloader_lazyLoad, "f")) {
            __classPrivateFieldSet(this, _Autoloader_intersectionObserver, new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const tagName = el.tagName.toLowerCase();
                        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `[Visible] ${tagName}`);
                        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_loadComponent).call(this, tagName);
                        __classPrivateFieldGet(this, _Autoloader_intersectionObserver, "f")?.unobserve(el);
                    }
                }
            }, { rootMargin: options.rootMargin ?? '100px', threshold: 0 }), "f");
        }
    }
    /**
     * Autoloaderを開始
     * 既存のDOM要素をスキャンし、MutationObserverを開始
     */
    start() {
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `Autoloader started (lazyLoad: ${__classPrivateFieldGet(this, _Autoloader_lazyLoad, "f")}, TreeWalker: true, ShadowDOM: true)`);
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_scan).call(this, document.documentElement);
        __classPrivateFieldGet(this, _Autoloader_mutationObserver, "f").observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    /**
     * Autoloaderを停止
     */
    stop() {
        __classPrivateFieldGet(this, _Autoloader_mutationObserver, "f").disconnect();
        __classPrivateFieldGet(this, _Autoloader_intersectionObserver, "f")?.disconnect();
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, 'Autoloader stopped');
    }
    /**
     * 特定のコンポーネントを事前ロード
     */
    async preload(tagName) {
        await __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_loadComponent).call(this, tagName);
    }
    /**
     * 複数のコンポーネントを並列で事前ロード
     */
    async preloadAll(tagNames) {
        await Promise.all(tagNames.map((name) => __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_loadComponent).call(this, name)));
    }
}
_Autoloader_mutationObserver = new WeakMap(), _Autoloader_intersectionObserver = new WeakMap(), _Autoloader_loaded = new WeakMap(), _Autoloader_loading = new WeakMap(), _Autoloader_pending = new WeakMap(), _Autoloader_observedShadowRoots = new WeakMap(), _Autoloader_debug = new WeakMap(), _Autoloader_onLoad = new WeakMap(), _Autoloader_lazyLoad = new WeakMap(), _Autoloader_instances = new WeakSet(), _Autoloader_scan = function _Autoloader_scan(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            const tagName = node.tagName.toLowerCase();
            return __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_isCustomElement).call(this, tagName)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_SKIP;
        }
    });
    // rootがカスタム要素の場合も処理
    if (root instanceof Element) {
        const rootTag = root.tagName.toLowerCase();
        if (__classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_isCustomElement).call(this, rootTag)) {
            __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_processElement).call(this, root);
        }
    }
    while (walker.nextNode()) {
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_processElement).call(this, walker.currentNode);
    }
}, _Autoloader_processElement = function _Autoloader_processElement(el) {
    const tagName = el.tagName.toLowerCase();
    if (__classPrivateFieldGet(this, _Autoloader_loaded, "f").has(tagName) || __classPrivateFieldGet(this, _Autoloader_loading, "f").has(tagName))
        return;
    if (__classPrivateFieldGet(this, _Autoloader_lazyLoad, "f") && __classPrivateFieldGet(this, _Autoloader_intersectionObserver, "f")) {
        if (!__classPrivateFieldGet(this, _Autoloader_pending, "f").has(tagName)) {
            __classPrivateFieldGet(this, _Autoloader_pending, "f").add(tagName);
            __classPrivateFieldGet(this, _Autoloader_intersectionObserver, "f").observe(el);
            __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `[Pending] ${tagName} - waiting for visibility`);
        }
    }
    else {
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_loadComponent).call(this, tagName);
    }
}, _Autoloader_loadComponent = 
/**
 * コンポーネントをロード（Import Maps経由）
 */
async function _Autoloader_loadComponent(tagName) {
    // 既に登録済みの場合はスキップ
    if (customElements.get(tagName))
        return;
    // 既にロード済みの場合はスキップ
    if (__classPrivateFieldGet(this, _Autoloader_loaded, "f").has(tagName))
        return;
    // ロード中の場合は同じPromiseを返す
    const existing = __classPrivateFieldGet(this, _Autoloader_loading, "f").get(tagName);
    if (existing)
        return existing;
    __classPrivateFieldGet(this, _Autoloader_pending, "f").delete(tagName);
    __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `Loading via Import Maps: ${tagName}`);
    const loadPromise = import(tagName)
        .then((module) => {
        __classPrivateFieldGet(this, _Autoloader_loading, "f").delete(tagName);
        __classPrivateFieldGet(this, _Autoloader_loaded, "f").add(tagName);
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `Loaded: ${tagName}`);
        __classPrivateFieldGet(this, _Autoloader_onLoad, "f").call(this, tagName);
        // コンポーネント定義後にshadowRootを監視
        customElements.whenDefined(tagName).then(() => {
            __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_observeShadowRoots).call(this, tagName);
        });
        return module;
    })
        .catch((error) => {
        __classPrivateFieldGet(this, _Autoloader_loading, "f").delete(tagName);
        __classPrivateFieldGet(this, _Autoloader_loaded, "f").delete(tagName);
        __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `Failed to load: ${tagName}`, error);
        throw error;
    });
    __classPrivateFieldGet(this, _Autoloader_loading, "f").set(tagName, loadPromise);
    return loadPromise;
}, _Autoloader_observeShadowRoots = function _Autoloader_observeShadowRoots(tagName) {
    const elements = document.querySelectorAll(tagName);
    for (const el of elements) {
        if (el.shadowRoot && !__classPrivateFieldGet(this, _Autoloader_observedShadowRoots, "f").has(el.shadowRoot)) {
            __classPrivateFieldGet(this, _Autoloader_observedShadowRoots, "f").add(el.shadowRoot);
            __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_scan).call(this, el.shadowRoot);
            __classPrivateFieldGet(this, _Autoloader_mutationObserver, "f").observe(el.shadowRoot, {
                childList: true,
                subtree: true
            });
            __classPrivateFieldGet(this, _Autoloader_instances, "m", _Autoloader_log).call(this, `[ShadowRoot] Observing ${tagName}`);
        }
    }
}, _Autoloader_log = function _Autoloader_log(message, ...args) {
    if (__classPrivateFieldGet(this, _Autoloader_debug, "f")) {
        console.log(`[Autoloader] ${message}`, ...args);
    }
}, _Autoloader_isCustomElement = function _Autoloader_isCustomElement(tagName) {
    return tagName.includes('-');
};
/**
 * Autoloaderインスタンスを作成して開始するヘルパー関数
 */
export function createAutoloader(options) {
    const autoloader = new Autoloader(options);
    autoloader.start();
    return autoloader;
}
/**
 * デフォルト設定でAutoloaderを開始
 */
export function startAutoloader(options) {
    return createAutoloader({
        debug: false,
        lazyLoad: true,
        ...options,
    });
}
// 後方互換性のためのエイリアス
export { Autoloader as ComponentAutoloader };
