# Calendar Range Infill Styling

## 目標
- 期間選択時、開始/終了以外の期間内日付に「プライマリーのボーダー＋ターシャリーの塗り」を適用し、横線の上に配置された見え方を作る。

## 背景
- 現状は期間内が横線のみで、日付セルが線の上に乗って見えない。
- DADSのテキストボタン hover 色（tertiary bg hover）相当の塗りが求められている。

## スコープ
- やること：
  - range中間セル（start/end以外）の日付ボタンに背景/ボーダーを付与
  - 横線の上に日付が乗って見えるレイヤー調整を維持
- やらないこと：
  - 開始/終了日の見た目変更
  - rangeのロジック変更

## 前提 / 制約
- テキストボタン hover の塗りは `--color-primitive-blue-50`（`--button-tertiary-bg-hover` 相当）を使用
- プライマリーのボーダーは `--color-primitive-blue-900` を使用
- 既存の `data-in-range` / `data-range-start` / `data-range-end` 属性で制御

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `calendar-styles.ts` の range 中間セルに
  - `border: 1px solid var(--color-primitive-blue-900)`
  - `background-color: var(--color-primitive-blue-50)`
  - 必要に応じて `color` は既存維持
- range線（::before）と日付ボタンの重なり順は維持（z-index 1/0）

### その他（Docs/Marketing/Infra など）
- 該当なし

## 受入基準
- [ ] 期間内（start/end以外）の日付が薄い青塗り＋青ボーダーになる
- [ ] 横線の上に日付が配置された見え方になる
- [ ] start/end の見た目は変わらない

## リスク / エッジケース
- hover/active/selected の優先順位が崩れる可能性
- disabled 日付に適用されるとコントラストが落ちる可能性

## 作業項目（Action items）
1. テキストボタンの hover 色トークンを確認（完了条件: 参照トークンが確定）
2. range中間セルのCSSルールを追加（完了条件: セレクタとトークンが反映）
3. CSSルールをテストで保証（完了条件: 新規テストがRED→GREEN）
4. hover/active の競合を確認（完了条件: 既存挙動が維持）
5. `npm run test:run -- calendar` 実行（完了条件: pass）
6. viewerで目視確認（完了条件: 要求見た目を満たす）

## テスト計画
- `npm run test:run -- calendar`
- viewer.html で期間選択の中間セルを目視

## オープンクエスチョン
- 該当なし
