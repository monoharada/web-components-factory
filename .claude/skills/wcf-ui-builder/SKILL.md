---
name: wcf-ui-builder
description: wcfのUI構築を discovery/install/compose/validate の4Skillでオーケストレーションする入口スキル。Use when (1) 画面要件から実装まで一貫して進めたい, (2) どのwcf-* skillを使うべきか迷う, (3) 検証ゲート込みで完了させたい。
---

# wcf-ui-builder

目的: `wcf-discovery` / `wcf-install` / `wcf-compose` / `wcf-validate` を順番に使い、画面構築を完了させる。

## Router

- 要件整理・コンポーネント選定: `wcf-discovery`
- 導入コマンド確定: `wcf-install`
- 画面HTML生成: `wcf-compose`
- 検証・修正提案: `wcf-validate`

## Standard Workflow

1. `wcf-discovery` で `componentIds` / `dependencyIds` / `patternIds` を確定
2. `wcf-install` で `wcf init` / `wcf vendor add` コマンドを確定
3. `wcf-compose` で `default/loading/error/empty` を含む `htmlSnippet` を作成
4. `wcf-validate` で `unknownElement` を0にするまで修正

## Shared Contracts

### Output

各Skillは以下を必ず返す:

1. 人間向けMarkdown要約
2. JSONブロック（機械可読）

### Error Categories

- `*_MCP_UNAVAILABLE`
- `*_REGISTRY_UNAVAILABLE`
- `*_PREFIX_MISMATCH`
- `*_INSUFFICIENT_INPUT`

### Fallback

MCPが使えない場合は `registry/install-registry.json` と `custom-elements.json` ベースの最小提案に降格する。

## Input/Output Bridge

- Discovery output `componentIds` は Install input にそのまま渡す。
- Install output `installOrder` と `postChecks` は Compose/Validate の前提に使う。
- Compose output `htmlSnippet` は Validate input `html` にそのまま渡す。

## Quality Gates

- 日常: `npm run validate:wc` / `npm run agents:pre-pr`
- PR前: `npm run agents:verify`

## Quick Example

```json
{
  "pipeline": [
    "wcf-discovery",
    "wcf-install",
    "wcf-compose",
    "wcf-validate"
  ],
  "goal": "検索結果画面を最小構成で生成して検証する"
}
```
