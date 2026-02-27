# @monoharada/wcf-mcp

web-components-factory デザインシステム用の MCP (Model Context Protocol) サーバー。

リポジトリをクローンせずに、AI エージェントからコンポーネントの検索・API取得・バリデーション・パターン生成が行えます。

## クイックスタート

### npx で起動（クローン不要）

```bash
npx @monoharada/wcf-mcp
```

### Claude Desktop で使う

`claude_desktop_config.json` に追加:

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@monoharada/wcf-mcp"]
    }
  }
}
```

### Claude Code で使う

```bash
claude mcp add wcf -- npx @monoharada/wcf-mcp
```

### Cursor で使う

`.cursor/mcp.json` に追加:

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@monoharada/wcf-mcp"]
    }
  }
}
```

### VS Code (GitHub Copilot) で使う

`.vscode/mcp.json` に追加:

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@monoharada/wcf-mcp"]
    }
  }
}
```

### Windsurf で使う

`.windsurf/mcp_config.json` に追加:

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@monoharada/wcf-mcp"]
    }
  }
}
```

## 提供機能（14 tools + 1 prompt + 4 resources）

### ガードレール

| ツール | 説明 |
|--------|------|
| `get_design_system_overview` | 最初に呼ぶ前提情報（カテゴリ別コンポーネント数、利用可能パターン、推奨ワークフロー、IDE設定テンプレート）を返す |

### コンポーネント検索・API

| ツール | 説明 |
|--------|------|
| `list_components` | カテゴリ/クエリ/limit/offset でコンポーネントを段階的に取得（互換維持のため limit 未指定時は全件） |
| `search_icons` | アイコン名をキーワード検索し、usage example を返す |
| `get_component_api` | tagName or className で属性・スロット・イベント・CSS Parts・CSS Custom Properties を取得（`relatedComponents` を含む） |
| `generate_usage_snippet` | コンポーネントの最小限 HTML スニペットを生成 |
| `get_install_recipe` | componentId・依存関係・define関数・インストールコマンドを取得 |

### バリデーション

| ツール | 説明 |
|--------|------|
| `validate_markup` | HTML スニペットを検証し、未知要素（error）・未知属性（warning）・禁止属性/トークン誤用/`aria-live`・`role="alert"` の誤用（warning）を検出し、可能な場合は `suggestion` を返す |

### UI パターン

| ツール | 説明 |
|--------|------|
| `list_patterns` | 利用可能な UI パターン（レシピ）を一覧表示 |
| `get_pattern_recipe` | パターンの完全レシピ（必要コンポーネント・依存解決・HTML）を取得 |
| `generate_pattern_snippet` | パターンの HTML スニペットを生成 |

### トークン・ガイドライン検索

| ツール | 説明 |
|--------|------|
| `get_design_tokens` | デザイントークンを type/category/query/theme で検索（`theme=light` のみ。`dark/all` はエラー） |
| `get_design_token_detail` | 単一トークンの詳細（references/referencedBy/relatedTokens/usageExamples）を取得 |
| `get_accessibility_docs` | component/topic/wcagLevel で A11y チェックリストとガイドライン要点を検索（`topic=all` では両ソースを混在返却） |
| `search_guidelines` | ガイドライン（topic/query）をスコア付きで検索 |

### Prompt

| 名前 | 説明 |
|------|------|
| `figma_to_wcf` | Figma URL を入力に、`overview → tokens → component api → snippet → validate` の実行順を返す |

### Resources (`wcf://`)

| URI | 説明 | データソース | 更新タイミング |
|-----|------|-------------|----------------|
| `wcf://components` | コンポーネントカタログのスナップショット | `data/custom-elements.json` | CEM 更新後に `npm run mcp:build` 実行時 |
| `wcf://tokens` | トークン summary（type/category/themes/sample） | `data/design-tokens.json` | トークン抽出後に `npm run mcp:build` 実行時 |
| `wcf://guidelines/{topic}` | topic 別ガイドライン要約（`accessibility`,`css`,`patterns`,`all`） | `data/guidelines-index.json` | ガイドライン索引更新後に `npm run mcp:build` 実行時 |
| `wcf://llms-full` | `llms-full.txt` の全文 | `data/llms-full.txt` | `npm run llms:generate` 後の `npm run mcp:build` 実行時 |

## transport

標準は stdio です。HTTP transport も利用できます（localhost のみ）。

```bash
npx @monoharada/wcf-mcp --transport=http --port=3100
```

- bind: `127.0.0.1`
- endpoint: `http://127.0.0.1:3100/mcp`

## 設定ファイル（@experimental）

`wcf-mcp.config.json` を使うと、データソース差し替えとカスタムツール追加ができます。

- デフォルト探索パス: カレントディレクトリの `wcf-mcp.config.json`
- 明示指定: `npx @monoharada/wcf-mcp --config=./wcf-mcp.config.json`
- 互換性: 設定ファイルが無ければ従来どおり標準データで起動

