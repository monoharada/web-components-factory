/**
 * @module file-upload
 * デジタル庁デザインシステム File Upload / Drop Area コンポーネント
 * @version 1.0.0
 */

import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import {
  setDefaultAttributes,
  setupSlotChangeListeners,
  updateLabelFallback,
  updateSupportFallback,
  updateErrorFallback,
  updateRequirement,
} from '../../utils/form-component-helpers.js';
import { ensurePrefixedElement, getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { defineButton } from '../button/button-define.js';
import { defineCheckbox } from '../checkbox/checkbox-define.js';
import { fileUploadTokens } from './file-upload-tokens.js';
import { fileUploadStyles } from './file-upload-styles.js';

export type DadsFileUploadSource = 'input' | 'drop' | 'api';
export type DadsFileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';
export type DadsFileUploadErrorCode = 'required' | 'accept' | 'max-files' | 'max-file-size';
export type DadsFileUploadMode = 'drop-area' | 'button-only';

export interface DadsFileUploadItemSnapshot {
  id: string;
  file: File;
  status: DadsFileUploadStatus;
  message?: string;
  valid: boolean;
}

export interface DadsFileUploadBeforeAddDetail {
  source: DadsFileUploadSource;
  files: readonly File[];
  currentItems: readonly DadsFileUploadItemSnapshot[];
  replace: boolean;
}

export interface DadsFileUploadChangeDetail {
  source: DadsFileUploadSource;
  items: readonly DadsFileUploadItemSnapshot[];
  added: readonly DadsFileUploadItemSnapshot[];
  removedIds: readonly string[];
}

export interface DadsFileUploadValidationErrorDetail {
  source: DadsFileUploadSource;
  code: DadsFileUploadErrorCode;
  message: string;
  fileName?: string;
  itemId?: string;
}

export interface DadsFileUploadRequestDetail {
  source: 'api';
  ids: readonly string[];
  items: readonly DadsFileUploadItemSnapshot[];
}

export interface DadsFileUploadFullscreenChangeDetail {
  enabled: boolean;
}

type DadsFileUploadInternalItem = DadsFileUploadItemSnapshot & {
  source: DadsFileUploadSource;
};

type AddFilesOptions = {
  source?: DadsFileUploadSource;
  replace?: boolean;
};

type SetFileStatePatch = Partial<Pick<DadsFileUploadItemSnapshot, 'status' | 'message' | 'valid'>>;

const STATUS_LABELS: Record<DadsFileUploadStatus, string> = {
  idle: '',
  uploading: 'アップロード中',
  success: '完了',
  error: '',
};

function normalizeFiles(input: FileList | readonly File[] | Iterable<File>): File[] {
  if (Array.isArray(input)) {
    return input.filter((file): file is File => file instanceof File);
  }

  if (typeof FileList !== 'undefined' && input instanceof FileList) {
    return Array.from(input);
  }

  if (typeof input === 'object' && input !== null && Symbol.iterator in input) {
    const files: File[] = [];
    for (const file of input as Iterable<File>) {
      if (file instanceof File) files.push(file);
    }
    return files;
  }

  return [];
}

function hasFilesData(event: DragEvent): boolean {
  const dt = event.dataTransfer;
  if (!dt) return false;
  if (dt.files && dt.files.length > 0) return true;
  const types = dt.types ? Array.from(dt.types) : [];
  return types.includes('Files');
}

function parsePositiveInteger(value: string | null): number | null {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function parseByteSize(value: string | null): number | null {
  if (!value) return null;
  const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i);
  if (!m) return null;

  const raw = Number.parseFloat(m[1]);
  if (!Number.isFinite(raw) || raw <= 0) return null;

  const unit = (m[2] ?? 'b').toLowerCase();
  const base = unit === 'kb' ? 1024 : unit === 'mb' ? 1024 ** 2 : unit === 'gb' ? 1024 ** 3 : 1;
  return Math.floor(raw * base);
}

function formatFileSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) return '0 B';
  if (size < 1024) return `${size} B`;
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(1)} MB`;
  return `${(size / 1024 ** 3).toFixed(1)} GB`;
}

function formatCompactFileSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) return '0B';
  if (size < 1024) return `${size}B`;
  if (size < 1024 ** 2) return `${Math.round(size / 1024)}KB`;
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(1).replace(/\.0$/, '')}MB`;
  return `${(size / 1024 ** 3).toFixed(1).replace(/\.0$/, '')}GB`;
}

function formatBytesWithLocale(size: number): string {
  if (!Number.isFinite(size) || size < 0) return '0';
  return new Intl.NumberFormat('ja-JP').format(size);
}

function parseAcceptTokens(accept: string | null): string[] {
  if (!accept) return [];
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0);
}

function fileMatchesAccept(file: File, tokens: readonly string[]): boolean {
  if (tokens.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token === '*/*') return true;
    if (token.startsWith('.')) return fileName.endsWith(token);
    if (token.endsWith('/*')) {
      const prefix = token.slice(0, token.length - 1);
      return fileType.startsWith(prefix);
    }
    return fileType === token;
  });
}

function findClosestElementInPath(path: EventTarget[], predicate: (node: EventTarget) => boolean): boolean {
  for (const node of path) {
    if (predicate(node)) return true;
  }
  return false;
}

