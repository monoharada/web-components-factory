/**
 * Checkboxコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 checkbox.css をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';

export const checkboxStyles = css`
  :host {
    display: inline-block;
  }

  /* ========== ベース（label相当） ========== */
  [part="base"] {
    display: flex;
    align-items: start;
    gap: var(--_gap);
    width: fit-content;
  }

  /* ラベルがある場合のみ上下paddingを付与（DADS準拠） */
  [part="base"]:has([part="label"]:not(:empty)) {
    padding-top: calc(8 / 16 * 1rem);
    padding-bottom: calc(8 / 16 * 1rem);
  }

  /* ========== サイズトークン（DADS準拠） ========== */
  [part="base"][data-size='sm'] {
    --_gap: calc(4 / 16 * 1rem);
    --_checkbox-size: calc(24 / 16 * 1rem);
    --_checkbox-border-width: calc(2 / 16 * 1rem);
    --_checkbox-scale: 1;
    --_label-padding-top: calc(1 / 16 * 1rem);
    --_label-font-size: calc(16 / 16 * 1rem);
  }

  [part="base"][data-size='md'] {
    --_gap: calc(8 / 16 * 1rem);
    --_checkbox-size: calc(32 / 16 * 1rem);
    --_checkbox-border-width: calc(2 / 16 * 1rem);
    --_checkbox-scale: calc(20 / 14);
    --_label-padding-top: calc(4 / 16 * 1rem);
    --_label-font-size: calc(16 / 16 * 1rem);
  }

  [part="base"][data-size='lg'] {
    --_gap: calc(8 / 16 * 1rem);
    --_checkbox-size: calc(44 / 16 * 1rem);
    --_checkbox-border-width: calc(3 / 16 * 1rem);
    --_checkbox-scale: calc(27 / 14);
    --_label-padding-top: calc(10 / 16 * 1rem);
    --_label-font-size: calc(17 / 16 * 1rem);
  }

  /* ========== チェックボックス枠 ========== */
  [part='checkbox'] {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: var(--_checkbox-size);
    height: var(--_checkbox-size);
    border-radius: 12.5%;
  }

  @media (hover: hover) {
    [part='checkbox']:has(:not(:focus, :disabled, [aria-disabled='true']):hover) {
      background-color: var(--color-neutral-solid-gray-420);
    }
  }

  /* ========== ネイティブ input ========== */
  [part='input'] {
    --_base-color: var(--color-neutral-white);
    --_accent-color: var(--color-primitive-blue-900);
    --_accent-hover-color: var(--color-primitive-blue-1100);
    --_border-color: var(--color-neutral-solid-gray-600);
    --_border-hover-color: var(--color-neutral-black);
    --_check-color: var(--color-neutral-white);

    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    width: 75%;
    height: 75%;
    border-radius: calc(2 / 18 * 100%);
    background-color: var(--_base-color);
    background-clip: padding-box;
    border: var(--_checkbox-border-width) solid var(--_border-color);
  }

  /* DADS HTML版は :focus で適用（クリック時も表示） */
  [part='input']:focus {
    outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);
    outline-offset: calc(2 / 16 * 1rem);
    box-shadow: 0 0 0 calc(2 / 16 * 1rem) var(--color-primitive-yellow-300);
  }

  @media (hover: hover) {
    [part='input']:not(:disabled, [aria-disabled='true']):hover {
      border-color: var(--_border-hover-color);
    }
  }

  [part='input']:is(:checked, :indeterminate) {
    border-color: var(--_accent-color);
    background-color: var(--_accent-color);
  }

  @media (hover: hover) {
    [part='input']:is(:checked, :indeterminate):not(:disabled, [aria-disabled='true']):hover {
      border-color: var(--_accent-hover-color);
      background-color: var(--_accent-hover-color);
    }
  }

  [part='input']::before {
    display: none;
    width: calc(14 / 16 * 1rem);
    height: calc(14 / 16 * 1rem);
    background-color: var(--_check-color);
    transform-origin: left top;
    transform: scale(var(--_checkbox-scale, 1));
    content: '';
  }

  [part='input']:checked::before {
    display: block;
    clip-path: path(
      'M5.6,11.2L12.65,4.15L11.25,2.75L5.6,8.4L2.75,5.55L1.35,6.95L5.6,11.2Z'
    );
  }

  [part='input']:indeterminate::before {
    display: block;
    clip-path: path('M2,6h10v2H2Z');
  }

  /* エラー状態（aria-invalid=true） */
  [part='input'][aria-invalid='true'] {
    --_accent-color: var(--color-semantic-error-1);
    --_accent-hover-color: var(--color-primitive-red-1000);
    --_border-color: var(--color-semantic-error-1);
    --_border-hover-color: var(--color-primitive-red-1000);
  }

  /* 無効状態 */
  [part='input']:is(:disabled, [aria-disabled='true']) {
    --_base-color: var(--color-neutral-solid-gray-50);
    --_accent-color: var(--color-neutral-solid-gray-300);
    --_accent-hover-color: var(--color-neutral-solid-gray-300);
    --_border-color: var(--color-neutral-solid-gray-300);
    --_border-hover-color: var(--color-neutral-solid-gray-300);
  }

  /* 強制カラーモード対応 */
  @media (forced-colors: active) {
    [part='input'],
    [part='input'][aria-invalid='true'] {
      --_accent-color: Highlight;
      --_accent-hover-color: Highlight;
      --_border-color: ButtonText;
      --_border-hover-color: ButtonText;
      --_check-color: HighlightText;
    }

    [part='input']:is(:disabled, [aria-disabled='true']) {
      --_accent-color: GrayText;
      --_accent-hover-color: GrayText;
      --_border-color: GrayText;
      --_border-hover-color: GrayText;
      --_check-color: Canvas;
    }
  }

  /* ========== ラベルテキスト ========== */
  [part='label'] {
    padding-top: var(--_label-padding-top);
    color: var(--color-neutral-solid-gray-800);
    font-weight: 400;
    font-size: var(--_label-font-size);
    line-height: 1.3;
    font-family: var(--font-family-sans);
    letter-spacing: 0;
  }

  /* ========== 要否ラベル ========== */
  [part='requirement'] {
    padding-top: var(--_label-padding-top);
    margin-left: var(--spacing-1, 4px);
    font-weight: 400;
    font-size: var(--_label-font-size);
    line-height: 1.3;
    font-family: var(--font-family-sans);
    color: var(--color-semantic-error-1, #ec0000);
  }

  /* 要否ラベルが空の場合は非表示 */
  [part='requirement']:empty {
    display: none;
  }

  /* ========== エラーテキスト ========== */
  [part='error-text'] {
    display: block;
    margin-top: var(--spacing-1, 4px);
    /* サイズに応じて動的に計算（checkbox + gap） */
    padding-left: calc(var(--_checkbox-size) + var(--_gap));
    font-weight: 400;
    font-size: calc(14 / 16 * 1rem);
    line-height: 1.5;
    font-family: var(--font-family-sans);
    color: var(--color-semantic-error-1, #ec0000);
  }

  /* エラーテキストが空の場合は非表示 */
  [part='error-text']:empty {
    display: none;
  }
`;

