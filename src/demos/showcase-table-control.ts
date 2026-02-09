import { annotationToggleScript, annotationToggleUI } from './shared.js';

export const demos = {
  tableControl: () => `
    <div style="padding: 40px; max-width: 1440px; margin: 0 auto;">
      <h2 style="font-size: 28px; margin-bottom: 20px; color: #333;">テーブルコントロール</h2>
      <p style="color: #666; margin-bottom: 32px;">
        検索・件数表示・ページング・表示件数切替を組み合わせた、テーブル操作UIの作例をまとめています。
        実際の連動挙動を確認できるデモと、業務画面を想定した作例を同じページで比較できます。
      </p>

      <style>
        .table-control-demo__scenarios {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin: 0 0 calc(48 / 16 * 1rem);
        }

        .table-control-demo__preview {
          display: grid;
          gap: 16px;
        }

        .table-control-demo__actions,
        .table-control-demo__presets,
        .table-control-demo__dialog-footer {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        #demo-table-control-header {
          --dads-table-control-search-min-width: calc(280 / 16 * 1rem);
          --dads-table-control-search-max-width: calc(460 / 16 * 1rem);
          --dads-table-control-popular-gap: calc(16 / 16 * 1rem);
          --dads-search-box-gap: calc(8 / 16 * 1rem);
          --dads-search-box-border-radius: var(--border-radius-4, 0.25rem);
          --dads-search-box-border-width: 1px;
          --dads-search-box-control-min-height: calc(30 / 16 * 1rem);
          --dads-search-box-input-min-width: calc(312 / 16 * 1rem);
          --dads-search-box-input-padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
          --dads-search-box-search-icon-size: calc(20 / 16 * 1rem);
        }

        #demo-table-control-header::part(header) {
          align-items: flex-start;
        }

        #demo-table-control-header::part(search) {
          flex-wrap: nowrap;
          --button-height-large: calc(30 / 16 * 1rem);
          --button-padding-large: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
          --button-font-size-large: var(--font-size-16, 1rem);
          --dads-button-min-width: calc(72 / 16 * 1rem);
          --dads-button-border-width: 1px;
          --dads-button-border-radius: var(--border-radius-4, 0.25rem);
        }

        #demo-table-control-header::part(count) {
          min-inline-size: 3ch;
        }

        #demo-table-control-header::part(popular) {
          inline-size: 100%;
        }

        .table-control-demo__actions {
          flex-wrap: nowrap;
          white-space: nowrap;
        }

        .table-control-demo__table {
          min-width: 860px;
        }

        .table-control-demo__dialog-form {
          display: grid;
          gap: 16px;
        }

        .table-control-demo__dialog-footer {
          justify-content: flex-end;
        }

        .table-control-municipal-demo__scenarios {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin: 0 0 1lh;
        }

        .table-control-municipal-demo__root {
          display: grid;
          gap: 16px;
          inline-size: 100%;
          border: 1px solid #949494;
          border-radius: 24px;
          padding: calc(48 / 16 * 1rem);
          background: #fff;
        }

        .table-control-municipal-demo__title {
          margin: 0;
          color: #333;
          font-size: 48px;
          line-height: 1.4;
          font-weight: 700;
        }

        .table-control-municipal-demo__title-divider {
          block-size: 4px;
          background: #0017c1;
          margin: calc(32 / 16 * 1rem) 0;
          border: none;
        }

        .table-control-municipal-demo__controls {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: calc(24 / 16 * 1rem);
          inline-size: 100%;
          margin-block-end: calc(24 / 16 * 1rem);
        }

        .table-control-municipal-demo__search-group {
          display: flex;
          align-items: center;
          gap: calc(16 / 16 * 1rem);
          inline-size: calc(465 / 16 * 1rem);
          max-inline-size: 100%;
          flex: 0 0 auto;
          min-inline-size: 0;
        }

        .table-control-municipal-demo__search-box {
          flex: 0 0 auto;
          inline-size: calc(392 / 16 * 1rem);
          max-inline-size: 100%;
          min-inline-size: calc(280 / 16 * 1rem);
          --dads-search-box-gap: calc(8 / 16 * 1rem);
          --dads-search-box-border-radius: var(--border-radius-4, 0.25rem);
          --dads-search-box-control-min-height: calc(30 / 16 * 1rem);
          --dads-search-box-border-width: 1px;
          --dads-search-box-input-min-width: calc(312 / 16 * 1rem);
          --dads-search-box-input-padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
          --dads-search-box-search-icon-size: calc(20 / 16 * 1rem);
        }

        .table-control-municipal-demo__search-box::part(base) {
          gap: calc(8 / 16 * 1rem);
        }

        .table-control-municipal-demo__search-box::part(input) {
          min-block-size: calc(30 / 16 * 1rem);
          min-inline-size: calc(312 / 16 * 1rem);
          border-radius: var(--border-radius-4, 0.25rem);
          padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
        }

        .table-control-municipal-demo__search-box::part(search-icon) {
          inset-inline-start: calc(8 / 16 * 1rem);
          inline-size: calc(20 / 16 * 1rem);
          block-size: calc(20 / 16 * 1rem);
        }

        .table-control-municipal-demo__search-box::part(button) {
          --button-height-large: calc(30 / 16 * 1rem);
          --button-padding-large: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
          --button-font-size-large: var(--font-size-16, 1rem);
          --dads-button-min-width: calc(72 / 16 * 1rem);
          --dads-button-border-width: 1px;
          --dads-button-border-radius: var(--border-radius-4, 0.25rem);
        }

        #demo-municipal-count {
          color: #333;
          min-inline-size: calc(57 / 16 * 1rem);
          white-space: nowrap;
          line-height: 1.7;
          letter-spacing: 0.02em;
        }

        #demo-municipal-reset {
          border: none;
          background: transparent;
          color: #00118f;
          text-decoration: underline;
          text-underline-offset: .2em;
          font: inherit;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          min-inline-size: calc(72 / 16 * 1rem);
          visibility: hidden;
          pointer-events: none;
          white-space: nowrap;
        }

        #demo-municipal-reset[data-visible="true"] {
          visibility: visible;
          pointer-events: auto;
        }

        .table-control-municipal-demo__actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: calc(16 / 16 * 1rem);
          margin-inline-start: auto;
          white-space: nowrap;
          flex-wrap: nowrap;
        }

        #demo-municipal-print,
        #demo-municipal-csv,
        #demo-municipal-create {
          --dads-button-border-width: 1px;
          --button-height-small: calc(30 / 16 * 1rem);
          --button-padding-small: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
          --button-font-size-small: var(--font-size-16, 1rem);
          --dads-button-border-radius: var(--border-radius-4, 0.25rem);
        }

        #demo-municipal-print {
          --dads-button-min-width: calc(72 / 16 * 1rem);
        }

        #demo-municipal-csv {
          --dads-button-min-width: calc(145 / 16 * 1rem);
        }

        #demo-municipal-create {
          --dads-button-min-width: calc(101 / 16 * 1rem);
        }

        .table-control-municipal-demo__action-divider {
          inline-size: 1px;
          block-size: 30px;
          background: #949494;
          flex-shrink: 0;
        }

        .table-control-municipal-demo__icon {
          inline-size: 1rem;
          block-size: 1rem;
          fill: currentColor;
        }

        .table-control-municipal-demo__table {
          inline-size: 100%;
          min-inline-size: 0;
          font-size: 1rem;
          table-layout: fixed;
          border-collapse: collapse;
        }

        .table-control-municipal-demo__table :is(th, td) {
          vertical-align: middle;
          line-height: 1.3;
          padding: calc(12 / 16 * 1rem) 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .table-control-municipal-demo__table thead th {
          background: var(--color-neutral-solid-gray-100, #e6e6e6);
          border-color: var(--color-neutral-solid-gray-500, #7f7f7f);
          font-weight: 700;
        }

        .table-control-municipal-demo__table tbody th {
          background: var(--color-neutral-solid-gray-100, #e6e6e6);
          border-color: var(--color-neutral-solid-gray-420, #949494);
          font-weight: 700;
        }

        .table-control-municipal-demo__table tbody td {
          border-color: var(--color-neutral-solid-gray-420, #949494);
        }

        .table-control-municipal-demo__status-chip {
          --dads-chip-label-font-size: 1rem;
          --dads-chip-label-min-height: calc(32 / 16 * 1rem);
          --dads-chip-label-padding-block: calc(4 / 16 * 1rem);
          --dads-chip-label-padding-inline: calc(8 / 16 * 1rem);
          --dads-chip-label-font-weight: 700;
        }

        .table-control-municipal-demo__empty-cell {
          block-size: calc(190 / 16 * 1rem);
          text-align: center;
          color: #4b5563;
          vertical-align: middle;
        }

        #demo-municipal-footer {
          --dads-table-control-gap: calc(16 / 16 * 1rem);
          --dads-table-control-items-gap: calc(24 / 16 * 1rem);
          margin-block-start: calc(24 / 16 * 1rem);
        }

        #demo-municipal-footer::part(items-per-page) {
          margin-inline-start: auto;
        }

        #demo-municipal-pagination {
          --dads-page-navigation-gap: calc(16 / 16 * 1rem);
          --dads-page-navigation-status-color: #333;
          --dads-page-navigation-status-font-size: 1rem;
          --dads-page-navigation-status-letter-spacing: 0.02em;
          --dads-page-navigation-status-line-height: 1.7;
          --dads-page-navigation-control-size: calc(30 / 16 * 1rem);
          --dads-page-navigation-control-min-width: calc(30 / 16 * 1rem);
          --dads-page-navigation-control-min-height: calc(30 / 16 * 1rem);
          --dads-page-navigation-icon-size: calc(16 / 16 * 1rem);
          --dads-page-navigation-control-border-width: 1px;
          --dads-page-navigation-control-border-color: #0017c1;
          --dads-page-navigation-control-border-color-hover: #00118f;
          --dads-page-navigation-control-color: #0017c1;
          --dads-page-navigation-control-color-hover: #00118f;
          --dads-page-navigation-control-background: transparent;
          --dads-page-navigation-control-background-hover: transparent;
          --dads-page-navigation-control-background-active: transparent;
        }

        .table-control-municipal-demo__dialog-form {
          display: grid;
          gap: 16px;
        }

        .table-control-municipal-demo__dialog-footer {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .table-control-preset-demo__root {
          display: grid;
          gap: 16px;
          inline-size: 100%;
          border: 1px solid #949494;
          border-radius: 24px;
          padding: calc(48 / 16 * 1rem);
          background: #fff;
        }

        .table-control-preset-demo__title {
          margin: 0;
          color: #333;
          font-size: 32px;
          line-height: 1.5;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .table-control-preset-demo__title-divider {
          block-size: 4px;
          background: #0017c1;
          margin: calc(16 / 16 * 1rem) 0 calc(32 / 16 * 1rem);
          border: none;
        }

        .table-control-preset-demo__controls {
          display: flex;
          align-items: center;
          gap: calc(32 / 16 * 1rem);
          inline-size: 100%;
          margin-block-end: calc(24 / 16 * 1rem);
          flex-wrap: wrap;
        }

        .table-control-preset-demo__search-group {
          display: flex;
          align-items: center;
          gap: calc(16 / 16 * 1rem);
          flex-wrap: wrap;
        }

        .table-control-preset-demo__search-box {
          inline-size: calc(392 / 16 * 1rem);
          max-inline-size: 100%;
          --dads-search-box-gap: calc(8 / 16 * 1rem);
          --dads-search-box-control-min-height: calc(30 / 16 * 1rem);
          --dads-search-box-border-radius: var(--border-radius-4, 0.25rem);
          --dads-search-box-border-width: 1px;
          --dads-search-box-input-min-width: calc(312 / 16 * 1rem);
          --dads-search-box-input-padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
          --dads-search-box-search-icon-size: calc(20 / 16 * 1rem);
        }

        .table-control-preset-demo__search-box::part(input) {
          min-block-size: calc(30 / 16 * 1rem);
          min-inline-size: calc(312 / 16 * 1rem);
          border-radius: var(--border-radius-4, 0.25rem);
          padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
        }

        .table-control-preset-demo__search-box::part(search-icon) {
          inset-inline-start: calc(8 / 16 * 1rem);
          inline-size: calc(20 / 16 * 1rem);
          block-size: calc(20 / 16 * 1rem);
        }

        .table-control-preset-demo__search-box::part(button) {
          --button-height-large: calc(30 / 16 * 1rem);
          --button-padding-large: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
          --button-font-size-large: var(--font-size-16, 1rem);
          --dads-button-min-width: calc(72 / 16 * 1rem);
          --dads-button-border-width: 1px;
          --dads-button-border-radius: var(--border-radius-4, 0.25rem);
        }

        #demo-preset-count {
          color: #1a1a1a;
          min-inline-size: calc(57 / 16 * 1rem);
          white-space: nowrap;
          line-height: 1.7;
          letter-spacing: 0.02em;
        }

        #demo-preset-reset {
          border: none;
          background: transparent;
          color: #00118f;
          text-decoration: underline;
          text-underline-offset: .2em;
          font: inherit;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          min-inline-size: calc(72 / 16 * 1rem);
          visibility: hidden;
          pointer-events: none;
          white-space: nowrap;
        }

        #demo-preset-reset[data-visible="true"] {
          visibility: visible;
          pointer-events: auto;
        }

        .table-control-preset-demo__popular {
          display: flex;
          align-items: center;
          gap: calc(16 / 16 * 1rem);
          flex-wrap: wrap;
          color: #333;
          line-height: 1.7;
          letter-spacing: 0.02em;
        }

        .table-control-preset-demo__popular-label {
          white-space: nowrap;
        }

        .table-control-preset-demo__chip {
          --dads-chip-tag-min-height: calc(32 / 16 * 1rem);
          --dads-chip-tag-padding-block: calc(4 / 16 * 1rem);
          --dads-chip-tag-padding-inline: calc(8 / 16 * 1rem);
          --dads-chip-tag-label-padding-inline: calc(8 / 16 * 1rem);
        }

        .table-control-preset-demo__bulk-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #c5d7fb;
          border-radius: var(--border-radius-8, 0.5rem);
          padding: calc(12 / 16 * 1rem) 1rem;
          background: #e8f1fe;
          margin-block-end: calc(16 / 16 * 1rem);
          flex-wrap: wrap;
        }

        .table-control-preset-demo__bulk-bar[hidden] {
          display: none;
        }

        #demo-preset-bulk-status {
          color: #1a1a1a;
          line-height: 1.7;
          letter-spacing: 0.02em;
          margin-inline-end: auto;
        }

        #demo-preset-bulk-status-select {
          min-block-size: calc(30 / 16 * 1rem);
          min-inline-size: calc(140 / 16 * 1rem);
          border: 1px solid #666;
          border-radius: var(--border-radius-4, 0.25rem);
          padding: 0 calc(8 / 16 * 1rem);
          background: #fff;
          color: #1a1a1a;
        }

        #demo-preset-bulk-apply,
        #demo-preset-bulk-delete {
          --dads-button-border-width: 1px;
          --button-height-small: calc(30 / 16 * 1rem);
          --button-padding-small: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
          --button-font-size-small: var(--font-size-16, 1rem);
          --dads-button-border-radius: var(--border-radius-4, 0.25rem);
          --dads-button-min-width: calc(96 / 16 * 1rem);
        }

        #demo-preset-table {
          inline-size: 100%;
        }

        .table-control-preset-demo__table {
          inline-size: 100%;
          min-inline-size: 0;
          table-layout: fixed;
          border-collapse: collapse;
          font-size: 1rem;
        }

        .table-control-preset-demo__table :is(th, td) {
          vertical-align: middle;
          line-height: 1.3;
          padding: calc(12 / 16 * 1rem) 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .table-control-preset-demo__table thead th {
          background: var(--color-neutral-solid-gray-100, #e6e6e6);
          border-color: var(--color-neutral-solid-gray-500, #7f7f7f);
          font-weight: 700;
        }

        .table-control-preset-demo__table tbody td {
          border-color: var(--color-neutral-solid-gray-420, #949494);
        }

        .table-control-preset-demo__table th[data-actions-col],
        .table-control-preset-demo__table td[data-actions-col] {
          text-align: center;
          overflow: visible;
          text-overflow: clip;
          padding-inline: calc(2 / 16 * 1rem);
        }

        .table-control-preset-demo__row-menu {
          --dads-menu-list-box-opener-min-height: calc(44 / 16 * 1rem);
          --dads-menu-list-box-opener-padding-y: calc(10 / 16 * 1rem);
          --dads-menu-list-box-opener-padding-x: calc(10 / 16 * 1rem);
          --dads-menu-list-box-opener-icon-size: calc(24 / 16 * 1rem);
          --dads-menu-list-box-opener-arrow-size: 0;
          --dads-menu-list-box-popup-min-width: calc(120 / 16 * 1rem);
          --dads-menu-list-box-popup-z-index: 10;
        }

        .table-control-preset-demo__row-menu::part(opener) {
          justify-content: center;
          min-inline-size: calc(44 / 16 * 1rem);
          min-block-size: calc(44 / 16 * 1rem);
        }

        .table-control-preset-demo__row-menu::part(opener-label) {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          white-space: nowrap;
        }

        .table-control-preset-demo__row-menu::part(opener-arrow) {
          display: none;
        }

        .table-control-preset-demo__row-menu::part(popup) {
          inset-inline-start: auto;
          inset-inline-end: 0;
        }

        .table-control-preset-demo__menu-icon {
          inline-size: 100%;
          block-size: 100%;
          fill: currentColor;
        }

        .table-control-preset-demo__status-chip {
          --dads-chip-label-font-size: 1rem;
          --dads-chip-label-min-height: calc(32 / 16 * 1rem);
          --dads-chip-label-padding-block: calc(4 / 16 * 1rem);
          --dads-chip-label-padding-inline: calc(8 / 16 * 1rem);
          --dads-chip-label-font-weight: 700;
        }

        .table-control-preset-demo__empty-cell {
          block-size: calc(190 / 16 * 1rem);
          text-align: center;
          color: #4b5563;
          vertical-align: middle;
        }

        #demo-preset-footer {
          --dads-table-control-gap: calc(16 / 16 * 1rem);
          --dads-table-control-items-gap: calc(24 / 16 * 1rem);
          margin-block-start: calc(24 / 16 * 1rem);
        }

        #demo-preset-pagination {
          --dads-page-navigation-gap: calc(16 / 16 * 1rem);
          --dads-page-navigation-status-color: #1a1a1a;
          --dads-page-navigation-status-font-size: 1rem;
          --dads-page-navigation-status-letter-spacing: 0.02em;
          --dads-page-navigation-status-line-height: 1;
          --dads-page-navigation-control-size: calc(30 / 16 * 1rem);
          --dads-page-navigation-control-min-width: calc(30 / 16 * 1rem);
          --dads-page-navigation-control-min-height: calc(30 / 16 * 1rem);
          --dads-page-navigation-icon-size: calc(16 / 16 * 1rem);
          --dads-page-navigation-control-border-width: 1px;
          --dads-page-navigation-control-border-color: #0017c1;
          --dads-page-navigation-control-border-color-hover: #00118f;
          --dads-page-navigation-control-color: #0017c1;
          --dads-page-navigation-control-color-hover: #00118f;
          --dads-page-navigation-control-background: transparent;
          --dads-page-navigation-control-background-hover: transparent;
          --dads-page-navigation-control-background-active: transparent;
        }

        .table-control-preset-demo__dialog-form {
          display: grid;
          gap: 16px;
        }

        .table-control-preset-demo__dialog-footer {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .table-control-annotate-demo__root {
          gap: calc(24 / 16 * 1rem);
        }

        .table-control-annotate-demo__toggle {
          margin-block-end: calc(24 / 16 * 1rem);
        }

        .table-control-annotate-demo__frame {
          inline-size: 100%;
          display: grid;
        }

        .table-control-annotate-demo__annotate + .table-control-annotate-demo__annotate {
          margin-block-start: calc(24 / 16 * 1rem);
        }

        .table-control-annotate-demo__header {
          --dads-table-control-search-min-width: calc(312 / 16 * 1rem);
          --dads-table-control-search-max-width: calc(312 / 16 * 1rem);
          --dads-search-box-control-min-height: calc(30 / 16 * 1rem);
          --dads-search-box-input-min-width: calc(312 / 16 * 1rem);
          --dads-search-box-input-padding: calc(3 / 16 * 1rem) calc(12 / 16 * 1rem) calc(3 / 16 * 1rem) calc(36 / 16 * 1rem);
          --dads-search-box-search-icon-size: calc(20 / 16 * 1rem);
          --dads-table-control-popular-gap: calc(16 / 16 * 1rem);
        }

        .table-control-annotate-demo__header::part(search) {
          --button-height-large: calc(30 / 16 * 1rem);
          --button-padding-large: calc(7 / 16 * 1rem) calc(8 / 16 * 1rem);
          --button-font-size-large: var(--font-size-16, 1rem);
          --dads-button-min-width: calc(72 / 16 * 1rem);
          --dads-button-border-width: 1px;
          --dads-button-border-radius: var(--border-radius-4, 0.25rem);
        }

        .table-control-annotate-demo__action-divider {
          inline-size: 1px;
          block-size: calc(30 / 16 * 1rem);
          background: #949494;
          margin-inline: calc(8 / 16 * 1rem);
          flex: 0 0 auto;
        }

        .table-control-annotate-demo__footer {
          --dads-table-control-gap: calc(16 / 16 * 1rem);
          --dads-table-control-items-gap: calc(24 / 16 * 1rem);
        }

        @media (max-width: 1280px) {
          .table-control-municipal-demo__root {
            padding: 24px;
          }

          .table-control-municipal-demo__controls {
            display: flex;
            inline-size: 100%;
            flex-wrap: wrap;
            align-items: flex-start;
          }

          .table-control-municipal-demo__search-group {
            inline-size: min(calc(465 / 16 * 1rem), 100%);
            flex-wrap: wrap;
            gap: 12px;
          }

          .table-control-municipal-demo__search-box {
            inline-size: min(calc(392 / 16 * 1rem), 100%);
          }

          .table-control-municipal-demo__actions {
            inline-size: 100%;
            justify-content: flex-start;
          }

          .table-control-preset-demo__root {
            padding: 24px;
          }

          .table-control-preset-demo__controls {
            gap: 16px;
          }

          .table-control-preset-demo__search-group {
            inline-size: 100%;
          }

          .table-control-preset-demo__search-box {
            inline-size: min(calc(392 / 16 * 1rem), 100%);
          }

          .table-control-preset-demo__popular {
            inline-size: 100%;
          }

          .table-control-preset-demo__bulk-bar {
            inline-size: 100%;
          }
        }
      </style>

      <section style="margin-bottom: 56px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">アクセシビリティ注釈（Table Control Components）</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          テーブルコントロールの検索行と表示件数行について、各要素の役割を注釈付きで確認できます。
        </p>

        <div class="table-control-annotate-demo__root table-control-municipal-demo__root">
          <div class="table-control-annotate-demo__toggle">
            ${annotationToggleUI()}
            ${annotationToggleScript()}
          </div>

          <div class="table-control-annotate-demo__frame">
            <a11y-annotate class="table-control-annotate-demo__annotate" target-selector="#demo-table-control-annotate-header">
              <dads-table-control
                id="demo-table-control-annotate-header"
                class="table-control-annotate-demo__header"
                variant="header"
                query=""
                result-count="120"
                show-reset
                reset-label="リセット"
              >
                <div slot="actions" class="table-control-demo__actions">
                  <dads-button type="button" size="small" variant="outlined">印刷</dads-button>
                  <dads-button type="button" size="small" variant="outlined">CSVダウンロード</dads-button>
                  <span class="table-control-annotate-demo__action-divider" aria-hidden="true"></span>
                  <dads-button type="button" size="small" variant="outlined">新規追加</dads-button>
                </div>
              </dads-table-control>
            </a11y-annotate>

            <a11y-annotate class="table-control-annotate-demo__annotate" target-selector="#demo-table-control-annotate-footer">
              <dads-table-control
                id="demo-table-control-annotate-footer"
                class="table-control-annotate-demo__footer"
                variant="footer"
                items-per-page="10"
                page-size-options="10,50,100,200,500"
                page-size-label="表示件数"
                pagination-position="end"
              >
                <dads-page-navigation
                  id="demo-table-control-annotate-pagination"
                  slot="page-navigation"
                  as="button"
                  type="arrow"
                  size="s"
                  current="1"
                  total="120"
                  status-separator=" / "
                  disabled-prev
                ></dads-page-navigation>
              </dads-table-control>
            </a11y-annotate>
          </div>
        </div>
      </section>

      <section style="margin-bottom: 56px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">申請管理テーブル 連動デモ</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          状態ボタンで 4 状態（検索前 / 検索後 / 該当なし / 検索プリセット表示）を即時切替できます。
        </p>

        <div class="table-control-demo__scenarios" role="group" aria-label="状態切替">
          <dads-button
            type="button"
            size="x-small"
            variant="solid"
            data-table-control-scenario="before-search"
          >検索前</dads-button>
          <dads-button
            type="button"
            size="x-small"
            variant="outlined"
            data-table-control-scenario="after-search"
          >検索後</dads-button>
          <dads-button
            type="button"
            size="x-small"
            variant="outlined"
            data-table-control-scenario="empty-result"
          >該当なし</dads-button>
          <dads-button
            type="button"
            size="x-small"
            variant="outlined"
            data-table-control-scenario="preset-visible"
          >検索プリセット表示</dads-button>
        </div>

        <div id="demo-table-control-root" class="table-control-demo__preview table-control-municipal-demo__root">
            <dads-table-control
              id="demo-table-control-header"
              variant="header"
              query=""
              result-count="0"
              reset-label="リセット"
              popular-label="よく使う検索条件"
            >
              <div slot="actions" class="table-control-demo__actions">
                <dads-button type="button" size="small" variant="outlined">印刷</dads-button>
                <dads-button type="button" size="small" variant="outlined">CSV出力</dads-button>
                <dads-button
                  id="demo-table-control-create-open"
                  type="button"
                  size="small"
                  variant="solid"
                >新規追加</dads-button>
              </div>

              <div id="demo-table-control-presets" slot="presets" class="table-control-demo__presets">
                <dads-chip-tag action="none" value="補助金" data-query="補助金">補助金</dads-chip-tag>
                <dads-chip-tag action="none" value="住民" data-query="住民">住民</dads-chip-tag>
                <dads-chip-tag action="none" value="審査中" data-query="審査中">審査中</dads-chip-tag>
              </div>
            </dads-table-control>

            <p id="demo-table-control-summary" style="font-size: 14px; color: #4b5563; margin: 0;"></p>

            <dads-table hover sort-behavior="dom">
              <table data-cell-border="bottom" class="table-control-demo__table">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">タイトル</th>
                    <th scope="col">担当部署</th>
                    <th scope="col">分類</th>
                    <th scope="col" data-sort-type="date">
                      <button type="button" data-sort>更新日</button>
                    </th>
                    <th scope="col">状態</th>
                  </tr>
                </thead>
                <tbody id="demo-table-control-body"></tbody>
              </table>
            </dads-table>

            <p id="demo-table-control-empty" hidden style="margin: 0; color: #b91c1c; font-weight: 700;">
              条件に一致するデータは見つかりませんでした。
            </p>

            <dads-table-control
              id="demo-table-control-footer"
              variant="footer"
              items-per-page="10"
              page-size-options="10,50,100"
              page-size-label="表示件数"
              pagination-position="end"
            >
              <dads-page-navigation
                id="demo-table-control-pagination"
                slot="page-navigation"
                as="button"
                current="1"
                total="1"
                prev-label="前へ"
                next-label="次へ"
                status-separator=" / "
              ></dads-page-navigation>
            </dads-table-control>

            <dads-dialog
              id="demo-table-control-create-dialog"
              close-button
              close-label="閉じる"
              size="m"
              aria-label="新規データ追加"
            >
              <span slot="title" style="font-size: 1.5rem; font-weight: 700;">新規追加</span>
              <div class="table-control-demo__dialog-form">
                <dads-input-text
                  id="demo-table-control-create-title"
                  label="タイトル"
                  required
                  error-text="タイトルを入力してください。"
                ></dads-input-text>
                <dads-select id="demo-table-control-create-department" label="担当部署" size="md full">
                  <option value="デジタル推進課">デジタル推進課</option>
                  <option value="地域連携課">地域連携課</option>
                  <option value="統計管理課">統計管理課</option>
                  <option value="総務課">総務課</option>
                </dads-select>
                <dads-select id="demo-table-control-create-category" label="分類" size="md full">
                  <option value="申請">申請</option>
                  <option value="審査">審査</option>
                  <option value="交付">交付</option>
                  <option value="公開">公開</option>
                </dads-select>
                <dads-select id="demo-table-control-create-status" label="状態" size="md full">
                  <option value="受付中">受付中</option>
                  <option value="確認中">確認中</option>
                  <option value="審査完了">審査完了</option>
                  <option value="公開中">公開中</option>
                </dads-select>
              </div>
              <div slot="footer" class="table-control-demo__dialog-footer">
                <dads-button id="demo-table-control-create-cancel" type="button" variant="outlined">キャンセル</dads-button>
                <dads-button id="demo-table-control-create-save" type="button">追加する</dads-button>
              </div>
            </dads-dialog>
          </div>
      </section>

      <section style="margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">自治体届出者テーブル</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          状態ボタンで 3 状態（検索前 / 検索後 / 該当なし）を即時切替できます。
        </p>

        <div class="table-control-municipal-demo__scenarios" role="group" aria-label="状態切替">
          <dads-button
            type="button"
            size="x-small"
            variant="solid"
            data-table-control-municipal-scenario="before-search"
          >検索前</dads-button>
          <dads-button
            type="button"
            size="x-small"
            variant="outlined"
            data-table-control-municipal-scenario="after-search"
          >検索後</dads-button>
          <dads-button
            type="button"
            size="x-small"
            variant="outlined"
            data-table-control-municipal-scenario="empty-result"
          >該当なし</dads-button>
        </div>

        <div id="demo-table-control-municipal-root" class="table-control-municipal-demo__root">
              <p class="table-control-municipal-demo__title">自治体届出者</p>
              <hr class="table-control-municipal-demo__title-divider">

              <div class="table-control-municipal-demo__controls">
                <div class="table-control-municipal-demo__search-group">
                  <dads-search-box
                    id="demo-municipal-search"
                    class="table-control-municipal-demo__search-box"
                    aria-label="検索"
                    button-label="検索"
                  ></dads-search-box>
                  <span id="demo-municipal-count">1,200 件</span>
                  <button id="demo-municipal-reset" type="button" aria-hidden="true" tabindex="-1">リセット</button>
                </div>

                <div class="table-control-municipal-demo__actions">
                  <dads-button id="demo-municipal-print" type="button" size="small" variant="outlined">
                    <svg slot="icon-start" class="table-control-municipal-demo__icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 2h10v4h3a2 2 0 0 1 2 2v6h-3v8H5v-8H2V8a2 2 0 0 1 2-2h3V2Zm2 2v2h6V4H9Zm8 16v-6H7v6h10Zm2-8h1V8H4v4h1v-2h14v2Z"></path>
                    </svg>
                    印刷
                  </dads-button>
                  <dads-button id="demo-municipal-csv" type="button" size="small" variant="outlined">CSVダウンロード</dads-button>
                  <span class="table-control-municipal-demo__action-divider" aria-hidden="true"></span>
                  <dads-button id="demo-municipal-create" type="button" size="small" variant="outlined">
                    <svg slot="icon-start" class="table-control-municipal-demo__icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z"></path>
                    </svg>
                    新規追加
                  </dads-button>
                </div>
              </div>

              <dads-table size="dense">
                <table data-border data-cell-border class="table-control-municipal-demo__table">
                  <colgroup>
                    <col style="width: 18%;">
                    <col style="width: 18%;">
                    <col style="width: 18%;">
                    <col style="width: 10%;">
                    <col style="width: 18%;">
                    <col style="width: 18%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">氏名</th>
                      <th scope="col">申請番号</th>
                      <th scope="col">ステータス</th>
                      <th scope="col">申請種別</th>
                      <th scope="col">申請日</th>
                    </tr>
                  </thead>
                  <tbody id="demo-municipal-tbody"></tbody>
                </table>
              </dads-table>

              <dads-table-control
                id="demo-municipal-footer"
                variant="footer"
                items-per-page="10"
                page-size-options="10,50,100"
                page-size-label="表示件数"
                pagination-position="start"
              >
                <dads-page-navigation
                  id="demo-municipal-pagination"
                  slot="page-navigation"
                  as="button"
                  type="arrow"
                  size="s"
                  current="1"
                  total="120"
                  status-separator=" / "
                  disabled-prev
                ></dads-page-navigation>
              </dads-table-control>

              <dads-dialog
                id="demo-municipal-create-dialog"
                close-button
                close-label="閉じる"
                size="m"
                aria-label="自治体届出の新規追加"
              >
                <span slot="title" style="font-size: 1.5rem; font-weight: 700;">新規追加</span>
                <div class="table-control-municipal-demo__dialog-form">
                  <dads-input-text
                    id="demo-municipal-create-request-type"
                    label="申請名"
                    required
                    error-text="申請名を入力してください。"
                  ></dads-input-text>
                  <dads-input-text
                    id="demo-municipal-create-applicant-name"
                    label="氏名"
                    required
                    error-text="氏名を入力してください。"
                  ></dads-input-text>
                  <dads-select id="demo-municipal-create-status" label="ステータス" size="md full">
                    <option value="要連絡">要連絡</option>
                    <option value="完了">完了</option>
                    <option value="進行中">進行中</option>
                  </dads-select>
                  <dads-select id="demo-municipal-create-application-type" label="申請種別" size="md full">
                    <option value="電子">電子</option>
                    <option value="紙">紙</option>
                  </dads-select>
                </div>
                <div slot="footer" class="table-control-municipal-demo__dialog-footer">
                  <dads-button id="demo-municipal-create-cancel" type="button" variant="outlined">キャンセル</dads-button>
                  <dads-button id="demo-municipal-create-save" type="button">追加する</dads-button>
                </div>
              </dads-dialog>
          </div>
      </section>

      <section style="margin-top: 56px; margin-bottom: 0;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">申請者一覧テーブル 検索プリセット</h3>
        <p style="font-size: 14px; color: #666; margin: 0 0 16px;">
          よくある検索ワード、選択行の一括操作、行ごとの編集・削除をまとめて確認できる作例です。
        </p>

        <div id="demo-table-control-preset-root" class="table-control-preset-demo__root table-control-municipal-demo__root">
              <p class="table-control-preset-demo__title">申請者一覧</p>
              <hr class="table-control-preset-demo__title-divider">

              <div class="table-control-preset-demo__controls">
                <div class="table-control-preset-demo__search-group">
                  <dads-search-box
                    id="demo-preset-search"
                    class="table-control-preset-demo__search-box"
                    aria-label="申請者を検索"
                    button-label="検索"
                  ></dads-search-box>
                  <span id="demo-preset-count">120 件</span>
                  <button id="demo-preset-reset" type="button" aria-hidden="true" tabindex="-1">リセット</button>
                </div>

                <div class="table-control-preset-demo__popular">
                  <span class="table-control-preset-demo__popular-label">よくある検索：</span>
                  <div id="demo-preset-presets" style="display: flex; gap: 16px; flex-wrap: wrap;">
                    <dads-chip-tag class="table-control-preset-demo__chip" action="none" value="マイナンバーカード" data-query="マイナンバーカード">
                      マイナンバーカード
                    </dads-chip-tag>
                    <dads-chip-tag class="table-control-preset-demo__chip" action="none" value="パスポート" data-query="パスポート">
                      パスポート
                    </dads-chip-tag>
                  </div>
                </div>
              </div>

              <div id="demo-preset-bulk-bar" class="table-control-preset-demo__bulk-bar" hidden aria-hidden="true">
                <span id="demo-preset-bulk-status" aria-live="polite">0件選択中</span>
                <select id="demo-preset-bulk-status-select" aria-label="一括更新するステータス">
                  <option value="要連絡">要連絡</option>
                  <option value="完了">完了</option>
                  <option value="進行中" selected>進行中</option>
                </select>
                <dads-button id="demo-preset-bulk-apply" type="button" size="small">一括更新</dads-button>
                <dads-button id="demo-preset-bulk-delete" type="button" size="small" variant="outlined">選択行を削除</dads-button>
              </div>

              <dads-table id="demo-preset-table" selectable hover size="dense">
                <table data-border data-cell-border class="table-control-preset-demo__table">
                  <colgroup>
                    <col style="width: 7%;">
                    <col style="width: 20%;">
                    <col style="width: 24%;">
                    <col style="width: 12%;">
                    <col style="width: 16%;">
                    <col style="width: 16.5%;">
                    <col style="width: 4.5%;">
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">
                        <label class="dads-checkbox" data-size="sm">
                          <span class="dads-checkbox__checkbox">
                            <input class="dads-checkbox__input" type="checkbox" data-select-all aria-label="表示中の行をすべて選択">
                          </span>
                        </label>
                      </th>
                      <th scope="col">氏名</th>
                      <th scope="col">申請番号</th>
                      <th scope="col">ステータス</th>
                      <th scope="col">申請種別</th>
                      <th scope="col">申請日</th>
                      <th scope="col" data-actions-col>操作</th>
                    </tr>
                  </thead>
                  <tbody id="demo-preset-tbody"></tbody>
                </table>
              </dads-table>

              <dads-table-control
                id="demo-preset-footer"
                variant="footer"
                items-per-page="10"
                page-size-options="10,50,100"
                page-size-label="表示件数"
                pagination-position="end"
              >
                <dads-page-navigation
                  id="demo-preset-pagination"
                  slot="page-navigation"
                  as="button"
                  type="arrow"
                  size="s"
                  current="1"
                  total="12"
                  status-separator=" / "
                ></dads-page-navigation>
              </dads-table-control>

              <dads-dialog
                id="demo-preset-edit-dialog"
                close-button
                close-label="閉じる"
                size="m"
                initial-focus="title"
                aria-label="申請者情報の編集"
              >
                <span slot="title" style="font-size: 1.5rem; font-weight: 700;">申請者情報を編集</span>
                <div class="table-control-preset-demo__dialog-form">
                  <dads-input-text
                    id="demo-preset-edit-name"
                    label="氏名"
                    required
                    error-text="氏名を入力してください。"
                  ></dads-input-text>
                  <dads-select id="demo-preset-edit-status" label="ステータス" size="md full">
                    <option value="要連絡">要連絡</option>
                    <option value="完了">完了</option>
                    <option value="進行中">進行中</option>
                  </dads-select>
                  <dads-select id="demo-preset-edit-type" label="申請種別" size="md full">
                    <option value="マイナンバーカード">マイナンバーカード</option>
                    <option value="パスポート">パスポート</option>
                    <option value="住民票">住民票</option>
                  </dads-select>
                  <dads-input-text
                    id="demo-preset-edit-date"
                    label="申請日"
                    required
                    support-text="YYYY年M月D日"
                    error-text="申請日を YYYY年M月D日 形式で入力してください。"
                  ></dads-input-text>
                </div>
                <div slot="footer" class="table-control-preset-demo__dialog-footer">
                  <dads-button id="demo-preset-edit-cancel" type="button" variant="outlined">キャンセル</dads-button>
                  <dads-button id="demo-preset-edit-save" type="button">保存する</dads-button>
                </div>
              </dads-dialog>

              <dads-dialog
                id="demo-preset-delete-dialog"
                close-button
                close-label="閉じる"
                size="s"
                initial-focus="title"
                aria-label="選択行の削除確認"
              >
                <span slot="title" style="font-size: 1.5rem; font-weight: 700;">選択行を削除しますか</span>
                <p style="margin: 0; color: #4b5563; line-height: 1.7;">この操作は取り消せません。</p>
                <div slot="footer" class="table-control-preset-demo__dialog-footer">
                  <dads-button id="demo-preset-delete-cancel" type="button" variant="outlined">キャンセル</dads-button>
                  <dads-button id="demo-preset-delete-confirm" type="button">削除する</dads-button>
                </div>
              </dads-dialog>
          </div>
      </section>

      <section style="margin-top: 56px;">
        <h3 style="font-size: 20px; margin-bottom: 16px; color: #333;">Usage (HTML)</h3>
        <dads-code-block>
          <template>
<dads-table-control variant="header" result-count="120" popular-label="よくある検索：">
  <div slot="presets">
    <dads-chip-tag action="none" value="マイナンバーカード">マイナンバーカード</dads-chip-tag>
    <dads-chip-tag action="none" value="パスポート">パスポート</dads-chip-tag>
  </div>
</dads-table-control>

<dads-table-control
  variant="footer"
  items-per-page="10"
  page-size-options="10,50,100"
  page-size-label="表示件数"
  pagination-position="end"
>
  <dads-page-navigation slot="page-navigation" as="button" type="arrow" current="1" total="12"></dads-page-navigation>
</dads-table-control>
          </template>
        </dads-code-block>
      </section>

    </div>

    <script type="module">
      await Promise.all([
        import('dads-table-control'),
        import('dads-table'),
        import('dads-page-navigation'),
        import('dads-chip-tag'),
        import('dads-button'),
        import('dads-dialog'),
        import('dads-input-text'),
        import('dads-select'),
        import('dads-search-box'),
        import('dads-switch'),
        import('dads-chip-label'),
        import('dads-menu-list-box'),
        import('dads-code-block'),
        import('a11y-annotate'),
      ]);

      const [{ mountTableControlDemo }, { mountTableControlMunicipalDemo }, { mountTableControlPresetDemo }] = await Promise.all([
        import('./src/demos/table-control-mvc.js'),
        import('./src/demos/table-control-municipal-mvc.js'),
        import('./src/demos/table-control-preset-mvc.js'),
      ]);

      const root = document.querySelector('#demo-table-control-root');
      if (root) mountTableControlDemo(root);

      const municipalRoot = document.querySelector('#demo-table-control-municipal-root');
      if (municipalRoot) mountTableControlMunicipalDemo(municipalRoot);

      const presetRoot = document.querySelector('#demo-table-control-preset-root');
      if (presetRoot) mountTableControlPresetDemo(presetRoot);
    <\/script>
  `,
} as const;
