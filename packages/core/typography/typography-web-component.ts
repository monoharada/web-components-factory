/**
 * TypographyWebComponent
 * Noto Sans JPを自動的に適用するWeb Componentベースクラス
 */
import { WebComponent, FormComponent, type WebComponentConfig } from '../web-components.js';
import { baseTypographyStyles, fontLoadingStyles, ensureFontsInitialized } from './base-typography-styles.js';
import {
  type FontObserverState,
  syncFontState,
  observeFontLoadingState,
  cleanupFontObserver,
} from './font-loading-helper.js';

/**
 * スタイルにベースタイポグラフィスタイルを自動追加
 */
function composeWithTypography(cfg: WebComponentConfig): WebComponentConfig {
  const originalStyles = cfg.styles || [];
  const stylesArray = Array.isArray(originalStyles) ? originalStyles : [originalStyles];

  return {
    ...cfg,
    styles: [baseTypographyStyles, fontLoadingStyles, ...stylesArray],
  };
}

/**
 * タイポグラフィ対応のWebComponentベースクラス
 * すべてのコンポーネントはこのクラスを継承することで
 * Noto Sans JPが自動的に適用される
 */
export class TypographyWebComponent extends WebComponent {
  #fontState: FontObserverState = { observer: null };

  constructor() {
    super();
    ensureFontsInitialized();
  }

  connectedCallback() {
    super.connectedCallback();
    syncFontState(this);
    observeFontLoadingState(this, this.#fontState);
  }

  disconnectedCallback() {
    cleanupFontObserver(this.#fontState);
  }

  /**
   * スタイルにベースタイポグラフィスタイルを自動追加
   */
  static composeWithTypography = composeWithTypography;

  /**
   * defineメソッドをオーバーライド
   * 自動的にタイポグラフィスタイルを追加
   */
  static define(cfg?: WebComponentConfig): typeof WebComponent {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = cfg ?? (this as any).definition;
    if (!config) {
      throw new Error('WebComponentConfig が指定されていません。');
    }

    const enhancedConfig = composeWithTypography(config);
    return super.define(enhancedConfig);
  }
}

/**
 * FormComponent版
 * Form-Associated Custom Elementsのベースクラス
 */
export class TypographyFormComponent extends FormComponent {
  #fontState: FontObserverState = { observer: null };

  constructor() {
    super();
    ensureFontsInitialized();
  }

  connectedCallback() {
    super.connectedCallback();
    syncFontState(this);
    observeFontLoadingState(this, this.#fontState);
  }

  disconnectedCallback() {
    cleanupFontObserver(this.#fontState);
  }
}
