/**
 * Language Selector tokens (DADS準拠)
 */
import { css } from '../../core/web-components.js';

const languageSelectorSemanticTokensText = `
  :host {
    --language-selector-opener-padding-inline-icon: var(--spacing-1, 0.25rem);
    --language-selector-opener-gap-icon: var(--spacing-1, 0.25rem);
    --language-selector-check-color: var(--color-primitive-blue-1000, #00118f);
  }
`;

const languageSelectorLocalTokensText = `
  :host {
    --dads-language-selector-check-color: var(--language-selector-check-color);
  }

  :host([opener="icon"]) {
    --dads-menu-list-box-opener-padding-x: var(--language-selector-opener-padding-inline-icon);
    --dads-menu-list-box-opener-gap: var(--language-selector-opener-gap-icon);
  }
`;

export const languageSelectorSemanticTokens = css`${languageSelectorSemanticTokensText}`;
export const languageSelectorLocalTokens = css`${languageSelectorLocalTokensText}`;

export const languageSelectorTokens = css`
  ${languageSelectorSemanticTokensText}
  ${languageSelectorLocalTokensText}
`;
