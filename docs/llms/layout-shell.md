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


## CSS Custom Properties

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--dads-layout-shell-space` | - | 余白の基本値（inline-padding / block-gap の基準） |
| `--dads-layout-shell-pane-width` | - | ペイン幅の基本値（sidebar / rail / aside の基準） |
| `--dads-layout-shell-main-max-width` | - | websiteパターン時のメイン最大幅（基本調整） |
| `--dads-layout-shell-mobile-space-scale` | - | mobile時の余白縮小倍率（spaceに乗算） |
| `--dads-layout-shell-inline-padding` | - | コンテナの左右余白（詳細上書き） |
| `--dads-layout-shell-block-gap` | - | ブロック間ギャップ（詳細上書き） |
| `--dads-layout-shell-sidebar-width` | - | app-shell desktop時のsidebar幅（詳細上書き） |
| `--dads-layout-shell-sidebar-rail-width` | - | app-shell tablet時のsidebar幅（詳細上書き） |
| `--dads-layout-shell-aside-width` | - | master-detail desktop時のaside幅（詳細上書き） |


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
