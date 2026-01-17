/**
 * Radioコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 radio.css をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';

export const radioStyles = css`
  :host {
    display: inline-block;
  }

  /* ========== ベース（label相当） ========== */
  [part="base"] {
    display: flex;
    align-items: start;
    gap: var(--dads-radio-gap);
    width: fit-content;
  }

  /* ラベルがある場合のみ上下paddingを付与（DADS準拠） */
  [part="base"]:has([part="label"]:not(:empty)) {
    padding-block: var(--dads-radio-base-padding-block);
  }

  /* ========== ラジオ外枠 ========== */
  [part="radio"] {
    --_radio-hover-bg: var(--dads-radio-hover-bg);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: var(--dads-radio-target-size);
    height: var(--dads-radio-target-size);
    border-radius: 50%;
    background-color: var(--_radio-hover-bg);
  }

  @media (any-hover: hover) {
    [part="radio"]:has(:not(:focus, :disabled, [aria-disabled="true"]):hover) {
      --_radio-hover-bg: var(--dads-radio-hover-bg-hover);
    }
  }

  /* ========== ネイティブ input[type=radio] ========== */
  [part="input"] {
    --_base-color: var(--dads-radio-input-base-color);
    --_accent-color: var(--dads-radio-input-accent-color);
    --_accent-hover-color: var(--dads-radio-input-accent-hover-color);
    --_border-color: var(--dads-radio-input-border-color);
    --_border-hover-color: var(--dads-radio-input-border-hover-color);
    --_border-color-current: var(--_border-color);
    --_dot-color: var(--_accent-color);

    position: relative;
    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    width: var(--dads-radio-outer-size);
    height: var(--dads-radio-outer-size);
    border-radius: 51%;
    background-color: var(--_base-color);
    border: var(--dads-radio-border-width) solid var(--_border-color-current);
  }

  /* DADS HTML版は :focus で適用（クリック時も表示） */
  [part="input"]:focus {
    outline: var(--dads-radio-focus-outline-width) solid var(--dads-radio-focus-outline-color);
    outline-offset: var(--dads-radio-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-radio-focus-ring-width) var(--dads-radio-focus-ring-color);
  }

  @media (any-hover: hover) {
    [part="input"]:not(:disabled, [aria-disabled="true"]):hover {
      --_border-color-current: var(--_border-hover-color);
    }
  }

  [part="input"]:checked {
    --_border-color-current: var(--_accent-color);
  }

  @media (any-hover: hover) {
    [part="input"]:checked:not(:disabled, [aria-disabled="true"]):hover {
      --_border-color-current: var(--_accent-hover-color);
      --_dot-color: var(--_accent-hover-color);
    }
  }

  [part="input"]:checked::before {
    position: absolute;
    inset: 0;
    margin: auto;
    width: var(--dads-radio-inner-size);
    height: var(--dads-radio-inner-size);
    border-radius: 51%;
    background-color: var(--_dot-color);
    content: '';
  }

  /* エラー状態（aria-invalid=true） */
  [part="input"][aria-invalid="true"] {
    --_accent-color: var(--dads-radio-input-error-accent-color);
    --_accent-hover-color: var(--dads-radio-input-error-accent-hover-color);
    --_border-color: var(--dads-radio-input-error-border-color);
    --_border-hover-color: var(--dads-radio-input-error-border-hover-color);
  }

  /* 無効状態 */
  [part="input"]:is(:disabled, [aria-disabled="true"]) {
    --_base-color: var(--dads-radio-input-disabled-base-color);
    --_accent-color: var(--dads-radio-input-disabled-accent-color);
    --_accent-hover-color: var(--dads-radio-input-disabled-accent-hover-color);
    --_border-color: var(--dads-radio-input-disabled-border-color);
    --_border-hover-color: var(--dads-radio-input-disabled-border-hover-color);
  }

  /* 強制カラーモード対応 */
  @media (forced-colors: active) {
    [part="input"],
    [part="input"][aria-invalid="true"] {
      --_accent-color: Highlight;
      --_accent-hover-color: Highlight;
      --_border-color: ButtonText;
      --_border-hover-color: ButtonText;
    }

    [part="input"]:is(:disabled, [aria-disabled="true"]) {
      --_accent-color: GrayText;
      --_accent-hover-color: GrayText;
      --_border-color: GrayText;
      --_border-hover-color: GrayText;
    }
  }

  /* ========== ラベルテキスト ========== */
  [part="label"] {
    padding-block-start: var(--dads-radio-label-padding-top);
    color: var(--dads-radio-label-color);
    font-weight: var(--dads-radio-font-weight);
    font-size: var(--dads-radio-label-font-size);
    line-height: var(--dads-radio-label-line-height);
    font-family: var(--dads-radio-font-family);
    letter-spacing: 0;
  }

  /* ========== 要否ラベル ========== */
  [part="requirement"] {
    padding-block-start: var(--dads-radio-label-padding-top);
    margin-inline-start: var(--dads-radio-requirement-margin);
    font-weight: var(--dads-radio-font-weight);
    font-size: var(--dads-radio-label-font-size);
    line-height: var(--dads-radio-label-line-height);
    font-family: var(--dads-radio-font-family);
    color: var(--dads-radio-requirement-color);
  }

  /* 要否ラベルが空の場合は非表示 */
  [part="requirement"]:empty {
    display: none;
  }

  /* ========== エラーテキスト ========== */
  [part="error-text"] {
    display: block;
    margin-block-start: var(--dads-radio-error-text-margin-block-start);
    /* サイズに応じて動的に計算（radio + gap） */
    padding-inline-start: calc(var(--dads-radio-target-size) + var(--dads-radio-gap));
    font-weight: var(--dads-radio-font-weight);
    font-size: var(--dads-radio-error-text-font-size);
    line-height: var(--dads-radio-error-text-line-height);
    font-family: var(--dads-radio-font-family);
    color: var(--dads-radio-error-text-color);
  }

  /* エラーテキストが空の場合は非表示 */
  [part="error-text"]:empty {
    display: none;
  }
`;
