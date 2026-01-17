/**
 * Checkboxコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 checkbox.css をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';

export const checkboxStyles = css`
  :host {
    display: inline-block;
    --_gap: var(--spacing-1, 4px);
    --_checkbox-size: var(--spacing-6, 24px);
    --_checkbox-border-width: var(--spacing-0-5, 2px);
    --_checkbox-scale: 1;
    --_label-padding-top: calc(var(--spacing-0-5, 2px) / 2);
    --_label-font-size: var(--font-size-16, 1rem);
  }

  :host([size="md"]) {
    --_gap: var(--spacing-2, 8px);
    --_checkbox-size: var(--spacing-8, 32px);
    --_checkbox-border-width: var(--spacing-0-5, 2px);
    --_checkbox-scale: calc(20 / 14);
    --_label-padding-top: var(--spacing-1, 4px);
    --_label-font-size: var(--font-size-16, 1rem);
  }

  :host([size="lg"]) {
    --_gap: var(--spacing-2, 8px);
    --_checkbox-size: var(--spacing-11, 44px);
    --_checkbox-border-width: calc(var(--spacing-0-5, 2px) + (var(--spacing-0-5, 2px) / 2));
    --_checkbox-scale: calc(27 / 14);
    --_label-padding-top: var(--spacing-2-5, 10px);
    --_label-font-size: var(--font-size-17, 1.0625rem);
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
    padding-block: var(--spacing-2, 8px);
  }

  /* ========== チェックボックス枠 ========== */
  [part="checkbox"] {
    --_checkbox-hover-bg: transparent;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: var(--_checkbox-size);
    height: var(--_checkbox-size);
    border-radius: 12.5%;
    background-color: var(--_checkbox-hover-bg);
  }

  @media (any-hover: hover) {
    [part="checkbox"]:has(:not(:focus, :disabled, [aria-disabled="true"]):hover) {
      --_checkbox-hover-bg: var(--color-neutral-solid-gray-420);
    }
  }

  /* ========== ネイティブ input ========== */
  [part="input"] {
    --_base-color: var(--color-neutral-white);
    --_accent-color: var(--color-primitive-blue-900);
    --_accent-hover-color: var(--color-primitive-blue-1100);
    --_border-color: var(--color-neutral-solid-gray-600);
    --_border-hover-color: var(--color-neutral-black);
    --_check-color: var(--color-neutral-white);
    --_border-color-current: var(--_border-color);
    --_fill-color-current: var(--_base-color);

    margin: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    width: 75%;
    height: 75%;
    border-radius: calc(2 / 18 * 100%);
    background-color: var(--_fill-color-current);
    background-clip: padding-box;
    border: var(--_checkbox-border-width) solid var(--_border-color-current);
  }

  /* DADS HTML版は :focus で適用（クリック時も表示） */
  [part="input"]:focus {
    outline: var(--spacing-1, 4px) solid var(--color-neutral-black);
    outline-offset: var(--spacing-0-5, 2px);
    box-shadow: 0 0 0 var(--spacing-0-5, 2px) var(--color-primitive-yellow-300);
  }

  @media (any-hover: hover) {
    [part="input"]:not(:disabled, [aria-disabled="true"]):hover {
      --_border-color-current: var(--_border-hover-color);
    }
  }

  [part="input"]:is(:checked, :indeterminate) {
    --_border-color-current: var(--_accent-color);
    --_fill-color-current: var(--_accent-color);
  }

  @media (any-hover: hover) {
    [part="input"]:is(:checked, :indeterminate):not(:disabled, [aria-disabled="true"]):hover {
      --_border-color-current: var(--_accent-hover-color);
      --_fill-color-current: var(--_accent-hover-color);
    }
  }

  [part="input"]::before {
    display: none;
    width: var(--spacing-3-5, 14px);
    height: var(--spacing-3-5, 14px);
    background-color: var(--_check-color);
    transform-origin: left top;
    transform: scale(var(--_checkbox-scale, 1));
    content: '';
  }

  [part="input"]:checked::before {
    display: block;
    clip-path: path(
      'M5.6,11.2L12.65,4.15L11.25,2.75L5.6,8.4L2.75,5.55L1.35,6.95L5.6,11.2Z'
    );
  }

  [part="input"]:indeterminate::before {
    display: block;
    clip-path: path('M2,6h10v2H2Z');
  }

  /* エラー状態（aria-invalid=true） */
  [part="input"][aria-invalid="true"] {
    --_accent-color: var(--color-semantic-error-1);
    --_accent-hover-color: var(--color-primitive-red-1000);
    --_border-color: var(--color-semantic-error-1);
    --_border-hover-color: var(--color-primitive-red-1000);
  }

  /* 無効状態 */
  [part="input"]:is(:disabled, [aria-disabled="true"]) {
    --_base-color: var(--color-neutral-solid-gray-50);
    --_accent-color: var(--color-neutral-solid-gray-300);
    --_accent-hover-color: var(--color-neutral-solid-gray-300);
    --_border-color: var(--color-neutral-solid-gray-300);
    --_border-hover-color: var(--color-neutral-solid-gray-300);
  }

  /* 強制カラーモード対応 */
  @media (forced-colors: active) {
    [part="input"],
    [part="input"][aria-invalid="true"] {
      --_accent-color: Highlight;
      --_accent-hover-color: Highlight;
      --_border-color: ButtonText;
      --_border-hover-color: ButtonText;
      --_check-color: HighlightText;
    }

    [part="input"]:is(:disabled, [aria-disabled="true"]) {
      --_accent-color: GrayText;
      --_accent-hover-color: GrayText;
      --_border-color: GrayText;
      --_border-hover-color: GrayText;
      --_check-color: Canvas;
    }
  }

  /* ========== ラベルテキスト ========== */
  [part="label"] {
    padding-block-start: var(--_label-padding-top);
    color: var(--color-neutral-solid-gray-800);
    font-weight: var(--font-weight-400, 400);
    font-size: var(--_label-font-size);
    line-height: var(--line-height-130, 1.3);
    font-family: var(--font-family-sans);
    letter-spacing: 0;
  }

  /* ========== 要否ラベル ========== */
  [part="requirement"] {
    padding-block-start: var(--_label-padding-top);
    margin-inline-start: var(--spacing-1, 4px);
    font-weight: var(--font-weight-400, 400);
    font-size: var(--_label-font-size);
    line-height: var(--line-height-130, 1.3);
    font-family: var(--font-family-sans);
    color: var(--color-semantic-error-1, #ec0000);
  }

  /* 要否ラベルが空の場合は非表示 */
  [part="requirement"]:empty {
    display: none;
  }

  /* ========== エラーテキスト ========== */
  [part="error-text"] {
    display: block;
    margin-block-start: var(--spacing-1, 4px);
    /* サイズに応じて動的に計算（checkbox + gap） */
    padding-inline-start: calc(var(--_checkbox-size) + var(--_gap));
    font-weight: var(--font-weight-400, 400);
    font-size: var(--font-size-14, 0.875rem);
    line-height: var(--line-height-150, 1.5);
    font-family: var(--font-family-sans);
    color: var(--color-semantic-error-1, #ec0000);
  }

  /* エラーテキストが空の場合は非表示 */
  [part="error-text"]:empty {
    display: none;
  }
`;
