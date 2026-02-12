# WCF Skills Pack v1

`wcf-*` Skills は、WCFのUI構築を以下の4段階で実行するための分割パックです。

1. `wcf-discovery`
2. `wcf-install`
3. `wcf-compose`
4. `wcf-validate`

SoTは `.claude/skills/*` です。

## 対応クライアント（v1）

- Codex
- Claude Code
- Cursor

## 使い分け

- 入口は `wcf-ui-builder`
- 要件整理/選定は `wcf-discovery`
- 導入コマンド生成は `wcf-install`
- 画面マークアップ生成は `wcf-compose`
- 検証と修正提案は `wcf-validate`

## 共通契約

### 出力形式

各Skillは必ず次を返します。

1. 人間向けMarkdown要約
2. JSONブロック（機械可読）

### 共通エラーカテゴリ

- `*_MCP_UNAVAILABLE`
- `*_REGISTRY_UNAVAILABLE`
- `*_PREFIX_MISMATCH`
- `*_INSUFFICIENT_INPUT`

### 共通フォールバック

MCPが使えない場合は `registry/install-registry.json` と `custom-elements.json` を使った最小提案に降格します。

## Codex での導入

```bash
npm run codex:install-skills
```

確認:

```bash
ls -la ~/.codex/skills/wcf-ui-builder
ls -la ~/.codex/skills/wcf-discovery
ls -la ~/.codex/skills/wcf-install
ls -la ~/.codex/skills/wcf-compose
ls -la ~/.codex/skills/wcf-validate
```

Design System MCP を使う場合は `~/.codex/config.toml` に次を追加します。

```toml
[mcp_servers.wcf_design_system]
command = "node"
args = ["scripts/mcp/design-system-mcp.mjs"]
```

## Claude Code での導入

プロジェクトの `.mcp.json` に次を追加します。

```json
{
  "mcpServers": {
    "wcf-design-system": {
      "command": "node",
      "args": ["scripts/mcp/design-system-mcp.mjs"]
    }
  }
}
```

## Cursor での導入

プロジェクトの `.cursor/mcp.json` に次を追加します。

```json
{
  "mcpServers": {
    "wcf-design-system": {
      "command": "node",
      "args": ["scripts/mcp/design-system-mcp.mjs"]
    }
  }
}
```

## Claude Code / Cursor 共通運用

1. `wcf-ui-builder` を入口にする。
2. 4 Skillを段階的に呼び出す。
3. 最後に `wcf-validate` で品質ゲートを通す。

## 推奨実行フロー

1. `wcf-discovery` で `componentIds` を確定
2. `wcf-install` で `wcf init` / `wcf add` を確定
3. `wcf-compose` で4状態込みHTMLを生成
4. `wcf-validate` で検証と修正提案

## 品質ゲート

### 日常

```bash
npm run validate:wc
npm run agents:pre-pr
```

### PR前必須

```bash
npm run agents:verify
```

## 運用メトリクス（GitHub Issues）

`wcf-skills-metrics` テンプレートで週次記録します。

収集項目:

- 依頼件数
- 一発成功率
- 失敗コード分布
- 再試行回数

## リリース方針

- v1.0.0: GitHub配布（正規）
- v1.1.0+: npm配布を追加予定
