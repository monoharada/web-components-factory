/**
 * 引用ブロックコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';
/**
 * 引用ブロックセマンティックトークン
 * 意味的な役割に基づいた命名
 */
const blockquoteSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* 段落間余白 */
    --blockquote-gap: var(--spacing-4, 1em);

    /* マージン（DADS準拠: 左右40px） */
    --blockquote-margin-inline: var(--spacing-10, 40px);

    /* パディング（DADS準拠: 上下8px、左24px、右16px） */
    --blockquote-padding-block: var(--spacing-2, 8px);
    --blockquote-padding-inline-start: var(--spacing-6, 24px);
    --blockquote-padding-inline-end: var(--spacing-4, 16px);

    /* 左ボーダー（DADS準拠: 8px gray） */
    --blockquote-border-width: 8px;
    --blockquote-border-color: var(--color-neutral-solid-gray-536, #757575);

    /* タイポグラフィ（DADS準拠: 17px, #333333） */
    --blockquote-font-size: var(--font-size-17, 1.0625rem);
    --blockquote-line-height: var(--line-height-170, 1.7);
    --blockquote-text-color: var(--color-neutral-solid-gray-800, #333333);

    /* スロット表示（manual slot assignment用） */
    --blockquote-slot-display: block;
  }
`;
/**
 * 引用ブロックローカルコンポーネントトークン
 * コンポーネント固有のカスタマイズ可能な変数
 * 外部から上書きして使用可能
 */
const blockquoteLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* 段落間余白 */
    --dads-blockquote-gap: var(--blockquote-gap);

    /* マージン */
    --dads-blockquote-margin-inline: var(--blockquote-margin-inline);

    /* パディング */
    --dads-blockquote-padding-block: var(--blockquote-padding-block);
    --dads-blockquote-padding-inline-start: var(--blockquote-padding-inline-start);
    --dads-blockquote-padding-inline-end: var(--blockquote-padding-inline-end);

    /* ボーダー */
    --dads-blockquote-border-width: var(--blockquote-border-width);
    --dads-blockquote-border-color: var(--blockquote-border-color);

    /* タイポグラフィ */
    --dads-blockquote-font-size: var(--blockquote-font-size);
    --dads-blockquote-line-height: var(--blockquote-line-height);
    --dads-blockquote-color: var(--blockquote-text-color);

    /* スロット表示 */
    --dads-blockquote-slot-display: var(--blockquote-slot-display);
  }
`;
/**
 * 個別エクスポート（後方互換性のため）
 */
export const blockquoteSemanticTokens = css `${blockquoteSemanticTokensText}`;
export const blockquoteLocalTokens = css `${blockquoteLocalTokensText}`;
/**
 * 統合トークン（セマンティック + ローカル）
 */
export const blockquoteTokens = css `
  ${blockquoteSemanticTokensText}
  ${blockquoteLocalTokensText}
`;
