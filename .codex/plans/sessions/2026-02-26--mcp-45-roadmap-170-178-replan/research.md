# Research

## Sources
- SOT: `docs/reports/wcf-mcp-vs-serendie-comparison.md` (§4, §10)
- Prompt baseline: `.codex/prompts/continue-mcp-45-roadmap.md`
- Prior handoff: `.codex/plans/2026-02-26--mcp-45-roadmap-handoff.md`
- Issue bodies: `gh issue view 170..178 --repo monoharada/web-components-factory`
- Package facts: `packages/mcp-server/package.json` (`@modelcontextprotocol/sdk:^1.26.0`)

## Current Score Context
- main想定ベースライン: 30/45（§10.1）
- PR #180 マージ + `@monoharada/wcf-mcp@0.1.1` 後: 約35/45（SOT/Prompt）
- 未達因子: `#170-#178` 未完了

## 5/5 Evidence Anchors (Issue -> Update Location)
- `#172` (DX): `docs/reports/wcf-mcp-vs-serendie-comparison.md:248`
- `#173` (Discoverability): `docs/reports/wcf-mcp-vs-serendie-comparison.md:273`
- `#174` (CodeGen): `docs/reports/wcf-mcp-vs-serendie-comparison.md:298`
- `#170` (Token/Style): `docs/reports/wcf-mcp-vs-serendie-comparison.md:338`
- `#175` (Accessibility): `docs/reports/wcf-mcp-vs-serendie-comparison.md:363`
- `#176` (Integration): `docs/reports/wcf-mcp-vs-serendie-comparison.md:394`
- `#178` (Performance): `docs/reports/wcf-mcp-vs-serendie-comparison.md:418`
- `#177` (Documentation): `docs/reports/wcf-mcp-vs-serendie-comparison.md:448`
- `#171` (Extensibility): `docs/reports/wcf-mcp-vs-serendie-comparison.md:469`

## Dependency Graph (Condensed)
- Independent startable: `#172`, `#173`, `#175`（`#170` は #165 前提だが現状満たす想定）
- Foundation chains:
  - `#173 -> #178`
  - `#174 -> #177`
  - `#176 -> #177`
- High-risk architecture:
  - `#171`（DI互換 + `@experimental` 制約）

## G1/G2/G3 Priority (Dependency-aware)
1. `#173` (G2): 独立 + `#178` を解放 + F-03対策に直結
2. `#172` (G3): 独立 + 低リスクで +1 を取りやすい
3. `#170` (G2): 独立（前提満たし）+ Token 次元を5/5化
4. `#174` (G1): `#177` 前提の structuredContent 実装オーナー
5. `#176` (G3): `#177` 前提の resources 実装オーナー
6. `#178` (G3): `#173` 実装後に性能証明を確定
7. `#177` (G1): `#174` + `#176` の記述/検証統合
8. `#175` (G2): 独立だが `get_component_api` 拡張競合回避のため後段
9. `#171` (G3): +2点だが破壊半径が最大、最後に隔離実装

## Unknowns
- U-01: `#176/#178` で使う resources/stream API の SDK 境界仕様（実装前にスモーク要）。
- U-02: `#173 search_icons` のデータソース抽出経路（既存資材再利用可否）。
- U-03: `#174` トークン誤用検出の誤検知率しきい値（warning設計の粒度）。
