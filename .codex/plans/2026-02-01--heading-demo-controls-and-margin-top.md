# Heading Demo Controls Fix + Top Margin Spec（Approved）

## 目標
- Headingデモで `shoulderText` / `iconName` を確実に操作できる（プレビュー/Usageに反映）
- API/Controls から `chip` 単独コントロールを削除し、`preset` に `shoulder+chip` を追加
- `margin` を「上マージンAPI」に置き換えて実装（Figmaの上余白）

## 背景
- 現状は `slot="shoulder"` / `slot="icon"` が存在しないと Controls が効かず、操作不能に見える
- `margin="auto"` は要求の「上余白」と異なる

## スコープ
- やること：
  - デモのプリセット/slot生成ロジック整理
  - `margin` を `none|top` に変更し、Figmaの上余白を再現
- やらないこと：
  - `type` の復活

## 変更内容（案）
### UI / UX
1) shoulderText / iconName をコントローラブルに
- Controls 操作をトリガに、デモ側で必要slot要素を自動生成（or 該当presetへ自動寄せ）
  - `shoulderText` 編集 → `<span slot="shoulder">` を必ず生成
  - `iconName` 変更 → `<svg slot="icon"><path d="..."></path></svg>` を必ず生成
- `data-api-target-selector` を `dads-heading[data-api-target] ...` にスコープして誤爆防止

2) chip Controls削除 + presetに `shoulder+chip`
- `preset` の値を追加：`shoulder-chip`
- `applyPreset()` に `shoulder-chip` 分岐を追加（shoulder slot + chip装飾を同時に作る）
- a11y-annotate側プリセットセレクトも同様に `shoulder-chip` を追加
- 「chip attr は削除」は **デモControlsのchip行（checkbox）だけ削除**（コンポーネントの `chip` 属性は維持）

3) 上マージンAPI（案A）
- `margin` を `none|top` に変更（`auto` 廃止）
- `margin="top"` のときだけ `margin-block-start: var(--dads-heading-margin-block-start)` を付与
- `margin-block-end` は原則 0（上余白に集中）
- デモ「マージン付き作例」を `margin="top"` 前提へ差し替え

### その他
- CEM更新（`margin` の型・説明）
- learnings更新（`margin="top"` の意図とFigma参照）

## 受入基準
- [ ] `preset=default` でも `shoulderText` を触ると shoulder が出る（プレビュー/Usage）
- [ ] `preset=default` でも `iconName` を触ると icon が出る（プレビュー/Usage）
- [ ] Controlsテーブルから `chip` 単独トグルが消える
- [ ] `preset=shoulder+chip` で shoulder+chip だけが出る（iconは出ない、Usageも最小）
- [ ] `margin="top"` がFigma意図の「上余白」として機能する
- [ ] `npm run type-check` / `npm run test:run` が通る

