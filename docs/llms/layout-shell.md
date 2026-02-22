# dads-layout-shell

> 画面レイアウトシェル

- **Category**: Layout
- **Class**: `DadsLayoutShell`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/layout-shell/layout-shell.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component layout-shell
```

## Usage

```html
<dads-layout-shell>
  <div slot="aside"><!-- 補助情報領域 --></div>
  <div slot="footer"><!-- フッター領域 --></div>
  <div slot="header"><!-- ヘッダー領域 --></div>
  <div slot="sidebar"><!-- サイドバー領域 --></div>
</dads-layout-shell>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `mobile-sidebar` | 'hidden' \| 'top' \| 'bottom' | - | app-shell + mobile 時のサイドバー配置 |
| `mode` | 'auto' \| 'desktop' \| 'tablet' \| 'mobile' | - | レイアウトモード |
| `pattern` | 'website' \| 'app-shell' \| 'master-detail' \| 'left-header-pane' \| 'three-pane' \| 'three-pane-shell' | - | レイアウトパターン |


## Slots

| Slot | Description |
|------|-------------|
| `aside` | 補助情報領域 |
| `default` | メイン領域 |
| `footer` | フッター領域 |
| `header` | ヘッダー領域 |
| `sidebar` | サイドバー領域 |


## CSS Parts

| Part | Description |
|------|-------------|
| `aside` | 補助情報領域 |
| `base` | ルートレイアウト領域 |
| `body` | 本文レイアウト領域 |
| `footer` | フッター領域 |
| `header` | ヘッダー領域 |
| `main` | メイン領域 |
| `sidebar` | サイドバー領域 |


## Styling

```css
/* Custom properties */
dads-layout-shell {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-layout-shell::part(aside) {
  /* Style the 補助情報領域 */
}
```
