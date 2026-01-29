# Card: DADS「カード作例1」をデモに追加

## 目標
`https://design.digital.go.jp/dads/html/?path=/docs/components-%E3%82%AB%E3%83%BC%E3%83%89--docs#%E3%82%AB%E3%83%BC%E3%83%89%E4%BD%9C%E4%BE%8B-1` の「作例1」（3枚カード：機内サービス/乗り継ぎサポート/機内持ち込み手荷物検査）を、このリポジトリのカードデモに追加する。

## 背景
ローカル資材として、DADS HTML Storybook の作例1 HTML と CSS が既に `resources/dads/components/card/` 配下に存在しており、同等の見た目をデモ側で再現できるため。
- HTML: `resources/dads/components/card/storybook/html/story--example-1--4d3f6edf.html`
- CSS: `resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/card-example-1.css`

## スコープ
- やること：
  - `src/demos/showcase-components.ts` の `card` デモに「作例1」セクションを追加
  - `<dads-card>` を使って作例1のレイアウト/見た目（グラデ＋SVG・メインの重なり・横並び折返し）を再現
- やらないこと：
  - `dads-card` 本体（`packages/components/card/*`）の仕様/API変更
  - CEM 生成物の更新（必要になった場合は別途相談）

## 前提 / 制約
- 作例1は上流の “作例CSS” をそのまま移植するのではなく、`dads-card` の `slot` と `::part()` カスタマイズで再現する（`docs/knowledge/dads-card-analysis.md` の方針に合わせる）。
- デモ内のスタイルは影響範囲を作例セクションに限定する（クラスでスコープ）。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `src/demos/showcase-components.ts` の `card: () =>` 内に「カード作例1」セクションを追加
- 3枚の `<dads-card>` を `flex-wrap` + `gap` で並べ、上流と同等に 352px 幅で折り返す
- `slot="media"` に作例1の SVG（飛行機/ピン/スーツケース）を配置し、背景は `::part(media-body)` でグラデーションを付与
- `::part(main)` に `margin-top: -24px` 等を適用し、上流同様にメイン領域を画像に重ねる
- “カード面クリック” は各タイトルリンクに `data-dads-card-primary` + `data-dads-card-delegate` を付与して再現

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] `viewer.html` から Card デモを開くと「作例1」セクションが表示される
- [ ] 3枚のカードが 2列→折り返しで並び、上流作例1と同じ文言・SVGが表示される
- [ ] 各カードは pointer でカード面クリックが主リンクへ委譲される（`data-dads-card-delegate`）
- [ ] `npm run validate:wc` が成功する

## リスク / エッジケース
- `::part()` での見た目再現が、`dads-card` デフォルトスタイル（border/background/overflow）と干渉する可能性（必要なら該当カードだけ CSS vars で base border を無効化）
- `margin-top` による重なりが `overflow: clip` と相性悪い場合がある（必要なら該当作例カードのみ `::part(base){ overflow: visible; }` 等で調整）

## 作業項目（Action items）
1. 上流の作例1 HTML/CSS を確認し、必要な値（幅/余白/色/重なり量/SVG）を抜き出す（完了条件: デモ実装に必要なスタイル差分が決まっている）
2. `src/demos/showcase-components.ts` の `card` デモ末尾に「作例1」セクション枠を追加（完了条件: 見出しとコンテナが表示される）
3. 作例1の3カードを `<dads-card>` + `slot` で実装（完了条件: テキストとリンク/slot 構成が揃う）
4. 作例セクション内にスコープ付き `<style>` を追加し、`::part(media-body)` / `::part(main)` を調整（完了条件: グラデ背景・SVG位置・重なりが概ね一致する）
5. 必要なら該当カードのみ CSS vars で base border/divider を無効化して上流に寄せる（完了条件: 二重線/意図しない区切り線がない）
6. `npm run validate:wc` を実行してマークアップ検証（完了条件: エラー0で完走）
7. ブラウザで Card デモを確認し、スクショ（添付画像）に近いレイアウトか最終調整（完了条件: 見た目がレビュー可能な精度）

## テスト計画
- `npm run validate:wc`
- 目視: `npm run dev`（または既存の起動手順）で Card デモを開き、作例1の表示・クリック委譲・フォーカス表示を確認

## オープンクエスチョン
該当なし（ユーザー回答済み）

