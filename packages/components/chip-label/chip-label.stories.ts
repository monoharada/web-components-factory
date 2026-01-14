import type { Meta, StoryObj } from '@storybook/web-components';
import { defineChipLabel } from './chip-label-define';

defineChipLabel();

type Variant = 'text' | 'outline' | 'filled-outline' | 'fill';
type Color =
  | 'gray'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'magenta'
  | 'purple';

type Args = {
  label: string;
  variant: Variant;
  color: Color;
  showIcon: boolean;
  customColors: boolean;
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function createIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('slot', 'icon');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'currentcolor');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute(
    'd',
    'M4.6 20.5c-.5-.1-1-.6-1.1-1l16-16c.5.1.9.6 1 1l-16 16Zm-1.1-6.4v-2L12 3.4h2.1L3.5 14.1Zm0-7.4V5.3c0-1 .8-1.8 1.8-1.8h1.4L3.5 6.7Zm13.8 13.8 3.2-3.2v1.4c0 1-.8 1.8-1.8 1.8h-1.4Zm-7.4 0L20.5 9.9v2L12 20.6H9.9Z'
  );
  svg.appendChild(path);
  return svg;
}

const meta: Meta<Args> = {
  title: 'Components/DADS チップラベル',
  tags: ['autodocs'],
  render: (args) => {
    const chip = document.createElement('dads-chip-label');

    chip.setAttribute('variant', args.variant);
    chip.setAttribute('color', args.color);

    if (args.customColors) {
      chip.style.setProperty('--_non-text', '#854f91');
      chip.style.setProperty('--_bg', '#f4dff9');
      chip.style.setProperty('--_text-dark', '#72447d');
    }

    if (args.showIcon) {
      chip.appendChild(createIcon());
    }

    chip.appendChild(document.createTextNode(args.label));
    return chip;
  },
  argTypes: {
    label: { control: 'text', description: 'ラベルテキスト' },
    variant: {
      control: { type: 'select' },
      options: ['text', 'outline', 'filled-outline', 'fill'],
      description: 'バリアント',
      table: { defaultValue: { summary: 'text' } },
    },
    color: {
      control: { type: 'select' },
      options: [
        'gray',
        'blue',
        'light-blue',
        'cyan',
        'green',
        'lime',
        'yellow',
        'orange',
        'red',
        'magenta',
        'purple',
      ],
      description: 'カラープリセット',
      table: { defaultValue: { summary: 'gray' } },
    },
    showIcon: { control: 'boolean', description: 'アイコンを表示する' },
    customColors: { control: 'boolean', description: '任意色指定（CSSカスタムプロパティ）' },
  },
  args: {
    label: 'ラベル',
    variant: 'text',
    color: 'gray',
    showIcon: true,
    customColors: false,
  },
  parameters: {
    docs: {
      description: {
        component: `
# デジタル庁デザインシステム チップラベルコンポーネント

DADS HTML版（\`chip-label.css\`）のチップラベルを Web Components として提供します。

## 使用方法

\`\`\`html
<dads-chip-label variant="filled-outline" color="purple">
  <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="currentcolor" aria-hidden="true">
    <path d="..."></path>
  </svg>
  ラベル
</dads-chip-label>
\`\`\`

## 任意の色を使う

\`\`\`html
<dads-chip-label variant="filled-outline" style="
  --_non-text: #854f91;
  --_bg: #f4dff9;
  --_text-dark: #72447d;
">
  ラベル
</dads-chip-label>
\`\`\`

## CSSパーツ
- base / icon / label
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = { name: '基本' };

export const AllVariants: Story = {
  name: 'バリアント一覧',
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexWrap = 'wrap';
    wrapper.style.gap = '12px';
    wrapper.style.alignItems = 'center';

    const variantLabels: Record<Variant, string> = {
      text: 'テキスト',
      outline: 'アウトライン',
      'filled-outline': '塗りアウトライン',
      fill: '塗り',
    };

    const variants: Variant[] = ['text', 'outline', 'filled-outline', 'fill'];
    for (const variant of variants) {
      const chip = document.createElement('dads-chip-label');
      chip.setAttribute('variant', variant);
      chip.setAttribute('color', args.color);
      if (args.showIcon) chip.appendChild(createIcon());
      chip.appendChild(document.createTextNode(variantLabels[variant]));
      wrapper.appendChild(chip);
    }

    return wrapper;
  },
  args: {
    label: 'ラベル',
    variant: 'text',
    color: 'gray',
    showIcon: true,
    customColors: false,
  },
};

export const CustomColors: Story = {
  name: '任意の色',
  args: {
    customColors: true,
    color: 'gray',
    variant: 'filled-outline',
  },
};