/**
 * File Upload / Drop Area コンポーネント
 *
 * @customElement
 * @tagname dads-file-upload
 *
 * @slot label - ラベルテキスト
 * @slot support-text - サポートテキスト
 * @slot error-text - エラーメッセージ
 *
 * @csspart wrapper - 全体ラッパー
 * @csspart label - ラベル要素
 * @csspart label-text - ラベルテキストラッパー
 * @csspart requirement - 要否ラベル（※必須）
 * @csspart support-text - サポートテキスト
 * @csspart dropzone - ドロップエリア
 * @csspart drop-main - ボタン+ヒント行
 * @csspart input - ネイティブ input[type=file]
 * @csspart browse-button - ファイル選択ボタン
 * @csspart drop-hint - ドラッグ&ドロップ案内
 * @csspart selection-summary - 選択中ファイル数/合計サイズ
 * @csspart expand-checkbox - 全画面ドロップ領域拡大チェック
 * @csspart error-text - エラーメッセージ
 * @csspart empty-text - 未選択メッセージ
 * @csspart file-list - ファイル一覧
 * @csspart file-item - ファイル行
 * @csspart remove-button - 解除ボタン
 * @csspart file-index - ファイル番号
 * @csspart file-name - ファイル名
 * @csspart file-meta - 補足情報（サイズ）
 * @csspart file-status - 状態ラベル
 * @csspart file-item-error - ファイル単位エラーメッセージ
 * @csspart file-item-error-line - ファイル単位エラーメッセージ行
 * @csspart overlay - 全画面ドロップオーバーレイ
 * @csspart overlay-text - オーバーレイ文言
 *
 * @attr {string} label - ラベル（slot未使用時のフォールバック）
 * @attr {string} support-text - サポートテキスト（slot未使用時のフォールバック）
 * @attr {boolean} required - 必須
 * @attr {boolean} disabled - 無効化
 * @attr {string} name - フォーム名
 * @attr {string} accept - 許可するファイル形式（input accept互換）
 * @attr {boolean} multiple - 複数選択
 * @attr {string} max-files - 最大ファイル数
 * @attr {string} max-file-size - 最大ファイルサイズ（bytes / kb / mb / gb）
 * @attr {boolean} error - エラー状態
 * @attr {string} error-text - エラーメッセージ（slot未使用時のフォールバック）
 * @attr {string} browse-label - ファイル選択ボタン文言
 * @attr {string} drop-hint - ドロップヒント文言
 * @attr {string} empty-text - 未選択文言
 * @attr {string} mode - 表示モード（drop-area | button-only）
 * @attr {string} expand-label - 全画面ドロップ領域拡大チェック文言
 * @attr {string} overlay-text - 全画面オーバーレイ文言
 *
 * @fires dads-file-upload-before-add - ファイル追加前（cancelable）
 * @fires dads-file-upload-change - ファイル一覧変更時
 * @fires dads-file-upload-validation-error - バリデーションエラー時
 * @fires dads-file-upload-request - requestUpload() 呼び出し時
 * @fires dads-file-upload-fullscreen-change - 全画面ドロップ切り替え時
 */
export class DadsFileUpload extends TypographyFormComponent {
  static override readonly formAssociated = true;
  static #fullscreenDropOwner: DadsFileUpload | null = null;

  static definition = {
    name: 'dads-file-upload',
    template: html`
      <div part="wrapper" id="wrapper">
        <label part="label" id="label" for="file-input">
          <span part="label-text" id="label-text">
            <slot name="label" id="label-slot"></slot>
            <span id="label-fallback"></span>
          </span>
          <span part="requirement" id="requirement"></span>
        </label>

        <div part="support-text" id="support-text">
          <slot name="support-text" id="support-slot"></slot>
          <span id="support-fallback"></span>
        </div>

        <div part="dropzone" id="dropzone">
          <div part="drop-main" id="drop-main">
            <input part="input" id="file-input" type="file" hidden />
            <dads-button part="browse-button" id="browse-button" type="button" variant="outlined" size="medium">
              ファイルを選択
            </dads-button>
            <span part="drop-hint" id="drop-hint">または、このエリア内にドラッグ＆ドロップ</span>
          </div>

          <div part="selection-summary" id="selection-summary" hidden></div>

          <div part="error-text" id="error-text">
            <slot name="error-text" id="error-slot"></slot>
            <span id="error-fallback"></span>
          </div>

          <dads-checkbox
            part="expand-checkbox"
            id="expand-checkbox"
            size="md"
            label="ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる"
          ></dads-checkbox>
        </div>

        <p part="empty-text" id="empty-text">ファイルが選択されていません</p>

        <ul part="file-list" id="file-list"></ul>
      </div>

      <div part="overlay" id="overlay" hidden aria-hidden="true">
        <p part="overlay-text" id="overlay-text">このエリア内にファイルをドラッグ＆ドロップ</p>
      </div>
    `,
    styles: withReset(
      [
        applyDADSTokens(),
        applySpacingTokens(),
        fileUploadTokens,
        fileUploadStyles,
        applyDADSFocusStyles(),
      ],
      'minimal'
    ),
    attributes: [
      PropertyAttr('label'),
      PropertyAttr('support-text'),
      BooleanAttr('required'),
      BooleanAttr('disabled'),
      PropertyAttr('name'),
      PropertyAttr('accept'),
      BooleanAttr('multiple'),
      PropertyAttr('max-files'),
      PropertyAttr('max-file-size'),
      BooleanAttr('error'),
      PropertyAttr('error-text'),
      PropertyAttr('browse-label'),
      PropertyAttr('drop-hint'),
      PropertyAttr('empty-text'),
      PropertyAttr('mode'),
      PropertyAttr('expand-label'),
      PropertyAttr('overlay-text'),
    ],
  };

