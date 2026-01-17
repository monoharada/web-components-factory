/**
 * セレクトボックスコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const selectStyles = css`
  /* ========== ホストレベル共通設定 ========== */
  :host {
    display: block;
    font-family: var(--font-family-sans);
  }

  /* ========== ラッパー ========== */
  [part="wrapper"] {
    display: flex;
    flex-direction: column;
    gap: var(--select-gap);
  }

  /* ========== ラベル ========== */
  [part="label"] {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0;
    font-size: var(--dads-select-label-size);
    font-weight: var(--dads-select-label-weight);
    color: var(--dads-select-label-color);
    line-height: var(--line-height-150);
  }

  [part="label-text"] {
    display: contents;
  }

  /* ========== 要否ラベル ========== */
  [part="requirement"] {
    margin-left: var(--select-requirement-margin);
    font-weight: var(--font-weight-400);
    font-size: var(--font-size-16);
    color: var(--dads-select-requirement-color);
  }

  /* ========== サポートテキスト ========== */
  [part="support-text"] {
    margin: 0;
    font-size: var(--font-size-16);
    color: var(--dads-select-support-color);
    line-height: var(--line-height-150);
  }

  /* ========== Selectラッパー ========== */
  [part="select-wrapper"] {
    position: relative;
    width: var(--dads-select-width);
    max-width: 100%;
  }

  /* ========== Select本体（DADS select.css相当） ========== */
  [part="select"] {
    vertical-align: middle;
    box-sizing: border-box;
    width: 100%;
    height: var(--dads-select-height);

    /* プロパティと変数のマッピング（一度だけ定義） */
    background-color: var(--dads-select-background);
    color: var(--dads-select-color);
    border: var(--dads-select-border-width) solid var(--dads-select-border-color);
    border-radius: var(--dads-select-border-radius);
    padding: var(--dads-select-padding-y) var(--dads-select-padding-right) var(--dads-select-padding-y)
      var(--dads-select-padding-left);

    font-family: var(--font-family-sans);
    font-size: var(--dads-select-font-size);
    letter-spacing: var(--dads-select-letter-spacing);
    line-height: 1;

    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  /* ホバー状態 */
  @media (hover: hover) {
    [part="select"]:not(:disabled):not([aria-disabled="true"]):hover {
      --dads-select-border-color: var(--select-border-hover);
    }
  }

  /* フォーカス状態（DADS公式準拠） */
  [part="select"]:focus {
    outline: none;
  }

  [part="select"]:focus-visible {
    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
    outline-offset: var(--dads-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
  }

  /* エラー状態（ホストのerror属性に同期） */
  :host([error]) [part="select"] {
    --dads-select-border-color: var(--select-border-error);
  }

  @media (hover: hover) {
    :host([error]) [part="select"]:not(:disabled):not([aria-disabled="true"]):hover {
      --dads-select-border-color: var(--select-border-error-hover);
    }
  }

  /* disabled/aria-disabled 状態 */
  [part="select"]:is(:disabled, [aria-disabled="true"]),
  [part="select"]:is(:disabled, [aria-disabled="true"]):hover {
    --dads-select-background: var(--select-bg-disabled);
    --dads-select-border-color: var(--select-border-disabled);
    --dads-select-color: var(--select-text-disabled);
    cursor: not-allowed;
  }

  /* aria-disabled は「readonly相当」: Tab移動は可能だが、ポインタ操作は抑止 */
  [part="select"][aria-disabled="true"] {
    pointer-events: none;
  }

  /* ========== Chevron ========== */
  [part="select-chevron"] {
    pointer-events: none;
    position: absolute;
    top: 0;
    right: var(--spacing-4);
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    width: var(--spacing-4);
    height: var(--spacing-4);
    color: var(--dads-select-chevron-color);
  }

  [part="select"]:is(:disabled, [aria-disabled="true"]) + [part="select-chevron"] {
    --dads-select-chevron-color: var(--select-text-disabled);
  }

  /* ========== エラーテキスト ========== */
  [part="error-text"] {
    font-size: var(--font-size-16);
    color: var(--dads-select-error-color);
    line-height: var(--line-height-150);
  }

  /* ========== 強制カラーモード対応 ========== */
  @media (forced-colors: active) {
    [part="select"] {
      color: ButtonText;
      border-color: ButtonText;
    }

    [part="select"][aria-disabled="true"],
    [part="select"][aria-disabled="true"]:hover,
    [part="select"]:disabled,
    [part="select"]:disabled:hover {
      border-color: GrayText;
      color: GrayText;
    }

    [part="select-chevron"] {
      color: ButtonText;
    }

    [part="select"]:is(:disabled, [aria-disabled="true"]) + [part="select-chevron"] {
      color: GrayText;
    }
  }

  /* ========== 印刷対応 ========== */
  @media print {
    [part="select"] {
      background-color: transparent;
      border: 1px solid black;
    }
  }
`;
