/**
 * Fieldsetコンポーネント用スタイル定義
 * デジタル庁デザインシステム（DADS）準拠
 */
import { css } from '../../core/web-components.js';
export const fieldsetStyles = css `
  :host {
    display: block;
  }

  /* ========== Fieldset ========== */
  [part='fieldset'] {
    border: none;
    padding: 0;
    margin: 0;
    min-width: 0; /* Firefox overflow fix */
  }

  /* ========== Legend ========== */
  [part='legend'] {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-1, 4px);
    padding: 0;
    margin-bottom: var(--spacing-3, 12px);
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5;
    font-family: var(--font-family-sans);
    color: var(--color-neutral-black, #1a1a1c);
  }

  /* Legend Fallback */
  [part='legend-fallback']:empty {
    display: none;
  }

  /* ========== 要否ラベル ========== */
  [part='requirement'] {
    font-weight: 400;
    font-size: var(--font-size-16, 1rem);
    line-height: 1.5;
    font-family: var(--font-family-sans);
    color: var(--color-semantic-error-1, #ec0000);
  }

  [part='requirement']:empty {
    display: none;
  }

  /* ========== Support Text ========== */
  [part='support-text'] {
    margin-bottom: var(--spacing-3, 12px);
    font-size: var(--font-size-16, 1rem);
    line-height: 1.5;
    font-family: var(--font-family-sans);
    color: var(--color-neutral-solid-gray-700, #4d4d4d);
  }

  /* Support Text の表示/非表示はJS（updateSupportFallback）で制御 */

  /* Support Fallback */
  [part='support-fallback']:empty {
    display: none;
  }

  /* ========== Content ========== */
  [part='content'] {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2, 8px);
  }

  /* ========== Disabled state ========== */
  :host([disabled]) [part='legend'] {
    color: var(--color-neutral-solid-gray-500, #757575);
  }

  :host([disabled]) [part='support-text'] {
    color: var(--color-neutral-solid-gray-400, #949494);
  }
`;
