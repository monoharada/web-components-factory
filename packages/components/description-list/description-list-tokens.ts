/**
 * 説明リスト（Description List）用デザイントークン
 *
 * - セマンティックトークン（意味層） -> ローカルトークン（--dads-* API） -> プロパティ
 * - light DOM（shadowOptions: null）で使うため、タグ名でスコープを切る
 */

import { css } from '../../core/web-components.js';

export function createDescriptionListTokens(tagName: string): CSSStyleSheet {
  const semanticTokensText = `
    ${tagName} {
      /* Spacing / Layout */
      --description-list-margin-block: var(--spacing-4, 16px);
      --description-list-item-gap: var(--spacing-2, 8px);
      --description-list-indent: var(--spacing-8, 32px);

      /* Typography */
      --description-list-term-font-weight: var(--font-weight-700, 700);
      --description-list-overflow-wrap: anywhere;

      /* Marker */
      --description-list-marker-type: none;
    }

    ${tagName}:is([marker='bullet'], [data-marker='bullet']) {
      --description-list-marker-type: disc;
    }
  `;

  const localTokensText = `
    ${tagName} {
      --dads-description-list-margin-block: var(--description-list-margin-block);
      --dads-description-list-item-gap: var(--description-list-item-gap);
      --dads-description-list-indent: var(--description-list-indent);
      --dads-description-list-term-font-weight: var(--description-list-term-font-weight);
      --dads-description-list-overflow-wrap: var(--description-list-overflow-wrap);
      --dads-description-list-marker-type: var(--description-list-marker-type);
    }
  `;

  return css`
    ${semanticTokensText}
    ${localTokensText}
  `;
}
