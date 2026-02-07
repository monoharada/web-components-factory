# チップタグ lead-icon 非表示の修正 Plan

## 目標
- lead-icon が Preview と a11y 注釈の両方で表示される
- lead-icon の選択変更が即時反映される
- 既存APIは変更しない

## 背景
- `[part='start-icon']:empty` がスロット要素を常時 `display: none` にし、割り当てノードがあっても非表示になっている
- その結果、Preview と a11y 注釈のどちらでもリードアイコンが見えない

## スコープ
- やること：
- `dads-chip-tag` の `start-icon` スロット表示ルールを修正し、割り当てノードを表示可能にする
- Preview と a11y 注釈で lead-icon が可視化されることを確認する
- やらないこと：
- コンポーネントAPIの追加/変更
- デモJSの大規模修正

## 前提 / 制約
- CSS修正は `css-writing-rules` に従う
- スロット未指定時に余白が増えないことを前提にする（必要なら追加調整）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `packages/components/chip-tag/chip-tag-styles.ts`
  - `[part='start-icon']:empty { display: none; }` を削除
  - 必要なら `start-icon` のレイアウト影響が無いことを確認

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] `http://localhost:3000/?a11y=1&component=chipTag` の Preview で lead-icon が表示される
- [ ] lead-icon の選択変更が即時反映される
- [ ] a11y 注釈側の lead-icon も表示される
- [ ] lead-icon 未選択時に余白が不自然に増えない

## リスク / エッジケース
- `:empty` を外すことで、スロット未指定時に小さな空きが発生する可能性
- ブラウザ差でスロットのレイアウトが異なる可能性

## 作業項目（Action items）
1. `chip-tag-styles.ts` の `[part='start-icon']:empty` ルールを削除する（完了条件: CSSから該当ルールが消える）
2. Preview の `dads-chip-tag` で lead-icon が表示されることを確認する（完了条件: 目視で表示）
3. a11y 注釈の `dads-chip-tag` で lead-icon が表示されることを確認する（完了条件: 目視で表示）
4. lead-icon 未指定時に余白が不自然に増えていないことを確認する（完了条件: 目視で問題なし）
5. 必要なら `start-icon` のレイアウト微調整を行う（完了条件: 余白の違和感が解消）

## テスト計画
- 手動確認: `http://localhost:3000/?a11y=1&component=chipTag`
- 可能なら `npm run validate:wc`（環境に依存する場合は未実行理由を記載）

## オープンクエスチョン
該当なし
