# dads-code-block

> HTMLコード表示（コピー機能つき）コンポーネント

- **Category**: Content
- **Class**: `DadsCodeBlock`
- **Extends**: `WebComponent`
- **Source**: `./packages/components/code-block/code-block.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component code-block
```

## Usage

```html
<dads-code-block>
  <div slot="label"><!-- 左上ラベル（例: HTML） --></div>
</dads-code-block>
```

## Attributes

None


## Slots

| Slot | Description |
|------|-------------|
| `label` | 左上ラベル（例: HTML） |


## CSS Parts

| Part | Description |
|------|-------------|
| `code` | コード要素（code） |
| `copy-button` | Copyボタン |
| `header` | ヘッダー（ラベル + Copyボタン） |
| `layout` | 全体ラッパー |
| `pre` | コード領域（pre） |
| `status` | Copy結果の通知領域（aria-live） |


## Styling

```css
/* Custom properties */
dads-code-block {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-code-block::part(code) {
  /* Style the コード要素（code） */
}
```
