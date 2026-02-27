# Goal

## Goal Statement
Issue `#175` の目的は、Accessibility 評価を 4/5 から 5/5 に引き上げるため、`get_accessibility_docs` 専用ツール（`component/topic/wcagLevel` フィルタ）を追加し、コンポーネント別 A11y チェックリストを提供し、`validate_markup` の A11y 診断を強化しつつ、既存互換・100KB 制約・Evidence 更新要件を満たすこと。

## Success Criteria
- KR-01: `get_accessibility_docs` が `component/topic/wcagLevel` で絞り込み可能。
- KR-02: `get_component_api` で component-level の A11y checklist を取得できる。
- KR-03: A11y index データが 10件以上で、検索結果として再利用可能。
- KR-04: `validate_markup` が ARIA 妥当性に関する診断を返せる。
- KR-05: 既存 `content` 互換を維持し、破壊的変更を含まない。
- KR-06: `packages/mcp-server/server.test.js` が全件 pass。
- KR-07: `npm run mcp:check:response-size` と `npm run agents:verify` が pass。
- KR-08: `docs/reports/wcf-mcp-vs-serendie-comparison.md` の #175 Evidence 行が更新可能な証跡を残す。

## Hard Constraints
- F-01: 後方互換を維持し、既存ツール契約（入力/`content` 形式）を壊さない。
- F-02: 単一ツール応答を 100KB 以下に維持する。
- F-03: #175 の Evidence 更新を必須化する。
- F-04: `@modelcontextprotocol/sdk` 互換範囲で実装する。
- NG-01: AutoRAG/ベクトル検索を導入しない。
- NG-02: OpenAI Apps SDK 対応を実装しない。
- NG-03: 移行支援ツールを追加しない。

## Definition of Done
- D-01: `get_accessibility_docs` がツール登録される。
- D-02: `component/topic/wcagLevel` フィルタ契約テスト（正常/境界/異常）が追加され pass する。
- D-03: `get_component_api` で component-level A11y checklist を返し、既存フィールド回帰がない。
- D-04: A11y index（10件以上）を取得・検索できる。
- D-05: `validate_markup` の A11y 診断追加後も既存診断（unknown/forbidden/tokenMisuse）が非劣化。
- D-06: `packages/mcp-server/server.test.js` が pass する。
- D-07: `npm run mcp:check:response-size` と `npm run agents:verify` が pass する。
- D-08: #175 Evidence（実装内容/テスト/スコア根拠）を比較レポートへ反映できる状態になる。

## DoD Notes
- `dod` 入力は未指定のため、上記 `D-01..D-08` は goal/scope から正規化した暫定DoD。
- 実装フェーズ開始条件はユーザーの `APPROVE PLAN` 承認。
