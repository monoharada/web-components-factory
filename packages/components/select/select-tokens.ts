/**
 * セレクトボックスコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';

/**
 * セレクトボックスセマンティックトークン
 */
const selectSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* ラベルサイズ（DADS準拠: sm/md/lg） */
    --select-label-size-sm: var(--font-size-16, 1rem);
    --select-label-size-md: var(--font-size-17, 1.0625rem);
    --select-label-size-lg: var(--font-size-18, 1.125rem);

    /* ラベル */
    --select-label-color: var(--color-neutral-solid-gray-800, #333333);
    --select-label-weight: var(--font-weight-700, 700);

    /* 要否ラベル */
    --select-requirement-color: var(--color-semantic-error-1, #ec0000);

    /* サポートテキスト */
    --select-support-color: var(--color-neutral-solid-gray-600, #666666);

    /* エラーテキスト */
    --select-error-text-color: var(--color-semantic-error-1, #ec0000);

    /* 背景色 */
    --select-bg: var(--color-neutral-white, #ffffff);
    --select-bg-disabled: var(--color-neutral-solid-gray-50, #f2f2f2);

    /* ボーダー色 */
    --select-border: var(--color-neutral-solid-gray-600, #666666);
    --select-border-hover: var(--color-neutral-black, #000000);
    --select-border-error: var(--color-semantic-error-1, #ec0000);
    --select-border-error-hover: var(--color-primitive-red-1000, #a90000);
    --select-border-disabled: var(--color-neutral-solid-gray-300, #b3b3b3);

    /* テキスト色 */
    --select-text: var(--color-neutral-solid-gray-800, #333333);
    --select-text-disabled: var(--color-neutral-solid-gray-420, #949494);

    /* タイポグラフィ */
    --select-font-size: var(--font-size-16, 1rem);
    --select-letter-spacing: 0.02em;

    /* レイアウト */
    --select-border-width: 1px;
    --select-border-radius: var(--border-radius-8, 0.5rem);
    --select-padding-y: calc(11 / 16 * 1rem);
    --select-padding-left: var(--spacing-4, 1rem);
    --select-padding-right: var(--spacing-10, 2.5rem);

    /* 高さ */
    --select-height-sm: 40px;
    --select-height-md: 48px;
    --select-height-lg: 56px;

    /* 間隔 */
    --select-gap: var(--spacing-2, 0.5rem);
    --select-requirement-margin: var(--spacing-1, 0.25rem);

    /* 幅（デフォルト: コンテナにフィット） */
    --select-width: 100%;
  }
`;

/**
 * セレクトボックスローカルコンポーネントトークン（API）
 */
const selectLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* Select */
    --dads-select-background: var(--select-bg);
    --dads-select-border-color: var(--select-border);
    --dads-select-border-width: var(--select-border-width);
    --dads-select-border-radius: var(--select-border-radius);
    --dads-select-color: var(--select-text);
    --dads-select-font-size: var(--select-font-size);
    --dads-select-letter-spacing: var(--select-letter-spacing);
    --dads-select-padding-y: var(--select-padding-y);
    --dads-select-padding-left: var(--select-padding-left);
    --dads-select-padding-right: var(--select-padding-right);
    --dads-select-height: var(--select-height-md);
    --dads-select-width: var(--select-width);

    /* Chevron */
    --dads-select-chevron-color: currentColor;

    /* Label */
    --dads-select-label-size: var(--select-label-size-md);
    --dads-select-label-color: var(--select-label-color);
    --dads-select-label-weight: var(--select-label-weight);

    /* Requirement */
    --dads-select-requirement-color: var(--select-requirement-color);

    /* Support text */
    --dads-select-support-color: var(--select-support-color);

    /* Error */
    --dads-select-error-color: var(--select-error-text-color);
  }

  /* サイズバリアント */
  :host([size~="sm"]) {
    --dads-select-label-size: var(--select-label-size-sm);
    --dads-select-height: var(--select-height-sm);
  }

  :host([size~="lg"]) {
    --dads-select-label-size: var(--select-label-size-lg);
    --dads-select-height: var(--select-height-lg);
  }

  /* エラー状態（ボーダー色） */
  :host([error]) {
    --dads-select-border-color: var(--select-border-error);
  }
`;

/**
 * 個別エクスポート（後方互換性のため）
 */
export const selectSemanticTokens = css`${selectSemanticTokensText}`;
export const selectLocalTokens = css`${selectLocalTokensText}`;

/**
 * 統合トークン（セマンティック + ローカル）
 */
export const selectTokens = css`
  ${selectSemanticTokensText}
  ${selectLocalTokensText}
`;
