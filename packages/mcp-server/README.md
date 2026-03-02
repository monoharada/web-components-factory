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
| `list_components` | カテゴリ/クエリ/limit/offset でコンポーネントを段階的に取得（デフォルト20件。全件取得は `limit: 200`） |
| `search_icons` | アイコン名をキーワード検索し、usage example を返す |
| `get_component_api` | tagName or className で属性・スロット・イベント・CSS Parts・CSS Custom Properties を取得（`relatedComponents` を含む） |
| `generate_usage_snippet` | コンポーネントの最小限 HTML スニペットを生成 |
| `get_install_recipe` | componentId・依存関係・define関数・インストールコマンドを取得 |

### バリデーション

| ツール | 説明 |
|--------|------|
| `validate_markup` | HTML スニペットを検証し、セマンティック検証（下表）で `suggestion` 付き診断を返す |

#### validate_markup 検出コード一覧

| Code | Severity | 説明 | 例 |
|------|----------|------|----|
| `unknownElement` | error | CEM に未登録のカスタム要素。prefix 補完提案あり | `<input-text>` → `dads-input-text` |
| `unknownAttribute` | warning | CEM に未登録の属性 | `<dads-button foo="x">` |
| `invalidEnumValue` | error | enum 属性に不正な値 | `type="banana"` |
| `invalidSlotName` | error | CEM に未登録のスロット名 | `slot="nonexistent"` |
| `missingRequiredAttribute` | error | フォーム要素の必須属性欠落 | `<dads-input-text>` without `label` |
| `orphanedChildComponent` | warning | 親要素なしの子コンポーネント | `<dads-breadcrumb-item>` without `<dads-breadcrumb>` |
| `emptyInteractiveElement` | warning | accessible name が空の操作要素 | `<dads-button></dads-button>` |
| `canonicalLowercaseRecommendation` | warning | 大文字を含む属性名（lowercase が canonical） | `Variant="solid"` → `variant` |
| `tokenMisuseInInlineStyles` | warning | inline style でのトークン誤用 | `color: #000` → `var(--color-*)` |
| `ariaLiveNotRecommended` | warning | `aria-live` の使用（DADS 非推奨） | `aria-live="polite"` |
| `roleAlertNotRecommended` | warning | `role="alert"` の使用（DADS 非推奨） | `role="alert"` |
| `forbiddenAttribute` | warning | 禁止属性 | `placeholder` |

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

#### `get_design_tokens` の使用例

**リクエスト:**
```json
{
  "name": "get_design_tokens",
  "arguments": {
    "type": "color",
    "category": "semantic",
    "theme": "light"
  }
}
```

**レスポンス（抜粋）:**
```json
{
  "summary": {
    "totalCount": 42,
    "types": { "color": 42 }
  },
  "tokens": [
    {
      "name": "--color-primary",
      "type": "color",
      "category": "semantic",
      "value": "#0017C1",
      "cssVariable": "var(--color-primary)"
    }
  ],
  "themes": {
    "requested": "light",
    "resolved": "light",
    "available": ["light"]
  }
}
```

#### `get_design_token_detail` の使用例

**リクエスト:**
```json
{
  "name": "get_design_token_detail",
  "arguments": {
    "name": "--color-primary",
    "theme": "light"
  }
}
```

**レスポンス（抜粋）:**
```json
{
  "token": {
    "name": "--color-primary",
    "type": "color",
    "category": "semantic",
    "value": "#0017C1",
    "cssVariable": "var(--color-primary)",
    "group": "color"
  },
  "references": [
    { "name": "--primitive-blue-700", "type": "color", "category": "primitive" }
  ],
  "referencedBy": [
    { "name": "--button-primary-bg", "type": "color", "category": "semantic" }
  ],
  "relatedTokens": ["--button-primary-bg"],
  "usageExamples": [
    ".example { color: var(--color-primary); }",
    ".example { background-color: var(--color-primary); }"
  ],
  "theme": {
    "requested": "light",
    "resolved": "light",
    "available": ["light"]
  }
}
```

> **注意**: `theme` は `"light"` のみサポート。`"dark"` や `"all"` を指定すると `INVALID_THEME` エラーが返ります。

### Prompt

