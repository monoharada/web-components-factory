/**
 * ボタンコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 * 
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';

/**
 * ボタンセマンティックトークン
 * 意味的な役割に基づいた命名
 */
export const buttonSemanticTokens = css`
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */
    
    /* Primary（主要アクション）用トークン */
    --button-primary-bg: var(--color-primitive-blue-1000, #0017c1);
    --button-primary-bg-hover: var(--color-primitive-blue-900, #0d2ea1);
    --button-primary-bg-active: var(--color-primitive-blue-800, #1a3b81);
    --button-primary-text: var(--color-primitive-white, #ffffff);
    --button-primary-border: var(--color-primitive-blue-1000, #0017c1);
    
    /* Secondary（副次アクション）用トークン */
    --button-secondary-bg: var(--color-primitive-white, #ffffff);
    --button-secondary-bg-hover: var(--color-primitive-blue-200, #c5d7fb);
    --button-secondary-bg-active: var(--color-primitive-blue-300, #9db7f9);
    --button-secondary-text: var(--color-primitive-blue-900, #0017c1);
    --button-secondary-text-hover: var(--color-primitive-blue-1000, #00118f);
    --button-secondary-text-active: var(--color-primitive-blue-1200, #000060);
    --button-secondary-border: var(--color-primitive-blue-900, #0017c1);
    --button-secondary-border-hover: var(--color-primitive-blue-1000, #00118f);
    --button-secondary-border-active: var(--color-primitive-blue-1200, #000060);
    
    /* Tertiary（第三アクション）用トークン */
    --button-tertiary-bg: transparent;
    --button-tertiary-bg-hover: var(--color-primitive-blue-50, #e8f1fe);
    --button-tertiary-bg-active: var(--color-primitive-blue-100, #d9e6ff);
    --button-tertiary-text: var(--color-primitive-blue-900, #0017c1);
    --button-tertiary-text-hover: var(--color-primitive-blue-1000, #00118f);
    --button-tertiary-text-active: var(--color-primitive-blue-1200, #000060);
    --button-tertiary-border: transparent;
    
    /* Disabled（無効）状態用セマンティックトークン */
    --button-disabled-primary-bg: var(--color-neutral-solid-gray-300, #b3b3b3);
    --button-disabled-primary-text: var(--color-neutral-solid-gray-50, #f2f2f2);
    --button-disabled-primary-border: var(--color-neutral-solid-gray-300, #b3b3b3);
    
    --button-disabled-secondary-bg: var(--color-neutral-white, #ffffff);
    --button-disabled-secondary-text: var(--color-neutral-solid-gray-300, #b3b3b3);
    --button-disabled-secondary-border: var(--color-neutral-solid-gray-300, #b3b3b3);
    
    --button-disabled-tertiary-bg: transparent;
    --button-disabled-tertiary-text: var(--color-neutral-solid-gray-300, #b3b3b3);
    --button-disabled-tertiary-border: transparent;
    
    --button-disabled-opacity: 1;
    
    /* Focus（フォーカス）状態用トークン - デジタル庁準拠 */
    --button-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --button-focus-ring-width: 4px;
    --button-focus-outline-color: var(--color-neutral-black, #000000);
    --button-focus-outline-width: 2px;
    --button-focus-outline-offset: 2px;
    
    /* サイズ用セマンティックトークン */
    --button-padding-x-small: 8px 12px;
    --button-padding-small: 8px 16px;
    --button-padding-medium: 12px 24px;
    --button-padding-large: 16px 32px;
    
    --button-font-size-x-small: 0.75rem; /* 12px */
    --button-font-size-small: var(--font-size-14, 0.875rem);
    --button-font-size-medium: var(--font-size-16, 1rem);
    --button-font-size-large: var(--font-size-18, 1.125rem);
    
    /* デジタル庁準拠: 最小44x44pxを確保 */
    --button-height-x-small: 44px;  /* 最小高さ44px */
    --button-height-small: 44px;    /* 最小高さ44px */
    --button-height-medium: 48px;
    --button-height-large: 56px;
    
    /* その他のセマンティックトークン */
    --button-border-radius: var(--border-radius-8, 0.5rem);
    --button-border-width: 2px;
    --button-font-weight: var(--font-weight-700, 700);
    --button-line-height: 1.25;
    --button-transition-duration: 200ms;
    --button-transition-timing: ease;
  }
`;

