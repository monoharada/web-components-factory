/**
 * ファイルアップロードコンポーネント用スタイル
 */
import { css } from '../../core/web-components.js';

export const fileUploadStyles = css`
  :host {
    display: block;
    font-family: var(--font-family-sans);
    color: var(--dads-file-upload-file-name-color);
  }

  [part='wrapper'] {
    display: flex;
    flex-direction: column;
    gap: var(--dads-file-upload-gap);
  }

  [part='label'] {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0;
    font-size: var(--dads-file-upload-label-size);
    line-height: var(--line-height-150);
    color: var(--dads-file-upload-label-color);
    font-weight: var(--dads-file-upload-label-weight);
  }

  [part='label-text'] {
    display: contents;
  }

  [part='requirement'] {
    margin-left: var(--spacing-1, 0.25rem);
    font-size: var(--font-size-16, 1rem);
    font-weight: var(--font-weight-400, 400);
    color: var(--dads-file-upload-requirement-color);
  }

  [part='support-text'] {
    margin: 0;
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-150);
    color: var(--dads-file-upload-support-color);
  }

  [part='dropzone'] {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: var(--dads-file-upload-dropzone-padding);
    border: var(--dads-file-upload-dropzone-border-width) solid var(--dads-file-upload-dropzone-border-color);
    border-radius: var(--dads-file-upload-dropzone-radius);
    background-color: var(--dads-file-upload-dropzone-bg);
  }

  [part='drop-main'] {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-4, 1rem);
    min-height: var(--dads-file-upload-button-gap);
  }

  :host([mode='button-only']) [part='drop-main'] {
    gap: var(--dads-file-upload-button-only-main-gap);
    min-height: var(--dads-file-upload-button-only-main-min-height);
    width: fit-content;
  }

  [part='browse-button'] {
    flex: none;
    --dads-button-background: var(--dads-file-upload-browse-bg);
    --dads-button-background-hover: var(--dads-file-upload-browse-bg-hover);
    --dads-button-background-active: var(--dads-file-upload-browse-bg-active);
    --dads-button-color: var(--dads-file-upload-browse-color);
    --dads-button-color-hover: var(--dads-file-upload-browse-color-hover);
    --dads-button-color-active: var(--dads-file-upload-browse-color-active);
    --dads-button-border-color: var(--dads-file-upload-browse-border-color);
    --dads-button-border-color-hover: var(--dads-file-upload-browse-border-color-hover);
    --dads-button-border-color-active: var(--dads-file-upload-browse-border-color-active);
    --dads-button-text-decoration: var(--dads-file-upload-browse-text-decoration);
  }

  [part='drop-hint'] {
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-170);
    color: var(--dads-file-upload-hint-color);
  }

  [part='selection-summary'] {
    margin-top: var(--dads-file-upload-selection-summary-margin-top);
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-170);
    color: var(--dads-file-upload-selection-summary-color);
  }

  [part='selection-summary'][hidden] {
    display: none;
  }

  [part='expand-checkbox'] {
    margin-top: var(--dads-file-upload-button-gap);
    display: block;
    --line-height-130: var(--line-height-130, 1.3);
  }

  [part='expand-checkbox']::part(base) {
    align-items: var(--dads-file-upload-expand-checkbox-base-align-items);
  }

  [part='expand-checkbox']::part(label) {
    padding-block-start: var(--dads-file-upload-expand-checkbox-label-padding-block-start);
  }

  [part='error-text'] {
    margin-top: var(--dads-file-upload-top-error-margin-top);
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-150);
    color: var(--dads-file-upload-error-color);
  }

  [part='selection-summary'][hidden] + [part='error-text'] {
    margin-top: var(--dads-file-upload-top-error-margin-top-no-summary);
  }

  :host([mode='button-only']) [part='drop-hint'],
  :host([mode='button-only']) [part='expand-checkbox'] {
    display: none;
  }

  :host([mode='button-only']) [part='selection-summary'][hidden] + [part='error-text'] {
    margin-top: var(--dads-file-upload-top-error-margin-top);
  }

  [part='empty-text'] {
    margin: 0;
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-170);
    color: var(--dads-file-upload-file-name-color);
  }

  [part='empty-text'][hidden] {
    display: none;
  }

  [part='file-list'] {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--dads-file-upload-list-gap);
  }

  [part='file-list'][hidden] {
    display: none;
  }

  [part='file-item'] {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--spacing-2, 0.5rem);
    row-gap: var(--spacing-1, 0.25rem);
    font-size: var(--font-size-16, 1rem);
    line-height: var(--line-height-170);
  }

  [part='file-item'][data-valid='false'] {
    color: var(--dads-file-upload-file-status-error-color);
  }

  [part='file-item'][data-valid='false'] [part='file-name'] {
    color: var(--dads-file-upload-file-name-color-error);
  }

  [part='file-item'][data-valid='false'] [part='file-meta'] {
    color: var(--dads-file-upload-file-meta-color-error);
  }

  [part='remove-button'] {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: transparent;
    padding: 0;
    color: var(--dads-file-upload-remove-color);
    font: inherit;
    text-decoration: underline;
    text-underline-offset: 0.15em;
    cursor: pointer;
  }

  [part='remove-button']:hover {
    color: var(--dads-file-upload-remove-color-hover);
  }

  [part='file-name'] {
    font-weight: var(--font-weight-700, 700);
    color: var(--dads-file-upload-file-name-color);
    word-break: break-all;
  }

  [part='file-meta'] {
    color: var(--dads-file-upload-file-meta-color);
  }

  [part='file-status'] {
    color: var(--dads-file-upload-file-status-color);
  }

  [part='file-item'][data-status='success'] [part='file-status'] {
    color: var(--dads-file-upload-file-status-success-color);
  }

  [part='file-item'][data-status='error'] [part='file-status'] {
    color: var(--dads-file-upload-file-status-error-color);
  }

  [part='file-item-error'] {
    flex-basis: 100%;
    margin-left: calc(var(--spacing-8, 2rem) + var(--spacing-4, 1rem));
    display: grid;
    gap: var(--dads-file-upload-item-error-row-gap);
    color: var(--dads-file-upload-item-error-color);
    border-left: var(--dads-file-upload-item-error-border-width) solid var(--dads-file-upload-item-error-color);
    padding-left: var(--dads-file-upload-item-error-padding-inline-start);
  }

  [part='file-item-error-line'] {
    line-height: var(--line-height-150);
  }

  [part='overlay'] {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: grid;
    place-items: center;
    padding: var(--spacing-8, 2rem);
    box-sizing: border-box;
    pointer-events: none;
    border: var(--dads-file-upload-overlay-border-width) solid var(--dads-file-upload-overlay-border-color);
    background: var(--dads-file-upload-overlay-bg);
  }

  [part='overlay'][hidden] {
    display: none;
  }

  [part='overlay-text'] {
    margin: 0;
    text-align: center;
    font-size: clamp(var(--font-size-24, 1.5rem), 4vw, var(--dads-file-upload-overlay-text-size));
    line-height: var(--line-height-150);
    font-weight: var(--font-weight-700, 700);
    color: var(--dads-file-upload-overlay-text-color);
  }

  @media (hover: hover) {
    :host(:not([disabled])) [part='dropzone']:hover {
      --dads-file-upload-dropzone-border-color: var(--file-upload-dropzone-border-color-hover);
    }
  }

  @media (max-width: 640px) {
    [part='drop-main'] {
      align-items: flex-start;
    }
  }

  @media (forced-colors: active) {
    [part='dropzone'] {
      border-color: CanvasText;
    }

    [part='remove-button'] {
      color: LinkText;
    }

    [part='file-item'][data-status='error'] [part='file-status'],
    [part='file-item-error'],
    [part='error-text'] {
      color: LinkText;
      border-left-color: LinkText;
    }
  }
`;
