# PR #23: Vitest安定化（multi-reporter時のhappy-domクラッシュ回避）

## 目標
- PR #23 ブランチで `npm run ci` / `npm run test:run` が安定してパスする状態にする（マージ可能品質にする）。

## 背景
- 現状、`vitest` の reporter を `verbose` + `json` で同時に有効にすると、happy-dom がクラッシュしテストが落ちる。
- 再現条件: `npx vitest run --reporter=verbose --reporter=json`（または `vitest.config.ts` の `reporter: ['verbose','json']`）。
- 単独 reporter（`verbose` のみ / `json` のみ）では成功する。

## スコープ
- やること：
  - `vitest.config.ts` の reporter 設定を「同時に2つ使わない」形に変更し、デフォルト実行を安定化する
  - JSON出力が必要な場合は、別コマンド/別スクリプトで生成できるようにする
- やらないこと：
  - happy-dom/vitest の依存アップデート
  - checkbox/fieldsetコンポーネントの実装修正（まずはテスト実行系の安定化を優先）
  - `tests/adaptive-card*` 除外の是非判断

## 前提 / 制約
- 変更は最小限（テストの挙動自体を変えず、実行環境/レポート出力の切り替えで安定化）。
- `npm run ci` は `type-check` → `test:run` → `build` のため、ここが通ることが最優先。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
該当なし

### その他（Docs/Marketing/Infra など）
- `vitest.config.ts`：
  - `reporter: ['verbose','json']` をやめ、デフォルトは単一 reporter にする
  - （必要に応じて）環境変数で `json` に切り替えできるようにする（同時有効は不可）
- `package.json` scripts：
  - JSON が必要なら `test:run:json` 等を追加し、`--outputFile` でファイルへ保存する

## 受入基準
- [ ] `npm run test:run` がパスする
- [ ] `npm run ci` がパスする
- [ ] `npx vitest run`（デフォルト）でもパスする
- [ ] JSONレポートが必要な場合、単独実行（例：`npm run test:run:json`）で生成できる

## リスク / エッジケース
- CIや外部ツールが「標準出力にJSONが混ざること」を前提にしている場合、挙動が変わる（その場合は `test:run:json` をCIに組み込む必要あり）。
- 環境変数での切替はOS/シェル差分が出うる（依存追加は避ける）。

## 作業項目（Action items）
1. reporterの再現条件を最小コマンドで固定（完了条件: multi-reporterで失敗、単独で成功を確認）
2. `vitest.config.ts` を「単一reporter」へ変更（完了条件: デフォルト実行でmulti-reporterが使われない）
3. `package.json` に JSON出力用スクリプトを追加（完了条件: JSONをファイル出力できる）
4. `npm run test:run` を実行して成功確認（完了条件: exit code 0）
5. `npm run ci` を実行して成功確認（完了条件: exit code 0）

## テスト計画
- `npm run test:run`
- `npm run ci`
- `npm run test:run:json`（追加した場合）

## オープンクエスチョン
（承認時点では詰まりなし）