/**
 * ボタンローカルコンポーネントトークン
 * コンポーネント固有のカスタマイズ可能な変数
 * 外部から上書きして使用可能
 */
export const buttonLocalTokens = css`
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */
    
    /* 基本カスタマイズ用トークン（デフォルトはprimaryバリアント） */
    --dads-button-background: var(--button-primary-bg);
    --dads-button-background-hover: var(--button-primary-bg-hover);
    --dads-button-background-active: var(--button-primary-bg-active);
    --dads-button-color: var(--button-primary-text);
    --dads-button-border-color: var(--button-primary-border);
    --dads-button-border-width: var(--button-border-width);
    --dads-button-border-radius: var(--button-border-radius);
    
    /* サイズカスタマイズ用トークン */
    --dads-button-padding: var(--button-padding-medium);
    --dads-button-font-size: var(--button-font-size-medium);
    --dads-button-font-weight: var(--button-font-weight);
    --dads-button-line-height: var(--button-line-height);
    --dads-button-min-height: var(--button-height-medium);
    
    /* アイコンカスタマイズ用トークン */
    --dads-button-icon-size: 1.25em;
    --dads-button-icon-gap: 8px;
    --dads-button-icon-color: currentColor;
    
    /* アニメーションカスタマイズ用トークン */
    --dads-button-transition: all var(--button-transition-duration) var(--button-transition-timing);
    --dads-button-transform-active: translateY(1px);
    --dads-button-shadow: none;
    --dads-button-shadow-hover: 0 2px 4px rgba(0, 0, 0, 0.1);
    --dads-button-shadow-active: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    
    /* フォーカスカスタマイズ用トークン */
    --dads-button-focus-ring-color: var(--button-focus-ring-color);
    --dads-button-focus-ring-width: var(--button-focus-ring-width);
    --dads-button-focus-outline-color: var(--button-focus-outline-color);
    --dads-button-focus-outline-width: var(--button-focus-outline-width);
    --dads-button-focus-outline-offset: var(--button-focus-outline-offset);
    
    /* レスポンシブカスタマイズ用トークン */
    --dads-button-width: auto;
    --dads-button-max-width: none;
    --dads-button-min-width: auto;
    
    /* テキストカスタマイズ用トークン */
    --dads-button-text-transform: none;
    --dads-button-text-decoration: none;
    --dads-button-text-align: center;
    --dads-button-white-space: nowrap;
    
    /* カーソルカスタマイズ用トークン */
    --dads-button-cursor: pointer;
    --dads-button-cursor-disabled: not-allowed;
    
    /* アクセシビリティカスタマイズ用トークン */
    --dads-button-focus-visible-outline: none;
    --dads-button-tap-highlight-color: transparent;
    --dads-button-user-select: none;
    --dads-button-opacity: 1;
  }
  
  /* バリアントごとのローカルトークン上書き */
  :host([variant="solid"]),
  :host([variant="primary"]) {
    --dads-button-background: var(--button-primary-bg);
    --dads-button-background-hover: var(--button-primary-bg-hover);
    --dads-button-background-active: var(--button-primary-bg-active);
    --dads-button-color: var(--button-primary-text);
    --dads-button-border-color: var(--button-primary-border);
  }
  
  :host([variant="outlined"]),
  :host([variant="secondary"]) {
    --dads-button-background: var(--button-secondary-bg);
    --dads-button-background-hover: var(--button-secondary-bg-hover);
    --dads-button-background-active: var(--button-secondary-bg-active);
    --dads-button-color: var(--button-secondary-text);
    --dads-button-border-color: var(--button-secondary-border);
    --dads-button-border-width: 1px;
  }
  
  :host([variant="text"]),
  :host([variant="tertiary"]) {
    --dads-button-background: var(--button-tertiary-bg);
    --dads-button-background-hover: var(--button-tertiary-bg-hover);
    --dads-button-background-active: var(--button-tertiary-bg-active);
    --dads-button-color: var(--button-tertiary-text);
    --dads-button-border-color: var(--button-tertiary-border);
    --dads-button-border-width: 0;
  }
  
  /* サイズごとのローカルトークン上書き */
  :host([size="x-small"]) {
    --dads-button-padding: var(--button-padding-x-small);
    --dads-button-font-size: var(--button-font-size-x-small);
    --dads-button-min-height: var(--button-height-x-small);
  }
  
  :host([size="small"]) {
    --dads-button-padding: var(--button-padding-small);
    --dads-button-font-size: var(--button-font-size-small);
    --dads-button-min-height: var(--button-height-small);
  }
  
  :host([size="large"]) {
    --dads-button-padding: var(--button-padding-large);
    --dads-button-font-size: var(--button-font-size-large);
    --dads-button-min-height: var(--button-height-large);
  }
  
  /* 無効状態のローカルトークン上書き - バリアント別 */
  :host([disabled]:not([variant])),
  :host([variant="solid"][disabled]),
  :host([variant="primary"][disabled]) {
    --dads-button-background: var(--button-disabled-primary-bg);
    --dads-button-color: var(--button-disabled-primary-text);
    --dads-button-border-color: var(--button-disabled-primary-border);
    --dads-button-cursor: var(--dads-button-cursor-disabled);
    --dads-button-opacity: var(--button-disabled-opacity);
  }
  
  :host([variant="outlined"][disabled]),
  :host([variant="secondary"][disabled]) {
    --dads-button-background: var(--button-disabled-secondary-bg);
    --dads-button-color: var(--button-disabled-secondary-text);
    --dads-button-border-color: var(--button-disabled-secondary-border);
    --dads-button-cursor: var(--dads-button-cursor-disabled);
    --dads-button-opacity: var(--button-disabled-opacity);
  }
  
  :host([variant="text"][disabled]),
  :host([variant="tertiary"][disabled]) {
    --dads-button-background: var(--button-disabled-tertiary-bg);
    --dads-button-color: var(--button-disabled-tertiary-text);
    --dads-button-border-color: var(--button-disabled-tertiary-border);
    --dads-button-cursor: var(--dads-button-cursor-disabled);
    --dads-button-opacity: var(--button-disabled-opacity);
  }
  
  /* フルワイド対応 */
  :host([full-width]) {
    --dads-button-width: 100%;
  }
`;

