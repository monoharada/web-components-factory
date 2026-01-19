import type { Meta, StoryObj } from '@storybook/web-components';
import { defineSelect } from './select-define';

// コンポーネントを登録
defineSelect();

type SelectArgs = {
  label?: string;
  supportText?: string;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  ariaDisabled?: boolean;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  value?: string;
};

const meta: Meta<SelectArgs> = {
  title: 'Components/DADS Select',
  tags: ['autodocs'],
  render: (args) => {
    const select = document.createElement('dads-select');

    if (args.label) select.setAttribute('label', args.label);
    if (args.supportText) select.setAttribute('support-text', args.supportText);
    if (args.required) select.setAttribute('required', '');
    if (args.error) select.setAttribute('error', '');
    if (args.errorText) select.setAttribute('error-text', args.errorText);
    if (args.disabled) select.setAttribute('disabled', '');
    if (args.ariaDisabled) select.setAttribute('aria-disabled', 'true');
    if (args.name) select.setAttribute('name', args.name);
    if (args.size || args.width) {
      const sizeTokens = [args.size, args.width].filter(Boolean).join(' ');
      select.setAttribute('size', sizeTokens);
    }
    if (args.value) select.setAttribute('value', args.value);

    select.innerHTML = `
      <option value="">選択してください</option>
      <option value="1">選択肢1</option>
      <option value="2">選択肢2</option>
      <option value="3">選択肢3</option>
    `;

    return select;
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
      table: { defaultValue: { summary: false } },
    },
    error: {
      control: 'boolean',
      description: 'エラー状態',
      table: { defaultValue: { summary: false } },
    },
    errorText: {
      control: 'text',
      description: 'エラーメッセージ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態（disabled）',
      table: { defaultValue: { summary: false } },
    },
    ariaDisabled: {
      control: 'boolean',
      description: '無効相当（aria-disabled）',
      table: { defaultValue: { summary: false } },
    },
    name: {
      control: 'text',
      description: 'フォーム名',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'サイズ（sm / md / lg）',
      table: { defaultValue: { summary: 'md' } },
    },
    width: {
      control: 'text',
      description: '幅指定（size属性に追加トークンとして指定: 例 "256", "256px", "20ch", "full", "fit-content"）',
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
# デジタル庁デザインシステム Select（セレクトボックス）コンポーネント

デジタル庁デザインシステム準拠のセレクトボックス（単一選択）コンポーネントです。

## 特徴
- ラベル・サポートテキスト・要否表示（※必須）
- エラー状態とエラーメッセージ表示
- サイズバリエーション（sm / md / lg）
- size属性で幅指定（例: size="md 256" / size="md full" / size="md fit-content"）
- disabled と aria-disabled（readonly相当）をサポート
- Shadow DOM + ::part() によるカスタマイズ
- Form Associated Custom Elementとしてフォームに参加

## 使用方法

\`\`\`html
<dads-select label="都道府県" support-text="選択してください" required>
  <option value="">選択してください</option>
  <option value="tokyo">東京都</option>
  <option value="kanagawa">神奈川県</option>
</dads-select>

<!-- 幅指定（数値のみは px 扱い） -->
<dads-select label="都道府県" size="md 256">
  <option value="">選択してください</option>
  <option value="tokyo">東京都</option>
</dads-select>
\`\`\`

## スロット

| スロット名 | 説明 |
|-----------|------|
| label | ラベルテキスト |
| support-text | サポートテキスト |
| error-text | エラーメッセージ |
| required-error | 必須バリデーション用カスタムエラーメッセージ |
| (default) | option / optgroup（内部selectへ複製） |

## CSSパーツ

| パーツ名 | 説明 |
|---------|------|
| wrapper | 全体を囲むコンテナ |
| label | ラベル要素 |
| label-text | ラベルテキストラッパー |
| requirement | 要否ラベル（※必須） |
| support-text | サポートテキストコンテナ |
| select-wrapper | selectを囲むコンテナ |
| select | ネイティブselect要素 |
| select-chevron | セレクトの矢印アイコン |
| error-text | エラーメッセージコンテナ |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<SelectArgs>;

export const Default: Story = {
  args: {
    label: '都道府県',
    supportText: 'お住まいの都道府県を選択してください',
    size: 'md',
  },
};

export const Required: Story = {
  name: '必須項目',
  args: {
    ...Default.args,
    required: true,
  },
};

export const Errored: Story = {
  name: 'エラー状態',
  args: {
    ...Default.args,
    error: true,
    errorText: '選択してください',
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const AriaDisabled: Story = {
  name: 'Aria Disabled',
  args: {
    ...Default.args,
    ariaDisabled: true,
    value: '2',
  },
};
