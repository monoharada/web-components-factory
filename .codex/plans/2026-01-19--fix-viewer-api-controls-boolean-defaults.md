# viewer-api-controls: boolean default 判定の不具合修正（checked:boolean を持つ実コンポーネント）

## 目標
- `src/viewer-api-controls.ts` の boolean control 判定不具合を修正し、`data-default="false"` が正しく **false** として扱われるようにする。
- `data-api-reset` 実行後に、boolean attribute が `required="false"` のように **文字列で残らない** ことを保証する。
- 再発防止として、`checked:boolean` を持つ実コンポーネント（例：`dads-switch`）を使った回帰テストを追加する。

## 背景
- `isBooleanControl()` が `checked:boolean` を持つ要素に対して **型判定ではなく現在値（true/false）** を返してしまっている。
- `checked === false` の場合、`isBooleanControl()` が false 扱いになり、`data-default="false"` が string 扱いとなって `target.setAttribute(attr, "false")` が発生しうる。
  - boolean attribute は「値に関わらず存在するだけで true」扱いになるため、意図と逆の挙動になる。

## スコープ
- やること：
  - `src/viewer-api-controls.ts` の `isBooleanControl()` を「checked プロパティの **存在/型**」で判定するように修正する
  - `src/viewer-api-controls.test.ts` に、`dads-switch` を `defineSwitch()` して再現する回帰テストを追加する
- やらないこと：
  - `bindApiControls()` の API 追加や互換性変更
  - viewer のマークアップ/スタイル変更

## 前提 / 制約
- `vitest` は `happy-dom` 環境で動作する（custom elements 利用可）。
- テストは TDD（RED → GREEN）で追加する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
該当なし

### その他（Docs/Infra など）
該当なし

## 受入基準
- [ ] 回帰テストが RED（修正前に失敗）→ GREEN（修正後に成功）で確認できる
- [ ] `npm run ci` が成功する
- [ ] `npm run lint` が成功する

## リスク / エッジケース
- `checked:boolean` を持つ別コンポーネント（`dads-checkbox` 等）でも同様の判定が必要 → 今回の修正で包括的に改善される。

## 作業項目（Action items）
1. 承認済みPlanを保存する（完了条件: `.codex/plans/2026-01-19--fix-viewer-api-controls-boolean-defaults.md` を作成し、このPlan本文が保存されている）
2. 回帰テストを追加（完了条件: 修正前にテストが失敗する）
3. `isBooleanControl()` を修正（完了条件: 回帰テストが成功する）
4. 検証（完了条件: `npm run ci` / `npm run lint` が成功する）

## テスト計画
- `npx vitest run src/viewer-api-controls.test.ts`
- `npm run ci`
- `npm run lint`

## オープンクエスチョン
該当なし

