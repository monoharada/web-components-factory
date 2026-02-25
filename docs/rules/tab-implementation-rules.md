# タブ実装ルール（再発防止）

`dads-tab` の実装・改修時に、selected 表示の崩れや色指定の逸脱を防ぐためのルールです。  
特に `orientation="top" / "bottom"` の selected タブとパネル境界の整合を重視します。

## 適用範囲

- `packages/components/tab/**`
- `src/demos/tab.ts`
- `docs/llms/tab.md`（必要に応じて同期）

## 必須ルール

1. 色は必ずデザイントークン変数を使う。
- `rgb()` / `rgba()` / `#hex` の直書き禁止
- 例: `var(--dads-tab-indicator-color)`, `var(--dads-tab-border-color)`

2. selected と hover は同居させない。
- hover セレクタは必ず `:not([aria-selected="true"])` を含める

3. `orientation="top"` の selected は上端を青帯で満たす。
- selected 本体は `border-top: 0`
- `::before` で `--dads-tab-indicator-height` の青帯を上面に重ねる
- 重ね描き時は selected 内 `indicator` を `transparent` にして二重描画を防ぐ

4. `orientation="bottom"` の selected も同様に下端を青帯で満たす。
- selected 本体は `border-bottom: 0`
- `::after` で `--dads-tab-indicator-height` の青帯を下面に重ねる
- selected 内 `indicator` は `transparent`

5. selected と panel の境界は連続して見えること。
- selected 側で panel との接合辺（top なら下辺、bottom なら上辺）に余計な線を出さない
- 「縦ボーダーが青帯を突き抜ける」見え方を禁止

6. トークン責務を維持する。
- 形状・レイアウトはスタイル側
- 色はトークン側（`tab-tokens.ts`）で意味付けし、スタイルで直値化しない

## 実装テンプレート（抜粋）

```css
:host([orientation="top"]) [part~="tab"][aria-selected="true"] {
  border-top: 0;
  border-right: 1px solid var(--dads-tab-border-color);
  border-bottom: 0;
  border-left: 1px solid var(--dads-tab-border-color);
}

:host([orientation="top"]) [part~="tab"][aria-selected="true"]::before {
  content: '';
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: -1px;
  inline-size: calc(100% + 2px);
  block-size: var(--dads-tab-indicator-height);
  background: var(--dads-tab-indicator-color);
}

:host([orientation="top"]) [part~="tab"][aria-selected="true"] [part~="indicator"] {
  background: transparent;
}
```

```css
:host([orientation="bottom"]) [part~="tab"][aria-selected="true"] {
  border-top: 0;
  border-right: 1px solid var(--dads-tab-border-color);
  border-bottom: 0;
  border-left: 1px solid var(--dads-tab-border-color);
}

:host([orientation="bottom"]) [part~="tab"][aria-selected="true"]::after {
  content: '';
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: -1px;
  inline-size: calc(100% + 2px);
  block-size: var(--dads-tab-indicator-height);
  background: var(--dads-tab-indicator-color);
}

:host([orientation="bottom"]) [part~="tab"][aria-selected="true"] [part~="indicator"] {
  background: transparent;
}
```

## デザイン照合ノード（Figma）

- top selected: `24144:6935`
- bottom selected: `24169:7238`

## PR前チェック

```bash
npm run test:run -- packages/components/tab/tab.test.ts
npm run type-check
```

```bash
rg -n "rgb\\(|rgba\\(|#[0-9a-fA-F]{3,8}" packages/components/tab
```

上記 `rg` でヒットした場合は、色指定をトークン変数へ置換してからレビューに進むこと。
