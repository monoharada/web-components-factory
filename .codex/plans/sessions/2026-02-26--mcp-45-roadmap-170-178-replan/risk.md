# Risk Register

## R-01 (HIGH)
- Issue: `#171`
- Risk: `createMcpServer()` DI 契約を壊し F-01/NG-04 へ直結。
- Detection: `npm test -- --run packages/mcp-server/server.test.js` + 既存API呼び出し回帰。
- Rollback: プラグイン読込を feature-flag (`experimentalPlugins`) で無効化し、既存DI経路へ即時戻す。

## R-02 (HIGH)
- Issue: `#174`
- Risk: structuredContent 追加で既存 `content` 互換を壊す。
- Detection: 主要3ツールのレスポンス契約テスト（content存在 + structuredContent追加）。
- Rollback: structuredContent 返却を opt-in フラグ化し、既定は旧フォーマット維持。

## R-03 (HIGH)
- Issue: `#176/#178`
- Risk: resources/prompts/stream API の SDK 非互換で F-05。
- Detection: SDK機能スモークテスト + `npm run agents:verify`。
- Rollback: 非対応機能を一時 disable（tools-only モード）し Evidence を「4/5維持」に戻す。

## R-04 (HIGH)
- Issue: `#173/#174/#175/#176/#177/#178`
- Risk: 応答が 100KB 超過（F-03/NG-05）。
- Detection: `npm run mcp:check:response-size` を PR 必須ゲート化。
- Rollback: limit/summary/truncation 既定値を即時適用して payload を縮小。

## R-05 (MEDIUM)
- Issue: `#170`
- Risk: NG-06逸脱（dark 実装まで踏み込む）。
- Detection: `theme=dark|all` の挙動を light fallback で固定する契約テスト。
- Mitigation: APIは受理するが実データは `light` のみ返却、READMEに明記。

## R-06 (MEDIUM)
- Issue: `#171`
- Risk: NG-07逸脱（`@experimental` が外れる）。
- Detection: API注釈/README/型定義の静的チェック。
- Mitigation: リリースノートに「破壊的変更の可能性」を固定文で追記。

## R-07 (MEDIUM)
- Issue: `#173/#175`
- Risk: `get_component_api` 拡張同士の競合で衝突。
- Detection: PRコンフリクト率、回帰テスト失敗。
- Mitigation: `#173` と `#175` を同時実装しない（順序固定）。

## R-08 (MEDIUM)
- Issue: all
- Risk: F-04（Evidence未更新）で採点不能。
- Detection: PRテンプレで Evidence 行更新の有無をレビュー必須化。
- Mitigation: 各Issue TODOに `path:line` 固定記載を必須。