  #labelSlot: HTMLSlotElement | null = null;
  #supportSlot: HTMLSlotElement | null = null;
  #errorSlot: HTMLSlotElement | null = null;

  #labelFallback: HTMLElement | null = null;
  #supportText: HTMLElement | null = null;
  #supportFallback: HTMLElement | null = null;
  #errorText: HTMLElement | null = null;
  #errorFallback: HTMLElement | null = null;
  #requirement: HTMLElement | null = null;

  #dropzone: HTMLElement | null = null;
  #fileInput: HTMLInputElement | null = null;
  #browseButton: HTMLElement | null = null;
  #dropHint: HTMLElement | null = null;
  #selectionSummary: HTMLElement | null = null;
  #expandCheckbox: HTMLElement | null = null;
  #emptyText: HTMLElement | null = null;
  #fileList: HTMLUListElement | null = null;
  #overlay: HTMLElement | null = null;
  #overlayText: HTMLElement | null = null;

  #items: DadsFileUploadInternalItem[] = [];
  #idSequence = 0;
  #managedError = false;
  #formDisabled = false;

  #expandDropAreaEnabled = false;
  #dropzoneDragDepth = 0;
  #windowDragDepth = 0;
  #windowDndBound = false;

  connectedCallback(): void {
    super.connectedCallback();

    const prefix = getPrefixFromLocalName(this.localName, '-file-upload');
    defineButton(prefix);
    defineCheckbox(prefix);

    setDefaultAttributes(this, {
      'browse-label': 'ファイルを選択',
      'drop-hint': 'または、このエリア内にドラッグ＆ドロップ',
      'empty-text': 'ファイルが選択されていません',
      'expand-label': 'ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる',
      'overlay-text': 'このエリア内にファイルをドラッグ＆ドロップ',
    });

    this.#labelSlot = this.shadowRoot?.querySelector('#label-slot') as HTMLSlotElement | null;
    this.#supportSlot = this.shadowRoot?.querySelector('#support-slot') as HTMLSlotElement | null;
    this.#errorSlot = this.shadowRoot?.querySelector('#error-slot') as HTMLSlotElement | null;

    this.#labelFallback = this.shadowRoot?.querySelector('#label-fallback') as HTMLElement | null;
    this.#supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement | null;
    this.#supportFallback = this.shadowRoot?.querySelector('#support-fallback') as HTMLElement | null;
    this.#errorText = this.shadowRoot?.querySelector('#error-text') as HTMLElement | null;
    this.#errorFallback = this.shadowRoot?.querySelector('#error-fallback') as HTMLElement | null;
    this.#requirement = this.shadowRoot?.querySelector('#requirement') as HTMLElement | null;

    this.#dropzone = this.shadowRoot?.querySelector('#dropzone') as HTMLElement | null;
    this.#fileInput = this.shadowRoot?.querySelector('#file-input') as HTMLInputElement | null;
    this.#browseButton = this.shadowRoot
      ? ensurePrefixedElement(this.shadowRoot, 'browse-button', `${prefix}-button`)
      : null;
    this.#dropHint = this.shadowRoot?.querySelector('#drop-hint') as HTMLElement | null;
    this.#selectionSummary = this.shadowRoot?.querySelector('#selection-summary') as HTMLElement | null;
    this.#expandCheckbox = this.shadowRoot
      ? ensurePrefixedElement(this.shadowRoot, 'expand-checkbox', `${prefix}-checkbox`)
      : null;
    this.#emptyText = this.shadowRoot?.querySelector('#empty-text') as HTMLElement | null;
    this.#fileList = this.shadowRoot?.querySelector('#file-list') as HTMLUListElement | null;
    this.#overlay = this.shadowRoot?.querySelector('#overlay') as HTMLElement | null;
    this.#overlayText = this.shadowRoot?.querySelector('#overlay-text') as HTMLElement | null;

    setupSlotChangeListeners(
      {
        label: this.#labelSlot,
        support: this.#supportSlot,
        error: this.#errorSlot,
      },
      {
        onLabelChange: () =>
          updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label')),
        onSupportChange: () => {
          updateSupportFallback(
            this.#supportSlot,
            this.#supportText,
            this.#supportFallback,
            this.getAttribute('support-text')
          );
          this.#syncAriaDescribedBy();
        },
        onErrorChange: () => {
          updateErrorFallback(
            this.#errorSlot,
            this.#errorText,
            this.#errorFallback,
            this.getAttribute('error-text'),
            this.hasAttribute('error')
          );
          this.#syncAriaDescribedBy();
        },
      }
    );

    this.#setupEventListeners();
    this.#syncAllState();

    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.#syncAllState();
    });
  }

  disconnectedCallback(): void {
    if (DadsFileUpload.#fullscreenDropOwner === this) {
      DadsFileUpload.#fullscreenDropOwner = null;
    }
    this.#teardownEventListeners();
    this.#detachWindowDragListeners();
    this.#windowDragDepth = 0;
    this.#hideOverlay();

    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (oldValue === newValue) return;

    switch (name) {
      case 'label':
        updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label'));
        break;
      case 'support-text':
        updateSupportFallback(
          this.#supportSlot,
          this.#supportText,
          this.#supportFallback,
          this.getAttribute('support-text')
        );
        this.#syncAriaDescribedBy();
        break;
      case 'required':
        updateRequirement(this.#requirement, this.hasAttribute('required'), false);
        this.#syncValidity();
        break;
      case 'error':
      case 'error-text':
        updateErrorFallback(
          this.#errorSlot,
          this.#errorText,
          this.#errorFallback,
          this.getAttribute('error-text'),
          this.hasAttribute('error')
        );
        this.#syncAriaDescribedBy();
        break;
      case 'accept':
      case 'multiple':
      case 'disabled':
      case 'browse-label':
      case 'drop-hint':
      case 'empty-text':
      case 'mode':
      case 'expand-label':
      case 'overlay-text':
        this.#syncAllState();
        break;
      case 'name':
        this.#syncFormValue();
        this.#syncValidity();
        break;
      default:
        break;
    }
  }

  get items(): readonly DadsFileUploadItemSnapshot[] {
    return this.#items.map((item) => this.#toSnapshot(item));
  }

  addFiles(files: FileList | readonly File[] | Iterable<File>, options?: AddFilesOptions): DadsFileUploadItemSnapshot[] {
    if (this.#isDisabled()) return [];

    const source = options?.source ?? 'api';
    const incoming = normalizeFiles(files);
    if (incoming.length === 0) return [];

    const replace = options?.replace ?? !this.hasAttribute('multiple');
    const normalized = this.hasAttribute('multiple') ? incoming : [incoming[incoming.length - 1]];

    const beforeDetail: DadsFileUploadBeforeAddDetail = {
      source,
      files: normalized,
      currentItems: this.items,
      replace,
    };

    if (!this.emitEvent<DadsFileUploadBeforeAddDetail>('dads-file-upload-before-add', beforeDetail)) {
      return [];
    }

    const removedIds = replace ? this.#items.map((item) => item.id) : [];
    let nextItems = replace ? [] : [...this.#items];

    let validCount = nextItems.filter((item) => item.valid).length;
    const maxFiles = parsePositiveInteger(this.getAttribute('max-files'));
    const maxSize = parseByteSize(this.getAttribute('max-file-size'));
    const acceptTokens = parseAcceptTokens(this.getAttribute('accept'));

    const added: DadsFileUploadInternalItem[] = [];

    for (const file of normalized) {
      const validation = this.#validateFile(file, {
        acceptTokens,
        maxFiles,
        maxSize,
        validCount,
      });

      const item: DadsFileUploadInternalItem = {
        id: this.#nextItemId(),
        file,
        source,
        valid: validation.valid,
        status: validation.valid ? 'idle' : 'error',
        message: validation.messages.length > 0 ? validation.messages.join('\n') : undefined,
      };

      added.push(item);
      nextItems.push(item);

      if (item.valid) {
        validCount += 1;
      } else {
        for (const error of validation.errors) {
          this.emitEvent<DadsFileUploadValidationErrorDetail>('dads-file-upload-validation-error', {
            source,
            code: error.code,
            message: error.message,
            fileName: file.name,
            itemId: item.id,
          });
        }
      }
    }

    this.#items = nextItems;
    this.#syncDerivedState();

    const detail: DadsFileUploadChangeDetail = {
      source,
      items: this.items,
      added: added.map((item) => this.#toSnapshot(item)),
      removedIds,
    };
    this.emitEvent<DadsFileUploadChangeDetail>('dads-file-upload-change', detail);

    return detail.added.slice();
  }

  removeFile(id: string): void {
    if (this.#isDisabled()) return;

    const beforeLength = this.#items.length;
    const nextItems = this.#items.filter((item) => item.id !== id);
    if (nextItems.length === beforeLength) return;

    this.#items = nextItems;
    this.#syncDerivedState();

    this.emitEvent<DadsFileUploadChangeDetail>('dads-file-upload-change', {
      source: 'api',
      items: this.items,
      added: [],
      removedIds: [id],
    });
  }

  clearFiles(): void {
    if (this.#items.length === 0) return;

    const removedIds = this.#items.map((item) => item.id);
    this.#items = [];
    this.#syncDerivedState();

    this.emitEvent<DadsFileUploadChangeDetail>('dads-file-upload-change', {
      source: 'api',
      items: this.items,
      added: [],
      removedIds,
    });
  }

  setFileState(id: string, patch: SetFileStatePatch): void {
    const index = this.#items.findIndex((item) => item.id === id);
    if (index < 0) return;

    const current = this.#items[index];
    const next: DadsFileUploadInternalItem = {
      ...current,
      status: patch.status ?? current.status,
      valid: typeof patch.valid === 'boolean' ? patch.valid : current.valid,
      message: typeof patch.message === 'string' ? patch.message : current.message,
    };

    this.#items[index] = next;
    this.#syncDerivedState();

    this.emitEvent<DadsFileUploadChangeDetail>('dads-file-upload-change', {
      source: 'api',
      items: this.items,
      added: [],
      removedIds: [],
    });
  }

  requestUpload(ids?: readonly string[]): boolean {
    const selected = ids && ids.length > 0
      ? this.#items.filter((item) => ids.includes(item.id) && item.valid)
      : this.#items.filter((item) => item.valid);

    if (this.hasAttribute('required') && selected.length === 0) {
      const message = 'ファイルを選択してください';
      this.#setManagedError(message);
      this.emitEvent<DadsFileUploadValidationErrorDetail>('dads-file-upload-validation-error', {
        source: 'api',
        code: 'required',
        message,
      });
      return false;
    }

    if (selected.length === 0) return false;

    this.#clearManagedError();

    const detail: DadsFileUploadRequestDetail = {
      source: 'api',
      ids: selected.map((item) => item.id),
      items: selected.map((item) => this.#toSnapshot(item)),
    };

    return this.emitEvent<DadsFileUploadRequestDetail>('dads-file-upload-request', detail);
  }

  focus(options?: FocusOptions): void {
    this.#browseButton?.focus(options);
  }

  blur(): void {
    this.#browseButton?.blur();
  }

  formResetCallback(): void {
    this.clearFiles();
    this.#clearManagedError();
    this.#syncValidity();
  }

  formStateRestoreCallback(_state: unknown, _mode: unknown): void {
    // Fileオブジェクトの復元は行わない
  }

  formDisabledCallback(disabled: boolean): void {
    super.formDisabledCallback(disabled);
    this.#formDisabled = disabled;
    this.#syncDisabledState();
  }

  #setupEventListeners(): void {
    this.#browseButton?.addEventListener('click', this.#handleBrowseClick);
    this.#fileInput?.addEventListener('change', this.#handleInputChange);

    this.#dropzone?.addEventListener('dragenter', this.#handleDropzoneDragEnter);
    this.#dropzone?.addEventListener('dragover', this.#handleDropzoneDragOver);
    this.#dropzone?.addEventListener('dragleave', this.#handleDropzoneDragLeave);
    this.#dropzone?.addEventListener('drop', this.#handleDropzoneDrop);

    this.#fileList?.addEventListener('click', this.#handleFileListClick);
    this.#expandCheckbox?.addEventListener('dads-change', this.#handleExpandCheckboxChange as EventListener);
  }

  #teardownEventListeners(): void {
    this.#browseButton?.removeEventListener('click', this.#handleBrowseClick);
    this.#fileInput?.removeEventListener('change', this.#handleInputChange);

    this.#dropzone?.removeEventListener('dragenter', this.#handleDropzoneDragEnter);
    this.#dropzone?.removeEventListener('dragover', this.#handleDropzoneDragOver);
    this.#dropzone?.removeEventListener('dragleave', this.#handleDropzoneDragLeave);
    this.#dropzone?.removeEventListener('drop', this.#handleDropzoneDrop);

    this.#fileList?.removeEventListener('click', this.#handleFileListClick);
    this.#expandCheckbox?.removeEventListener(
      'dads-change',
      this.#handleExpandCheckboxChange as EventListener
    );
  }

  #syncAllState(): void {
    updateLabelFallback(this.#labelSlot, this.#labelFallback, this.getAttribute('label'));
    updateSupportFallback(
      this.#supportSlot,
      this.#supportText,
      this.#supportFallback,
      this.getAttribute('support-text')
    );
    updateRequirement(this.#requirement, this.hasAttribute('required'), false);
    updateErrorFallback(
      this.#errorSlot,
      this.#errorText,
      this.#errorFallback,
      this.getAttribute('error-text'),
      this.hasAttribute('error')
    );

    this.#syncInputAttributes();
    this.#syncTextLabels();
    this.#syncModeState();
    this.#syncDisabledState();
    this.#syncAriaDescribedBy();
    this.#syncSelectionSummary();
    this.#renderFileList();
    this.#syncEmptyState();
    this.#syncFormValue();
    this.#syncValidity();
  }

  #syncDerivedState(): void {
    this.#syncManagedErrorFromItems();
    this.#syncSelectionSummary();
    this.#renderFileList();
    this.#syncEmptyState();
    this.#syncFormValue();
    this.#syncValidity();
  }

  #syncInputAttributes(): void {
    if (!this.#fileInput) return;

    this.#fileInput.accept = this.getAttribute('accept') ?? '';
    this.#fileInput.multiple = this.hasAttribute('multiple');
    this.#fileInput.disabled = this.#isDisabled();
  }

  #syncTextLabels(): void {
    const browseLabel = this.getAttribute('browse-label') ?? 'ファイルを選択';
    if (this.#browseButton) {
      this.#browseButton.textContent = browseLabel;
      this.#browseButton.setAttribute('aria-label', browseLabel);
    }

    if (this.#dropHint) {
      this.#dropHint.textContent = this.getAttribute('drop-hint') ?? '';
    }

    if (this.#emptyText) {
      this.#emptyText.textContent = this.getAttribute('empty-text') ?? '';
    }

    if (this.#overlayText) {
      this.#overlayText.textContent = this.getAttribute('overlay-text') ?? '';
    }

    if (this.#expandCheckbox) {
      this.#expandCheckbox.setAttribute(
        'label',
        this.getAttribute('expand-label') ?? 'ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる'
      );
    }
  }

  #syncDisabledState(): void {
    const isDisabled = this.#isDisabled();
    const supportsDropArea = this.#supportsDropArea();

    if (isDisabled && this.#expandDropAreaEnabled) {
      this.#toggleExpandDropArea(false, true);
    }

    if (this.#browseButton) {
      this.#browseButton.toggleAttribute('disabled', isDisabled);
    }

    if (this.#expandCheckbox) {
      this.#expandCheckbox.toggleAttribute('disabled', isDisabled || !supportsDropArea);
    }

    if (this.#dropzone) {
      this.#dropzone.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    }

    if (isDisabled || !supportsDropArea) {
      this.removeAttribute('data-dragover');
      this.#dropzoneDragDepth = 0;
      this.#hideOverlay();
    }

    this.#syncFileListDisabledState();
    this.#syncWindowDragListeners();
    this.#syncInputAttributes();
    this.#syncValidity();
  }

  #syncAriaDescribedBy(): void {
    const ids: string[] = [];

    const supportVisible =
      this.#supportText?.style.display !== 'none' &&
      Boolean((this.#supportSlot?.assignedNodes({ flatten: true }).length ?? 0) > 0 || this.getAttribute('support-text'));

    if (supportVisible) ids.push('support-text');
    if (this.hasAttribute('error')) ids.push('error-text');

    const describedBy = ids.join(' ');

    for (const el of [this.#dropzone, this.#browseButton, this.#fileInput]) {
      if (!el) continue;
      if (describedBy.length > 0) {
        el.setAttribute('aria-describedby', describedBy);
      } else {
        el.removeAttribute('aria-describedby');
      }
    }
  }

  #syncEmptyState(): void {
    const isEmpty = this.#items.length === 0;
    this.#emptyText?.toggleAttribute('hidden', !isEmpty);
    this.#fileList?.toggleAttribute('hidden', isEmpty);
  }

  #syncModeState(): void {
    const mode = this.#getMode();
    this.setAttribute('data-mode', mode);

    if (mode === 'button-only') {
      this.#dropzoneDragDepth = 0;
      this.#windowDragDepth = 0;
      this.removeAttribute('data-dragover');
      this.#hideOverlay();

      if (this.#expandDropAreaEnabled) {
        this.#toggleExpandDropArea(false, false);
      }

      this.#setExpandCheckboxChecked(false);
    }
  }

  #syncSelectionSummary(): void {
    if (!this.#selectionSummary) return;

    const count = this.#items.length;
    if (count === 0) {
      this.#selectionSummary.textContent = '';
      this.#selectionSummary.setAttribute('hidden', '');
      return;
    }

    const totalSize = this.#items.reduce((sum, item) => sum + item.file.size, 0);
    this.#selectionSummary.textContent =
      `選択中：${count}個、${formatCompactFileSize(totalSize)}（${formatBytesWithLocale(totalSize)}バイト）`;
    this.#selectionSummary.removeAttribute('hidden');
  }

  #syncManagedErrorFromItems(): void {
    const firstInvalid = this.#items.find((item) => !item.valid && typeof item.message === 'string');

    if (firstInvalid?.message) {
      const [firstLine] = firstInvalid.message.split('\n');
      this.#setManagedError(firstLine || 'ファイルにエラーがあります');
      return;
    }

    this.#clearManagedError();
  }

  #setManagedError(message: string): void {
    this.#managedError = true;
    this.setAttribute('error', '');
    this.setAttribute('error-text', message);

    updateErrorFallback(
      this.#errorSlot,
      this.#errorText,
      this.#errorFallback,
      message,
      true
    );

    this.#syncAriaDescribedBy();
  }

  #clearManagedError(): void {
    if (!this.#managedError) return;

    this.#managedError = false;
    this.removeAttribute('error');
    this.removeAttribute('error-text');

    updateErrorFallback(
      this.#errorSlot,
      this.#errorText,
      this.#errorFallback,
      this.getAttribute('error-text'),
      false
    );

    this.#syncAriaDescribedBy();
  }

  #syncFormValue(): void {
    const name = this.getAttribute('name')?.trim();
    if (!name) {
      this._internals.setFormValue(null);
      return;
    }

    const validItems = this.#items.filter((item) => item.valid);
    if (validItems.length === 0) {
      this._internals.setFormValue(null);
      return;
    }

    if (!this.hasAttribute('multiple')) {
      this._internals.setFormValue(validItems[0].file);
      return;
    }

    const formData = new FormData();
    for (const item of validItems) {
      formData.append(name, item.file, item.file.name);
    }
    this._internals.setFormValue(formData);
  }

  #syncValidity(): void {
    if (this.#isDisabled()) {
      this._internals.setValidity({});
      return;
    }

    const validCount = this.#items.filter((item) => item.valid).length;
    if (this.hasAttribute('required') && validCount === 0) {
      this._internals.setValidity(
        { valueMissing: true },
        'ファイルを選択してください',
        this.#browseButton ?? this.#dropzone ?? this
      );
      return;
    }

    this._internals.setValidity({});
  }

  #syncFileListDisabledState(): void {
    const disabled = this.#isDisabled();
    if (!this.#fileList) return;
    for (const removeButton of this.#fileList.querySelectorAll<HTMLButtonElement>('[part="remove-button"]')) {
      removeButton.disabled = disabled;
    }
  }

  #renderFileList(): void {
    if (!this.#fileList) return;

    this.#fileList.textContent = '';

    this.#items.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('part', 'file-item');
      li.setAttribute('data-file-id', item.id);
      li.setAttribute('data-valid', item.valid ? 'true' : 'false');
      li.setAttribute('data-status', item.status);

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.setAttribute('part', 'remove-button');
      removeButton.setAttribute('data-action', 'remove');
      removeButton.setAttribute('data-file-id', item.id);
      removeButton.setAttribute('aria-label', `${item.file.name} を解除`);
      removeButton.textContent = '解除';
      removeButton.disabled = this.#isDisabled();

      const indexEl = document.createElement('span');
      indexEl.setAttribute('part', 'file-index');
      indexEl.textContent = `${index + 1}.`;

      const nameEl = document.createElement('span');
      nameEl.setAttribute('part', 'file-name');
      nameEl.textContent = item.file.name;

      const metaEl = document.createElement('span');
      metaEl.setAttribute('part', 'file-meta');
      metaEl.textContent = `${formatCompactFileSize(item.file.size)} (${formatBytesWithLocale(item.file.size)}バイト)`;

      li.append(removeButton, indexEl, nameEl, metaEl);

      const statusLabel = STATUS_LABELS[item.status];
      if (statusLabel) {
        const statusEl = document.createElement('span');
        statusEl.setAttribute('part', 'file-status');
        statusEl.textContent = statusLabel;
        li.append(statusEl);
      }

      if (item.message) {
        const messages = item.message
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (messages.length > 0) {
          const messagesWrapper = document.createElement('div');
          messagesWrapper.setAttribute('part', 'file-item-error');

          for (const line of messages) {
            const messageEl = document.createElement('div');
            messageEl.setAttribute('part', 'file-item-error-line');
            messageEl.textContent = line.startsWith('＊') ? line : `＊${line}`;
            messagesWrapper.appendChild(messageEl);
          }

          li.appendChild(messagesWrapper);
        }
      }

      this.#fileList?.appendChild(li);
    });
  }

  #nextItemId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    this.#idSequence += 1;
    return `file-upload-${this.#idSequence}`;
  }

  #toSnapshot(item: DadsFileUploadInternalItem): DadsFileUploadItemSnapshot {
    return {
      id: item.id,
      file: item.file,
      status: item.status,
      message: item.message,
      valid: item.valid,
    };
  }

  #validateFile(
    file: File,
    options: {
      acceptTokens: readonly string[];
      maxFiles: number | null;
      maxSize: number | null;
      validCount: number;
    }
  ): {
    valid: boolean;
    messages: string[];
    errors: Array<{ code: DadsFileUploadErrorCode; message: string }>;
  } {
    const messages: string[] = [];
    const errors: Array<{ code: DadsFileUploadErrorCode; message: string }> = [];

    if (!fileMatchesAccept(file, options.acceptTokens)) {
      const message = '許可されていない形式のファイルです';
      messages.push(message);
      errors.push({ code: 'accept', message });
    }

    if (options.maxSize !== null && file.size > options.maxSize) {
      const message = `ファイルサイズは ${formatFileSize(options.maxSize)} 以下にしてください`;
      messages.push(message);
      errors.push({ code: 'max-file-size', message });
    }

    if (this.hasAttribute('multiple') && options.maxFiles !== null && options.validCount >= options.maxFiles) {
      const message = `ファイルは最大 ${options.maxFiles} 件まで選択できます`;
      messages.push(message);
      errors.push({ code: 'max-files', message });
    }

    return {
      valid: errors.length === 0,
      messages,
      errors,
    };
  }

  #isDisabled(): boolean {
    return this.hasAttribute('disabled') || this.#formDisabled;
  }

  #getMode(): DadsFileUploadMode {
    return this.getAttribute('mode') === 'button-only' ? 'button-only' : 'drop-area';
  }

  #supportsDropArea(): boolean {
    return this.#getMode() === 'drop-area';
  }

  #openFilePicker(): void {
    if (this.#isDisabled()) return;
    this.#fileInput?.click();
  }

  #syncWindowDragListeners(): void {
    const shouldBind =
      this.#supportsDropArea() &&
      this.#expandDropAreaEnabled &&
      !this.#isDisabled() &&
      DadsFileUpload.#fullscreenDropOwner === this;
    if (shouldBind) {
      this.#attachWindowDragListeners();
      return;
    }

    this.#detachWindowDragListeners();
    this.#windowDragDepth = 0;
    this.#hideOverlay();
  }

  #attachWindowDragListeners(): void {
    if (this.#windowDndBound) return;

    window.addEventListener('dragenter', this.#handleWindowDragEnter);
    window.addEventListener('dragover', this.#handleWindowDragOver);
    window.addEventListener('dragleave', this.#handleWindowDragLeave);
    window.addEventListener('drop', this.#handleWindowDrop);

    this.#windowDndBound = true;
  }

  #detachWindowDragListeners(): void {
    if (!this.#windowDndBound) return;

    window.removeEventListener('dragenter', this.#handleWindowDragEnter);
    window.removeEventListener('dragover', this.#handleWindowDragOver);
    window.removeEventListener('dragleave', this.#handleWindowDragLeave);
    window.removeEventListener('drop', this.#handleWindowDrop);

    this.#windowDndBound = false;
  }

  #showOverlay(): void {
    this.#overlay?.removeAttribute('hidden');
  }

  #hideOverlay(): void {
    this.#overlay?.setAttribute('hidden', '');
  }

  #toggleExpandDropArea(enabled: boolean, emitEvent = true): void {
    if (enabled) {
      if (!this.#supportsDropArea() || this.#isDisabled()) {
        this.#setExpandCheckboxChecked(false);
        return;
      }

      const currentOwner = DadsFileUpload.#fullscreenDropOwner;
      if (currentOwner && currentOwner !== this) {
        currentOwner.#toggleExpandDropArea(false, true);
      }
      DadsFileUpload.#fullscreenDropOwner = this;
    } else if (DadsFileUpload.#fullscreenDropOwner === this) {
      DadsFileUpload.#fullscreenDropOwner = null;
    }

    if (this.#expandDropAreaEnabled === enabled) return;

    this.#expandDropAreaEnabled = enabled;
    this.#setExpandCheckboxChecked(enabled);
    this.#syncWindowDragListeners();

    if (!enabled) {
      this.#windowDragDepth = 0;
      this.#hideOverlay();
    }

    if (emitEvent) {
      this.emitEvent<DadsFileUploadFullscreenChangeDetail>('dads-file-upload-fullscreen-change', {
        enabled,
      });
    }
  }

  #setExpandCheckboxChecked(checked: boolean): void {
    if (!this.#expandCheckbox) return;

    if ('checked' in this.#expandCheckbox) {
      (this.#expandCheckbox as unknown as { checked: boolean }).checked = checked;
    }

    this.#expandCheckbox.toggleAttribute('checked', checked);
  }

  #handleBrowseClick = (event: Event): void => {
    event.preventDefault();
    this.#openFilePicker();
  };

  #handleInputChange = (event: Event): void => {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement) || !input.files) return;

    this.addFiles(input.files, { source: 'input' });
    input.value = '';
  };

  #handleDropzoneDragEnter = (event: DragEvent): void => {
    if (!this.#supportsDropArea() || this.#isDisabled() || !hasFilesData(event)) return;
    event.preventDefault();

    this.#dropzoneDragDepth += 1;
    this.setAttribute('data-dragover', '');
  };

  #handleDropzoneDragOver = (event: DragEvent): void => {
    if (!this.#supportsDropArea() || this.#isDisabled() || !hasFilesData(event)) return;
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  #handleDropzoneDragLeave = (event: DragEvent): void => {
    if (!this.#supportsDropArea() || this.#isDisabled() || !hasFilesData(event)) return;
    event.preventDefault();

    this.#dropzoneDragDepth = Math.max(0, this.#dropzoneDragDepth - 1);
    if (this.#dropzoneDragDepth === 0) {
      this.removeAttribute('data-dragover');
    }
  };

  #handleDropzoneDrop = (event: DragEvent): void => {
    if (!this.#supportsDropArea() || this.#isDisabled() || !hasFilesData(event)) return;

    event.preventDefault();
    event.stopPropagation();

    this.#dropzoneDragDepth = 0;
    this.removeAttribute('data-dragover');
    this.#windowDragDepth = 0;
    this.#hideOverlay();

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    this.addFiles(files, { source: 'drop' });
  };

  #handleFileListClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const removeButton = target.closest<HTMLElement>('[data-action="remove"]');
    if (!removeButton) return;

    const id = removeButton.getAttribute('data-file-id');
    if (!id) return;

    this.removeFile(id);
  };

  #handleExpandCheckboxChange = (event: CustomEvent<{ checked?: boolean }>): void => {
    if (!this.#supportsDropArea()) return;
    const checked = Boolean(event.detail?.checked);
    this.#toggleExpandDropArea(checked, true);
  };

  #handleWindowDragEnter = (event: DragEvent): void => {
    if (DadsFileUpload.#fullscreenDropOwner !== this) return;
    if (!this.#expandDropAreaEnabled || this.#isDisabled() || !hasFilesData(event)) return;

    event.preventDefault();
    this.#windowDragDepth += 1;
    this.#showOverlay();
  };

  #handleWindowDragOver = (event: DragEvent): void => {
    if (DadsFileUpload.#fullscreenDropOwner !== this) return;
    if (!this.#expandDropAreaEnabled || this.#isDisabled() || !hasFilesData(event)) return;

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  };

  #handleWindowDragLeave = (event: DragEvent): void => {
    if (DadsFileUpload.#fullscreenDropOwner !== this) return;
    if (!this.#expandDropAreaEnabled || this.#isDisabled()) return;

    event.preventDefault();
    this.#windowDragDepth = Math.max(0, this.#windowDragDepth - 1);

    if (this.#windowDragDepth === 0) {
      this.#hideOverlay();
    }
  };

  #handleWindowDrop = (event: DragEvent): void => {
    if (DadsFileUpload.#fullscreenDropOwner !== this) return;
    if (!this.#expandDropAreaEnabled || this.#isDisabled() || !hasFilesData(event)) return;

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    if (findClosestElementInPath(path, (node) => node === this || node === this.shadowRoot)) {
      return;
    }

    event.preventDefault();

    this.#windowDragDepth = 0;
    this.#hideOverlay();

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    this.addFiles(files, { source: 'drop' });
  };
}
