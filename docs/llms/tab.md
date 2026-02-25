# dads-tab

> DadsTab コンポーネント

- **Category**: Navigation
- **Class**: `DadsTab`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/tab/tab.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component tab
```

## Usage

```html
<dads-tab orientation="top">
  <div data-tab-label="タブ1">タブ1の内容</div>
  <div data-tab-label="タブ2">タブ2の内容</div>
  <div data-tab-label="タブ3">タブ3の内容</div>
</dads-tab>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `activation-mode` | 'auto' \| 'manual' | 'auto' | アクティベーションモード |
| `orientation` | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | タブリストの配置方向 |
| `selected-index` | string | '0' | 選択中のタブインデックス |


## Slots

| Slot | Description |
|------|-------------|
| `default` | タブパネルの内容（各子要素に data-tab-label でラベル、data-tab-disabled で無効化を指定） |


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートコンテナ |
| `indicator` | 各タブの選択マーク |
| `label` | 各タブのラベルテキスト |
| `tab` | 各タブボタン（role="tab"） |
| `tablist` | タブリスト（role="tablist"） |
| `tabpanel` | 各タブパネル（role="tabpanel"） |


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-tab-background` | - | タブ背景色 |
| `--dads-tab-background-hover` | - | タブホバー時背景色 |
| `--dads-tab-color` | - | タブテキスト色 |
| `--dads-tab-color-selected` | - | 選択タブテキスト色 |
| `--dads-tab-color-disabled` | - | 無効タブテキスト色 |
| `--dads-tab-border-color` | - | ボーダー色 |
| `--dads-tab-indicator-color` | - | インジケーター色 |
| `--dads-tab-indicator-height` | - | インジケーター高さ |
| `--dads-tab-focus-outline-color` | - | フォーカスアウトライン色 |
| `--dads-tab-focus-ring-color` | - | フォーカスリング色 |


## Events

| Event | Type | Description |
|-------|------|-------------|
| `dads-tab-change` | CustomEvent | タブ選択変更時（detail: { selectedIndex: number, previousIndex: number }） |


## Styling

```css
/* Custom properties */
dads-tab {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-tab::part(base) {
  /* Style the ルートコンテナ */
}
```
