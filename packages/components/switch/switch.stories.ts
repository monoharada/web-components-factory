import type { Meta, StoryObj } from '@storybook/web-components';
import { defineSwitch } from './switch-define';

// コンポーネントを登録
defineSwitch();

const meta: Meta = {
  title: 'Components/DADS Switch',
  tags: ['autodocs'],
  render: (args) => {
    const switchEl = document.createElement('dads-switch');

    // 属性を設定
    if (args.checked) switchEl.setAttribute('checked', '');
    if (args.disabled) switchEl.setAttribute('disabled', '');
    if (args.name) switchEl.setAttribute('name', args.name);
    if (args.value) switchEl.setAttribute('value', args.value);
    if (args.size) switchEl.setAttribute('size', args.size);

    // スロットコンテンツを設定
    if (args.labelLeft) {
      const leftLabel = document.createElement('span');
      leftLabel.slot = 'label-left';
      leftLabel.textContent = args.labelLeft;
      switchEl.appendChild(leftLabel);
    }

    if (args.labelRight) {
      const rightLabel = document.createElement('span');
      rightLabel.slot = 'label-right';
      rightLabel.textContent = args.labelRight;
      switchEl.appendChild(rightLabel);
    }

    return switchEl;
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'スイッチの状態',
      table: {
        defaultValue: { summary: false },
      },
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
      table: {
        defaultValue: { summary: false },
      },
    },
    name: {
      control: 'text',
      description: 'フォーム名',
    },
    value: {
      control: 'text',
      description: 'チェック時のフォーム値',
      table: {
        defaultValue: { summary: 'on' },
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
    labelLeft: {
      control: 'text',
      description: '左側ラベル',
    },
    labelRight: {
      control: 'text',
      description: '右側ラベル',
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * デフォルト状態のスイッチ
 */
export const Default: Story = {
  args: {
    labelLeft: 'OFF',
    labelRight: 'ON',
  },
};

/**
 * チェック済みスイッチ
 */
export const Checked: Story = {
  args: {
    checked: true,
    labelLeft: 'OFF',
    labelRight: 'ON',
  },
};

/**
 * @deprecated Default と同一のため非推奨
 * ラベル付きスイッチ（後方互換性のため残存）
 */
export const WithLabels: Story = {
  args: {
    labelLeft: 'OFF',
    labelRight: 'ON',
  },
};

/**
 * @deprecated Checked と同一のため非推奨
 * ラベル付きチェック済みスイッチ（後方互換性のため残存）
 */
export const WithLabelsChecked: Story = {
  args: {
    labelLeft: 'OFF',
    labelRight: 'ON',
    checked: true,
  },
};

/**
 * サイズバリエーション
 */
export const Sizes: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '16px';
    container.style.alignItems = 'flex-start';

    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '12px';

      const label = document.createElement('span');
      label.textContent = `size="${size}"`;
      label.style.width = '80px';
      label.style.fontFamily = 'monospace';

      const switchEl = document.createElement('dads-switch');
      switchEl.setAttribute('size', size);

      const leftSpan = document.createElement('span');
      leftSpan.slot = 'label-left';
      leftSpan.textContent = 'ラベル';
      switchEl.appendChild(leftSpan);

      const rightSpan = document.createElement('span');
      rightSpan.slot = 'label-right';
      rightSpan.textContent = 'ラベル';
      switchEl.appendChild(rightSpan);

      wrapper.appendChild(label);
      wrapper.appendChild(switchEl);
      container.appendChild(wrapper);
    }

    return container;
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    labelLeft: 'OFF',
    labelRight: 'ON',
  },
};

/**
 * 無効状態（チェック済み）
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    labelLeft: 'OFF',
    labelRight: 'ON',
  },
};

/**
 * フォーム内での使用例
 */
export const InForm: Story = {
  render: () => {
    const form = document.createElement('form');
    form.style.display = 'flex';
    form.style.flexDirection = 'column';
    form.style.gap = '16px';
    form.style.maxWidth = '400px';

    // Switch
    const switchWrapper = document.createElement('div');
    switchWrapper.style.display = 'flex';
    switchWrapper.style.alignItems = 'center';
    switchWrapper.style.justifyContent = 'space-between';

    const switchLabel = document.createElement('label');
    switchLabel.textContent = '通知を受け取る';
    switchLabel.setAttribute('for', 'notifications');

    const switchEl = document.createElement('dads-switch');
    switchEl.setAttribute('name', 'notifications');
    switchEl.setAttribute('value', 'enabled');
    switchEl.id = 'notifications';

    // ラベルを追加
    const leftSpan = document.createElement('span');
    leftSpan.slot = 'label-left';
    leftSpan.textContent = 'OFF';
    switchEl.appendChild(leftSpan);

    const rightSpan = document.createElement('span');
    rightSpan.slot = 'label-right';
    rightSpan.textContent = 'ON';
    switchEl.appendChild(rightSpan);

    switchWrapper.appendChild(switchLabel);
    switchWrapper.appendChild(switchEl);
    form.appendChild(switchWrapper);

    // Submit button
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = '送信';
    button.style.padding = '8px 16px';
    button.style.cursor = 'pointer';
    form.appendChild(button);

    // フォーム送信ハンドラー
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      alert(`フォームデータ: notifications = ${formData.get('notifications') ?? '(未チェック)'}`);
    });

    return form;
  },
};

/**
 * 日本語ラベル例
 */
export const JapaneseLabels: Story = {
  args: {
    labelLeft: 'オフ',
    labelRight: 'オン',
  },
};
