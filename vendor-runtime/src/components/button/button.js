/**
 * @module button
 * デジタル庁デザインシステム Buttonコンポーネント
 * @version 1.0.0
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DadsButton_instances, _DadsButton_handleHostClick, _DadsButton_isLink, _DadsButton_renderTemplate, _DadsButton_createTemplate, _DadsButton_initButton, _DadsButton_handleClick, _DadsButton_handleFormAction, _DadsButton_emitClickEvent;
import { html, BooleanAttr, PropertyAttr, DelegatingPropertyAttr } from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { buttonTokens } from '../../styles/design-tokens/button-tokens.js';
import { buttonStyles } from './button-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';
/**
 * Buttonコンポーネント
 *
 * @customElement dads-button
 * @tagname dads-button
 *
 * @slot default - ボタンのテキストコンテンツ
 * @slot icon-start - 先頭アイコン（オプション）
 * @slot icon-end - 末尾アイコン（オプション）
 *
 * @csspart base - ボタン要素本体
 * @csspart icon-start - 先頭アイコンコンテナ
 * @csspart label - ラベルテキストコンテナ
 * @csspart icon-end - 末尾アイコンコンテナ
 *
 * @attr {string} variant - バリアント (solid | outlined | text)
 * @attr {string} size - サイズ (x-small | small | medium | large)
 * @attr {boolean} disabled - 無効化状態
 * @attr {string} type - ボタンタイプ (button | submit | reset)
 * @attr {boolean} full-width - 幅100%表示
 * @attr {string} aria-label - アクセシビリティラベル
 * @attr {string} command - command-store / commandfor 用（任意、動作は外部に委ねる）
 * @attr {string} commandfor - command-store / commandfor 用（任意、動作は外部に委ねる）
 *
 * @fires click - クリック時に発火（detail: {variant, size}）
 *
 * @example
 * ```html
 * <dads-button variant="solid" size="medium">
 *   ボタンテキスト
 * </dads-button>
 * ```
 */
