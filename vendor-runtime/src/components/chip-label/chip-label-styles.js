/**
 * チップラベルコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）HTML版 chip-label.css をShadow DOM向けに移植
 */
import { css } from '../../core/web-components.js';
export const chipLabelStyles = css `
  :host {
    display: inline-block;
    --chip-label-padding-block: var(--dads-chip-label-padding-block, 3px);
    --chip-label-padding-inline: var(--dads-chip-label-padding-inline, 7px);
    --chip-label-padding: var(--chip-label-padding-block) var(--chip-label-padding-inline);
  }

  [part='base'] {
    display: inline-grid;
    grid-template-columns: auto auto;
    align-items: center;
    align-content: center;
    box-sizing: border-box;
    min-height: var(--dads-chip-label-min-height, var(--spacing-8, 2rem));
    border-radius: var(--dads-chip-label-border-radius, var(--spacing-2, 0.5rem));
    padding: var(--dads-chip-label-padding, var(--chip-label-padding));
    font-family: var(--font-family-sans);
    font-weight: var(--dads-chip-label-font-weight, 400);
    font-size: var(--dads-chip-label-font-size, var(--font-size-16, 1rem));
    line-height: var(--dads-chip-label-line-height, 1);
    letter-spacing: var(--dads-chip-label-letter-spacing, 0.02em);
    overflow-wrap: anywhere;
  }

  :host([variant='text']) [part='base'] {
    padding: var(
      --dads-chip-label-padding-text,
      var(--spacing-1, 0.25rem) var(--spacing-2, 0.5rem)
    );
    color: var(--_text, #000);
  }

  :host([variant='outline']) [part='base'] {
    border: 1px solid var(--_non-text, #000);
    color: var(--_text, #000);
  }

  :host([variant='filled-outline']) [part='base'] {
    border: 1px solid var(--_non-text, #000);
    background-color: var(--_bg, #eee);
    color: var(--_text-dark, #000);
  }

  :host([variant='fill']) [part='base'] {
    border: 1px solid transparent;
    background-color: var(--_non-text, #000);
    color: var(--color-neutral-white, #fff);
  }

  :host([color='gray']) {
    --_non-text: var(--color-neutral-solid-gray-700);
    --_bg: var(--color-neutral-solid-gray-50);
    --_text: var(--color-neutral-solid-gray-800);
    --_text-dark: var(--color-neutral-solid-gray-800);
  }

  :host([color='blue']) {
    --_non-text: var(--color-primitive-blue-700);
    --_bg: var(--color-primitive-blue-50);
    --_text: var(--color-primitive-blue-700);
    --_text-dark: var(--color-primitive-blue-800);
  }

  :host([color='light-blue']) {
    --_non-text: var(--color-primitive-light-blue-800);
    --_bg: var(--color-primitive-light-blue-50);
    --_text: var(--color-primitive-light-blue-800);
    --_text-dark: var(--color-primitive-light-blue-900);
  }

  :host([color='cyan']) {
    --_non-text: var(--color-primitive-cyan-900);
    --_bg: var(--color-primitive-cyan-50);
    --_text: var(--color-primitive-cyan-900);
    --_text-dark: var(--color-primitive-cyan-1000);
  }

  :host([color='green']) {
    --_non-text: var(--color-primitive-green-800);
    --_bg: var(--color-primitive-green-50);
    --_text: var(--color-primitive-green-800);
    --_text-dark: var(--color-primitive-green-900);
  }

  :host([color='lime']) {
    --_non-text: var(--color-primitive-lime-900);
    --_bg: var(--color-primitive-lime-50);
    --_text: var(--color-primitive-lime-900);
    --_text-dark: var(--color-primitive-lime-1000);
  }

  :host([color='yellow']) {
    --_non-text: var(--color-primitive-yellow-1000);
    --_bg: var(--color-primitive-yellow-50);
    --_text: var(--color-primitive-yellow-1000);
    --_text-dark: var(--color-primitive-yellow-1100);
  }

  :host([color='orange']) {
    --_non-text: var(--color-primitive-orange-900);
    --_bg: var(--color-primitive-orange-50);
    --_text: var(--color-primitive-orange-900);
    --_text-dark: var(--color-primitive-orange-1000);
  }

  :host([color='red']) {
    --_non-text: var(--color-primitive-red-900);
    --_bg: var(--color-primitive-red-50);
    --_text: var(--color-primitive-red-900);
    --_text-dark: var(--color-primitive-red-1000);
  }

  :host([color='magenta']) {
    --_non-text: var(--color-primitive-magenta-800);
    --_bg: var(--color-primitive-magenta-50);
    --_text: var(--color-primitive-magenta-800);
    --_text-dark: var(--color-primitive-magenta-900);
  }

  :host([color='purple']) {
    --_non-text: var(--color-primitive-purple-800);
    --_bg: var(--color-primitive-purple-50);
    --_text: var(--color-primitive-purple-800);
    --_text-dark: var(--color-primitive-purple-800);
  }

  [part='icon'] {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  [part='icon']::slotted(*) {
    margin-right: var(--dads-chip-label-icon-gap, var(--spacing-1, 0.25rem));
    display: block;
  }

  @media (forced-colors: active) {
    [part='icon']::slotted(*) {
      fill: CanvasText;
    }
  }

  :host([variant='filled-outline']) [part='icon']::slotted(*) {
    color: var(--_non-text, #000);
  }
`;
