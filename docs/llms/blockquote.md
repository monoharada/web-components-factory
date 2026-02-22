# dads-blockquote

> 引用ブロックコンポーネント

- **Category**: Content
- **Class**: `DadsBlockquote`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/blockquote/blockquote.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component blockquote
```

## Usage

```html
<dads-blockquote>
  <div slot="close"><!-- 締め括りコンテンツ（最後の段落、出典など） --></div>
  <div slot="lead"><!-- 冒頭コンテンツ（最初の段落など） --></div>
</dads-blockquote>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `cite` | string | - | 引用元URL |


## Slots

| Slot | Description |
|------|-------------|
| `close` | 締め括りコンテンツ（最後の段落、出典など） |
| `default` | 本文コンテンツ（中間の段落群） |
| `lead` | 冒頭コンテンツ（最初の段落など） |


## CSS Parts

| Part | Description |
|------|-------------|
| `blockquote` | 引用ブロック要素（セマンティック・グリッドレイアウト・視覚スタイル） |
| `body` | 本文スロット |
| `close` | 締め括りスロット |
| `lead` | 冒頭スロット |


## Styling

```css
/* Custom properties */
dads-blockquote {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-blockquote::part(blockquote) {
  /* Style the 引用ブロック要素（セマンティック・グリッドレイアウト・視覚スタイル） */
}
```
