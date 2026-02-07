/**
 * ベースタイポグラフィスタイル
 * すべてのコンポーネントに適用される基本的なフォント設定
 */
import { css } from '../web-components.js';
/**
 * グローバルフォント定義
 * すべてのWeb Componentsで使用される基本フォント設定
 */
export const baseTypographyStyles = css `
  /* フォントのチラツキ対策 */
  :host {
    /* システムフォントスタック（フォールバック） */
    --system-font-stack: -apple-system, BlinkMacSystemFont, sans-serif;
    
    /* Noto Sans JPを優先、読み込まれるまでシステムフォントを使用 */
    --base-font-family: "Noto Sans JP", var(--system-font-stack);
    --mono-font-family: "Noto Sans Mono", monospace;
    
    /* デフォルトフォント適用 */
    font-family: var(--base-font-family);
    
    /* font-synthesis を無効化（偽ボールド・斜体を防ぐ） */
    font-synthesis: none;
    
    /* アンチエイリアシング改善 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* テキストレンダリング最適化 */
    text-rendering: optimizeLegibility;
    
    /* デフォルトの行高（アクセシビリティ考慮） */
    line-height: 1.5;
  }
  
  /* フォント読み込み中の見た目を安定化 */
  :host {
    /* font-display: swap 相当の動作をCSS側でも補助 */
    /* 文字間隔をわずかに調整（日本語フォントの特性） */
    letter-spacing: 0.02em;
  }
  
  /* リンクスタイル */
  :host a {
    font-family: inherit;
  }
  
  /* コードブロック */
  :host code,
  :host pre,
  :host kbd,
  :host samp {
    font-family: var(--mono-font-family);
  }
  
  /* ボタン・インプット */
  :host button,
  :host input,
  :host select,
  :host textarea {
    font-family: inherit;
  }
`;
/**
 * フォント読み込み状態を示すクラス
 * bodyに付与されるクラスと連動
 */
export const fontLoadingStyles = css `
  /* フォント読み込み中 */
  :host(.fonts-loading) {
    /* 読み込み中は文字間隔を少し広げて差異を最小化 */
    letter-spacing: 0.03em;
  }
  
  /* フォント読み込み完了 */
  :host(.fonts-loaded) {
    /* 読み込み完了後は正常な文字間隔に */
    letter-spacing: 0.02em;
    /* スムーズな遷移 */
    transition: letter-spacing 0.1s ease-out;
  }
  
  /* フォント読み込みエラー */
  :host(.fonts-error) {
    /* エラー時はシステムフォントで表示 */
    font-family: var(--system-font-stack) !important;
  }
`;
/**
 * フォント状態の初期化
 * グローバルに一度だけ実行（Web Fontは読み込まない）
 */
export function initializeGlobalFonts() {
    const flags = globalThis;
    if (flags.__DADS_DISABLE_FONT_LOADING__) {
        return;
    }
    // Web Fontは読み込まない。即座に読み込み完了扱いにする。
    document.body.classList.remove('fonts-loading', 'fonts-error');
    document.body.classList.add('fonts-loaded');
}
/**
 * フォント初期化フラグ
 */
let fontsInitialized = false;
/**
 * フォントを初期化（一度だけ実行）
 */
export function ensureFontsInitialized() {
    const flags = globalThis;
    if (flags.__DADS_DISABLE_FONT_LOADING__) {
        return;
    }
    if (!fontsInitialized) {
        fontsInitialized = true;
        // DOMContentLoadedを待つか、既に読み込まれていれば即座に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeGlobalFonts);
        }
        else {
            initializeGlobalFonts();
        }
    }
}
