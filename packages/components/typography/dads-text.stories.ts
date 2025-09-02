/**
 * Storybook stories for dads-text component
 */
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './dads-text';

const meta: Meta = {
  title: 'Typography/DadsText',
  component: 'dads-text',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'デジタル庁タイポグラフィシステムの基本テキストコンポーネント'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['standard', 'display', 'dense'],
      description: 'テキストのバリアント',
      defaultValue: 'standard',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'standard' }
      }
    },
    size: {
      control: { type: 'select' },
      options: [null, '16', '20', '32'],
      description: 'フォントサイズ',
      table: {
        type: { summary: 'string' }
      }
    },
    weight: {
      control: { type: 'select' },
      options: [null, 'normal', 'bold'],
      description: 'フォントウェイト',
      table: {
        type: { summary: 'string' }
      }
    },
    display: {
      control: { type: 'select' },
      options: ['inline', 'block'],
      description: '表示タイプ',
      defaultValue: 'inline',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'inline' }
      }
    },
    text: {
      control: 'text',
      description: 'テキスト内容',
      defaultValue: 'デジタル庁のテキストコンポーネント'
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <dads-text
      variant="${args.variant || 'standard'}"
      size="${args.size || ''}"
      weight="${args.weight || ''}"
      display="${args.display || 'inline'}"
    >
      ${args.text || 'デジタル庁のテキストコンポーネント'}
    </dads-text>
  `,
  args: {
    variant: 'standard',
    text: 'デジタル庁のテキストコンポーネント'
  }
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3 style="margin-bottom: 8px;">Standard（標準）</h3>
        <dads-text variant="standard">
          デジタル庁は、デジタル社会形成の司令塔として、未来志向のDXを推進します。
        </dads-text>
      </div>
      
      <div>
        <h3 style="margin-bottom: 8px;">Display（表示）</h3>
        <dads-text variant="display">
          デジタル社会の実現
        </dads-text>
      </div>
      
      <div>
        <h3 style="margin-bottom: 8px;">Dense（密集）</h3>
        <dads-text variant="dense">
          コンパクトなUIテキスト表示に適したスタイル
        </dads-text>
      </div>
    </div>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <dads-text size="16">16px: 標準本文サイズ</dads-text>
      </div>
      <div>
        <dads-text size="20">20px: 中見出しサイズ</dads-text>
      </div>
      <div>
        <dads-text size="32">32px: 大見出しサイズ</dads-text>
      </div>
    </div>
  `
};

export const Weights: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <dads-text weight="normal">Normal (400): 通常のテキスト</dads-text>
      </div>
      <div>
        <dads-text weight="bold">Bold (700): 太字のテキスト</dads-text>
      </div>
    </div>
  `
};

export const CustomStyles: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <style>
        .custom-primary {
          --dads-text-color: #0017c1;
        }
        
        .custom-large {
          --dads-text-font-size: 2.5rem;
          --dads-text-line-height: 1.2;
        }
        
        .custom-spacing {
          --dads-text-letter-spacing: 0.05em;
        }
      </style>
      
      <div>
        <dads-text class="custom-primary">
          カスタムカラー（デジタル庁ブルー）
        </dads-text>
      </div>
      
      <div>
        <dads-text class="custom-large">
          カスタムサイズ（2.5rem）
        </dads-text>
      </div>
      
      <div>
        <dads-text class="custom-spacing">
          カスタム文字間隔（0.05em）
        </dads-text>
      </div>
    </div>
  `
};

export const RealWorldExample: Story = {
  render: () => html`
    <article style="max-width: 600px; margin: 0 auto; padding: 24px;">
      <dads-text variant="display" display="block" style="margin-bottom: 16px;">
        デジタル庁のミッション
      </dads-text>
      
      <dads-text variant="standard" display="block" style="margin-bottom: 12px;">
        デジタル庁は、デジタル社会形成の司令塔として、未来志向のDXを推進し、
        デジタル時代の官民のインフラを今後5年間で一気呵成に作り上げることを目指します。
      </dads-text>
      
      <dads-text variant="standard" display="block" style="margin-bottom: 12px;">
        徹底的な国民目線でのサービス創出やデータ資源の利活用、
        社会全体のDXの推進を通じ、全ての国民にデジタル化の恩恵が行き渡る社会を実現します。
      </dads-text>
      
      <dads-text variant="dense" size="16" style="color: #666;">
        最終更新: 2025年9月2日
      </dads-text>
    </article>
  `
};

export const AccessibilityExample: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3>WCAG 2.2 AA準拠の行高（1.5以上）</h3>
        <dads-text variant="standard" display="block" style="max-width: 400px;">
          このテキストは、WCAG 2.2 AAガイドラインに準拠した1.75の行高で表示されています。
          長文でも読みやすく、視覚的な負担を軽減します。
        </dads-text>
      </div>
      
      <div style="background: #000; color: #fff; padding: 16px;">
        <h3 style="color: #fff;">ダークモードでの表示</h3>
        <dads-text style="--dads-text-color: #fff;">
          CSS変数により、簡単にダークモード対応が可能です。
        </dads-text>
      </div>
      
      <div>
        <h3>200%拡大時の表示テスト</h3>
        <div style="zoom: 2;">
          <dads-text>
            このテキストは200%拡大されています
          </dads-text>
        </div>
      </div>
    </div>
  `
};