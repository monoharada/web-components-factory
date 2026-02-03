# Calendar/DatePicker 崩れ調査（追加調査）

## 目標
- viewer.html での崩れの根本原因を特定し、最小修正方針を合意できる状態にする。

## 背景
- 添付の1,2枚目（現状）では角丸・余白・セル寸法が崩れており、3枚目以降（本来の見た目）と差がある。
- `calendar-styles.ts` / `date-picker-styles.ts` は `--spacing-*` を大量に使用しているがフォールバックがない。
- `applyDADSTokens()` には `--spacing-*` が含まれていない。
- `dads-calendar` / `dads-date-picker` は `applySpacingTokens()` を適用していない。
- viewer.html は `/styles/tokens.js` を modulepreload しているだけで、トークン適用の副作用はない。

## スコープ
- やること：
  - `--spacing-*` の未定義がレイアウト崩れの根因であることを確認
  - 最小修正として `applySpacingTokens()` の適用方針を提示
- やらないこと：
  - 実装変更（APPROVE PLAN なし）

## 前提 / 制約
- Planフェーズのため読み取りのみ。
- viewer.html 以外の環境（Storybook 等）における崩れ有無は未確認。
- 他コンポーネントの慣習に従い、`applySpacingTokens()` は各コンポーネント内で適用する。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `dads-calendar` と `dads-date-picker` の `styles` に `applySpacingTokens()` を追加し、`--spacing-*` をShadow内で定義
  - 既存パターン（`button`, `input-text`, `select` など）と整合
  - 既存のCSS値は変更せず、トークン供給のみ

### その他（Docs/Marketing/Infra など）
- 崩れ原因と対策を `docs/knowledge/learnings.md` に追記する案（必要なら）

## 受入基準
- [ ] `dads-calendar` / `dads-date-picker` のShadow内で `--spacing-4` 等が解決される
- [ ] viewer.html の見た目が添付3枚目以降に近い状態へ戻る
- [ ] 他コンポーネントの見た目に影響がない（差分確認）

## リスク / エッジケース
- 既に外部で `--spacing-*` を上書きしている場合、Shadow内定義と競合する可能性
- viewer以外（Storybook / 埋め込み）での依存関係が異なる場合、見た目差が残る可能性

## 作業項目（Action items）
1. DevTools で `dads-calendar` / `dads-date-picker` の `--spacing-4` を確認（完了条件: 未定義である証拠が取れる）
2. `calendar-styles.ts` / `date-picker-styles.ts` の `--spacing-*` 依存箇所を要約（完了条件: 影響範囲が列挙できる）
3. `applySpacingTokens()` 追加箇所の候補を確定（完了条件: 追加行が明確）
4. 影響範囲の確認観点を整理（完了条件: 目視確認リストができる）
5. 変更の最小化方針を確定（完了条件: 余計なCSS変更を伴わない案に絞る）
6. テスト/検証計画を確定（完了条件: 実行コマンドと確認ポイントが確定）

## テスト計画
- viewer.html でカレンダー/日付ピッカーの目視確認
- `npm run test:run -- calendar` / `npm run test:run -- date-picker`（必要に応じて）

## オープンクエスチョン
- 該当なし
