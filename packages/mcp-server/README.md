# @anthropic/wcf-mcp

web-components-factory デザインシステム用の MCP (Model Context Protocol) サーバー。

リポジトリをクローンせずに、AI エージェントからコンポーネントの検索・API取得・バリデーション・パターン生成が行えます。

## クイックスタート

### npx で起動（クローン不要）

```bash
npx @anthropic/wcf-mcp
```

### Claude Desktop で使う

`claude_desktop_config.json` に追加:

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@anthropic/wcf-mcp"]
    }
  }
}
```

### Claude Code で使う

```bash
claude mcp add wcf -- npx @anthropic/wcf-mcp
```

## 提供ツール（11個）

### ガードレール

| ツール | 説明 |
|--------|------|
| `get_design_system_overview` | 最初に呼ぶ前提情報（カテゴリ別コンポーネント数、利用可能パターン、推奨ワークフロー）を返す |

### コンポーネント検索・API

| ツール | 説明 |
|--------|------|
| `list_components` | デザインシステム内の全カスタム要素を一覧表示 |
| `get_component_api` | tagName or className で属性・スロット・イベント・CSS Parts・CSS Custom Properties を取得 |
| `generate_usage_snippet` | コンポーネントの最小限 HTML スニペットを生成 |
| `get_install_recipe` | componentId・依存関係・define関数・インストールコマンドを取得 |

### バリデーション

| ツール | 説明 |
|--------|------|
| `validate_markup` | HTML スニペットを CEM に照合し、未知の要素（error）・属性（warning）を検出 |

### UI パターン

| ツール | 説明 |
|--------|------|
| `list_patterns` | 利用可能な UI パターン（レシピ）を一覧表示 |
| `get_pattern_recipe` | パターンの完全レシピ（必要コンポーネント・依存解決・HTML）を取得 |
| `generate_pattern_snippet` | パターンの HTML スニペットを生成 |

### トークン・ガイドライン検索

| ツール | 説明 |
|--------|------|
| `get_design_tokens` | デザイントークンを type/category/query で検索 |
| `search_guidelines` | ガイドライン（topic/query）をスコア付きで検索 |

## transport

標準は stdio です。HTTP transport も利用できます（localhost のみ）。

```bash
npx @anthropic/wcf-mcp --transport=http --port=3100
```

- bind: `127.0.0.1`
- endpoint: `http://127.0.0.1:3100/mcp`

## prefix パラメータ

全ツールで `prefix` パラメータをサポート。デフォルトは `dads`（例: `dads-button`）。

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
      "tagName": "dads-button",
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
