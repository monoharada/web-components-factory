import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { defineAccordion } from './accordion-define';

// コンポーネントを登録
defineAccordion();

const meta: Meta = {
  title: 'Components/DADS Accordion',
  tags: ['autodocs'],
  render: (args) => {
    return html`
      <dads-accordion-details 
        ?allow-multiple="${args.allowMultiple}"
        animation="${args.animation || 'none'}"
      >
        <dads-accordion-item-details ?expanded="${args.item1Expanded}">
          <span slot="header">デジタル庁について</span>
          <div slot="content">
            <p>デジタル庁は、デジタル社会形成の司令塔として、未来志向のDXを大胆に推進し、デジタル時代の官民のインフラを今後5年で一気呵成に作り上げることを目指します。</p>
          </div>
        </dads-accordion-item-details>
        
        <dads-accordion-item-details ?expanded="${args.item2Expanded}">
          <span slot="header">デザインシステムについて</span>
          <div slot="content">
            <p>デジタル庁デザインシステムは、政府のウェブサイトやデジタルサービスにおいて、一貫性のあるユーザー体験を提供するためのデザインの原則やUIコンポーネントをまとめたものです。</p>
          </div>
        </dads-accordion-item-details>
        
        <dads-accordion-item-details ?expanded="${args.item3Expanded}">
          <span slot="header">アクセシビリティについて</span>
          <div slot="content">
            <p>すべての人が、年齢、身体的制約、利用環境等に関係なく、ウェブで提供されている情報やサービスを利用できることを目指しています。WCAG 2.2 AAレベルに準拠することを基本方針としています。</p>
          </div>
        </dads-accordion-item-details>
      </dads-accordion-details>
    `;
  },
  argTypes: {
    allowMultiple: {
      control: 'boolean',
      description: '複数のアイテムを同時に展開可能にする',
      table: {
        defaultValue: { summary: false },
      },
    },
    animation: {
      control: { type: 'select' },
      options: ['none', 'slide', 'fade'],
      description: 'アニメーションタイプ',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    item1Expanded: {
      control: 'boolean',
      description: '1つ目のアイテムの初期展開状態',
      table: {
        defaultValue: { summary: false },
      },
    },
    item2Expanded: {
      control: 'boolean',
      description: '2つ目のアイテムの初期展開状態',
      table: {
        defaultValue: { summary: false },
      },
    },
    item3Expanded: {
      control: 'boolean',
      description: '3つ目のアイテムの初期展開状態',
      table: {
        defaultValue: { summary: false },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
# デジタル庁デザインシステム アコーディオンコンポーネント

## 概要
details/summary要素をベースにした、アクセシブルなアコーディオンコンポーネントです。

## 特徴
- 🎯 ネイティブHTML要素（details/summary）ベース
- ♿ キーボード操作完全対応
- 📱 モバイルフレンドリー
- 🎨 Shadow DOM + ::part()によるカスタマイズ
- 🚀 JavaScriptなしでも基本動作

## 使用方法

\`\`\`html
<dads-accordion-details>
  <dads-accordion-item-details>
    <span slot="header">見出し</span>
    <div slot="content">コンテンツ</div>
  </dads-accordion-item-details>
</dads-accordion-details>
\`\`\`

## モード

### 単一展開モード（デフォルト）
一度に1つのアイテムのみ展開可能

### 複数展開モード
\`allow-multiple\`属性を追加すると、複数のアイテムを同時に展開可能

## アクセシビリティ
- Enter/Spaceキーで開閉
- 戻るボタンでヘッダーまでスクロール
- スクリーンリーダー対応
- WCAG 2.2 AA準拠
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    allowMultiple: false,
    animation: 'none',
    item1Expanded: false,
    item2Expanded: false,
    item3Expanded: false,
  },
};

export const SingleExpanded: Story = {
  name: '単一展開モード',
  args: {
    ...Default.args,
    item1Expanded: true,
  },
};

export const MultipleExpanded: Story = {
  name: '複数展開モード',
  args: {
    ...Default.args,
    allowMultiple: true,
    item1Expanded: true,
    item2Expanded: true,
  },
};

export const AllExpanded: Story = {
  name: '全て展開',
  args: {
    allowMultiple: true,
    item1Expanded: true,
    item2Expanded: true,
    item3Expanded: true,
  },
};

export const LongContent: Story = {
  name: '長いコンテンツ',
  render: () => html`
    <dads-accordion-details>
      <dads-accordion-item-details expanded>
        <span slot="header">長いコンテンツの例</span>
        <div slot="content">
          <h3>セクション1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <h3>セクション2</h3>
          <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <h3>セクション3</h3>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <h3>セクション4</h3>
          <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>※ 戻るボタンでヘッダーまでスクロールできます。</p>
        </div>
      </dads-accordion-item-details>
    </dads-accordion-details>
  `,
};

export const FAQ: Story = {
  name: 'FAQスタイル',
  render: () => html`
    <dads-accordion-details allow-multiple>
      <dads-accordion-item-details>
        <span slot="header">Q. デジタル庁デザインシステムとは何ですか？</span>
        <div slot="content">
          <p>A. 政府のウェブサイトやデジタルサービスにおいて、一貫性のあるユーザー体験を提供するためのデザインの原則やUIコンポーネントをまとめたものです。</p>
        </div>
      </dads-accordion-item-details>
      
      <dads-accordion-item-details>
        <span slot="header">Q. どのようなコンポーネントが含まれていますか？</span>
        <div slot="content">
          <p>A. ボタン、フォーム、ナビゲーション、アコーディオンなど、ウェブサイト構築に必要な基本的なUIコンポーネントが含まれています。</p>
        </div>
      </dads-accordion-item-details>
      
      <dads-accordion-item-details>
        <span slot="header">Q. 商用利用は可能ですか？</span>
        <div slot="content">
          <p>A. はい、MITライセンスで提供されており、商用・非商用を問わず自由に利用できます。</p>
        </div>
      </dads-accordion-item-details>
    </dads-accordion-details>
  `,
};