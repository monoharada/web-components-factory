# code-simplifier: dads-table 追加差分の単純化＋検証（Approved）

Approved: 2026-01-18

## Context
- `/prompts:code-simplifier` に従い、現状の未コミット差分（+ untracked）を中心に「挙動を変えずに」冗長さを減らし、読みやすさと保守性を上げたうえで検証まで行う。

## Scope
- 対象（tracked diff）：`packages/components/index.ts` / `src/demos.ts` / `viewer.html`
- 対象（untracked）：`packages/autoload/dads/table.ts` / `packages/components/table/*` / `.codex/plans/2026-01-17--dads-table-variants.md` / `.codex/plans/2026-01-18--dads-table-dom-sort.md`
- やること：
  - 既存挙動を変えずに、重複・冗長・不要な状態変数・不要な処理を削る（主に `packages/components/table/table.ts`）
  - 既存のファイル/命名/実装パターンに寄せる（特に autoload アダプター）
  - `src/demos.ts` の table デモを、同一HTML出力のまま生成コード化して差分を減らす
  - `type-check` / `test:run` / `build` で検証
- やらないこと：
  - API追加/互換性変更/仕様拡張（例：`.dads-table__sort-button` の新規対応など）
  - 依存追加
  - 大量整形（Prettier全面適用など）

## Simplification candidates（挙動不変の見込みが高いもの）
- `packages/components/table/table.ts`
  - `#getRowCheckboxes()`：`Set` + `isCheckboxInput` の重複を整理し、配列化だけにする
  - `#getSelectAllCheckbox()`：冗長な `?? null` を削除
  - `#parseNumber()`：`replace` 重複を削除
  - `#applyDomSort()`：`#ensureOriginalIndexes` / `#getOriginalIndex` の重複を整理（初回の原順確定ロジックは維持）
  - `#setupResizeObserver()`：分岐を減らして読みやすくする（挙動は同じ）
  - （任意）`#hasScrollListener` の有無チェックを廃して `removeEventListener` を単純化（安全に削れる場合のみ）
- `packages/autoload/dads/table.ts`
  - 既存アダプター（例：`packages/autoload/dads/switch.ts`）と同じ体裁に寄せる
- `src/demos.ts`
  - table デモの固定HTMLを、テンプレート生成関数に分解しつつ “出力HTMLは同一” を維持する

## Action items
1. 承認済みPlanを保存する（完了条件: 本ファイルが存在する）
2. 対象ファイルを確定する（完了条件: `git diff --name-only` と untracked 一覧が Scope と一致）
3. `packages/components/table/table.ts` の低リスク整理（重複排除・状態変数整理）
4. `packages/autoload/dads/table.ts` の体裁を既存に揃える
5. `src/demos.ts` の table デモを生成コード化（HTML出力は同一）
6. 検証（`npm run type-check` / `npm run test:run` / `npm run build`）
7. 結果を code-simplifier 形式で報告（Mode/Scope/Changes/Verification/Notes）

## Test plan
- `npm run type-check`
- `npm run test:run`
- `npm run build`

## Open questions
- （解決済み）`src/demos.ts` の table デモは同一HTML出力のまま生成コード化する

