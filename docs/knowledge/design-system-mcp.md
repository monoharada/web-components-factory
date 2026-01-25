# Design System MCP（stdio）

この repo には、`custom-elements.json`（CEM）を読み込み、Design System 向けの “skills（安定した道具）” を提供する **MCP サーバー**を同梱しています。

## 起動

```bash
npm run mcp:design-system
```

MCP クライアント側からは、stdio サーバーとして次のように登録します（例）:

```json
{
  "command": "node",
  "args": ["scripts/mcp/design-system-mcp.mjs"]
}
```

## 提供 tools（最小セット）

### `list_components({ prefix? })`

コンポーネント一覧を返します。

- `prefix` を指定すると、`dads-*` の tagName を `<prefix>-*` に置換した形で返します

### `get_component_api({ tagName?, className?, prefix? })`

単一コンポーネントの API を返します（attributes / slots / events / cssParts）。

### `generate_usage_snippet({ component, prefix? })`

指定コンポーネントの最小 usage snippet を返します。

### `validate_markup({ html, prefix? })`

HTML 断片を CEM と突き合わせて検証し、diagnostics を返します。

- `unknownElement`: `error`
- `unknownAttribute`: `warning`

## wctools MCP / language server との違い

- wctools / language server: CEM を中心にした汎用ツール（ドキュメント/補完/検証）
- この DS-MCP: **この repo 固有の前提（prefix 戦略、viewer 運用、usage snippet 生成、validate など）**まで含めた “設計システム専用スキル”

