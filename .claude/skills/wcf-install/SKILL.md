---
name: wcf-install
description: componentIds から vendor install 手順を確定する。Use when (1) discovery結果を実際に導入したい, (2) wcf init/vendor add の順序を安全に生成したい, (3) prefix/dir を固定したい。
---

# wcf-install

目的: `componentIds[]` をインストール可能な具体コマンドへ変換する。

## Required Input

- `componentIds: string[]`
- `prefix: string`
- `dir: string`
- `patternId: string` (`wcf init` 実行時に必須)

## Output Contract

出力は必ず以下の2部構成にする:

1. 人間向けの短いMarkdown説明（順序と注意点）
2. 機械可読JSONブロック

```json
{
  "commands": [
    "wcf init --prefix myui --dir . --pattern search-results --entry boot",
    "wcf vendor add --prefix myui --dir vendor/components/myui --component button --component card"
  ],
  "installOrder": ["icon", "button", "card"],
  "postChecks": [
    "autoload entry exists",
    "define callable",
    "npm run validate:wc"
  ]
}
```

## Error Contract

- `INSTALL_MCP_UNAVAILABLE`
- `INSTALL_REGISTRY_UNAVAILABLE`
- `INSTALL_PREFIX_MISMATCH`
- `INSTALL_INSUFFICIENT_INPUT`

## Fallback Contract

MCPが使えない場合は `registry/install-registry.json` の `deps` と `call` を使って順序を決定する。

## Procedure

1. `componentIds` を重複排除する。
2. `install-registry` の `deps` を閉包展開する。
3. `installOrder` を依存先優先で並べる。
4. `wcf init` と `wcf vendor add` のコマンドを生成する。
5. `postChecks` に最低3項目を含める。

## Success Example

- 概要: button と card を `myui` prefix で導入

```json
{
  "commands": [
    "wcf init --prefix myui --dir . --pattern search-results --entry boot",
    "wcf vendor add --prefix myui --dir vendor/components/myui --component button --component card"
  ],
  "installOrder": ["icon", "button", "card"],
  "postChecks": [
    "check vendor/components/myui/autoload",
    "check define functions",
    "npm run validate:wc"
  ]
}
```

## Failure Example

- 概要: prefix未指定

```json
{
  "error": {
    "code": "INSTALL_INSUFFICIENT_INPUT",
    "message": "prefix / dir / patternId は必須です。"
  },
  "commands": [],
  "installOrder": [],
  "postChecks": ["prefix / dir / patternId を指定して再実行"]
}
```
