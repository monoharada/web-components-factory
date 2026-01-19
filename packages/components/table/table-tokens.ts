/**
 * テーブル／データテーブル用デザイントークン
 * デジタル庁デザインシステム準拠
 *
 * - セマンティックトークン（意味層） → ローカルトークン（--dads-* API） → プロパティ
 * - light DOM（shadowOptions: null）で使うため、タグ名でスコープを切る
 */

import { css } from '../../core/web-components.js';

export function createTableTokens(tagName: string): CSSStyleSheet {
  const semanticTokensText = `
    ${tagName} {
      /* ========== セマンティックトークン（意味的な値） ========== */

      /* Border / Background */
      --table-border-color: var(--color-neutral-solid-gray-420, #949494);
      --table-border-color-strong: var(--color-neutral-solid-gray-500, #7f7f7f);
      --table-header-background: var(--color-neutral-solid-gray-100, #e6e6e6);
      --table-header-divider-color: var(--color-neutral-black, #000000);
      --table-body-background: var(--color-neutral-white, #ffffff);

      /* Row states */
      --table-row-stripe-background: var(--color-neutral-solid-gray-50, #f2f2f2);
      --table-row-hover-background: var(--color-primitive-blue-50, #e8f1fe);
      --table-row-selected-background: var(--color-primitive-blue-100, #d9e6ff);
      --table-row-selected-hover-background: var(--color-primitive-blue-200, #c5d7fb);

      /* Text */
      --table-text-color: var(--color-neutral-solid-gray-800, #333333);
      --table-header-text-color: var(--color-neutral-solid-gray-900, #1a1a1a);

      /* Typography */
      --table-font-family: var(
        --font-family-sans,
        -apple-system,
        BlinkMacSystemFont,
        'Helvetica Neue',
        'Hiragino Kaku Gothic ProN',
        'Yu Gothic',
        Meiryo,
        Arial,
        sans-serif
      );
      --table-font-size: var(--font-size-16, 1rem);
      --table-line-height: var(--line-height-170, 1.7);
      --table-line-height-dense: var(--line-height-130, 1.3);
      --table-letter-spacing: 0.02em;
      --table-font-weight: var(--font-weight-400, 400);

      /* Cell padding */
      --table-cell-padding-y-md: var(--spacing-5, 20px);
      --table-cell-padding-x-md: var(--spacing-4, 16px);
      --table-cell-padding-y-dense: var(--spacing-3, 12px);
      --table-cell-padding-x-dense: var(--spacing-4, 16px);
      --table-cell-padding-y-sm: var(--table-cell-padding-y-dense);
      --table-cell-padding-x-sm: var(--table-cell-padding-x-dense);

      /* Controls (checkbox / header buttons) */
      --table-control-focus-outline-color: var(--color-neutral-black, #000000);
      --table-control-focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
      --table-control-focus-outline-width: .25rem;
      --table-control-focus-outline-offset: .125rem;
      --table-control-focus-ring-width: .125rem;
      --table-control-border-radius: var(--border-radius-4, 0.25rem);

      /* Selection checkbox */
      --table-checkbox-size: var(--spacing-5, 20px);
      --table-checkbox-border-width: var(--spacing-0-5, 2px);
      --table-checkbox-accent-color: var(--color-primitive-blue-900, #0017c1);
      --table-checkbox-accent-hover-color: var(--color-primitive-blue-1100, #000071);
      --table-checkbox-border-color: var(--color-neutral-solid-gray-600, #666666);
      --table-checkbox-border-hover-color: var(--color-neutral-black, #000000);
      --table-checkbox-check-color: var(--color-neutral-white, #ffffff);

      /* Layout */
      --table-scroll-shadow-size: var(--spacing-6, 24px);
      --table-scroll-shadow-color: rgba(0, 0, 0, 0.4);
      --table-selection-column-width: calc(40 / 16 * 1rem);
      --table-block-gap: var(--spacing-4, 16px);

      /* Sorting */
      --table-sort-icon-size: 1.5rem;
      --table-sort-icon-gap: .25rem;
    }
  `;

  const localTokensText = `
    ${tagName} {
      /* ========== ローカルトークン（カスタマイズ用API） ========== */

      --dads-table-border-color: var(--table-border-color);
      --dads-table-border-color-strong: var(--table-border-color-strong);
      --dads-table-header-background: var(--table-header-background);
      --dads-table-header-divider-color: var(--table-header-divider-color);
      --dads-table-body-background: var(--table-body-background);

      --dads-table-row-background: var(--dads-table-body-background);
      --dads-table-row-background-stripe: var(--table-row-stripe-background);
      --dads-table-row-background-hover: var(--table-row-hover-background);
      --dads-table-row-background-selected: var(--table-row-selected-background);
      --dads-table-row-background-selected-hover: var(--table-row-selected-hover-background);

      --dads-table-text-color: var(--table-text-color);
      --dads-table-header-text-color: var(--table-header-text-color);

      --dads-table-font-family: var(--table-font-family);
      --dads-table-font-size: var(--table-font-size);
      --dads-table-line-height: var(--table-line-height);
      --dads-table-letter-spacing: var(--table-letter-spacing);
      --dads-table-font-weight: var(--table-font-weight);

      --dads-table-cell-padding-y: var(--table-cell-padding-y-md);
      --dads-table-cell-padding-x: var(--table-cell-padding-x-md);

      --dads-table-control-focus-outline-color: var(--table-control-focus-outline-color);
      --dads-table-control-focus-outline-width: var(--table-control-focus-outline-width);
      --dads-table-control-focus-outline-offset: var(--table-control-focus-outline-offset);
      --dads-table-control-focus-ring-color: var(--table-control-focus-ring-color);
      --dads-table-control-focus-ring-width: var(--table-control-focus-ring-width);
      --dads-table-control-border-radius: var(--table-control-border-radius);

      --dads-table-checkbox-size: var(--table-checkbox-size);
      --dads-table-checkbox-border-width: var(--table-checkbox-border-width);
      --dads-table-checkbox-accent-color: var(--table-checkbox-accent-color);
      --dads-table-checkbox-accent-hover-color: var(--table-checkbox-accent-hover-color);
      --dads-table-checkbox-border-color: var(--table-checkbox-border-color);
      --dads-table-checkbox-border-hover-color: var(--table-checkbox-border-hover-color);
      --dads-table-checkbox-check-color: var(--table-checkbox-check-color);

      --dads-table-scroll-shadow-size: var(--table-scroll-shadow-size);
      --dads-table-scroll-shadow-color: var(--table-scroll-shadow-color);
      --dads-table-scroll-shadow-padding: var(
        --scroll-shadow-padding,
        var(--dads-table-scroll-shadow-size)
      );
      --dads-table-selection-column-width: var(--table-selection-column-width);
      --dads-table-block-gap: var(--table-block-gap);

      --dads-table-sort-icon-size: var(--table-sort-icon-size);
      --dads-table-sort-icon-gap: var(--table-sort-icon-gap);
    }

    ${tagName}[size='sm'] {
      --dads-table-cell-padding-y: var(--table-cell-padding-y-sm);
      --dads-table-cell-padding-x: var(--table-cell-padding-x-sm);
      --dads-table-line-height: var(--table-line-height-dense);
    }

    ${tagName}[size='dense'],
    ${tagName}[data-size='dense'] {
      --dads-table-cell-padding-y: var(--table-cell-padding-y-dense);
      --dads-table-cell-padding-x: var(--table-cell-padding-x-dense);
      --dads-table-line-height: var(--table-line-height-dense);
    }

    ${tagName} .dads-table[data-size='dense'] {
      --dads-table-cell-padding-y: var(--table-cell-padding-y-dense);
      --dads-table-cell-padding-x: var(--table-cell-padding-x-dense);
      --dads-table-line-height: var(--table-line-height-dense);
    }
  `;

  return css`
    ${semanticTokensText}
    ${localTokensText}
  `;
}
