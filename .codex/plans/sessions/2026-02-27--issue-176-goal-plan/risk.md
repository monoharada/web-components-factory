# Risk Register

## Context
- Issue: `#176` (Integration Breadth 4 -> 5)
- Scope: Figma MCP prompt テンプレート + MCP resources (`wcf://`) + マルチIDE統合導線
- Failure Trace Target: `F-01` / `F-04` / `F-05`（`docs/reports/wcf-mcp-vs-serendie-comparison.md` §10.3）

## R-01
- `severity`: HIGH
- `trigger`: resources/prompts 追加時に既存ツールの引数・返却契約を変更してしまう。
- `detection`: `npm test -- --run packages/mcp-server/server.test.js` で既存回帰が失敗したら検知。
- `rollback`: resources/prompts 登録を feature flag で無効化し、既存 tools-only 構成へ即時戻す。
- `trace`: `F-01`

## R-02
- `severity`: HIGH
- `trigger`: `get_design_system_overview` へ IDE 統合情報を追加する際、既存キーの互換を壊す。
- `detection`: overview の既存契約テスト + 既存クライアント fixture 差分確認。
- `rollback`: 追加情報を新規オプショナルキーへ隔離し、既存キーを元の形に戻す。
- `trace`: `F-01`

## R-03
- `severity`: HIGH
- `trigger`: `wcf://` URI 設計の不整合（`guidelines/{topic}` など）で利用側が解決できない。
- `detection`: URI 正常系/異常系の表駆動テスト、`npm run mcp:check` の失敗で検知。
- `rollback`: 直前の安定 URI へ alias 互換を戻し、新URIは `@experimental` 扱いに縮退。
- `trace`: `F-01`, `F-04`

## R-04
- `severity`: HIGH
- `trigger`: 実装は完了しても §4.6 Evidence（根拠・テスト結果・path:line）更新が不足する。
- `detection`: `rg -n "#176|Integration Breadth|Evidence|スコア変更" docs/reports/wcf-mcp-vs-serendie-comparison.md` で必須項目欠落を検知。
- `rollback`: スコア主張を 4/5 のまま据え置き、Evidence が揃うまで #176 クローズを停止。
- `trace`: `F-04`

## R-05
- `severity`: MEDIUM
- `trigger`: Figma prompt テンプレートが実在しないツール名/手順を含み再現不能になる。
- `detection`: prompt スモーク（固定サンプル）で `validate_markup` まで到達しない場合に検知。
- `rollback`: 最小手順テンプレート（discovery -> snippet -> validate）へ一時的に戻す。
- `trace`: `F-04`

## R-06
- `severity`: MEDIUM
- `trigger`: #172/#177 との責務境界を越え、記述・設定テンプレートが重複してドリフトする。
- `detection`: `git diff --name-only` で #176 の許可範囲外（docs横断更新過多）を検知。
- `rollback`: 越境差分を revert し、#176 は resources/prompt の実装核のみに再限定する。
- `trace`: `F-04`

## R-07
- `severity`: HIGH
- `trigger`: `@modelcontextprotocol/sdk` の API 差分で resources/prompts 登録コードが非互換化する。
- `detection`: `npm ls @modelcontextprotocol/sdk && npm run agents:verify` 失敗で検知。
- `rollback`: SDK を互換版へ pin し、非互換機能（resource/prompt）を段階的に disable する。
- `trace`: `F-05`

## R-08
- `severity`: HIGH
- `trigger`: SDK/実行環境差異で server 起動時に resources 登録処理が例外停止する。
- `detection`: `npm run mcp:build` + 起動スモーク + server.test の起動系テスト失敗で検知。
- `rollback`: 起動時 try/catch で resources を fail-open 無効化し、既存ツール提供を継続。
- `trace`: `F-01`, `F-05`

## R-09
- `severity`: MEDIUM
- `trigger`: `wcf://llms-full` / `wcf://guidelines/*` の参照元更新漏れで実体と Evidence が乖離する。
- `detection`: build 後に resources 出力内容と `docs/reports/...` 記述差分をレビューで検知。
- `rollback`: stale リソースを一時非公開にし、再生成済みの安定ソースのみ公開する。
- `trace`: `F-04`

## R-10
- `severity`: MEDIUM
- `trigger`: package 公開時に resources 関連ファイルや設定が同梱漏れし、利用時互換が崩れる。
- `detection`: `npm pack --dry-run` の同梱確認 + インストール後スモークで検知。
- `rollback`: patch release で同梱物を修正、修正版公開まで #176 の 5/5 判定を保留する。
- `trace`: `F-01`, `F-04`
