/**
 * デジタル庁タイポグラフィトークン
 * Shape Up Week 1: 最小限の実装
 */
import { css } from '../../core/web-components.js';

/**
 * Web フォント読み込み（互換用）
 *
 * Constructable Stylesheets（CSSStyleSheet.replaceSync）では `@import` が使えないため、
 * ここでは no-op にする（フォント自体は `ensureFontsInitialized()` が <link> 注入で読み込む）。
 */
const fontImportText = '';

/**
 * プリミティブトークン（基本値）
 * 最小限の3つのサイズのみ実装
 */
const typographyPrimitiveTokensText = `
  :host {
    /* Font Families - デジタル庁標準 */
    --font-family-sans: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Hiragino Kaku Gothic ProN", Arial, sans-serif;
    --font-family-mono: "Noto Sans Mono", "SF Mono", Monaco, monospace;
    
    /* Font Sizes - 最重要3サイズのみ（Shape Up: Must Have） */
    --font-size-16: 1rem;      /* 標準本文 */
    --font-size-20: 1.25rem;   /* 中見出し */
    --font-size-32: 2rem;      /* 大見出し */
    
    /* Font Weights - Normal/Boldのみ */
    --font-weight-normal: 400;
    --font-weight-bold: 700;
    
    /* Line Heights - 最小限の3種類 */
    --line-height-tight: 1.25;   /* 見出し用 */
    --line-height-normal: 1.5;   /* 標準 - WCAG推奨最小値 */
    --line-height-relaxed: 1.75; /* 本文用 */
  }
`;

/**
 * セマンティックトークン（意味的な値）
 * Shape Up: 3つの基本カテゴリのみ
 */
const typographySemanticTokensText = `
  :host {
    /* Standard（標準）- 本文用 */
    --typography-standard-font: var(--font-family-sans);
    --typography-standard-size: var(--font-size-16);
    --typography-standard-weight: var(--font-weight-normal);
    --typography-standard-line-height: var(--line-height-relaxed);
    
    /* Display（表示）- 見出し用 */
    --typography-display-font: var(--font-family-sans);
    --typography-display-size: var(--font-size-32);
    --typography-display-weight: var(--font-weight-bold);
    --typography-display-line-height: var(--line-height-tight);
    
    /* Dense（密集）- UI要素用 */
    --typography-dense-font: var(--font-family-sans);
    --typography-dense-size: var(--font-size-16);
    --typography-dense-weight: var(--font-weight-normal);
    --typography-dense-line-height: var(--line-height-normal);
  }
`;

/**
 * ローカルコンポーネントトークン
 * カスタマイズ可能な変数
 */
const typographyLocalTokensText = `
  :host {
    /* コンポーネントレベルのカスタマイズ用変数 */
    --dads-text-font-family: var(--typography-standard-font);
    --dads-text-font-size: var(--typography-standard-size);
    --dads-text-font-weight: var(--typography-standard-weight);
    --dads-text-line-height: var(--typography-standard-line-height);
    --dads-text-color: inherit;
    --dads-text-letter-spacing: normal;
    --dads-text-text-align: inherit;
  }
  
  /* バリアント別の変数上書き */
  :host([variant="display"]) {
    --dads-text-font-size: var(--typography-display-size);
    --dads-text-font-weight: var(--typography-display-weight);
    --dads-text-line-height: var(--typography-display-line-height);
  }
  
  :host([variant="dense"]) {
    --dads-text-font-size: var(--typography-dense-size);
    --dads-text-font-weight: var(--typography-dense-weight);
    --dads-text-line-height: var(--typography-dense-line-height);
  }
  
  /* サイズ属性による上書き */
  :host([size="16"]) {
    --dads-text-font-size: var(--font-size-16);
  }
  
  :host([size="20"]) {
    --dads-text-font-size: var(--font-size-20);
  }
  
  :host([size="32"]) {
    --dads-text-font-size: var(--font-size-32);
  }
  
  /* ウェイト属性による上書き */
  :host([weight="normal"]) {
    --dads-text-font-weight: var(--font-weight-normal);
  }
  
  :host([weight="bold"]) {
    --dads-text-font-weight: var(--font-weight-bold);
  }
`;

/**
 * エクスポート
 */
export const fontImport = css`${fontImportText}`;
export const typographyPrimitiveTokens = css`${typographyPrimitiveTokensText}`;
export const typographySemanticTokens = css`${typographySemanticTokensText}`;
export const typographyLocalTokens = css`${typographyLocalTokensText}`;

/**
 * 統合トークン（全部入り + フォント読み込み）
 */
export const typographyTokens = css`
  ${fontImportText}
  ${typographyPrimitiveTokensText}
  ${typographySemanticTokensText}
  ${typographyLocalTokensText}
`;

/**
 * TypeScript型定義（最小限）
 */
export interface TypographyTokens {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

export type TypographyVariant = 'standard' | 'display' | 'dense';
export type TypographySize = '16' | '20' | '32';
export type TypographyWeight = 'normal' | 'bold';
