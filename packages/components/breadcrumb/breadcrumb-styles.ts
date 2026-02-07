import { css } from '../../core/web-components.js';

export const breadcrumbStyles = css`
  :host {
    display: block;
  }

  [part='nav'] {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: var(--dads-breadcrumb-label-gap);
    row-gap: var(--dads-breadcrumb-row-gap);
  }

  [part='label'] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  :host([show-label]) [part='label'] {
    display: inline-flex;
    align-items: center;
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
    color: var(--dads-breadcrumb-color);
    font-family: var(--dads-breadcrumb-font-family);
    font-size: var(--dads-breadcrumb-font-size);
    font-weight: var(--dads-breadcrumb-font-weight);
    line-height: var(--dads-breadcrumb-line-height);
    letter-spacing: var(--dads-breadcrumb-letter-spacing);
  }

  :host([show-label]) [part='label']::after {
    content: '：';
    margin-inline-start: var(--dads-breadcrumb-label-suffix-gap);
  }

  [part='list'] {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: var(--dads-breadcrumb-list-unit-gap);
    row-gap: var(--dads-breadcrumb-row-gap);
    color: var(--dads-breadcrumb-color);
    font-family: var(--dads-breadcrumb-font-family);
    font-size: var(--dads-breadcrumb-font-size);
    font-weight: var(--dads-breadcrumb-font-weight);
    line-height: var(--dads-breadcrumb-line-height);
    letter-spacing: var(--dads-breadcrumb-letter-spacing);
  }

  ::slotted(*) {
    display: inline;
  }
`;

export const breadcrumbItemStyles = css`
  :host {
    display: inline;
    color: var(--dads-breadcrumb-color);
    font-family: var(--dads-breadcrumb-font-family);
    font-size: var(--dads-breadcrumb-font-size);
    font-weight: var(--dads-breadcrumb-font-weight);
    line-height: var(--dads-breadcrumb-line-height);
    letter-spacing: var(--dads-breadcrumb-letter-spacing);
  }

  [part='item'] {
    display: inline-flex;
    align-items: center;
    min-height: var(--dads-breadcrumb-home-icon-size);
    overflow-wrap: anywhere;
  }

  [part='home-icon'] {
    display: inline-flex;
    align-items: center;
    width: var(--dads-breadcrumb-home-icon-size);
    height: var(--dads-breadcrumb-home-icon-size);
    margin-right: var(--dads-breadcrumb-list-item-gap);
  }

  [part='home-icon'] svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  [part='home-icon'][hidden] {
    display: none;
  }

  [part='link'] {
    color: var(--dads-breadcrumb-link-color);
    text-decoration: underline;
    text-underline-offset: var(--dads-breadcrumb-link-underline-offset);
    text-decoration-thickness: var(--dads-breadcrumb-link-underline-thickness);
  }

  @media (any-hover: hover) {
    [part='link']:hover {
      color: var(--dads-breadcrumb-link-color-hover);
      text-decoration-thickness: var(--dads-breadcrumb-link-underline-thickness-hover);
    }
  }

  [part='link']:active {
    color: var(--dads-breadcrumb-link-color-active);
    text-decoration-thickness: var(--dads-breadcrumb-link-underline-thickness);
  }

  [part='link'][hidden] {
    display: none;
  }

  [part='current'] {
    color: var(--dads-breadcrumb-current-color);
    letter-spacing: var(--dads-breadcrumb-current-letter-spacing);
  }

  [part='current'][hidden] {
    display: none;
  }

  [part='separator'] {
    display: inline-flex;
    align-items: center;
    line-height: 1;
    margin-inline-start: var(--dads-breadcrumb-separator-gap-start);
    color: var(--dads-breadcrumb-separator-color);
  }

  [part='separator-icon'] {
    display: block;
    width: var(--dads-breadcrumb-separator-size);
    height: var(--dads-breadcrumb-separator-size);
    margin-inline: 0;
    flex-shrink: 0;
  }

  [part='separator-icon'][hidden] {
    display: none;
  }

  [part='separator-text'] {
    display: inline-block;
    font-size: var(--dads-breadcrumb-font-size);
    line-height: 1;
    letter-spacing: 0;
  }

  [part='separator-text'][hidden] {
    display: none;
  }

  [part='separator'][hidden] {
    display: none;
  }
`;
