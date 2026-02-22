# 2026-02-21 combobox demo alignment plan

## Status
- Phase: Implementation
- Approved: YES (`APPROVE PLAN`)
- Constraints:
  - `behavior="input"` のデモは single 限定
  - Open Question 2（旧URL案内）は対応不要

## Scope
1. `?component=combobox-input` を削除する
2. `?component=combobox` の冒頭説明文を現仕様に合わせる
3. `combobox` にアクセシビリティ注釈を追加・補強する

## Files
- `viewer.html`
- `src/demos/showcase-form.ts`
- `docs/knowledge/a11y-annotations.json`（必要に応じて追加）
- `custom-elements.json`（`cem:analyze` 実行時）

## Validation
- `npm run cem:analyze`（注釈メタデータ反映）
- `npm run validate:wc`
