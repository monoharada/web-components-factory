// validation.test.ts
// バリデーションユーティリティのテスト

import { describe, it, expect, beforeEach } from 'vitest';
import {
  VALIDATION_RULES,
  getValidationMessage,
  validateField,
  type ValidationRule,
} from './validation';

describe('validation.ts', () => {
  describe('VALIDATION_RULES.required', () => {
    const rule = VALIDATION_RULES.required;

    it('typeが"required"である', () => {
      expect(rule.type).toBe('required');
    });

    it('slotNameが"required-error"である', () => {
      expect(rule.slotName).toBe('required-error');
    });

    it('デフォルトメッセージが「この項目は入力が必須です」', () => {
      expect(rule.defaultMessage).toBe('この項目は入力が必須です');
    });

    it('空文字列の場合はfalseを返す', () => {
      const mockElement = document.createElement('div');
      expect(rule.validate('', mockElement)).toBe(false);
    });

    it('空白のみの場合はfalseを返す', () => {
      const mockElement = document.createElement('div');
      expect(rule.validate('   ', mockElement)).toBe(false);
      expect(rule.validate('\t\n', mockElement)).toBe(false);
    });

    it('入力がある場合はtrueを返す', () => {
      const mockElement = document.createElement('div');
      expect(rule.validate('hello', mockElement)).toBe(true);
      expect(rule.validate('  hello  ', mockElement)).toBe(true);
    });
  });

  describe('VALIDATION_RULES.overflow', () => {
    const rule = VALIDATION_RULES.overflow;

    it('typeが"overflow"である', () => {
      expect(rule.type).toBe('overflow');
    });

    it('slotNameが"overflow-error"である', () => {
      expect(rule.slotName).toBe('overflow-error');
    });

    it('デフォルトメッセージが「入力可能な文字数を超えています」', () => {
      expect(rule.defaultMessage).toBe('入力可能な文字数を超えています');
    });

    it('maxlengthが設定されていない場合はtrueを返す', () => {
      const mockElement = document.createElement('div');
      expect(rule.validate('any text', mockElement)).toBe(true);
    });

    it('maxlength以下の場合はtrueを返す', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('maxlength', '10');
      expect(rule.validate('12345', mockElement)).toBe(true);
      expect(rule.validate('1234567890', mockElement)).toBe(true); // ちょうど10文字
    });

    it('maxlengthを超える場合はfalseを返す', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('maxlength', '10');
      expect(rule.validate('12345678901', mockElement)).toBe(false); // 11文字
    });

    it('counter-maxも使用できる', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('counter-max', '5');
      expect(rule.validate('12345', mockElement)).toBe(true);
      expect(rule.validate('123456', mockElement)).toBe(false);
    });

    it('maxlengthとcounter-max両方ある場合はmaxlength優先', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('maxlength', '10');
      mockElement.setAttribute('counter-max', '5');
      // maxlength=10が優先される
      expect(rule.validate('12345678', mockElement)).toBe(true);
    });
  });

  describe('getValidationMessage', () => {
    let element: HTMLElement;
    let rule: ValidationRule;

    beforeEach(() => {
      element = document.createElement('div');
      element.attachShadow({ mode: 'open' });
      rule = {
        type: 'test',
        validate: () => true,
        defaultMessage: 'デフォルトメッセージ',
        slotName: 'test-error',
      };
    });

    it('スロットがない場合はデフォルトメッセージを返す', () => {
      const message = getValidationMessage(element, rule);
      expect(message).toBe('デフォルトメッセージ');
    });

    // スロットコンテンツのテストは実ブラウザ環境でないとassignedNodesが
    // 正しく動作しないため、textareaコンポーネントの統合テストで検証する
    it.skip('スロットにコンテンツがある場合はそれを返す（統合テストで検証）', () => {
      // このテストはtextarea.test.tsで実際のコンポーネントを使って検証
    });

    it('スロットが空の場合はデフォルトメッセージを返す', () => {
      const slot = document.createElement('slot');
      slot.name = 'test-error';
      element.shadowRoot!.appendChild(slot);

      const message = getValidationMessage(element, rule);
      expect(message).toBe('デフォルトメッセージ');
    });

    it('スロットに空白のみの場合はデフォルトメッセージを返す', () => {
      const slot = document.createElement('slot');
      slot.name = 'test-error';
      element.shadowRoot!.appendChild(slot);

      const content = document.createElement('span');
      content.slot = 'test-error';
      content.textContent = '   ';
      element.appendChild(content);

      const message = getValidationMessage(element, rule);
      expect(message).toBe('デフォルトメッセージ');
    });
  });

  describe('validateField', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
    });

    it('全てのルールが通る場合はvalid: trueを返す', () => {
      const rules = [VALIDATION_RULES.required, VALIDATION_RULES.overflow];
      element.setAttribute('maxlength', '10');

      const result = validateField('hello', element, rules);
      expect(result.valid).toBe(true);
      expect(result.errorRule).toBeNull();
    });

    it('requiredが失敗した場合はvalid: falseとerrorRuleを返す', () => {
      const rules = [VALIDATION_RULES.required, VALIDATION_RULES.overflow];

      const result = validateField('', element, rules);
      expect(result.valid).toBe(false);
      expect(result.errorRule?.type).toBe('required');
    });

    it('overflowが失敗した場合はvalid: falseとerrorRuleを返す', () => {
      const rules = [VALIDATION_RULES.required, VALIDATION_RULES.overflow];
      element.setAttribute('maxlength', '5');

      const result = validateField('123456', element, rules);
      expect(result.valid).toBe(false);
      expect(result.errorRule?.type).toBe('overflow');
    });

    it('ルールが空の場合はvalid: trueを返す', () => {
      const result = validateField('anything', element, []);
      expect(result.valid).toBe(true);
      expect(result.errorRule).toBeNull();
    });

    it('最初に失敗したルールのみ返す', () => {
      // requiredとoverflowの両方が失敗するケースは存在しないが、
      // 順序のテストとして複数の失敗ルールを用意
      const alwaysFail: ValidationRule = {
        type: 'always-fail',
        validate: () => false,
        defaultMessage: 'Always fails',
        slotName: 'always-fail-error',
      };
      const rules = [alwaysFail, VALIDATION_RULES.required];

      const result = validateField('hello', element, rules);
      expect(result.valid).toBe(false);
      expect(result.errorRule?.type).toBe('always-fail');
    });
  });
});
