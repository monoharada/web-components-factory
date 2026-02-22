# dads-hamburger-menu-button

> ハンバーガーメニューボタンコンポーネント

- **Category**: Navigation
- **Class**: `DadsHamburgerMenuButton`
- **Extends**: `TypographyWebComponent`
- **Source**: `./packages/components/hamburger-menu-button/hamburger-menu-button.ts`

## Install

```bash
npx wcf vendor install --prefix myui --dir vendor/components/myui --component hamburger-menu-button
```

## Usage

```html
<dads-hamburger-menu-button
  type=""
  variant=""
>...</dads-hamburger-menu-button>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-controls` | string | - | 制御対象ID |
| `aria-expanded` | string | - | 展開状態 |
| `aria-label` | string | - | アクセシブル名 |
| `command` | string | - | command-store のコマンド |
| `commandfor` | string | - | command-store のターゲット |
| `lang` | 'ja' \| 'en' | - | ラベル言語 |
| `type` | 'menu' \| 'close' | - | メニュー表示/閉じる表示 |
| `variant` | 'standard' \| 'icon' | - | 見た目バリアント |


## Slots

None


## CSS Parts

| Part | Description |
|------|-------------|
| `base` | ルートボタン |
| `icon` | アイコン領域 |
| `label` | ラベル領域 |


## Styling

```css
/* Custom properties */
dads-hamburger-menu-button {
  /* Override component tokens here */
}

/* ::part() selectors */
dads-hamburger-menu-button::part(base) {
  /* Style the ルートボタン */
}
```
