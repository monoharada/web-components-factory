# dads-card：APIテーブル拡充 + layout="horizontal" 崩れ修正

## 目標
- `dads-card` デモの **APIテーブル（Props/Attrs・CSS vars）をDADS/実装に沿って充実**させる
- `layout="horizontal"` に切り替えたときに **表示が崩れない（文字が極端に縦積みにならない）**ようにする

## 背景
- 現状のカードデモ（`src/demos/showcase-components.ts`）は CSS vars が少なく、DADSカードの公開API（トークン/構造）と比べて情報不足
- `layout="horizontal"` で **メディア幅が優先され、メイン領域が極端に狭くなり**タイトル等が縦積みになって崩れる

## スコープ
- やること：
  - `dads-card` の **APIテーブル**を、実際の公開API（slots / css vars / 属性・データ属性の使い方）と揃えて増補
  - `layout="horizontal"` の **レイアウト崩れを修正**（狭幅でも破綻しない列幅設計）
  - 必要に応じて `dads-card` の **JSDoc（@cssprop）も実態に合わせて補完**し、CEMを更新
- やらないこと：
  - カードの構造（parts/slots）を増やすなどの大設計変更
  - DADS仕様から外れる独自挙動の追加（必要なら別Plan）

## 前提 / 制約
- 既存コンポーネントの実装パターン（トークン参照、公開APIはJSDoc→CEM）に揃える
- CSSは `css-writing-rules` に従い、直値を増やさない
- CEM（`custom-elements.json`）を単一の真実として維持（JSDoc更新時は `npm run cem:analyze`）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
1) **APIテーブル拡充（デモ側）**
- 対象：`src/demos/showcase-components.ts`（cardセクション）
- Props/Attrs：
  - `layout` の説明/型/デフォルトを明確化
  - “カード面クリック（委譲）”を **実際の使い方**（主リンク側の `data-dads-card-primary` / `data-dads-card-delegate`）としてテーブルに追加  
    - コントロールは `data-api-target-selector` を使って **スロット内の主リンク要素**に適用できるようにする
- CSS vars：
  - `packages/components/card/card-tokens.ts` の `--dads-card-*` を網羅して追加（色/枠/divider/余白/media/typography/underline/focus など）

2) **layout="horizontal" 崩れ修正（コンポーネント側）**
- 対象：`packages/components/card/card-styles.ts`
- 方針：
  - `layout="horizontal"` の `grid-template-columns` を調整し、**media列が取りすぎて main が潰れない**ようにする
  - 例：media列の上限を `var(--dads-card-media-width)` だけでなく **割合（%）でも制限**し、狭幅時に main を確保する

### その他（Docs/Marketing/Infra など）
- `packages/components/card/card.ts` の `@cssprop` が実態より少ないので、APIテーブル拡充に合わせて **JSDocも追記**（必要なら）
- JSDocを更新した場合は `npm run cem:analyze` 実行→ `custom-elements.json` を更新

## 受入基準
- [ ] `src/demos/showcase-components.ts` の card APIテーブルが、実装に沿って十分な項目数になっている（Props/Attrs・CSS vars）
- [ ] “カード面クリック（委譲）”の設定が、テーブル上で **主リンク側の data 属性として**分かる/操作できる
- [ ] `layout="horizontal"` にしてもカードが破綻しない（極端な縦積みにならない）
- [ ] `npm run type-check` / `npm run test:run` / `npm run validate:wc` が通る
- [ ] （JSDoc更新した場合）`npm run cem:analyze` 後に `custom-elements.json` が更新され、CI想定の差分が整合している

## 作業項目（Action items）
1. card の公開API棚卸し（`packages/components/card/card.ts` / `packages/components/card/card-tokens.ts` / `packages/components/card/card-styles.ts`）。（完了条件: 追加すべき APIテーブル項目リストが確定）
2. デモの Props/Attrs テーブルを増補（layout + 委譲用data属性を主リンクターゲットで操作）。（完了条件: デモ上で委譲ON/OFFを切替できる）
3. デモの CSS vars テーブルを `--dads-card-*` 網羅に拡張。（完了条件: 主要カテゴリが一通り載っている）
4. `layout="horizontal"` 崩れ修正（media列の上限を割合でも制限、main が潰れない列定義）。（完了条件: 420px程度の幅でも破綻しない）
5. （必要なら）`packages/components/card/card.ts` の `@cssprop` を実態に合わせて追記。（完了条件: CEMに出したい公開CSS varsがJSDocに揃う）
6. `npm run type-check`。（完了条件: PASS）
7. `npm run test:run`。（完了条件: PASS）
8. `npm run validate:wc`。（完了条件: PASS）
9. （JSDoc更新した場合）`npm run cem:analyze`。（完了条件: `custom-elements.json` が更新される）

## テスト計画
- 自動: `npm run type-check` / `npm run test:run` / `npm run validate:wc`
- 目視: `npm run dev` → `viewer.html` の card デモで `layout="horizontal"` に切替し、崩れが解消していることを確認

