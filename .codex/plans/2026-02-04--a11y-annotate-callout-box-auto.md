# a11y-annotate：点線の囲い枠をやめ、線で指し示す（コンテナのみ自動で枠）

## Goal

- `a11y-annotate` の点線枠（`.callout-box`）を通常は表示せず、指し示しは線（`.callout-line`）主体にする
- ただし「コンテナを指し示す必要がある」場合は枠を表示できるようにする（自動判定＋明示上書き）

## Decisions

- 枠表示の既定は **auto**
  - `targetEl` が他の callout の `targetEl` を DOM 的に包含している場合のみ枠を表示する
- 明示上書きのために `A11yCallout.targetHint?: 'auto' | 'box' | 'none'` を追加
  - `box`: 常に枠を表示
  - `none`: 常に枠を非表示
  - `auto` / 未指定: 自動判定
- 既存の `docs/knowledge/a11y-annotations.json` は変更しない（auto で動作）

## Scope

- 変更: `packages/utils/a11y-annotations.ts`
- 変更: `packages/components/annotate/annotate.ts`
- 変更: `packages/components/annotate/annotate.test.ts`
- ドキュメント更新は任意（今回は必須にしない）

## Verification

- `npm test` が PASS
- 手動: `npm run dev` で `a11y-annotate` のデモを確認（細部が枠で囲われない / コンテナのみ枠が出る）

