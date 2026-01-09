// validation.ts
// 再利用可能なバリデーションユーティリティ

/**
 * バリデーションルールの型定義
 */
export interface ValidationRule {
  /** バリデーションタイプの識別子 */
  readonly type: string;
  /** バリデーション関数 - 有効な場合true、無効な場合falseを返す */
  readonly validate: (value: string, element: HTMLElement) => boolean;
  /** デフォルトのエラーメッセージ */
  readonly defaultMessage: string;
  /** カスタムメッセージ用のスロット名 */
  readonly slotName: string;
}

/**
 * バリデーション結果の型定義
 */
export interface ValidationResult {
  /** バリデーションが通ったかどうか */
  valid: boolean;
  /** 失敗したルール（validがtrueの場合はnull） */
  errorRule: ValidationRule | null;
}

/**
 * 組み込みバリデーションルール
 */
export const VALIDATION_RULES = {
  /**
   * 必須バリデーション
   * - 空文字列または空白のみの場合は失敗
   */
  required: {
    type: 'required',
    validate: (value: string): boolean => value.trim().length > 0,
    defaultMessage: 'この項目は入力が必須です',
    slotName: 'required-error',
  },

  /**
   * 文字数超過バリデーション
   * - maxlength または counter-max 属性を超えた場合は失敗
   * - maxlength が優先される
   */
  overflow: {
    type: 'overflow',
    validate: (value: string, element: HTMLElement): boolean => {
      const maxLength =
        element.getAttribute('maxlength') ??
        element.getAttribute('counter-max');
      if (!maxLength) return true;
      return value.length <= parseInt(maxLength, 10);
    },
    defaultMessage: '入力できる文字数を超えています',
    slotName: 'overflow-error',
  },

  /**
   * タイプ不一致バリデーション（email形式）
   * - type="email" の場合、メールアドレス形式をチェック
   * - 空の値はバリデーションしない（requiredで別途チェック）
   */
  typeMismatch: {
    type: 'typeMismatch',
    validate: (value: string, element: HTMLElement): boolean => {
      // 空の値はバリデーションしない
      if (value.trim().length === 0) return true;

      const type = element.getAttribute('type');
      if (type !== 'email') return true;

      // 基本的なemail形式チェック（ブラウザのvalidityと同様）
      // RFC 5322に準拠した簡易パターン
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    },
    defaultMessage: 'メールアドレスの形式が正しくありません',
    slotName: 'type-mismatch-error',
  },
} as const satisfies Record<string, ValidationRule>;

/**
 * バリデーションエラーメッセージを取得
 * スロットにコンテンツがあればそれを使用、なければデフォルトメッセージを返す
 *
 * @param element - バリデーション対象の要素（Shadow DOMを持つカスタム要素）
 * @param rule - バリデーションルール
 * @returns エラーメッセージ
 */
export function getValidationMessage(
  element: HTMLElement,
  rule: ValidationRule
): string {
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) {
    return rule.defaultMessage;
  }

  // スロットを検索
  const slot = shadowRoot.querySelector(
    `slot[name="${rule.slotName}"]`
  ) as HTMLSlotElement | null;
  if (!slot) {
    return rule.defaultMessage;
  }

  // スロットに割り当てられたノードを取得
  const assignedNodes = slot.assignedNodes({ flatten: true });
  const textContent = assignedNodes
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ?? '';
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        return (node as HTMLElement).textContent ?? '';
      }
      return '';
    })
    .join('')
    .trim();

  // 空またはスペースのみの場合はデフォルトメッセージ
  if (!textContent) {
    return rule.defaultMessage;
  }

  return textContent;
}

/**
 * フィールドのバリデーションを実行
 * ルールの順序通りにチェックし、最初に失敗したルールを返す
 *
 * @param value - バリデーション対象の値
 * @param element - バリデーション対象の要素
 * @param rules - 適用するバリデーションルールの配列
 * @returns バリデーション結果
 */
export function validateField(
  value: string,
  element: HTMLElement,
  rules: readonly ValidationRule[]
): ValidationResult {
  for (const rule of rules) {
    if (!rule.validate(value, element)) {
      return {
        valid: false,
        errorRule: rule,
      };
    }
  }

  return {
    valid: true,
    errorRule: null,
  };
}
