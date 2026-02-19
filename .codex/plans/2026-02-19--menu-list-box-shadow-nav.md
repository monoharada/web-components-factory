# Menu List Box Shadow Navigation Fix

## 目標
- `dads-menu-list-box` の nested Shadow DOM 配下でキーボード移動が停止しないようにする。
- 実装(`packages`)と runtime(`vendor-runtime`)のロジックを同期する。
- 回帰テストを強化し、再発防止の検証を追加する。

## 背景
- `document.activeElement` は Shadow 境界で host を返すことがあり、現在位置解決が失敗するケースがある。
- `:focus-within` 判定を使う場合、環境によっては `matches` 例外リスクがある。

## スコープ
- やること：
  - `menu-list-box` の current index 解決ロジック改善
  - `vendor-runtime` への同等反映
  - 単体テストの回帰ケース追加（Shadow DOM + キーボード移動）
- やらないこと：
  - API 仕様変更
  - CSS/トークン調整
  - unrelated コンポーネントの修正

## 前提 / 制約
- 変更は最小限・レビューしやすく行う。
- `packages` と `vendor-runtime` の差分は機能的に一致させる。
- 検証は既存スクリプトを利用する。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `getDeepActiveElement` を導入し、Shadow Root を辿って active element を解決する。
- `#currentIndex` で `:focus-within` も判定に利用する。
- `matches(':focus-within')` は安全ラッパー経由で評価する。

### その他（Docs/Marketing/Infra など）
- PR本文更新方針を整理（再現条件・検証結果の明文化）。

## 受入基準
- [ ] nested Shadow DOM 配下で ArrowDown/ArrowUp による移動が継続する
- [ ] `packages` と `vendor-runtime` で同等ロジックになっている
- [ ] `npm run test:run -- packages/components/menu-list-box/menu-list-box.test.ts` が通る
- [ ] `npm run agents:verify` が通る

## リスク / エッジケース
- `:focus-within` の selector 評価が環境依存で例外化する可能性
- microtask 待機中心のテストが環境差で不安定化する可能性

## 作業項目（Action items）
1. `menu-list-box.ts` の active element 解決を改善する（完了条件: deep active + safe focus-within 判定が実装される）
2. `vendor-runtime` に同等修正を反映する（完了条件: TS版と等価な分岐になる）
3. `menu-list-box.test.ts` に回帰ケースを追加する（完了条件: nested Shadow DOM のキーボード移動を検証）
4. 追加テストを実行する（完了条件: 対象テストが green）
5. 必須ガードレールを実行する（完了条件: `npm run agents:verify` が green）

## テスト計画
- `npm run test:run -- packages/components/menu-list-box/menu-list-box.test.ts`
- `npm run test:e2e:menu-list-box`（必要時）
- `npm run agents:verify`

## オープンクエスチョン
- 公式サポートブラウザ範囲（`matches(':focus-within')` の互換性判断に使用）
