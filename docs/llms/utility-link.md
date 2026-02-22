# dads-utility-link

> Utility Link コンポーネント

- **Category**: Navigation
- **Class**: `DadsUtilityLink`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/utility-link/utility-link.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component utility-link
```

## Usage

```html
<dads-utility-link>
  <div slot="lead-icon"><!-- 先頭アイコン（任意） --></div>
  <div slot="tail-icon"><!-- 末尾アイコン（任意、指定時は自動末尾アイコンより優先） --></div>
</dads-utility-link>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `download` | boolean | - | download属性 |
| `href` | string | - | リンク先URL |
| `rel` | string | - | リンクrel |
| `target` | string | - | リンクターゲット（download 指定時は内部リンクへは反映しない） |


## Slots

| Slot | Description |
|------|-------------|
| `default` | リンクラベル |
| `lead-icon` | 先頭アイコン（任意） |
| `tail-icon` | 末尾アイコン（任意、指定時は自動末尾アイコンより優先） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | リンク本体（a要素） |
| `label` | ラベル領域 |
| `lead-icon` | 先頭アイコン領域 |
| `tail-icon` | 末尾アイコン領域（tail-icon slot または target="_blank"/download フォールバックを表示） |


## Styling

```css
/* Custom properties */
dads-utility-link {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-utility-link::part(base) {
  /* Style the リンク本体（a要素） */
}
```