`dataSources` の相対パス基準:

- ルート `dataSources`: config ファイルのディレクトリ基準
- `plugins[].staticTools` を持つ static plugin の `dataSources`: config ファイルのディレクトリ基準
- `plugins[].module` が export する plugin の `dataSources`: plugin module ファイルのディレクトリ基準

### config 例

```json
{
  "dataSources": {
    "guidelines-index.json": "./guidelines-index.local.json"
  },
  "plugins": [
    {
      "module": "./plugins/custom-validation-plugin.mjs"
    },
    {
      "name": "static-tools-plugin",
      "version": "0.1.0",
      "staticTools": [
        {
          "name": "plugin_healthcheck",
          "payload": { "ok": true }
        }
      ]
    }
  ]
}
```

※ `./plugins/custom-validation-plugin.mjs` は利用側プロジェクトに配置してください。  
このリポジトリには参照用として `packages/mcp-server/examples/plugins/custom-validation-plugin.mjs` を同梱しています。

### plugin 契約（@experimental）

- `plugins[].name` / `plugins[].version` は必須
- tool 名は組み込みツール名と重複不可（例: `list_components` など）
- `dataSources` で差し替え可能な key は次のみ
  - `custom-elements.json`
  - `install-registry.json`
  - `pattern-registry.json`
  - `design-tokens.json`
  - `guidelines-index.json`

## structuredContent / summary モード

14 tools はすべて `summary?: boolean` を受け付けます（既定: `false`）。

- `summary` 未指定/`false`: 従来どおりの `content`（JSON 文字列または snippet 文字列）を返します
- `summary=true`: `content` は Markdown 要約を返し、同時に `structuredContent` に機械可読 JSON を返します

`structuredContent` のスキーマは共通です。

```json
{
  "type": "application/json",
  "data": { "...": "tool payload" }
}
```

互換性と安全策:

- 100KB 制限を超える場合は自動的に `structuredContent` を省略し、`content` のみ返します
- 緊急切り戻し時は環境変数 `WCF_MCP_DISABLE_STRUCTURED_CONTENT=1` を設定してください

例:

```bash
WCF_MCP_DISABLE_STRUCTURED_CONTENT=1 npx @monoharada/wcf-mcp
```

Claude Desktop 設定例:

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@monoharada/wcf-mcp"],
      "env": {
        "WCF_MCP_DISABLE_STRUCTURED_CONTENT": "1"
      }
    }
  }
}
```

## prefix パラメータ

全ツールで `prefix` パラメータをサポート。デフォルトは `dads`（例: `dads-button`）。
`prefix` は最大64文字まで使用され、超過分は切り詰められます（例: 200文字指定 -> 先頭64文字を採用）。

カスタム prefix を指定すると、出力のタグ名が自動変換されます:

```
prefix: "myui" → dads-button → myui-button
```

## ツール使用例

### コンポーネント API を取得

```json
{
  "name": "get_component_api",
  "arguments": { "tagName": "dads-button" }
}
```

レスポンス:
```json
{
  "tagName": "dads-button",
  "className": "DadsButton",
  "attributes": [
    { "name": "variant", "type": "'solid' | 'outlined' | 'text'" },
    { "name": "size", "type": "'x-small' | 'small' | 'medium' | 'large'" },
    ...
  ],
  "slots": [...],
  "cssParts": [...],
  "cssProperties": [...],
  "events": [...]
}
```

### HTML バリデーション

```json
{
  "name": "validate_markup",
  "arguments": {
    "html": "<dads-button variant=\"solid\" foo=\"bar\">Click</dads-button>"
  }
}
```

レスポンス:
```json
{
  "diagnostics": [
    {
      "severity": "warning",
      "code": "unknownAttribute",
      "message": "Unknown attribute on <dads-button>: foo",
      "attrName": "foo"
    }
  ]
}
```

## 開発者向け

### リポジトリからの起動

```bash
# ルートの依存関係をインストール済みの場合
npm run mcp:design-system

# スタンドアロン版（packages/mcp-server/ 内で完結）
npm run mcp:standalone
```

### データの更新

CEM やレジストリを更新した後:

```bash
npm run mcp:build     # データファイルをパッケージにコピー
npm run mcp:check     # データが最新かチェック（CI用）
```

### パッケージ構成

```
packages/mcp-server/
├── bin.mjs          # エントリポイント (#!/usr/bin/env node)
├── core.mjs         # ツール定義・共通ロジック
├── server.mjs       # MCP サーバー本体
├── validator.mjs    # HTML バリデーター
├── package.json     # npm パッケージ定義
└── data/            # バンドルデータ (npm run mcp:build で生成)
    ├── custom-elements.json
    ├── install-registry.json
    ├── pattern-registry.json
    ├── design-tokens.json
    └── guidelines-index.json
```

## 要件

- Node.js >= 18
