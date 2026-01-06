/**
 * Web Components Autoloader
 * MutationObserverを使用してDOMを監視し、カスタム要素が現れたら自動的にロードする
 *
 * web-components.ts の定義システムと連携して動作
 */

export interface AutoloaderOptions {
  /** コンポーネントモジュールのベースURL */
  baseUrl: string;
  /** デバッグログを出力するか */
  debug?: boolean;
  /** コンポーネント名のパターン（デフォルト: ハイフンを含む全ての要素） */
  pattern?: RegExp;
}

export class ComponentAutoloader {
  #observer: MutationObserver;
  #loaded = new Set<string>();
  #loading = new Map<string, Promise<unknown>>();
  #baseUrl: string;
  #debug: boolean;
  #pattern: RegExp;

  constructor(options: AutoloaderOptions) {
    this.#baseUrl = options.baseUrl;
    this.#debug = options.debug ?? false;
    this.#pattern = options.pattern ?? /^[a-z]+-[a-z-]+$/;

    this.#observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            this.#scan(node);
          }
        }
      }
    });
  }

  /**
   * autoloaderを開始
   * 既存のDOM要素をスキャンし、MutationObserverを開始
   */
  start(): void {
    this.#log('Autoloader started');
    this.#scan(document.documentElement);
    this.#observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * autoloaderを停止
   */
  stop(): void {
    this.#observer.disconnect();
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
   * 要素とその子孫をスキャンしてコンポーネントをロード
   */
  #scan(root: Element): void {
    const elements = [root, ...root.querySelectorAll('*')];
    for (const el of elements) {
      const tagName = el.tagName.toLowerCase();
      if (this.#isCustomElement(tagName)) {
        this.#loadComponent(tagName);
      }
    }
  }

  /**
   * カスタム要素かどうかを判定
   */
  #isCustomElement(tagName: string): boolean {
    return this.#pattern.test(tagName);
  }

  /**
   * コンポーネントをロード
   */
  async #loadComponent(tagName: string): Promise<unknown> {
    // 既に登録済みの場合はスキップ
    if (customElements.get(tagName)) {
      return;
    }

    // 既にロード済みの場合はスキップ
    if (this.#loaded.has(tagName)) {
      return;
    }

    // ロード中の場合は同じPromiseを返す
    const existing = this.#loading.get(tagName);
    if (existing) {
      return existing;
    }

    // タグ名からモジュールパスを生成
    // 例: dads-accordion-details -> dads/accordion-details.js
    const [prefix, ...parts] = tagName.split('-');
    const componentName = parts.join('-');
    const modulePath = `${this.#baseUrl}/${prefix}/${componentName}.js`;

    this.#log(`Loading: ${tagName} from ${modulePath}`);

    const loadPromise = import(modulePath)
      .then((module) => {
        this.#loaded.add(tagName);
        this.#loading.delete(tagName);
        this.#log(`Loaded: ${tagName}`);
        return module;
      })
      .catch((error) => {
        this.#loading.delete(tagName);
        this.#log(`Failed to load: ${tagName}`, error);
        throw error;
      });

    this.#loading.set(tagName, loadPromise);
    return loadPromise;
  }

  #log(message: string, ...args: unknown[]): void {
    if (this.#debug) {
      console.log(`[Autoloader] ${message}`, ...args);
    }
  }
}

/**
 * グローバルなautoloaderインスタンスを作成して開始するヘルパー関数
 */
export function createAutoloader(options: AutoloaderOptions): ComponentAutoloader {
  const autoloader = new ComponentAutoloader(options);
  autoloader.start();
  return autoloader;
}

/**
 * デフォルト設定でautoloaderを開始
 * Import Mapsの @components/ パスを使用
 */
export function startAutoloader(options?: Partial<AutoloaderOptions>): ComponentAutoloader {
  return createAutoloader({
    baseUrl: '/@components',
    debug: false,
    ...options,
  });
}
