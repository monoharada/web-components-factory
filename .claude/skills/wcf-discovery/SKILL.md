---
name: wcf-discovery
description: UI要件から必要なcomponentId/dependency/patternを抽出する。Use when (1) 新しい画面を設計するとき, (2) どのコンポーネントを使うか迷うとき, (3) install前に最小構成を決めたいとき。
---

# wcf-discovery

目的: 画面要件を、WCFで実装可能な最小コンポーネント構成へ変換する。

## Required Input

- `screen_goal: string`
- `target_user: string`
- `states: string[]`

`states` は最低でも `loading` / `error` / `empty` / `default` を含める。足りない場合は補完し、補完した事実を `assumptions` に記録する。

## Source Priority

1. `registry/install-registry.json`
2. `registry/pattern-registry.json`
3. `custom-elements.json` または MCP (`list_components`, `get_component_api`)

## Output Contract

出力は必ず以下の2部構成にする:

1. 人間向けの短いMarkdown説明（選定理由）
2. 機械可読JSONブロック

```json
{
  "componentIds": ["button"],
  "dependencyIds": ["icon"],
  "patternIds": ["search-results"],
  "assumptions": ["..."],
  "openQuestions": ["..."]
}
```

## Error Contract

- `DISCOVERY_MCP_UNAVAILABLE`
- `DISCOVERY_REGISTRY_UNAVAILABLE`
- `DISCOVERY_PREFIX_MISMATCH`
- `DISCOVERY_INSUFFICIENT_INPUT`

## Fallback Contract

MCPが使えない場合は `registry/install-registry.json` と `custom-elements.json` のみで最小候補を返す。曖昧さは `openQuestions` に明示する。

## Procedure

1. 要件を「入力」「操作」「出力」「状態」に分解する。
2. `install-registry` から候補 `componentIds` を引く。
3. `pattern-registry` で再利用可能な `patternIds` を探索する。
4. 不足情報だけCEM/MCPで補完する。
5. 依存を `dependencyIds` に展開する。
6. JSON契約で返す。

## Success Example

- 概要: 検索結果一覧画面

```json
{
  "componentIds": ["search-box", "card", "button"],
  "dependencyIds": ["icon", "heading"],
  "patternIds": ["search-results"],
  "assumptions": [
    "states に default が不足していたため追加した"
  ],
  "openQuestions": []
}
```

## Failure Example

- 概要: 要件が抽象的

```json
{
  "error": {
    "code": "DISCOVERY_INSUFFICIENT_INPUT",
    "message": "screen_goal が曖昧です。"
  },
  "componentIds": [],
  "dependencyIds": [],
  "patternIds": [],
  "assumptions": [],
  "openQuestions": [
    "画面は閲覧中心ですか、それとも入力中心ですか?"
  ]
}
```
