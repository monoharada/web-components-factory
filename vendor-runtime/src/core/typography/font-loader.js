/**
 * フォントローダーユーティリティ
 * Noto Sans JPの読み込みとFOUT/FOIT対策
 */
/**
 * フォント読み込み状態を管理するシングルトン
 */
class FontLoader {
    constructor() {
        this.loadPromise = null;
        this.isLoaded = false;
        this.loadError = null;
    }
    static getInstance() {
        if (!FontLoader.instance) {
            FontLoader.instance = new FontLoader();
        }
        return FontLoader.instance;
    }
    /**
     * フォントを読み込む
     * 複数回呼ばれても同じPromiseを返す（重複読み込み防止）
     */
    async loadFonts() {
        if (this.isLoaded)
            return;
        this.loadPromise ?? (this.loadPromise = this.performLoad());
        return this.loadPromise;
    }
    async performLoad() {
        try {
            // 1. link要素でフォントCSSを読み込み
            await this.loadFontStylesheet();
            // 2. CSS Font Loading APIで実際のフォント読み込みを待つ
            await this.waitForFontLoad();
            this.isLoaded = true;
        }
        catch (error) {
            this.loadError = error;
            console.warn('フォント読み込みエラー（フォールバックフォントを使用）:', error);
            // エラーでも処理を続行（フォールバックフォント使用）
        }
    }
    loadFontStylesheet() {
        // Web Fontは読み込まない。ローカルフォントのみを前提に即完了。
        return Promise.resolve();
    }
    waitForFontLoad() {
        // Web Fontロードは行わないため待機不要
        return Promise.resolve();
    }
    /**
     * フォント読み込み状態を取得
     */
    getState() {
        return {
            loaded: this.isLoaded,
            error: this.loadError
        };
    }
    /**
     * フォント読み込み完了を待つユーティリティ
     */
    async ready() {
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
    --system-font-stack: -apple-system, BlinkMacSystemFont, sans-serif;
    --base-font-family: "Noto Sans JP", var(--system-font-stack);
    --mono-font-family: "Noto Sans Mono", monospace;
    
    font-family: var(--base-font-family);
  }
`;