export class DadsButton extends TypographyFormComponent {
    constructor() {
        super(...arguments);
        _DadsButton_instances.add(this);
        /**
         * ホスト要素のクリックハンドラ
         * Shadow DOM内のbutton要素のクリックがない場合（遅延ロード中）のフォールバック
         */
        _DadsButton_handleHostClick.set(this, (event) => {
            // #emitClickEventのCustomEventはobject detail({ variant, size })
            // ネイティブMouseEventはnumber detail（クリック回数、.click()は0）
            // これにより.click()は許可しつつ、#handleClickとの二重実行を防ぐ
            if (typeof event.detail !== 'number')
                return;
            // リンクモードはスキップ（aタグのデフォルト動作に任せる）
            if (__classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_isLink).call(this))
                return;
            // disabled時は何もしない
            if (this.hasAttribute('disabled')) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            // Shadow DOM内のボタンがクリックされた場合は、内部ハンドラに任せる
            // （二重実行を防ぐ）
            const composedPath = event.composedPath();
            const innerButton = this.shadowRoot?.querySelector('[part="base"]');
            if (innerButton && composedPath.includes(innerButton)) {
                // 内部ボタンがクリックされた → #handleClick で処理される
                return;
            }
            // 内部ボタン以外（ホスト要素の境界部分など）がクリックされた場合
            // または遅延ロード中で内部ボタンがない場合
            __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_handleFormAction).call(this);
        });
        _DadsButton_handleClick.set(this, (event) => {
            // リンクモードは既存処理のみ
            if (__classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_isLink).call(this)) {
                __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_emitClickEvent).call(this);
                return;
            }
            // button要素でdisabled時はイベントを止める
            if (this.hasAttribute('disabled')) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            // フォーム操作を実行
            __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_handleFormAction).call(this);
            // カスタムイベントを発火
            __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_emitClickEvent).call(this);
        });
    }
    connectedCallback() {
        super.connectedCallback();
        // デフォルト属性の設定
        setDefaultAttributes(this, { variant: 'solid', size: 'medium' });
        // リンクの場合のみテンプレートを再レンダリング
        if (__classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_isLink).call(this)) {
            __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_renderTemplate).call(this);
        }
        // ボタン要素の初期化
        __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_initButton).call(this);
        this.transferDelegatedAttributes();
        // ホスト要素へのクリックリスナー追加
        // Shadow DOM内のbutton要素に加えて、ホスト要素自体のクリックも処理
        // これにより遅延ロード時のクリックも確実に処理される
        this.addEventListener('click', __classPrivateFieldGet(this, _DadsButton_handleHostClick, "f"));
    }
    disconnectedCallback() {
        this.removeEventListener('click', __classPrivateFieldGet(this, _DadsButton_handleHostClick, "f"));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        // as属性やhref属性が変更された場合は再レンダリングが必要
        if (name === 'as' || name === 'href') {
            __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_renderTemplate).call(this);
            __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_initButton).call(this);
            this.transferDelegatedAttributes();
            return;
        }
        const base = this.shadowRoot?.querySelector('[part="base"]');
        if (!base)
            return;
        const isLink = __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_isLink).call(this);
        switch (name) {
            case 'type':
                if (!isLink && base instanceof HTMLButtonElement) {
                    base.type = (newValue || 'button');
                }
                break;
            case 'disabled':
                // button要素のみdisabled処理（a要素は無視）
                if (!isLink && base instanceof HTMLButtonElement) {
                    base.disabled = this.hasAttribute('disabled');
                }
                break;
            case 'target':
            case 'rel':
                if (isLink && base instanceof HTMLAnchorElement) {
                    if (newValue)
                        base.setAttribute(name, newValue);
                    else
                        base.removeAttribute(name);
                }
                break;
            case 'download':
                if (isLink && base instanceof HTMLAnchorElement) {
                    if (this.hasAttribute('download'))
                        base.setAttribute('download', '');
                    else
                        base.removeAttribute('download');
                }
                break;
            case 'aria-label':
                if (newValue)
                    base.setAttribute('aria-label', newValue);
                else
                    base.removeAttribute('aria-label');
                break;
        }
    }
}
_DadsButton_handleHostClick = new WeakMap(), _DadsButton_handleClick = new WeakMap(), _DadsButton_instances = new WeakSet(), _DadsButton_isLink = function _DadsButton_isLink() {
    const as = this.getAttribute('as');
    // 明示的な指定があればそれに従う
    if (as === 'link' || as === 'a')
        return true;
    if (as === 'button')
        return false;
    // hrefがあればリンクと判定
    return this.hasAttribute('href');
}, _DadsButton_renderTemplate = function _DadsButton_renderTemplate() {
    if (!this.shadowRoot)
        return;
    const template = __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_createTemplate).call(this, __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_isLink).call(this));
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
}, _DadsButton_createTemplate = function _DadsButton_createTemplate(isLink) {
    const template = document.createElement('template');
    const innerContent = `
      <span part="icon-start"><slot name="icon-start"></slot></span>
      <span part="label"><slot></slot></span>
      <span part="icon-end"><slot name="icon-end"></slot></span>
    `;
    if (isLink) {
        const href = this.getAttribute('href') || '#';
        const target = this.getAttribute('target');
        const rel = this.getAttribute('rel');
        const download = this.hasAttribute('download');
        template.innerHTML = `
        <a part="base" href="${href}"${target ? ` target="${target}"` : ''}${rel ? ` rel="${rel}"` : ''}${download ? ' download' : ''}>
          ${innerContent}
        </a>
      `;
    }
    else {
        template.innerHTML = `
        <button part="base" type="${this.getAttribute('type') || 'button'}">
          ${innerContent}
        </button>
      `;
    }
    return template;
}, _DadsButton_initButton = function _DadsButton_initButton() {
    const base = this.shadowRoot?.querySelector('[part="base"]');
    if (!base)
        return;
    const isLink = __classPrivateFieldGet(this, _DadsButton_instances, "m", _DadsButton_isLink).call(this);
    if (!isLink) {
        // button要素の場合
        const button = base;
        button.type = (this.getAttribute('type') || 'button');
        button.disabled = this.hasAttribute('disabled');
    }
    // a要素の場合はdisabled処理不要
    // 共通属性
    const ariaLabel = this.getAttribute('aria-label');
    if (ariaLabel)
        base.setAttribute('aria-label', ariaLabel);
    // イベントリスナー
    base.addEventListener('click', __classPrivateFieldGet(this, _DadsButton_handleClick, "f"));
}, _DadsButton_handleFormAction = function _DadsButton_handleFormAction() {
    const form = this._internals.form;
    if (!form)
        return;
    const buttonType = this.getAttribute('type') || 'button';
    switch (buttonType) {
        case 'submit':
            // カスタムバリデーションはsubmitイベントハンドラで処理されるため、
            // reportValidity()は呼ばない（ネイティブバリデーションとの干渉を防ぐ）
            // フォームにnovalidate属性がある場合や、カスタムWeb Componentsを使用する場合に対応
            form.requestSubmit();
            break;
        case 'reset':
            form.reset();
            break;
        // 'button'タイプは何もしない
    }
}, _DadsButton_emitClickEvent = function _DadsButton_emitClickEvent() {
    this.dispatchEvent(new CustomEvent('click', {
        detail: {
            variant: this.getAttribute('variant') || 'solid',
            size: this.getAttribute('size') || 'medium'
        },
        bubbles: true,
        composed: true
    }));
};
DadsButton.formAssociated = true;
DadsButton.definition = {
    name: 'dads-button',
    template: html `
      <button 
        part="base"
        type="button"
      >
        <span part="icon-start">
          <slot name="icon-start"></slot>
        </span>
        <span part="label">
          <slot></slot>
        </span>
        <span part="icon-end">
          <slot name="icon-end"></slot>
        </span>
      </button>
    `,
    styles: withReset([
        applyDADSTokens(),
        applySpacingTokens(),
        buttonTokens,
        buttonStyles,
        applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
        PropertyAttr('variant'),
        PropertyAttr('size'),
        BooleanAttr('disabled'),
        PropertyAttr('type'),
        BooleanAttr('full-width'),
        PropertyAttr('aria-label'),
        DelegatingPropertyAttr('[part="base"]', 'command'),
        DelegatingPropertyAttr('[part="base"]', 'commandfor'),
        PropertyAttr('as'),
        PropertyAttr('href'),
        PropertyAttr('target'),
        PropertyAttr('rel'),
        BooleanAttr('download')
    ]
};
