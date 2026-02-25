# 2026-02-25 dads-tab postflight（キーボードモデル維持 + focus ring 角丸トークン）

## Context
- Feature: `dads-tab` のキーボードモデルを現状維持（Tab 巡回 + Enter で tabpanel へフォーカス移動）しつつ、focus ring の角丸をトークン化して一貫性を確保する。
- Date: 2026-02-25
- Scope: `packages/components/tab/**`, `docs/knowledge/a11y-annotations.json`, `custom-elements.json`, `docs/llms/tab.md`, `llms-full.txt`

## What Worked
- キーボード挙動（Tab/Arrow/Home/End, auto/manual, Enter/Space）に合わせて a11y 注釈を更新し、CEM/LLM docs まで同期できた。
- `--dads-tab-focus-border-radius` を追加し、`[part~="tab"]:focus-visible` と `::slotted([part~="tabpanel"]:focus-visible)` の角丸を揃えられた。
- focus ring の色/幅/offset は `--dads-focus-*` を使用して直値を避け、テーマ互換を維持できた。

## What Blocked Progress
- `npm run agents:pre-pr` の `check-generated-clean` は `custom-elements.json` / `registry/install-registry.json` が HEAD と一致していないと失敗するため、生成物変更を含む場合は「コミット → verify」の順序が必要。

## Root Causes
- キーボードモデルとドキュメント（a11y annotations / CEM / llms）がズレると、利用者・AI の両方に誤情報が残りやすい。
- focus ring は複数要素（tab / tabpanel）にまたがるため、角丸の単一ソースがないと視覚的一貫性が崩れやすい。

## New Rules
- Rule: `dads-tab` のキーボードモデル変更時は `docs/knowledge/a11y-annotations.json` の `dads-tab.categories.keyboard` を同時更新し、`npm run cem:analyze` と `npm run llms:generate` の結果を同PRに含める。
  - Rationale: 利用者向け注釈と AI 向け参照（CEM/LLM）を常に一致させるため。
  - Example: `docs/knowledge/a11y-annotations.json`, `custom-elements.json`, `docs/llms/tab.md`, `llms-full.txt`
- Rule: focus ring の見た目（色/幅/offset）は `--dads-focus-*` と `--dads-tab-focus-border-radius` で定義し、`rgb()/rgba()/#hex` の直値を置かない。
  - Rationale: テーマ差し替え互換と一貫性を担保するため。
  - Example: `packages/components/tab/tab-styles.ts`

## Next Time Checklist
- [ ] タブと tabpanel の focus-visible が同じ角丸で表示される
- [ ] `rg -n "rgb\\(|rgba\\(|#[0-9a-fA-F]{3,8}" packages/components/tab` が0件
- [ ] `npm run cem:analyze` / `npm run llms:generate` 実行後に generated clean
- [ ] `npm run validate:wc` / `npm run test:run -- packages/components/tab/tab.test.ts` が通る
