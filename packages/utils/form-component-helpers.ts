/**
 * @module form-component-helpers
 * Form-Associated Custom Elements向け共通ヘルパー関数
 */

import { hasSlotContent } from './dom.js';

// ============================================================
// 1. デフォルト属性設定
// ============================================================

/**
 * 未設定の属性にデフォルト値を設定
 * @param element - 対象要素
 * @param defaults - 属性名とデフォルト値のマップ
 */
export function setDefaultAttributes(
  element: HTMLElement,
  defaults: Record<string, string>
): void {
  for (const [attr, value] of Object.entries(defaults)) {
    if (!element.hasAttribute(attr)) {
      element.setAttribute(attr, value);
    }
  }
}

// ============================================================
// 2. フォーム検索・接続
// ============================================================

/**
 * ElementInternalsまたはDOM走査で親フォームを検索
 * @param element - フォーム関連要素
 * @param internals - ElementInternalsインスタンス
 * @returns HTMLFormElementまたはnull
 */
export function findParentForm(
  element: HTMLElement,
  internals: ElementInternals
): HTMLFormElement | null {
  // 優先: _internals.form
  let form: HTMLFormElement | null = internals.form;

  if (!form) {
    // フォールバック: DOM走査
    let current: HTMLElement | null = element.parentElement;
    while (current) {
      if (current instanceof HTMLFormElement) {
        form = current;
        break;
      }
      current = current.parentElement;
    }
  }

  return form;
}

/**
 * フォームバリデーション用リスナーのセットアップ結果
 */
export interface FormValidationSetup {
  /** 接続されたフォーム（非同期で設定される） */
  readonly form: HTMLFormElement | null;
  /** クリーンアップ関数（disconnectedCallbackで呼び出す） */
  cleanup: () => void;
}

/**
 * フォームバリデーション用のsubmitリスナーをセットアップ
 * queueMicrotaskでDOM構築完了を待機
 *
 * @param element - フォーム関連要素
 * @param internals - ElementInternalsインスタンス
 * @param autoValidateAttr - auto-validate属性名
 * @param onSubmit - submitイベントハンドラ
 * @returns セットアップ結果（formとcleanup関数）
 */
export function setupFormValidation(
  element: HTMLElement,
  internals: ElementInternals,
  autoValidateAttr: string,
  onSubmit: (e: Event) => void
): FormValidationSetup {
  let boundForm: HTMLFormElement | null = null;

  if (element.hasAttribute(autoValidateAttr)) {
    queueMicrotask(() => {
      if (!element.isConnected) return;

      const form = findParentForm(element, internals);
      if (form) {
        boundForm = form;
        form.addEventListener('submit', onSubmit);
      }
    });
  }

  return {
    get form() {
      return boundForm;
    },
    cleanup() {
      if (boundForm) {
        boundForm.removeEventListener('submit', onSubmit);
        boundForm = null;
      }
    },
  };
}

// ============================================================
// 3. フォールバック更新ヘルパー
// ============================================================

/**
 * ラベルフォールバックを更新
 * スロットにコンテンツがあればフォールバックは空、なければ属性値を表示
 *
 * @param labelSlot - labelスロット要素
 * @param labelFallback - フォールバック用span要素
 * @param labelAttr - label属性値
 */
export function updateLabelFallback(
  labelSlot: HTMLSlotElement | null,
  labelFallback: HTMLElement | null,
  labelAttr: string | null
): void {
  if (!labelFallback) return;
  labelFallback.textContent = hasSlotContent(labelSlot) ? '' : labelAttr ?? '';
}

/**
 * サポートテキストフォールバックを更新
 *
 * @param supportSlot - support-textスロット要素
 * @param supportText - サポートテキストコンテナ要素
 * @param supportFallback - フォールバック用span要素
 * @param supportAttr - support-text属性値
 */
export function updateSupportFallback(
  supportSlot: HTMLSlotElement | null,
  supportText: HTMLElement | null,
  supportFallback: HTMLElement | null,
  supportAttr: string | null
): void {
  if (!supportText || !supportFallback) return;

  const hasContent = hasSlotContent(supportSlot);
  supportFallback.textContent = hasContent ? '' : supportAttr ?? '';
  supportText.style.display = hasContent || supportAttr ? '' : 'none';
}

/**
 * エラーテキストフォールバックを更新
 * 属性経由のエラーには全角アスタリスク（＊）をプレフィックス
 *
 * @param errorSlot - error-textスロット要素
 * @param errorText - エラーテキストコンテナ要素
 * @param errorFallback - フォールバック用span要素
 * @param errorAttr - error-text属性値
 * @param hasError - error属性の有無
 */
export function updateErrorFallback(
  errorSlot: HTMLSlotElement | null,
  errorText: HTMLElement | null,
  errorFallback: HTMLElement | null,
  errorAttr: string | null,
  hasError: boolean
): void {
  if (!errorText || !errorFallback) return;

  const hasContent = hasSlotContent(errorSlot);
  // 全角アスタリスクをプレフィックスとして追加（スロット経由には付けない）
  errorFallback.textContent = hasContent ? '' : errorAttr ? `＊${errorAttr}` : '';
  errorText.style.display = hasError ? '' : 'none';
}

