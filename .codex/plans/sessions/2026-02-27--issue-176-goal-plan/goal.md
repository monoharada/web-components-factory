# Goal

## Goal Statement
Issue `#176` の目的は、Integration Breadth を 4/5 から 5/5 に引き上げるため、`figma_to_wcf` prompt、`wcf://` MCP resources（4種）、マルチIDE設定導線を整備し、`docs/reports/wcf-mcp-vs-serendie-comparison.md` の §4.6 Evidence に 5/5 根拠を提示可能な状態にすること。

## Success Criteria
- KR-01: `figma_to_wcf` prompt が登録され、Figma URL 入力を受け取れる。
- KR-02: prompt 応答が `overview -> tokens -> component api -> snippet -> validate` の実行順を示す。
- KR-03: resources 一覧で `wcf://components`, `wcf://tokens`, `wcf://guidelines/{topic}`, `wcf://llms-full` が公開される。
- KR-04: `wcf://components` が component catalog を返す。
- KR-05: `wcf://tokens` が token summary を返す。
- KR-06: `wcf://guidelines/{topic}` が topic 正常系/異常系契約を満たす。
- KR-07: `wcf://llms-full` が `llms-full.txt` と整合する内容を返す。
- KR-08: 3 IDE 以上の設定テンプレート導線が docs と overview で確認できる。
- KR-09: `packages/mcp-server/server.test.js` の追加契約テストを含め全件 pass。
- KR-10: §4.6 Evidence を #176 実装内容で更新できる証跡が揃う。

## Hard Constraints
- F-01: 既存ツール契約（入力/`content` 互換）を壊さない。
- F-04: `docs/reports/wcf-mcp-vs-serendie-comparison.md` §4.6 に 5/5 根拠を提示する。
- F-05: `@modelcontextprotocol/sdk` の互換範囲で resources/prompts を実装する。
- NG-01: OpenAI Apps SDK 連携の新規導入はしない。
- NG-02: AutoRAG/ベクトル検索は導入しない。
- NG-03: #177 の docs 横断責務（structuredContent 主体）へ越境しない。

## Definition of Done
- D-01: `figma_to_wcf` prompt が登録される。
- D-02: prompt 契約テストで、Figma URL 入力と 5段階ワークフロー順序を検証できる。
- D-03: resources 一覧契約テストで `wcf://` 4リソースを確認できる。
- D-04: `wcf://components` 読み取りテストが pass する。
- D-05: `wcf://tokens` 読み取りテストが pass する。
- D-06: `wcf://guidelines/{topic}` の正常系/異常系テストが pass する。
- D-07: `wcf://llms-full` 内容整合テストが pass する。
- D-08: 3 IDE 以上の設定テンプレート導線を docs/overview で確認できる。
- D-09: `npm run test:run -- packages/mcp-server/server.test.js` が pass する。
- D-10: `npm run mcp:check:response-size` と `npm run agents:verify` が pass し、§4.6 Evidence 更新に必要なログが揃う。

## DoD Notes
- `dod` 入力は未指定のため、`D-01..D-10` は issue 本文と roadmap から正規化した暫定DoD。
- 実装フェーズ移行条件はユーザーの `APPROVE PLAN`。
