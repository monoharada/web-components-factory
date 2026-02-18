# 2026-02-17 dads-button icon examples

## Goal
`dads-button` のアイコン利用作例不足を解消し、button 専用デモで参照可能な実例を提供する。

## Non-goals
- `dads-button` の公開API追加
- 既存挙動の変更

## Scope
- `src/demos/showcase-components.ts`
- `packages/components/button/button.test.ts`

## Implementation
1. button 専用デモに以下の作例を追加
   - `icon-start` + ラベル
   - `icon-end` + ラベル
   - icon-only（`aria-label` を必須）
2. テスト追加
   - `icon-start` 表示
   - `icon-end` 表示
   - 空スロット非表示

## Validation
- `npm run validate:wc`
- `npm run agents:verify`

## Definition of Done
- button 専用デモで icon start/end/icon-only の使い方が確認できる
- 上記コマンドが pass する
