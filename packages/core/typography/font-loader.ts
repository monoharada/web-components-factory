/**
 * フォントローダーユーティリティ
 * Noto Sans JPの読み込みとFOUT/FOIT対策
 */

/**
 * フォント読み込み状態
 */
export interface FontLoadState {
  loaded: boolean;
  error: Error | null;
}

/**
 * Noto Sans JPのフォント定義
 */
const NOTO_SANS_JP_URL = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Mono:wght@400;700&display=swap';

/**
 * フォント読み込み状態を管理するシングルトン
 */
class FontLoader {
  private static instance: FontLoader;
  private loadPromise: Promise<void> | null = null;
  private isLoaded = false;
  private loadError: Error | null = null;
  
  private constructor() {}
  
  static getInstance(): FontLoader {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }
  
  /**
   * フォントを読み込む
   * 複数回呼ばれても同じPromiseを返す（重複読み込み防止）
   */
  async loadFonts(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }
    
    if (this.loadPromise) {
      return this.loadPromise;
    }
    
    this.loadPromise = this.performLoad();
    return this.loadPromise;
  }
  
  private async performLoad(): Promise<void> {
    try {
      // 1. link要素でフォントCSSを読み込み
      await this.loadFontStylesheet();
      
      // 2. CSS Font Loading APIで実際のフォント読み込みを待つ
      await this.waitForFontLoad();
      
      this.isLoaded = true;
    } catch (error) {
      this.loadError = error as Error;
      console.warn('フォント読み込みエラー（フォールバックフォントを使用）:', error);
      // エラーでも処理を続行（フォールバックフォント使用）
    }
  }
  
  private loadFontStylesheet(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 既にlink要素が存在する場合はスキップ
      const existingLink = document.querySelector(`link[href*="fonts.googleapis.com"]`);
      if (existingLink) {
        resolve();
        return;
      }
      
      // preconnectを追加（パフォーマンス改善）
      const preconnect1 = document.createElement('link');
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);
      
      const preconnect2 = document.createElement('link');
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect2);
      
      // フォントCSSを読み込み
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = NOTO_SANS_JP_URL;
      
      link.onload = () => resolve();
      link.onerror = () => reject(new Error('Failed to load font stylesheet'));
      
      document.head.appendChild(link);
    });
  }
  
  private async waitForFontLoad(): Promise<void> {
    // CSS Font Loading APIが利用可能な場合
    if ('fonts' in document) {
      try {
        // 主要なウェイトのフォントが読み込まれるのを待つ
        await Promise.all([
          document.fonts.load('400 16px "Noto Sans JP"'),
          document.fonts.load('700 16px "Noto Sans JP"')
        ]);
      } catch (error) {
        // フォント読み込みエラーは警告のみ（処理継続）
        console.warn('Font loading API error:', error);
      }
    } else {
      // Font Loading APIが使えない場合は少し待つ
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  /**
   * フォント読み込み状態を取得
   */
  getState(): FontLoadState {
    return {
      loaded: this.isLoaded,
      error: this.loadError
    };
  }
  
  /**
   * フォント読み込み完了を待つユーティリティ
   */
  async ready(): Promise<void> {
    await this.loadFonts();
  }
}

/**
 * グローバルフォントローダーインスタンス
 */
export const fontLoader = FontLoader.getInstance();

/**
 * フォントフェイスのCSS定義
 * コンポーネントのスタイルに含めるための基本定義
 */
export const fontFaceCSS = `
  /* フォント読み込み中のチラツキ対策 */
  :host {
    /* font-display: swap でFOITを防ぐ */
    font-synthesis: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* フォールバックチェーン */
  :host {
    --system-font-stack: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Yu Gothic", Arial, sans-serif;
    --base-font-family: "Noto Sans JP", var(--system-font-stack);
    --mono-font-family: "Noto Sans Mono", "SF Mono", Monaco, "Courier New", monospace;
    
    font-family: var(--base-font-family);
  }
`;