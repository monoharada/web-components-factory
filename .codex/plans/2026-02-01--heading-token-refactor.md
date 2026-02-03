# Heading Tokens Refactor（calc排除 + size別再代入方式）

## 目標
`packages/components/heading/heading-tokens.ts` のトークン設計を、DADS流儀（グローバルトークン代入 + size別の変数再代入）に揃え、`--heading-*-57` のような “無限に増える” トークン定義を廃止する。

## 背景
現状は `--heading-icon-size-57: calc(64 / 16 * 1rem);` のように、component側で実質ハードコード（数値+calc）になっており、サイズ展開のたびに `-64/-57/...` 系のトークンが増えて破綻する。

## スコープ
- やること：
  - `heading-tokens.ts` を「ベース変数 + size属性での再代入」へ再設計
  - 既存の heading CSS / demo / テスト（特に `packages/components/heading/heading.test.ts`）の追従修正
  - `cem:analyze` / `validate:wc` / `test` / `e2e` で回帰なしを確認
- やらないこと：
  - 仕様変更（見た目の大幅変更、API変更）はしない（必要なら別Plan）
  - グローバルトークン（design-tokens/spacing-tokens）の増設は原則しない（必要なら別議論）

## 前提 / 制約
- CSS設計は `.claude/skills/css-writing-rules` を最優先（変数再代入・グローバルトークン参照）
- トークン構造は `.claude/skills/headless-component-design` の3層（Primitive→Semantic→Local）を維持
- 既存の表示（Figma準拠の寸法）を極力維持

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 該当なし（見た目は維持する想定）

### その他（Docs/Marketing/Infra など）
- `packages/components/heading/heading-tokens.ts`
  - `--heading-font-size-64` / `--heading-icon-size-57` のような “suffix付きトークン群” を削除
  - ベースのsemantic tokenを `--heading-font-size` のように1本化
  - `:host([size='57']) { --heading-font-size: var(--font-size-57); }` の形式で size別再代入
  - icon/padding/gap なども同様にベース変数へ集約し、size別の無限増殖を止める
  - px→rem の `calc(64 / 16 * 1rem)` を撤廃し、可能な限り `var(--font-size-*)` / `var(--spacing-*)` を代入
- テスト更新
  - `packages/components/heading/heading.test.ts` の “古いトークン名を含むこと” 前提のアサーションを新設計に合わせて更新
- ドキュメント
  - `docs/knowledge/learnings.md` に今回の方針を追記

## 受入基準
- [ ] `packages/components/heading/heading-tokens.ts` から suffix付きトークン群が削除されている
- [ ] `heading-tokens.ts` に px→rem の数値直書きcalcが存在しない
- [ ] `:host([size='xx']) { --heading-*: var(--font-size-xx|spacing-xx|line-height-xx); }` 形式で size別再代入になっている
- [ ] `npm run type-check` / `npm run test:run` / `npm run test:e2e -- e2e-evidence/heading.controls.spec.ts` が通る
- [ ] `npm run validate:wc` が通る
- [ ] `npm run cem:analyze` 後に `custom-elements.json` が最新化されている

## リスク / エッジケース
- chip幅などに小数pxがあり、既存のspacing/font-sizeトークンだけでは厳密表現が難しい
- 既存テストが “トークン名の存在” に依存しているため、追従修正が必須
- token整理で見た目が微妙にズレる可能性（特に icon / chip）

## 作業項目（Action items）
1. 現行 `heading-tokens.ts` を分解（完了条件: suffix付きトークンの削除方針が確定）
2. `heading-tokens.ts` を新設計に置換（完了条件: ベース `--heading-*` と `:host([size])` 再代入のみで表現）
3. icon系をグローバルトークン参照に寄せる（完了条件: px→rem の数値直書きcalcが残っていない）
4. chip系を整理（完了条件: トークン増殖を止めつつ、サイズ追従が担保される）
5. `heading.test.ts` を追従（完了条件: 単体テストが通る）
6. `validate:wc` 確認（完了条件: validateが通る）
7. `cem:analyze` 実行（完了条件: CEM差分が最新化）
8. `type-check` / `test:run` / `test:e2e`（完了条件: 全てpass）
9. learnings 更新（完了条件: ナレッジが再利用可能）

## テスト計画
- 単体: `npm run test:run`（headingテスト含む）
- E2E: `npm run test:e2e -- e2e-evidence/heading.controls.spec.ts`
- 型: `npm run type-check`
- マークアップ: `npm run validate:wc`
- CEM: `npm run cem:analyze`

