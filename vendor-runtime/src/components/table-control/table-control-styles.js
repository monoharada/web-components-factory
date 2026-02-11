/**
 * Table Control component styles
 */
import { css } from '../../core/web-components.js';
export const tableControlStyles = css `
  :host {
    display: block;
    color: var(--dads-table-control-count-color);
    font-family: var(--dads-table-control-font-family);
    font-size: var(--dads-table-control-font-size);
    letter-spacing: var(--dads-table-control-letter-spacing);
  }

  [part='base'] {
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
  }

  [part='header'],
  [part='footer'] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--dads-table-control-gap);
    inline-size: 100%;
    min-inline-size: 0;
  }

  [part='header'][hidden],
  [part='footer'][hidden] {
    display: none;
  }

  #header-leading {
    display: flex;
    align-items: center;
    gap: var(--dads-table-control-popular-gap);
    min-inline-size: 0;
    flex-wrap: wrap;
  }

  [part='search'] {
    display: flex;
    align-items: center;
    gap: var(--dads-table-control-gap);
    min-inline-size: 0;
  }

  #search-box {
    min-inline-size: var(--dads-table-control-search-min-width);
    max-inline-size: var(--dads-table-control-search-max-width);
    flex: 1 1 auto;
    --dads-search-box-gap: calc(8 / 16 * 1rem);
    --dads-search-box-border-radius: var(--border-radius-4, 0.25rem);
    --dads-search-box-border-width: 1px;
    --dads-search-box-control-min-height: calc(30 / 16 * 1rem);
    --dads-search-box-input-min-width: calc(312 / 16 * 1rem);
    --dads-search-box-input-padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem)
      calc(36 / 16 * 1rem);
    --dads-search-box-search-icon-size: calc(20 / 16 * 1rem);
  }

  #search-box::part(base) {
    gap: calc(8 / 16 * 1rem);
  }

  #search-box::part(input) {
    min-block-size: calc(30 / 16 * 1rem);
    border-radius: var(--border-radius-4, 0.25rem);
    padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
  }

  #search-box::part(search-icon) {
    inset-inline-start: calc(8 / 16 * 1rem);
    inline-size: calc(20 / 16 * 1rem);
    block-size: calc(20 / 16 * 1rem);
  }

  #search-box::part(button) {
    --dads-button-min-height: calc(30 / 16 * 1rem);
    --dads-button-padding: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
    --dads-button-font-size: var(--font-size-16, 1rem);
    --dads-button-min-width: calc(72 / 16 * 1rem);
    --dads-button-border-width: 1px;
    --dads-button-border-radius: var(--border-radius-4, 0.25rem);
  }

  [part='count'] {
    white-space: nowrap;
    color: var(--dads-table-control-count-color);
    font-weight: var(--dads-table-control-font-weight-regular);
    line-height: 1.7;
  }

  [part='reset'] {
    min-inline-size: var(--dads-table-control-reset-min-width);
    border: none;
    background: transparent;
    color: var(--dads-table-control-link-color);
    text-decoration: underline;
    text-underline-offset: .2em;
    font: inherit;
    font-weight: var(--dads-table-control-font-weight-bold);
    line-height: 1;
    cursor: pointer;
    padding: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
    border-radius: var(--border-radius-4, 0.25rem);
  }

  [part='reset'][hidden] {
    display: none;
  }

  @media (any-hover: hover) {
    [part='reset']:hover {
      color: var(--dads-table-control-link-color-hover);
    }

    [part='items-option']:hover {
      color: var(--dads-table-control-link-color-hover);
    }
  }

  [part='reset']:focus-visible,
  [part='items-option']:focus-visible {
    outline: var(--dads-table-control-focus-outline-width) solid
      var(--dads-table-control-focus-outline-color);
    outline-offset: var(--dads-table-control-focus-outline-offset);
    box-shadow: 0 0 0 var(--dads-table-control-focus-ring-width)
      var(--dads-table-control-focus-ring-color);
  }

  [part='actions'] {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    gap: var(--dads-table-control-gap);
    min-inline-size: 0;
  }

  [part='actions'][hidden] {
    display: none;
  }

  [part='actions'] ::slotted(*) {
    display: inline-flex;
    align-items: center;
  }

  [part='popular'] {
    display: flex;
    align-items: center;
    gap: var(--dads-table-control-gap);
    color: var(--table-control-muted-color);
    font-weight: var(--dads-table-control-font-weight-regular);
    line-height: 1.7;
  }

  [part='popular'][hidden] {
    display: none;
  }

  #popular-label[hidden] {
    display: none;
  }

  [part='popular'] ::slotted([slot='presets']) {
    display: inline-flex;
    align-items: center;
  }

  [part='footer'] {
    min-block-size: calc(21 / 16 * 1rem);
  }

  [part='footer'][data-pagination-position='start'] [part='pagination'] {
    order: 0;
    margin-inline-end: auto;
  }

  [part='footer'][data-pagination-position='start'] [part='items-per-page'] {
    order: 1;
  }

  [part='footer'][data-pagination-position='end'] [part='items-per-page'] {
    order: 0;
  }

  [part='footer'][data-pagination-position='end'] [part='pagination'] {
    order: 1;
    margin-inline-start: auto;
  }

  [part='items-per-page'] {
    display: flex;
    align-items: center;
    gap: var(--dads-table-control-gap);
    color: var(--table-control-muted-color);
    white-space: nowrap;
    min-inline-size: 0;
  }

  #items-options {
    display: flex;
    align-items: center;
    gap: var(--dads-table-control-items-gap);
  }

  [part='items-option'] {
    min-inline-size: var(--dads-table-control-option-min-width);
    border: none;
    background: transparent;
    color: var(--dads-table-control-link-color);
    text-decoration: underline;
    text-underline-offset: .2em;
    font: inherit;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    border-radius: var(--border-radius-4, 0.25rem);
  }

  [part='items-option'][data-active] {
    color: var(--table-control-muted-color);
    text-decoration: none;
    cursor: default;
  }

  [part='pagination'] {
    display: flex;
    align-items: center;
    min-inline-size: 0;
  }

  [part='pagination'][hidden] {
    display: none;
  }

  @media (max-width: 960px) {
    [part='header'],
    [part='footer'] {
      flex-wrap: wrap;
      align-items: flex-start;
    }

    #header-leading {
      inline-size: 100%;
      gap: var(--dads-table-control-gap);
    }

    [part='search'] {
      inline-size: 100%;
      flex-wrap: wrap;
      gap: calc(8 / 16 * 1rem) var(--dads-table-control-gap);
    }

    #search-box {
      inline-size: 100%;
      min-inline-size: 0;
      max-inline-size: 100%;
    }

    [part='actions'] {
      inline-size: 100%;
      justify-content: flex-end;
    }

    [part='popular'] {
      inline-size: 100%;
      flex-wrap: wrap;
      gap: calc(8 / 16 * 1rem) var(--dads-table-control-gap);
    }

    [part='items-per-page'] {
      flex-wrap: wrap;
      gap: calc(8 / 16 * 1rem) var(--dads-table-control-gap);
    }

    #items-options {
      gap: var(--dads-table-control-gap);
      flex-wrap: wrap;
    }
  }
`;
