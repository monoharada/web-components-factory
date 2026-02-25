# Scope
## Included
- 新規 `dads-tab` の実装（単一コンポーネント）。
- 4方向レイアウト: `top` / `bottom` / `left` / `right`。
- 折返し（reflow）対応レイアウト（Top Reflow / Bottom Reflow）。
- 2つのアクティベーションモード: `auto` / `manual`。
- APG準拠キーボード操作:
  - Arrow移動
  - Home/End
  - Enter/Space
  - roving tabindex
- ARIA契約:
  - `tablist` / `tab` / `tabpanel`
  - `aria-selected`
  - `aria-controls`
  - `aria-labelledby`
  - `aria-orientation`
- CEM・autoload・viewer/demo・検証導線の整備。

## Excluded
- タブラベル内アイコン操作仕様の確定（初版はテキストラベルのみ保証）。
- 複合コンポーネント分離（`tab-list` / `tab-panel`）。
- 非タブ機能（検索・ページング・フィルタ等）の内包。

## Assumptions
- パネルは `dads-tab` の直接子要素で表現し、ラベルは子要素属性（例: `data-tab-label`）から取得する。
- disabled表現は子要素属性（例: `data-tab-disabled="true"`）で扱う。
- 主要Figmaノードは以下を基準にする:
  - `24231:7539`, `24231:7536`, `24231:7542`, `24231:7551`, `24231:7545`, `24231:7548`
  - `24274:7751`, `25181:379`, `24274:7713`

## Fixed decisions
- U-01: API形状は単一 `dads-tab` とする。
- U-02: activationは `auto` / `manual` の両対応とする。
- U-03: 向きバリエーションは4方向すべて初版で対応する。
- U-04: 多タブ時は折返し（reflow）を初版の既定戦略とする。
- U-05: ラベル内容はテキストのみを初版保証とする。
- U-06: A11y適合は WCAG 2.2 AA + APG をマージ条件として扱う。

## Unknowns
- なし
