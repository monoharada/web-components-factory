# PR monoharada/cem-ci-mcp Review Followups

## 目標
- `validate:wc` の diagnostics（range）を正確にする
- `validate:wc` のサマリ表示を実態に合わせる
- Typography のフォント状態同期を再接続でも一貫させる

## 背景
- このブランチは CEM 生成 + CIゲート / CEM駆動マークアップ検証 / prefix 変換 / DS-MCP を導入しており、方向性は良い
- ただし、validator の `range` が「行頭 index」で前行扱いになるバグがあり、診断出力の信頼性を落とすため修正したい

## スコープ
- やること：
  - `scripts/wc/validator-core.mjs` の `indexToLineCol` を修正（行頭 index を正しく扱う）
  - 回帰テスト追加（改行直後の属性名など）
  - `scripts/wc/validate.mjs` のサマリ（検査ファイル数）を実測ベースに修正
  - `packages/core/typography/font-loading-helper.ts` の同期処理を安定化（再接続で class が残らない）
- やらないこと：
  - `validate:wc` を Lit 記法対応にする（前提として静的 HTML 文字列のみ。Litは使わない）
  - adaptive-card 関連の削除を戻す（このブランチの目的として意図通り）

## 前提 / 制約
- `validate:wc` は今後も「静的 HTML 文字列だけ」を前提とする（Litは使わない）
- JS/TS のデコレータ等は使う可能性があるが、`validate:wc` が対象とするのは HTML/テンプレ文字列のタグ/属性の静的検査に限定する

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `syncFontState()` 実行時に、要素側の `fonts-*` クラスを一旦クリアしてから body の状態を付与する

### その他（Docs/Marketing/Infra など）
- `validate:wc` のサマリに「実際に検査したファイル数」を出す
- diagnostics の range を正確化し、MCP/CI 出力の信頼性を上げる

## 受入基準
- [ ] `'<dads-foo\\nbaz>'` のように改行直後に属性名が来るケースでも、`range.start` が `line:2,col:1` になる
- [ ] 上記を固定する回帰テストが追加される
- [ ] `validate:wc` のサマリが `targets.length` ではなく、実際に検査したファイル数を表示する
- [ ] Typography のフォント状態クラスが再接続で一意に保たれる

## リスク / エッジケース
- range の意味（半開区間）を変えると既存テストが壊れるため、既存表現に合わせて修正する
- `validate:wc` は依存を増やさず deterministic を優先しているため、仕様追加は最小にする

## 作業項目（Action items）
1. `indexToLineCol` の行頭バグ修正（完了条件: 行頭 index が該当行として解決される）
2. 回帰テスト追加（完了条件: 改行直後 attribute の range が期待通り）
3. `validate:wc` のサマリ出力修正（完了条件: 実検査ファイル数が表示される）
4. `syncFontState` のクラス整合性改善（完了条件: 再接続でも fonts-* が残らない）
5. `npm run test:run` と `npm run validate:wc` の実行（完了条件: すべてパス）

## テスト計画
- `npm run test:run`
- `npm run validate:wc`

## オープンクエスチョン
- 該当なし

