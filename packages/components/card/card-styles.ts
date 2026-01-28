/**
 * カードコンポーネント用スタイル定義
 * デジタル庁デザインシステムに準拠
 */
import { css } from '../../core/web-components.js';

export const cardStyles = css`
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

  [part="media-body"] {
    min-width: 0;
    aspect-ratio: var(--dads-card-media-aspect-ratio);
  }

  [part="media-body"] ::slotted(img),
  [part="media-body"] ::slotted(video) {
    display: block;
    width: 100%;
    height: auto;
  }

  /* Overlay: label / function (optional) */
  [part="media-overlay"] {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: var(--dads-card-padding-block) var(--dads-card-padding-inline);
    gap: var(--dads-card-gap);
    pointer-events: none;
  }

  [part="media-label"],
  [part="media-function"] {
    pointer-events: auto;
  }

  [part="main"] {
    grid-area: main;
    min-width: 0;
    padding: var(--dads-card-padding-block) var(--dads-card-padding-inline);
    display: grid;
    gap: var(--dads-card-gap);
    align-content: start;
  }

  [part="main-header"] {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--dads-card-gap);
    min-width: 0;
  }

  [part="main-heading"] {
    display: grid;
    gap: calc(var(--dads-card-gap) / 2);
    min-width: 0;
  }

  [part="title"] {
    min-width: 0;
  }

  #title-slot::slotted(*) {
    margin: 0;
    min-width: 0;
    color: var(--dads-card-title-color);
    font-weight: var(--dads-card-title-font-weight);
    font-size: var(--dads-card-title-font-size);
    line-height: var(--dads-card-title-line-height);
    text-decoration-line: none;
  }

  /* DADS: underline title when clickable */
  :host([data-title-clickable]) #title-slot::slotted(*) {
    text-decoration-line: underline;
    text-decoration-thickness: var(--dads-card-title-underline-thickness);
    text-underline-offset: var(--dads-card-title-underline-offset);
  }

  @media (any-hover: hover) {
    :host([data-title-clickable]:not([data-suppress-title-hover]))
      [part="base"]:hover
      #title-slot::slotted(*) {
      text-decoration-thickness: var(--dads-card-title-underline-thickness-hover);
    }
  }

  /* Content & labels */
  #main-label-slot::slotted(*),
  #sub-label-slot::slotted(*) {
    margin: 0;
    min-width: 0;
  }

  #content-slot::slotted(*),
  #sub-slot::slotted(*) {
    margin: 0;
    min-width: 0;
  }

  /* Prevent default margins inside common text nodes */
  #content-slot::slotted(p),
  #sub-slot::slotted(p),
  #content-slot::slotted(ul),
  #sub-slot::slotted(ul),
  #content-slot::slotted(ol),
  #sub-slot::slotted(ol),
  #content-slot::slotted(dl),
  #sub-slot::slotted(dl) {
    margin: 0;
    padding: 0;
  }

  /* Function slots: align to edge */
  [part="main-function"],
  [part="sub-function"] {
    flex-shrink: 0;
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

  [part="sub-header"] {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--dads-card-gap);
    min-width: 0;
  }

  /* ========== Focus ring (delegate mode) ========== */
  :host([data-dads-card-delegate][data-primary-focus]) [part="base"] {
    outline: var(--dads-card-focus-outline-width) solid var(--dads-card-focus-outline-color);
    outline-offset: var(--dads-card-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-card-focus-ring-width) var(--dads-card-focus-ring-color);
  }
`;
