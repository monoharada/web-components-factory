# validate:wc の CLI 引数処理 / glob マッチ / DS-MCP prefix 許容 修正プラン（承認済み）

## 目標
- `validate:wc` を CLI でファイル指定して実行したときに、意図した対象が必ず検証される
- `exclude` の `/**` パターンが想定外に広くマッチしない（`dist/**` が `dist-pages/**` を巻き込まない）
- DS-MCP の `validate_markup({ prefix })` で `dads-*` と `<prefix>-*` の両方を許容できる
- 既存の CI（`npm run validate:wc`）挙動は維持する

## 背景
- `scripts/wc/validate.mjs` は `--config/-c` 未指定時に最初の引数を誤って捨てる可能性がある
- `scripts/wc/validator-core.mjs` の `matchesGlob()` で `pat.endsWith('/**')` の fast-path が境界を見ない
- DS-MCP は prefix 戦略を持つため、利用者の入力が canonical/prefixed で揺れる可能性がある

## スコープ
- やること：
  - `scripts/wc/validate.mjs` の引数フィルタ条件を修正（`--config/-c` が存在するときだけ除外）
  - `scripts/wc/validator-core.mjs` の `/**` fast-path を境界付きに修正
  - DS-MCP の `validate_markup` を、prefix 指定時に canonical と prefixed の両方を許容するよう修正
  - 最低限のテスト（vitest）を追加して再発防止
- やらないこと：
  - `include` の glob 展開対応（現状方針のまま）
  - HTML パーサの刷新やバリデータ仕様の大幅変更
  - CEM 生成・CI 手順の変更

## 前提 / 制約
- 依存追加なし（既存の vitest で検証）
- `validate:wc` は引き続き “明示的パスのみ” を前提（glob はエラー）
- 既存 `wc.config.js` の `exclude` 設定意図（`dist/**`, `dist-pages/**` を別扱い）を尊重

## 変更内容（案）
### データ / バックエンド
- `scripts/wc/validate.mjs`
  - 引数解釈を純関数として切り出し、`--config` がある場合だけ対象を除外する
- `scripts/wc/validator-core.mjs`
  - `pat.endsWith('/**')` の判定を `file === prefix || file.startsWith(prefix + '/')` に変更
- `scripts/mcp/design-system-mcp.mjs`
  - `validate_markup({ prefix })` の prefix 指定時に、`dads-*` と `<prefix>-*` の両方を検証対象として扱う

### UI / UX
- 該当なし

### その他（Docs/Marketing/Infra など）
- `tests/` にユニットテスト追加（例: `matchesGlob` の境界 / CLI 引数処理）
- 必要なら `docs/knowledge/wctools-validate.md` に短い追記（任意）

## 受入基準
- [ ] `node scripts/wc/validate.mjs viewer.html` で `viewer.html` が実際に対象になる（無視されない）
- [ ] `node scripts/wc/validate.mjs --config wc.config.js viewer.html` で同様に対象になる
- [ ] `matchesGlob('dist-pages/x', 'dist/**') === false` が担保される（境界付き）
- [ ] DS-MCP の `validate_markup({ prefix })` で `dads-*` と `<prefix>-*` の両方が許容される
- [ ] 追加したテストが通る（`npm run test:run`）
- [ ] `npm run validate:wc`（引数なし）の既存挙動が変わらない

## リスク / エッジケース
- `/**` fast-path の境界化で、意図的に “prefix だけ” を除外したいケースが変わる可能性 → `file === prefix` を含めて互換性を確保
- 既存の正規表現ベース解析の制約（テンプレ文字列等の取りこぼし）は今回の修正対象外

## 作業項目（Action items）
1. 既存の引数バグを再現（完了条件: “第1引数が落ちる” を確認できる）
2. CLI 引数解釈を純関数化して `validate.mjs` に適用（完了条件: `viewer.html` 指定が落ちない）
3. `matchesGlob` の `/**` fast-path を境界付きに修正（完了条件: `dist/**` が `dist-pages/**` を巻き込まない）
4. DS-MCP `validate_markup` を両方許容に修正（完了条件: prefix 指定でも `dads-*` が unknown にならない）
5. vitest のユニットテスト追加（完了条件: 受入基準の期待値をテストで固定）
6. `npm run test:run` / `npm run type-check` / `npm run validate:wc` を実行（完了条件: すべて成功）

## テスト計画
- `npm run test:run`
- `npm run type-check`
- `node scripts/wc/validate.mjs viewer.html`
- `node scripts/wc/validate.mjs --config wc.config.js viewer.html`
- `npm run validate:wc`

## オープンクエスチョン
（詰まるときだけ最大2つ）
- なし（prefix 指定時に `dads-*` と `<prefix>-*` の両方を許容する方針で確定）

