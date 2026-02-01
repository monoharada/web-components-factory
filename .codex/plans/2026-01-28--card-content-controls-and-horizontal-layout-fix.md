# dads-card: コンテンツ編集Controls追加 + horizontal崩れ修正

## 目標
- `dads-card` デモの Controls から、カード内の **テキスト/ボタンラベル** を変更できるようにする
- `layout="horizontal"` にしたときにカードが潰れて見える（極端に縦組みになる）問題を解消する

## 背景
- 現状のカードControlsは `layout` / CSS vars / data属性中心で、カード内部コンテンツ（タイトル/本文/ボタン文言）を触れない
- `layout="horizontal"` にすると本文が極端に狭い列に押し込まれ、表示が崩れる報告がある
- DADS upstream のカード実装では、横並び時の画像列幅を `%` で上限キャップして崩れを回避している（例: `min(50%, 352px)`）
  - 参考: `resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/card-example-2.css`

## スコープ
- やること：
  - CardデモのAPI/Controlsに「カード内部コンテンツ編集」を追加
  - `dads-card` の `layout="horizontal"` レイアウト計算を DADS に寄せて崩れを修正
- やらないこと：
  - `dads-card` 自体に新しい public API（新props/attrs/slots）を追加する
  - デザイン（トークン体系/見た目）の大幅変更

## 前提 / 制約
- 既存の `viewer-api-controls` の仕組み（`data-api-attr`/`data-api-prop`/`data-api-css-var`）を流用する
  - `data-api-prop="textContent"` を使うと、プレビュー/Usageコードの両方に反映できる実装になっている
- `layout="horizontal"` の修正は DADS upstream のパターン（画像列の上限を `min(50%, …)` でキャップ）に合わせる
- CI相当の確認として `npm run type-check`, `npm run test:run`, `npm run validate:wc`, `npm run build` を通す

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `src/demos/showcase-components.ts`（cardのAPI/Controls）に、以下の編集Controlsを追加
  - タイトル（主リンク）の文言
  - 本文（content slot）の文言
  - サブエリア内のボタン2つのラベル
- selectorの脆さ回避のため、プレビュー側の対象要素に `data-*`（demo用途）を付け、Controlsは `data-api-target-selector` でそこを参照する

### その他（Docs/Marketing/Infra など）
- `packages/components/card/card-styles.ts` の `layout="horizontal"` の列定義を DADS に寄せる
  - 例: `grid-template-columns: minmax(auto, min(50%, var(--dads-card-media-width))) 1fr;`
- 必要なら、横並び時の最小幅まわり（`min-width: 0` など）が不足していないか再点検する

## 受入基準
- [ ] CardデモのControlsから、タイトル/本文/2ボタンのラベルが変更でき、プレビューに即時反映される
- [ ] 変更内容が Usage (HTML) のコードブロックにも追従して反映される
- [ ] `layout="horizontal"` に切り替えても、カードの本文が極端に狭い列に潰れない（添付の崩れ再現が解消）
- [ ] `npm run type-check` / `npm run test:run` / `npm run validate:wc` / `npm run build` がパスする

## リスク / エッジケース
- `textContent` で `dads-button` の中身を置換すると、将来アイコン等を入れた場合に消える（今回のデモ範囲では許容）
- `data-api-target-selector` の selector が Usage テンプレート側でも一致しないと、コードブロック反映がズレる（data属性で安定化する）
- `min()` + `var()` の組み合わせがブラウザによって癖がある可能性（DADS upstream の式に寄せてリスク低減）

## 作業項目（Action items）
1. horizontal崩れの再現条件を整理（完了条件: どのデモ/幅/設定で潰れるかを明文化）
2. DADS upstream（card-example-2.css）の横並び列定義を採用方針に落とす（完了条件: 採用するCSS式が確定）
3. `packages/components/card/card-styles.ts` の `layout="horizontal"` 列定義を修正（完了条件: `min(50%, …)` キャップが適用される）
4. `src/demos/showcase-components.ts` の card preview 内に demo用 `data-*` を付与（完了条件: 4箇所（title/content/btn1/btn2）を一意に特定できる）
5. 同ファイルの Controls に `data-api-prop="textContent"` の入力を追加（完了条件: 4箇所の文言を変更できる）
6. `layout="horizontal"` 切替＋長文入力で崩れが出ないか確認（完了条件: 420px相当で再現しない）
7. `npm run type-check` / `npm run test:run` / `npm run validate:wc` / `npm run build` 実行（完了条件: 全て成功）
8. 承認済みPlanを `.codex/plans/` に保存（完了条件: 日付+目的のファイルが追加されている）

## テスト計画
- 自動:
  - `npm run type-check`
  - `npm run test:run`
  - `npm run validate:wc`
  - `npm run build`
- 手動:
  - viewer で card デモを開き、Controlsでタイトル/本文/ボタン文言を変更して反映確認
  - `layout="horizontal"` に切り替えて、潰れ（縦1文字並び）が解消していることを確認

## オープンクエスチョン
（なし。まずは「文言（textContent）変更」を対象に実装。ボタンのvariant/size等まで必要なら追加で拡張）

