# dads-avatar

> アバターコンポーネント

- **Category**: Display
- **Class**: `DadsAvatar`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/avatar/avatar.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component avatar
```

## Usage

```html
<dads-avatar
  label=""
  size=""
>...</dads-avatar>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color` | string | - | 背景色（CSSカスタムプロパティ名, 例: --color-primitive-blue-600） |
| `initials` | string | - | 表示文字（1〜2文字、写真未指定時のフォールバック） |
| `label` | string | - | アクセシブルラベル（指定時はaria-hidden解除） |
| `size` | string | - | サイズpx（デフォルト: '32'） |
| `src` | string | - | 写真URL（指定時は写真モード） |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `img` | img要素（写真モード） |
| `svg` | SVG要素（イニシャルモード） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-avatar-background` | - | 背景色（デフォルト: #949494） |
| `--dads-avatar-text-color` | - | テキスト色（デフォルト: white） |


## Styling

```css
/* Custom properties */
dads-avatar {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-avatar::part(img) {
  /* Style the img要素（写真モード） */
}
```
