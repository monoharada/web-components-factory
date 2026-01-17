import type { Meta, StoryObj } from '@storybook/web-components';
import { defineDefaultRadio } from './radio-define';

defineDefaultRadio();

type Args = {
  label: string;
  size: 'sm' | 'md' | 'lg';
  checked: boolean;
  disabled: boolean;
  required: boolean;
  error: boolean;
  name: string;
  value: string;
  ariaLabel: string;
};

const meta: Meta<Args> = {
  title: 'Components/DADS Radio',
  tags: ['autodocs'],
  render: (args) => {
    const radio = document.createElement('dads-radio');

    if (args.label) radio.setAttribute('label', args.label);
    radio.setAttribute('size', args.size);

    if (args.checked) radio.setAttribute('checked', '');
    if (args.disabled) radio.setAttribute('disabled', '');
    if (args.required) radio.setAttribute('required', '');
    if (args.error) radio.setAttribute('error', '');

    if (args.name) radio.setAttribute('name', args.name);
    if (args.value) radio.setAttribute('value', args.value);
    if (args.ariaLabel) radio.setAttribute('aria-label', args.ariaLabel);

    return radio;
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
    disabled: { control: 'boolean', description: '無効状態' },
    required: { control: 'boolean', description: '必須（auto-validate時にsubmitで検証）' },
    error: { control: 'boolean', description: 'エラー状態（aria-invalid="true"）' },
    name: { control: 'text', description: 'フォーム名（同一nameで排他グループ）' },
    value: { control: 'text', description: '送信値（未指定時は "on"）' },
    ariaLabel: { control: 'text', description: 'aria-label（ラベルなし時に推奨）' },
  },
  args: {
    label: 'ラベル',
    size: 'sm',
    checked: false,
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
# デジタル庁デザインシステム Radioコンポーネント

DADS HTML版のラジオボタン（\`radio.css\`）と同一の見た目になるよう実装したWeb Components版です。

Shadow DOMの制約により、同一nameグルーピング（排他）はコンポーネント側で補完します。

## DADS HTMLスニペット（参考）

\`\`\`html
<label class="dads-radio" data-size="sm">
  <span class="dads-radio__radio">
    <input class="dads-radio__input" type="radio" name="example" />
  </span>
  <span class="dads-radio__label">ラベル</span>
</label>
\`\`\`

## Web Components版の使用方法

\`\`\`html
<dads-radio label="ラベル" size="sm" name="example"></dads-radio>
\`\`\`

## CSSパーツ
- base / radio / input / label / requirement / error-text
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

export const NoLabel: Story = {
  name: 'No Label (aria-label required)',
  args: {
    label: '',
    ariaLabel: 'ラベルなしラジオ',
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

export const Group: Story = {
  name: 'Group (same name)',
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '8px';

    const radio1 = document.createElement('dads-radio');
    radio1.setAttribute('label', '足立区');
    radio1.setAttribute('size', args.size);
    radio1.setAttribute('name', 'tokyo-23');
    radio1.setAttribute('value', 'adachi');

    const radio2 = document.createElement('dads-radio');
    radio2.setAttribute('label', '荒川区');
    radio2.setAttribute('size', args.size);
    radio2.setAttribute('name', 'tokyo-23');
    radio2.setAttribute('value', 'arakawa');

    const radio3 = document.createElement('dads-radio');
    radio3.setAttribute('label', '板橋区');
    radio3.setAttribute('size', args.size);
    radio3.setAttribute('name', 'tokyo-23');
    radio3.setAttribute('value', 'itabashi');

    wrapper.appendChild(radio1);
    wrapper.appendChild(radio2);
    wrapper.appendChild(radio3);
    return wrapper;
  },
};

export const ValidationRequired: Story = {
  name: 'Validation (required + auto-validate)',
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '12px';
    wrapper.style.maxWidth = '520px';

    const form = document.createElement('form');
    form.addEventListener('submit', (e) => e.preventDefault());
    form.style.display = 'grid';
    form.style.gap = '8px';

    const radio1 = document.createElement('dads-radio');
    radio1.setAttribute('label', '足立区');
    radio1.setAttribute('size', args.size);
    radio1.setAttribute('name', 'required-group');
    radio1.setAttribute('value', 'adachi');
    radio1.setAttribute('required', '');
    radio1.setAttribute('auto-validate', '');

    const radio2 = document.createElement('dads-radio');
    radio2.setAttribute('label', '荒川区');
    radio2.setAttribute('size', args.size);
    radio2.setAttribute('name', 'required-group');
    radio2.setAttribute('value', 'arakawa');
    radio2.setAttribute('required', '');

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = '送信';

    form.appendChild(radio1);
    form.appendChild(radio2);
    form.appendChild(button);

    wrapper.appendChild(form);
    return wrapper;
  },
};

