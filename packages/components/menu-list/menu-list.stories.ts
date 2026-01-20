import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { defineMenuList } from './menu-list-define';

defineMenuList();

type Args = {
  variant: 'standard' | 'box';
  size: 'regular' | 'small';
  indentation: number;
};

const meta: Meta<Args> = {
  title: 'Components/DADS Menu List',
  tags: ['autodocs'],
  render: (args) => html`
    <dads-menu-list indentation="${String(args.indentation)}">
      <dads-menu-list-item variant="${args.variant}" size="${args.size}">
        <svg
          slot="start-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentcolor"
          aria-hidden="true"
        >
          <path
            d="M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z"
          />
        </svg>
        メニュー項目1
      </dads-menu-list-item>

      <dads-menu-list-item
        variant="${args.variant}"
        size="${args.size}"
        expanded
      >
        メニュー項目2（expanded）
        <dads-menu-list indentation="1">
          <dads-menu-list-item variant="${args.variant}" size="${args.size}">
            メニュー項目2-1
          </dads-menu-list-item>
          <dads-menu-list-item variant="${args.variant}" size="${args.size}" current>
            メニュー項目2-2（current）
          </dads-menu-list-item>
          <dads-menu-list-item variant="${args.variant}" size="${args.size}">
            メニュー項目2-3
          </dads-menu-list-item>
        </dads-menu-list>
      </dads-menu-list-item>

      <dads-menu-list-item variant="${args.variant}" size="${args.size}" current>
        メニュー項目3（current）
      </dads-menu-list-item>

      <dads-menu-list-item variant="${args.variant}" size="${args.size}" tail-icon="new-window">
        メニュー項目4（tail icon）
      </dads-menu-list-item>

      <dads-menu-list-item
        variant="${args.variant}"
        size="${args.size}"
        href="https://design.digital.go.jp/"
        target="_blank"
        rel="noopener noreferrer"
        tail-icon="new-window"
      >
        リンク（別タブ）
      </dads-menu-list-item>
    </dads-menu-list>
  `,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['standard', 'box'],
    },
    size: {
      control: { type: 'radio' },
      options: ['regular', 'small'],
    },
    indentation: {
      control: { type: 'number', min: 0, max: 8, step: 1 },
    },
  },
  args: {
    variant: 'standard',
    size: 'regular',
    indentation: 0,
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Standard: Story = {
  args: {
    variant: 'standard',
    size: 'regular',
    indentation: 0,
  },
};

export const Boxed: Story = {
  args: {
    variant: 'box',
    size: 'regular',
    indentation: 0,
  },
};
