# Menu List Box フィデリティ検証（7ノード）再開 Plan

## 目標
- いま止まっている `menu-list-box` のフィデリティ検証作業を、ソース上の現状（差分）を前提に“最後まで通せる状態”にする。
- 「比較できていないのに PASS」に見える状態を避け、Figma PNG が揃っている時だけ overlay 証跡を確実に出す。

## 背景
- 既にブランチ上には以下が入っている（未コミット/未整理の状態）:
  - Figma 7ノード用の `resources/dads/components/menu-list-box/figma/config.json`（`8263:19830` は外し、`8263:19832` を採用）
  - Figma 比較用デモ（`src/demos.ts` の `demo-menu-list-box-figma-*`）
  - Playwright の検証・overlay 証跡（`e2e-evidence/menu-list-box.fidelity.spec.ts`）と「画像欠け時は fail」ロジック
  - `playwright.config.ts` の `webServer`、`package.json` の `test:e2e*` スクリプト
  - `resources/dads/components/{menu-list,menu-list-box}/` の DADS 資材生成物（多くが未トラック）
- 一方で `playwright-report/` 等の生成物が未ignoreで残っており、コミット対象の切り分けが未完了。

## スコープ
- やること：
  - 現在の差分を整理して「コミットすべきもの」と「生成物（ignoreすべきもの）」を確定
  - DADS 資材（`resources/dads/**`）と Figma PNG（7ノード）を “validate可能” な形で揃える
  - Playwright E2E を再現可能にし、overlay の gate 条件（token無し→skip / 画像欠け→fail / 揃う→実行）を担保
- やらないこと：
  - `menu-list` / `menu-list-box` の見た目改善そのもの（仕様寄せの追加実装）
  - Figma の “正” の合意なしに、`8263:19830` 相当のノードを推測で差し替える
  - 依存追加や大規模リファクタ

## 前提 / 制約
- 生成物方針は ADR-003（`resources/dads/**` を git 管理）に従う。
- `FIGMA_ACCESS_TOKEN` が無い環境でも E2E は落とさず、overlay だけを `skipped` にする。
- `FIGMA_ACCESS_TOKEN` があるのに PNG が揃わない状態は「比較不能」なので fail 扱いにする。
- 現状ブランチは `monoharada/menu-listbox-ui` で、ターゲットは `main`。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
該当なし（デモ追加は検証用）

### その他（Docs/Marketing/Infra など）
- `playwright-report/` 等の生成物を gitignore し、差分に混ざらないようにする
- `resources/dads/components/{menu-list,menu-list-box}/` と `e2e-evidence/` を正しく git に載せる
- 必要に応じて Playwright reporter（html を使うか）を方針化する

## 受入基準
- [ ] `resources/dads/components/menu-list-box/figma/config.json` の 7ノード方針が合意されている（`19830` 必須かどうか）
- [ ] `npm run dads:validate -- --component menu-list` と `menu-list-box` が通る
- [ ] `npm run test:e2e:menu-list-box` が通る
- [ ] overlay テストは「PNG なし → skipped」「一部欠け → fail（欠け一覧が出る）」「揃い → overlay 添付」を満たす
- [ ] 生成物（例: `playwright-report/`）が差分に混ざらない

## リスク / エッジケース
- `8263:19830` が Figma 上で export 不可のままだと、7ノード“完全一致”の合意が揺れる（代替ノード合意が必須）。
- フォント/AA 差で diff 画像は揺れる（→ overlay は証跡用途、px計測テストと切り分け）。
- `playwright-report/` をコミットしてしまうとリポジトリが肥大化する。

## 作業項目（Action items）
1. 差分の棚卸し（完了条件: コミット対象/非対象のリストができる）
2. `8263:19830` の扱いを確定（完了条件: “必須/不要” が合意され、不要なら現状方針を明文化）
3. （必須の場合のみ）`19830` 代替の FRAME node-id を確定→ `figma/config.json` 更新（完了条件: 対象 node の PNG が取得できる）
4. DADS 資材の validate を実行（完了条件: `npm run dads:validate -- --component menu-list(-box)` が green）
5. E2E の動作確認（完了条件: `npm run type-check` と `npm run test:e2e:menu-list-box` が green）
6. 生成物を gitignore（完了条件: `playwright-report/` 等が `git status` に出なくなる）
7. `resources/dads/components/{menu-list,menu-list-box}/` と `e2e-evidence/` を git 管理に載せる（完了条件: 追跡ファイルが揃い、再現手順が崩れない）
8. PR 作成準備（完了条件: ブランチが clean で、`main` 向けの差分説明が書ける）

## テスト計画
- `npm run dads:validate -- --component menu-list`
- `npm run dads:validate -- --component menu-list-box`
- `npm run type-check`
- `npm run test:e2e:menu-list-box`
- （任意）`npm run test:run`（既存ユニットテストの回帰確認）

## オープンクエスチョン
1) `8263:19830` は 7ノード baseline として必須にしますか？（必須なら、export 可能な同等 FRAME の node-id を提示してほしいです）
2) Playwright の添付（overlay/diff）を “HTMLレポートで閲覧する運用” にしますか？（するなら reporter 方針を決めたいです）

