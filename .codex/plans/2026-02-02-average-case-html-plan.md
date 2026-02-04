# averageCase.html で最小配信にする計画

## 目標
`averageCase.html` を新規作成し、平均ケースの画面に必要なコンポーネントJSだけを読み込む構成にする（`showcase`/`viewer`/`demos` 依存を外す）。

## 背景
平均ケースの配信サイズを正確に測るため、不要なデモ/ビューワ依存を排除した専用HTMLが必要。

## スコープ
- やること：
  - `averageCase.html` を新規作成
  - 必要なコンポーネントだけを importmap と modulepreload に含める
  - 画面レイアウト（フォーム＋カード＋テーブル＋ページナビ）を平均ケースとして実装
  - Service Worker を無効化できるパラメータ（`?nosw=1`）に対応
- やらないこと：
  - 既存コンポーネントの実装変更
  - 既存 viewer/demos の仕様変更（必要最小限の整理のみ）
  - 自動計測スクリプトの追加

## 前提 / 制約
- `server.ts` は任意の `*.html` を配信できるため `averageCase.html` はそのまま参照可能。
- 既存の `averageCase` デモ（`src/demos/extra.ts`）は今回不要になる想定。

## 変更内容（案）
### データ / バックエンド
該当なし。

### UI / UX
- `averageCase.html` を追加し、必要なコンポーネントのみ読み込み。
- `viewer.html` のセレクタから `Average Case` を削除（viewer 依存を避けるため）。
- `src/demos/extra.ts` の `averageCase` デモを削除（不要な読み込み元の解消）。
- 画面構成はフォーム＋カード＋テーブル＋ページナビの平均ケースで維持。

### その他（Docs/Marketing/Infra など）
該当なし。

## 受入基準
- [ ] `averageCase.html` が存在し、`/averageCase.html?nosw=1` で表示できる
- [ ] 読み込まれるJSが必要コンポーネントに限定されている（viewer/demos 依存なし）
- [ ] `npm run validate:wc` が通る

## リスク / エッジケース
- importmap に不足があると表示崩れ
- date-picker など内部依存があるコンポーネントは追加読み込みが必要
- 既存 `averageCase` デモ削除で viewer からの参照が消える

## 作業項目（Action items）
1. 平均ケースの構成コンポーネントを確定（完了条件: タグ一覧が決まる）
2. `averageCase.html` の雛形を作成（完了条件: 単独で表示できる）
3. importmap と modulepreload を必要最小限に整理（完了条件: 不要な依存がない）
4. 平均ケースUIのマークアップを移植（完了条件: 画面構成が成立）
5. `viewer.html` の `Average Case` を削除（完了条件: viewer に残らない）
6. `src/demos/extra.ts` の `averageCase` を削除（完了条件: demos から消える）
7. `npm run validate:wc` を実行（完了条件: エラーなし）

## テスト計画
- `npm run validate:wc`
- `npm run preview` または `bun server.ts` で `averageCase.html?nosw=1` を表示確認

## オープンクエスチョン
詰まるときだけ最大2つ
