import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { defineButton } from './button-define';

// コンポーネントを登録
defineButton();

const meta: Meta = {
  title: 'Components/DADS Button',
  tags: ['autodocs'],
  render: (args) => {
    return html`
      <dads-button
        variant="${args.variant}"
        size="${args.size}"
        ?disabled="${args.disabled}"
        type="${args.type}"
        ?full-width="${args.fullWidth}"
        aria-label="${args.ariaLabel || ''}"
      >
        ${args.iconStart ? html`<span slot="icon-start">${args.iconStart}</span>` : ''}
        ${args.label}
        ${args.iconEnd ? html`<span slot="icon-end">${args.iconEnd}</span>` : ''}
      </dads-button>
    `;
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['solid', 'outlined', 'text'],
      description: 'ボタンのバリアント（重要度）',
      table: {
        defaultValue: { summary: 'solid' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['x-small', 'small', 'medium', 'large'],
      description: 'ボタンのサイズ',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '無効化状態（推奨されない）',
      table: {
        defaultValue: { summary: false },
      },
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'ボタンのtype属性',
      table: {
        defaultValue: { summary: 'button' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: '幅100%で表示',
      table: {
        defaultValue: { summary: false },
      },
    },
    label: {
      control: 'text',
      description: 'ボタンのラベル',
    },
    ariaLabel: {
      control: 'text',
      description: 'アクセシビリティ用ラベル',
    },
    iconStart: {
      control: 'text',
      description: '先頭アイコン（SVGやテキスト）',
    },
    iconEnd: {
      control: 'text',
      description: '末尾アイコン（SVGやテキスト）',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
# デジタル庁デザインシステム Buttonコンポーネント

デジタル庁デザインシステムv2.7.0準拠のボタンコンポーネントです。

## 特徴
- 🎨 3つのバリアント（Solid/Outlined/Text）
- 📏 4つのサイズ（X-Small/Small/Medium/Large）
- ♿ WCAG 2.2 AA準拠（最小44x44pxタップターゲット）
- 🎯 Shadow DOM + ::part()によるカスタマイズ
- 🚀 デザイントークンによる一貫性のあるスタイル

## 使用方法

\`\`\`html
<dads-button variant="solid" size="medium">
  送信する
</dads-button>
\`\`\`

## デザインガイドライン

### バリアント使い分け
- **Solid（塗り）**: 最も重要なアクション（1画面に1つまで）
- **Outlined（枠線）**: 副次的なアクション（1つのコンテキストに3つまで）
- **Text（テキスト）**: 最も重要度の低いアクション

### 配置
- プライマリアクション: 右寄せ
- キャンセル/戻る: 左寄せ

### アクセシビリティ
- 最小サイズ: 44x44 CSS pixels
- コントラスト比: テキスト4.5:1以上、背景3:1以上
- キーボード操作: Tab, Enter, Space対応
- フォーカス表示: 黄色リング + 黒枠

### 注意事項
- disabled属性の使用は推奨されません
- アイコンのみの場合は必ずaria-labelを設定
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
    variant: 'solid',
    size: 'medium',
    disabled: false,
    type: 'button',
    fullWidth: false,
    label: '送信する',
  },
};

// ========== バリアント ==========

export const Solid: Story = {
  name: 'Solid（塗り）',
  args: {
    ...Default.args,
    variant: 'solid',
    label: '重要なアクション',
  },
};

export const Outlined: Story = {
  name: 'Outlined（枠線）',
  args: {
    ...Default.args,
    variant: 'outlined',
    label: '副次的なアクション',
  },
};

export const Text: Story = {
  name: 'Text（テキスト）',
  args: {
    ...Default.args,
    variant: 'text',
    label: '詳細を見る',
  },
};

// ========== サイズ ==========

export const XSmall: Story = {
  name: 'X-Small（最小44px高）',
  args: {
    ...Default.args,
    size: 'x-small',
    label: '小',
  },
};

export const Small: Story = {
  name: 'Small（最小44px高）',
  args: {
    ...Default.args,
    size: 'small',
    label: '標準',
  },
};

export const Medium: Story = {
  name: 'Medium（48px高）',
  args: {
    ...Default.args,
    size: 'medium',
    label: '中サイズ',
  },
};

export const Large: Story = {
  name: 'Large（56px高）',
  args: {
    ...Default.args,
    size: 'large',
    label: '大きいボタン',
  },
};

// ========== 状態 ==========

export const Disabled: Story = {
  name: 'Disabled（非推奨）',
  args: {
    ...Default.args,
    disabled: true,
    label: '無効化されたボタン',
  },
  parameters: {
    docs: {
      description: {
        story: 'デジタル庁ガイドラインでは、disabled属性の使用は推奨されていません。代わりに、なぜボタンが押せないかを明示することが推奨されています。',
      },
    },
  },
};

// ========== レイアウト ==========

export const FullWidth: Story = {
  name: 'Full Width',
  args: {
    ...Default.args,
    fullWidth: true,
    label: '幅100%のボタン',
  },
};

// ========== アイコン付き ==========

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    ...Default.args,
    label: 'ダウンロード',
    iconStart: '⬇',
  },
};

export const IconOnly: Story = {
  name: 'Icon Only（要aria-label）',
  args: {
    ...Default.args,
    label: '',
    iconStart: '✕',
    ariaLabel: '閉じる',
  },
  parameters: {
    docs: {
      description: {
        story: 'アイコンのみのボタンには必ずaria-labelを設定してください。',
      },
    },
  },
};

// ========== 組み合わせ例 ==========

export const ButtonGroup: Story = {
  name: 'Button Group',
  render: () => html`
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <dads-button variant="solid">送信</dads-button>
      <dads-button variant="outlined">下書き保存</dads-button>
      <dads-button variant="text">キャンセル</dads-button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'ボタングループの例。重要度に応じてバリアントを使い分けます。',
      },
    },
  },
};

export const ResponsiveButtonGroup: Story = {
  name: 'Responsive Button Group',
  render: () => html`
    <style>
      .button-group {
        display: flex;
        gap: 8px;
        flex-direction: column;
      }
      @media (min-width: 768px) {
        .button-group {
          flex-direction: row-reverse;
          justify-content: flex-start;
        }
      }
    </style>
    <div class="button-group">
      <dads-button variant="solid">次へ進む</dads-button>
      <dads-button variant="text">戻る</dads-button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'レスポンシブなボタングループ。モバイルでは縦並び、デスクトップでは横並び（プライマリが右）。',
      },
    },
  },
};

// ========== デジタル庁準拠の使用例 ==========

export const FormSubmitExample: Story = {
  name: 'Form Submit（フォーム送信）',
  render: () => html`
    <form style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <div style="margin-bottom: 16px;">
        <label for="email" style="display: block; margin-bottom: 4px;">メールアドレス</label>
        <input id="email" type="email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <dads-button variant="text" type="button">キャンセル</dads-button>
        <dads-button variant="solid" type="submit">送信</dads-button>
      </div>
    </form>
  `,
  parameters: {
    docs: {
      description: {
        story: 'フォーム送信ボタンの配置例。プライマリアクション（送信）は右側に配置。',
      },
    },
  },
};