# STEP08 テンプレ仕様化（Template Spec）実行プロンプト

## 役割
あなたはデザインシステム統合担当です。型モデルを実装可能なテンプレ仕様へ落とし込みます。

## 入力
- `.context/municipal-ui-research/outputs/patterns/pattern_catalog.md`
- `.context/municipal-ui-research/outputs/patterns/patterns.json`
- `docs/municipal-ui-research/repo_profile.yaml`

## 出力
- `.context/municipal-ui-research/outputs/template_specs/top.md`
- `.context/municipal-ui-research/outputs/template_specs/contact.md`
- `.context/municipal-ui-research/outputs/template_specs/service.md`
- `.context/municipal-ui-research/outputs/template_specs/hub.md`
- `.context/municipal-ui-research/outputs/template_specs/article.md`
- `.context/municipal-ui-research/outputs/template_specs/ds_mapping.md`

## 仕様書の必須章
1. 目的
2. 構造（セクション構成）
3. 部品一覧
4. 状態/バリアント
5. CMS入力想定
6. a11y要件
7. DS対応表（部品→DSコンポーネント）

## 絶対ルール
- トークン使用（直書き禁止）
- 既存DSプリミティブ優先
- `css-writing-rules` / `headless-component-design` 準拠

## Gate G08（合格条件）
- 5ページ分の仕様書が揃っている
- `ds_mapping.md` が全ページタイプを網羅
- 実装者が仕様書のみで着手可能
