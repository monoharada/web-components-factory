# viewer.html のみ a11y デフォルト有効化 Plan

## 目標
- `viewer.html` では自動的に a11y 注釈が表示される
- その他のページは `?a11y=1` がある時のみ表示される

## 背景
- 現状は `?a11y=1` もしくは localStorage が無いと CEM 注釈が読まれない
- localStorage は同一 origin で共有されるため、viewer のみ有効化に不適切

## スコープ
- やること：
  - `viewer.html` のみに a11y 有効化を適用
  - 既存の a11y 表示切り替え UI は維持
- やらないこと：
  - a11y-annotate 本体の挙動を変更
  - localStorage による恒久的な有効化

## 前提 / 制約
- `viewer.html` を開くとき `?a11y=1` が無いケースがある
- URL のクエリを追加してもページリロードは避けたい

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `viewer.html` の `<head>` 早期に、`a11y` クエリが無い場合に `history.replaceState` で `?a11y=1` を付与するスクリプトを追加

### その他（Docs/Marketing/Infra など）
- `docs/showcase-template.md` に「viewer はデフォルトで `a11y=1` になる」旨を追記
- `docs/accessibility-annotations.md` に viewer 例外を明記（他ページはクエリのみ）

## 受入基準
- [ ] `viewer.html` をクエリ無しで開いても注釈が表示される
- [ ] `viewer.html` の URL に `?a11y=1` が付与される（リロードなし）
- [ ] 他ページは `?a11y=1` が無いと注釈が表示されない

## リスク / エッジケース
- `history.replaceState` が実行されるタイミングが遅いと、初回レンダリングが空になる可能性
- 既存のクエリがある場合の上書きに注意（他パラメータは保持）

## 作業項目（Action items）
1. `viewer.html` に a11y クエリ付与スクリプト挿入位置を決める（完了条件: head 内の挿入箇所が確定）
2. クエリ保持型の URL 書き換えロジックを用意（完了条件: 既存パラメータを維持できる）
3. viewer での表示確認手順を整理（完了条件: 再現・確認手順が1本化）
4. docs の更新対象を決定（完了条件: 更新ファイルが明記される）
5. 影響範囲（他ページ）に副作用がないことを確認（完了条件: localStorage を触らない方針が明確）

## テスト計画
- ブラウザで `viewer.html` をクエリ無しで開き表示確認
- `viewer.html?foo=1` の既存クエリ保持を確認
- 他の demo ページは `?a11y=1` が無いと表示されないことを確認

## オープンクエスチョン
- なし
