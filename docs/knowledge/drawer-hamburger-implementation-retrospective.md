# Drawer / Hamburger 実装ふりかえり（2026-02-08）

## 対象
- `dads-drawer`
- `dads-hamburger-menu-button`
- `dads-mobile-mock`
- `src/demos/drawer.ts` / `src/demos/hamburger-menu-button.ts`

## 今回の主な不具合と原因

### 1. 「メニューを押しても開かない」
- 原因:
  - `defaultCommandStore.bind(...)` のバインド対象ルートと `commandfor` 解決ルートがズレるケースがあった。
  - デモ内の script 実行スコープ（`currentScript.parentElement`）依存が強く、セクション構造変更に弱かった。
- 対応:
  - API/ライブ/モバイルの各ルートを明示 ID で取得し、バインド先を固定化。
  - `data-*-command-store-bound` ガードで多重バインドを防止。

### 2. 閉じるボタンの見た目が Figma と不一致
- 原因:
  - `×` をラベル文字列に含めていたため、デザイン上のアイコンとテキストが分離されていなかった。
- 対応:
  - `dads-drawer` の `close-button` に SVG アイコン（Figma パス）を追加。
  - `close-label` は純粋に文言（`閉じる`）のみを扱う形へ統一。
  - アイコンは `aria-hidden="true"` + `focusable="false"` を付与。

### 3. フォーカス時の見た目が崩れる（角丸・左右余白が消える）
- 原因:
  - デモ用 `::part(close-button)` 上書きで `border-radius` / `padding` を打ち消していた。
- 対応:
  - デモの `::part(close-button)` 上書きを見直し、角丸・左右余白・gap を復元。
  - DADS の focus スタイルが自然に乗る状態に調整。

### 4. モバイル作例でヘッダー高さが変わりレイアウトシフト
- 原因:
  - 閉状態ヘッダーと開状態ドロワーヘッダーの高さ定義が一致していなかった。
- 対応:
  - 両者を `68px` に統一し、シフトを解消。

## 次回同じミスを防ぐチェックリスト

## commandfor / command-store
- [ ] `commandfor` のセレクタ解決範囲と `bind(root)` の root が一致しているか。
- [ ] 初期表示後に `syncTrigger`（`type` / `aria-expanded` / `command`）を必ず実行しているか。
- [ ] デモ script に多重バインド防止フラグを置いているか。

## Figma 準拠
- [ ] 文字で代用せず、アイコン形状は SVG パスで再現したか。
- [ ] `get_design_context` 後に必ず `get_screenshot` で最終形を確認したか。
- [ ] Figma MCP の asset 書き出し先は毎回ユニークディレクトリにしたか（上書き禁止回避）。

## a11y
- [ ] 装飾アイコンに `aria-hidden="true"` を付けたか。
- [ ] SVG がフォーカス不能であること（`focusable="false"`）を確認したか。
- [ ] `aria-label` / `aria-labelledby` / `aria-describedby` の優先順が崩れていないか。
- [ ] 差分に対して `a11y_diff_lint` を実行したか。

## デモ品質
- [ ] 開閉状態間で高さ・余白・境界線が揺れていないか。
- [ ] `data-preview-contained` と `showModal` の役割を混同していないか。
- [ ] 実画面作例と API/Controls 作例の両方で開閉動作を確認したか。

## 今回有効だった品質ゲート
- `npm run test:coverage -- <関連テスト>`
- `python3 ~/.codex/skills/a11y-checker/scripts/a11y_diff_lint.py --diff-file ... --format md`
- `npm run validate:wc`
- `npm run ci`
- `npm run agents:verify`（※生成物差分がある状態では `check-generated-clean` が失敗するため、コミット後に再実行）
