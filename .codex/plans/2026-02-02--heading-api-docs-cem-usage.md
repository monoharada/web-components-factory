# Heading: API/Docs/CEM/Usage 整合プラン

## 目標
`dads-heading` の公開API（slot/attr/part）・a11y注意点・ショーケース（API/Controls/Usage）・CEM（custom-elements.json）を、現状実装と完全に一致させ、利用者が迷わない状態にする。

## 背景
- ここまでの実装で `type` 廃止 → slot/attr へ整理、`margin="top"`、icon/chip のトークン設計、Usage最小化などが進んだ。
- 一方で、ショーケースの Props/Attrs/CSS vars 表示や、CEM が「今の実装で実際に使えるAPI」とズレると、利用者が詰まる。
- 特に `slot="icon"/"shoulder"` の挙動（同時利用/優先順位）や、`chip/rule` が装飾である前提の a11y 注記を、明文化しておきたい。

## スコープ
- やること：
  - `dads-heading` の slot/attr/part の「挙動仕様」をドキュメント化（コードコメント/JSDoc + ショーケース）
  - `chip/rule` の装飾前提と a11y 注意点を明確化（JSDoc + ショーケース）
  - `custom-elements.json`（CEM）と実装・ドキュメントの一致確認と更新
  - ショーケースの Usage (HTML) を preset ごとに最小マークアップに保つことを保証し、回帰テストを追加
- やらないこと：
  - 見出し本文と後続要素の余白（Article側の組版ルール）を heading コンポーネントに内包する
  - 新しい見た目仕様追加（デザイン変更）や、新しい公開属性の追加（必要になったら別Plan）

## 前提 / 制約
- “ドキュメントの正” は、少なくとも以下の3箇所に分散する前提：
  - コンポーネント JSDoc（CEMのソース）
  - ショーケース（`src/demos/showcase-components.ts`）の表示内容（人間向け）
  - CEM（`custom-elements.json`）は生成物でコミット運用
- Props/Attrs 表の `chip` は **Notes セクションに集約**（Controls行は作らない）。
- CSS vars は **現状存在する `--dads-heading-*` を全列挙**する。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
1) `slot="icon" / slot="shoulder"` の挙動仕様を明文化
- 同時に入れた場合：shoulder は上、icon は見出し行の先頭、本文は default slot
- “優先順位”は基本不要（両方表示が正）。ただし「無い場合は非表示」であることを明記
- `chip` や `rule` は slot ではなく attr（装飾ON/OFF）であることを明確化

2) `chip / rule` の “装飾” 前提と a11y 注意書きを整理
- 装飾は情報の唯一の手掛かりにしない
- `icon` は意味が無い場合は `aria-hidden="true"` 推奨など、利用側責務を明記

3) ショーケースの Props/Attrs 表を「現状API」に合わせて整備
- 公開API（level/size/margin/rule）を最新化
- preset/shoulderText/iconName は「デモの便宜」だと明確化（コンポーネントAPIではない）
- chip は Notes に集約（Controls行を作らない）

4) ショーケースの CSS vars 表を全列挙（`--dads-heading-*`）
- 見出し側で触れる変数を漏れなく掲載
- テーブル肥大化が気になる場合は `<details>` でカテゴリ別に整理

5) Usage (HTML) を preset ごとに最小化し続ける “保証” を入れる
- `applyPreset()`（`src/demos/showcase-components.ts`）の「掃除→必要分だけ作る」を仕様として固定
- `data-api-strip-attrs` の strip 方針（なぜ strip するか）を明記

### その他（Docs/Marketing/Infra など）
- `packages/components/heading/heading.ts` のJSDocを最新化（slot/attr/part/cssprop/例/a11y注意点）
- `npm run cem:analyze` を実行して `custom-elements.json` を更新し、差分が “意図したAPI更新のみ” であることを確認
- `docs/knowledge/learnings.md` に「仕様確定版（slot/attr分離、Usage最小化、strip方針、a11y注意点）」を追記（必要なら）

## 受入基準
- [ ] `packages/components/heading/heading.ts` のJSDocに、slot/attr/part の仕様と例が現状挙動と一致している
- [ ] `chip` / `rule` の “装飾” 前提と a11y 注意点が、ショーケースとJSDocで同じ説明になっている
- [ ] ショーケースの Props/Attrs テーブルが「公開API」と「デモ便宜」を区別して説明できている
- [ ] ショーケースの CSS vars 表が、現状の `--dads-heading-*` を全列挙している
- [ ] `custom-elements.json` の `dads-heading` エントリが、JSDoc/実装と一致している（slot/attr/part/cssProperties）
- [ ] E2E で preset ごとの Usage が最小マークアップであることを自動検証できる
- [ ] `npm test` / `npm run validate:wc` / `npm run cem:analyze` が通る

## リスク / エッジケース
- CEMはJSDoc依存なので、JSDocの更新漏れがあると “直したつもりでズレたまま” になる
- ショーケースの「デモ便宜」コントロール（shoulderText/iconName）が、Usage最小化と衝突しやすい
- strip し過ぎると、利用者が必要な属性まで見えなくなる（strip方針の明記が必要）

## 作業項目（Action items）
1. `dads-heading` の現状APIを棚卸し（完了条件: slot/attr/part/css vars/デモpresetの一覧が作れる）
2. `packages/components/heading/heading.ts` のJSDoc更新（完了条件: 利用方法が誤解なく分かる）
3. ショーケース Props/Attrs 表整理（完了条件: 公開APIとデモ便宜が明確）
4. ショーケース Notes 追加（chip/rule/a11y注意）+ chip行の集約（完了条件: chipの説明がNotesで一元化）
5. ショーケース CSS vars 表を `--dads-heading-*` 全列挙に更新（完了条件: 一覧がCEMと一致）
6. Usage最小化の回帰E2E追加（完了条件: preset別の Usage HTML が期待通り）
7. `npm run cem:analyze` で CEM 更新（完了条件: dads-heading の宣言が最新）
8. `npm run validate:wc` で検証（完了条件: エラー増なし）

## テスト計画
- `npm test`
- `npm run validate:wc`
- `npm run cem:analyze`
- `npm run test:e2e -- e2e-evidence/heading.usage-minimal.spec.ts`

## オープンクエスチョン
- 該当なし
