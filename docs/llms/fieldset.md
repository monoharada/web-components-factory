# dads-fieldset

> Fieldsetコンポーネント

- **Category**: Form
- **Class**: `DadsFieldset`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/fieldset/fieldset.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component fieldset
```

## Usage

```html
<dads-fieldset
  support-text=""
  required
  disabled
>
  <div slot="legend"><!-- カスタムレジェンド --></div>
  <div slot="support-text"><!-- カスタムサポートテキスト --></div>
</dads-fieldset>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `disabled` | boolean | - | 無効状態（子要素に伝播） |
| `legend` | string | - | レジェンドテキスト（フォールバック用） |
| `required` | boolean | - | ※必須ラベルを表示 |
| `support-text` | string | - | サポートテキスト（フォールバック用） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | デフォルト（子要素） |
| `legend` | カスタムレジェンド |
| `support-text` | カスタムサポートテキスト |


## CSS Parts

| Part | Description |
|------|-------------|
| `content` | 子要素コンテナ |
| `fieldset` | fieldset要素 |
| `legend` | legend要素 |
| `legend-fallback` | legend属性のフォールバック表示 |
| `requirement` | 要否ラベル（※必須） |
| `support-fallback` | support-text属性のフォールバック表示 |
| `support-text` | サポートテキストコンテナ |


## Styling

```css
/* Custom properties */
dads-fieldset {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-fieldset::part(content) {
  /* Style the 子要素コンテナ */
}
```
