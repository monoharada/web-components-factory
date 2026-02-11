/**
 * @module file-upload
 * デジタル庁デザインシステム File Upload / Drop Area コンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsFileUpload_instances, _a, _DadsFileUpload_fullscreenDropOwner, _DadsFileUpload_labelSlot, _DadsFileUpload_supportSlot, _DadsFileUpload_errorSlot, _DadsFileUpload_labelFallback, _DadsFileUpload_supportText, _DadsFileUpload_supportFallback, _DadsFileUpload_errorText, _DadsFileUpload_errorFallback, _DadsFileUpload_requirement, _DadsFileUpload_dropzone, _DadsFileUpload_fileInput, _DadsFileUpload_browseButton, _DadsFileUpload_dropHint, _DadsFileUpload_selectionSummary, _DadsFileUpload_expandCheckbox, _DadsFileUpload_emptyText, _DadsFileUpload_fileList, _DadsFileUpload_overlay, _DadsFileUpload_overlayText, _DadsFileUpload_items, _DadsFileUpload_idSequence, _DadsFileUpload_managedError, _DadsFileUpload_formDisabled, _DadsFileUpload_expandDropAreaEnabled, _DadsFileUpload_dropzoneDragDepth, _DadsFileUpload_windowDragDepth, _DadsFileUpload_windowDndBound, _DadsFileUpload_setupEventListeners, _DadsFileUpload_teardownEventListeners, _DadsFileUpload_syncAllState, _DadsFileUpload_syncDerivedState, _DadsFileUpload_syncInputAttributes, _DadsFileUpload_syncTextLabels, _DadsFileUpload_syncDisabledState, _DadsFileUpload_syncAriaDescribedBy, _DadsFileUpload_syncEmptyState, _DadsFileUpload_syncModeState, _DadsFileUpload_syncSelectionSummary, _DadsFileUpload_syncManagedErrorFromItems, _DadsFileUpload_setManagedError, _DadsFileUpload_clearManagedError, _DadsFileUpload_syncFormValue, _DadsFileUpload_syncValidity, _DadsFileUpload_syncFileListDisabledState, _DadsFileUpload_renderFileList, _DadsFileUpload_nextItemId, _DadsFileUpload_toSnapshot, _DadsFileUpload_validateFile, _DadsFileUpload_isDisabled, _DadsFileUpload_getMode, _DadsFileUpload_supportsDropArea, _DadsFileUpload_openFilePicker, _DadsFileUpload_syncWindowDragListeners, _DadsFileUpload_attachWindowDragListeners, _DadsFileUpload_detachWindowDragListeners, _DadsFileUpload_showOverlay, _DadsFileUpload_hideOverlay, _DadsFileUpload_toggleExpandDropArea, _DadsFileUpload_setExpandCheckboxChecked, _DadsFileUpload_handleBrowseClick, _DadsFileUpload_handleInputChange, _DadsFileUpload_handleDropzoneDragEnter, _DadsFileUpload_handleDropzoneDragOver, _DadsFileUpload_handleDropzoneDragLeave, _DadsFileUpload_handleDropzoneDrop, _DadsFileUpload_handleFileListClick, _DadsFileUpload_handleExpandCheckboxChange, _DadsFileUpload_handleWindowDragEnter, _DadsFileUpload_handleWindowDragOver, _DadsFileUpload_handleWindowDragLeave, _DadsFileUpload_handleWindowDrop;
import { html, BooleanAttr, PropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { setDefaultAttributes, setupSlotChangeListeners, updateLabelFallback, updateSupportFallback, updateErrorFallback, updateRequirement, } from '../../utils/form-component-helpers.js';
import { ensurePrefixedElement, getPrefixFromLocalName } from '../../utils/custom-element-name.js';
import { defineButton } from '../button/button-define.js';
import { defineCheckbox } from '../checkbox/checkbox-define.js';
import { fileUploadTokens } from './file-upload-tokens.js';
import { fileUploadStyles } from './file-upload-styles.js';
const STATUS_LABELS = {
    idle: '',
    uploading: 'アップロード中',
    success: '完了',
    error: '',
};
function normalizeFiles(input) {
    if (Array.isArray(input)) {
        return input.filter((file) => file instanceof File);
    }
    if (typeof FileList !== 'undefined' && input instanceof FileList) {
        return Array.from(input);
    }
    if (typeof input === 'object' && input !== null && Symbol.iterator in input) {
        const files = [];
        for (const file of input) {
            if (file instanceof File)
                files.push(file);
        }
        return files;
    }
    return [];
}
function hasFilesData(event) {
    const dt = event.dataTransfer;
    if (!dt)
        return false;
    if (dt.files && dt.files.length > 0)
        return true;
    const types = dt.types ? Array.from(dt.types) : [];
    return types.includes('Files');
}
function parsePositiveInteger(value) {
    if (!value)
        return null;
    const n = Number.parseInt(value, 10);
    if (!Number.isFinite(n) || n <= 0)
        return null;
    return n;
}
function parseByteSize(value) {
    if (!value)
        return null;
    const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/i);
    if (!m)
        return null;
    const raw = Number.parseFloat(m[1]);
    if (!Number.isFinite(raw) || raw <= 0)
        return null;
    const unit = (m[2] ?? 'b').toLowerCase();
    const base = unit === 'kb' ? 1024 : unit === 'mb' ? 1024 ** 2 : unit === 'gb' ? 1024 ** 3 : 1;
    return Math.floor(raw * base);
}
function formatFileSize(size) {
    if (!Number.isFinite(size) || size < 0)
        return '0 B';
    if (size < 1024)
        return `${size} B`;
    if (size < 1024 ** 2)
        return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 ** 3)
        return `${(size / 1024 ** 2).toFixed(1)} MB`;
    return `${(size / 1024 ** 3).toFixed(1)} GB`;
}
function formatCompactFileSize(size) {
    if (!Number.isFinite(size) || size < 0)
        return '0B';
    if (size < 1024)
        return `${size}B`;
    if (size < 1024 ** 2)
        return `${Math.round(size / 1024)}KB`;
    if (size < 1024 ** 3)
        return `${(size / 1024 ** 2).toFixed(1).replace(/\.0$/, '')}MB`;
    return `${(size / 1024 ** 3).toFixed(1).replace(/\.0$/, '')}GB`;
}
function formatBytesWithLocale(size) {
    if (!Number.isFinite(size) || size < 0)
        return '0';
    return new Intl.NumberFormat('ja-JP').format(size);
}
function parseAcceptTokens(accept) {
    if (!accept)
        return [];
    return accept
        .split(',')
        .map((token) => token.trim().toLowerCase())
        .filter((token) => token.length > 0);
}
function fileMatchesAccept(file, tokens) {
    if (tokens.length === 0)
        return true;
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    return tokens.some((token) => {
        if (token === '*/*')
            return true;
        if (token.startsWith('.'))
            return fileName.endsWith(token);
        if (token.endsWith('/*')) {
            const prefix = token.slice(0, token.length - 1);
            return fileType.startsWith(prefix);
        }
        return fileType === token;
    });
}
function findClosestElementInPath(path, predicate) {
    for (const node of path) {
        if (predicate(node))
            return true;
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
    constructor() {
        super(...arguments);
        _DadsFileUpload_instances.add(this);
        _DadsFileUpload_labelSlot.set(this, null);
        _DadsFileUpload_supportSlot.set(this, null);
        _DadsFileUpload_errorSlot.set(this, null);
        _DadsFileUpload_labelFallback.set(this, null);
        _DadsFileUpload_supportText.set(this, null);
        _DadsFileUpload_supportFallback.set(this, null);
        _DadsFileUpload_errorText.set(this, null);
        _DadsFileUpload_errorFallback.set(this, null);
        _DadsFileUpload_requirement.set(this, null);
        _DadsFileUpload_dropzone.set(this, null);
        _DadsFileUpload_fileInput.set(this, null);
        _DadsFileUpload_browseButton.set(this, null);
        _DadsFileUpload_dropHint.set(this, null);
        _DadsFileUpload_selectionSummary.set(this, null);
        _DadsFileUpload_expandCheckbox.set(this, null);
        _DadsFileUpload_emptyText.set(this, null);
        _DadsFileUpload_fileList.set(this, null);
        _DadsFileUpload_overlay.set(this, null);
        _DadsFileUpload_overlayText.set(this, null);
        _DadsFileUpload_items.set(this, []);
        _DadsFileUpload_idSequence.set(this, 0);
        _DadsFileUpload_managedError.set(this, false);
        _DadsFileUpload_formDisabled.set(this, false);
        _DadsFileUpload_expandDropAreaEnabled.set(this, false);
        _DadsFileUpload_dropzoneDragDepth.set(this, 0);
        _DadsFileUpload_windowDragDepth.set(this, 0);
        _DadsFileUpload_windowDndBound.set(this, false);
        _DadsFileUpload_handleBrowseClick.set(this, (event) => {
            event.preventDefault();
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_openFilePicker).call(this);
        });
        _DadsFileUpload_handleInputChange.set(this, (event) => {
            const input = event.currentTarget;
            if (!(input instanceof HTMLInputElement) || !input.files)
                return;
            this.addFiles(input.files, { source: 'input' });
            input.value = '';
        });
        _DadsFileUpload_handleDropzoneDragEnter.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this) || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            event.preventDefault();
            __classPrivateFieldSet(this, _DadsFileUpload_dropzoneDragDepth, __classPrivateFieldGet(this, _DadsFileUpload_dropzoneDragDepth, "f") + 1, "f");
            this.setAttribute('data-dragover', '');
        });
        _DadsFileUpload_handleDropzoneDragOver.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this) || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            event.preventDefault();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
        });
        _DadsFileUpload_handleDropzoneDragLeave.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this) || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            event.preventDefault();
            __classPrivateFieldSet(this, _DadsFileUpload_dropzoneDragDepth, Math.max(0, __classPrivateFieldGet(this, _DadsFileUpload_dropzoneDragDepth, "f") - 1), "f");
            if (__classPrivateFieldGet(this, _DadsFileUpload_dropzoneDragDepth, "f") === 0) {
                this.removeAttribute('data-dragover');
            }
        });
        _DadsFileUpload_handleDropzoneDrop.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this) || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            event.preventDefault();
            event.stopPropagation();
            __classPrivateFieldSet(this, _DadsFileUpload_dropzoneDragDepth, 0, "f");
            this.removeAttribute('data-dragover');
            __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, 0, "f");
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
            const files = event.dataTransfer?.files;
            if (!files || files.length === 0)
                return;
            this.addFiles(files, { source: 'drop' });
        });
        _DadsFileUpload_handleFileListClick.set(this, (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement))
                return;
            const removeButton = target.closest('[data-action="remove"]');
            if (!removeButton)
                return;
            const id = removeButton.getAttribute('data-file-id');
            if (!id)
                return;
            this.removeFile(id);
        });
        _DadsFileUpload_handleExpandCheckboxChange.set(this, (event) => {
            if (!__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this))
                return;
            const checked = Boolean(event.detail?.checked);
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_toggleExpandDropArea).call(this, checked, true);
        });
        _DadsFileUpload_handleWindowDragEnter.set(this, (event) => {
            if (__classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) !== this)
                return;
            if (!__classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f") || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            event.preventDefault();
            __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, __classPrivateFieldGet(this, _DadsFileUpload_windowDragDepth, "f") + 1, "f");
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_showOverlay).call(this);
        });
        _DadsFileUpload_handleWindowDragOver.set(this, (event) => {
            if (__classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) !== this)
                return;
            if (!__classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f") || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            event.preventDefault();
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'copy';
            }
        });
        _DadsFileUpload_handleWindowDragLeave.set(this, (event) => {
            if (__classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) !== this)
                return;
            if (!__classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f") || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this))
                return;
            event.preventDefault();
            __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, Math.max(0, __classPrivateFieldGet(this, _DadsFileUpload_windowDragDepth, "f") - 1), "f");
            if (__classPrivateFieldGet(this, _DadsFileUpload_windowDragDepth, "f") === 0) {
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
            }
        });
        _DadsFileUpload_handleWindowDrop.set(this, (event) => {
            if (__classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) !== this)
                return;
            if (!__classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f") || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) || !hasFilesData(event))
                return;
            const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
            if (findClosestElementInPath(path, (node) => node === this || node === this.shadowRoot)) {
                return;
            }
            event.preventDefault();
            __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, 0, "f");
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
            const files = event.dataTransfer?.files;
            if (!files || files.length === 0)
                return;
            this.addFiles(files, { source: 'drop' });
        });
    }
    connectedCallback() {
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
        __classPrivateFieldSet(this, _DadsFileUpload_labelSlot, this.shadowRoot?.querySelector('#label-slot'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_supportSlot, this.shadowRoot?.querySelector('#support-slot'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_errorSlot, this.shadowRoot?.querySelector('#error-slot'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_labelFallback, this.shadowRoot?.querySelector('#label-fallback'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_supportText, this.shadowRoot?.querySelector('#support-text'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_supportFallback, this.shadowRoot?.querySelector('#support-fallback'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_errorText, this.shadowRoot?.querySelector('#error-text'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_errorFallback, this.shadowRoot?.querySelector('#error-fallback'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_requirement, this.shadowRoot?.querySelector('#requirement'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_dropzone, this.shadowRoot?.querySelector('#dropzone'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_fileInput, this.shadowRoot?.querySelector('#file-input'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_browseButton, this.shadowRoot
            ? ensurePrefixedElement(this.shadowRoot, 'browse-button', `${prefix}-button`)
            : null, "f");
        __classPrivateFieldSet(this, _DadsFileUpload_dropHint, this.shadowRoot?.querySelector('#drop-hint'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_selectionSummary, this.shadowRoot?.querySelector('#selection-summary'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_expandCheckbox, this.shadowRoot
            ? ensurePrefixedElement(this.shadowRoot, 'expand-checkbox', `${prefix}-checkbox`)
            : null, "f");
        __classPrivateFieldSet(this, _DadsFileUpload_emptyText, this.shadowRoot?.querySelector('#empty-text'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_fileList, this.shadowRoot?.querySelector('#file-list'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_overlay, this.shadowRoot?.querySelector('#overlay'), "f");
        __classPrivateFieldSet(this, _DadsFileUpload_overlayText, this.shadowRoot?.querySelector('#overlay-text'), "f");
        setupSlotChangeListeners({
            label: __classPrivateFieldGet(this, _DadsFileUpload_labelSlot, "f"),
            support: __classPrivateFieldGet(this, _DadsFileUpload_supportSlot, "f"),
            error: __classPrivateFieldGet(this, _DadsFileUpload_errorSlot, "f"),
        }, {
            onLabelChange: () => updateLabelFallback(__classPrivateFieldGet(this, _DadsFileUpload_labelSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_labelFallback, "f"), this.getAttribute('label')),
            onSupportChange: () => {
                updateSupportFallback(__classPrivateFieldGet(this, _DadsFileUpload_supportSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_supportText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
            },
            onErrorChange: () => {
                updateErrorFallback(__classPrivateFieldGet(this, _DadsFileUpload_errorSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
            },
        });
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_setupEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAllState).call(this);
        queueMicrotask(() => {
            if (!this.isConnected)
                return;
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAllState).call(this);
        });
    }
    disconnectedCallback() {
        if (__classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) === this) {
            __classPrivateFieldSet(_a, _a, null, "f", _DadsFileUpload_fullscreenDropOwner);
        }
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_teardownEventListeners).call(this);
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_detachWindowDragListeners).call(this);
        __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, 0, "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
        super.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (oldValue === newValue)
            return;
        switch (name) {
            case 'label':
                updateLabelFallback(__classPrivateFieldGet(this, _DadsFileUpload_labelSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_labelFallback, "f"), this.getAttribute('label'));
                break;
            case 'support-text':
                updateSupportFallback(__classPrivateFieldGet(this, _DadsFileUpload_supportSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_supportText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_supportFallback, "f"), this.getAttribute('support-text'));
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
                break;
            case 'required':
                updateRequirement(__classPrivateFieldGet(this, _DadsFileUpload_requirement, "f"), this.hasAttribute('required'), false);
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncValidity).call(this);
                break;
            case 'error':
            case 'error-text':
                updateErrorFallback(__classPrivateFieldGet(this, _DadsFileUpload_errorSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
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
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAllState).call(this);
                break;
            case 'name':
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncFormValue).call(this);
                __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncValidity).call(this);
                break;
            default:
                break;
        }
    }
    get items() {
        return __classPrivateFieldGet(this, _DadsFileUpload_items, "f").map((item) => __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_toSnapshot).call(this, item));
    }
    addFiles(files, options) {
        if (__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this))
            return [];
        const source = options?.source ?? 'api';
        const incoming = normalizeFiles(files);
        if (incoming.length === 0)
            return [];
        const replace = options?.replace ?? !this.hasAttribute('multiple');
        const normalized = this.hasAttribute('multiple') ? incoming : [incoming[incoming.length - 1]];
        const beforeDetail = {
            source,
            files: normalized,
            currentItems: this.items,
            replace,
        };
        if (!this.emitEvent('dads-file-upload-before-add', beforeDetail)) {
            return [];
        }
        const removedIds = replace ? __classPrivateFieldGet(this, _DadsFileUpload_items, "f").map((item) => item.id) : [];
        let nextItems = replace ? [] : [...__classPrivateFieldGet(this, _DadsFileUpload_items, "f")];
        let validCount = nextItems.filter((item) => item.valid).length;
        const maxFiles = parsePositiveInteger(this.getAttribute('max-files'));
        const maxSize = parseByteSize(this.getAttribute('max-file-size'));
        const acceptTokens = parseAcceptTokens(this.getAttribute('accept'));
        const added = [];
        for (const file of normalized) {
            const validation = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_validateFile).call(this, file, {
                acceptTokens,
                maxFiles,
                maxSize,
                validCount,
            });
            const item = {
                id: __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_nextItemId).call(this),
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
            }
            else {
                for (const error of validation.errors) {
                    this.emitEvent('dads-file-upload-validation-error', {
                        source,
                        code: error.code,
                        message: error.message,
                        fileName: file.name,
                        itemId: item.id,
                    });
                }
            }
        }
        __classPrivateFieldSet(this, _DadsFileUpload_items, nextItems, "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncDerivedState).call(this);
        const detail = {
            source,
            items: this.items,
            added: added.map((item) => __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_toSnapshot).call(this, item)),
            removedIds,
        };
        this.emitEvent('dads-file-upload-change', detail);
        return detail.added.slice();
    }
    removeFile(id) {
        if (__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this))
            return;
        const beforeLength = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").length;
        const nextItems = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").filter((item) => item.id !== id);
        if (nextItems.length === beforeLength)
            return;
        __classPrivateFieldSet(this, _DadsFileUpload_items, nextItems, "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncDerivedState).call(this);
        this.emitEvent('dads-file-upload-change', {
            source: 'api',
            items: this.items,
            added: [],
            removedIds: [id],
        });
    }
    clearFiles() {
        if (__classPrivateFieldGet(this, _DadsFileUpload_items, "f").length === 0)
            return;
        const removedIds = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").map((item) => item.id);
        __classPrivateFieldSet(this, _DadsFileUpload_items, [], "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncDerivedState).call(this);
        this.emitEvent('dads-file-upload-change', {
            source: 'api',
            items: this.items,
            added: [],
            removedIds,
        });
    }
    setFileState(id, patch) {
        const index = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").findIndex((item) => item.id === id);
        if (index < 0)
            return;
        const current = __classPrivateFieldGet(this, _DadsFileUpload_items, "f")[index];
        const next = {
            ...current,
            status: patch.status ?? current.status,
            valid: typeof patch.valid === 'boolean' ? patch.valid : current.valid,
            message: typeof patch.message === 'string' ? patch.message : current.message,
        };
        __classPrivateFieldGet(this, _DadsFileUpload_items, "f")[index] = next;
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncDerivedState).call(this);
        this.emitEvent('dads-file-upload-change', {
            source: 'api',
            items: this.items,
            added: [],
            removedIds: [],
        });
    }
    requestUpload(ids) {
        const selected = ids && ids.length > 0
            ? __classPrivateFieldGet(this, _DadsFileUpload_items, "f").filter((item) => ids.includes(item.id) && item.valid)
            : __classPrivateFieldGet(this, _DadsFileUpload_items, "f").filter((item) => item.valid);
        if (this.hasAttribute('required') && selected.length === 0) {
            const message = 'ファイルを選択してください';
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_setManagedError).call(this, message);
            this.emitEvent('dads-file-upload-validation-error', {
                source: 'api',
                code: 'required',
                message,
            });
            return false;
        }
        if (selected.length === 0)
            return false;
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_clearManagedError).call(this);
        const detail = {
            source: 'api',
            ids: selected.map((item) => item.id),
            items: selected.map((item) => __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_toSnapshot).call(this, item)),
        };
        return this.emitEvent('dads-file-upload-request', detail);
    }
    focus(options) {
        __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f")?.focus(options);
    }
    blur() {
        __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f")?.blur();
    }
    formResetCallback() {
        this.clearFiles();
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_clearManagedError).call(this);
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncValidity).call(this);
    }
    formStateRestoreCallback(_state, _mode) {
        // Fileオブジェクトの復元は行わない
    }
    formDisabledCallback(disabled) {
        super.formDisabledCallback(disabled);
        __classPrivateFieldSet(this, _DadsFileUpload_formDisabled, disabled, "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncDisabledState).call(this);
    }
}
_a = DadsFileUpload, _DadsFileUpload_labelSlot = new WeakMap(), _DadsFileUpload_supportSlot = new WeakMap(), _DadsFileUpload_errorSlot = new WeakMap(), _DadsFileUpload_labelFallback = new WeakMap(), _DadsFileUpload_supportText = new WeakMap(), _DadsFileUpload_supportFallback = new WeakMap(), _DadsFileUpload_errorText = new WeakMap(), _DadsFileUpload_errorFallback = new WeakMap(), _DadsFileUpload_requirement = new WeakMap(), _DadsFileUpload_dropzone = new WeakMap(), _DadsFileUpload_fileInput = new WeakMap(), _DadsFileUpload_browseButton = new WeakMap(), _DadsFileUpload_dropHint = new WeakMap(), _DadsFileUpload_selectionSummary = new WeakMap(), _DadsFileUpload_expandCheckbox = new WeakMap(), _DadsFileUpload_emptyText = new WeakMap(), _DadsFileUpload_fileList = new WeakMap(), _DadsFileUpload_overlay = new WeakMap(), _DadsFileUpload_overlayText = new WeakMap(), _DadsFileUpload_items = new WeakMap(), _DadsFileUpload_idSequence = new WeakMap(), _DadsFileUpload_managedError = new WeakMap(), _DadsFileUpload_formDisabled = new WeakMap(), _DadsFileUpload_expandDropAreaEnabled = new WeakMap(), _DadsFileUpload_dropzoneDragDepth = new WeakMap(), _DadsFileUpload_windowDragDepth = new WeakMap(), _DadsFileUpload_windowDndBound = new WeakMap(), _DadsFileUpload_handleBrowseClick = new WeakMap(), _DadsFileUpload_handleInputChange = new WeakMap(), _DadsFileUpload_handleDropzoneDragEnter = new WeakMap(), _DadsFileUpload_handleDropzoneDragOver = new WeakMap(), _DadsFileUpload_handleDropzoneDragLeave = new WeakMap(), _DadsFileUpload_handleDropzoneDrop = new WeakMap(), _DadsFileUpload_handleFileListClick = new WeakMap(), _DadsFileUpload_handleExpandCheckboxChange = new WeakMap(), _DadsFileUpload_handleWindowDragEnter = new WeakMap(), _DadsFileUpload_handleWindowDragOver = new WeakMap(), _DadsFileUpload_handleWindowDragLeave = new WeakMap(), _DadsFileUpload_handleWindowDrop = new WeakMap(), _DadsFileUpload_instances = new WeakSet(), _DadsFileUpload_setupEventListeners = function _DadsFileUpload_setupEventListeners() {
    __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsFileUpload_handleBrowseClick, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f")?.addEventListener('change', __classPrivateFieldGet(this, _DadsFileUpload_handleInputChange, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.addEventListener('dragenter', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDragEnter, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.addEventListener('dragover', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDragOver, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.addEventListener('dragleave', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDragLeave, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.addEventListener('drop', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDrop, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_fileList, "f")?.addEventListener('click', __classPrivateFieldGet(this, _DadsFileUpload_handleFileListClick, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f")?.addEventListener('dads-change', __classPrivateFieldGet(this, _DadsFileUpload_handleExpandCheckboxChange, "f"));
}, _DadsFileUpload_teardownEventListeners = function _DadsFileUpload_teardownEventListeners() {
    __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsFileUpload_handleBrowseClick, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f")?.removeEventListener('change', __classPrivateFieldGet(this, _DadsFileUpload_handleInputChange, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.removeEventListener('dragenter', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDragEnter, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.removeEventListener('dragover', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDragOver, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.removeEventListener('dragleave', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDragLeave, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")?.removeEventListener('drop', __classPrivateFieldGet(this, _DadsFileUpload_handleDropzoneDrop, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_fileList, "f")?.removeEventListener('click', __classPrivateFieldGet(this, _DadsFileUpload_handleFileListClick, "f"));
    __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f")?.removeEventListener('dads-change', __classPrivateFieldGet(this, _DadsFileUpload_handleExpandCheckboxChange, "f"));
}, _DadsFileUpload_syncAllState = function _DadsFileUpload_syncAllState() {
    updateLabelFallback(__classPrivateFieldGet(this, _DadsFileUpload_labelSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_labelFallback, "f"), this.getAttribute('label'));
    updateSupportFallback(__classPrivateFieldGet(this, _DadsFileUpload_supportSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_supportText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_supportFallback, "f"), this.getAttribute('support-text'));
    updateRequirement(__classPrivateFieldGet(this, _DadsFileUpload_requirement, "f"), this.hasAttribute('required'), false);
    updateErrorFallback(__classPrivateFieldGet(this, _DadsFileUpload_errorSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorFallback, "f"), this.getAttribute('error-text'), this.hasAttribute('error'));
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncInputAttributes).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncTextLabels).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncModeState).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncDisabledState).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncSelectionSummary).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_renderFileList).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncEmptyState).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncFormValue).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncValidity).call(this);
}, _DadsFileUpload_syncDerivedState = function _DadsFileUpload_syncDerivedState() {
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncManagedErrorFromItems).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncSelectionSummary).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_renderFileList).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncEmptyState).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncFormValue).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncValidity).call(this);
}, _DadsFileUpload_syncInputAttributes = function _DadsFileUpload_syncInputAttributes() {
    if (!__classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f"))
        return;
    __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f").accept = this.getAttribute('accept') ?? '';
    __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f").multiple = this.hasAttribute('multiple');
    __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f").disabled = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this);
}, _DadsFileUpload_syncTextLabels = function _DadsFileUpload_syncTextLabels() {
    const browseLabel = this.getAttribute('browse-label') ?? 'ファイルを選択';
    if (__classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f").textContent = browseLabel;
        __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f").setAttribute('aria-label', browseLabel);
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_dropHint, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_dropHint, "f").textContent = this.getAttribute('drop-hint') ?? '';
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_emptyText, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_emptyText, "f").textContent = this.getAttribute('empty-text') ?? '';
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_overlayText, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_overlayText, "f").textContent = this.getAttribute('overlay-text') ?? '';
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f").setAttribute('label', this.getAttribute('expand-label') ?? 'ドラッグ＆ドロップの範囲をこのブラウザウィンドウ全体に広げる');
    }
}, _DadsFileUpload_syncDisabledState = function _DadsFileUpload_syncDisabledState() {
    const isDisabled = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this);
    const supportsDropArea = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this);
    if (isDisabled && __classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_toggleExpandDropArea).call(this, false, true);
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f").toggleAttribute('disabled', isDisabled);
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f").toggleAttribute('disabled', isDisabled || !supportsDropArea);
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f").setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
    }
    if (isDisabled || !supportsDropArea) {
        this.removeAttribute('data-dragover');
        __classPrivateFieldSet(this, _DadsFileUpload_dropzoneDragDepth, 0, "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
    }
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncFileListDisabledState).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncWindowDragListeners).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncInputAttributes).call(this);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncValidity).call(this);
}, _DadsFileUpload_syncAriaDescribedBy = function _DadsFileUpload_syncAriaDescribedBy() {
    const ids = [];
    const supportVisible = __classPrivateFieldGet(this, _DadsFileUpload_supportText, "f")?.style.display !== 'none' &&
        Boolean((__classPrivateFieldGet(this, _DadsFileUpload_supportSlot, "f")?.assignedNodes({ flatten: true }).length ?? 0) > 0 || this.getAttribute('support-text'));
    if (supportVisible)
        ids.push('support-text');
    if (this.hasAttribute('error'))
        ids.push('error-text');
    const describedBy = ids.join(' ');
    for (const el of [__classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f"), __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f"), __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f")]) {
        if (!el)
            continue;
        if (describedBy.length > 0) {
            el.setAttribute('aria-describedby', describedBy);
        }
        else {
            el.removeAttribute('aria-describedby');
        }
    }
}, _DadsFileUpload_syncEmptyState = function _DadsFileUpload_syncEmptyState() {
    const isEmpty = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").length === 0;
    __classPrivateFieldGet(this, _DadsFileUpload_emptyText, "f")?.toggleAttribute('hidden', !isEmpty);
    __classPrivateFieldGet(this, _DadsFileUpload_fileList, "f")?.toggleAttribute('hidden', isEmpty);
}, _DadsFileUpload_syncModeState = function _DadsFileUpload_syncModeState() {
    const mode = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_getMode).call(this);
    this.setAttribute('data-mode', mode);
    if (mode === 'button-only') {
        __classPrivateFieldSet(this, _DadsFileUpload_dropzoneDragDepth, 0, "f");
        __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, 0, "f");
        this.removeAttribute('data-dragover');
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
        if (__classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f")) {
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_toggleExpandDropArea).call(this, false, false);
        }
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_setExpandCheckboxChecked).call(this, false);
    }
}, _DadsFileUpload_syncSelectionSummary = function _DadsFileUpload_syncSelectionSummary() {
    if (!__classPrivateFieldGet(this, _DadsFileUpload_selectionSummary, "f"))
        return;
    const count = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").length;
    if (count === 0) {
        __classPrivateFieldGet(this, _DadsFileUpload_selectionSummary, "f").textContent = '';
        __classPrivateFieldGet(this, _DadsFileUpload_selectionSummary, "f").setAttribute('hidden', '');
        return;
    }
    const totalSize = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").reduce((sum, item) => sum + item.file.size, 0);
    __classPrivateFieldGet(this, _DadsFileUpload_selectionSummary, "f").textContent =
        `選択中：${count}個、${formatCompactFileSize(totalSize)}（${formatBytesWithLocale(totalSize)}バイト）`;
    __classPrivateFieldGet(this, _DadsFileUpload_selectionSummary, "f").removeAttribute('hidden');
}, _DadsFileUpload_syncManagedErrorFromItems = function _DadsFileUpload_syncManagedErrorFromItems() {
    const firstInvalid = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").find((item) => !item.valid && typeof item.message === 'string');
    if (firstInvalid?.message) {
        const [firstLine] = firstInvalid.message.split('\n');
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_setManagedError).call(this, firstLine || 'ファイルにエラーがあります');
        return;
    }
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_clearManagedError).call(this);
}, _DadsFileUpload_setManagedError = function _DadsFileUpload_setManagedError(message) {
    __classPrivateFieldSet(this, _DadsFileUpload_managedError, true, "f");
    this.setAttribute('error', '');
    this.setAttribute('error-text', message);
    updateErrorFallback(__classPrivateFieldGet(this, _DadsFileUpload_errorSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorFallback, "f"), message, true);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
}, _DadsFileUpload_clearManagedError = function _DadsFileUpload_clearManagedError() {
    if (!__classPrivateFieldGet(this, _DadsFileUpload_managedError, "f"))
        return;
    __classPrivateFieldSet(this, _DadsFileUpload_managedError, false, "f");
    this.removeAttribute('error');
    this.removeAttribute('error-text');
    updateErrorFallback(__classPrivateFieldGet(this, _DadsFileUpload_errorSlot, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorText, "f"), __classPrivateFieldGet(this, _DadsFileUpload_errorFallback, "f"), this.getAttribute('error-text'), false);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncAriaDescribedBy).call(this);
}, _DadsFileUpload_syncFormValue = function _DadsFileUpload_syncFormValue() {
    const name = this.getAttribute('name')?.trim();
    if (!name) {
        this._internals.setFormValue(null);
        return;
    }
    const validItems = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").filter((item) => item.valid);
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
}, _DadsFileUpload_syncValidity = function _DadsFileUpload_syncValidity() {
    if (__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this)) {
        this._internals.setValidity({});
        return;
    }
    const validCount = __classPrivateFieldGet(this, _DadsFileUpload_items, "f").filter((item) => item.valid).length;
    if (this.hasAttribute('required') && validCount === 0) {
        // 先に空状態へ戻してから required を適用し、以前の customError を持ち越さない
        this._internals.setValidity({});
        this._internals.setValidity({ valueMissing: true }, 'ファイルを選択してください', __classPrivateFieldGet(this, _DadsFileUpload_browseButton, "f") ?? __classPrivateFieldGet(this, _DadsFileUpload_dropzone, "f") ?? this);
        return;
    }
    this._internals.setValidity({});
}, _DadsFileUpload_syncFileListDisabledState = function _DadsFileUpload_syncFileListDisabledState() {
    const disabled = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this);
    if (!__classPrivateFieldGet(this, _DadsFileUpload_fileList, "f"))
        return;
    for (const removeButton of __classPrivateFieldGet(this, _DadsFileUpload_fileList, "f").querySelectorAll('[part="remove-button"]')) {
        removeButton.disabled = disabled;
    }
}, _DadsFileUpload_renderFileList = function _DadsFileUpload_renderFileList() {
    if (!__classPrivateFieldGet(this, _DadsFileUpload_fileList, "f"))
        return;
    __classPrivateFieldGet(this, _DadsFileUpload_fileList, "f").textContent = '';
    __classPrivateFieldGet(this, _DadsFileUpload_items, "f").forEach((item, index) => {
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
        removeButton.disabled = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this);
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
        __classPrivateFieldGet(this, _DadsFileUpload_fileList, "f")?.appendChild(li);
    });
}, _DadsFileUpload_nextItemId = function _DadsFileUpload_nextItemId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    __classPrivateFieldSet(this, _DadsFileUpload_idSequence, __classPrivateFieldGet(this, _DadsFileUpload_idSequence, "f") + 1, "f");
    return `file-upload-${__classPrivateFieldGet(this, _DadsFileUpload_idSequence, "f")}`;
}, _DadsFileUpload_toSnapshot = function _DadsFileUpload_toSnapshot(item) {
    return {
        id: item.id,
        file: item.file,
        status: item.status,
        message: item.message,
        valid: item.valid,
    };
}, _DadsFileUpload_validateFile = function _DadsFileUpload_validateFile(file, options) {
    const messages = [];
    const errors = [];
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
}, _DadsFileUpload_isDisabled = function _DadsFileUpload_isDisabled() {
    return this.hasAttribute('disabled') || __classPrivateFieldGet(this, _DadsFileUpload_formDisabled, "f");
}, _DadsFileUpload_getMode = function _DadsFileUpload_getMode() {
    return this.getAttribute('mode') === 'button-only' ? 'button-only' : 'drop-area';
}, _DadsFileUpload_supportsDropArea = function _DadsFileUpload_supportsDropArea() {
    return __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_getMode).call(this) === 'drop-area';
}, _DadsFileUpload_openFilePicker = function _DadsFileUpload_openFilePicker() {
    if (__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this))
        return;
    __classPrivateFieldGet(this, _DadsFileUpload_fileInput, "f")?.click();
}, _DadsFileUpload_syncWindowDragListeners = function _DadsFileUpload_syncWindowDragListeners() {
    const shouldBind = __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this) &&
        __classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f") &&
        !__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this) &&
        __classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) === this;
    if (shouldBind) {
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_attachWindowDragListeners).call(this);
        return;
    }
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_detachWindowDragListeners).call(this);
    __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, 0, "f");
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
}, _DadsFileUpload_attachWindowDragListeners = function _DadsFileUpload_attachWindowDragListeners() {
    if (__classPrivateFieldGet(this, _DadsFileUpload_windowDndBound, "f"))
        return;
    window.addEventListener('dragenter', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDragEnter, "f"));
    window.addEventListener('dragover', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDragOver, "f"));
    window.addEventListener('dragleave', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDragLeave, "f"));
    window.addEventListener('drop', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDrop, "f"));
    __classPrivateFieldSet(this, _DadsFileUpload_windowDndBound, true, "f");
}, _DadsFileUpload_detachWindowDragListeners = function _DadsFileUpload_detachWindowDragListeners() {
    if (!__classPrivateFieldGet(this, _DadsFileUpload_windowDndBound, "f"))
        return;
    window.removeEventListener('dragenter', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDragEnter, "f"));
    window.removeEventListener('dragover', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDragOver, "f"));
    window.removeEventListener('dragleave', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDragLeave, "f"));
    window.removeEventListener('drop', __classPrivateFieldGet(this, _DadsFileUpload_handleWindowDrop, "f"));
    __classPrivateFieldSet(this, _DadsFileUpload_windowDndBound, false, "f");
}, _DadsFileUpload_showOverlay = function _DadsFileUpload_showOverlay() {
    __classPrivateFieldGet(this, _DadsFileUpload_overlay, "f")?.removeAttribute('hidden');
}, _DadsFileUpload_hideOverlay = function _DadsFileUpload_hideOverlay() {
    __classPrivateFieldGet(this, _DadsFileUpload_overlay, "f")?.setAttribute('hidden', '');
}, _DadsFileUpload_toggleExpandDropArea = function _DadsFileUpload_toggleExpandDropArea(enabled, emitEvent = true) {
    if (enabled) {
        if (!__classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_supportsDropArea).call(this) || __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_isDisabled).call(this)) {
            __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_setExpandCheckboxChecked).call(this, false);
            return;
        }
        const currentOwner = __classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner);
        if (currentOwner && currentOwner !== this) {
            __classPrivateFieldGet(currentOwner, _DadsFileUpload_instances, "m", _DadsFileUpload_toggleExpandDropArea).call(currentOwner, false, true);
        }
        __classPrivateFieldSet(_a, _a, this, "f", _DadsFileUpload_fullscreenDropOwner);
    }
    else if (__classPrivateFieldGet(_a, _a, "f", _DadsFileUpload_fullscreenDropOwner) === this) {
        __classPrivateFieldSet(_a, _a, null, "f", _DadsFileUpload_fullscreenDropOwner);
    }
    if (__classPrivateFieldGet(this, _DadsFileUpload_expandDropAreaEnabled, "f") === enabled)
        return;
    __classPrivateFieldSet(this, _DadsFileUpload_expandDropAreaEnabled, enabled, "f");
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_setExpandCheckboxChecked).call(this, enabled);
    __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_syncWindowDragListeners).call(this);
    if (!enabled) {
        __classPrivateFieldSet(this, _DadsFileUpload_windowDragDepth, 0, "f");
        __classPrivateFieldGet(this, _DadsFileUpload_instances, "m", _DadsFileUpload_hideOverlay).call(this);
    }
    if (emitEvent) {
        this.emitEvent('dads-file-upload-fullscreen-change', {
            enabled,
        });
    }
}, _DadsFileUpload_setExpandCheckboxChecked = function _DadsFileUpload_setExpandCheckboxChecked(checked) {
    if (!__classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f"))
        return;
    if ('checked' in __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f")) {
        __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f").checked = checked;
    }
    __classPrivateFieldGet(this, _DadsFileUpload_expandCheckbox, "f").toggleAttribute('checked', checked);
};
DadsFileUpload.formAssociated = true;
_DadsFileUpload_fullscreenDropOwner = { value: null };
DadsFileUpload.definition = {
    name: 'dads-file-upload',
    template: html `
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
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        fileUploadTokens,
        fileUploadStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
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
