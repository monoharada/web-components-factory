# Menu List Box（メニューコンテナ内部）Figma再現度調整 Plan

## 目標
`dads-menu-list-box` の **popup（メニューコンテナ）内部** を、Figma 参照（`8263-19774` / `8263-19830` / `8263-19815`）に近づける（主に区切り線・divider 表現）。

## 背景
- `src/demos.ts` と `packages/components/menu-list-box/menu-list-box.stories.ts` に Figma参照のデモがあり、現状は「メニューコンテナの中」の見た目がFigmaとズレている。
- 現在の `dads-menu-list-box` は divider の余白/幅が Figma と合っていない可能性が高い。

## スコープ
- やること：
  - `dads-menu-list-box` の popup 内の **item divider（各行の区切り線）** と **category divider（グルーピングのdivider）** の見た目を調整
  - トークン/スタイルを DADS + 既存トークン設計（Semantic → Local `--dads-*`）に沿って修正
- やらないこと：
  - 開閉/キーボード操作など挙動の変更
  - `dads-menu-list-item` のAPI変更（必要になったら再Plan）

## 前提 / 制約
- `.claude/skills/css-writing-rules` と `.claude/skills/headless-component-design` を遵守（!important禁止、状態は属性、色はグローバルトークン、変数再代入中心）。
- 変更は最小限（不要なリネーム/整形なし）。
- Figmaの元ファイルURL/トークンが無い前提で、添付画像と既存デモ（Storybook/`src/demos.ts`）で目視確認する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `packages/components/menu-list-box/menu-list-box-styles.ts`
  - `data-menu-list-box-divider` の横幅を full width に寄せる（左右marginの撤廃）
  - divider の線色/太さを item divider と馴染むように調整（Figma `8263-19815` の“太めライン”を再現）

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] `src/demos.ts` の以下3つが、添付Figma画像と同等の区切り線表現になっている
  - Start icon items（`8263-19774`）
  - Start icon + description（`8263-19830`）
  - Category + divider（`8263-19815`）
- [ ] popup内の各アイテム間に（必要なケースで）区切り線が出る（最後のアイテムは不要な線が残らない）
- [ ] category divider が full width で、Figmaの区切り表現に近い
- [ ] `npm run type-check` と `npm run test:run` が通る

## リスク / エッジケース
- divider の“太さ”は Figma の表現（単線か、細線の重なりか）により最適解が変わる。
- スクロールバー見た目はOS/ブラウザ差が大きい。

## 作業項目（Action items）
1. Plan保存（完了条件: `.codex/plans/` に承認済みPlanが保存されている）
2. 現状確認（完了条件: Storybookと`src/demos.ts`で差分ポイントを箇条書きにできている）
3. divider 調整（完了条件: popup内の区切り線表現がFigmaに近い）
4. 回帰確認（完了条件: `npm run type-check` / `npm run test:run` がgreen）

## テスト計画
- 自動: `npm run type-check`, `npm run test:run`
- 手動: `npm run storybook` で該当ストーリー（Start icon / Start icon + description / Category + divider / Scrollable）を目視確認

## オープンクエスチョン
なし（承認済みのため実装を優先し、差が大きい場合のみ再Planします）

