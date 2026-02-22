# dads-step-navigation

> Step Navigation（コンテナ）

- **Category**: Navigation
- **Class**: `DadsStepNavigation`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/step-navigation/step-navigation.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component step-navigation
```

## Usage

```html
<dads-step-navigation
  size=""
>
  <div slot="status"><!-- 進捗文言（スクリーンリーダー向け、visually-hidden） --></div>
</dads-step-navigation>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `orientation` | string | - | 表示方向 (horizontal | vertical) |
| `size` | string | - | サイズ (normal | small) |
| `status-live` | string | - | ステータスの読み上げ (off | polite | assertive) |


## Slots

| Slot | Description |
|------|-------------|
| `default` | dads-step-navigation-item 群 |
| `status` | 進捗文言（スクリーンリーダー向け、visually-hidden） |


## CSS Parts

| Part | Description |
|------|-------------|
| `container` | ナビゲーションコンテナ |
| `list` | ステップ一覧（リスト） |
| `status` | 進捗文言のラッパー |


## Styling

```css
/* Custom properties */
dads-step-navigation {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-step-navigation::part(container) {
  /* Style the ナビゲーションコンテナ */
}
```
