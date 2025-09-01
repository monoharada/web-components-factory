import type { Meta, StoryObj } from '@storybook/web-components';
import { defineButton } from './button-define';

// コンポーネントを登録
defineButton();

const meta: Meta = {
  title: 'Components/DADS Button',
  tags: ['autodocs'],
  render: (args) => {
    // Litを使わずに純粋なHTMLを生成
    const button = document.createElement('dads-button');
    
    // 属性を設定
    if (args.variant) button.setAttribute('variant', args.variant);
    if (args.size) button.setAttribute('size', args.size);
    if (args.disabled) button.setAttribute('disabled', '');
    if (args.type) button.setAttribute('type', args.type);
    if (args.fullWidth) button.setAttribute('full-width', '');
    if (args.ariaLabel) button.setAttribute('aria-label', args.ariaLabel);
    if (args.as) button.setAttribute('as', args.as);
    if (args.href) button.setAttribute('href', args.href);
    if (args.target) button.setAttribute('target', args.target);
    if (args.rel) button.setAttribute('rel', args.rel);
    if (args.download) button.setAttribute('download', '');
    
    // スロットコンテンツを設定
    if (args.iconStart) {
      const iconStart = document.createElement('span');
      iconStart.slot = 'icon-start';
      iconStart.textContent = args.iconStart;
      button.appendChild(iconStart);
    }
    
    // ラベルテキスト
    const labelText = document.createTextNode(args.label || 'ボタン');
    button.appendChild(labelText);
    
    if (args.iconEnd) {
      const iconEnd = document.createElement('span');
      iconEnd.slot = 'icon-end';
      iconEnd.textContent = args.iconEnd;
      button.appendChild(iconEnd);
    }
    
    return button;
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
    as: {
      control: { type: 'select' },
      options: ['button', 'link', 'a', undefined],
      description: '要素タイプの明示的指定',
      table: {
        defaultValue: { summary: 'auto' },
      },
    },
    href: {
      control: 'text',
      description: 'リンク先URL（設定するとa要素になる）',
    },
    target: {
      control: { type: 'select' },
      options: ['_self', '_blank', '_parent', '_top'],
      description: 'リンクターゲット',
      table: {
        defaultValue: { summary: '_self' },
      },
    },
    rel: {
      control: 'text',
      description: 'リンクの関係性（noopener noreferrer等）',
    },
    download: {
      control: 'boolean',
      description: 'ダウンロードリンクとして扱う',
      table: {
        defaultValue: { summary: false },
      },
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
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 8px; flex-wrap: wrap;';
    
    const solidBtn = document.createElement('dads-button');
    solidBtn.setAttribute('variant', 'solid');
    solidBtn.textContent = '送信';
    
    const outlinedBtn = document.createElement('dads-button');
    outlinedBtn.setAttribute('variant', 'outlined');
    outlinedBtn.textContent = '下書き保存';
    
    const textBtn = document.createElement('dads-button');
    textBtn.setAttribute('variant', 'text');
    textBtn.textContent = 'キャンセル';
    
    container.appendChild(solidBtn);
    container.appendChild(outlinedBtn);
    container.appendChild(textBtn);
    
    return container;
  },
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
  render: () => {
    const wrapper = document.createElement('div');
    
    // スタイルを追加
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    
    const container = document.createElement('div');
    container.className = 'button-group';
    
    const solidBtn = document.createElement('dads-button');
    solidBtn.setAttribute('variant', 'solid');
    solidBtn.textContent = '次へ進む';
    
    const textBtn = document.createElement('dads-button');
    textBtn.setAttribute('variant', 'text');
    textBtn.textContent = '戻る';
    
    container.appendChild(solidBtn);
    container.appendChild(textBtn);
    
    wrapper.appendChild(style);
    wrapper.appendChild(container);
    
    return wrapper;
  },
  parameters: {
    docs: {
      description: {
        story: 'レスポンシブなボタングループ。モバイルでは縦並び、デスクトップでは横並び（プライマリが右）。',
      },
    },
  },
};

// ========== リンクボタン ==========

export const LinkButton: Story = {
  name: 'Link Button（リンクボタン）',
  args: {
    ...Default.args,
    href: 'https://www.digital.go.jp/',
    label: 'デジタル庁へ',
  },
  parameters: {
    docs: {
      description: {
        story: 'href属性を設定すると自動的にa要素として描画されます。',
      },
    },
  },
};

export const LinkButtonNewTab: Story = {
  name: 'Link Button（新規タブ）',
  args: {
    ...Default.args,
    href: 'https://www.digital.go.jp/',
    target: '_blank',
    rel: 'noopener noreferrer',
    label: '新規タブで開く',
  },
};

export const LinkButtonWithoutHref: Story = {
  name: 'Link Button（hrefなし）',
  args: {
    ...Default.args,
    as: 'link',
    label: 'JavaScriptで処理',
  },
  parameters: {
    docs: {
      description: {
        story: 'as="link"を指定するとhrefなしでもa要素として描画されます。JavaScript処理に便利です。',
      },
    },
  },
};

export const LinkButtonDisabled: Story = {
  name: 'Link Button（無効）',
  args: {
    ...Default.args,
    href: '#',
    disabled: true,
    label: '無効なリンク',
  },
  parameters: {
    docs: {
      description: {
        story: 'a要素でdisabled時はaria-disabled="true"とtabindex="-1"が設定されます。',
      },
    },
  },
};

export const DownloadButton: Story = {
  name: 'Download Button',
  args: {
    ...Default.args,
    href: '/path/to/file.pdf',
    download: true,
    label: 'PDFをダウンロード',
    iconStart: '⬇',
  },
};

// ========== デジタル庁準拠の使用例 ==========

export const FormSubmitExample: Story = {
  name: 'Form Submit（フォーム送信）',
  render: () => {
    const form = document.createElement('form');
    form.style.cssText = 'padding: 20px; border: 1px solid #ddd; border-radius: 8px;';
    
    // メールアドレス入力部分
    const fieldDiv = document.createElement('div');
    fieldDiv.style.marginBottom = '16px';
    
    const label = document.createElement('label');
    label.setAttribute('for', 'email');
    label.style.cssText = 'display: block; margin-bottom: 4px;';
    label.textContent = 'メールアドレス';
    
    const input = document.createElement('input');
    input.id = 'email';
    input.type = 'email';
    input.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;';
    
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    
    // ボタン部分
    const buttonDiv = document.createElement('div');
    buttonDiv.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;';
    
    const cancelBtn = document.createElement('dads-button');
    cancelBtn.setAttribute('variant', 'text');
    cancelBtn.setAttribute('type', 'button');
    cancelBtn.textContent = 'キャンセル';
    
    const submitBtn = document.createElement('dads-button');
    submitBtn.setAttribute('variant', 'solid');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.textContent = '送信';
    
    buttonDiv.appendChild(cancelBtn);
    buttonDiv.appendChild(submitBtn);
    
    form.appendChild(fieldDiv);
    form.appendChild(buttonDiv);
    
    return form;
  },
  parameters: {
    docs: {
      description: {
        story: 'フォーム送信ボタンの配置例。プライマリアクション（送信）は右側に配置。',
      },
    },
  },
};