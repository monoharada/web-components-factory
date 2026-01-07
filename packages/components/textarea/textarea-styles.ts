/**
 * テキストエリアコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const textareaStyles = css`
  /* ========== ホストレベル共通設定 ========== */
  :host {
    display: block;
    font-family: var(--font-family-sans);
  }

  /* ========== ラッパー ========== */
  [part="wrapper"] {
    display: flex;
    flex-direction: column;
    gap: var(--textarea-gap);
  }

  /* ========== ラベル ========== */
  [part="label"] {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0;
    font-size: var(--dads-textarea-label-size);
    font-weight: var(--dads-textarea-label-weight);
    color: var(--dads-textarea-label-color);
    line-height: var(--line-height-150);
  }

  [part="label-text"] {
    display: contents;
  }

  /* ========== 要否ラベル ========== */
  [part="requirement"] {
    margin-left: var(--textarea-requirement-margin);
    font-weight: var(--font-weight-400);
    font-size: var(--font-size-16);
    color: var(--dads-textarea-requirement-color);
  }

  /* 読み取り専用バッジスタイル（DADS公式準拠） */
  :host([readonly]) [part="requirement"] {
    display: inline-block;
    padding: var(--textarea-readonly-badge-padding);
    border-radius: var(--textarea-readonly-badge-radius);
    background-color: var(--textarea-readonly-badge-bg);
    color: var(--textarea-readonly-badge-color);
    line-height: 1;
  }

  /* ========== サポートテキスト ========== */
  [part="support-text"] {
    margin: 0;
    font-size: var(--font-size-14);
    color: var(--dads-textarea-support-color);
    line-height: var(--line-height-150);
  }

  /* ========== テキストエリアラッパー ========== */
  [part="textarea-wrapper"] {
    position: relative;
  }

  /* ========== テキストエリア本体 ========== */
  [part="textarea"] {
    display: block;
    width: 100%;
    box-sizing: border-box;

    /* プロパティと変数のマッピング（一度だけ定義） */
    background-color: var(--dads-textarea-background);
    color: var(--dads-textarea-color);
    border: var(--dads-textarea-border-width) solid var(--dads-textarea-border-color);
    border-radius: var(--dads-textarea-border-radius);
    padding: var(--dads-textarea-padding);
    min-height: var(--dads-textarea-min-height);
    resize: var(--dads-textarea-resize);

    /* フォント設定 */
    font-family: var(--font-family-sans);
    font-size: var(--dads-textarea-font-size);
    line-height: var(--line-height-170);

    /* その他 */
    appearance: none;
    -webkit-appearance: none;
  }

  [part="textarea"]::placeholder {
    color: var(--dads-textarea-placeholder-color);
  }

  /* ホバー状態 */
  @media (hover: hover) {
    [part="textarea"]:not(:disabled):not(:read-only):hover {
      --dads-textarea-border-color: var(--textarea-border-hover);
    }
  }

  /* フォーカス状態 - applyDADSFocusStyles()ミックスインで共通スタイル適用 */
  [part="textarea"]:focus {
    outline: none;
  }

  [part="textarea"]:focus-visible {
    /* ボーダー色の変更のみ（outline/box-shadowは共通ミックスインで適用） */
    --dads-textarea-border-color: var(--textarea-border-focus);
  }

  /* 読み取り専用状態（DADS公式準拠：点線ボーダー） */
  [part="textarea"]:read-only:not(:disabled) {
    --dads-textarea-background: var(--textarea-bg-readonly);
    border-style: dashed;
    cursor: default;
  }

  /* 無効状態 */
  [part="textarea"]:disabled {
    --dads-textarea-background: var(--textarea-bg-disabled);
    --dads-textarea-color: var(--textarea-text-disabled);
    --dads-textarea-border-color: var(--textarea-border-disabled);
    cursor: not-allowed;
  }

  /* エラー状態 */
  :host([error]) [part="textarea"],
  [part="textarea"][aria-invalid="true"] {
    --dads-textarea-border-color: var(--textarea-border-error);
  }

  /* ネイティブバリデーションエラー */
  [part="textarea"]:user-invalid {
    --dads-textarea-border-color: var(--textarea-border-error);
  }

  /* ========== 文字数カウンター ========== */
  [part="counter"] {
    display: block;
    font-size: var(--font-size-14);
    color: var(--dads-textarea-counter-color);
    line-height: var(--line-height-130);
    min-height: 1.5em;
  }

  /* カウンター非表示（:empty疑似クラスで制御） */
  [part="counter"]:empty {
    display: none;
  }

  /* カウンター超過状態 */
  [part="counter"][data-exceeded] {
    color: var(--textarea-counter-error-color);
    font-weight: var(--font-weight-700);
  }

  /* ========== エラーテキスト ========== */
  [part="error-text"] {
    font-size: var(--font-size-14);
    color: var(--dads-textarea-error-color);
    line-height: var(--line-height-150);
  }

  /* ========== 強制カラーモード対応 ========== */
  @media (forced-colors: active) {
    [part="textarea"] {
      border: 1px solid CanvasText;
    }

    [part="textarea"]:disabled {
      border-color: GrayText;
      color: GrayText;
    }

    [part="textarea"]:focus-visible {
      outline: 2px solid Highlight;
    }

    :host([error]) [part="textarea"],
    [part="textarea"][aria-invalid="true"],
    [part="textarea"]:user-invalid {
      border-color: LinkText;
    }
  }

  /* ========== 印刷対応 ========== */
  @media print {
    [part="textarea"] {
      background-color: transparent !important;
      border: 1px solid black !important;
    }
  }
`;
