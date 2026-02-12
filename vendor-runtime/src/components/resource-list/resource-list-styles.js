/**
 * Resource List コンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const resourceListStyles = css `
  :host {
    display: block;
    --_dads-resource-list-body-background: var(--dads-resource-list-background);
    --_dads-resource-list-action-background: var(--dads-resource-list-background);
    --_dads-resource-list-color: var(--dads-resource-list-color);
    --_dads-resource-list-border-color: var(--dads-resource-list-border-color);
    --_dads-resource-list-title-color: var(--dads-resource-list-title-color);
    --_dads-resource-list-whole-outline-width: var(--dads-resource-list-focus-outline-width);
    --_dads-resource-list-outline-offset: calc(-1 / 16 * 1rem);
    --_dads-resource-list-action-end-radius: 0;
  }

  :host([data-style='frame']) {
    --_dads-resource-list-action-end-radius: var(--dads-resource-list-border-radius);
  }

  :host([data-has-action]) {
    --_dads-resource-list-whole-outline-width: var(--dads-resource-list-whole-focus-outline-width);
  }

  :host([data-selected]) {
    --_dads-resource-list-body-background: var(--dads-resource-list-background-selected);
    --_dads-resource-list-action-background: var(--dads-resource-list-background-selected);
    --_dads-resource-list-border-color: var(--dads-resource-list-border-color-selected);
  }

  :host([data-disabled]) {
    --_dads-resource-list-body-background: var(--dads-resource-list-background-disabled);
    --_dads-resource-list-action-background: var(--dads-resource-list-background-disabled);
    --_dads-resource-list-color: var(--dads-resource-list-color-disabled);
    --_dads-resource-list-border-color: var(--dads-resource-list-border-color-disabled);
    --_dads-resource-list-title-color: var(--dads-resource-list-color-disabled);
  }

  [part='base'] {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--dads-resource-list-font-family);
    font-size: var(--dads-resource-list-font-size);
    line-height: var(--dads-resource-list-line-height);
    letter-spacing: var(--dads-resource-list-letter-spacing);
    color: var(--_dads-resource-list-color);
    overflow-wrap: anywhere;
    border: 1px solid transparent;
    border-block-end-color: var(--_dads-resource-list-border-color);
  }

  :host([data-style='frame']) [part='base'] {
    border-color: var(--_dads-resource-list-border-color);
    border-radius: var(--dads-resource-list-border-radius);
  }

  [part='body'] {
    position: relative;
    z-index: 0;
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    min-inline-size: 0;
    gap: var(--dads-resource-list-gap);
    color: inherit;
    text-decoration: none;
    border-radius: inherit;
    background: var(--_dads-resource-list-body-background);
    padding: var(--dads-resource-list-padding-block) var(--dads-resource-list-padding-inline);
    outline: 0 solid transparent;
    outline-offset: var(--_dads-resource-list-outline-offset);
  }

  :host([data-has-action]) [part='body'] {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  [part='body']:focus {
    outline: var(--dads-resource-list-focus-outline-width) solid transparent;
    outline-offset: 0;
  }

  :host([data-interactive-whole]) [part='body']:focus-visible,
  :host([data-whole-link][data-primary-focus]) [part='body'] {
    z-index: 2;
    outline: var(--_dads-resource-list-whole-outline-width) solid var(--dads-resource-list-focus-outline-color);
    outline-offset: var(--_dads-resource-list-outline-offset);
    box-shadow: inset 0 0 0 var(--dads-resource-list-focus-ring-width) var(--dads-resource-list-focus-ring-color);
  }

  @media (any-hover: hover) {
    :host([data-interactive-whole]:not([data-primary-focus]):not([data-disabled])) [part='body']:hover:not(:focus-visible) {
      background: var(--dads-resource-list-hover-background);
      outline: var(--dads-resource-list-hover-outline-width) solid var(--dads-resource-list-focus-outline-color);
      outline-offset: var(--_dads-resource-list-outline-offset);
    }

    :host([data-has-control][data-interaction='inline']:not([data-disabled]):not([data-selected])) [part='body']:hover [part='control'] slot::slotted(dads-checkbox) {
      --dads-checkbox-force-hover-bg: var(--color-neutral-solid-gray-420, #949494);
      --dads-checkbox-force-border-color: var(--color-neutral-black, #000000);
    }

    :host([data-has-control][data-interaction='inline'][data-selected]:not([data-disabled])) [part='body']:hover [part='control'] slot::slotted(dads-checkbox) {
      --dads-checkbox-force-hover-bg: var(--color-neutral-solid-gray-420, #949494);
      --dads-checkbox-force-border-color: var(--color-primitive-blue-1100, #000f6b);
      --dads-checkbox-force-fill-color: var(--color-primitive-blue-1100, #000f6b);
    }

    :host([data-has-control][data-interaction='inline']:not([data-disabled]):not([data-selected])) [part='body']:hover [part='control'] slot::slotted(dads-radio) {
      --dads-radio-force-hover-bg: var(--dads-radio-hover-bg-hover, var(--color-neutral-solid-gray-420, #949494));
      --dads-radio-force-border-color: var(--color-neutral-black, #000000);
    }

    :host([data-has-control][data-interaction='inline'][data-selected]:not([data-disabled])) [part='body']:hover [part='control'] slot::slotted(dads-radio) {
      --dads-radio-force-hover-bg: var(--dads-radio-hover-bg-hover, var(--color-neutral-solid-gray-420, #949494));
      --dads-radio-force-border-color: var(--color-primitive-blue-1100, #000f6b);
      --dads-radio-force-dot-color: var(--color-primitive-blue-1100, #000f6b);
    }
  }

  [part='control'],
  [part='icon'],
  [part='label'],
  [part='support'],
  [part='sub'],
  [part='action'] {
    display: none;
    flex-shrink: 0;
  }

  :host([data-has-control]) [part='control'],
  :host([data-has-icon]) [part='icon'],
  :host([data-has-label]) [part='label'],
  :host([data-has-support]) [part='support'],
  :host([data-has-sub]) [part='sub'],
  :host([data-has-action]) [part='action'] {
    display: block;
  }

  :host([data-has-action]) [part='action'] {
    display: flex;
  }

  :host([data-has-control]) [part='control'] {
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
    min-inline-size: var(--dads-resource-list-control-hit-area);
    margin-block: calc(-1 * var(--dads-resource-list-padding-block));
    margin-inline-start: calc(-1 * var(--dads-resource-list-padding-inline));
    margin-inline-end: 0;
    padding-block: var(--dads-resource-list-padding-block);
    padding-inline: var(--dads-resource-list-padding-inline) 0;
  }

  :host([data-has-control][data-interaction='inline']:not([data-disabled])) [part='control'] {
    cursor: auto;
  }

  [part='control'] slot {
    display: contents;
  }

  [part='control'] slot::slotted(dads-checkbox),
  [part='control'] slot::slotted(dads-radio) {
    align-self: stretch;
    display: flex;
    align-items: center;
    margin: calc(-1 * var(--dads-resource-list-padding-block)) calc(-1 * var(--dads-resource-list-padding-block));
    margin-inline-end: 0;
    padding: var(--dads-resource-list-padding-block) var(--dads-resource-list-padding-inline);
    padding-inline-end: 0;
  }

  :host([data-has-icon]) [part='icon'] {
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  [part='icon'] slot {
    display: block;
    line-height: 0;
  }

  [part='icon'] slot::slotted(svg),
  [part='icon'] slot::slotted(img) {
    display: block;
  }

  [part='contents'] {
    display: none;
    width: 0;
    min-inline-size: 0;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--dads-resource-list-content-gap);
    font-size: var(--dads-resource-list-font-size);
    font-weight: 400;
    line-height: var(--dads-resource-list-line-height);
    letter-spacing: var(--dads-resource-list-letter-spacing);
  }

  :host([data-has-contents]) [part='contents'] {
    display: flex;
    justify-content: center;
  }

  [part='title'] {
    margin: 0;
    color: var(--_dads-resource-list-title-color);
    font-size: var(--dads-resource-list-title-font-size);
    font-weight: var(--dads-resource-list-title-font-weight);
    line-height: var(--dads-resource-list-title-line-height);
    letter-spacing: var(--dads-resource-list-title-letter-spacing);
  }

  [part='title'] slot::slotted(*) {
    margin: 0;
    max-inline-size: 100%;
  }

  [part='title'] slot::slotted(a) {
    color: var(--dads-resource-list-title-link-color);
    text-decoration: underline;
    text-decoration-thickness: var(--dads-resource-list-title-underline-thickness);
    text-underline-offset: var(--dads-resource-list-title-underline-offset);
  }

  [part='title'] slot::slotted(a),
  [part='title'] slot::slotted(label) {
    display: block;
    isolation: isolate;
    margin-block: calc(-8 / 16 * 1rem);
    padding-block: calc(8 / 16 * 1rem);
  }

  [part='title'] slot::slotted(a:focus) {
    outline: var(--dads-resource-list-focus-outline-width) solid transparent;
    outline-offset: 0;
  }

  :host(:not([data-whole-link])) [part='title'] slot::slotted(a:focus-visible) {
    display: block;
    margin-block: 0;
    padding-block: 0;
    border-radius: var(--border-radius-4, 0.25rem);
    outline: var(--dads-resource-list-focus-outline-width) solid var(--dads-resource-list-focus-outline-color);
    outline-offset: var(--dads-resource-list-focus-outline-offset);
    background: var(--dads-resource-list-focus-ring-color);
    box-shadow: 0 0 0 var(--dads-resource-list-focus-ring-width) var(--dads-resource-list-focus-ring-color);
  }

  :host([data-whole-link]) [part='title'] {
    color: var(--dads-resource-list-title-link-color);
    text-decoration: underline;
    text-decoration-thickness: var(--dads-resource-list-title-underline-thickness);
    text-underline-offset: var(--dads-resource-list-title-underline-offset);
  }

  @media (any-hover: hover) {
    [part='title'] slot::slotted(a:hover) {
      color: var(--dads-resource-list-title-link-color-hover);
      text-decoration-thickness: var(--dads-resource-list-title-underline-thickness-hover);
    }

    :host([data-whole-link]) [part='body']:hover:not(:focus-visible) [part='title'] {
      color: var(--dads-resource-list-title-link-color-hover);
      text-decoration-thickness: var(--dads-resource-list-title-underline-thickness-hover);
    }
  }

  [part='title'] slot::slotted(a:active) {
    color: var(--dads-resource-list-title-link-color-active);
    text-decoration-thickness: var(--dads-resource-list-title-underline-thickness);
  }

  :host([data-whole-link]) [part='body']:active [part='title'] {
    color: var(--dads-resource-list-title-link-color-active);
    text-decoration-thickness: var(--dads-resource-list-title-underline-thickness);
  }

  [part='label'] slot::slotted(*),
  [part='support'] slot::slotted(*),
  [part='sub'] slot::slotted(*) {
    margin: 0;
    max-inline-size: 100%;
  }

  [part='label'] {
    order: -1;
  }

  [part='sub'] {
    display: flex;
    align-items: center;
    white-space: nowrap;
    font-size: var(--dads-resource-list-font-size);
    line-height: var(--dads-resource-list-line-height);
    letter-spacing: var(--dads-resource-list-letter-spacing);
  }

  [part='action'] {
    position: relative;
    align-self: stretch;
    align-items: stretch;
    overflow: hidden;
    border-start-end-radius: var(--_dads-resource-list-action-end-radius);
    border-end-end-radius: var(--_dads-resource-list-action-end-radius);
    background: var(--_dads-resource-list-action-background);
    color: inherit;
  }

  :host([data-action-disabled]) [part='action'] {
    background: var(
      --dads-resource-list-background-disabled,
      var(--color-neutral-solid-gray-50, #f2f2f2)
    );
    color: var(--dads-resource-list-color-disabled, var(--color-neutral-solid-gray-420, #949494));
    pointer-events: none;
  }

  [part='action'] slot::slotted(button),
  [part='action'] slot::slotted(a) {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--dads-resource-list-action-width);
    min-inline-size: var(--dads-resource-list-action-width);
    block-size: 100%;
    border: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    border-start-end-radius: var(--_dads-resource-list-action-end-radius);
    border-end-end-radius: var(--_dads-resource-list-action-end-radius);
    background: transparent;
    color: inherit;
    line-height: 1;
    text-decoration: none;
    padding: 0;
  }

  [part='action'] slot::slotted(button:focus),
  [part='action'] slot::slotted(a:focus) {
    outline: var(--dads-resource-list-focus-outline-width) solid transparent;
    outline-offset: 0;
  }

  [part='action'] slot::slotted(button:focus-visible),
  [part='action'] slot::slotted(a:focus-visible) {
    outline: var(--dads-resource-list-focus-outline-width) solid var(--dads-resource-list-focus-outline-color);
    outline-offset: calc(-3 / 16 * 1rem);
    background: var(--dads-resource-list-focus-ring-color);
    box-shadow: none;
  }

  [part='action'] slot::slotted(button:disabled),
  [part='action'] slot::slotted([aria-disabled='true']) {
    background: transparent;
    color: inherit;
    cursor: default;
    pointer-events: none;
  }

  @media (any-hover: hover) {
    :host(:not([data-action-disabled])) [part='action']:hover {
      z-index: 2;
      background: var(--dads-resource-list-hover-background, var(--color-neutral-solid-gray-50, #f2f2f2));
      outline: var(--dads-resource-list-hover-outline-width) solid var(--dads-resource-list-focus-outline-color);
      outline-offset: var(--_dads-resource-list-outline-offset);
    }
  }

  @media (forced-colors: active) {
    :host([data-interactive-whole]) [part='body']:focus-visible,
    :host([data-whole-link][data-primary-focus]) [part='body'] {
      outline-color: ButtonText;
      box-shadow: inset 0 0 0 var(--dads-resource-list-focus-ring-width) CanvasText;
    }

    :host(:not([data-whole-link])) [part='title'] slot::slotted(a:focus-visible) {
      outline-color: ButtonText;
      box-shadow: 0 0 0 var(--dads-resource-list-focus-ring-width) ButtonText;
    }

    [part='action'] slot::slotted(button:focus-visible),
    [part='action'] slot::slotted(a:focus-visible) {
      outline-color: ButtonText;
      background: Canvas;
    }
  }
`;