| 名前 | 説明 |
|------|------|
| `figma_to_wcf` | Figma URL を入力に、`overview → tokens → component api → snippet → validate` の実行順を返す |

### Resources (`wcf://`)

| URI | 説明 |
|-----|------|
| `wcf://components` | コンポーネントカタログのスナップショット |
| `wcf://tokens` | トークン summary（type/category/themes/sample） |
| `wcf://guidelines/{topic}` | topic 別ガイドライン要約（`accessibility`,`css`,`patterns`,`all`） |
| `wcf://llms-full` | `llms-full.txt` の全文 |

### Figma MCP との併用

Figma Dev Mode MCP Server (`@anthropic/figma-dev-mode-mcp-server`) と wcf-mcp を並行で利用すると、Figma デザインから WCF コンポーネントへの変換ワークフローが実現できます。

**推奨ワークフロー:**

1. **Figma MCP** → `get_design_context` でデザインの構造・カラー・スペーシングを取得
2. **wcf-mcp** → `get_design_system_overview` で利用可能なコンポーネントを確認
3. **wcf-mcp** → `get_design_tokens` で Figma カラー値に対応するトークンを検索
4. **wcf-mcp** → `get_component_api` でコンポーネント仕様を取得
5. **wcf-mcp** → `generate_usage_snippet` でコード生成
6. **wcf-mcp** → `validate_markup` で生成コードを検証

**Claude Desktop 設定例:**

```json
{
  "mcpServers": {
    "wcf": {
      "command": "npx",
      "args": ["@monoharada/wcf-mcp"]
    },
    "figma": {
      "command": "npx",
      "args": ["@anthropic/figma-dev-mode-mcp-server"]
    }
  }
}
```

> `figma_to_wcf` プロンプトは wcf-mcp に組み込まれており、Figma URL を入力として上記ワークフローの実行順序をガイドします。

## transport

標準は stdio です。HTTP transport も利用できます（localhost のみ）。

```bash
npx @monoharada/wcf-mcp --transport=http --port=3100
```

- bind: `127.0.0.1`
- endpoint: `http://127.0.0.1:3100/mcp`

## 設定ファイル

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

### plugin 契約（v1）

詳細仕様: [docs/plugin-contract-v1.md](../../docs/plugin-contract-v1.md)

- `plugins[].name` / `plugins[].version` は必須
- tool 名は組み込みツール名と重複不可（例: `list_components` など）
- `dataSources` で差し替え可能な key は次のみ
  - `custom-elements.json`
  - `install-registry.json`
  - `pattern-registry.json`
  - `design-tokens.json`
  - `guidelines-index.json`

## structuredContent rollback

`get_component_api` / `get_design_tokens` / `get_design_token_detail` / `get_accessibility_docs` / `search_guidelines` は通常 `structuredContent` を返します。

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

## v0.3.0 新機能 — ランタイムセットアップ情報

v0.3.0 では、AI エージェントが CDN 非対応の vendor-local 配信モデルを正しく理解できるよう、3つのツールにランタイムセットアップ情報を追加しました。

### `get_design_system_overview` — setupInfo 新フィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `noCDN` | `true` | CDN 配信が利用不可であることを示すフラグ |
| `deliveryModel` | `"vendor-local"` | 配信モデルの種別（将来拡張可能） |
| `importMapHint` | `string` | import map のパターン説明 |
| `bootScript` | `string` | boot.js の役割説明 |
| `vendorSetup` | `object` | `init`/`add`/`workflow` の2段階セットアップガイド |
| `htmlSetup` | `string` | import map + boot.js を含む完全な HTML head テンプレート |

> 既存の `htmlBoilerplate` は変更なし（後方互換性）

### `get_install_recipe` — 新フィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `usageContext` | `"body-only"` | `usageSnippet` が body 用 HTML であることを明示 |
| `vendorHint` | `object` | `install`（CLI コマンド）、`importMap`（テンプレート）、`boot`（ブートスクリプト説明）。`importmap`（小文字 m）は非推奨エイリアス — v1.0 で削除予定 |

### `get_pattern_recipe` — 新フィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `entryHints` | `string[]` | パターンのエントリポイント（`["boot"]` など） |
| `scaffoldHint` | `object` | `doctype`、`importMap`、`bootScript`、`noscript`、`serveOverHttp` を含むページ雛形情報 |

