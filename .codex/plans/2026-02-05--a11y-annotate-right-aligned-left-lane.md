# a11y-annotate：右寄せコンポーネントは左レーン固定＋距離（+24〜40px）調整

## Summary
- 右寄せ（右に寄って配置されている）コンポーネントでは、注釈ラベルを右に出すと窮屈/見づらいので自動で左レーンに寄せる。
- ラベルとコンポーネントの距離は、現状より +24〜40px 程度離す（デフォルト見直し）。
- 既存の改善（focusRect基準レーン、中心寄り終点、containerのみ枠auto、`targetHint`）は維持する。

## Decisions
- 右寄せ判定は「`preview-inner` 内での `#target` の余白」で行う。
  - `spaceLeft = targetRect.left - previewInnerRect.left`
  - `spaceRight = previewInnerRect.right - targetRect.right`
  - `isRightAligned = (spaceLeft - spaceRight) >= 80 && spaceLeft >= spaceRight * 2`
- `isRightAligned` の場合、placement 指定も含めて **left-only**（全 callout を左レーン）に倒す。
- lane offset のデフォルトは `--spacing-14`（56px）を採用。
- タグ位置の clamp は viewport 基準に切り替え、画面端で潰れるのを防ぐ。

## Files
- `packages/components/annotate/annotate.ts`
- `packages/components/annotate/annotate.test.ts`

## Verification
- `npm test`
- `npm run dev` で `src/demos/showcase-date.ts`（calendar/date-picker）と `src/demos/heading.ts` を目視確認
