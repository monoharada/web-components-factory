/**
 * 箇条書きリスト（List / List Item）用スタイル定義
 */

import { css } from '../../core/web-components.js';

export const listStyles = css`
  :host {
    display: block;
    font: inherit;
    color: inherit;
  }

  [part='base'] {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    row-gap: var(--dads-list-item-gap);
    padding-inline-start: var(--dads-list-indent);
  }
`;

export const listItemStyles = css`
  :host {
    display: block;
    font: inherit;
    color: inherit;
  }

  [part='item'] {
    display: var(--_dads-list-item-display);
    position: var(--_dads-list-item-position);
    grid-template-columns: var(--_dads-list-marker-width) minmax(0, 1fr);
    column-gap: var(--_dads-list-marker-gap);
  }

  [part='marker'] {
    position: var(--_dads-list-marker-position);
    inset-inline-start: var(--_dads-list-marker-inset-inline-start);
    inset-block-start: var(--_dads-list-marker-inset-block-start);
    color: var(--_dads-list-marker-color);
    line-height: var(--_dads-list-marker-line-height);
    text-align: var(--_dads-list-marker-text-align);
  }

  [part='marker-glyph'] {
    font-size: var(--_dads-list-marker-size);
    color: var(--_dads-list-marker-color);
  }

  [part='marker-glyph']::before {
    content: var(--_dads-list-marker-content);
    white-space: pre;
  }

  [part='marker'] slot[name='marker'] {
    display: var(--_dads-list-marker-slot-display);
  }

  [part='content'] {
    min-inline-size: 0;
  }

  [part='content'] > slot {
    display: flex;
    flex-direction: column;
    row-gap: var(--_dads-list-item-gap);
  }

  ::slotted(p),
  ::slotted(ul),
  ::slotted(ol),
  ::slotted(dl),
  ::slotted(blockquote),
  ::slotted(figure) {
    margin: 0;
  }

  ::slotted(dads-list) {
    margin: 0;
  }

  @media (forced-colors: active) {
    :host {
      --dads-list-marker-color: CanvasText;
    }
  }
`;
