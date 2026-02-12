---
name: wcf-validate
description: 生成したHTMLをCEM/MCP/CLIで検証し、修正提案まで返す。Use when (1) unknownElementを解消したい, (2) 生成結果をPR前にゲートしたい, (3) 再実行コマンドを機械可読で得たい。
---

# wcf-validate

目的: 画面HTMLの妥当性を検証し、修正指示を返す。

## Required Input

- `html: string`
- `prefix: string`

## Validation Priority

1. MCP `validate_markup`
2. `npm run validate:wc`
3. CEM手動突合（最小）

## Output Contract

出力は必ず以下の2部構成にする:

1. 人間向けの短いMarkdown説明（問題要約）
2. 機械可読JSONブロック

```json
{
  "passed": false,
  "diagnostics": [
    {
      "level": "error",
      "code": "unknownElement",
      "message": "<myui-unknown> is not registered"
    }
  ],
  "fixSuggestions": [
    "replace myui-unknown with myui-card",
    "ensure wcf add card was executed"
  ],
  "rerunCommands": [
    "npm run validate:wc",
    "npm run agents:pre-pr"
  ]
}
```

## Error Contract

- `VALIDATE_MCP_UNAVAILABLE`
- `VALIDATE_REGISTRY_UNAVAILABLE`
- `VALIDATE_PREFIX_MISMATCH`
- `VALIDATE_INSUFFICIENT_INPUT`

## Fallback Contract

MCPが使えない場合は `npm run validate:wc` を主経路とし、失敗時は CEM参照で最小修正案を返す。

## Procedure

1. 入力HTMLを受け取り検証実行する。
2. `diagnostics` を `error/warning/info` で正規化する。
3. 各 error に対して1件以上の `fixSuggestions` を付ける。
4. 再実行コマンドを `rerunCommands` に返す。
5. `passed` を最終判定として返す。

## Success Example

- 概要: 問題なし

```json
{
  "passed": true,
  "diagnostics": [],
  "fixSuggestions": [],
  "rerunCommands": [
    "npm run validate:wc",
    "npm run agents:pre-pr"
  ]
}
```

## Failure Example

- 概要: 入力HTML空

```json
{
  "error": {
    "code": "VALIDATE_INSUFFICIENT_INPUT",
    "message": "html が空です。"
  },
  "passed": false,
  "diagnostics": [],
  "fixSuggestions": ["html を渡して再実行"],
  "rerunCommands": []
}
```
