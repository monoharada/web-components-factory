# UI Pattern Contract（画面/レイアウトのレシピ）

目的：画面パターン（レイアウト/状態/基本構成）を **AI がそのまま取り込み**、必要なコンポーネントを vendor install して UI を組み立てられるようにする。

この repo では、画面パターンを **レシピ（registry）**として管理します。

## Source of Truth

- `registry/pattern-registry.json` を正とする
- CI で `npm run patterns:check` により契約が強制される

## レジストリ形式（schemaVersion=1）

ファイル：`registry/pattern-registry.json`

```json
{
  "schemaVersion": 1,
  "canonicalPrefix": "dads",
  "patterns": {
    "pattern-id": {
      "id": "pattern-id",
      "title": "表示名",
      "description": "短い説明（任意）",
      "requires": ["componentId", "componentId"],
      "html": "<div>...</div>\n"
    }
  }
}
```

### フィールドの意味

- `canonicalPrefix`: パターン内で使う canonical tag prefix（この repo では `dads`）
- `patterns[<id>]`: パターン定義
  - `id`: patternId（key と一致必須）
  - `title`: 人間向けタイトル（必須）
  - `description`: 任意
  - `requires`: 直接必要な `componentId[]`（deps は install-registry から closure で解決される）
  - `html`: **canonical tag（`dads-*`）**で書かれた HTML snippet（必須）

## 制約（AI/移植性のため）

- `html` は **プレーン HTML snippet** とし、`<script>` / `<style>` を含めない
- `html` に **インラインイベントハンドラ**（`on*="..."`）を含めない
- `html` に **危険なURL**（`javascript:`）や `srcdoc=` を含めない
- カスタム要素は **`dads-*` のみ**を使う（prefixed `<myui-*>` は書かない）
  - prefix 変換は MCP 側が行う（`prefix` 引数）

## チェック（CIで強制）

`npm run patterns:check` が以下を検証する：
- JSON の整合性（必須フィールド、id/key一致）
- `requires[]` が `registry/install-registry.json` に存在する
- `html` に未知の custom element がない（CEMで unknownElement=error）
- canonical tag prefix 以外の custom element を含まない
- `<script>` / `<style>` / `on*=` / `javascript:` / `srcdoc=` を含まない

## AI / MCP での利用

- `list_patterns()` で一覧
- `get_pattern_recipe({ patternId, prefix? })` で
  - 必要 componentId（deps closure 含む）
  - prefix 適用済み HTML
  - install 情報（tags/define/deps/source）
  を取得できる

次のステップ（consumer 側）：
1. `wcf add <componentIds...>` を実行
2. 返ってきた snippet を画面へ貼る
3. `validate_markup` / `validate:wc` で検証
