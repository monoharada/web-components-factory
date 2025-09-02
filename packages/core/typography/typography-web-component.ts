/**
 * TypographyWebComponent
 * Noto Sans JPを自動的に適用するWeb Componentベースクラス
 */
import { WebComponent, type WebComponentConfig } from '../web-components.js';
import { baseTypographyStyles, fontLoadingStyles, ensureFontsInitialized } from './base-typography-styles.js';

/**
 * タイポグラフィ対応のWebComponentベースクラス
 * すべてのコンポーネントはこのクラスを継承することで
 * Noto Sans JPが自動的に適用される
 */
export class TypographyWebComponent extends WebComponent {
  constructor() {
    super();
    // フォント初期化を確実に実行
    ensureFontsInitialized();
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // フォント読み込み状態に応じたクラスを適用
    if (document.body.classList.contains('fonts-loaded')) {
      this.classList.add('fonts-loaded');
    } else if (document.body.classList.contains('fonts-loading')) {
      this.classList.add('fonts-loading');
    } else if (document.body.classList.contains('fonts-error')) {
      this.classList.add('fonts-error');
    }
    
    // フォント読み込み状態の変更を監視
    this.#observeFontLoadingState();
  }
  
  disconnectedCallback() {
    // クリーンアップ
    if (this.#fontObserver) {
      this.#fontObserver.disconnect();
      this.#fontObserver = null;
    }
  }
  
  #fontObserver: MutationObserver | null = null;
  
  #observeFontLoadingState() {
    // 既にオブザーバーが存在する場合はスキップ
    if (this.#fontObserver) return;
    
    // bodyのクラス変更を監視
    this.#fontObserver = new MutationObserver(() => {
      if (document.body.classList.contains('fonts-loaded')) {
        this.classList.remove('fonts-loading', 'fonts-error');
        this.classList.add('fonts-loaded');
      } else if (document.body.classList.contains('fonts-error')) {
        this.classList.remove('fonts-loading', 'fonts-loaded');
        this.classList.add('fonts-error');
      }
    });
    
    this.#fontObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  /**
   * スタイルにベースタイポグラフィスタイルを自動追加
   */
  static composeWithTypography(cfg: WebComponentConfig): WebComponentConfig {
    const originalStyles = cfg.styles || [];
    const stylesArray = Array.isArray(originalStyles) ? originalStyles : [originalStyles];
    
    // ベースタイポグラフィスタイルを先頭に追加
    return {
      ...cfg,
      styles: [
        baseTypographyStyles,
        fontLoadingStyles,
        ...stylesArray
      ]
    };
  }
  
  /**
   * defineメソッドをオーバーライド
   * 自動的にタイポグラフィスタイルを追加
   */
  static define(cfg?: WebComponentConfig): typeof WebComponent {
    const config = cfg ?? (this as any).definition;
    if (!config) {
      throw new Error('WebComponentConfig が指定されていません。');
    }
    
    // タイポグラフィスタイルを追加
    const enhancedConfig = TypographyWebComponent.composeWithTypography(config);
    
    // 親クラスのdefineを呼び出し
    return super.define(enhancedConfig);
  }
}

/**
 * FormComponent版も提供
 */
import { FormComponent } from '../web-components.js';

export class TypographyFormComponent extends FormComponent {
  constructor() {
    super();
    ensureFontsInitialized();
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // フォント読み込み状態に応じたクラスを適用
    if (document.body.classList.contains('fonts-loaded')) {
      this.classList.add('fonts-loaded');
    } else if (document.body.classList.contains('fonts-loading')) {
      this.classList.add('fonts-loading');
    } else if (document.body.classList.contains('fonts-error')) {
      this.classList.add('fonts-error');
    }
    
    this.#observeFontLoadingState();
  }
  
  disconnectedCallback() {
    if (this.#fontObserver) {
      this.#fontObserver.disconnect();
      this.#fontObserver = null;
    }
  }
  
  #fontObserver: MutationObserver | null = null;
  
  #observeFontLoadingState() {
    if (this.#fontObserver) return;
    
    this.#fontObserver = new MutationObserver(() => {
      if (document.body.classList.contains('fonts-loaded')) {
        this.classList.remove('fonts-loading', 'fonts-error');
        this.classList.add('fonts-loaded');
      } else if (document.body.classList.contains('fonts-error')) {
        this.classList.remove('fonts-loading', 'fonts-loaded');
        this.classList.add('fonts-error');
      }
    });
    
    this.#fontObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}