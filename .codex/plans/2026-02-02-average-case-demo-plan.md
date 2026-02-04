# 平均ケース用デモ画面の追加と計測導線

## 目標
平均ケースの代表画面（デモ）を viewer で選べるようにし、JS/CSS 配信サイズの計測に使える状態にする。

## 背景
パフォーマンス観点の成果指標を作るため、実際の画面構成に近い「平均ケース」ページが必要。

## スコープ
- やること：
  - viewer から選択できる「Average Case」デモを追加
  - 既存コンポーネントのみで平均ケースのUIを構成
  - 計測時に使う URL パラメータ（`?component=averageCase&nosw=1`）で表示できる状態にする
- やらないこと：
  - 既存コンポーネントの実装変更
  - 計測の自動化（スクリプト/CI 追加）
  - デザイントークンや全体CSSの大幅変更

## 前提 / 制約
- `viewer.html` の importmap に存在するコンポーネントのみ使用する（不足があれば追記）。
- デモは `src/demos/extra.ts` に追加し、`src/demos.ts` から参照される前提。
- Service Worker の影響を避けるため、計測時は `nosw=1` を利用する。

## 変更内容（案）
### データ / バックエンド
該当なし。

### UI / UX
- `src/demos/extra.ts` に `averageCase` デモを追加。
  - 想定構成：見出し＋説明文、入力フォーム群（`dads-input-text`, `dads-select`, `dads-date-picker`, `dads-textarea`, `dads-checkbox`, `dads-radio`, `dads-fieldset`）、CTA（`dads-button`）、カード一覧（`dads-card`）、表（`dads-table`）、ページナビ（`dads-page-navigation`）。
  - 画面内レイアウトはデモ内の最小限の `style` で構成。
  - 必要なら `modulePreloadScript` で該当コンポーネントをプリロード。
- `viewer.html` のセレクタに `Average Case` を追加（value は `averageCase`）。

### その他（Docs/Marketing/Infra など）
該当なし。

## 受入基準
- [ ] viewer のセレクタに `Average Case` が表示される
- [ ] `?component=averageCase&nosw=1` でデモが表示され、コンソールエラーが出ない
- [ ] `npm run validate:wc` が通る
- [ ] 使用コンポーネントが importmap に未登録なら追記されている

## リスク / エッジケース
- Service Worker キャッシュによりサイズ測定がぶれる（`nosw=1` を前提化）。
- 使用コンポーネントが importmap にない場合、Autoloader が解決できず表示崩れ。
- デモ内の inline style が他デモと干渉する可能性（スコープを限定）。

## 作業項目（Action items）
1. 平均ケースの構成コンポーネントを確定（完了条件: 使用タグ一覧が決まっている）
2. `src/demos/extra.ts` に `averageCase` デモを追加（完了条件: デモ関数が実装されている）
3. 必要に応じて `modulePreloadScript` を追加（完了条件: 利用コンポーネントが事前ロードされる）
4. `viewer.html` のセレクタに `Average Case` を追加（完了条件: UI で選択可能）
5. importmap に不足があれば追記（完了条件: すべての使用タグが解決可能）
6. `npm run validate:wc` を実行（完了条件: エラーなし）
7. `npm run preview` で表示確認（完了条件: `?component=averageCase&nosw=1` で正しく表示）

## テスト計画
- `npm run validate:wc`
- `npm run build`（必要なら）
- `npm run preview` → `?component=averageCase&nosw=1` で手動確認

## オープンクエスチョン
詰まるときだけ最大2つ
