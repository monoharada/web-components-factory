/**
 * Combobox コンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';
export const comboboxStyles = css `
  :host {
    display: block;
    position: relative;
    font-family: var(--font-family-sans);
    color: var(--dads-combobox-text-color);
  }

  [part='wrapper'] {
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
    display: flex;
    align-items: center;
    gap: var(--spacing-2, 0.5rem);
    min-height: var(--dads-combobox-control-height);
    border: var(--dads-combobox-border-width) solid var(--dads-combobox-border-color);
    border-radius: var(--dads-combobox-border-radius);
    background: var(--dads-combobox-background);
    padding-block: var(--dads-combobox-padding-y);
    padding-inline: var(--dads-combobox-padding-inline);
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

  [part='chip-list'] {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--spacing-1, 0.25rem);
  }

  [part='chip'] {
    display: inline-flex;
    align-items: center;
    min-height: 1.5rem;
    border: 1px solid var(--dads-combobox-chip-border-color);
    border-radius: 9999px;
    background: var(--dads-combobox-chip-bg);
    color: var(--dads-combobox-chip-color);
    font-size: 0.875rem;
    padding: 0 0.5rem;
  }

  [part='input'] {
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--dads-combobox-text-color);
    font-size: var(--dads-combobox-font-size);
    line-height: var(--line-height-170);
    font-family: var(--font-family-sans);
    padding: 0;
  }

  [part='input']::placeholder {
    color: var(--dads-combobox-placeholder-color);
  }

  [part='input']:disabled {
    cursor: not-allowed;
  }

  [part='indicator'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--dads-combobox-indicator-size);
    height: var(--dads-combobox-indicator-size);
    color: currentColor;
    background: transparent;
    border: none;
    padding: 0;
    flex-shrink: 0;
  }

  [part='listbox'] {
    display: block;
    max-height: var(--dads-combobox-list-max-height);
    overflow: auto;
    border: var(--dads-combobox-border-width) solid var(--dads-combobox-border-color);
    border-radius: var(--dads-combobox-border-radius);
    background: var(--dads-combobox-background);
    box-shadow: var(--dads-combobox-list-shadow);
  }

  [part='listbox'][hidden] {
    display: none;
  }

  [part='option'] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-2, 0.5rem);
    width: 100%;
    border: 0;
    border-bottom: 1px solid var(--color-neutral-solid-gray-100, #d9d9d9);
    background: transparent;
    color: inherit;
    text-align: left;
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-size: var(--dads-combobox-font-size);
    line-height: var(--line-height-150);
  }

  [part='option']:last-child {
    border-bottom: none;
  }

  [part='option'][data-active='true'] {
    background: var(--dads-combobox-option-active-bg);
  }

  [part='option'][aria-selected='true'] {
    background: var(--dads-combobox-option-selected-bg);
    color: var(--dads-combobox-option-selected-color);
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
  }

  [part='option-meta'] {
    font-size: 0.875rem;
    color: var(--color-neutral-solid-gray-600, #666666);
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
