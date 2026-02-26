# Prompt: MCP 45/45 残タスク推進（#170-#178）

## 目的
`@monoharada/wcf-mcp` を 45/45 に到達させるため、残Issue（#170-#178）の実装順・依存関係・検証方法を再計画し、着手可能な TODO に落とし込む。

## 前提（SOT）
- 採点根拠文書: `docs/reports/wcf-mcp-vs-serendie-comparison.md`
- 採点運用/制約/失敗条件: 同文書 §10
- 現在地: PR #180 マージ済み、`@monoharada/wcf-mcp@0.1.1` 公開済み
- 現状スコア目安: 約 35/45（未達）

## 実行してほしいこと
1. §4 Evidence を読み、各次元の「5/5 に必要」を Issue 単位で再整理
2. #170-#178 を G1/G2/G3 で依存順に並べ、最短で得点が伸びる順に優先度付け
3. 各Issueについて以下を作成
   - goal
   - research
   - risk
   - plan
   - todo（実装タスク + 検証コマンド + Evidence更新箇所）
4. 失敗条件 F-01〜F-05 と Non-goals NG-01〜NG-07 への適合チェック
5. 「次の1PRでやる範囲」を明確化（小さく分割）

## 制約
- 後方互換を壊さない（NG-04）
- 応答サイズ 100KB 制約を維持（F-03）
- #171 は `@experimental` 方針を維持（NG-07）
- #170 のテーマ対応は API 先行（light のみ）

## 出力フォーマット
- `docs/reports/wcf-mcp-vs-serendie-comparison.md` の更新案（§4/§10）
- 残Issueごとの実装チェックリスト（チェックボックス形式）
- 直近2PR分の実行計画（PRごとに対象Issue・検証・Done条件を1画面で）

## Done条件
- #170-#178 の着手順・依存関係が矛盾なく説明できる
- 各Issueに Evidence 追記位置（file:line）が明示されている
- `agents:verify` と `mcp:check:response-size` を含む検証手順が各PRに定義されている
