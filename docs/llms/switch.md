# dads-switch

> Switchコンポーネント

- **Category**: Form
- **Class**: `DadsSwitch`
- **Extends**: `TypographyFormComponent`
- **Form-associated**: yes
- **Source**: `./packages/components/switch/switch.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component switch
```

## Usage

```html
<dads-switch
  value=""
  name=""
  size=""
  disabled
>
  <div slot="label-left"><!-- 左側ラベル --></div>
  <div slot="label-right"><!-- 右側ラベル --></div>
</dads-switch>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | boolean | - | スイッチの状態 |
| `disabled` | boolean | - | 無効状態 |
| `name` | string | - | フォーム名 |
| `size` | string | - | サイズ（sm / md / lg）デフォルト: md |
| `value` | string | - | チェック時のフォーム値（デフォルト: "on"） |


## Slots

| Slot | Description |
|------|-------------|
| `label-left` | 左側ラベル |
| `label-right` | 右側ラベル |


## CSS Parts

| Part | Description |
|------|-------------|
| `checkbox` | 内部チェックボックス（visually hidden） |
| `knob` | スイッチのノブ（つまみ） |
| `label-left` | 左側ラベルコンテナ |
| `label-right` | 右側ラベルコンテナ |
| `switch` | スイッチのlabel要素 |
| `track` | スイッチのトラック（背景） |
| `wrapper` | 全体を囲むコンテナ |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-change` | Event | 状態変更時に発火 |


## Styling

```css
/* Custom properties */
dads-switch {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-switch::part(checkbox) {
  /* Style the 内部チェックボックス（visually hidden） */
}
```
