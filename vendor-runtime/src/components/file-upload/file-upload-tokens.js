/**
 * ファイルアップロードコンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';
const fileUploadSemanticTokensText = `
  :host {
    /* Label */
    --file-upload-label-color: var(--color-neutral-solid-gray-800, #333333);
    --file-upload-label-weight: var(--font-weight-700, 700);
    --file-upload-label-size: var(--font-size-18, 1.125rem);

    /* Requirement */
    --file-upload-requirement-color: var(--color-semantic-error-1, #ec0000);

    /* Support */
    --file-upload-support-color: var(--color-neutral-solid-gray-600, #666666);

    /* Drop zone */
    --file-upload-dropzone-bg: var(--color-neutral-solid-gray-50, #f2f2f2);
    --file-upload-dropzone-bg-dragover: var(--color-primitive-green-50, #e6f5ec);
    --file-upload-dropzone-border-color: var(--color-neutral-solid-gray-536, #767676);
    --file-upload-dropzone-border-color-hover: var(--color-neutral-solid-gray-600, #666666);
    --file-upload-dropzone-border-color-dragover: var(--color-semantic-success-1, #259d63);
    --file-upload-dropzone-border-color-error: var(--color-semantic-error-1, #ec0000);
    --file-upload-dropzone-border-width: 1px;
    --file-upload-dropzone-border-width-dragover: var(--spacing-1, 0.25rem);
    --file-upload-dropzone-radius: var(--border-radius-8, 0.5rem);
    --file-upload-dropzone-padding: var(--spacing-6, 1.5rem);
    --file-upload-dropzone-padding-button-only: 0px;
    --file-upload-dropzone-border-width-button-only: 0px;
    --file-upload-dropzone-radius-button-only: 0px;
    --file-upload-dropzone-bg-button-only: transparent;

    /* Browse button (outlined variant overrides) */
    --file-upload-browse-bg: var(--color-primitive-white, #ffffff);
    --file-upload-browse-bg-hover: var(--color-primitive-blue-200, #c5d7fb);
    --file-upload-browse-bg-active: var(--color-primitive-blue-300, #9db7f9);
    --file-upload-browse-color: var(--color-primitive-blue-900, #0017c1);
    --file-upload-browse-color-hover: var(--color-primitive-blue-1000, #00118f);
    --file-upload-browse-color-active: var(--color-primitive-blue-1200, #000060);
    --file-upload-browse-border-color: var(--color-primitive-blue-900, #0017c1);
    --file-upload-browse-border-color-hover: var(--color-primitive-blue-1000, #00118f);
    --file-upload-browse-border-color-active: var(--color-primitive-blue-1200, #000060);
    --file-upload-browse-text-decoration: none;

    --file-upload-browse-bg-dragover: var(--color-primitive-blue-300, #9db7f9);
    --file-upload-browse-color-dragover: var(--color-primitive-blue-1200, #000060);
    --file-upload-browse-border-color-dragover: var(--color-primitive-blue-1200, #000060);
    --file-upload-browse-text-decoration-dragover: underline;

    /* Hint */
    --file-upload-hint-color: var(--color-neutral-solid-gray-800, #333333);

    /* Spacing */
    --file-upload-gap: var(--spacing-2, 0.5rem);
    --file-upload-button-gap: 56px;
    --file-upload-list-gap: var(--spacing-2, 0.5rem);
    --file-upload-selection-summary-margin-top: var(--spacing-4, 1rem);
    --file-upload-selection-summary-margin-top-button-only: var(--spacing-2, 0.5rem);
    --file-upload-selection-summary-color: var(--color-neutral-solid-gray-700, #4d4d4d);
    --file-upload-expand-checkbox-base-align-items: start;
    --file-upload-expand-checkbox-label-padding-block-start: 0px;
    --file-upload-top-error-margin-top: var(--spacing-2, 0.5rem);
    --file-upload-top-error-margin-top-no-summary: var(--spacing-4, 1rem);
    --file-upload-item-error-row-gap: var(--spacing-1, 0.25rem);
    --file-upload-item-error-border-width: var(--spacing-1, 0.25rem);
    --file-upload-item-error-padding-inline-start: var(--spacing-4, 1rem);
    --file-upload-button-only-main-min-height: 0px;
    --file-upload-button-only-main-gap: 0px;

    /* Error */
    --file-upload-error-color: var(--color-semantic-error-2, #ce0000);
    --file-upload-item-error-color: var(--color-semantic-error-1, #ec0000);

    /* File item */
    --file-upload-file-name-color: var(--color-neutral-solid-gray-800, #333333);
    --file-upload-file-name-color-error: var(--color-semantic-error-1, #ec0000);
    --file-upload-file-meta-color: var(--color-neutral-solid-gray-600, #666666);
    --file-upload-file-meta-color-error: var(--color-semantic-error-1, #ec0000);
    --file-upload-file-status-color: var(--color-neutral-solid-gray-600, #666666);
    --file-upload-file-status-success-color: var(--color-semantic-success-1, #008a1e);
    --file-upload-file-status-error-color: var(--color-semantic-error-1, #ec0000);

    /* Remove */
    --file-upload-remove-color: var(--color-primitive-blue-1000, #0031d8);
    --file-upload-remove-color-hover: var(--color-primitive-blue-1200, #00208a);

    /* Overlay */
    --file-upload-overlay-bg: var(--color-primitive-green-50, #dff2e4);
    --file-upload-overlay-border-color: var(--color-semantic-success-1, #008a1e);
    --file-upload-overlay-border-width: 4px;
    --file-upload-overlay-text-color: var(--color-neutral-solid-gray-800, #333333);
    --file-upload-overlay-text-size: var(--font-size-56, 3.5rem);
  }
`;
const fileUploadLocalTokensText = `
  :host {
    --dads-file-upload-label-color: var(--file-upload-label-color);
    --dads-file-upload-label-size: var(--file-upload-label-size);
    --dads-file-upload-label-weight: var(--file-upload-label-weight);
    --dads-file-upload-requirement-color: var(--file-upload-requirement-color);

    --dads-file-upload-support-color: var(--file-upload-support-color);

    --dads-file-upload-dropzone-bg: var(--file-upload-dropzone-bg);
    --dads-file-upload-dropzone-border-color: var(--file-upload-dropzone-border-color);
    --dads-file-upload-dropzone-border-width: var(--file-upload-dropzone-border-width);
    --dads-file-upload-dropzone-radius: var(--file-upload-dropzone-radius);
    --dads-file-upload-dropzone-padding: var(--file-upload-dropzone-padding);

    --dads-file-upload-browse-bg: var(--file-upload-browse-bg);
    --dads-file-upload-browse-bg-hover: var(--file-upload-browse-bg-hover);
    --dads-file-upload-browse-bg-active: var(--file-upload-browse-bg-active);
    --dads-file-upload-browse-color: var(--file-upload-browse-color);
    --dads-file-upload-browse-color-hover: var(--file-upload-browse-color-hover);
    --dads-file-upload-browse-color-active: var(--file-upload-browse-color-active);
    --dads-file-upload-browse-border-color: var(--file-upload-browse-border-color);
    --dads-file-upload-browse-border-color-hover: var(--file-upload-browse-border-color-hover);
    --dads-file-upload-browse-border-color-active: var(--file-upload-browse-border-color-active);
    --dads-file-upload-browse-text-decoration: var(--file-upload-browse-text-decoration);

    --dads-file-upload-hint-color: var(--file-upload-hint-color);

    --dads-file-upload-gap: var(--file-upload-gap);
    --dads-file-upload-button-gap: var(--file-upload-button-gap);
    --dads-file-upload-list-gap: var(--file-upload-list-gap);
    --dads-file-upload-selection-summary-margin-top: var(--file-upload-selection-summary-margin-top);
    --dads-file-upload-selection-summary-color: var(--file-upload-selection-summary-color);
    --dads-file-upload-expand-checkbox-base-align-items: var(--file-upload-expand-checkbox-base-align-items);
    --dads-file-upload-expand-checkbox-label-padding-block-start: var(--file-upload-expand-checkbox-label-padding-block-start);
    --dads-file-upload-top-error-margin-top: var(--file-upload-top-error-margin-top);
    --dads-file-upload-top-error-margin-top-no-summary: var(--file-upload-top-error-margin-top-no-summary);
    --dads-file-upload-item-error-row-gap: var(--file-upload-item-error-row-gap);
    --dads-file-upload-item-error-border-width: var(--file-upload-item-error-border-width);
    --dads-file-upload-item-error-padding-inline-start: var(--file-upload-item-error-padding-inline-start);
    --dads-file-upload-button-only-main-min-height: var(--file-upload-button-only-main-min-height);
    --dads-file-upload-button-only-main-gap: var(--file-upload-button-only-main-gap);

    --dads-file-upload-error-color: var(--file-upload-error-color);
    --dads-file-upload-item-error-color: var(--file-upload-item-error-color);

    --dads-file-upload-file-name-color: var(--file-upload-file-name-color);
    --dads-file-upload-file-name-color-error: var(--file-upload-file-name-color-error);
    --dads-file-upload-file-meta-color: var(--file-upload-file-meta-color);
    --dads-file-upload-file-meta-color-error: var(--file-upload-file-meta-color-error);
    --dads-file-upload-file-status-color: var(--file-upload-file-status-color);
    --dads-file-upload-file-status-success-color: var(--file-upload-file-status-success-color);
    --dads-file-upload-file-status-error-color: var(--file-upload-file-status-error-color);

    --dads-file-upload-remove-color: var(--file-upload-remove-color);
    --dads-file-upload-remove-color-hover: var(--file-upload-remove-color-hover);

    --dads-file-upload-overlay-bg: var(--file-upload-overlay-bg);
    --dads-file-upload-overlay-border-color: var(--file-upload-overlay-border-color);
    --dads-file-upload-overlay-border-width: var(--file-upload-overlay-border-width);
    --dads-file-upload-overlay-text-color: var(--file-upload-overlay-text-color);
    --dads-file-upload-overlay-text-size: var(--file-upload-overlay-text-size);
  }

  :host([error]) {
    --dads-file-upload-dropzone-border-color: var(--file-upload-dropzone-border-color-error);
  }

  :host([mode='button-only']) {
    --dads-file-upload-dropzone-bg: var(--file-upload-dropzone-bg-button-only);
    --dads-file-upload-dropzone-border-width: var(--file-upload-dropzone-border-width-button-only);
    --dads-file-upload-dropzone-radius: var(--file-upload-dropzone-radius-button-only);
    --dads-file-upload-dropzone-padding: var(--file-upload-dropzone-padding-button-only);
    --dads-file-upload-selection-summary-margin-top: var(--file-upload-selection-summary-margin-top-button-only);
  }

  :host([data-dragover]) {
    --dads-file-upload-dropzone-bg: var(--file-upload-dropzone-bg-dragover);
    --dads-file-upload-dropzone-border-color: var(--file-upload-dropzone-border-color-dragover);
    --dads-file-upload-dropzone-border-width: var(--file-upload-dropzone-border-width-dragover);

    --dads-file-upload-browse-bg: var(--file-upload-browse-bg-dragover);
    --dads-file-upload-browse-bg-hover: var(--file-upload-browse-bg-dragover);
    --dads-file-upload-browse-bg-active: var(--file-upload-browse-bg-dragover);
    --dads-file-upload-browse-color: var(--file-upload-browse-color-dragover);
    --dads-file-upload-browse-color-hover: var(--file-upload-browse-color-dragover);
    --dads-file-upload-browse-color-active: var(--file-upload-browse-color-dragover);
    --dads-file-upload-browse-border-color: var(--file-upload-browse-border-color-dragover);
    --dads-file-upload-browse-border-color-hover: var(--file-upload-browse-border-color-dragover);
    --dads-file-upload-browse-border-color-active: var(--file-upload-browse-border-color-dragover);
    --dads-file-upload-browse-text-decoration: var(--file-upload-browse-text-decoration-dragover);
  }
`;
export const fileUploadSemanticTokens = css `${fileUploadSemanticTokensText}`;
export const fileUploadLocalTokens = css `${fileUploadLocalTokensText}`;
export const fileUploadTokens = css `
  ${fileUploadSemanticTokensText}
  ${fileUploadLocalTokensText}
`;
