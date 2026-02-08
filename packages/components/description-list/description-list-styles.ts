/**
 * 説明リスト（Description List）用スタイル定義
 *
 * DADS HTML 実装の構造を light DOM 用に適用する。
 */

import { css } from '../../core/web-components.js';

export function createDescriptionListStyles(tagName: string): CSSStyleSheet {
  const baseSelector = '> dl[data-dads-description-list-base]';
  return css`
    ${tagName} {
      margin-block: var(--dads-description-list-margin-block);
      display: block;
      font: inherit;
      color: inherit;
    }

    ${tagName} ${baseSelector} {
      margin: 0;
      padding: 0;
      display: grid;
      row-gap: var(--dads-description-list-item-gap);
      overflow-wrap: var(--dads-description-list-overflow-wrap);
    }

    ${tagName} ${baseSelector} dt {
      font-weight: var(--dads-description-list-term-font-weight);
    }

    ${tagName} ${baseSelector} dd {
      margin-inline-start: var(--dads-description-list-indent);
    }

    ${tagName}:is([marker='bullet'], [data-marker='bullet']) ${baseSelector} dt {
      margin-inline-start: var(--dads-description-list-indent);
      display: list-item;
      list-style-type: var(--dads-description-list-marker-type);
    }

    ${tagName}:is([marker='custom'], [data-marker='custom']) ${baseSelector} dt > span:first-child {
      display: inline-block;
      min-inline-size: var(--dads-description-list-indent);
    }
  `;
}
