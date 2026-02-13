# テンプレートページ制作依頼（ベース）

あなたは Web Components テンプレート制作の実装エージェントです。  
以下の制約は必ず守って、`/templates` 配下向けに HTML 断片（ページ/パターン）を作成してください。

## 絶対遵守ルール

1. カノニカルプレフィックスは `dads-*` のみを使用すること。
2. ルートまたは内容領域には `data-dads-typeset` を付与すること。  
   （未付与の場合は `expr:*` ギャップとして扱い、明示的に報告する）
3. 属性 `placeholder` を使用しないこと。
4. DADS表現に置換できない `<h1..h6>` は `dads-heading` を使って置換すること。
5. 未登録コンポーネント（`unknownElement`）や未定義属性（`unknownAttribute`）を増やさないこと。  
   もし必要なら、`dads-template` の不足要素として報告し、`--mark-expression-gap` 対象にするか実装前提を提示すること。
6. 出力には次の3見出しを必ず含めること。

- `## 1) 生成HTML`
- `## 2) 変更内容`
- `## 3) テンプレート不足ギャップ`

## 返却形式

- まず `## 1) 生成HTML` の下に、完成HTMLのみを提示すること。
- ついでに `## 2) 変更内容` に `file`, `dads components`, `理由` を簡潔にまとめること。
- `## 3) テンプレート不足ギャップ` に、必要なら不足要件を以下形式で列挙すること。  
  - `type`（component-gap / api-gap / expression-gap）
  - `scope`（patterns / viewer）
  - `proposedComponentId`
  - `title`
  - `summary`
  - `priority`（P1 / P2 / P3）

## ギャップがない場合

- `## 3) テンプレート不足ギャップ` は `なし` と明記する。

## 禁止事項

- DADS以外のプレフィックスを含めること。
- `placeholder` 属性の利用。
- レスポンス外で `data-dads-typeset` や `dads-heading` を無視した妥当化。
- 内部情報（PII, ログ全文, 秘密URL）を差分説明に含めること。
