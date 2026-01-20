# Storybook除去 & viewer.htmlメイン化

## 目標
Storybook（依存・設定・起動導線）をリポジトリから除去し、開発時の確認手段を `viewer.html`（`bun server.ts`）に一本化する。

## 背景
- 現状は `viewer.html` + `server.ts`（Bun）が主要ビューアだが、`package.json` には Storybook scripts/devDependencies と `.storybook/` が残っている。
- `package.json` の `dev` が `vite` になっており、実運用の「メイン」が分散している。

## スコープ
- やること：
  - `package.json` から Storybook scripts/devDependencies を削除
  - `.storybook/` を削除
  - `npm run dev` を `bun server.ts`（viewer）に寄せる（必要なら `vite` は別名scriptに退避）
  - Storybook 前提のドキュメント（最小）を viewer 前提に更新
  - lockfile を更新し、CI相当の検証を通す
  - `*.stories.ts`（Storybook stories）を全削除
- やらないこと：
  - コンポーネント実装/API の挙動変更
  - DADS リソース同期（`scripts/dads/*`）の仕様変更
  - viewer.html の大幅なUI改修

## 前提 / 制約
- ビューアのメイン導線は `bun server.ts`（`/` → `viewer.html`）を維持する。
- ビルド/テスト（`npm run ci`）は現状のまま通す。
- `package-lock.json` と `bun.lock` はリポジトリ管理されているため、依存削除に伴い更新する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- “メインで表示するもの” を `viewer.html` に統一（起動コマンドのデフォルトを viewer に寄せる）

### その他（Docs/Marketing/Infra など）
- `package.json`
  - scripts: `storybook` / `build-storybook` を削除
  - scripts: `dev` を `bun server.ts` に変更し、必要なら `vite` を `dev:vite` 等に退避
  - devDependencies: `storybook` および `@storybook/*` を削除
- 削除: `.storybook/`
- docs: Storybook起動前提の箇所を viewer 前提に差し替え（最小）
- lockfiles: Storybook関連が消える状態に更新

## 受入基準
- [ ] `npm run dev` で `bun server.ts` が起動し、`http://localhost:3000/` で `viewer.html` が表示される
- [ ] `package.json` から `storybook` / `@storybook/*` が消えている
- [ ] `.storybook/` がリポジトリから削除されている
- [ ] Storybook起動を求める docs の導線が viewer に更新されている（少なくとも `docs/context/button-implementation-tasks.md`）
- [ ] `*.stories.ts` がリポジトリから削除されている
- [ ] `npm run ci` が通る
- [ ] `npm run pages:build` が通る

## リスク / エッジケース
- `*.stories.ts` を削除すると、Storybook内に書かれていたドキュメント文字列（説明markdown）が消える
- lockfile差分が大きくなりレビューしづらい（依存削除に伴う不可避の変更）

## 作業項目（Action items）
1. `package.json` の scripts から `storybook` / `build-storybook` を削除（完了条件: `npm run storybook` が存在しない）
2. `package.json` の `dev` を `bun server.ts` に変更し、必要なら `vite` を `dev:vite` 等に退避（完了条件: `npm run dev` で viewer が開ける）
3. `package.json` の devDependencies から `storybook` / `@storybook/*` を削除（完了条件: `rg \"@storybook|\\\"storybook\\\"\" package.json` がヒットしない）
4. `.storybook/` を削除（完了条件: ディレクトリが消えている）
5. `*.stories.ts` を全削除（完了条件: `rg --files | rg \"\\.stories\\.\"` が空）
6. Storybook言及のある docs を viewer 前提に更新（完了条件: `docs/context/button-implementation-tasks.md` から `npm run storybook` が消え、viewer確認手順に置換されている）
7. lockfile更新（`package-lock.json` / `bun.lock`）（完了条件: Storybook関連が lock から消え、`npm ci` が成立する状態）
8. 検証（完了条件: `npm run ci` と `npm run pages:build` が成功する）

## テスト計画
- 依存/導線確認: `npm run dev` → `http://localhost:3000/` 表示
- 自動検証: `npm run ci` / `npm run pages:build`

## 承認
- 2026-01-20: APPROVE PLAN（Storybook関連はすべて削除）

