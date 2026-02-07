# AI Consumption Guide（CEM-first）

この repo では、AI（Codex / Claude Code 等）がコンポーネントの「一覧・API・使い方・インストール手順」を安定して理解できるよう、**CEM（`custom-elements.json`）を単一の真実**として運用します。

## 1) AI はまず CEM を読む

推奨フロー：
1. `custom-elements.json` を読む（tagName / attributes / slots / events / cssParts）
2. `decl.custom.install` を読む（componentId / deps / define / source）
3. 必要なら MCP を使って “install recipe + snippet” を取得する

## 2) `decl.custom.install`（vendor install / recipe）

`tagName` が `dads-*` の custom element declarations には、CEM 生成時に次が注入されます：
- `decl.custom.componentId`
- `decl.custom.install`
  - `id` / `tags` / `define` / `call` / `deps` / `source.componentDir`

この情報だけで、AI は「どのコンポーネントを追加すべきか」「依存関係は何か」「どこから持ってくるか」を決定できます。

## 2.1) 軽量レジストリ（AI/CLI向け）

`custom-elements.json` は情報量が多いため、AI/CLI が「何を入れればよいか（deps/define/call/source/tags）」だけを高速に取得できるように、`registry/install-registry.json` を提供します。

- 生成元: `custom-elements.json`（`decl.custom.install` から抽出）
- 生成: `npm run registry:generate`
- チェック: `npm run registry:check`（CIで強制）
- 公開: `registry/install-registry.json` はコミット運用（`raw.githubusercontent.com` / jsDelivr 等で取得可能）
  - 例：`https://raw.githubusercontent.com/<owner>/<repo>/<ref>/registry/install-registry.json`

### 何が入っているか

- `components[componentId] = { id, tags, define, call, deps, source }`
- `tags[tagName] = componentId`

AI はまずこの軽量レジストリで “必要な部品の集合” を決め、詳細が必要になったときだけ `custom-elements.json` を参照します。

## 2.2) UI パターン（画面/レイアウトのレシピ）

コンポーネント単体に加えて、画面/レイアウトの “組み方” を AI が再利用できるように、`registry/pattern-registry.json` に **UI パターン（レシピ）**を持ちます。

- 取得: MCP `list_patterns` / `get_pattern_recipe`
- インストール: recipe の `components[]` を `wcf add ...` に渡す

## 3) MCP（Design System MCP）

起動：
```bash
npm run mcp:design-system
```

### 代表的な tools
- `list_components({ prefix? })`
  - コンポーネント一覧
- `get_component_api({ tagName?, className?, prefix? })`
  - API（attributes/slots/events/cssParts）
- `generate_usage_snippet({ component, prefix? })`
  - 最小の usage snippet
- `get_install_recipe({ component, prefix? })`
  - install recipe（componentId / deps / define / usageSnippet）
- `validate_markup({ html, prefix? })`
  - HTML 断片の検証（unknownElement=error, unknownAttribute=warning）

## 4) 新規コンポーネント追加時の注意

新規コンポーネントは `docs/rules/new-component-dod.md` に従い、少なくとも以下を満たしてください：
- `npm run cem:analyze` 後、`decl.custom.install` が注入されている
- `npm run contracts:check` がパスする
