/**
 * Dividerコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';

const dividerSemanticTokensText = `
  :host {
    --divider-color-solid-gray-420: var(--color-neutral-solid-gray-420, #949494);
    --divider-color-solid-gray-536: var(--color-neutral-solid-gray-536, #757575);
    --divider-color-black: var(--color-neutral-black, #000000);

    --divider-color: var(--divider-color-solid-gray-420);
    --divider-style: solid;
    --divider-width: 1px;

    --divider-margin-block: var(--spacing-2, 0.5rem);
    --divider-margin-inline: 0;
    --divider-margin-block-start: var(--divider-margin-block);
    --divider-margin-block-end: var(--divider-margin-block);
    --divider-margin-inline-start: var(--divider-margin-inline);
    --divider-margin-inline-end: var(--divider-margin-inline);

    --divider-vertical-length: calc(30 / 16 * 1rem);
  }
`;

const dividerLocalTokensText = `
  :host {
    --dads-divider-color: var(--divider-color);
    --dads-divider-style: var(--divider-style);
    --dads-divider-width: var(--divider-width);

    --dads-divider-margin-block: var(--divider-margin-block);
    --dads-divider-margin-inline: var(--divider-margin-inline);
    --dads-divider-margin-block-start: var(--dads-divider-margin-block);
    --dads-divider-margin-block-end: var(--dads-divider-margin-block);
    --dads-divider-margin-inline-start: var(--dads-divider-margin-inline);
    --dads-divider-margin-inline-end: var(--dads-divider-margin-inline);
    --dads-divider-vertical-length: var(--divider-vertical-length);
  }

  :host([data-color='solid-gray-420']) {
    --dads-divider-color: var(--divider-color-solid-gray-420);
  }

  :host([data-color='solid-gray-536']) {
    --dads-divider-color: var(--divider-color-solid-gray-536);
  }

  :host([data-color='black']) {
    --dads-divider-color: var(--divider-color-black);
  }

  :host([data-style='solid']) {
    --dads-divider-style: solid;
  }

  :host([data-style='dashed']) {
    --dads-divider-style: dashed;
  }

  :host([data-width='1']) {
    --dads-divider-width: 1px;
  }

  :host([data-width='2']) {
    --dads-divider-width: 2px;
  }

  :host([data-width='3']) {
    --dads-divider-width: 3px;
  }

  :host([data-width='4']) {
    --dads-divider-width: 4px;
  }
`;

export const dividerSemanticTokens = css`${dividerSemanticTokensText}`;
export const dividerLocalTokens = css`${dividerLocalTokensText}`;

export const dividerTokens = css`
  ${dividerSemanticTokensText}
  ${dividerLocalTokensText}
`;