> `scaffoldHint.serveOverHttp` は `file://` プロトコルでの実行を防止するガイダンスです。

## v0.2.0 マイグレーション

### `list_components` のデフォルトページネーション変更

v0.2.0 から `list_components` のデフォルト返却件数が **全件 → 20件** に変更されました。

- `limit` を省略すると 20件が返り、`_notice` フィールドで変更を通知します
- 全件取得が必要な場合: `limit: 200` を指定してください
- `hasMore: true` の場合、`offset` で次のページを取得できます

```json
// 全件取得
{ "name": "list_components", "arguments": { "limit": 200 } }
// ページネーション
{ "name": "list_components", "arguments": { "limit": 20, "offset": 20 } }
```

## ツール使用例

### コンポーネント一覧を取得

```json
{
  "name": "list_components",
  "arguments": { "category": "Form", "limit": 20 }
}
```

レスポンス（抜粋）:
```json
{
  "items": [
    { "tagName": "dads-input-text", "className": "DadsInputText", "category": "Form" },
    { "tagName": "dads-textarea", "className": "DadsTextarea", "category": "Form" }
  ],
  "total": 8,
  "limit": 20,
  "offset": 0,
  "hasMore": false
}
```

### コンポーネント API を取得

```json
{
  "name": "get_component_api",
  "arguments": { "tagName": "dads-button" }
}
```

レスポンス（抜粋）:
```json
{
  "tagName": "dads-button",
  "className": "DadsButton",
  "attributes": [
    { "name": "variant", "type": "'solid' | 'outlined' | 'text'" },
    { "name": "size", "type": "'x-small' | 'small' | 'medium' | 'large'" }
  ],
  "slots": [...],
  "cssParts": [...],
  "cssProperties": [...],
  "events": [...]
}
```

### 使い方スニペットを生成

```json
{
  "name": "generate_usage_snippet",
  "arguments": { "component": "dads-button" }
}
```

レスポンス（テキスト形式 — HTML スニペットをそのまま返します）:
```html
<dads-button variant="solid">Label</dads-button>
```

### インストール手順を取得

```json
{
  "name": "get_install_recipe",
  "arguments": { "component": "dads-combobox" }
}
```

レスポンス（抜粋）:
```json
{
  "componentId": "combobox",
  "tagNames": ["dads-combobox"],
  "deps": ["avatar", "chip-tag", "icon"],
  "transitiveDeps": ["avatar", "chip-tag", "icon"],
  "define": "defineCombobox",
  "installHint": "wcf add combobox"
}
```

> `transitiveDeps` は BFS で解決された全推移的依存（自身を除く）の配列です。

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

### ガイドライン検索

```json
{
  "name": "search_guidelines",
  "arguments": { "query": "keyboard", "topic": "accessibility" }
}
```

レスポンス（抜粋）:
```json
{
  "query": "keyboard",
  "topic": "accessibility",
  "totalHits": 3,
  "results": [
    {
      "score": 5,
      "title": "Keyboard Navigation",
      "topic": "accessibility",
      "heading": "Keyboard Navigation",
      "snippet": "All interactive elements must be operable via keyboard..."
    }
  ]
}
```

## スニペット vs レシピ

| 用途 | ツール | 返すもの |
|------|--------|----------|
| 最小限 HTML を素早く確認 | `generate_usage_snippet` | 単一コンポーネントの HTML 断片 |
| 画面パターン全体を構築 | `get_pattern_recipe` | 必要コンポーネント群 + 依存解決 + 完全 HTML |

**使い分け**: 1 コンポーネントだけ使う場合は `generate_usage_snippet`。複数コンポーネントを組み合わせた UI パターン（フォーム、カード一覧など）には `get_pattern_recipe` を使用。

## noscript ガイダンス

WCF コンポーネントは JavaScript が必須です。`<noscript>` タグを使い、JavaScript 無効環境に対してフォールバックを提供してください。

```html
<noscript>
  <p>このページは JavaScript を有効にする必要があります。</p>
</noscript>
```

`get_design_system_overview` の `setupInfo.noscriptGuidance` にも同様の案内が含まれています。

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
