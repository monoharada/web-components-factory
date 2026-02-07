/**
 * スイッチコンポーネント用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * セマンティックトークンとローカルコンポーネントトークンの2層構造
 */
import { css } from '../../core/web-components.js';
/**
 * スイッチセマンティックトークン
 * 意味的な役割に基づいた命名
 */
const switchSemanticTokensText = `
  :host {
    /* ========== セマンティックトークン（意味的な値） ========== */

    /* サイズトークン: sm */
    --switch-track-width-sm: 40px;
    --switch-track-height-sm: 20px;
    --switch-knob-size-sm: 16px;

    /* サイズトークン: md（デフォルト） */
    --switch-track-width-md: 48px;
    --switch-track-height-md: 24px;
    --switch-knob-size-md: 20px;

    /* サイズトークン: lg */
    --switch-track-width-lg: 56px;
    --switch-track-height-lg: 28px;
    --switch-knob-size-lg: 24px;

    /* トラック背景色（ON/OFF同色） */
    --switch-track-bg: var(--color-primary, #00118f);
    --switch-track-bg-disabled: var(--color-neutral-solid-gray-300, #b3b3b3);

    /* ノブ背景色 */
    --switch-knob-bg: var(--color-neutral-white, #ffffff);
    --switch-knob-bg-disabled: var(--color-neutral-solid-gray-100, #e6e6e6);

    /* レイアウト */
    --switch-knob-offset: 2px;
    --switch-gap: var(--spacing-3, 12px);

    /* アニメーション */
    --switch-transition-duration: 150ms;

    /* ラベル */
    --switch-label-color: var(--color-neutral-solid-gray-800, #333333);
    --switch-label-color-disabled: var(--color-neutral-solid-gray-420, #949494);
    --switch-label-size: var(--font-size-16, 1rem);

    /* フォーカス（DADS準拠: 黄色リング + 黒アウトライン） */
    --switch-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
    --switch-focus-ring-width: 4px;
    --switch-focus-outline-color: var(--color-neutral-black, #000000);
    --switch-focus-outline-width: 2px;
  }
`;
/**
 * スイッチローカルコンポーネントトークン
 * コンポーネント固有のカスタマイズ可能な変数
 * 外部から上書きして使用可能
 */
const switchLocalTokensText = `
  :host {
    /* ========== ローカルコンポーネントトークン（カスタマイズ用） ========== */

    /* トラック */
    --dads-switch-track-width: var(--switch-track-width-md);
    --dads-switch-track-height: var(--switch-track-height-md);
    --dads-switch-track-bg: var(--switch-track-bg);

    /* ノブ */
    --dads-switch-knob-size: var(--switch-knob-size-md);
    --dads-switch-knob-bg: var(--switch-knob-bg);

    /* ラベル */
    --dads-switch-label-color: var(--switch-label-color);
  }

  /* サイズバリアント: sm */
  :host([size="sm"]) {
    --dads-switch-track-width: var(--switch-track-width-sm);
    --dads-switch-track-height: var(--switch-track-height-sm);
    --dads-switch-knob-size: var(--switch-knob-size-sm);
  }

  /* サイズバリアント: lg */
  :host([size="lg"]) {
    --dads-switch-track-width: var(--switch-track-width-lg);
    --dads-switch-track-height: var(--switch-track-height-lg);
    --dads-switch-knob-size: var(--switch-knob-size-lg);
  }

  /* 無効状態 */
  :host([disabled]) {
    --dads-switch-track-bg: var(--switch-track-bg-disabled);
    --dads-switch-knob-bg: var(--switch-knob-bg-disabled);
    --dads-switch-label-color: var(--switch-label-color-disabled);
  }
`;
/**
 * 個別エクスポート（後方互換性のため）
 */
export const switchSemanticTokens = css `${switchSemanticTokensText}`;
export const switchLocalTokens = css `${switchLocalTokensText}`;
/**
 * 統合トークン（セマンティック + ローカル）
 */
export const switchTokens = css `
  ${switchSemanticTokensText}
  ${switchLocalTokensText}
`;
