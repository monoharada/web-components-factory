# viewer demos / api controls: PR差分ファイル全体のコード簡素化

## 目標
- 今回PRの差分ファイル（`origin/main...HEAD`）を対象に、**挙動を変えずに** 読みやすさ・重複・見通しを改善する
- 既存の検証（`test` / `type-check` / `lint` / `validate:wc` / `validate:demo-code-block` / `pages:build`）で壊れていないことを担保する

## 背景
- ユーザー要望：「コードを簡素化」＋「対象は今回のPRの差分ファイルすべて」
- 現在ブランチは `monoharada/demo-api-cachefix`
- ローカル `main` は古く、PR差分の基準は `origin/main...HEAD` が適切

## スコープ
- やること：
  - 対象ファイル（`git diff --name-only origin/main...HEAD`）の簡素化
  - 主に `.ts/.mjs/.cjs/.js/.html` を対象に、重複削減・小さな抽出・不要分岐の整理
  - `.md` は必要なら誤字/明確化のみ
- やらないこと：
  - 公開API/仕様変更（HTML構造の大幅変更、`bindApiControls()` の外部仕様変更、CI必須手順変更）
  - 依存追加、機能追加
  - 大量整形だけの変更

## 前提 / 制約
- “PR差分”の基準は `origin/main...HEAD`
- `validate:demo-code-block` は正規表現＋slice の静的解析に依存するため、デモ定義の形（`key: () =>`）を不用意に壊さない
- `viewer-api-controls` はテストで出力仕様が固定されているため、仕様変更につながる整理は避ける
- `viewer.html` / `sw.js` は影響が大きいので、原則“等価変形”に限定する

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 見た目・デモ内容は維持（文字列組み立て改善はOKだが出力意味が変わる変更は避ける）

### その他（Docs/Marketing/Infra など）
- `src/viewer-api-controls.ts`
  - 「値の解決→target適用→usage適用→コード同期」の重複を小関数化
  - 冗長分岐の整理
  - 既存ユーティリティ（例：`packages/utils/dom.ts`）の採用検討
- `src/viewer-api-controls.test.ts`
  - テストヘルパー化で重複削減
- `src/demos/shared.ts` / `src/demos/*.ts`
  - `await Promise.all([import(...), ...])` の埋め込みを共通ヘルパー化（挙動維持）
  - `renderApiPanelWrapper()` の呼び出し方を統一して読みやすく
- `scripts/wc/validate-demo-code-block.mjs`
  - 変数名/関数責務の整理（判定条件/出力は維持）
- `scripts/build-pages.cjs`
  - 小さな整理で読みやすく（挙動維持）
- `sw.js`
  - 軽い重複排除（キャッシュ戦略・対象パス判定は維持）
- `docs/knowledge/viewer-api-controls-table.md`
  - 実装とズレがあれば最小限で更新

## 受入基準
- [ ] `npm run test:run` がパスする
- [ ] `npm run type-check` がパスする
- [ ] `npm run lint` がパスする
- [ ] `npm run validate:demo-code-block` がパスする
- [ ] `npm run validate:wc` がパスする
- [ ] `npm run pages:build` がパスする（`scripts/build-pages.cjs` を触った場合）
- [ ] `src/viewer-api-controls.test.ts` の期待スニペット（整形/折りたたみ/slot付与）が変わらない

## リスク / エッジケース
- デモ定義や抽出の変更で `validate:demo-code-block` の検出が壊れるリスク
- `viewer-api-controls` の整形ロジックは出力差分が出やすい（テストで担保しつつ変更は最小限）
- `viewer.html`/`sw.js` は環境差やキャッシュ絡みの再現性が低いので等価変形に限定

## 作業項目（Action items）
1. Planを保存（完了条件: `.codex/plans/` にPlanが残る）
2. `src/viewer-api-controls.ts` を重複削減中心に整理（完了条件: テスト期待を維持して読みやすくなる）
3. `src/viewer-api-controls.test.ts` の重複をヘルパー化（完了条件: テスト内容同等で重複が減る）
4. `src/demos/shared.ts` に module import script の共通ヘルパーを追加し各デモへ適用（完了条件: 重複が減り挙動維持）
5. `scripts/wc/validate-demo-code-block.mjs` を挙動不変で整理（完了条件: 判定条件/出力維持で読みやすくなる）
6. `scripts/build-pages.cjs` / `sw.js` / `viewer.html` / `wc.config.js` を等価変形で整理（完了条件: 変更理由が説明でき検証が通る）
7. 検証コマンドを実行（完了条件: 受入基準のコマンドがすべて成功）
8. 変更点を差分ベースで要約（完了条件: ファイルごとに要点を短く説明できる）

## テスト計画
- `npm run test:run`
- `npm run type-check`
- `npm run lint`
- `npm run validate:demo-code-block`
- `npm run validate:wc`
- `npm run pages:build`（触った場合）
- 最終確認で `npm run ci`

## オープンクエスチョン
- なし

