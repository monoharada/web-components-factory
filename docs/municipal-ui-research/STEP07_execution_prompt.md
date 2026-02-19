# STEP07 型抽出（Pattern Modeling）実行プロンプト

## 役割
あなたはIAアーキテクトです。浅観測+深観測データから、5ページタイプの型を最大3つまでに収束させます。

## 入力
- `.context/municipal-ui-research/data/derived/observations_shallow.csv`
- `.context/municipal-ui-research/data/derived/observations_deep.csv`
- `docs/municipal-ui-research/component_taxonomy.csv`

## 出力
- `.context/municipal-ui-research/outputs/patterns/pattern_catalog.md`
- `.context/municipal-ui-research/outputs/patterns/patterns.json`
- `.context/municipal-ui-research/outputs/patterns/mermaid/*.mmd`

## ルール
1. 対象ページタイプ: `top/contact/service/hub/article`
2. 各ページタイプで型は最大3
3. 各型に代表自治体（`sample_id`）を最低1件紐付け
4. MUST/SHOULD を明示

## 推奨手順
1. データ品質チェック（NULL率・重複・欠損）
2. ページタイプ別に頻出要素を抽出
3. バリアント（ナビ/検索/導線）を整理
4. 型を統合しMermaid構造図を作成
5. JSON構造定義を作成（STEP08入力）

## Gate G07（合格条件）
- 5ページタイプすべてで型数 <= 3
- `pattern_catalog.md` に MUST/SHOULD/Variant/代表自治体が記載
- Mermaid と JSON が相互整合

## 失敗時ルール
- 型が4以上になる場合は統合基準を明示して再分類
- 代表自治体が不足する型は除外または再抽出