/**
 * 要否ラベル（※必須/編集不可）を更新
 * requiredはreadonlyより優先
 *
 * @param requirement - 要否ラベル要素
 * @param isRequired - required属性の有無
 * @param isReadonly - readonly属性の有無
 */
export function updateRequirement(
  requirement: HTMLElement | null,
  isRequired: boolean,
  isReadonly: boolean
): void {
  if (!requirement) return;

  // required と readonly は排他的（required優先）
  if (isRequired) {
    requirement.textContent = '※必須';
    requirement.style.display = '';
  } else if (isReadonly) {
    requirement.textContent = '編集不可';
    requirement.style.display = '';
  } else {
    requirement.textContent = '';
    requirement.style.display = 'none';
  }
}

// ============================================================
// 4. バリデーションUI
// ============================================================

/**
 * バリデーションUI状態を更新
 *
 * @param control - input/textarea要素
 * @param hasError - エラー状態
 * @param updateErrorFn - エラーフォールバック更新関数
 * @param updateAriaFn - aria-describedby更新関数
 */
export function updateValidationUI(
  control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
  hasError: boolean,
  updateErrorFn: () => void,
  updateAriaFn: () => void
): void {
  updateErrorFn();
  updateAriaFn();
  if (control) {
    control.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }
}

/**
 * バリデーションエラー表示オプション
 */
export interface ShowValidationErrorOptions {
  /** ホスト要素 */
  element: HTMLElement;
  /** 内部input/textarea/select要素 */
  control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  /** ElementInternalsインスタンス */
  internals: ElementInternals;
  /** エラーメッセージ */
  message: string;
  /** UI更新関数 */
  updateUI: (hasError: boolean) => void;
}

/**
 * バリデーションエラーを表示
 *
 * @param options - エラー表示オプション
 */
export function showValidationError(options: ShowValidationErrorOptions): void {
  const { element, control, internals, message, updateUI } = options;

  element.setAttribute('error', '');
  element.setAttribute('error-text', message);
  updateUI(true);

  internals.setValidity({ customError: true }, message, control ?? undefined);
}

/**
 * バリデーションエラーをクリア
 *
 * @param element - ホスト要素
 * @param internals - ElementInternalsインスタンス
 * @param updateUI - UI更新関数
 */
export function clearValidationError(
  element: HTMLElement,
  internals: ElementInternals,
  updateUI: (hasError: boolean) => void
): void {
  element.removeAttribute('error');
  element.removeAttribute('error-text');
  updateUI(false);
  // バリデーション状態をクリアして、次回submitイベントが発火するようにする
  internals.setValidity({});
}

// ============================================================
// 5. aria-describedby管理
// ============================================================

/**
 * aria-describedby設定
 */
export interface AriaDescribedByConfig {
  /** サポートテキストのID */
  supportTextId?: string;
  /** エラーテキストのID */
  errorTextId?: string;
  /** カウンターのID（textarea用） */
  counterId?: string;
}

/**
 * aria-describedby属性を更新
 *
 * @param control - input/textarea要素
 * @param supportVisible - サポートテキストが表示されているか
 * @param errorVisible - エラーが表示されているか
 * @param counterVisible - カウンターが表示されているか（textarea用）
 * @param config - ID設定
 */
export function updateAriaDescribedBy(
  control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null,
  supportVisible: boolean,
  errorVisible: boolean,
  counterVisible: boolean = false,
  config: AriaDescribedByConfig = {}
): void {
  if (!control) return;

  const {
    supportTextId = 'support-text',
    errorTextId = 'error-text',
    counterId = 'counter',
  } = config;

  const ids: string[] = [];

  if (supportVisible) {
    ids.push(supportTextId);
  }

  if (counterVisible) {
    ids.push(counterId);
  }

  if (errorVisible) {
    ids.push(errorTextId);
  }

  if (ids.length > 0) {
    control.setAttribute('aria-describedby', ids.join(' '));
  } else {
    control.removeAttribute('aria-describedby');
  }
}

// ============================================================
// 6. スロット初期化
// ============================================================

/**
 * スロット変更ハンドラ設定
 */
export interface SlotChangeHandlers {
  /** labelスロット変更時 */
  onLabelChange?: () => void;
  /** support-textスロット変更時 */
  onSupportChange?: () => void;
  /** error-textスロット変更時 */
  onErrorChange?: () => void;
}

/**
 * スロット変更リスナーをセットアップし、初回更新を実行
 *
 * @param slots - スロット要素マップ
 * @param handlers - 変更ハンドラマップ
 */
export function setupSlotChangeListeners(
  slots: {
    label?: HTMLSlotElement | null;
    support?: HTMLSlotElement | null;
    error?: HTMLSlotElement | null;
  },
  handlers: SlotChangeHandlers
): void {
  if (slots.label && handlers.onLabelChange) {
    slots.label.addEventListener('slotchange', handlers.onLabelChange);
    handlers.onLabelChange();
  }

  if (slots.support && handlers.onSupportChange) {
    slots.support.addEventListener('slotchange', handlers.onSupportChange);
    handlers.onSupportChange();
  }

  if (slots.error && handlers.onErrorChange) {
    slots.error.addEventListener('slotchange', handlers.onErrorChange);
    handlers.onErrorChange();
  }
}
