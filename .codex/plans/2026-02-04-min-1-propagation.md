# min=1 伝播の安全化（import specifier 書き換えと importmap 正規化）

## 目標
`min=1` 指定時に、相対/絶対 specifier にのみ `min=1` を強制伝播し、絶対 URL の importmap でも安全に動作させる。

## 背景
`min=1` での計測は依存グラフ全体の minify を前提としている。現状の importmap 解決は文字列結合ベースで、hash/絶対 URL の扱いに不整合が起きうる。

## スコープ
- やること：server 返却時の specifier 付与ロジック改善、averageCase runtime の importmap 解決の URL 正規化、最小限のユニットテスト追加
- やらないこと：import 解析器（es-module-lexer など）の導入、importmap 仕様変更、E2E 計測基準の変更

## 前提 / 制約
- 伝播対象は **相対/絶対 specifier のみ**（bare specifier は対象外）。
- 既存の正規表現ベースの書き換えを維持する（安全性の限界はリスクで明記）。

## 変更内容（案）
### データ / バックエンド
- `server.ts` に `appendMinQuery` 相当の堅牢化（hash/既存 min=0 への上書き、クエリ構築は URLSearchParams で）。
- `rewriteModuleSpecifiers` を `shouldMinify` の JS/TS 返却時に適用し、相対/絶対 specifier のみ `min=1` を付与。

### UI / UX
- `averageCase.runtime.js` の `resolveSpecifier` を URL ベースに変更し、絶対 URL の場合は `url.href` を返して origin を保持。
- `min=0` が含まれていても `min=1` に強制上書き。

### その他（Docs/Marketing/Infra など）
- 該当なし（必要なら `docs/knowledge/performance-average-case.md` の追記を検討）

## 受入基準
- [ ] `min=1` のとき、相対/絶対 specifier にだけ `min=1` が付与される（bare specifier は不変）。
- [ ] `min=0` が含まれていても `min=1` に上書きされる。
- [ ] `#hash` 付き URL でも `min=1` が hash 前に付与される。
- [ ] importmap の target が絶対 URL でも正しい URL（origin 保持）で import される。
- [ ] 既存の `averageCase` 計測 E2E が壊れない（任意で `test:e2e` 実行）。

## リスク / エッジケース
- 正規表現ベースの書き換えは、コメント/文字列中の `import` を誤検知する可能性がある（完全解決には AST 解析が必要）。
- URL 正規化により、相対 URL が絶対 URL へ変換される可能性がある（動作は問題ない想定だが差分として残る）。

## 作業項目（Action items）
1. `rewriteModuleSpecifiers` 用のユーティリティを新規作成（完了条件: 単体で URLSearchParams を使って `min=1` を上書きできる）
2. 1のユーティリティに対する failing test を追加（完了条件: 相対/絶対のみ `min=1` 付与の RED を確認）
3. テストを通す最小実装（完了条件: `min=0` 上書き・hash 対応が PASS）
4. `server.ts` にユーティリティを組み込み（完了条件: JS/TS の minify 返却で rewrite が有効）
5. `averageCase.runtime.js` の `resolveSpecifier` を URL ベースに変更（完了条件: 絶対 URL で `url.href` を返す）
6. `resolveSpecifier` のユーティリティ化 + failing test 追加（完了条件: 絶対/相対/既存 min=0 で RED を確認）
7. テストを通す（完了条件: `npm run test:run` が PASS）

## テスト計画
- `npm run test:run`
- 必要に応じて `npm run test:e2e`（averageCase 計測の回帰確認）

## オープンクエスチョン
該当なし
