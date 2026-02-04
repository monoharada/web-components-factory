# 平均ケース（averageCase）パフォーマンス運用

**最終更新**: 2026-02-04
**タグ**: #performance #workflow #testing #webcomponents

## 対応済み（平均ケースの軽量化と計測基盤）
- `averageCase.html` を平均ケースの代表画面として整備
- `averageCase.runtime.js` で eager/lazy を分離し、`lazy=0` で遅延を無効化して全件即時ロード
- lazy のトリガーは `.avg-form` / `.avg-table` / `.avg-footer` のラッパーを監視（`:not(:defined)` でサイズ 0 になる要素を避ける）
- minify/compress の切替は URL パラメータに統一（`min=1`, `compress=1`）
- `min=1` のとき importmap で specifier を解決し、各モジュールに `?min=1` を付与して minify
- 未定義要素の FOUC は `:where(...):not(:defined)` の明示リストで抑制（ワイルドカードは不可）

## 維持すべき規約（変更時のチェックリスト）
1. `lazy=0` は「遅延無効 = 全件即時ロード」。挙動を逆転させない
2. `min=1` は HTML だけでなく **各モジュールにも適用**。importmap 外の specifier を増やさない
3. `compress=1` は URL パラメータでのみ切替。Referer/Cookie 依存を復活させない
4. `:not(:defined)` で不可視になる要素は IO の監視対象にしない。監視は必ずサイズのあるラッパーへ
5. averageCase にコンポーネントを追加したら以下を更新:
   - importmap
   - `eagerImports` / `lazySpecifiers`
   - `:where(...):not(:defined)` の対象リスト
   - 目標値: `e2e-evidence/average-case.size.spec.ts` の brotli 合計 60KB 以下

## 計測・検証の手順
- 起動: `npm run dev`
- 計測 URL 例: `/averageCase.html?nosw=1&min=1&compress=1&lazy=0`
- 検証基準: `e2e-evidence/average-case.size.spec.ts`
