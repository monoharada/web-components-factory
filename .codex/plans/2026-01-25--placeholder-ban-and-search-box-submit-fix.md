# placeholder “常に使わない” ルール徹底 + search-box 二重実行修正 Plan

**Status**: APPROVED PLAN

## 目標
- `placeholder` を **demos / viewer / entry のマークアップで一切使わない**（ネイティブ `<input>` 含む）
- CI（`npm run validate:wc`）で **`placeholder` の混入をエラーとして検知**し、再発を防ぐ
- `dads-search-box` のクリック起点で `dads-search` / `requestSubmit()` が **二重発火しない**ようにする
- `dads-search-box` の placeholder 関連の公開API（CSS vars / API表）を **完全に削除**する

## 背景
- 既に repo 方針として `placeholder` は a11y 上の理由で非推奨/禁止（`deprecated-attrs` など）だが、デモコードや search-box の style API に残りがある
- `validate:wc` は現状 CEM 駆動の unknownElement/unknownAttribute だけで、`placeholder` 使用を防げない

## スコープ
- やること：
  - `src/demos.ts` / `src/entry.ts` の `placeholder="..."` を削除し、代替（表示ヒント + `aria-describedby` 等）に置換
  - `scripts/wc/validator-core.mjs` に **placeholder 禁止チェック**を追加（error）
  - `wc.config.js` の include に `src/entry.ts` を追加し、CIで常時チェック対象にする
  - `dads-search-box` の click/submit 経路を一本化し、二重実行を防止
  - `dads-search-box` の placeholder 系 CSS var / styles / demos テーブル行 / CEM を削除
- やらないこと：
  - docs/ADR 内の歴史的説明まで “単語としての placeholder” を消す（必要なら別タスク）
  - `dads-button` 側のイベント仕様変更（別タスク）

## 前提 / 制約
- `validate:wc` は CI で実行されるため、ここで “禁止” を enforce するのが最も確実
- `custom-elements.json` は `npm run cem:analyze` で更新し、差分が残らない状態にする

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- デモのネイティブ `<input>` は placeholder を使わず、ラベル＋補足テキスト（例の提示）で代替
- `dads-search-box` の submit は `dads-search`（cancelable）→ OK のときのみ `requestSubmit()` のみに統一

### その他（Docs/Marketing/Infra など）
- `validate:wc` に `placeholder` 属性の **forbiddenAttribute error** を追加（タグ種別問わず検知）
- `tests/wc-validator-diagnostics.test.ts` に forbiddenAttribute の診断テストを追加
- `docs/rules/new-component-dod.md` に「placeholder 使用禁止（デモ含む）」を明記

## 受入基準
- [ ] `npm run validate:wc` が `placeholder` を含むマークアップを **error** として検出できる（テストも追加）
- [ ] `src/demos.ts` / `src/entry.ts` / `viewer.html` に `placeholder=` が存在しない
- [ ] `dads-search-box` の click 起点で `dads-search`/`requestSubmit` が二重発火しない
- [ ] `--dads-search-box-placeholder-color` と関連スタイル/テーブル行が削除され、`custom-elements.json` にも出力されない
- [ ] `npm run cem:analyze` / `npm run validate:wc` / `npm run ci` が通る

## リスク / エッジケース
- `validate:wc` の “placeholder 検知” はソーステキストの正規表現解析なので、偽陽性/偽陰性が出ないようテストで範囲を固める
- `dads-search-box` のボタン type 変更等でフォーム送信の既存期待が変わる可能性（ただし cancelable を正として統一するのが目的）

## 作業項目（Action items）
1. `validate:wc` に placeholder 禁止診断を追加（完了条件: `placeholder` を含むと error が出る）
2. validator の診断テスト追加（完了条件: `tests/wc-validator-diagnostics.test.ts` がパスし、range も妥当）
3. `wc.config.js` に `src/entry.ts` を追加（完了条件: CIで entry も常時検証される）
4. `src/demos.ts` の placeholder を削除し代替表現へ（完了条件: 例示は support/補足テキストで担保）
5. `src/entry.ts` の placeholder を削除し代替表現へ（完了条件: 同上）
6. `dads-search-box` の submit 経路を一本化（完了条件: cancelable に従い requestSubmit が1回に収束）
7. `dads-search-box` の placeholder CSS var/スタイル/デモ表を削除（完了条件: 参照が repo 内から消える）
8. `cem:analyze` 実行で CEM 更新（完了条件: CI の “custom-elements.json up to date” が通る）
9. DoD ドキュメント更新（完了条件: 新規コンポーネントで placeholder 禁止が明文化される）
10. 検証コマンド実行（完了条件: `validate:wc`/`ci` がパス）

## テスト計画
- Unit: `tests/wc-validator-diagnostics.test.ts` で forbiddenAttribute（placeholder）を検証
- Unit: `packages/components/search-box/search-box.test.ts` に実クリック相当の経路を追加して二重発火を防ぐ
- CI: `npm run cem:analyze` → `npm run validate:wc` → `npm run ci`

## オープンクエスチョン
- 該当なし（placeholder は常に使わない方針で確定）

