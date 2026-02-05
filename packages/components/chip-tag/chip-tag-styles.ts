/**
 * チップタグコンポーネント用スタイル定義
 */
import { css } from '../../core/web-components.js';

export const chipTagStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
    --dads-chip-tag-action-hit-padding: 0px;
  }

  [part='base'] {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    min-height: var(--dads-chip-tag-min-height);
    padding-block: var(--dads-chip-tag-padding-block);
    padding-inline: var(--dads-chip-tag-padding-inline);
    padding-inline-end: calc(var(--dads-chip-tag-padding-inline) + var(--dads-chip-tag-action-hit-padding));
    border-radius: var(--dads-chip-tag-border-radius);
    border: var(--dads-chip-tag-border-width) solid var(--dads-chip-tag-border-color);
    background-color: var(--dads-chip-tag-background);
    color: var(--dads-chip-tag-text-color);
    box-shadow: var(--dads-chip-tag-border-shadow);
    font-family: var(--dads-chip-tag-font-family);
    font-size: var(--dads-chip-tag-font-size);
    font-weight: var(--dads-chip-tag-font-weight);
    line-height: var(--dads-chip-tag-line-height);
    letter-spacing: var(--dads-chip-tag-letter-spacing);
    overflow-wrap: anywhere;
  }

  /* 下線用の余白は action="none" 時だけ有効にする（remove時のセンタリングを崩さない） */
  :host(:not([action='none'])) {
    --dads-chip-tag-label-padding-bottom: 0;
  }

  :host([action='none']) {
    --dads-chip-tag-label-text-decoration: underline;
  }

  :host([action='remove']) {
    --dads-chip-tag-action-hit-padding: calc(
      (var(--dads-chip-tag-action-hit-area) - var(--dads-chip-tag-action-size)) / 2
    );
  }

  :host([action='none']:hover) {
    --dads-chip-tag-text-color: var(--dads-chip-tag-text-color-hover);
    --dads-chip-tag-label-underline-thickness: var(
      --dads-chip-tag-label-underline-thickness-hover
    );
    --dads-chip-tag-border-shadow: var(--dads-chip-tag-border-shadow-hover);
  }

  :host([action='none']:active) {
    --dads-chip-tag-text-color: var(--dads-chip-tag-text-color-active);
    --dads-chip-tag-label-underline-thickness: var(
      --dads-chip-tag-label-underline-thickness-hover
    );
  }

  [part='start-icon'] {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    padding-block-end: var(--dads-chip-tag-label-padding-bottom);
  }

  [part='start-icon']::slotted(*) {
    width: var(--dads-chip-tag-icon-size);
    height: var(--dads-chip-tag-icon-size);
    display: block;
  }

  [part='label'] {
    display: inline-flex;
    align-items: center;
    padding-inline: var(--dads-chip-tag-label-padding-inline);
    padding-block-end: var(--dads-chip-tag-label-padding-bottom);
    text-decoration: var(--dads-chip-tag-label-text-decoration);
    text-decoration-thickness: var(--dads-chip-tag-label-underline-thickness);
    text-underline-offset: var(--dads-chip-tag-label-underline-offset);
  }

  [part='value'] {
    display: none;
  }

  :host([data-has-value]) [part='value'] {
    display: inline;
  }

  :host([data-has-value]) [part='label'] slot {
    display: none;
  }

  [part='action'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--dads-chip-tag-action-size);
    height: var(--dads-chip-tag-action-size);
    padding: 0;
    position: relative;
    margin-inline-end: calc(-1 * var(--dads-chip-tag-action-hit-padding));
    border: var(--dads-chip-tag-action-border-width) solid var(--dads-chip-tag-action-border-color);
    border-radius: var(--dads-chip-tag-border-radius);
    background: var(--dads-chip-tag-action-background);
    color: var(--dads-chip-tag-action-icon-color);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    appearance: none;
  }

  /* 見た目は変えずに、タップ領域だけを拡張する（主に右側へ広げる） */
  [part='action']::before {
    content: '';
    position: absolute;
    width: var(--dads-chip-tag-action-hit-area);
    height: var(--dads-chip-tag-action-hit-area);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
  }

  :host([action='remove']) [part='action'] {
    --dads-chip-tag-action-background: var(--chip-tag-action-background);
    --dads-chip-tag-action-icon-color: var(--chip-tag-action-icon-color);
  }

  :host([action='remove']) [part='action']:hover {
    --dads-chip-tag-action-background: var(--dads-chip-tag-action-background-hover);
    --dads-chip-tag-action-icon-color: var(--dads-chip-tag-action-icon-color-hover);
  }

  :host([action='remove']) [part='action']:active {
    --dads-chip-tag-action-background: var(--dads-chip-tag-action-background-active);
    --dads-chip-tag-action-icon-color: var(--dads-chip-tag-action-icon-color-active);
  }

  [part='action-icon'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--dads-chip-tag-action-icon-size);
    height: var(--dads-chip-tag-action-icon-size);
  }

  [part='action-icon']::slotted(*) {
    width: var(--dads-chip-tag-action-icon-size);
    height: var(--dads-chip-tag-action-icon-size);
    display: block;
  }

  [part='action']:focus-visible {
    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
    outline-offset: var(--dads-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    background-color: var(--dads-chip-tag-focus-text-element-bg);
  }

  :host([action='none']) [part='action'] {
    display: none;
  }

  :host([action='none']) [part='base'] {
    cursor: pointer;
  }

  @media (forced-colors: active) {
    [part='start-icon']::slotted(*),
    [part='action-icon']::slotted(*) {
      fill: CanvasText;
    }
  }
`;
