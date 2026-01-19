# `<dads-table>`：DOM自動ソート（オプション）対応

## 目標
`<dads-table>` のソート操作（`aria-sort` 切替）に連動して、**必要なときだけ** `tbody > tr` を並び替える「DOM自動ソート」を提供する。

## 背景
- 現状の `<dads-table>` は、クリックで `aria-sort` とアイコンを更新し `dads-sort-change` を発火する（＝公式サンプル同等の“状態管理”）。
- 実運用では「イベントを受けてアプリ側で再描画」だけでなく、**DOMそのものを手軽に並び替えたいケース**がある。
- ただし常に自動ソートすると意図せず挙動が変わるため、**明示オプトイン**にする。

## スコープ
- やること：
  - DOM自動ソートのオプトインAPIを追加（デフォルトOFF）
  - 文字列/数値/日付の判定ロジック（上書き可能）を実装
  - 複数 `tbody` を考慮した並び替え（グルーピングを壊さない）
  - `none` で元順復帰（安定ソート＆設計意図が残る）
  - Storybook とテストで挙動を明確化
- やらないこと：
  - サーバーソート/ページネーション/仮想スクロール等のデータグリッド機能
  - `colspan/rowspan` を厳密に解釈した複雑表のソート保証（サポート外として明記）

## 前提 / 制約
- light DOM 継続（Shadowなし）
- アクセシビリティ優先：`aria-sort` を一次情報として維持し、キーボード/フォーカスを壊さない
- オプトイン時のみ DOM を変更（既存利用の互換性維持）
- 既存 `dads-sort-change` は継続（アプリ側ソート用途も壊さない）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- **オプトインAPI**
  - `<dads-table sort-behavior="dom">` を追加（デフォルトは `none`）
  - 互換/貼り付け都合で `.dads-table[data-sort-behavior="dom"]` も同等扱い（どちらでも有効化）
- **型判定と上書き**
  - `th` に `data-sort-type="string|number|date"` があればそれを優先
  - 無い場合は列の値から自動判定（全体が数値っぽい→number、全体が日付っぽい→date、その他→string）
  - 各セルに `data-sort-value="..."` があれば表示テキストより優先（設計意図を残す“明示値”）
- **複数 `tbody`**
  - 各 `tbody` 内で独立に並び替え（グループ単位は維持）
- **`none` 時の復帰**
  - 自動ソート有効時、初回ソート前の行順（各 `tbody` のDOM順）を内部に記録し、`none` でそこへ戻す
  - 安定ソート（同値は元順を維持）で視覚/読み上げの予測可能性を確保

### その他（Docs/Marketing/Infra など）
- Storybook に「DOM自動ソートON」の作例を追加（数値/日付/文字列が混ざるテーブル）
- `<dads-table>` の a11y annotations / docs にオプトインAPIと `data-sort-type`/`data-sort-value` を明記

## 受入基準
- [ ] `sort-behavior="dom"`（または `.dads-table[data-sort-behavior="dom"]`）でのみ行が並び替わる（未指定は現状維持）
- [ ] `aria-sort` の更新・アイコン更新・`dads-sort-change` 発火は現状通り動く
- [ ] 文字列/数値/日付の自動判定が動き、`data-sort-type` と `data-sort-value` で上書きできる
- [ ] 複数 `tbody` がある場合、各 `tbody` 内だけで並び替わる
- [ ] 3クリックで `none` になった時、元のDOM順に復帰する
- [ ] `npm run type-check` と `npm run test:run` が通る（自動ソートのテスト追加を含む）

## リスク / エッジケース
- `colspan/rowspan` が絡む列位置の解釈（今回は保証しない方針で明記）
- 値の判定（`1,234`/`-`/空文字/単位付き）で誤判定しうる → `data-sort-type`/`data-sort-value` で回避可能にする
- 大きい表のパフォーマンス → `tbody` 単位、必要時のみ再ソート、比較関数の最小化で緩和

## 作業項目（Action items）
1. オプトインAPI設計確定（完了条件: `sort-behavior="dom"` の仕様が docs と一致）
2. DOM自動ソート本体を実装（完了条件: クリックで `tbody > tr` が並び替わる）
3. 元順記録と `none` 復帰を実装（完了条件: `none` で初期DOM順に戻る）
4. 型判定（string/number/date）を実装（完了条件: 自動判定がテストで担保される）
5. `data-sort-type`/`data-sort-value` 上書きを実装（完了条件: 明示指定で判定/比較が変わる）
6. 複数 `tbody` の挙動を実装（完了条件: `tbody` 間で行が移動しない）
7. Storybook 作例を追加（完了条件: UIでソートが目視確認できる）
8. ユニットテストを追加（完了条件: 並び替え/復帰/上書き/複数tbodyが検証される）
9. `npm run type-check` / `npm run test:run` 実行（完了条件: CI相当がグリーン）

## テスト計画
- 自動：
  - `packages/components/table/table.test.ts` にDOMソートの追加テスト
  - `npm run type-check`
  - `npm run test:run`
- 手動：
  - Storybook の新規「DOM自動ソート」作例で、昇順/降順/none（復帰）を確認

## オープンクエスチョン
該当なし

