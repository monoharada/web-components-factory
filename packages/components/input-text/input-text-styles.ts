/**
 * インプットテキストコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const inputTextStyles = css`
  /* ========== ホストレベル共通設定 ========== */
  :host {
    display: block;
    font-family: var(--font-family-sans);
  }

  /* ========== ラッパー ========== */
  [part="wrapper"] {
    display: flex;
    flex-direction: column;
    gap: var(--input-gap);
  }

  /* ========== ラベル ========== */
  [part="label"] {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0;
    font-size: var(--dads-input-label-size);
    font-weight: var(--dads-input-label-weight);
    color: var(--dads-input-label-color);
    line-height: var(--line-height-150);
  }

  [part="label-text"] {
    display: contents;
  }

  /* ========== 要否ラベル ========== */
  [part="requirement"] {
    margin-left: var(--input-requirement-margin);
    font-weight: var(--font-weight-400);
    font-size: var(--font-size-16);
    color: var(--dads-input-requirement-color);
  }

  /* 読み取り専用バッジスタイル（DADS公式準拠） */
  :host([readonly]) [part="requirement"] {
    display: inline-block;
    padding: var(--input-readonly-badge-padding);
    border-radius: var(--input-readonly-badge-radius);
    background-color: var(--input-readonly-badge-bg);
    color: var(--input-readonly-badge-color);
    line-height: 1;
  }

  /* ========== サポートテキスト ========== */
  [part="support-text"] {
    margin: 0;
    font-size: var(--font-size-14);
    color: var(--dads-input-support-color);
    line-height: var(--line-height-150);
  }

  /* ========== インプットラッパー ========== */
  [part="input-wrapper"] {
    position: relative;
    width: var(--dads-input-width);
    max-width: 100%;
  }

  /* ========== インプット本体 ========== */
  [part="input"] {
    display: block;
    width: 100%;
    box-sizing: border-box;

    /* プロパティと変数のマッピング（一度だけ定義） */
    background-color: var(--dads-input-background);
    color: var(--dads-input-color);
    border: var(--dads-input-border-width) solid var(--dads-input-border-color);
    border-radius: var(--dads-input-border-radius);
    padding: var(--dads-input-padding);
    height: var(--dads-input-height);

    /* フォント設定 */
    font-family: var(--font-family-sans);
    font-size: var(--dads-input-font-size);
    line-height: var(--line-height-170);

    /* その他 */
    appearance: none;
    -webkit-appearance: none;
  }

  [part="input"]::placeholder {
    color: var(--dads-input-placeholder-color);
  }

  /* ホバー状態 */
  @media (hover: hover) {
    [part="input"]:not(:disabled):not(:read-only):hover {
      --dads-input-border-color: var(--input-border-hover);
    }
  }

  /* フォーカス状態 - applyDADSFocusStyles()ミックスインで共通スタイル適用 */
  [part="input"]:focus {
    outline: none;
  }

  [part="input"]:focus-visible {
    /* ボーダー色の変更のみ（outline/box-shadowは共通ミックスインで適用） */
    --dads-input-border-color: var(--input-border-focus);
  }

  /* 読み取り専用状態（DADS公式準拠：点線ボーダー） */
  [part="input"]:read-only:not(:disabled) {
    --dads-input-background: var(--input-bg-readonly);
    border-style: dashed;
    cursor: default;
  }

  /* 無効状態 */
  [part="input"]:disabled {
    --dads-input-background: var(--input-bg-disabled);
    --dads-input-color: var(--input-text-disabled);
    --dads-input-border-color: var(--input-border-disabled);
    cursor: not-allowed;
  }

  /* エラー状態 - error属性が設定された場合のみ赤枠を表示 */
  /* 注意: ブラウザの:user-invalid等は使用しない（サブミット時のみバリデーション） */
  :host([error]) [part="input"] {
    --dads-input-border-color: var(--input-border-error);
  }

  /* ========== エラーテキスト ========== */
  [part="error-text"] {
    font-size: var(--font-size-14);
    color: var(--dads-input-error-color);
    line-height: var(--line-height-150);
  }

  /* ========== 強制カラーモード対応 ========== */
  @media (forced-colors: active) {
    [part="input"] {
      border: 1px solid CanvasText;
    }

    [part="input"]:disabled {
      border-color: GrayText;
      color: GrayText;
    }

    [part="input"]:focus-visible {
      outline: 2px solid Highlight;
    }

    :host([error]) [part="input"] {
      border-color: LinkText;
    }
  }

  /* ========== 印刷対応 ========== */
  @media print {
    [part="input"] {
      background-color: transparent !important;
      border: 1px solid black !important;
    }
  }
`;
