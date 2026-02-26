# MCP Server Upgrade - Scope

## In Scope

- core.mjs 抽出 (server.mjs + design-system-mcp.mjs の共通ロジック)
- HTTP transport (127.0.0.1 のみ、ローカル開発用)
- get_design_tokens ツール (色、スペーシング、タイポグラフィ、radius、shadow)
- search_guidelines ツール (Markdown ドキュメント全文検索)
- ビルドパイプライン更新 (トークン抽出、ガイドラインインデックス)
- テスト追加

## Out of Scope

- リモートデプロイ対応
- 認証・認可
- トークン自動同期 (手動ビルド)
- ガイドラインの多言語対応
- SSE transport (StreamableHTTP のみ)
- パフォーマンス最適化 (インデックスサイズ最適化等)