/**
 * 統合トークン（セマンティック + ローカル）
 */
export const buttonTokens = css`
  ${buttonSemanticTokens}
  ${buttonLocalTokens}
`;

/**
 * トークンのタイプ定義（TypeScript用）
 */
export interface ButtonTokens {
  // セマンティックトークン
  primaryBg: string;
  primaryBgHover: string;
  primaryBgActive: string;
  primaryText: string;
  primaryBorder: string;
  
  secondaryBg: string;
  secondaryBgHover: string;
  secondaryBgActive: string;
  secondaryText: string;
  secondaryBorder: string;
  
  tertiaryBg: string;
  tertiaryBgHover: string;
  tertiaryBgActive: string;
  tertiaryText: string;
  tertiaryBorder: string;
  
  // ローカルコンポーネントトークン
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  color: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  
  padding: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  minHeight: string;
  
  iconSize: string;
  iconGap: string;
  iconColor: string;
  
  transition: string;
  transformActive: string;
  shadow: string;
  shadowHover: string;
  shadowActive: string;
}

/**
 * カスタマイズ例
 * 
 * ```css
 * dads-button {
 *   --dads-button-background: #ff0000;
 *   --dads-button-border-radius: 24px;
 *   --dads-button-font-size: 20px;
 * }
 * 
 * dads-button.my-custom-button {
 *   --dads-button-padding: 20px 40px;
 *   --dads-button-shadow-hover: 0 4px 8px rgba(0, 0, 0, 0.2);
 * }
 * ```
 */