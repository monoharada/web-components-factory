import type { Meta, StoryObj } from '@storybook/web-components';
import { defineInputText } from './input-text-define';

// コンポーネントを登録
defineInputText();

const meta: Meta = {
  title: 'Components/DADS Input Text',
  tags: ['autodocs'],
  render: (args) => {
    const inputText = document.createElement('dads-input-text');

    // 属性を設定
    if (args.label) inputText.setAttribute('label', args.label);
    if (args.supportText) inputText.setAttribute('support-text', args.supportText);
    if (args.type) inputText.setAttribute('type', args.type);
    if (args.required) inputText.setAttribute('required', '');
    if (args.error) inputText.setAttribute('error', '');
    if (args.errorText) inputText.setAttribute('error-text', args.errorText);
    if (args.disabled) inputText.setAttribute('disabled', '');
    if (args.readonly) inputText.setAttribute('readonly', '');
    if (args.name) inputText.setAttribute('name', args.name);
    if (args.size) inputText.setAttribute('size', args.size);
    if (args.inputWidth) inputText.setAttribute('input-width', args.inputWidth);
    if (args.autocomplete) inputText.setAttribute('autocomplete', args.autocomplete);
    if (args.value) inputText.setAttribute('value', args.value);

    return inputText;
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
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'tel'],
      description: '入力タイプ',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    required: {
      control: 'boolean',
      description: '必須項目',
      table: {
        defaultValue: { summary: false },
      },
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
    name: {
      control: 'text',
      description: 'フォーム名',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'サイズ',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    inputWidth: {
      control: 'text',
      description: '幅バリアント (short | medium | full | カスタム値)',
      table: {
        defaultValue: { summary: 'full' },
      },
    },
    autocomplete: {
      control: 'text',
      description: 'オートコンプリートヒント',
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
# デジタル庁デザインシステム Input Textコンポーネント

デジタル庁デザインシステム準拠のインプットテキストコンポーネントです。

## 特徴
- 🏷️ ラベル・サポートテキスト・要否表示（必須/編集不可）
- 📏 幅バリエーション（short / medium / full / カスタム値）
- ⚠️ エラー状態とエラーメッセージ表示
- ♿ WCAG 2.2 AA準拠のアクセシビリティ
- 🎯 Shadow DOM + ::part()によるカスタマイズ
- 📝 Form Associated Custom Elementとしてフォームに参加

## 使用方法

\`\`\`html
<dads-input-text
  label="メールアドレス"
  type="email"
  support-text="例: example@example.com"
  required
></dads-input-text>
\`\`\`

## 幅バリエーション

| 値 | CSS幅 | 用途 |
|----|-------|------|
| short | 8ch | 郵便番号など |
| medium | 16ch | 電話番号など |
| full | 100% | 通常の入力欄 |
| カスタム値 | そのまま適用 | 200px, 20ch, 50% など |

## スロット

| スロット名 | 説明 |
|-----------|------|
| label | ラベルテキスト |
| support-text | サポートテキスト |
| error-text | エラーメッセージ |
| required-error | カスタム必須エラーメッセージ |

## CSSパーツ

| パーツ名 | 説明 |
|---------|------|
| wrapper | 全体を囲むコンテナ |
| label | ラベル要素 |
| label-text | ラベルテキストラッパー |
| requirement | 要否ラベル（必須/編集不可） |
| support-text | サポートテキストコンテナ |
| input-wrapper | インプットを囲むコンテナ |
| input | ネイティブinput要素 |
| error-text | エラーメッセージコンテナ |

## アクセシビリティ
- ラベルとinputがfor/idで関連付け
- サポートテキスト・エラーがaria-describedbyで関連付け
- エラーメッセージにaria-liveを使用しない（DADSガイドライン準拠）
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
    label: '氏名',
    size: 'md',
  },
};

// ========== ラベル・サポートテキスト ==========

export const WithSupportText: Story = {
  name: 'サポートテキスト付き',
  args: {
    ...Default.args,
    supportText: '姓と名の間にスペースを入れてください',
  },
};

export const Required: Story = {
  name: '必須項目',
  args: {
    ...Default.args,
    required: true,
  },
};

// ========== 入力タイプ ==========

export const TypeText: Story = {
  name: 'タイプ: text',
  args: {
    label: '氏名',
    type: 'text',
    supportText: '姓と名の間にスペースを入れてください',
  },
};

export const TypeEmail: Story = {
  name: 'タイプ: email',
  args: {
    label: 'メールアドレス',
    type: 'email',
    supportText: '例: example@example.com',
    autocomplete: 'email',
  },
};

export const TypeTel: Story = {
  name: 'タイプ: tel',
  args: {
    label: '電話番号',
    type: 'tel',
    supportText: '例: 090-1234-5678',
    autocomplete: 'tel',
    inputWidth: 'medium',
  },
};

// ========== 幅バリエーション ==========

export const WidthShort: Story = {
  name: '幅: short (8ch)',
  args: {
    label: '郵便番号',
    inputWidth: 'short',
    supportText: '例: 100-0001',
  },
};

export const WidthMedium: Story = {
  name: '幅: medium (16ch)',
  args: {
    label: '電話番号',
    inputWidth: 'medium',
    supportText: '例: 090-1234-5678',
  },
};

export const WidthFull: Story = {
  name: '幅: full (100%)',
  args: {
    label: '住所',
    inputWidth: 'full',
    supportText: '都道府県から入力してください',
  },
};

export const WidthCustomPx: Story = {
  name: '幅: カスタム (300px)',
  args: {
    label: '会社名',
    inputWidth: '300px',
  },
};

export const WidthCustomCh: Story = {
  name: '幅: カスタム (25ch)',
  args: {
    label: '部署名',
    inputWidth: '25ch',
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

export const ErrorEmail: Story = {
  name: 'エラー状態（メール形式）',
  args: {
    label: 'メールアドレス',
    type: 'email',
    value: 'invalid-email',
    error: true,
    errorText: 'メールアドレスの形式が正しくありません',
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
    value: '読み取り専用のテキストです',
    supportText: 'この項目は編集できません',
  },
};

// ========== サイズ ==========

export const SizeSmall: Story = {
  name: 'サイズ: Small',
  args: {
    ...Default.args,
    size: 'sm',
    label: '氏名（小）',
  },
};

export const SizeMedium: Story = {
  name: 'サイズ: Medium',
  args: {
    ...Default.args,
    size: 'md',
    label: '氏名（中）',
  },
};

export const SizeLarge: Story = {
  name: 'サイズ: Large',
  args: {
    ...Default.args,
    size: 'lg',
    label: '氏名（大）',
  },
};

// ========== スロット使用例 ==========

export const WithSlots: Story = {
  name: 'スロット使用例',
  render: () => {
    const inputText = document.createElement('dads-input-text');
    inputText.setAttribute('required', '');

    // ラベルスロット
    const labelSlot = document.createElement('span');
    labelSlot.slot = 'label';
    labelSlot.innerHTML = '<strong>メールアドレス</strong>';
    inputText.appendChild(labelSlot);

    // サポートテキストスロット
    const supportSlot = document.createElement('span');
    supportSlot.slot = 'support-text';
    supportSlot.textContent = 'HTMLを含むリッチなサポートテキストを表示できます';
    inputText.appendChild(supportSlot);

    return inputText;
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

export const ContactFormInputs: Story = {
  name: 'お問い合わせフォーム例',
  render: () => {
    const form = document.createElement('form');
    form.style.cssText = 'max-width: 600px; padding: 24px; border: 1px solid #ddd; border-radius: 8px;';

    // タイトル
    const title = document.createElement('h3');
    title.style.cssText = 'margin: 0 0 24px 0; font-size: 18px;';
    title.textContent = 'お問い合わせ';

    // 氏名
    const nameInput = document.createElement('dads-input-text');
    nameInput.setAttribute('label', '氏名');
    nameInput.setAttribute('required', '');
    nameInput.setAttribute('support-text', '姓と名の間にスペースを入れてください');
    nameInput.setAttribute('autocomplete', 'name');
    nameInput.style.marginBottom = '16px';

    // メールアドレス
    const emailInput = document.createElement('dads-input-text');
    emailInput.setAttribute('label', 'メールアドレス');
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('required', '');
    emailInput.setAttribute('support-text', '例: example@example.com');
    emailInput.setAttribute('autocomplete', 'email');
    emailInput.style.marginBottom = '16px';

    // 電話番号
    const telInput = document.createElement('dads-input-text');
    telInput.setAttribute('label', '電話番号');
    telInput.setAttribute('type', 'tel');
    telInput.setAttribute('support-text', '例: 090-1234-5678');
    telInput.setAttribute('autocomplete', 'tel');
    telInput.setAttribute('input-width', 'medium');
    telInput.style.marginBottom = '24px';

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
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    form.appendChild(telInput);
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

export const AddressForm: Story = {
  name: '住所入力フォーム例',
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'max-width: 500px;';

    // 郵便番号
    const postalInput = document.createElement('dads-input-text');
    postalInput.setAttribute('label', '郵便番号');
    postalInput.setAttribute('support-text', '例: 100-0001');
    postalInput.setAttribute('input-width', 'short');
    postalInput.setAttribute('autocomplete', 'postal-code');
    postalInput.style.marginBottom = '16px';

    // 都道府県
    const prefInput = document.createElement('dads-input-text');
    prefInput.setAttribute('label', '都道府県');
    prefInput.setAttribute('input-width', 'medium');
    prefInput.setAttribute('autocomplete', 'address-level1');
    prefInput.style.marginBottom = '16px';

    // 市区町村
    const cityInput = document.createElement('dads-input-text');
    cityInput.setAttribute('label', '市区町村');
    cityInput.setAttribute('autocomplete', 'address-level2');
    cityInput.style.marginBottom = '16px';

    // 番地・建物名
    const addressInput = document.createElement('dads-input-text');
    addressInput.setAttribute('label', '番地・建物名');
    addressInput.setAttribute('support-text', '建物名・部屋番号がある場合は入力してください');
    addressInput.setAttribute('autocomplete', 'street-address');

    container.appendChild(postalInput);
    container.appendChild(prefInput);
    container.appendChild(cityInput);
    container.appendChild(addressInput);

    return container;
  },
  parameters: {
    docs: {
      description: {
        story: '住所入力フォームの例です。各フィールドに適切な幅とautocomplete属性を設定しています。',
      },
    },
  },
};
