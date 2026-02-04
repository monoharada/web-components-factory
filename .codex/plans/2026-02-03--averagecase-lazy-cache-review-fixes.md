# Average Case Lazy/Cache 修正プラン（PR#43レビュー対応）

## 目標
- `lazy=0` を「遅延無効＝全件即時ロード」に揃える
- `dads-date-picker` が未定義のまま残らない設計にする
- minify/compress のキャッシュ混在リスクを排除する

## 背景
- `averageCase.runtime.js` で `lazy=0` 時に lazy モジュールが一切ロードされず、未定義のまま残る
- `:not(:defined)` により date-picker が非表示となり、遅延ロードが永久に発火しない可能性
- `server.ts` で Referer/Cookie に依存する minify/compress と強いキャッシュが競合

## スコープ
- やること：
  - `lazy=0` 時の全件即時ロード
  - date-picker の遅延ロード起点を IntersectionObserver へ移し、非表示でも確実にロード
  - minify/compress の判定を URL 依存に寄せる or `Vary`/cache 制御を修正
- やらないこと：
  - importmap / auto-load の削除
  - 画面構成やUIの大改修

## 前提 / 制約
- 変更は `averageCase.runtime.js` / `averageCase.html` / `server.ts` が中心
- 既存のサイズ計測導線を崩さない

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `lazy=0` のときは `lazySpecifiers` を全件 `Promise.all` で即時 import
- `dads-date-picker` を `lazySections` に追加し、可視時に自動ロード（pointer/focus依存を排除）
  - 監視対象は `dads-date-picker` 本体 or フォーム内のラッパー要素

### その他（Docs/Marketing/Infra など）
- `server.ts` の minify/compress を URL パラメータ主導に寄せる

## 受入基準
- [ ] `?lazy=0` で date-picker/table/page-navigation が未定義にならない
- [ ] `dads-date-picker` がユーザー操作なしでも定義される
- [ ] minify/compress のキャッシュ混在が起きない設計になっている
- [ ] importmap/auto-load は維持されている

## リスク / エッジケース
- lazy 起点を変更することで初期ロードサイズが増える可能性
- URL パラメータ主導で挙動が変わる（Cookie/Referer 依存の挙動がなくなる）

## 作業項目（Action items）
1. `averageCase.runtime.js` の `lazy=0` 分岐を全件即時 import に変更（完了条件: lazy=0 で未定義要素が残らない）
2. `dads-date-picker` を `lazySections` へ追加し、IOで自動ロード（完了条件: 操作なしで定義される）
3. `:not(:defined)` の影響を検証（完了条件: FOUC抑制とロードが両立）
4. `server.ts` の minify/compress 判定を URL パラメータ主導に変更（完了条件: キャッシュ混在が発生しない）
5. `?lazy=0` / `?nosw=1` で目視確認（完了条件: 空白残りがない）
6. Network/Performance で定義タイミングを再計測（完了条件: 500ms超が解消または原因が明確）

## テスト計画
- `npm run dev` → `averageCase.html?nosw=1` / `?lazy=0` で目視
- DevTools Console で `customElements.whenDefined('dads-date-picker')` / `dads-calendar` の計測

## オープンクエスチョン
なし
