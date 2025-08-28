/**
 * web-components.ts の PropertyAttr を拡張したバリデーション付き属性クラス
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
var _ValidatedPropertyAttr_validator, _ValidatedPropertyAttr_defaultValue, _ValidatedPropertyAttr_transform, _ValidatedPropertyAttr_serialize, _ValidatedPropertyAttr_errorHandler;
import { PropertyAttr } from '../web-components';
/**
 * バリデーションとデフォルト値をサポートする拡張PropertyAttr
 */
export class ValidatedPropertyAttr extends PropertyAttr {
    constructor(property, options) {
        super(property);
        _ValidatedPropertyAttr_validator.set(this, void 0);
        _ValidatedPropertyAttr_defaultValue.set(this, void 0);
        _ValidatedPropertyAttr_transform.set(this, void 0);
        _ValidatedPropertyAttr_serialize.set(this, void 0);
        _ValidatedPropertyAttr_errorHandler.set(this, void 0);
        __classPrivateFieldSet(this, _ValidatedPropertyAttr_validator, options?.validate, "f");
        __classPrivateFieldSet(this, _ValidatedPropertyAttr_defaultValue, options?.default, "f");
        __classPrivateFieldSet(this, _ValidatedPropertyAttr_transform, options?.transform, "f");
        __classPrivateFieldSet(this, _ValidatedPropertyAttr_serialize, options?.serialize, "f");
    }
    /**
     * エラーハンドラーの設定
     */
    setErrorHandler(handler) {
        __classPrivateFieldSet(this, _ValidatedPropertyAttr_errorHandler, handler, "f");
    }
    /**
     * 値の設定（バリデーション付き）
     */
    setValue(element, value) {
        try {
            // デフォルト値の適用
            const actualValue = value ?? __classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f");
            // 変換処理
            let processedValue = actualValue;
            if (typeof actualValue === 'string' && __classPrivateFieldGet(this, _ValidatedPropertyAttr_transform, "f")) {
                processedValue = __classPrivateFieldGet(this, _ValidatedPropertyAttr_transform, "f").call(this, actualValue);
            }
            // バリデーション
            if (__classPrivateFieldGet(this, _ValidatedPropertyAttr_validator, "f") && !__classPrivateFieldGet(this, _ValidatedPropertyAttr_validator, "f").call(this, processedValue)) {
                const error = new Error(`無効な値: ${this.property}="${actualValue}"`);
                if (__classPrivateFieldGet(this, _ValidatedPropertyAttr_errorHandler, "f")) {
                    __classPrivateFieldGet(this, _ValidatedPropertyAttr_errorHandler, "f").call(this, error, actualValue);
                }
                else {
                    console.warn(error.message);
                }
                // デフォルト値にフォールバック
                if (__classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f") !== undefined) {
                    super.setValue(element, __classPrivateFieldGet(this, _ValidatedPropertyAttr_serialize, "f") ?
                        __classPrivateFieldGet(this, _ValidatedPropertyAttr_serialize, "f").call(this, __classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f")) :
                        __classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f"));
                }
                return;
            }
            // 値を設定
            const finalValue = __classPrivateFieldGet(this, _ValidatedPropertyAttr_serialize, "f") ?
                __classPrivateFieldGet(this, _ValidatedPropertyAttr_serialize, "f").call(this, processedValue) :
                processedValue;
            super.setValue(element, finalValue);
        }
        catch (error) {
            if (__classPrivateFieldGet(this, _ValidatedPropertyAttr_errorHandler, "f")) {
                __classPrivateFieldGet(this, _ValidatedPropertyAttr_errorHandler, "f").call(this, error, value);
            }
            else {
                console.error(`属性設定エラー: ${this.property}`, error);
            }
            // エラー時はデフォルト値を使用
            if (__classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f") !== undefined) {
                super.setValue(element, __classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f"));
            }
        }
    }
    /**
     * 値の取得
     */
    getValue(element) {
        const value = super.getValue(element);
        if (value === undefined || value === null) {
            return __classPrivateFieldGet(this, _ValidatedPropertyAttr_defaultValue, "f");
        }
        if (typeof value === 'string' && __classPrivateFieldGet(this, _ValidatedPropertyAttr_transform, "f")) {
            return __classPrivateFieldGet(this, _ValidatedPropertyAttr_transform, "f").call(this, value);
        }
        return value;
    }
}
_ValidatedPropertyAttr_validator = new WeakMap(), _ValidatedPropertyAttr_defaultValue = new WeakMap(), _ValidatedPropertyAttr_transform = new WeakMap(), _ValidatedPropertyAttr_serialize = new WeakMap(), _ValidatedPropertyAttr_errorHandler = new WeakMap();
/**
 * プリセットバリデーター
 */
export class Validators {
}
Validators.string = (v) => typeof v === 'string';
Validators.number = (v) => typeof v === 'number' && !isNaN(v);
Validators.boolean = (v) => typeof v === 'boolean';
Validators.enum = (...values) => (v) => typeof v === 'string' && values.includes(v);
Validators.range = (min, max) => (v) => typeof v === 'number' && v >= min && v <= max;
Validators.pattern = (regex) => (v) => typeof v === 'string' && regex.test(v);
Validators.minLength = (min) => (v) => typeof v === 'string' && v.length >= min;
Validators.maxLength = (max) => (v) => typeof v === 'string' && v.length <= max;
/**
 * アニメーション属性用の特殊化
 */
export class AnimationPropertyAttr extends ValidatedPropertyAttr {
    constructor() {
        super('animation', {
            validate: Validators.enum('none', 'smooth', 'bounce', 'custom'),
            default: 'none', // アクセシビリティファースト
            transform: (value) => {
                // prefers-reduced-motionチェック
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    return 'none';
                }
                return value;
            }
        });
    }
}
/**
 * 段階的エラーリカバリー
 */
export class ErrorRecovery {
    static classifyError(error) {
        const message = error.message.toLowerCase();
        if (message.includes('animation') || message.includes('transition')) {
            return 'animation';
        }
        if (message.includes('keyboard') || message.includes('focus') ||
            message.includes('interaction')) {
            return 'interaction';
        }
        return 'critical';
    }
    static async recover(error, component, options) {
        const level = this.classifyError(error);
        console.warn(`エラーリカバリー開始 (レベル: ${level})`, error);
        switch (level) {
            case 'animation':
                // アニメーションを無効化
                component.setAttribute('animation', 'none');
                console.info('アニメーション機能を無効化しました');
                break;
            case 'interaction':
                // インタラクション機能を制限
                component.setAttribute('keyboard-nav', 'false');
                component.querySelectorAll('[tabindex]').forEach(el => {
                    el.setAttribute('tabindex', '-1');
                });
                console.warn('インタラクション機能を制限しました');
                break;
            case 'critical':
                // 最小限モードへフォールバック
                if (options?.fallbackMode) {
                    options.fallbackMode();
                }
                else {
                    component.setAttribute('data-fallback', 'true');
                    component.setAttribute('animation', 'none');
                    component.setAttribute('keyboard-nav', 'false');
                }
                console.error('最小限モードで動作しています');
                // エラーレポート送信
                if (options?.reportError) {
                    options.reportError(error);
                }
                break;
        }
    }
}
ErrorRecovery.levels = {
    animation: 1,
    interaction: 2,
    critical: 3
};
