# AI ドキュメント運用ガイド

## 概要

本プロジェクトでは、AIエージェント（LLM）向けのドキュメントを3層構造で提供しています。

| ファイル | 用途 | 更新タイミング |
|---------|------|---------------|
| `llms.txt` | プロジェクト概要・コンポーネント一覧（手動管理） | 新コンポーネント追加/大きなアーキテクチャ変更時 |
| `llms-full.txt` | 全コンポーネントAPI詳細（自動生成） | CEM更新時に自動再生成 |
| `docs/llms/*.md` | コンポーネント別APIリファレンス（自動生成） | CEM更新時に自動再生成 |

## 生成コマンド

```bash
# llms-full.txt と docs/llms/*.md を CEM から再生成
npm run llms:generate

# 差分チェック（CI用）
npm run llms:check
```

## 更新フロー

### コンポーネントの属性・スロット・パートを変更した場合

1. `npm run cem:analyze` で custom-elements.json を更新
2. `npm run llms:generate` で AI ドキュメントを再生成
3. 差分を確認してコミット

### 新規コンポーネントを追加した場合

1. `npm run cem:analyze` で custom-elements.json を更新
2. `npm run llms:generate` で AI ドキュメントを再生成
3. `llms.txt` のコンポーネント一覧セクションに手動で新エントリを追加
4. `scripts/llms/generate-llms-docs.mjs` の `CATEGORY_MAP` に新タグのカテゴリを追加
5. 差分を確認してコミット

### PR前の必須確認

```bash
npm run llms:check  # AI ドキュメントが最新か確認
```

`agents:pre-pr` パイプラインに組み込む場合は、`package.json` の `agents:pre-pr` スクリプトに追加してください。

## ファイル構造

```
/
├── llms.txt                    # P0: 概要（手動管理、~10KB以内を推奨）
├── llms-full.txt               # P1: 完全APIリファレンス（自動生成）
├── docs/
│   └── llms/
│       ├── index.md            # P2: コンポーネント一覧インデックス
│       ├── button.md           # コンポーネント別ドキュメント
│       ├── input-text.md
│       └── ...                 # (CEM内の全コンポーネント)
└── scripts/
    └── llms/
        └── generate-llms-docs.mjs  # 生成スクリプト
```

## llms.txt 仕様準拠

[llms.txt 仕様](https://llmstxt.org/) に基づき:

- H1 でプロジェクト名を宣言
- blockquote で簡潔なプロジェクト概要
- Markdown 形式（text/markdown）
- 全体を10,000トークン以内に収める
- リンク先もすべて text/markdown または text/plain

## MCP サーバーとの関係

`scripts/mcp/design-system-mcp.mjs` は CEM から動的にAPIを提供しますが、
llms.txt / llms-full.txt はMCPが使えない環境（静的ファイルアクセスのみ）向けのフォールバックです。

| 手段 | 動的 | 前提 |
|------|------|------|
| MCP server | Yes | Node.js + stdio transport |
| llms-full.txt | No | ファイルアクセスのみ |
| docs/llms/*.md | No | ファイルアクセスのみ |

## カテゴリ分類ルール

`CATEGORY_MAP` のカテゴリ:

| Category | 対象 |
|----------|------|
| Form | 入力要素（input-text, textarea, select, checkbox, radio, switch, combobox, date-picker, file-upload, fieldset, search-box, calendar） |
| Actions | 操作系（button, dialog, drawer, disclosure, accordion） |
| Navigation | ナビ系（breadcrumb, page-navigation, step-navigation, menu-list系, global-menu, language-selector, hamburger-menu-button, utility-link, mobile-menu） |
| Content | コンテンツ表示（card, heading, text, blockquote, code-block, divider, list, description-list, resource-list, table系） |
| Display | 表示専用（avatar, icon, chip-label, chip-tag, notification-banner, emergency-banner, carousel） |
| Layout | レイアウト（layout-shell, layout-sidebar, layout-aside, header-container） |
