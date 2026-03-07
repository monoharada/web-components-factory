# Risk

## R-01: startup validation のための事前 `createServer()` が二重初期化になる
- Impact: Medium
- Probability: Medium
- Detection:
  - HTTP 起動テスト
  - request 1 回目の正常応答確認
- Mitigation:
  - validation 用 server は `close()` して破棄し、request path とは共有しない
- Rollback:
  - fail-fast が不安定なら validation を config load だけに縮小する

## R-02: `/mcp` 以外を 404 にすると既存の誤用クライアントが壊れる
- Impact: Medium
- Probability: Low
- Detection:
  - bin test で `/wrong` を明示確認
  - README の endpoint 記述確認
- Mitigation:
  - 変更意図を README に明記する
- Rollback:
  - path 契約を docs 側へ寄せる案に戻す

## R-03: allowlist 拡張で security posture を弱める
- Impact: High
- Probability: Low
- Detection:
  - allowedHosts / allowedOrigins の unit test
  - evil origin rejection test
- Mitigation:
  - loopback 同義表現と default-port 省略形に限定する
- Rollback:
  - default-port 省略形だけを除外し、docs に制約を書く

## R-04: overflow fallback がクライアント期待 payload を壊す
- Impact: Medium
- Probability: Medium
- Detection:
  - oversize unit test
  - 既存 tool result shape の snapshot/expectation確認
- Mitigation:
  - 明示的な fallback payload を返し、サイズ・理由・limit を含める
- Rollback:
  - `isError: true` の明示的 error envelope へ切り替える
