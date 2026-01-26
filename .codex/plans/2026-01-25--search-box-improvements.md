# 検索ボックス（`dads-search-box`）改善 Plan

## 目的
- viewer デモ/実装のフィードバックを反映し、仕様を **シンプルで拡張しやすい形**に整理する
- 「検索対象なし」時に検索対象 UI（select）が残る問題を解消する
- placeholder と disabled（非活性）を **API/デモ/実装から除外**する
- API テーブル（属性/イベント/parts/CSS vars）を viewer デモに追加する

## 背景（フィードバック）
- 「検索対象なしで対象プルダウンが残ってしまっている」
- 「プレースホルダーはいらない」
- 「非活性は不要で良い」
- 「APIテーブルがない」

## 対応方針
### 1) 検索対象 UI の表示制御
- Light DOM に `option/optgroup` が存在する場合のみ scope select UI を表示する
- 実装は `data-has-scope` のような内部 state を使い、CSS で `display:none` を確実化する（`hidden` 依存にしない）

### 2) placeholder を廃止
- `placeholder` 属性/プロパティ・関連 CSS 変数・デモ記述を削除する
- 代わりにアクセシブルネームは `label` / `aria-label` / `aria-labelledby` で担保する（既存の a11yAnnotations 方針は維持）

### 3) disabled（非活性）を廃止
- `disabled` 属性/プロパティ・状態スタイル・デモ記述を削除する
- v1 では「無効状態」のスタイリング/挙動を提供しない（必要になったら別途設計→再承認）

### 4) API テーブルを viewer デモに追加
- 既存の viewer の API 表示コンポーネント（`wc-api-table` 等）に合わせて以下を掲載する
  - Attributes/Properties
  - Events
  - CSS Parts
  - CSS Custom Properties（`--dads-search-box-*`）

## 変更対象（想定）
- `packages/components/search-box/search-box.ts`
- `packages/components/search-box/search-box-styles.ts`
- `packages/components/search-box/search-box-tokens.ts`
- `packages/components/search-box/search-box.test.ts`
- `src/demos.ts`
- `custom-elements.json`（`npm run cem:analyze` で更新）

## 受入基準
- [ ] 「検索対象なし」例で scope select UI が表示されない
- [ ] `placeholder`/`disabled` が CEM とデモから消える
- [ ] API テーブルが viewer デモに表示される（属性/イベント/parts/CSS vars）
- [ ] `npm run validate:wc` が通る
- [ ] `npm run ci` が通る

## 検証コマンド
- `npm run cem:analyze`
- `npm run validate:wc`
- `npm run ci`

