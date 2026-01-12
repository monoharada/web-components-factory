import type { Meta, StoryObj } from '@storybook/web-components';
import { defineDefaultCheckbox } from './checkbox-define';

defineDefaultCheckbox();

type Args = {
  label: string;
  size: 'sm' | 'md' | 'lg';
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  required: boolean;
  error: boolean;
  name: string;
  value: string;
  ariaLabel: string;
};

const meta: Meta<Args> = {
  title: 'Components/DADS Checkbox',
  tags: ['autodocs'],
  render: (args) => {
    const checkbox = document.createElement('dads-checkbox');

    if (args.label) checkbox.setAttribute('label', args.label);
    checkbox.setAttribute('size', args.size);

    if (args.checked) checkbox.setAttribute('checked', '');
    if (args.indeterminate) checkbox.setAttribute('indeterminate', '');
    if (args.disabled) checkbox.setAttribute('disabled', '');
    if (args.required) checkbox.setAttribute('required', '');
    if (args.error) checkbox.setAttribute('error', '');

    if (args.name) checkbox.setAttribute('name', args.name);
    if (args.value) checkbox.setAttribute('value', args.value);
    if (args.ariaLabel) checkbox.setAttribute('aria-label', args.ariaLabel);

    return checkbox;
  },
  argTypes: {
    label: { control: 'text', description: 'ラベルテキスト' },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'サイズ',
      table: { defaultValue: { summary: 'sm' } },
    },
    checked: { control: 'boolean', description: 'チェック状態' },
    indeterminate: { control: 'boolean', description: '不確定状態' },
    disabled: { control: 'boolean', description: '無効状態' },
    required: { control: 'boolean', description: '必須（auto-validate時にsubmitで検証）' },
    error: { control: 'boolean', description: 'エラー状態（aria-invalid="true"）' },
    name: { control: 'text', description: 'フォーム名' },
    value: { control: 'text', description: '送信値（未指定時は "on"）' },
    ariaLabel: { control: 'text', description: 'aria-label（ラベルなし時に推奨）' },
  },
  args: {
    label: 'ラベル',
    size: 'sm',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    error: false,
    name: 'example',
    value: 'on',
    ariaLabel: '',
  },
  parameters: {
    docs: {
      description: {
        component: `
# デジタル庁デザインシステム Checkboxコンポーネント

DADS HTML版のチェックボックス（\`checkbox.css\`）と同一の見た目になるよう実装したWeb Components版です。

## DADS HTMLスニペット（参考）

\`\`\`html
<label class="dads-checkbox" data-size="sm">
  <span class="dads-checkbox__checkbox">
    <input class="dads-checkbox__input" type="checkbox">
  </span>
  <span class="dads-checkbox__label">ラベル</span>
</label>
\`\`\`

## Web Components版の使用方法

\`\`\`html
<dads-checkbox label="ラベル" size="sm"></dads-checkbox>
\`\`\`

## CSSパーツ
- base / checkbox / input / label
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Checked: Story = {
  name: 'Checked',
  args: { checked: true },
};

export const Indeterminate: Story = {
  name: 'Indeterminate',
  args: { indeterminate: true },
};

export const NoLabel: Story = {
  name: 'No Label (aria-label required)',
  args: {
    label: '',
    ariaLabel: 'ラベルなしチェックボックス',
  },
};

export const Errored: Story = {
  name: 'Errored',
  args: { error: true },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: { disabled: true },
};

export const WithSupportText: Story = {
  name: 'With Support Text (aria-describedby)',
  render: (args) => {
    const wrapper = document.createElement('div');
    const p = document.createElement('p');
    p.id = 'checkbox-support';
    p.textContent = '該当するすべての項目を選択してください。';
    p.style.margin = '0 0 12px';
    p.style.fontSize = '0.875rem';
    p.style.lineHeight = '1.5';
    p.style.color = '#4d4d4d';

    const checkbox = document.createElement('dads-checkbox');
    checkbox.setAttribute('label', args.label || '東京23区（例）');
    checkbox.setAttribute('size', args.size);
    checkbox.setAttribute('aria-describedby', 'checkbox-support');

    wrapper.appendChild(p);
    wrapper.appendChild(checkbox);
    return wrapper;
  },
};

export const ValidationRequired: Story = {
  name: 'Validation (required + auto-validate)',
  render: (args) => {
    const wrapper = document.createElement('div');

    const style = document.createElement('style');
    style.textContent = `
      .checkbox-validation {
        display: grid;
        gap: 12px;
        max-width: 520px;
      }

      .checkbox-validation dads-checkbox {
        display: block;
      }

      .checkbox-validation dads-checkbox[error]::after {
        display: block;
        margin-top: 4px;
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--color-semantic-error-1, #ec0000);
        content: '＊' attr(error-text);
      }
    `;

    const form = document.createElement('form');
    form.className = 'checkbox-validation';
    form.addEventListener('submit', (e) => e.preventDefault());

    const checkbox = document.createElement('dads-checkbox');
    checkbox.setAttribute('label', args.label || '利用規約に同意する');
    checkbox.setAttribute('size', args.size);
    checkbox.setAttribute('required', '');
    checkbox.setAttribute('auto-validate', '');
    checkbox.setAttribute('name', args.name || 'agreement');
    checkbox.setAttribute('value', args.value || 'yes');

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = '送信';

    form.appendChild(checkbox);
    form.appendChild(button);

    wrapper.appendChild(style);
    wrapper.appendChild(form);
    return wrapper;
  },
};
