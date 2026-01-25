# a11y-annotate：パネルの縦余白/行間をDADS寄せで改善

## 目標
`a11y-annotate` の注釈パネル（右側）で、フォントサイズを `1rem` に上げた結果「縦余白が詰まって見える」状態を解消し、**DADSのリズム（最小8px刻み + 本文line-height）に寄せた余白/行間**へ調整する。

## 背景
- 現状のパネル内は `gap: 4px/6px/12px` 等が多く、`font-size: 1rem` 化後に相対的に詰まって見える（添付スクショの「アノテーション一覧」「スナップショット」「カテゴリ本文/箇条書き」あたり）。
- 余白と行間をトークン化して、後から微調整できるようにしておくのが安全。

## スコープ
- やること：
  - `packages/components/annotate/annotate.ts` のCSSで、パネル内の **縦方向の gap / padding / line-height** を調整
  - 余白系もトークン（既存 `--spacing-*` / `--line-height-*`）参照に統一し、`a11y-annotate` ローカルトークンで集約
- やらないこと：
  - プレビュー側（左側）や `dads-table` 本体の余白設計変更
  - 全体のスペーシングトークン体系の変更

## 前提 / 制約
- 余白は「DADSの基準に寄せる」方針で、まず **1段階だけ広げる**（例: 4→8, 6→8/12, 12→16）
- 行間は本文系を `--line-height-170`（なければ1.7）寄せを優先（見出しは現状維持でも可）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
`a11y-annotate` に“縦リズム”用トークンを追加し、パネル内で参照する。

- 追加するローカルトークン（例）
  - `--a11y-annotate-space-xs: var(--spacing-2, 8px);`
  - `--a11y-annotate-space-sm: var(--spacing-3, 12px);`
  - `--a11y-annotate-space-md: var(--spacing-4, 16px);`
  - `--a11y-annotate-body-line-height: var(--line-height-170, 1.7);`
- 適用箇所（候補）
  - `[part="panel-body"]` の `padding` と `gap` を `md` 寄せ（例: 12→16）
  - `section` の `gap` を `xs` 寄せ（例: 6→8）
  - `section > ul` の `gap` を `xs` 寄せ（例: 4→8）＋必要なら `line-height` を `--a11y-annotate-body-line-height`
  - `.callout-list` の `gap` を `sm` 寄せ（例: 6→12）
  - `.callout-text` の `gap` を `xs` 寄せ（例: 4→8）
  - `.snapshot` は `line-height` を本文寄せ、必要なら `padding-block` を微増（ただし増やしすぎない）

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] 添付スクショ範囲で「縦余白が詰まってる」印象が解消される（一覧・スナップショット・カテゴリ本文/箇条書き）
- [ ] 余白/行間はトークン参照（`--spacing-*` / `--line-height-*`、または `--a11y-annotate-*` ローカルトークン経由）
- [ ] 余白増による崩れ（段落の不自然な間延び、スナップショット枠の過剰な肥大、ヘッダーの折返し悪化）がない
- [ ] `npm run test:run` が通る

## リスク / エッジケース
- 余白増でパネルが長くなりスクロール量が増える
- バッジ折返しや、狭い幅での見出しの回り込みが悪化する可能性（必要なら `gap` を調整）
- “どこまで広げるか”が主観に寄る（まず1段階アップ→必要なら再微調整）

## 作業項目（Action items）
1. 詰まり箇所の特定（完了条件: 変更対象セレクタを確定）
2. 余白/行間トークン設計（完了条件: `--a11y-annotate-space-*` と `--a11y-annotate-body-line-height` を決定）
3. パネル全体の余白調整（完了条件: `panel-body` / `section` の縦リズムが改善）
4. 注釈一覧の余白調整（完了条件: `.callout-list/.callout-text` が読みやすい間隔に）
5. スナップショット/箇条書きの行間調整（完了条件: 読みやすく、間延びしない）
6. 目視確認（完了条件: viewerでスクショ相当の状態が改善）
7. 自動テスト（完了条件: `npm run test:run` が成功）

## テスト計画
- 手動: `npm run dev` → `a11y-annotate`（textareaの注釈など）でパネルの余白感を確認
- 自動: `npm run test:run`

## オープンクエスチョン
該当なし

