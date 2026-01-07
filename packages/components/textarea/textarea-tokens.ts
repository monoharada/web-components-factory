/**
 * テキストエリアコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';

/**
 * テキストエリアセマンティックトークン
 * 意味的な役割に基づいた命名
 */
const textareaSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* ラベルサイズ（DADS準拠: sm/md/lg） */
    --textarea-label-size-sm: var(--font-size-16, 1rem);
    --textarea-label-size-md: var(--font-size-17, 1.0625rem);
    --textarea-label-size-lg: var(--font-size-18, 1.125rem);

    /* テキストサイズ */
    --textarea-font-size-sm: var(--font-size-14, 0.875rem);
    --textarea-font-size-md: var(--font-size-16, 1rem);
    --textarea-font-size-lg: var(--font-size-18, 1.125rem);

    /* 背景色 */
    --textarea-bg: var(--color-neutral-white, #ffffff);
    --textarea-bg-hover: var(--color-neutral-white, #ffffff);
    --textarea-bg-readonly: var(--color-neutral-white, #ffffff);  /* DADS公式：readonly は白背景 */
    --textarea-bg-disabled: var(--color-neutral-solid-gray-50, #f2f2f2);

    /* ボーダー色 */
    --textarea-border: var(--color-neutral-solid-gray-420, #949494);
    --textarea-border-hover: var(--color-neutral-solid-gray-600, #666666);
    --textarea-border-focus: var(--color-primitive-blue-600, #3460fb);
    --textarea-border-error: var(--color-semantic-error-1, #ec0000);
    --textarea-border-disabled: var(--color-neutral-solid-gray-300, #b3b3b3);

    /* テキスト色 */
    --textarea-text: var(--color-neutral-solid-gray-800, #333333);
    --textarea-text-placeholder: var(--color-neutral-solid-gray-600, #666666);
    --textarea-text-disabled: var(--color-neutral-solid-gray-420, #949494);
    --textarea-text-readonly: var(--color-neutral-solid-gray-800, #333333);

    /* ラベル */
    --textarea-label-color: var(--color-neutral-solid-gray-800, #333333);
    --textarea-label-weight: var(--font-weight-700, 700);

    /* 要否ラベル */
    --textarea-requirement-color: var(--color-semantic-error-1, #ec0000);

    /* 読み取り専用バッジ（DADS公式準拠） */
    --textarea-readonly-badge-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --textarea-readonly-badge-color: var(--color-neutral-solid-gray-800, #333333);
    --textarea-readonly-badge-padding: 0.5rem;
    --textarea-readonly-badge-radius: 0.5rem;

    /* サポートテキスト */
    --textarea-support-color: var(--color-neutral-solid-gray-600, #666666);

    /* カウンター */
    --textarea-counter-color: var(--color-neutral-solid-gray-600, #666666);
    --textarea-counter-error-color: var(--color-semantic-error-1, #ec0000);

    /* エラーテキスト */
    --textarea-error-text-color: var(--color-semantic-error-1, #ec0000);

    /* フォーカス（DADS準拠: 黄色リング + 黒アウトライン） */
    --textarea-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --textarea-focus-ring-width: 4px;
    --textarea-focus-outline-color: var(--color-neutral-black, #000000);
    --textarea-focus-outline-width: 2px;

    /* レイアウト */
    --textarea-border-width: 1px;
    --textarea-border-radius: var(--border-radius-8, 0.5rem);  /* DADS公式: 角丸スモール（8px） */
    --textarea-padding: 12px 16px;
    --textarea-min-height-sm: 72px;
    --textarea-min-height-md: 96px;
    --textarea-min-height-lg: 120px;

    /* 間隔 */
    --textarea-gap: 8px;
    --textarea-requirement-margin: 4px;
  }
`;

/**
 * テキストエリアローカルコンポーネントトークン
 * コンポーネント固有のカスタマイズ可能な変数
 * 外部から上書きして使用可能
 */
const textareaLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* 背景 */
    --dads-textarea-background: var(--textarea-bg);

    /* ボーダー */
    --dads-textarea-border-color: var(--textarea-border);
    --dads-textarea-border-width: var(--textarea-border-width);
    --dads-textarea-border-radius: var(--textarea-border-radius);

    /* テキスト */
    --dads-textarea-color: var(--textarea-text);
    --dads-textarea-placeholder-color: var(--textarea-text-placeholder);

    /* サイズ */
    --dads-textarea-padding: var(--textarea-padding);
    --dads-textarea-font-size: var(--textarea-font-size-md);
    --dads-textarea-min-height: var(--textarea-min-height-md);
    --dads-textarea-resize: vertical;

    /* ラベル */
    --dads-textarea-label-size: var(--textarea-label-size-md);
    --dads-textarea-label-color: var(--textarea-label-color);
    --dads-textarea-label-weight: var(--textarea-label-weight);

    /* 要否ラベル */
    --dads-textarea-requirement-color: var(--textarea-requirement-color);

    /* サポートテキスト */
    --dads-textarea-support-color: var(--textarea-support-color);

    /* カウンター */
    --dads-textarea-counter-color: var(--textarea-counter-color);

    /* エラー */
    --dads-textarea-error-color: var(--textarea-error-text-color);
  }

  /* サイズバリアント */
  :host([size="sm"]) {
    --dads-textarea-label-size: var(--textarea-label-size-sm);
    --dads-textarea-font-size: var(--textarea-font-size-sm);
    --dads-textarea-min-height: var(--textarea-min-height-sm);
  }

  :host([size="lg"]) {
    --dads-textarea-label-size: var(--textarea-label-size-lg);
    --dads-textarea-font-size: var(--textarea-font-size-lg);
    --dads-textarea-min-height: var(--textarea-min-height-lg);
  }

  /* エラー状態 */
  :host([error]) {
    --dads-textarea-border-color: var(--textarea-border-error);
    --dads-textarea-counter-color: var(--textarea-counter-error-color);
  }

  /* 無効状態 */
  :host([disabled]) {
    --dads-textarea-background: var(--textarea-bg-disabled);
    --dads-textarea-border-color: var(--textarea-border-disabled);
    --dads-textarea-color: var(--textarea-text-disabled);
  }

  /* 読み取り専用状態 */
  :host([readonly]) {
    --dads-textarea-background: var(--textarea-bg-readonly);
  }
`;

/**
 * 個別エクスポート（後方互換性のため）
 */
export const textareaSemanticTokens = css`${textareaSemanticTokensText}`;
export const textareaLocalTokens = css`${textareaLocalTokensText}`;

/**
 * 統合トークン（セマンティック + ローカル）
 */
export const textareaTokens = css`
  ${textareaSemanticTokensText}
  ${textareaLocalTokensText}
`;
