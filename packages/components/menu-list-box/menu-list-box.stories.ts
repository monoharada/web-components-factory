import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { defineMenuListBox } from './menu-list-box-define';
import { createIconWithSlot } from '../../utils/icons.js';

defineMenuListBox();

// Pre-computed icons using unsafeHTML for lit templates
function icon(name: Parameters<typeof createIconWithSlot>[0], slot: string, size: number): ReturnType<typeof unsafeHTML> {
  return unsafeHTML(createIconWithSlot(name, slot, size));
}

const openerIcon = icon('dummy', 'icon', 24);
const startIcon = (name: Parameters<typeof createIconWithSlot>[0]) => icon(name, 'start-icon', 20);

type Args = {
  size: 'sm' | 'md';
  variant: 'text' | 'outlined' | 'filled';
  bold: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/DADS Menu List Box',
  tags: ['autodocs'],
  render: (args) => html`
    <dads-menu-list-box
      size="${args.size}"
      variant="${args.variant}"
      ?bold="${args.bold}"
      label="メニュー"
    >
      ${openerIcon}
      <dads-menu-list-item>メニュー項目1</dads-menu-list-item>
      <dads-menu-list-item>メニュー項目2</dads-menu-list-item>
      <dads-menu-list-item>メニュー項目3</dads-menu-list-item>
      <dads-menu-list-item>メニュー項目4</dads-menu-list-item>
      <dads-menu-list-item>メニュー項目5</dads-menu-list-item>
      <dads-menu-list-item>メニュー項目6</dads-menu-list-item>
      <dads-menu-list-item>メニュー項目7</dads-menu-list-item>
    </dads-menu-list-box>

    <div style="margin-top: 1rem;">
      <button type="button">テスト用ボタン（外側クリック確認）</button>
    </div>
  `,
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md'],
    },
    variant: {
      control: { type: 'radio' },
      options: ['text', 'outlined', 'filled'],
    },
    bold: {
      control: 'boolean',
    },
  },
  args: {
    size: 'sm',
    variant: 'text',
    bold: false,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

const items = (count: number): Array<ReturnType<typeof html>> =>
  Array.from({ length: count }, (_, i) => html`<dads-menu-list-item>リストアイテム${i + 1}</dads-menu-list-item>`);

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
      <dads-menu-list-box size="sm" variant="text" label="text">${openerIcon}${items(3)}</dads-menu-list-box>
      <dads-menu-list-box size="sm" variant="outlined" label="outlined">${openerIcon}${items(3)}</dads-menu-list-box>
      <dads-menu-list-box size="sm" variant="filled" label="filled">${openerIcon}${items(3)}</dads-menu-list-box>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
      <dads-menu-list-box size="sm" variant="outlined" label="sm">${openerIcon}${items(5)}</dads-menu-list-box>
      <dads-menu-list-box size="md" variant="outlined" label="md">${openerIcon}${items(5)}</dads-menu-list-box>
    </div>
  `,
};

export const Bold: Story = {
  render: () => html`
    <dads-menu-list-box size="md" variant="filled" bold label="bold">${openerIcon}${items(5)}</dads-menu-list-box>
  `,
};

export const WithoutIcon: Story = {
  render: () => html`
    <dads-menu-list-box size="sm" variant="outlined" label="iconなし">${items(5)}</dads-menu-list-box>
  `,
};

export const OpenWithCurrent: Story = {
  render: () => html`
    <dads-menu-list-box size="sm" variant="outlined" label="選択中" open>
      ${openerIcon}
      <dads-menu-list-item current data-value="a">リストアイテムA</dads-menu-list-item>
      <dads-menu-list-item data-value="b">リストアイテムB</dads-menu-list-item>
      <dads-menu-list-item data-value="c">リストアイテムC</dads-menu-list-item>
    </dads-menu-list-box>
  `,
};

export const Scrollable: Story = {
  render: () => html`
    <dads-menu-list-box size="sm" variant="outlined" label="スクロール" open>${openerIcon}${items(20)}</dads-menu-list-box>
  `,
};

export const ItemStartIcons: Story = {
  render: () => html`
    <dads-menu-list-box size="sm" variant="outlined" label="選択リストタイトル" open>
      <dads-menu-list-item current data-value="edit">${startIcon('edit')}リストアイテム</dads-menu-list-item>
      <dads-menu-list-item data-value="download">${startIcon('download')}リストアイテム</dads-menu-list-item>
      <dads-menu-list-item data-value="duplicate">${startIcon('duplicate')}リストアイテム</dads-menu-list-item>
      <dads-menu-list-item data-value="delete">${startIcon('delete')}リストアイテム</dads-menu-list-item>
    </dads-menu-list-box>
  `,
};

export const ItemStartIconsWithDescription: Story = {
  render: () => html`
    <dads-menu-list-box size="sm" variant="outlined" label="選択リストタイトル" open>
      ${Array.from({ length: 8 }, (_, i) => html`
        <dads-menu-list-item ?current="${i === 0}" data-value="${i + 1}">
          ${startIcon('dummy')}
          <span style="display: flex; flex-direction: column; gap: 2px;">
            <span style="font-weight: 600;">リストアイテム</span>
            <span style="font-size: 0.875rem; color: #666;">ディスクリプション</span>
          </span>
        </dads-menu-list-item>
      `)}
    </dads-menu-list-box>
  `,
};

export const CategoryWithDividers: Story = {
  render: () => html`
    <dads-menu-list-box size="sm" variant="outlined" label="選択リストタイトル" open>
      <dads-menu-list-item data-value="category-1" style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);">
        ${startIcon('dummy')}カテゴリータイトル
      </dads-menu-list-item>
      <dads-menu-list-item data-value="item-1">リストアイテム</dads-menu-list-item>
      <dads-menu-list-item data-value="item-2">リストアイテム</dads-menu-list-item>

      <hr />

      <dads-menu-list-item data-value="category-2" style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);">
        ${startIcon('dummy')}カテゴリータイトル
      </dads-menu-list-item>
      <dads-menu-list-item data-value="item-3">リストアイテム</dads-menu-list-item>
      <dads-menu-list-item current data-value="checked">${startIcon('checkmark')}リストアイテム</dads-menu-list-item>

      <hr />

      <dads-menu-list-item data-value="category-3" style="--dads-menu-list-item-font-weight: var(--font-weight-700, 700);">
        ${startIcon('dummy')}カテゴリータイトル
      </dads-menu-list-item>
      <dads-menu-list-item data-value="item-4">リストアイテム</dads-menu-list-item>
      <dads-menu-list-item data-value="item-5">リストアイテム</dads-menu-list-item>
    </dads-menu-list-box>
  `,
};
