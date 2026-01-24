# Menu List Box 最終反映 + コンポーネント雛形ドキュメント（Knowledge）Plan

## 目標
- PRに入る差分を最終状態（worktree）に揃える（stagedの取りこぼし/ズレを無くす）
- `/?component=menuListBox` で a11y-annotate が安定表示し、callout が最低1つ以上表示される
- `menuListBox` の CSS vars が `data-api-css-var` で編集可能で、Resetで戻る
- `menuListBoxFidelity` のE2E参照ID維持、E2Eが通る（Figma overlayは条件付きskip可）
- `resources/dads/**` の差分がPRに入っていない状態を維持
- 雛形ドキュメントを `docs/knowledge/component-skeleton.md` として作成する
- `.codex/plans/` はPRに含める

## スコープ
- やること：
  - staged/worktree差分の棚卸し → indexを最終状態に揃える
  - `src/demos.ts` / `viewer.html` / `packages/components/menu-list-box/*` / `e2e-evidence/*` の最終版をステージ
  - `resources/dads/**` の今回差分はPRから除外（必要なら巻き戻し）
  - `docs/knowledge/component-skeleton.md` を新規作成（必要なら `docs/knowledge/README.md` に追記）
  - `.codex/plans/*.md` をステージ
- やらないこと：
  - `dads-menu-list-box` の公開API（attr/prop/event/slot）追加
  - `resources/dads/**` の同期運用をこのPRに含める
  - 大規模リファクタ

## 受入基準
- [ ] staged/worktreeのズレが解消され、PRに「最終状態」が入る
- [ ] `resources/dads/**` がPRに含まれない
- [ ] `/?component=menuListBox` で a11y-annotate が安定表示し、calloutが1つ以上表示される
- [ ] CSS varsが編集可能でResetで復帰できる
- [ ] `/?component=menuListBoxFidelity` のE2E参照IDが維持される
- [ ] `docs/knowledge/component-skeleton.md` が追加される
- [ ] `.codex/plans/` がPRに含まれる
- [ ] `npm run type-check` / `npm test` / `npm run test:e2e:menu-list-box` が通る（Figma overlayは条件付きskip可）

## テスト計画
- `npm run type-check`
- `npm test`
- `npm run test:e2e:menu-list-box`
- 手動: `bun server.ts` → `/?component=menuListBox` / `/?component=menuListBoxFidelity`

