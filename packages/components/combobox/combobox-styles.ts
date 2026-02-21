/**
 * Combobox コンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const comboboxStyles = css`
  :host {
    display: block;
    position: relative;
    font-family: var(--font-family-sans);
    color: var(--dads-combobox-text-color);
  }

  [part='wrapper'] {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--combobox-gap);
  }

  [part='label'] {
    display: flex;
    align-items: baseline;
    gap: 0;
    font-size: var(--dads-combobox-label-size);
    font-weight: var(--dads-combobox-label-weight);
    color: var(--dads-combobox-label-color);
    line-height: var(--line-height-150);
  }

  [part='label-text'] {
    display: contents;
  }

  [part='requirement'] {
    margin-left: var(--spacing-1, 0.25rem);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    color: var(--dads-combobox-required-color);
  }

  [part='support-text'] {
    color: var(--dads-combobox-support-color);
    line-height: var(--line-height-150);
  }

  [part='control'] {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: var(--combobox-gap);
    height: var(--dads-combobox-control-height);
    border: var(--dads-combobox-border-width) solid var(--dads-combobox-border-color);
    border-radius: var(--dads-combobox-border-radius);
    background: var(--dads-combobox-background);
    padding-block: var(--dads-combobox-padding-y);
    padding-inline: var(--dads-combobox-padding-inline);
    transition: border-color 0.16s ease;
  }

  @media (any-hover: hover) {
    :host(:not([disabled])) [part='control']:hover {
      --dads-combobox-border-color: var(--combobox-border-color-hover);
    }
  }

  :host([disabled]) [part='control'] {
    --dads-combobox-background: var(--combobox-bg-disabled);
    --dads-combobox-border-color: var(--combobox-border-color-disabled);
    --dads-combobox-text-color: var(--combobox-text-color-disabled);
    cursor: not-allowed;
  }

  :host(:not([disabled])) [part='control']:focus-within {
    border-color: var(--combobox-border-color-focus);
    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
    outline-offset: var(--dads-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
  }

  :host([error]:not([disabled])) [part='control']:focus-within {
    border-color: var(--combobox-border-color-error);
  }

  :host [part='control'] [part='input']:focus-visible {
    outline: none;
    box-shadow: none;
  }

  :host [part='control'] [part='input']:focus {
    outline: none;
    box-shadow: none;
  }

  [part='chip-list'] {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--spacing-1, 0.25rem);
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1 1 auto;
    order: 1;
  }

  [part='chip-item'] {
    display: inline-flex;
  }

  [part='chip-list'][hidden] {
    display: none;
  }

  :host([mode='multiple']) [part='control'] {
    align-items: flex-start;
    gap: var(--spacing-2, 0.5rem);
    min-height: var(--dads-combobox-control-height);
    height: auto;
  }

  :host([mode='multiple']) [part='indicator'] {
    align-self: flex-start;
  }

  :host([mode='multiple']) [part='chip-list'] {
    order: 1;
  }

  :host([mode='multiple']) [part='input'] {
    order: 2;
    flex: 1 1 8ch;
    min-width: 6ch;
  }

  :host([mode='multiple']) [part='control'][data-has-chip] [part='input'],
  :host([mode='single']) [part='control'][data-has-chip] [part='input'] {
    flex: 0 0 0.0625rem;
    min-width: 0;
    max-width: 0.0625rem;
    opacity: 0;
  }

  [part='input'] {
    flex: 1 1 auto;
    min-width: 0;
    order: 2;
    border: none;
    outline: none;
    background: transparent;
    color: var(--dads-combobox-text-color);
    font-size: var(--dads-combobox-font-size);
    line-height: 1;
    font-family: var(--font-family-sans);
    padding: 0;
    text-align: left;
  }

  [part='input']::placeholder {
    color: var(--dads-combobox-text-color);
  }

  [part='input']:disabled {
    cursor: not-allowed;
  }

  [part='indicator'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    order: 0;
    width: var(--dads-combobox-indicator-size);
    height: var(--dads-combobox-indicator-size);
    color: var(--dads-combobox-indicator-border-color);
    background: var(--dads-combobox-indicator-background);
    border: 1px solid var(--dads-combobox-indicator-border-color);
    border-radius: var(--dads-combobox-indicator-radius);
    padding: 0;
    flex-shrink: 0;
  }

  [part='indicator'] svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  :host([disabled]) [part='indicator'] {
    color: var(--combobox-border-color-disabled);
    border-color: var(--combobox-border-color-disabled);
    background: var(--combobox-bg-disabled);
  }

  :host([open]) [part='indicator'] svg {
    transform: rotate(180deg);
  }

  [part='panel'] {
    position: absolute;
    inset-inline: 0;
    top: calc(var(--dads-combobox-control-bottom, 0px) + var(--spacing-2, 0.5rem));
    z-index: var(--dads-combobox-list-z-index, 10);
    border: var(--dads-combobox-border-width) solid var(--dads-combobox-border-color);
    border-radius: var(--dads-combobox-border-radius);
    background: var(--dads-combobox-background);
    box-shadow: var(--dads-combobox-list-shadow);
    overflow: hidden;
  }

  [part='listbox'] {
    display: block;
    max-height: var(--dads-combobox-list-max-height);
    overflow: auto;
    background: var(--dads-combobox-background);
  }

  [part='search-box'] {
    position: relative;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-solid-gray-420, #949494);
    padding: var(--spacing-4, 1rem);
    background: var(--dads-combobox-background);
  }

  [part='search-icon'] {
    position: absolute;
    left: calc(var(--spacing-4, 1rem) + var(--spacing-3, 0.75rem));
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-neutral-solid-gray-420, #949494);
    pointer-events: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  [part='search-input'] {
    box-sizing: border-box;
    width: 100%;
    min-height: 3.5rem;
    border: 1px solid var(--dads-combobox-border-color);
    border-radius: var(--dads-combobox-border-radius);
    background: var(--dads-combobox-background);
    color: var(--dads-combobox-text-color);
    font-size: var(--font-size-16, 1rem);
    font-family: var(--font-family-sans);
    padding-inline: var(--spacing-4, 1rem);
    padding-inline-start: 2.75rem;
  }

  [part='search-input']:focus-visible {
    border-color: var(--combobox-border-color-focus);
    outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
    outline-offset: var(--dads-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
  }

  [part='listbox'][hidden] {
    display: none;
  }

  [part='option'] {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-2, 0.5rem);
    min-height: var(--dads-combobox-option-min-height);
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--dads-combobox-option-divider-color);
    background: transparent;
    color: inherit;
    text-align: left;
    padding-block: var(--dads-combobox-option-padding-y);
    padding-inline: var(--dads-combobox-option-padding-inline);
    cursor: pointer;
    font-size: var(--dads-combobox-font-size);
    line-height: var(--line-height-150);
  }

  [part='option']:last-child {
    border-bottom: none;
  }

  [part='option'][data-active='true'] {
    background: var(--dads-combobox-option-hover-bg);
    box-shadow: inset 0 0 0 1px var(--dads-focus-ring-color);
  }

  [part='option'][aria-selected='true'] {
    background: var(--dads-combobox-option-selected-bg);
    color: inherit;
  }

  :host([mode='multiple']) [part='option'][aria-selected='true'] [part='option-label'] {
    font-weight: var(--font-weight-700, 700);
  }

  @media (any-hover: hover) {
    [part='option']:hover {
      background: var(--dads-combobox-option-hover-bg);
    }
  }

  [part='option'][aria-disabled='true'] {
    cursor: not-allowed;
    color: var(--combobox-text-color-disabled);
  }

  [part='option-label'] {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-1, 0.25rem);
    min-width: 0;
    white-space: normal;
  }

  [part='option-meta'] {
    font-size: var(--font-size-16, 1rem);
    color: var(--color-neutral-solid-gray-600, #666666);
    line-height: var(--line-height-170);
  }

  [part='option-check'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
  }

  [part='option-check']::before {
    content: '';
    box-sizing: border-box;
    width: var(--dads-combobox-multi-check-size);
    height: var(--dads-combobox-multi-check-size);
    border: 2px solid var(--color-neutral-solid-gray-600, #666666);
    border-radius: var(--dads-combobox-multi-check-radius);
    background: var(--color-neutral-white, #ffffff);
  }

  :host([mode='multiple']) [part='option'][aria-selected='true'] [part='option-check']::before {
    background: var(--color-primitive-blue-900, #0017c1);
    border-color: var(--color-primitive-blue-900, #0017c1);
  }

  :host([mode='multiple']) [part='option'][aria-selected='true'] [part='option-check']::after {
    content: '✓';
    position: absolute;
    color: var(--color-neutral-white, #ffffff);
    font-size: 1rem;
    font-weight: var(--font-weight-700, 700);
    line-height: 1;
  }

  [part='option-match'] {
    font-weight: var(--font-weight-700, 700);
  }

  [part='empty'] {
    padding: 0.75rem 1rem;
    color: var(--color-neutral-solid-gray-600, #666666);
  }

  [part='error-text'] {
    color: var(--dads-combobox-error-color);
    line-height: var(--line-height-150);
  }

  :host([error]) [part='control'] {
    --dads-combobox-border-color: var(--combobox-border-color-error);
  }
`;
