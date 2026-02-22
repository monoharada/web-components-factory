# dads-step-navigation-item

> Step Navigation Item（各ステップ）

- **Category**: Navigation
- **Class**: `DadsStepNavigationItem`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/step-navigation/step-navigation.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component step-navigation-item
```

## Usage

```html
<dads-step-navigation-item>
  <div slot="description"><!-- ステップの説明（任意） --></div>
  <div slot="title"><!-- ステップのタイトル --></div>
</dads-step-navigation-item>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `href` | string | - | リンクURL（指定時のみリンク表示） |
| `interaction` | string | - | ボタン相当のインタラクション (button) |
| `label-completed` | string | - | スクリーンリーダー向け「完了」ラベル |
| `label-editing` | string | - | 「編集中」ラベル |
| `label-error` | string | - | 「エラー」ラベル |
| `label-skipped` | string | - | スクリーンリーダー向け「スキップ」ラベル |
| `label-step` | string | - | スクリーンリーダー向け「ステップ」ラベル |
| `rel` | string | - | リンクrel |
| `state` | string | - | 状態 (reached | completed | editing | error | skipped) |
| `step` | string | - | 親が付与する表示番号（1始まり） |
| `target` | string | - | リンクターゲット |


## Slots

| Slot | Description |
|------|-------------|
| `description` | ステップの説明（任意） |
| `title` | ステップのタイトル |


## CSS Parts

| Part | Description |
|------|-------------|
| `description` | 説明 |
| `header` | ヘッダー（リンクの場合は <a>） |
| `number` | ステップ番号（円形） |
| `state-icon` | 状態アイコン（completed/editing/error） |
| `state-label` | 状態ラベル（editing/error） |
| `step` | ステップ要素（コネクタ線含む） |
| `title` | タイトル |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-step-activate` | CustomEvent | interaction="button" のアクティベート時に発火（detail: {step, state, trigger}） |


## Styling

```css
/* Custom properties */
dads-step-navigation-item {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-step-navigation-item::part(description) {
  /* Style the 説明 */
}
```
