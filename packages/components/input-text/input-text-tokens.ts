/**
 * インプットテキストコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';

/**
 * インプットテキストセマンティックトークン
 * 意味的な役割に基づいた命名
 */
const inputTextSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* ラベルサイズ（DADS準拠: sm/md/lg） */
    --input-label-size-sm: var(--font-size-16, 1rem);
    --input-label-size-md: var(--font-size-17, 1.0625rem);
    --input-label-size-lg: var(--font-size-18, 1.125rem);

    /* テキストサイズ */
    --input-font-size-sm: var(--font-size-14, 0.875rem);
    --input-font-size-md: var(--font-size-16, 1rem);
    --input-font-size-lg: var(--font-size-18, 1.125rem);

    /* 背景色 */
    --input-bg: var(--color-neutral-white, #ffffff);
    --input-bg-hover: var(--color-neutral-white, #ffffff);
    --input-bg-readonly: var(--color-neutral-white, #ffffff);  /* DADS公式：readonly は白背景 */
    --input-bg-disabled: var(--color-neutral-solid-gray-50, #f2f2f2);

    /* ボーダー色 */
    --input-border: var(--color-neutral-solid-gray-420, #949494);
    --input-border-hover: var(--color-neutral-solid-gray-600, #666666);
    --input-border-focus: var(--color-primitive-blue-600, #3460fb);
    --input-border-error: var(--color-semantic-error-1, #ec0000);
    --input-border-disabled: var(--color-neutral-solid-gray-300, #b3b3b3);

    /* テキスト色 */
    --input-text: var(--color-neutral-solid-gray-800, #333333);
    --input-text-placeholder: var(--color-neutral-solid-gray-600, #666666);
    --input-text-disabled: var(--color-neutral-solid-gray-420, #949494);
    --input-text-readonly: var(--color-neutral-solid-gray-800, #333333);

    /* ラベル */
    --input-label-color: var(--color-neutral-solid-gray-800, #333333);
    --input-label-weight: var(--font-weight-700, 700);

    /* 要否ラベル */
    --input-requirement-color: var(--color-semantic-error-1, #ec0000);

    /* 読み取り専用バッジ（DADS公式準拠） */
    --input-readonly-badge-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --input-readonly-badge-color: var(--color-neutral-solid-gray-800, #333333);
    --input-readonly-badge-padding: var(--spacing-2, 0.5rem);
    --input-readonly-badge-radius: 0.5rem;

    /* サポートテキスト */
    --input-support-color: var(--color-neutral-solid-gray-600, #666666);

    /* エラーテキスト */
    --input-error-text-color: var(--color-semantic-error-1, #ec0000);

    /* フォーカス（DADS準拠: 黄色リング + 黒アウトライン） */
    --input-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --input-focus-ring-width: 4px;
    --input-focus-outline-color: var(--color-neutral-black, #000000);
    --input-focus-outline-width: 2px;

    /* レイアウト */
    --input-border-width: 1px;
    --input-border-radius: var(--border-radius-8, 0.5rem);  /* DADS公式: 角丸スモール（8px） */
    --input-padding: var(--spacing-3, 12px) var(--spacing-4, 16px);
    --input-height-sm: 40px;
    --input-height-md: 48px;
    --input-height-lg: 56px;

    /* 間隔 */
    --input-gap: var(--spacing-2, 8px);
    --input-requirement-margin: var(--spacing-1, 4px);

    /* 幅プリセット */
    --input-width-short: 8ch;
    --input-width-medium: 16ch;
    --input-width-full: 100%;
  }
`;

/**
 * インプットテキストローカルコンポーネントトークン
 * コンポーネント固有のカスタマイズ可能な変数
 * 外部から上書きして使用可能
 */
const inputTextLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* 背景 */
    --dads-input-background: var(--input-bg);

    /* ボーダー */
    --dads-input-border-color: var(--input-border);
    --dads-input-border-width: var(--input-border-width);
    --dads-input-border-radius: var(--input-border-radius);

    /* テキスト */
    --dads-input-color: var(--input-text);
    --dads-input-placeholder-color: var(--input-text-placeholder);

    /* サイズ */
    --dads-input-padding: var(--input-padding);
    --dads-input-font-size: var(--input-font-size-md);
    --dads-input-height: var(--input-height-md);

    /* 幅 */
    --dads-input-width: var(--input-width-full);

    /* ラベル */
    --dads-input-label-size: var(--input-label-size-md);
    --dads-input-label-color: var(--input-label-color);
    --dads-input-label-weight: var(--input-label-weight);

    /* 要否ラベル */
    --dads-input-requirement-color: var(--input-requirement-color);

    /* サポートテキスト */
    --dads-input-support-color: var(--input-support-color);

    /* エラー */
    --dads-input-error-color: var(--input-error-text-color);
  }

  /* サイズバリアント */
  :host([size="sm"]) {
    --dads-input-label-size: var(--input-label-size-sm);
    --dads-input-font-size: var(--input-font-size-sm);
    --dads-input-height: var(--input-height-sm);
  }

  :host([size="lg"]) {
    --dads-input-label-size: var(--input-label-size-lg);
    --dads-input-font-size: var(--input-font-size-lg);
    --dads-input-height: var(--input-height-lg);
  }

  /* エラー状態 */
  :host([error]) {
    --dads-input-border-color: var(--input-border-error);
  }

  /* 無効状態 */
  :host([disabled]) {
    --dads-input-background: var(--input-bg-disabled);
    --dads-input-border-color: var(--input-border-disabled);
    --dads-input-color: var(--input-text-disabled);
  }

  /* 読み取り専用状態 */
  :host([readonly]) {
    --dads-input-background: var(--input-bg-readonly);
  }
`;

/**
 * 個別エクスポート（後方互換性のため）
 */
export const inputTextSemanticTokens = css`${inputTextSemanticTokensText}`;
export const inputTextLocalTokens = css`${inputTextLocalTokensText}`;

/**
 * 統合トークン（セマンティック + ローカル）
 */
export const inputTextTokens = css`
  ${inputTextSemanticTokensText}
  ${inputTextLocalTokensText}
`;
