# a11y-annotate 1rem可読性改善（10+件対応）+ AdaptiveCard撤去（統合メンテ）

## 目標
- `a11y-annotate` の右パネル＋左プレビュー上の赤いコールアウトラベル（`.callout-tag`）を **最小1remで読みやすく**し、注釈が **10件以上（2桁）**でもクリップ/はみ出しで破綻しないようにする
- 未使用前提の `adaptive-card` と関連テスト/ドキュメント/設定を削除し、リポジトリのメンテナンス性を上げる

## 背景
- 既存PRでは `a11y-annotate` のパネル内テキストを 1rem に寄せているが、10+件の番号表示（パネル側）や長いラベル（オーバーレイ側）は UI 破綻リスクが残る
- `adaptive-card` は viewer で利用されておらず、コード/テスト/ドキュメントが残り続けることで保守コスト（検索ノイズ、テストセットアップの特例、設定の名残）が増えている

## スコープ
- やること：
  - `a11y-annotate` の `.callout-tag` を長文でも読めるように（折返し等）調整
  - `a11y-annotate` のパネル側番号（`.callout-number`）を 2桁以上でもクリップしない形に調整（必要ならピル化＋レイアウト追従）
  - `a11y-annotate` の 10+件を想定した回帰テストを追加
  - `adaptive-card` の本体/型/エントリ/テスト/ドキュメントを削除し、`tests/setup.ts`・`package.json`・`vite.config.ts` の名残を整理
- やらないこと：
  - 他コンポーネントのAPI/DOM構造変更
  - 依存追加・大規模リファクタ
  - デザイントークン体系の改修（新規グローバルトークン大量追加など）

## 前提 / 制約
- `a11y-annotate` の可読性改善対象は **右パネル＋左の赤いコールアウトラベル**（要件確定）
- 注釈件数は **10+件（2桁）まで想定**（要件確定）
- `adaptive-card` は外部/社内で利用されていない前提（破壊的変更になり得るため、リスクとして明記）
- `vite.config.ts` の lib 名/出力名は `adaptive-card` 固有表記をやめ、`package.json` の `name` に合わせて一般化する（例：`WebComponentsFactory` / `web-components-factory`）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `packages/components/annotate/annotate.ts`
  - `.callout-tag` の `white-space: nowrap` を見直し、折返し可能にする（`flex-wrap` + `white-space: normal` 等）
  - `.callout-tag code` を日本語/長文でも折返せるよう `overflow-wrap` 等を付与（必要最小限）
  - パネル側 `.callout-number` を固定円から **min-width + padding** のピルに寄せ、2桁でもクリップしないようにする
  - `.callout-item` の `grid-template-columns` を番号の実幅に追従できる形へ調整（番号ピル化とセット）

### その他（Docs/Marketing/Infra など）
- `adaptive-card` 削除（例）
  - `src/adaptive-card.ts`, `src/adaptive-card.js`, `src/adaptive-card.types.ts`
  - `tests/adaptive-card*.test.ts`, `tests/setup-improved.ts`, `tests/types/adaptive-card.d.ts`
  - `adaptive-card-design.md`, `README-semantic-improvements.md`, `docs/adaptive-card-improvements.md`
- `tests/setup.ts` の `adaptive-card` import/登録と `.card-link--stretched` 特例を削除（残すなら汎用ロジックのみ）
- `package.json` の description/keywords から `adaptive-card` を除去し、現状に合う文言へ更新
- `vite.config.ts` の `name/fileName` から `AdaptiveCard/adaptive-card` 表記を除去
- `TDD-WORKFLOW.md` は `adaptive-card` 前提の説明を削除 or 汎用例に置換

## 受入基準
- [ ] `.callout-tag` が長いラベルでもはみ出さず、読める形で表示される（折返し等で破綻しない）
- [ ] 注釈が10件以上でも、パネルの `.callout-number` がクリップせず表示される
- [ ] `rg -n -S -- "adaptive-card|AdaptiveCard|card-link--stretched" .` で意図しない残骸がない
- [ ] `tests/setup.ts` に `adaptive-card` 登録や特例ロジックが残っていない
- [ ] `package.json` と `vite.config.ts` に `adaptive-card` 固有表記がない
- [ ] `npm run test:run` が通る（必要なら `npm run type-check` も通る）

## リスク / エッジケース
- `.callout-tag` を折返し可能にすると、プレビュー上でラベルが多段になり、対象要素を覆う面積が増える可能性
- パネル番号のピル化で、注釈一覧の本文開始位置がわずかに変わる
- `adaptive-card` が外部で利用されていた場合は破壊的変更（リリース運用/バージョニングが必要）
- `vite.config.ts` の `name/fileName` 変更が、配布物名を参照している利用者に影響する可能性

## 作業項目（Action items）
1. 承認済みPlanを保存（完了条件: `.codex/plans/` に統合Planが保存されている）
2. `a11y-annotate` の `.callout-tag` 折返し対応を実装（完了条件: 長文ラベルで破綻しない）
3. `a11y-annotate` のパネル番号を2桁対応（完了条件: `.callout-number` が “10” をクリップしない）
4. `a11y-annotate` の回帰テスト追加（完了条件: 10件以上の注釈がレンダリングされ “10” を確認できる）
5. `adaptive-card` のソース/型/エントリを削除（完了条件: `src/adaptive-card*` が存在しない）
6. `adaptive-card` のテスト/補助/型定義を削除（完了条件: `tests/adaptive-card*` 等が存在しない）
7. `tests/setup.ts` を汎用化（完了条件: `adaptive-card` 登録と `.card-link--stretched` 特例が消えて他テストが動く）
8. ドキュメント整理（完了条件: `adaptive-card` 関連mdを削除/一般化し、残骸参照がない）
9. `package.json` / `vite.config.ts` を現状に合わせて更新（完了条件: `adaptive-card` 固有表記がない）
10. 参照再チェック & テスト（完了条件: `rg` で残骸なし + `npm run test:run` 成功）

## テスト計画
- 自動: `npm run test:run`
- 自動（推奨）: `npm run type-check`
- 手動: `npm run dev` で `a11y-annotate` デモを表示し、赤ラベルの折返しとパネル番号（2桁）を目視確認

## オープンクエスチョン
該当なし

