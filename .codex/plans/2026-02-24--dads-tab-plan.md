# 実装計画: dads-tab（APG準拠・4方向・reflow）

## 概要
- 作成日: 2026-02-24
- ステータス: Approved
- 承認フレーズ: APPROVE PLAN
- 承認日時: 2026-02-24
- 優先度: High
- 対象: 新規コンポーネント追加（`dads-tab`）

## 目標
- `dads-tab` を単一コンポーネントで追加し、APG準拠の操作/ARIAを提供する。
- Figmaの4方向 + reflow + examples を確認可能なデモを整備する。
- CEM/validate/agentsゲートを全通過する。

## Steps (P-xx)

- P-01: コンポーネント骨格を新設する
  - Decision: `packages/components/tab/` に本体・tokens・styles・define・index・test を配置する。
  - Touches:
    - `packages/components/tab/tab.ts`
    - `packages/components/tab/tab-tokens.ts`
    - `packages/components/tab/tab-styles.ts`
    - `packages/components/tab/tab-define.ts`
    - `packages/components/tab/index.ts`
    - `packages/components/tab/tab.test.ts`
  - Contract: C-01, C-09
  - Risks: R-01, R-05

- P-02: 公開APIと属性同期を実装する
  - Decision: `orientation`, `activation-mode`, `selected-index`, `loop` を公開属性にする。
  - Touches:
    - `packages/components/tab/tab.ts`
    - `packages/components/tab/tab.test.ts`
  - Contract: C-02, C-04, C-05
  - Risks: R-02

- P-03: APGキーボードモデルと roving tabindex を実装する
  - Decision: Arrow/Home/End/Enter/Space/Tab の遷移規則を mode別に明示実装する。
  - Touches:
    - `packages/components/tab/tab.ts`
    - `packages/components/tab/tab.test.ts`
  - Contract: C-03, C-04, C-06, C-07
  - Risks: R-02, R-04

- P-04: 4方向 + reflow のスタイルを実装する
  - Decision: 状態差分は変数再代入中心で構成し、selected mark 位置を orientation依存で切替える。
  - Touches:
    - `packages/components/tab/tab-tokens.ts`
    - `packages/components/tab/tab-styles.ts`
    - `packages/components/tab/tab.test.ts`
  - Contract: C-05, C-08
  - Risks: R-03

- P-05: エクスポートと autoload を接続する
  - Decision: 既存パターンに合わせて `components/index.ts` と `autoload/dads/tab.ts` を追加する。
  - Touches:
    - `packages/components/index.ts`
    - `packages/autoload/dads/tab.ts`
  - Contract: C-09
  - Risks: R-05

- P-06: デモと viewer 導線を追加する
  - Decision: `src/demos.ts` から参照されるデモを追加し、viewer選択肢と import map を更新する。
  - Touches:
    - `src/demos.ts`
    - `src/demos/showcase-navigation.ts`（または新規 `src/demos/tab.ts`）
    - `viewer.html`
  - Contract: C-08, C-09, C-10
  - Risks: R-03, R-05

- P-07: 生成物同期と検証を実施する
  - Decision: 生成物差分は同一PRに含める。
  - Touches:
    - `custom-elements.json`
    - `registry/install-registry.json`（必要時）
  - Contract: C-09
  - Risks: R-05

## 検証計画
- `npm run cem:analyze`
- `npm run validate:wc`
- `npm run test:run -- packages/components/tab/tab.test.ts`（または同等の対象実行）
- `npm run agents:pre-pr`
- `npm run agents:verify`

## 必須テストシナリオ（受け入れ）
- role/ARIA: `tablist/tab/tabpanel` と controls/labelledby の整合。
- roving tabindex: 常に1件のみ `tabindex="0"`。
- keyboard: Arrow, Home/End, Enter/Space, Tab。
- activation-mode: auto/manual の差分挙動。
- orientation: top/bottom/left/right すべて。
- reflow: 折返し時の選択/フォーカス/ARIA整合。
- disabled: フォーカス移動と選択抑止。

## TODO
- [ ] P-01 実施
- [ ] P-02 実施
- [ ] P-03 実施
- [ ] P-04 実施
- [ ] P-05 実施
- [ ] P-06 実施
- [ ] P-07 実施

## Open Issues
- なし

## Revision Log
- 2026-02-24: 初版作成（承認済みPlanを文書化）。
