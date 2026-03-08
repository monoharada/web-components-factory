# Contract

## C-01: invalid config は HTTP でも startup 時に失敗する
- Invariant:
  - `stdio` と `http` の両 transport で、壊れた `--config` は `listen()` 前に検知される。
- Verification:
  - `bin.test.js` に invalid config startup test を追加する。

## C-02: MCP HTTP endpoint は `/mcp` のみ
- Invariant:
  - `/mcp` だけが transport handler に到達し、それ以外の path は MCP request として処理しない。
- Verification:
  - `/mcp` と `/wrong` の status 差分テスト
  - README の endpoint 記述

## C-03: loopback allowlist は default-port 揺れを吸収する
- Invariant:
  - `127.0.0.1` / `localhost` の loopback 同義表現は許可しつつ、それ以外の host/origin は拒否する。
- Verification:
  - `buildHttpTransportOptions()` unit test
  - disallowed origin test

## C-04: tool response の最終返却サイズは `MAX_TOOL_RESULT_BYTES` 以下
- Invariant:
  - `buildJsonToolResponse()` のどの分岐でも `measureToolResultBytes(result) <= MAX_TOOL_RESULT_BYTES`
- Verification:
  - 120KB payload の oversize test
  - 既存 70KB fallback test の維持
