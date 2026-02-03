---
name: card-example-5-wrapper
status: approved
---

# カード作例5（ラッパー幅・ボタン色・リンク領域）調整プラン

## 目標
- 作例5（横レイアウト時）のラッパー幅を最大 940px に制限して見た目を整える
- 作例5のボタン配色をDADS作例に合わせ、hover/activeも揃える
- 見出しリンクのクリック領域をタイトル幅全体にする

## 背景
- 横レイアウトの見た目がまだ「変」に見えるため、横幅を制限して情報密度を調整したい
- ボタン配色がDADS作例と異なるため一致させたい
- 見出しリンクはテキストだけでなくブロック全体をリンク領域にしたい

## スコープ
- やること：
  - `.card-example-5-list` に横レイアウト時だけ `max-width: 940px` と中央揃えを適用
  - 作例5の `dads-button` に対して、DADS作例に合わせた色トークンを上書き（hover/active含む）
  - 見出しリンクをブロック化してクリック領域を拡張
  - VRT更新
- やらないこと：
  - `dads-button` / `dads-card` 本体の仕様変更
  - 作例5以外のスタイル変更

## 前提 / 制約
- 変更対象は `src/demos/showcase-components.ts` の作例5セクションのみ
- ボタン配色はDADS作例の見た目を優先し、プリミティブトークンを使用して上書き
- CSSは `css-writing-rules` に準拠

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 横レイアウト時のみ `.card-example-5-list` に `max-width: 940px; width: 100%; margin-inline: auto;` を追加
- `.card-example-5__title a` を `display: block; width: 100%;` にしてリンク領域を拡張
- `.card-example-5__actions` 配下の `dads-button` に以下のようなトークン上書きを適用
  - outlined: 枠線/文字色/hover/active色
  - solid: 背景/文字色/hover/active色
  - DADSプリミティブカラーから選定

### その他（Docs/Marketing/Infra など）
- VRT更新

## 受入基準
- [ ] 横レイアウト時のみ `.card-example-5-list` が最大 940px で中央揃え
- [ ] 見出しリンクがタイトル幅全体に広がる
- [ ] ボタン配色（通常/hover/active）がDADS作例に一致
- [ ] VRTがグリーン

## リスク / エッジケース
- 画面幅が狭い場合に 940px 制限の影響が不明確になる可能性
- ボタン色上書きが既存トークンと競合する可能性

## 作業項目（Action items）
1. 作例5のCSS構造を確認（完了条件: 変更対象クラスとボタンスコープを特定）
2. 横レイアウト用の `max-width: 940px` を追加（完了条件: 横レイアウト時のみ中央揃えで制限）
3. 見出しリンクのブロック化を適用（完了条件: クリック領域がタイトル幅全体）
4. ボタンの色トークン上書きを追加（完了条件: 通常/hover/activeがDADS作例一致）
5. VRT更新（完了条件: スナップショット更新）
6. VRT実行（完了条件: テストグリーン）

## テスト計画
- 目視: `/?component=card` で横レイアウト時の幅制限/ボタン色/リンク領域を確認
- VRT: `npm run test:e2e -- e2e-evidence/card.example-5.vrt.spec.ts`

## オープンクエスチョン
- なし
