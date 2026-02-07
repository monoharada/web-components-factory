/**
 * 箇条書きリスト（List / List Item）用デザイントークン
 */
import { css } from '../../core/web-components.js';
export const listTokens = css `
  :host {
    /* Item spacing (DADS: 12 / 8 / 4) */
    --list-item-gap-lg: var(--spacing-3, 12px);
    --list-item-gap-md: var(--spacing-2, 8px);
    --list-item-gap-sm: var(--spacing-1, 4px);
    --list-item-gap: var(--list-item-gap-md);

    /* Marker */
    --list-marker-width: auto;
    --list-marker-gap: var(--spacing-2, 8px);
    --list-marker-color: var(--color-neutral-solid-gray-800, #333333);
    --list-marker-size: 6px;
    --list-marker-slot-display: none;

    /* Indentation */
    --list-indent: 0px;

    /* Public API */
    --dads-list-indent: var(--list-indent);
    --dads-list-item-gap: var(--list-item-gap);
    --dads-list-marker-width: var(--list-marker-width);
    --dads-list-marker-gap: var(--list-marker-gap);
    --dads-list-marker-color: var(--list-marker-color);
    --dads-list-marker-size: var(--list-marker-size);
    --dads-list-marker-slot-display: var(--list-marker-slot-display);

    /* Item layout mode (nearest dads-list controls dads-list-item rendering) */
    --dads-list-item-display: block;
    --dads-list-item-position: relative;
    --dads-list-marker-position: absolute;
    --dads-list-marker-inset-inline-start: calc(-1 * (var(--list-marker-gap) + var(--list-marker-size)));
    --dads-list-marker-inset-block-start: 0;
    --dads-list-marker-line-height: 1;
    --dads-list-marker-text-align: start;

    /* Marker glyphs (3種) - override points */
    --dads-list-marker-content-1: '●';
    --dads-list-marker-content-2: '○';
    --dads-list-marker-content-3: '■';
    --dads-list-marker-content: normal;
  }

  :host([variant='number']) {
    --list-marker-width: 2em;
    --list-marker-slot-display: inline;
    --dads-list-item-display: grid;
    --dads-list-item-position: static;
    --dads-list-marker-position: static;
    --dads-list-marker-inset-inline-start: auto;
    --dads-list-marker-inset-block-start: auto;
    --dads-list-marker-line-height: 1em;
    --dads-list-marker-text-align: end;
  }

  :host([spacing='lg']) {
    --list-item-gap: var(--list-item-gap-lg);
  }
  :host([spacing='md']) {
    --list-item-gap: var(--list-item-gap-md);
  }
  :host([spacing='sm']) {
    --list-item-gap: var(--list-item-gap-sm);
  }

  :host([variant='marker'][data-depth='1']) {
    --list-indent: 0px;
    --dads-list-marker-content: var(--dads-list-marker-content-1);
  }
  :host([variant='marker'][data-depth='2']) {
    --list-indent: var(--spacing-4, 16px);
    --dads-list-marker-content: var(--dads-list-marker-content-2);
  }
  :host([variant='marker'][data-depth='3']) {
    --list-indent: var(--spacing-6, 24px);
    --dads-list-marker-content: var(--dads-list-marker-content-2);
  }
  :host([variant='marker'][data-depth='4']) {
    --list-indent: var(--spacing-8, 32px);
    --dads-list-marker-content: var(--dads-list-marker-content-2);
  }
  :host([variant='marker'][data-depth='5']) {
    --list-indent: var(--spacing-12, 48px);
    --dads-list-marker-content: var(--dads-list-marker-content-3);
  }
  :host([variant='marker'][data-depth='6']) {
    --list-indent: var(--spacing-14, 56px);
    --dads-list-marker-content: var(--dads-list-marker-content-3);
  }

  :host([variant='number'][data-depth='1']) {
    --list-indent: 0px;
  }
  :host([variant='number'][data-depth='2']) {
    --list-indent: var(--spacing-4, 16px);
  }
  :host([variant='number'][data-depth='3']) {
    --list-indent: var(--spacing-6, 24px);
  }
  :host([variant='number'][data-depth='4']) {
    --list-indent: var(--spacing-8, 32px);
  }
  :host([variant='number'][data-depth='5']) {
    --list-indent: var(--spacing-12, 48px);
  }
`;
/**
 * List Item 側のフォールバックトークン（単体利用時の既定）
 */
export const listItemTokens = css `
  :host {
    --_dads-list-item-gap: var(--dads-list-item-gap, var(--spacing-2, 8px));
    --_dads-list-item-display: var(--dads-list-item-display, block);
    --_dads-list-item-position: var(--dads-list-item-position, relative);
    --_dads-list-marker-width: var(--dads-list-marker-width, auto);
    --_dads-list-marker-gap: var(--dads-list-marker-gap, var(--spacing-2, 8px));
    --_dads-list-marker-color: var(--dads-list-marker-color, currentColor);
    --_dads-list-marker-size: var(--dads-list-marker-size, 6px);
    --_dads-list-marker-content: var(--dads-list-marker-content, normal);
    --_dads-list-marker-slot-display: var(--dads-list-marker-slot-display, none);
    --_dads-list-marker-position: var(--dads-list-marker-position, absolute);
    --_dads-list-marker-inset-inline-start:
      var(--dads-list-marker-inset-inline-start, calc(-1 * (var(--_dads-list-marker-gap) + var(--_dads-list-marker-size))));
    --_dads-list-marker-inset-block-start: var(--dads-list-marker-inset-block-start, 0);
    --_dads-list-marker-line-height: var(--dads-list-marker-line-height, 1);
    --_dads-list-marker-text-align: var(--dads-list-marker-text-align, start);
  }
`;
