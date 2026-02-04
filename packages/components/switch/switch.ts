/**
 * @module switch
 * デジタル庁デザインシステム Switchコンポーネント
 * @version 1.0.0
 */

import {
  html,
  BooleanAttr,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { switchTokens } from './switch-tokens.js';
import { switchStyles } from './switch-styles.js';
import { withReset } from '../../styles/reset-css.js';
import { applyDADSFocusStyles } from '../../styles/mixins/focus-styles-official.js';
import { applyStandardFormElementBehavior } from '../../utils/behaviors.js';
import { setDefaultAttributes } from '../../utils/form-component-helpers.js';

/**
 * Switchコンポーネント
 *
 * @customElement dads-switch
 * @tagname dads-switch
 *
 * @slot label-left - 左側ラベル
 * @slot label-right - 右側ラベル
 *
 * @csspart wrapper - 全体を囲むコンテナ
 * @csspart label-left - 左側ラベルコンテナ
 * @csspart label-right - 右側ラベルコンテナ
 * @csspart switch - スイッチのlabel要素
 * @csspart checkbox - 内部チェックボックス（visually hidden）
 * @csspart track - スイッチのトラック（背景）
 * @csspart knob - スイッチのノブ（つまみ）
 *
 * @attr {boolean} checked - スイッチの状態
 * @attr {boolean} disabled - 無効状態
 * @attr {string} name - フォーム名
 * @attr {string} value - チェック時のフォーム値（デフォルト: "on"）
 * @attr {string} size - サイズ（sm / md / lg）デフォルト: md
 *
 * @fires dads-change - 状態変更時に発火
 *
 * @example
 * ```html
 * <dads-switch>
 *   <span slot="label-left">OFF</span>
 *   <span slot="label-right">ON</span>
 * </dads-switch>
 * ```
 */
export class DadsSwitch extends TypographyFormComponent {
  static readonly formAssociated = true;

  /**
   * アクセシビリティ注釈メタデータ
   * a11y-annotateコンポーネントが参照
   */

  // Private fields
  #checkbox: HTMLInputElement | null = null;
  #labelLeft: HTMLElement | null = null;
  #labelRight: HTMLElement | null = null;
  #value = 'on';

  static definition = {
    name: 'dads-switch',
    template: html`
      <div part="wrapper">
        <span part="label-left">
          <slot name="label-left"></slot>
        </span>
        <label part="switch">
          <input
            type="checkbox"
            part="checkbox"
            id="checkbox"
            role="switch"
            aria-checked="false"
          />
          <span part="track">
            <span part="knob"></span>
          </span>
        </label>
        <span part="label-right">
          <slot name="label-right"></slot>
        </span>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      switchTokens,
      switchStyles,
      applyDADSFocusStyles(),
    ], 'minimal'),
    attributes: [
      BooleanAttr('checked'),
      BooleanAttr('disabled'),
      PropertyAttr('name'),
      // value は observedAttributes に含めるが、PropertyAttr は使わない（カスタムgetter/setterを保持）
      { attribute: 'value' },
      PropertyAttr('size'),
    ],
  };

  connectedCallback() {
    super.connectedCallback();

    // デフォルト属性の設定
    setDefaultAttributes(this, { size: 'md' });

    // 内部要素の参照を取得
    this.#checkbox = this.shadowRoot?.querySelector('[part="checkbox"]') as HTMLInputElement;
    this.#labelLeft = this.shadowRoot?.querySelector('[part="label-left"]') as HTMLElement;
    this.#labelRight = this.shadowRoot?.querySelector('[part="label-right"]') as HTMLElement;

    // 初期化
    this.#initCheckbox();
    this.#initLabels();

    // 属性が接続後に設定された場合のために再同期
    queueMicrotask(() => {
      if (!this.isConnected) return;
      this.#syncAllState();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();

    // イベントリスナーのクリーンアップ
    this.#checkbox?.removeEventListener('change', this.#handleChange);
    this.#checkbox?.removeEventListener('keydown', this.#handleKeydown);
    this.#labelLeft?.removeEventListener('click', this.#handleLabelClick);
    this.#labelRight?.removeEventListener('click', this.#handleLabelClick);
  }

  #syncAllState(): void {
    this.#syncCheckboxAttributes();
  }

  #initCheckbox() {
    if (!this.#checkbox) return;

    // 属性の転送
    this.#syncCheckboxAttributes();

    // イベントリスナー
    this.#checkbox.addEventListener('change', this.#handleChange);
    this.#checkbox.addEventListener('keydown', this.#handleKeydown);
  }

  #handleKeydown = (event: KeyboardEvent) => {
    // disabled時は無視
    if (this.hasAttribute('disabled')) return;

    switch (event.key) {
      case 'Enter':
        // Enterでトグル
        event.preventDefault();
        this.#checkbox?.click();
        break;
      case 'ArrowLeft':
        // 左矢印でOFF
        event.preventDefault();
        if (this.hasAttribute('checked')) {
          this.removeAttribute('checked');
          this.#triggerChange(false);
        }
        break;
      case 'ArrowRight':
        // 右矢印でON
        event.preventDefault();
        if (!this.hasAttribute('checked')) {
          this.setAttribute('checked', '');
          this.#triggerChange(true);
        }
        break;
    }
  };

  #triggerChange(checked: boolean) {
    if (!this.#checkbox) return;

    // checkbox状態を同期
    this.#checkbox.checked = checked;
    this.#checkbox.setAttribute('aria-checked', checked ? 'true' : 'false');

    // フォーム値更新
    this.#updateFormValue();

    // カスタムイベント発火
    this.emitEvent('dads-change', { checked });
  }

  #initLabels() {
    // ラベルクリックでスイッチをトグル
    this.#labelLeft?.addEventListener('click', this.#handleLabelClick);
    this.#labelRight?.addEventListener('click', this.#handleLabelClick);
  }

  #handleLabelClick = () => {
    // disabled時は無視
    if (this.hasAttribute('disabled')) return;

    // checkboxをクリックしてトグル
    this.#checkbox?.click();
  };

  #syncCheckboxAttributes() {
    if (!this.#checkbox) return;

    // checked状態の同期
    const isChecked = this.hasAttribute('checked');
    this.#checkbox.checked = isChecked;
    this.#checkbox.setAttribute('aria-checked', isChecked ? 'true' : 'false');

    // disabled状態
    this.#checkbox.disabled = this.hasAttribute('disabled');

    // name属性
    const name = this.getAttribute('name');
    if (name !== null) {
      this.#checkbox.setAttribute('name', name);
    }

    // フォーム値の設定
    this.#updateFormValue();
  }

  #updateFormValue() {
    if (this.hasAttribute('checked')) {
      this._internals.setFormValue(this.#value);
    } else {
      this._internals.setFormValue(null);
    }
  }

  // BooleanAttr('checked')から呼び出されるコールバック
  checkedChanged(): void {
    this.#syncAriaChecked(this.hasAttribute('checked'));
    this.#updateFormValue();
  }

  #handleChange = () => {
    if (!this.#checkbox) return;

    // checked属性を同期
    if (this.#checkbox.checked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }

    // aria-checked更新
    this.#checkbox.setAttribute('aria-checked', this.#checkbox.checked ? 'true' : 'false');

    // フォーム値更新
    this.#updateFormValue();

    // カスタムイベント発火
    this.emitEvent('dads-change', { checked: this.#checkbox.checked });
  };

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    // shadowRootが無い場合は無視（connectedCallback前）
    if (!this.shadowRoot) return;

    // checkboxを常にshadowRootから取得（キャッシュを使わない）
    const checkbox = this.shadowRoot.querySelector('[part="checkbox"]') as HTMLInputElement;
    if (!checkbox) return;

    switch (name) {
      case 'checked':
        checkbox.checked = this.hasAttribute('checked');
        checkbox.setAttribute('aria-checked', this.hasAttribute('checked') ? 'true' : 'false');
        this.#updateFormValue();
        break;
      case 'disabled':
        checkbox.disabled = this.hasAttribute('disabled');
        break;
      case 'name':
        if (newValue !== null) {
          checkbox.setAttribute('name', newValue);
        } else {
          checkbox.removeAttribute('name');
        }
        break;
      case 'value':
        this.#value = newValue ?? 'on';
        this.#updateFormValue();
        break;
    }
  }

  // Public API
  get checked(): boolean {
    return this.hasAttribute('checked');
  }

  set checked(value: boolean) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
    // 直接aria-checkedも更新（attributeChangedCallbackの補完）
    this.#syncAriaChecked(value);
  }

  #syncAriaChecked(isChecked?: boolean): void {
    const checkbox = this.shadowRoot?.querySelector('[part="checkbox"]') as HTMLInputElement | null;
    if (checkbox) {
      const checked = isChecked ?? this.hasAttribute('checked');
      checkbox.checked = checked;
      checkbox.setAttribute('aria-checked', checked ? 'true' : 'false');
    }
  }

  get value(): string {
    return this.#value;
  }

  set value(v: string) {
    this.#value = v;
    this.#updateFormValue();
  }

  // Form callbacks
  formResetCallback() {
    // 初期状態に戻す（checked属性が初期状態）
    const defaultChecked = this.hasAttribute('checked');
    if (this.#checkbox) {
      this.#checkbox.checked = defaultChecked;
      this.#checkbox.setAttribute('aria-checked', defaultChecked ? 'true' : 'false');
    }
    this.#updateFormValue();
  }

  formStateRestoreCallback(state: unknown, _mode: unknown) {
    if (state !== null && typeof state === 'string') {
      this.checked = state === this.#value;
    }
  }

  formDisabledCallback(disabled: boolean) {
    super.formDisabledCallback(disabled);
    if (this.#checkbox) {
      this.#checkbox.disabled = disabled;
    }
  }

  // Focus delegation
  focus(options?: FocusOptions) {
    this.#checkbox?.focus(options);
  }

  blur() {
    this.#checkbox?.blur();
  }
}

// フォーム要素の標準動作を適用
applyStandardFormElementBehavior(DadsSwitch, 'value', 'value');
