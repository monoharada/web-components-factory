# Contract

## C-01: built-in / plugin raw result を問わず最終 tool result は `MAX_TOOL_RESULT_BYTES` 以下
- Invariant:
  - `measureToolResultBytes(result) <= MAX_TOOL_RESULT_BYTES` が全 tool result 経路で成り立つ。
- Verification:
  - plugin raw result oversize integration test
  - built-in overflow regression test

## C-02: error helper でも `isError` を含めた最終 object が上限内
- Invariant:
  - `buildJsonToolErrorResponse()` は `isError: true` を含めた後でも上限を超えない。
- Verification:
  - 102325-byte payload regression test
  - 既存 error helper shape test

## C-03: overflow 時の fallback は warning payload に統一
- Invariant:
  - 上限超過時は tool payload 本体ではなく `TOOL_RESULT_TOO_LARGE` warning payload を返す。
- Verification:
  - built-in overflow test
  - plugin raw result overflow test

## C-04: plain payload 経路の既存 contract は維持
- Invariant:
  - 上限内の plain payload / plugin payload は引き続き `buildJsonToolResponse()` 相当の shape を返す。
- Verification:
  - 既存 runtime/server tests の維持
