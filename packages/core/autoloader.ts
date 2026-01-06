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

export interface AutoloaderOptions {
  /** デバッグログを出力するか */
  debug?: boolean;
  /** 遅延ロードを有効にするか（デフォルト: true） */
  lazyLoad?: boolean;
  /** コンポーネントロード時のコールバック */
  onLoad?: (tagName: string) => void;
  /** IntersectionObserverのrootMargin（デフォルト: '100px'） */
  rootMargin?: string;
}

export class Autoloader {
  #mutationObserver: MutationObserver;
  #intersectionObserver: IntersectionObserver | null = null;
  #loaded = new Set<string>();
  #loading = new Map<string, Promise<unknown>>();
  #pending = new Set<string>();
  #observedShadowRoots = new WeakSet<ShadowRoot>();
  #debug: boolean;
  #onLoad: (tagName: string) => void;
  #lazyLoad: boolean;

  constructor(options: AutoloaderOptions = {}) {
    this.#debug = options.debug ?? false;
    this.#onLoad = options.onLoad ?? (() => {});
    this.#lazyLoad = options.lazyLoad ?? true;

    this.#mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            this.#scan(node);
          }
        }
      }
    });

    if (this.#lazyLoad) {
      this.#intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const el = entry.target;
              const tagName = el.tagName.toLowerCase();
              this.#log(`[Visible] ${tagName}`);
              this.#loadComponent(tagName);
              this.#intersectionObserver?.unobserve(el);
            }
          }
        },
        { rootMargin: options.rootMargin ?? '100px', threshold: 0 }
      );
    }
  }

  /**
   * Autoloaderを開始
   * 既存のDOM要素をスキャンし、MutationObserverを開始
   */
  start(): void {
    this.#log(`Autoloader started (lazyLoad: ${this.#lazyLoad}, TreeWalker: true, ShadowDOM: true)`);
    this.#scan(document.documentElement);
    this.#mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Autoloaderを停止
   */
  stop(): void {
    this.#mutationObserver.disconnect();
    this.#intersectionObserver?.disconnect();
    this.#log('Autoloader stopped');
  }

  /**
   * 特定のコンポーネントを事前ロード
   */
  async preload(tagName: string): Promise<void> {
    await this.#loadComponent(tagName);
  }

  /**
   * 複数のコンポーネントを並列で事前ロード
   */
  async preloadAll(tagNames: string[]): Promise<void> {
    await Promise.all(tagNames.map((name) => this.#loadComponent(name)));
  }

  /**
   * TreeWalkerを使用した効率的なDOM走査
   */
  #scan(root: Node): void {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node: Node): number => {
          const tagName = (node as Element).tagName.toLowerCase();
          return this.#isCustomElement(tagName)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }
      }
    );

    // rootがカスタム要素の場合も処理
    if (root instanceof Element) {
      const rootTag = root.tagName.toLowerCase();
      if (this.#isCustomElement(rootTag)) {
        this.#processElement(root);
      }
    }

    while (walker.nextNode()) {
      this.#processElement(walker.currentNode as Element);
    }
  }

  /**
   * 要素の処理（遅延ロードまたは即時ロード）
   */
  #processElement(el: Element): void {
    const tagName = el.tagName.toLowerCase();
    if (this.#loaded.has(tagName) || this.#loading.has(tagName)) return;

    if (this.#lazyLoad && this.#intersectionObserver) {
      if (!this.#pending.has(tagName)) {
        this.#pending.add(tagName);
        this.#intersectionObserver.observe(el);
        this.#log(`[Pending] ${tagName} - waiting for visibility`);
      }
    } else {
      this.#loadComponent(tagName);
    }
  }

  /**
   * コンポーネントをロード（Import Maps経由）
   */
  async #loadComponent(tagName: string): Promise<unknown> {
    // 既に登録済みの場合はスキップ
    if (customElements.get(tagName)) return;

    // 既にロード済みの場合はスキップ
    if (this.#loaded.has(tagName)) return;

    // ロード中の場合は同じPromiseを返す
    const existing = this.#loading.get(tagName);
    if (existing) return existing;

    this.#pending.delete(tagName);

    this.#log(`Loading via Import Maps: ${tagName}`);

    const loadPromise = import(tagName)
      .then((module) => {
        this.#loading.delete(tagName);
        this.#loaded.add(tagName);
        this.#log(`Loaded: ${tagName}`);
        this.#onLoad(tagName);

        // コンポーネント定義後にshadowRootを監視
        customElements.whenDefined(tagName).then(() => {
          this.#observeShadowRoots(tagName);
        });

        return module;
      })
      .catch((error) => {
        this.#loading.delete(tagName);
        this.#loaded.delete(tagName);
        this.#log(`Failed to load: ${tagName}`, error);
        throw error;
      });

    this.#loading.set(tagName, loadPromise);
    return loadPromise;
  }

  /**
   * Shadow DOM内のカスタム要素を監視
   */
  #observeShadowRoots(tagName: string): void {
    const elements = document.querySelectorAll(tagName);
    for (const el of elements) {
      if (el.shadowRoot && !this.#observedShadowRoots.has(el.shadowRoot)) {
        this.#observedShadowRoots.add(el.shadowRoot);
        this.#scan(el.shadowRoot);
        this.#mutationObserver.observe(el.shadowRoot, {
          childList: true,
          subtree: true
        });
        this.#log(`[ShadowRoot] Observing ${tagName}`);
      }
    }
  }

  #log(message: string, ...args: unknown[]): void {
    if (this.#debug) {
      console.log(`[Autoloader] ${message}`, ...args);
    }
  }

  /**
   * タグ名がカスタム要素かどうかを判定
   */
  #isCustomElement(tagName: string): boolean {
    return tagName.includes('-');
  }
}

/**
 * Autoloaderインスタンスを作成して開始するヘルパー関数
 */
export function createAutoloader(options?: AutoloaderOptions): Autoloader {
  const autoloader = new Autoloader(options);
  autoloader.start();
  return autoloader;
}

/**
 * デフォルト設定でAutoloaderを開始
 */
export function startAutoloader(options?: AutoloaderOptions): Autoloader {
  return createAutoloader({
    debug: false,
    lazyLoad: true,
    ...options,
  });
}

// 後方互換性のためのエイリアス
export { Autoloader as ComponentAutoloader };
