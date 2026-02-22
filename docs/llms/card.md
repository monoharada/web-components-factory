# dads-card

> Cardコンポーネント

- **Category**: Content
- **Class**: `DadsCard`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/card/card.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component card
```

## Usage

```html
<dads-card>
  <div slot="media"><!-- イメージエリア（任意） --></div>
  <div slot="sub"><!-- サブエリア（任意） --></div>
</dads-card>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `layout` | 'vertical' \| 'horizontal' | - | レイアウト（デフォルト: vertical） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | メインコンテンツ（デフォルトスロット、h2/p等を自由にマークアップ） |
| `media` | イメージエリア（任意） |
| `sub` | サブエリア（任意） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | コンテナ（overflow制御に使用） |
| `main` | メインエリア（padding・背景のカスタマイズ） |
| `media` | イメージエリア（背景・ボーダー等のカスタマイズ） |
| `sub` | サブエリア（アクション領域のカスタマイズ） |


## Styling

```css
/* Custom properties */
dads-card {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-card::part(base) {
  /* Style the コンテナ（overflow制御に使用） */
}
```
