/**
 * カードコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 *
 * 最小限のShadow DOM構造（3セクション）に対応
 */
import { css } from '../../core/web-components.js';
export const cardStyles = css `
  :host {
    display: block;
  }

  /* ========== Container ========== */
  [part="base"] {
    display: grid;
    grid-template-areas:
      "media"
      "main"
      "sub";
    grid-template-rows: auto auto auto;

    background-color: var(--dads-card-background);
    border: var(--dads-card-border-width) solid var(--dads-card-border-color);
    border-radius: var(--dads-card-border-radius);
    color: var(--dads-card-color);
    overflow: clip;
    overflow-wrap: anywhere;
  }

  :host([layout="horizontal"]) [part="base"] {
    grid-template-columns:
      minmax(0, min(50%, var(--dads-card-media-width)))
      minmax(0, 1fr);
    grid-template-areas:
      "media main"
      ". sub";
    grid-template-rows: auto auto;
  }

  :host([layout="horizontal"]:not([data-has-media])) [part="base"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "main"
      "sub";
    grid-template-rows: auto auto;
  }

  /* pointer-only convenience: make it feel clickable when delegation is enabled */
  :host([data-dads-card-delegate]) [part="base"] {
    cursor: pointer;
  }

  /* ========== Areas ========== */
  [part="media"] {
    grid-area: media;
    position: relative;
    min-width: 0;
  }

  :host(:not([layout="horizontal"])) [part="media"] {
    border-bottom: var(--dads-card-divider-width) solid var(--dads-card-divider-color);
  }

  :host([layout="horizontal"]) [part="media"] {
    border-right: var(--dads-card-divider-width) solid var(--dads-card-divider-color);
    width: 100%;
  }

  [part="media"][hidden] {
    display: none;
  }

  /* メディアスロット内の画像/動画 */
  [part="media"] ::slotted(img),
  [part="media"] ::slotted(video) {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: var(--dads-card-media-aspect-ratio);
    object-fit: cover;
  }

  [part="main"] {
    grid-area: main;
    min-width: 0;
    padding: var(--dads-card-padding-block) var(--dads-card-padding-inline);
    display: grid;
    gap: var(--dads-card-gap);
    align-content: start;
  }

  /* スロットに投入された要素のデフォルトマージンをリセット */
  [part="main"] ::slotted(*) {
    margin: 0;
    min-width: 0;
  }

  /* 見出し要素のスタイル（DADSトークン適用） */
  [part="main"] ::slotted(:is(h1, h2, h3, h4, h5, h6)) {
    color: var(--dads-card-title-color);
    font-size: var(--dads-card-title-font-size);
    font-weight: var(--dads-card-title-font-weight);
    line-height: var(--dads-card-title-line-height);
    letter-spacing: var(--dads-card-title-letter-spacing);
  }

  /* 本文要素のスタイル（DADSトークン適用） */
  [part="main"] ::slotted(p) {
    color: var(--dads-card-content-color);
    font-size: var(--dads-card-content-font-size);
    font-weight: var(--dads-card-content-font-weight);
    line-height: var(--dads-card-content-line-height);
    letter-spacing: var(--dads-card-content-letter-spacing);
  }

  [part="sub"] {
    grid-area: sub;
    min-width: 0;
    padding: var(--dads-card-padding-block) var(--dads-card-padding-inline);
    display: grid;
    gap: var(--dads-card-gap);
    align-content: start;
  }

  [part="sub"][hidden] {
    display: none;
  }

  [part="sub"] ::slotted(*) {
    margin: 0;
    min-width: 0;
  }

  /* ========== Focus ring (delegate mode) ========== */
  :host([data-dads-card-delegate][data-primary-focus]) [part="base"] {
    outline: var(--dads-card-focus-outline-width) solid var(--dads-card-focus-outline-color);
    outline-offset: var(--dads-card-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-card-focus-ring-width) var(--dads-card-focus-ring-color);
  }
`;
