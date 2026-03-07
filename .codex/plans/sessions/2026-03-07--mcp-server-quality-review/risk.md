# Risk

## R-01: HTTP transport 修正で既存クライアント互換を壊す
- Severity: HIGH
- Detection:
  - request-level HTTP test
  - initialize / follow-up request の manual smoke test
- Mitigation:
  - SDK example に寄せて最小差分で修正する
- Rollback:
  - HTTP mode を一時的に experimental 扱いへ戻し、stdio を既定経路として維持する

## R-02: `structuredContent` shape 修正で既存 consumer が壊れる
- Severity: HIGH
- Detection:
  - in-memory client test
  - consumer 側の期待 shape を README / examples で確認
- Mitigation:
  - text `content` は維持しつつ `structuredContent` のみ仕様準拠へ変える
- Rollback:
  - `WCF_MCP_DISABLE_STRUCTURED_CONTENT=1` による text-only fallback を案内する

## R-03: version / severity / cwd 調整で docs と実装が再度 drift する
- Severity: MEDIUM
- Detection:
  - version string / severity contract / cwd behavior の単体 test
- Mitigation:
  - 単一ソース化または明示定数化
- Rollback:
  - README と release note に暫定差分を明記する

## R-04: response size 改修で payload 可読性を落とす
- Severity: MEDIUM
- Detection:
  - response-size check
  - batch API の snapshot test
- Mitigation:
  - machine-readable path は minified、human-readable path は text content に分ける
- Rollback:
  - batch limit を暫定的に下げる
