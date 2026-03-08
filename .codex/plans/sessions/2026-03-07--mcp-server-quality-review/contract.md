# Contract

## C-01: HTTP transport correctness
- Traces: D-01, D-04
- Requirement:
  - stateless mode を使うなら request ごとに fresh transport を生成する
  - security options を明示する
- Verification:
  - 連続 2 request 以上の HTTP test が pass する

## C-02: `structuredContent` compliance
- Traces: D-01, D-04
- Requirement:
  - `structuredContent` は payload object を直接返す
  - テストも同 shape を期待する
- Verification:
  - in-memory tool call test
  - MCP spec に沿った assertion

## C-03: Published metadata consistency
- Traces: D-03, D-04
- Requirement:
  - package version, server metadata version, overview version を一致させる
  - README と severity contract を一致させる
- Verification:
  - version / severity snapshot test

## C-04: Performance and payload budget
- Traces: D-02, D-04
- Requirement:
  - `get_component_api` batch の実効上限と response budget を整合させる
- Verification:
  - representative batch input test
  - response-size check
