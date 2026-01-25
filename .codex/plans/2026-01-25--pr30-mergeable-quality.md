# PR #30 マージ可能な品質対応（指摘 #1〜#5）Plan

## 目標
- PR #30 の指摘 #1〜#5 を全て解消し、挙動を壊さずにマージ可能な品質まで引き上げる。

## 背景
- 現状の `dads-menu-list-item` は、子階層の `dads-menu-list` を **親要素の子として内包**し、`slot="children"` に自動配置する設計。
- ただし “current の親” 判定 CSS が `:has(+ * [current])`（隣接兄弟前提）になっており、入れ子構造では発火しない可能性がある。
- 追加で、スタイル/実装の整形・E2Eのフレーク要因・document listener の常時購読・href ポリシー/ログなどの改善余地がある。

## スコープ
- やること：
  - (#1) `:has()` を使い、入れ子（子リスト）を正として “current の親” 判定を成立させる（兄弟構造も併記サポート）
  - (#2) `menu-list.ts` のインデント崩れを修正（ロジックは変えない）
  - (#3) `menu-list-box` の document listener を open 中だけ購読するようにしてオーバーヘッドを抑える
  - (#4) E2E の `waitForTimeout(100)` を削除し、状態反映待ちに置換して安定化
  - (#5) href の許可スキームに `mailto:` / `tel:` を追加し、ブロック時の `console.warn` は削除（安全性は維持）
- やらないこと：
  - `:has()` のフォールバック実装（不要）
  - 破壊的API変更（属性/イベント/slot の大変更）

## 前提 / 制約
- CSS/セレクタ設計変更は `css-writing-rules` を優先。
- コンポーネントAPI設計は `headless-component-design` を適用。
- 差分は最小限・レビューしやすく（不要なリネーム/大規模整形を避ける）。
- 承認（2026-01-25）:
  - `main` 最新（`5b6e306`）の取り込みをマージ前に必須とする
  - E2E（Playwright）は今回は不要とする

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
1) (#1) `packages/components/menu-list/menu-list-styles.ts`
- 入れ子構造向け `:has(> [slot="children"] [current])` を追加し、兄弟構造向け `:has(+ * [current])` も併記でサポートする。

2) (#2) `packages/components/menu-list/menu-list.ts`
- タブ/スペース混在などのインデント崩れを修正（挙動差分なし）。

3) (#3) `packages/components/menu-list-box/menu-list-box.ts`
- `document` の `click/keydown/focusin` を open 中のみ subscribe する。
- close 時は購読解除し、必要最小限のリスナーにする。

4) (#4) `e2e-evidence/menu-list-box.fidelity.spec.ts`
- hover 反映待ちの `waitForTimeout(100)` を削除し、`waitForFunction` 等で期待状態を待つ。
- `waitForTimeout(0)` も必要性を再評価し、置換できるなら置換する。

5) (#5) `packages/components/menu-list/menu-list.ts` / `packages/components/menu-list/menu-list.test.ts`
- href allowlist に `mailto:` / `tel:` を追加する。
- ブロック時の `console.warn` を削除し、テストも追従する。

### その他（Docs/Marketing/Infra など）
- 必要なら docs に href ポリシーを最小限追記（任意）。

## 受入基準
- [ ] “current の親” スタイルが入れ子（子リスト）で成立し、兄弟構造も破壊しない。
- [ ] `menu-list.ts` のインデントが整い、ロジック差分がない。
- [ ] `menu-list-box` が open 中のみ document listener を購読し、外側クリック/Escape/focus移動が回帰しない。
- [ ] E2E の `waitForTimeout(100)` が削除され、待ちが時間依存でなくなる。
- [ ] href が `mailto:` / `tel:` を許可し、`javascript:` は引き続きブロックされる（テストで担保）。
- [ ] `npm run type-check` / `npm run test:run` / `npm run build` が成功する。

## リスク / エッジケース
- `:has()` の条件が広すぎると意図しない要素に当たる可能性があるため、selector を絞る。
- document listener を open 中のみへ変更すると、close トリガーの取りこぼしが起き得る（テストでカバー）。
- hover の反映待ちはブラウザ差があるため、待ち条件の選定が重要。

## 作業項目（Action items）
1. Plan を保存（完了条件: `.codex/plans/` に承認済みPlanが存在）
2. (#1) `menu-list-styles.ts` の `:has()` セレクタを修正（完了条件: 入れ子 + 兄弟の両方で成立）
3. (#2) `menu-list.ts` のインデント修正（完了条件: 差分が読みやすく挙動差分なし）
4. (#3) `menu-list-box.ts` の document listener を open 中だけに（完了条件: 回帰なくテストが通る）
5. (#4) E2E の待ちを安定化（完了条件: `waitForTimeout(100)` が消える）
6. (#5) href allowlist と warn 削除 + テスト更新（完了条件: `mailto/tel` 許可、`javascript:` ブロック維持）
7. 検証（完了条件: `type-check` / `test:run` / `build` 成功）
8. commit & push（完了条件: ブランチに反映）

## テスト計画
- `npm run type-check`
- `npm run test:run`
- `npm run build`
- （任意）`npm run test:e2e:menu-list-box`

## オープンクエスチョン
- 該当なし（#1/#5 は合意済み）
