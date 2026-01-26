# Disclosure（ディスクロージャー）実装Plan（承認済み）

承認: 2026-01-26（open属性採用 / back-linkはスロット提供で未指定時は非表示）
追記: 2026-01-26（viewerデモで open/close で位置が動く件は、閉じた状態も左揃えで固定する）

## 目標
- DADS準拠の `dads-disclosure` を追加し、**アクセシビリティ注釈**と**コントローラブルな API テーブル**（viewer）を必須要件として満たす。

## 背景
- 参照（Figma）:
  - https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8268-2899&m=dev
  - https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8194-8511&p=f&m=dev
- 参照（DADS docs）:
  - https://design.digital.go.jp/dads/html/?path=/docs/components-%E3%83%87%E3%82%A3%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC--docs
- 参照（公式HTML実装）:
  - https://github.com/digital-go-jp/design-system-example-components-html/tree/main/src/components/disclosure

## スコープ
- やること：
  - `dads-disclosure` の追加（tokens/styles/define/autoload/test）
  - `src/demos.ts` と `viewer.html` に **a11y注釈 + API/Controlsテーブル** を追加
  - CEM（`custom-elements.json`）更新と `validate:wc` パス
- やらないこと：
  - 既存コンポーネントの仕様変更
  - Storybook導入や大規模なドキュメント基盤変更

## 前提 / 制約
- CEM（`custom-elements.json`）が単一の真実。`npm run cem:analyze` で更新しコミットする。
- viewer では `src/demos.ts` に **操作可能な API/Controls テーブル** を追加する（`docs/knowledge/viewer-api-controls-table.md` 準拠）。
- CSSは `::part()` と `--dads-*` をスタイリングAPIとして設計する。
- back-link は **slotで任意提供**し、未指定ならUIとして表示しない。
- 開閉状態の公開APIは `open`（boolean attr/prop）とする。

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- `dads-disclosure`
  - 内部は `<details>/<summary>` を使用
  - `open` 属性と内部 `details.open` を同期
  - hostから `toggle` イベントを `bubbles: true` で再送出
  - `slot="summary"` / `slot="content"` / `slot="back-link"`（back-link は未指定時非表示）
  - DADS HTML版の `disclosure.css` をShadow DOM向けに移植（`part` + トークン化）
  - `static a11yAnnotations`（categories + callouts）

### その他（Docs/Marketing/Infra など）
- viewer:
  - `src/demos.ts` に `disclosure` デモ追加（a11y注釈 + API/Controls）
  - `viewer.html` にセレクタ/ importmap 追加
- autoload/export:
  - `packages/autoload/dads/disclosure.ts`
  - `packages/components/index.ts` でexport
- テスト:
  - open同期、toggleイベント、back-link表示条件、click時スクロール+focus（reduced motion考慮）をカバー

## 受入基準
- [ ] `dads-disclosure` が追加され、autoload/importmap経由で viewer で表示できる
- [ ] `src/demos.ts` に **アクセシビリティ注釈**（`a11y-annotate`）セクションがある
- [ ] `src/demos.ts` に **API / Controls テーブル**があり、`open` と `--dads-disclosure-*` がライブ編集できる
- [ ] viewerデモで open/close による横方向の位置ズレが発生しない（閉じた状態も左揃え）
- [ ] JSDoc（`@customElement` / `@tagname` / `@slot` / `@csspart` / `@attr` / `@fires`）が揃い、CEMに反映される
- [ ] `npm run cem:analyze` → `custom-elements.json` 更新
- [ ] `npm run validate:wc` がパス
- [ ] `npm run ci` がパス

## 作業項目（Action items）
1. `packages/components/disclosure/` 追加（完了条件: `defineDisclosure()` で登録できる）
2. `packages/autoload/dads/disclosure.ts` 追加（完了条件: `import('dads-disclosure')` でdefineされる）
3. export追加（完了条件: `packages/components/index.ts` に含まれる）
4. viewer更新（完了条件: `viewer.html` セレクタ/ importmap が更新される）
5. demos追加（完了条件: a11y注釈 + API/Controls が動く）
6. unit test 追加（完了条件: 主要挙動がパス）
7. CEM/validate/CI 実行（完了条件: `cem:analyze` / `validate:wc` / `ci` がパス）
