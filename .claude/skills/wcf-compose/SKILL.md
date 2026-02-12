---
name: wcf-compose
description: 導入済みcomponentIdから画面マークアップを構成する。Use when (1) 画面HTMLを最小で生成したい, (2) 状態別のUIを同時に定義したい, (3) a11y観点を先に埋め込みたい。
---

# wcf-compose

目的: install済みコンポーネントを使って、状態込みの画面HTMLを生成する。

## Required Input

- `screen_goal: string`
- `componentIds: string[]`
- `states: string[]`
- `prefix: string`

`states` は `default` / `loading` / `error` / `empty` を必須とする。不足時は補完して `stateVariants` に含める。

## Output Contract

出力は必ず以下の2部構成にする:

1. 人間向けの短いMarkdown説明（構成と注意点）
2. 機械可読JSONブロック

```json
{
  "htmlSnippet": "<myui-search-box></myui-search-box>",
  "stateVariants": ["default", "loading", "error", "empty"],
  "a11yChecks": [
    "landmark and heading hierarchy",
    "form controls have accessible names",
    "error state has readable message"
  ]
}
```

## Error Contract

- `COMPOSE_MCP_UNAVAILABLE`
- `COMPOSE_REGISTRY_UNAVAILABLE`
- `COMPOSE_PREFIX_MISMATCH`
- `COMPOSE_INSUFFICIENT_INPUT`

## Fallback Contract

MCPが使えない場合は `generate_usage_snippet` 相当を `install-registry` / CEM から再構築し、最小HTMLを返す。

## Procedure

1. `componentIds` から必要なタグ名を解決する。
2. 画面目的に対して最小DOM構造を作る。
3. 4状態それぞれに必要な差分を設計する。
4. `a11yChecks` を最低3項目記載する。
5. JSON契約で返す。

## Success Example

- 概要: 検索画面の最小構成

```json
{
  "htmlSnippet": "<myui-heading data-dads-typeset>検索</myui-heading>\\n<myui-search-box></myui-search-box>\\n<myui-card></myui-card>",
  "stateVariants": ["default", "loading", "error", "empty"],
  "a11yChecks": [
    "search landmark exists",
    "loading message is announced",
    "empty state has guidance"
  ]
}
```

## Failure Example

- 概要: componentIdsが空

```json
{
  "error": {
    "code": "COMPOSE_INSUFFICIENT_INPUT",
    "message": "componentIds は1件以上必要です。"
  },
  "htmlSnippet": "",
  "stateVariants": ["default", "loading", "error", "empty"],
  "a11yChecks": ["componentIds を指定して再実行"]
}
```
