# viewer デモ体裁の共通化（A11yゾーン + API/Controls + CSS vars）

## 目標

- `viewer.html` で表示される **全コンポーネントのショーケースデモ（非Fidelity）**（`src/demos.ts`）の体裁を共通化する。
- 各デモに以下を必須化する：
  - アクセシビリティ注釈（a11y-annotate）ゾーン（表示トグル付き）
  - API / Controls パネル（Props/Attrs + CSS vars の2テーブル）
  - Usage（HTML）コードブロック（Controls操作に追従）

## 背景

- `viewer.html` は `src/demos.ts` の HTML 文字列を `innerHTML` 差し替えで表示する方式。
- viewer には既に API / Controls の基盤がある：
  - viewer 固定CSS（`viewer.html` の `.wc-api-*`）
  - バインド実装（`src/viewer-api-controls.ts` の `bindApiControls()`）
  - docs（`docs/showcase-template.md`, `docs/knowledge/viewer-api-controls-table.md`, `docs/knowledge/a11y-annotate-demo-patterns.md`）
- ただし、デモの体裁・表形式・コードブロック有無がページごとにバラつきがあるため、標準化する。

## スコープ

- やること：
  - `src/demos.ts` の各 **非Fidelity** デモに、A11yゾーン + API/Controls（Props/Attrs + CSS vars） + Code block を追加/統一する
  - 既に API/Controls があるデモは表形式/見出し/初期化スクリプトを統一する
  - `fieldset` / `checkbox` / `accordion` のように `--dads-*` が薄いコンポーネントは、CSS vars テーブルを **暫定運用**（グローバルトークン/既存上書き可能変数を掲載）とする
- やらないこと：
  - Fidelity デモ（`*Fidelity`）の体裁統一（ID安定性を優先）
  - resetCss のような viewer-only 実験デモの体裁統一
  - コンポーネント側への `--dads-*` 追加（今回は行わない）

## 前提 / 制約

- `src/demos.ts` の HTML は `innerHTML` で差し替えられるため、スクリプトは `document.currentScript` 起点で **スコープを閉じる**（再描画/多重実行でも衝突しない）。
- Custom Element は定義前に property を触ると壊れうるため、Controls バインド前に `import()` を完了する。
- `validate:wc` は unknownElement を error、unknownAttribute を warning として扱う（`data-*` / `aria-*` は許可）。

## 変更内容（案）

### データ / バックエンド

該当なし

### UI / UX

- 共通の章立て（最低限）：
  - A11y（a11y-annotate + トグル）
  - API / Controls
    - Preview（`data-api-target`）
    - Usage（`<dads-code-block data-api-code><template>...</template></dads-code-block>`）
    - Props / Attrs テーブル（`data-api-attr` / `data-api-prop`）
    - CSS vars テーブル（`data-api-css-var`）
- Controls の初期化スクリプトは `docs/knowledge/viewer-api-controls-table.md` のパターンに合わせる。

### その他（Docs/Marketing/Infra など）

- `docs/showcase-template.md` と実装が乖離している場合は、実装に合わせて更新する。

## 受入基準

- [ ] `src/demos.ts` の **非Fidelity** デモで A11yゾーンが存在し、トグルで `a11y-annotate` の `mode` が切り替わる
- [ ] 各デモに API/Controls パネルが存在し、Props/Attrs と CSS vars の2テーブルが表示される
- [ ] Props/Attrs 操作が Preview に即時反映される
- [ ] CSS vars 操作が Preview の見た目に即時反映される（空で removeProperty）
- [ ] Usage（HTML）コードブロックが表示され、Controls操作に追従する
- [ ] `npm run validate:wc` がパスする

## リスク / エッジケース

- `src/demos.ts` が大きく、差分が膨らみやすい（レビュー負荷）。
- `innerHTML` 差し替え＋ script 再評価により多重登録しやすい（スコープ化が必須）。
- CSS vars の Default 表示（トークン参照/実値併記）が崩れやすい（`docs/rules/viewer-api-table-rules.md` に寄せる）。

## 作業項目（Action items）

1. 共通化方針を `src/demos.ts` の実装に反映（完了条件: A11y + API/Controls + Code block の雛形が使い回せる）
2. 既存 API/Controls の統一（完了条件: disclosure/button/search-box/menu-list-box/page-navigation が同一フォーマット）
3. API/Controls 未導入デモへ追加（完了条件: 非Fidelity デモが最低限の共通要件を満たす）
4. 検証（完了条件: `validate:wc` / `type-check` / `test:run` が通る）

## テスト計画

- 手動: `bun server.ts` → `viewer.html?component=<name>` で主要デモを切り替え、Controls/Reset/コード追従を確認
- 自動: `npm run validate:wc` / `npm run type-check` / `npm run test:run`

## オープンクエスチョン

該当なし

