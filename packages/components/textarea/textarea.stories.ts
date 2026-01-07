import type { Meta, StoryObj } from '@storybook/web-components';
import { defineTextarea } from './textarea-define';

// コンポーネントを登録
defineTextarea();

const meta: Meta = {
  title: 'Components/DADS Textarea',
  tags: ['autodocs'],
  render: (args) => {
    const textarea = document.createElement('dads-textarea');

    // 属性を設定
    if (args.label) textarea.setAttribute('label', args.label);
    if (args.supportText) textarea.setAttribute('support-text', args.supportText);
    if (args.required) textarea.setAttribute('required', '');
    if (args.optional) textarea.setAttribute('optional', '');
    if (args.maxlength) textarea.setAttribute('maxlength', String(args.maxlength));
    if (args.showCounter) textarea.setAttribute('show-counter', '');
    if (args.counterMax) textarea.setAttribute('counter-max', String(args.counterMax));
    if (args.error) textarea.setAttribute('error', '');
    if (args.errorText) textarea.setAttribute('error-text', args.errorText);
    if (args.disabled) textarea.setAttribute('disabled', '');
    if (args.readonly) textarea.setAttribute('readonly', '');
    if (args.placeholder) textarea.setAttribute('placeholder', args.placeholder);
    if (args.name) textarea.setAttribute('name', args.name);
    if (args.rows) textarea.setAttribute('rows', String(args.rows));
    if (args.size) textarea.setAttribute('size', args.size);
    if (args.value) textarea.setAttribute('value', args.value);

    return textarea;
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'ラベルテキスト',
    },
    supportText: {
      control: 'text',
      description: 'サポートテキスト（ヒント）',
    },
    required: {
      control: 'boolean',
      description: '必須項目',
      table: {
        defaultValue: { summary: false },
      },
    },
    optional: {
      control: 'boolean',
      description: '任意表示',
      table: {
        defaultValue: { summary: false },
      },
    },
    maxlength: {
      control: 'number',
      description: '最大文字数',
    },
    showCounter: {
      control: 'boolean',
      description: '文字数カウンター表示',
      table: {
        defaultValue: { summary: false },
      },
    },
    counterMax: {
      control: 'number',
      description: 'カウンター用最大値（maxlength未設定時）',
    },
    error: {
      control: 'boolean',
      description: 'エラー状態',
      table: {
        defaultValue: { summary: false },
      },
    },
    errorText: {
      control: 'text',
      description: 'エラーメッセージ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
      table: {
        defaultValue: { summary: false },
      },
    },
    readonly: {
      control: 'boolean',
      description: '読み取り専用',
      table: {
        defaultValue: { summary: false },
      },
    },
    placeholder: {
      control: 'text',
      description: 'プレースホルダー',
    },
    name: {
      control: 'text',
      description: 'フォーム名',
    },
    rows: {
      control: 'number',
      description: '行数',
      table: {
        defaultValue: { summary: 3 },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'サイズ',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    value: {
      control: 'text',
      description: '初期値',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
# デジタル庁デザインシステム Textareaコンポーネント

デジタル庁デザインシステム準拠のテキストエリアコンポーネントです。

## 特徴
- 🏷️ ラベル・サポートテキスト・要否表示（必須/任意）
- 🔢 文字数カウンター（「0/100」形式）
- ⚠️ エラー状態とエラーメッセージ表示
- ♿ WCAG 2.2 AA準拠のアクセシビリティ
- 🎯 Shadow DOM + ::part()によるカスタマイズ
- 📝 Form Associated Custom Elementとしてフォームに参加

## 使用方法

\`\`\`html
<dads-textarea
  label="お問い合わせ内容"
  support-text="500文字以内で入力してください"
  required
  show-counter
  maxlength="500"
></dads-textarea>
\`\`\`

## スロット

| スロット名 | 説明 |
|-----------|------|
| label | ラベルテキスト |
| support-text | サポートテキスト |
| error-text | エラーメッセージ |

## CSSパーツ

| パーツ名 | 説明 |
|---------|------|
| wrapper | 全体を囲むコンテナ |
| label | ラベル要素 |
| requirement | 要否ラベル（必須/任意） |
| support-text | サポートテキストコンテナ |
| textarea-wrapper | テキストエリアを囲むコンテナ |
| textarea | ネイティブtextarea要素 |
| footer | カウンターを囲むコンテナ |
| counter | 文字数カウンター |
| error-text | エラーメッセージコンテナ |

## アクセシビリティ
- ラベルとtextareaがfor/idで関連付け
- サポートテキスト・カウンター・エラーがaria-describedbyで関連付け
- カウンターはaria-describedbyで関連付け（DADSガイドライン準拠）
- エラーメッセージはaria-describedbyで関連付け（DADSガイドライン準拠）
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

// ========== 基本ストーリー ==========

export const Default: Story = {
  args: {
    label: 'お問い合わせ内容',
    placeholder: '内容を入力してください',
    rows: 3,
    size: 'md',
  },
};

// ========== ラベル・サポートテキスト ==========

export const WithSupportText: Story = {
  name: 'サポートテキスト付き',
  args: {
    ...Default.args,
    supportText: '500文字以内で入力してください',
  },
};

export const Required: Story = {
  name: '必須項目',
  args: {
    ...Default.args,
    required: true,
  },
};

export const Optional: Story = {
  name: '任意項目',
  args: {
    ...Default.args,
    optional: true,
  },
};

// ========== 文字数カウンター ==========

export const WithCounter: Story = {
  name: '文字数カウンター付き',
  args: {
    ...Default.args,
    showCounter: true,
    maxlength: 500,
    supportText: '500文字以内で入力してください',
  },
};

export const CounterWithoutMaxlength: Story = {
  name: 'カウンター（最大値表示のみ）',
  args: {
    ...Default.args,
    showCounter: true,
    counterMax: 200,
    supportText: '200文字を目安に入力してください',
  },
  parameters: {
    docs: {
      description: {
        story: 'counter-maxを使用すると、入力制限なしで目安の最大値を表示できます。',
      },
    },
  },
};

// ========== エラー状態 ==========

export const Error: Story = {
  name: 'エラー状態',
  args: {
    ...Default.args,
    required: true,
    error: true,
    errorText: '入力内容を確認してください',
  },
};

export const ErrorWithCounter: Story = {
  name: 'エラー状態（カウンター付き）',
  args: {
    ...Default.args,
    showCounter: true,
    maxlength: 100,
    error: true,
    errorText: '100文字を超えています',
    value: 'これは非常に長いテキストで、最大文字数の100文字を大幅に超えてしまっています。エラー状態が表示され、カウンターも超過を示しています。',
  },
};

// ========== 状態 ==========

export const Disabled: Story = {
  name: '無効状態',
  args: {
    ...Default.args,
    disabled: true,
    value: '編集できません',
  },
};

export const Readonly: Story = {
  name: '読み取り専用',
  args: {
    ...Default.args,
    readonly: true,
    value: '読み取り専用のテキストです。選択・コピーは可能です。',
  },
};

// ========== サイズ ==========

export const SizeSmall: Story = {
  name: 'サイズ: Small',
  args: {
    ...Default.args,
    size: 'sm',
    label: '備考（小）',
  },
};

export const SizeMedium: Story = {
  name: 'サイズ: Medium',
  args: {
    ...Default.args,
    size: 'md',
    label: '備考（中）',
  },
};

export const SizeLarge: Story = {
  name: 'サイズ: Large',
  args: {
    ...Default.args,
    size: 'lg',
    label: '備考（大）',
  },
};

// ========== 行数 ==========

export const Rows5: Story = {
  name: '5行表示',
  args: {
    ...Default.args,
    rows: 5,
    label: '詳細な説明',
    supportText: '複数行で詳しく入力してください',
  },
};

export const Rows10: Story = {
  name: '10行表示',
  args: {
    ...Default.args,
    rows: 10,
    label: '長文入力欄',
  },
};

// ========== スロット使用例 ==========

export const WithSlots: Story = {
  name: 'スロット使用例',
  render: () => {
    const textarea = document.createElement('dads-textarea');
    textarea.setAttribute('required', '');
    textarea.setAttribute('show-counter', '');
    textarea.setAttribute('maxlength', '300');

    // ラベルスロット
    const labelSlot = document.createElement('span');
    labelSlot.slot = 'label';
    labelSlot.innerHTML = '<strong>お問い合わせ内容</strong>';
    textarea.appendChild(labelSlot);

    // サポートテキストスロット
    const supportSlot = document.createElement('span');
    supportSlot.slot = 'support-text';
    supportSlot.textContent = 'HTMLを含むリッチなサポートテキストを表示できます';
    textarea.appendChild(supportSlot);

    return textarea;
  },
  parameters: {
    docs: {
      description: {
        story: 'スロットを使用してリッチなコンテンツを表示できます。スロットは属性より優先されます。',
      },
    },
  },
};

// ========== 実践的な使用例 ==========

export const ContactForm: Story = {
  name: 'お問い合わせフォーム例',
  render: () => {
    const form = document.createElement('form');
    form.style.cssText = 'max-width: 600px; padding: 24px; border: 1px solid #ddd; border-radius: 8px;';

    // タイトル
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 24px 0; font-size: 18px;';
    title.textContent = 'お問い合わせ';

    // 件名入力
    const subjectDiv = document.createElement('div');
    subjectDiv.style.marginBottom = '16px';
    const subjectLabel = document.createElement('label');
    subjectLabel.setAttribute('for', 'subject');
    subjectLabel.style.cssText = 'display: block; margin-bottom: 4px; font-weight: bold;';
    subjectLabel.textContent = '件名';
    const subjectInput = document.createElement('input');
    subjectInput.id = 'subject';
    subjectInput.type = 'text';
    subjectInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;';
    subjectDiv.appendChild(subjectLabel);
    subjectDiv.appendChild(subjectInput);

    // Textarea
    const textarea = document.createElement('dads-textarea');
    textarea.setAttribute('label', 'お問い合わせ内容');
    textarea.setAttribute('support-text', '具体的な内容をご記入ください（500文字以内）');
    textarea.setAttribute('required', '');
    textarea.setAttribute('show-counter', '');
    textarea.setAttribute('maxlength', '500');
    textarea.setAttribute('rows', '5');
    textarea.setAttribute('placeholder', 'ご質問やご要望をお書きください');
    textarea.style.marginBottom = '24px';

    // ボタン
    const buttonDiv = document.createElement('div');
    buttonDiv.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.style.cssText = 'padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;';
    cancelBtn.textContent = 'キャンセル';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.style.cssText = 'padding: 8px 16px; border: none; background: #0050b3; color: white; border-radius: 4px; cursor: pointer;';
    submitBtn.textContent = '送信';

    buttonDiv.appendChild(cancelBtn);
    buttonDiv.appendChild(submitBtn);

    form.appendChild(title);
    form.appendChild(subjectDiv);
    form.appendChild(textarea);
    form.appendChild(buttonDiv);

    return form;
  },
  parameters: {
    docs: {
      description: {
        story: '実際のフォームでの使用例です。',
      },
    },
  },
};

export const FeedbackForm: Story = {
  name: 'フィードバックフォーム例',
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'max-width: 500px;';

    // 良かった点
    const goodTextarea = document.createElement('dads-textarea');
    goodTextarea.setAttribute('label', '良かった点');
    goodTextarea.setAttribute('support-text', '特に良かったと思う点をお聞かせください');
    goodTextarea.setAttribute('optional', '');
    goodTextarea.setAttribute('rows', '3');
    goodTextarea.style.marginBottom = '16px';

    // 改善点
    const improveTextarea = document.createElement('dads-textarea');
    improveTextarea.setAttribute('label', '改善してほしい点');
    improveTextarea.setAttribute('support-text', '改善のご提案があればお聞かせください');
    improveTextarea.setAttribute('optional', '');
    improveTextarea.setAttribute('show-counter', '');
    improveTextarea.setAttribute('counter-max', '300');
    improveTextarea.setAttribute('rows', '3');

    container.appendChild(goodTextarea);
    container.appendChild(improveTextarea);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: '複数のテキストエリアを使用したフィードバックフォームの例です。',
      },
    },
  },
};
