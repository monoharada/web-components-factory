# Storybook 関連の削除（ローカル Storybook 廃止）Plan

## 目標
- `packages/components/menu-list/menu-list.stories.ts` を含む **ローカル Storybook 関連一式**をリポジトリから削除する。
- コンポーネント追加の「雛形/スキャフォルディング」から Storybook を前提にした記述も除去する。
- `npm run type-check` / `npm run test:run` / `npm run build` が通る状態を維持する。

## 背景
- 現状、各コンポーネントに `.stories.ts` があり、`.storybook/` と `package.json` の Storybook scripts/devDependencies が存在する。
- 要望は「storybook関連はいらないので削除」「スキャフォルディングのルールに書かれているならルールからも除去」。

## スコープ
- やること：
  - `packages/components/menu-list/menu-list.stories.ts` を削除
  - 既存の `packages/components/**/**/*.stories.ts` を全削除（例: button/menu-list-box/select 等）
  - `.storybook/` ディレクトリを削除
  - `package.json` から Storybook scripts（`storybook`, `build-storybook`）と Storybook devDependencies（`@storybook/*`, `storybook`）を削除
  - ロックファイル（`package-lock.json` / `bun.lock`）を更新して Storybook 依存を除去
  - ドキュメント/雛形ルールから Storybook 言及を削除
    - `docs/knowledge/component-skeleton.md`
    - `docs/context/button-design-doc.md`
    - `docs/context/button-implementation-tasks.md`
    - `CLAUDE.md`
- やらないこと：
  - viewer の「Storybook風」UI（API Controls パターン）自体の削除・改名
  - DADS上流リソース調査としての “HTML版 Storybook” 言及（`docs/knowledge/*` や `scripts/dads/*`）の全面削除（ローカル Storybook 廃止とは別物のため）

## 前提 / 制約
- `@storybook/*` を import しているのは `.stories.ts` のみ（プロダクションコードへの影響は小さい見込み）。
- 依存削除に伴いロックファイル差分が大きくなる可能性がある（レビュー負荷・衝突リスク）。
- `npm ci` を前提にするなら `package-lock.json` 更新は必須。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし（Storybookは開発補助であり、配布物のUIには影響しない）

### その他（Docs/Marketing/Infra など）
- ファイル削除（Storybookストーリー）
  - `packages/components/input-text/input-text.stories.ts`
  - `packages/components/radio/radio.stories.ts`
  - `packages/components/accordion/accordion.stories.ts`
  - `packages/components/chip-label/chip-label.stories.ts`
  - `packages/components/checkbox/checkbox.stories.ts`
  - `packages/components/menu-list-box/menu-list-box.stories.ts`
  - `packages/components/textarea/textarea.stories.ts`
  - `packages/components/button/button.stories.ts`
  - `packages/components/table/table.stories.ts`
  - `packages/components/menu-list/menu-list.stories.ts`
  - `packages/components/typography/dads-text.stories.ts`
  - `packages/components/switch/switch.stories.ts`
  - `packages/components/select/select.stories.ts`
- 設定/依存整理
  - `.storybook/` 削除
  - `package.json` から Storybook scripts/devDependencies を削除
  - `tsconfig.json` の `exclude` から `**/*.stories.ts` を削除（Storybook廃止の意思を明確化）
- ドキュメント更新
  - 雛形/タスク/コマンド説明から Storybook 言及を削除 or 置換（viewer デモ手順へ誘導）

## 受入基準
- [ ] `packages/components/menu-list/menu-list.stories.ts` が削除されている
- [ ] リポジトリ内に `**/*.stories.ts` が残っていない
- [ ] `.storybook/` が存在しない
- [ ] `package.json` に `storybook` / `build-storybook` scripts が存在しない
- [ ] `package.json` に `@storybook/*` / `storybook` devDependencies が存在しない
- [ ] `package-lock.json` / `bun.lock` から Storybook 依存が除去されている
- [ ] スキャフォルディング/ドキュメント（雛形）に Storybook が前提として書かれていない
- [ ] `npm run type-check` / `npm run test:run` / `npm run build` が通る

## リスク / エッジケース
- ロックファイル更新差分が大きく、他作業と衝突しやすい
- Storybook を使っていた開発フローがある場合、代替（viewerデモ）への移行説明が必要
- `npm ci` 実行環境で lock mismatch が起きないよう、必ず lock を更新する

## 作業項目（Action items）
1. 削除対象の洗い出し確定（完了条件: `.stories.ts` と `.storybook/` と docs 更新対象が一覧化されている）
2. `.stories.ts` を全削除（完了条件: `find ... -name '*.stories.ts'` が0件）
3. `.storybook/` を削除（完了条件: ディレクトリが存在しない）
4. `package.json` から Storybook scripts/devDependencies を削除（完了条件: Storybook関連の記述が無い）
5. `package-lock.json` / `bun.lock` を更新（完了条件: lock が package.json と整合している）
6. スキャフォルディング/ドキュメントから Storybook 言及を除去（完了条件: ルール/手順に Storybook 前提が残らない）
7. `tsconfig.json` など周辺設定の Storybook 前提を除去（完了条件: `**/*.stories.ts` の除外設定が無い）
8. 検証（完了条件: type-check/test/build が成功し、Storybook script が無いことを確認できる）

## テスト計画
- `npm run type-check`
- `npm run test:run`
- `npm run build`

## オープンクエスチョン
- 該当なし

