/**
 * ベースタイポグラフィスタイル
 * すべてのコンポーネントに適用される基本的なフォント設定
 */
import { css } from '../web-components.js';

/**
 * グローバルフォント定義
 * すべてのWeb Componentsで使用される基本フォント設定
 */
export const baseTypographyStyles = css`
  /* フォントのチラツキ対策 */
  :host {
    /* システムフォントスタック（フォールバック） */
    --system-font-stack: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", Arial, sans-serif;
    
    /* Noto Sans JPを優先、読み込まれるまでシステムフォントを使用 */
    --base-font-family: "Noto Sans JP", var(--system-font-stack);
    --mono-font-family: "Noto Sans Mono", "SF Mono", Monaco, "Courier New", monospace;
    
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
export const fontLoadingStyles = css`
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
 * Noto Sans JP の Web Font 読み込み
 * グローバルに一度だけ実行
 */
export function initializeGlobalFonts(): void {
  // 既にフォントが読み込まれているかチェック
  if (document.querySelector('link[href*="fonts.googleapis.com/css2?family=Noto+Sans+JP"]')) {
    return;
  }
  
  // preconnect追加（接続の高速化）
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);
  
  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);
  
  // Web Fontのlink要素追加
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Mono:wght@400;700&display=swap';
  document.head.appendChild(link);
  
  // フォント読み込み状態をbodyクラスで管理
  document.body.classList.add('fonts-loading');
  
  // Font Loading APIを使用して読み込み完了を検知
  if ('fonts' in document) {
    Promise.all([
      document.fonts.load('400 16px "Noto Sans JP"'),
      document.fonts.load('700 16px "Noto Sans JP"')
    ]).then(() => {
      document.body.classList.remove('fonts-loading');
      document.body.classList.add('fonts-loaded');
    }).catch(() => {
      document.body.classList.remove('fonts-loading');
      document.body.classList.add('fonts-error');
    });
  } else {
    // Font Loading APIが使えない場合は、一定時間後に読み込み完了とみなす
    setTimeout(() => {
      document.body.classList.remove('fonts-loading');
      document.body.classList.add('fonts-loaded');
    }, 1000);
  }
}

/**
 * フォント初期化フラグ
 */
let fontsInitialized = false;

/**
 * フォントを初期化（一度だけ実行）
 */
export function ensureFontsInitialized(): void {
  if (!fontsInitialized) {
    fontsInitialized = true;
    // DOMContentLoadedを待つか、既に読み込まれていれば即座に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeGlobalFonts);
    } else {
      initializeGlobalFonts();
    }
  }
}