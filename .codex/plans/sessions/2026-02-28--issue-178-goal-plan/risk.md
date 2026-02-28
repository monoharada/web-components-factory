# Risk Register

## Context
- Issue: `#178` (Performance 4 -> 5)
- Scope: Progressive Disclosure 効果検証 + size最適化 + HTTP streaming検証 + cache/perf計測
- Failure Trace Target: `F-01` / `F-03` / `F-04` / `F-05`

## R-01
- `severity`: HIGH
- `trigger`: default 20 達成のため既存 `list_components` を直接変更し、互換破壊を起こす。
- `detection`: 既存 backward compatibility テスト失敗。
- `rollback`: 既存挙動へ即時戻し、新経路追加方式へ切替。
- `trace`: `F-01`

## R-02
- `severity`: HIGH
- `trigger`: truncation 実装でレスポンス構造が不安定化し、クライアントがパース不能になる。
- `detection`: 境界値テスト + `validate_markup` 等の既存ツール呼び出し回帰。
- `rollback`: truncation を feature flag で無効化し、サイズ監視のみ継続。
- `trace`: `F-01`, `F-03`

## R-03
- `severity`: HIGH
- `trigger`: response-size worst-case ケース不足で 100KB 超過が見逃される。
- `detection`: `npm run mcp:check:response-size` NG。
- `rollback`: 上限超過ツールを一時的に `limit` 強制し、後続PRで再設計。
- `trace`: `F-03`

## R-04
- `severity`: HIGH
- `trigger`: HTTP streaming は実装済みでも E2E 検証不足で運用時に失敗する。
- `detection`: HTTP transport 統合テスト失敗。
- `rollback`: stdio のみを推奨経路に戻し、HTTP は experimental 扱いへ。
- `trace`: `F-04`, `F-05`

## R-05
- `severity`: MEDIUM
- `trigger`: cache invalidation が過剰に働き、性能改善より劣化を招く。
- `detection`: perf logging で cacheHit 率低下・duration 悪化を検知。
- `rollback`: hot-reload をオプトイン化し、安定キャッシュへ戻す。
- `trace`: `F-03`

## R-06
- `severity`: MEDIUM
- `trigger`: performance logging がデフォルト有効でノイズ増加・機密露出を招く。
- `detection`: ログ監査で過剰出力を検知。
- `rollback`: env opt-in に限定し、出力項目を最小化。
- `trace`: `F-04`

## R-07
- `severity`: HIGH
- `trigger`: SDK API 差分で streaming 実装が非互換化する。
- `detection`: `npm run agents:verify` / HTTP tests 失敗。
- `rollback`: SDK 互換版へ pin、非互換経路を段階無効化。
- `trace`: `F-05`

## R-08
- `severity`: MEDIUM
- `trigger`: docs/report 更新漏れで 5/5 根拠が成立しない。
- `detection`: §4.7 Evidence テンプレ欠落レビュー。
- `rollback`: score を 4/5 のまま据え置き、証跡補完後に再評価。
- `trace`: `F-04`
