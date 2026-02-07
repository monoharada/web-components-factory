// validation.ts
// 再利用可能なバリデーションユーティリティ
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
        validate: (value) => value.trim().length > 0,
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
        validate: (value, element) => {
            const maxLength = element.getAttribute('maxlength') ??
                element.getAttribute('counter-max');
            if (!maxLength)
                return true;
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
        validate: (value, element) => {
            // 空の値はバリデーションしない
            if (value.trim().length === 0)
                return true;
            const type = element.getAttribute('type');
            if (type !== 'email')
                return true;
            // 基本的なemail形式チェック（ブラウザのvalidityと同様）
            // RFC 5322に準拠した簡易パターン
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(value);
        },
        defaultMessage: 'メールアドレスの形式が正しくありません',
        slotName: 'type-mismatch-error',
    },
};
/**
 * バリデーションエラーメッセージを取得
 * スロットにコンテンツがあればそれを使用、なければデフォルトメッセージを返す
 *
 * @param element - バリデーション対象の要素（Shadow DOMを持つカスタム要素）
 * @param rule - バリデーションルール
 * @returns エラーメッセージ
 */
export function getValidationMessage(element, rule) {
    const shadowRoot = element.shadowRoot;
    if (!shadowRoot) {
        return rule.defaultMessage;
    }
    // スロットを検索
    const slot = shadowRoot.querySelector(`slot[name="${rule.slotName}"]`);
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
            return node.textContent ?? '';
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
export function validateField(value, element, rules) {
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
