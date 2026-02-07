var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TypographyWebComponent_fontState, _TypographyFormComponent_fontState;
/**
 * TypographyWebComponent
 * Noto Sans JPを自動的に適用するWeb Componentベースクラス
 */
import { WebComponent, FormComponent } from '../web-components.js';
import { baseTypographyStyles, fontLoadingStyles, ensureFontsInitialized } from './base-typography-styles.js';
import { syncFontState, observeFontLoadingState, cleanupFontObserver, } from './font-loading-helper.js';
/**
 * スタイルにベースタイポグラフィスタイルを自動追加
 */
function composeWithTypography(cfg) {
    const originalStyles = cfg.styles || [];
    const stylesArray = Array.isArray(originalStyles) ? originalStyles : [originalStyles];
    return {
        ...cfg,
        styles: [baseTypographyStyles, fontLoadingStyles, ...stylesArray],
    };
}
/**
 * タイポグラフィ対応のWebComponentベースクラス
 * すべてのコンポーネントはこのクラスを継承することで
 * Noto Sans JPが自動的に適用される
 */
export class TypographyWebComponent extends WebComponent {
    constructor() {
        super();
        _TypographyWebComponent_fontState.set(this, { observer: null });
        ensureFontsInitialized();
    }
    connectedCallback() {
        super.connectedCallback();
        syncFontState(this);
        observeFontLoadingState(this, __classPrivateFieldGet(this, _TypographyWebComponent_fontState, "f"));
    }
    disconnectedCallback() {
        cleanupFontObserver(__classPrivateFieldGet(this, _TypographyWebComponent_fontState, "f"));
    }
    /**
     * defineメソッドをオーバーライド
     * 自動的にタイポグラフィスタイルを追加
     */
    static define(cfg) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config = cfg ?? this.definition;
        if (!config) {
            throw new Error('WebComponentConfig が指定されていません。');
        }
        const enhancedConfig = composeWithTypography(config);
        return super.define(enhancedConfig);
    }
}
_TypographyWebComponent_fontState = new WeakMap();
/**
 * スタイルにベースタイポグラフィスタイルを自動追加
 */
TypographyWebComponent.composeWithTypography = composeWithTypography;
/**
 * FormComponent版
 * Form-Associated Custom Elementsのベースクラス
 */
export class TypographyFormComponent extends FormComponent {
    constructor() {
        super();
        _TypographyFormComponent_fontState.set(this, { observer: null });
        ensureFontsInitialized();
    }
    connectedCallback() {
        super.connectedCallback();
        syncFontState(this);
        observeFontLoadingState(this, __classPrivateFieldGet(this, _TypographyFormComponent_fontState, "f"));
    }
    disconnectedCallback() {
        cleanupFontObserver(__classPrivateFieldGet(this, _TypographyFormComponent_fontState, "f"));
    }
}
_TypographyFormComponent_fontState = new WeakMap();
