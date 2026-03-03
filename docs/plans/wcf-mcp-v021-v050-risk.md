# Risk Register: wcf-mcp v0.2.1→v0.5.0

## リスク一覧

### R-01: fullPageHtml テンプレートの品質不足による E2E 描画失敗
- **影響度**: HIGH
- **発生確率**: MEDIUM
- **関連Plan**: P-02
- **説明**: `fullPageHtml` で生成されるHTMLが、import mapパス不整合、boot.jsパス誤り、文字コード未指定などにより、ブラウザで描画に失敗する可能性がある。E2E描画成功率100%のゴールに直結するリスク
- **緩和策**:
  - 全12パターンに対して `fullPageHtml` 生成のスナップショットテストを追加
  - import map エントリと `resolveComponentClosure()` 結果の一致を検証
  - `<meta charset="UTF-8">`, `<html lang="ja">`, `<!DOCTYPE html>` の存在を構造テストで保証
  - `scaffoldHint` の既存テンプレートを再利用し、新規テンプレート生成ロジックを最小化
- **rollback手順**:
  1. P-02 の変更を `git revert` で取り消す
  2. `include` パラメータを無視するように `get_pattern_recipe` を修正（フォールバック）
  3. `fullPageHtml` フィールドを返さない旧動作に戻す
  4. テスト実行で後方互換を確認

---

### R-02: core.mjs 単一ファイル肥大化によるメンテナンス困難
- **影響度**: MEDIUM
- **発生確率**: HIGH
- **関連Plan**: P-01, P-02, P-04, P-05, P-06
- **説明**: 現在2,744行の core.mjs に全変更を追加すると3,000行超になる。ハードコードデータ（INTERACTION_EXAMPLES_MAP, LAYOUT_BEHAVIOR_MAP, SYNONYM_TABLE拡張, fullPageHtml テンプレート）の追加で可読性・保守性が低下する
- **緩和策**:
  - 各ハードコードデータをファイル末尾のセクションにまとめ、明確なコメント区切りを使用
  - 将来のファイル分割に備え、export 可能な関数/定数として定義
  - 新規追加データは `Object.freeze()` でイミュータブルにする
- **rollback手順**: 不要（品質問題のため rollback 対象外。コードレビューで対処）

---

### R-03: SYNONYM_TABLE 拡張による誤ヒット（false positive）増加
- **影響度**: MEDIUM
- **発生確率**: MEDIUM
- **関連Plan**: P-06
- **説明**: 同義語テーブルを拡張すると、意図しないクエリで無関係なガイドラインがヒットする可能性がある。Precision 100% 維持目標と矛盾する
- **緩和策**:
  - 同義語は一方向（key → synonyms）のみで、逆方向展開しない（既存設計を維持）
  - 各同義語エントリに対してベンチマークテストを追加し、false positive を検出
  - SYNONYM_TABLE の変更はベンチマーク6クエリの結果を確認してからマージ
- **rollback手順**: 不要（SYNONYM_TABLE の個別エントリを削除するだけで対処可能）

---

### R-04: interactionExamples のコードスニペットが古くなるリスク
- **影響度**: LOW
- **発生確率**: MEDIUM
- **関連Plan**: P-04
- **説明**: ハードコードされたインタラクション例（`el.error = true; el.errorText = '...'`）がコンポーネント側のAPIと乖離する可能性がある。CEM から自動生成されるデータではないため、手動メンテナンスが必要
- **緩和策**:
  - interactionExamples 内のプロパティ名が CEM attributes に存在することを検証するテストを追加
  - コンポーネント API 変更時に interactionExamples も更新するチェックリストを docs に記載
- **rollback手順**: 不要（Low影響のため）

---

### R-05: include パラメータの Zod スキーマ設計ミスによる後方互換破壊
- **影響度**: HIGH
- **発生確率**: LOW
- **関連Plan**: P-02
- **説明**: `get_pattern_recipe` の `include` パラメータ追加で、Zod のバリデーションが既存呼び出し（include 未指定）を reject する可能性がある。MCP クライアント側の互換性にも影響
- **緩和策**:
  - `include` は `z.array(z.enum(['fullPage'])).optional()` で定義し、未指定時は空配列/undefined として処理
  - 後方互換テストを最初に書き、既存レスポンスが完全一致することを確認
  - MCP SDK の inputSchema 処理が optional パラメータを正しく扱うことを検証
- **rollback手順**:
  1. `include` パラメータの inputSchema 定義を削除
  2. ハンドラ内の `include` 参照コードを削除
  3. テスト実行で後方互換を確認

---

### R-06: guidelines-index.json の索引不足による #201 の効果限定
- **影響度**: MEDIUM
- **発生確率**: MEDIUM
- **関連Plan**: P-06
- **説明**: search_guidelines の改善は SYNONYM_TABLE + スコアリングロジックだけでなく、guidelines-index.json 自体のカバレッジにも依存する。索引対象が不足していると、同義語展開しても検索結果が空になる
- **緩和策**:
  - guidelines-index.json の現在の索引カバレッジを確認し、不足トピックを特定
  - 必要に応じて `npm run mcp:index-guidelines` のスクリプトを更新して索引対象を拡張
  - ベンチマーク6クエリの結果数を CI テストで監視
- **rollback手順**: 不要（SYNONYM_TABLE は追加のみ）

---

### R-07: テスト実行時間の増大
- **影響度**: LOW
- **発生確率**: MEDIUM
- **関連Plan**: P-07
- **説明**: 各ステップで追加するテストにより server.test.js が肥大化し、テスト実行時間が増加する可能性がある。特に InMemoryTransport 統合テストは初期化コストが高い
- **緩和策**:
  - 同一 describe ブロック内のテストで `beforeAll` のサーバー初期化を共有（既存パターンに従う）
  - ユニットテスト可能なロジックは統合テストではなくヘルパー関数テストとして実装
- **rollback手順**: 不要

---

### R-08: AI による fullPageHtml の部分改変（CDN 置換）
- **影響度**: HIGH
- **発生確率**: HIGH
- **関連Plan**: P-02, P-03
- **説明**: AI エージェントが fullPageHtml テンプレートを受け取った後、import map や boot.js のパスを CDN URL に部分的に置換する可能性がある。現行の validate_markup はランタイム scaffold（importmap, boot.js）を検証対象外としているため、この改変を検知できない
- **緩和策**:
  - P-03 で validate_markup に CDN 参照検出ルールを追加（`cdn.jsdelivr.net`, `unpkg.com` 等をパターンマッチ）
  - P-03 で importmap/boot.js 欠落検出ルールを追加
  - fullPageHtml 内にコメントで「このテンプレートを改変しないでください」の警告を含める
- **rollback手順**: P-03 のランタイム検証ルールを個別に revert 可能（追加ルールのため後方互換に影響なし）

---

### R-09: scaffoldHint プレースホルダの未置換
- **影響度**: HIGH
- **発生確率**: HIGH
- **関連Plan**: P-02
- **説明**: scaffoldHint 内の `./<dir>/...`, `./<vendorDir>/...` がプレースホルダであり、動的置換されないままHTMLに埋め込まれると import map パスが無効になり E2E 描画が失敗する
- **緩和策**:
  - `buildFullPageHtml()` 専用関数を新設し、`dir`/`vendorDir` を明示パラメータとして受け取る
  - テストでプレースホルダ文字列が残存していないことを検証
- **rollback手順**: `buildFullPageHtml()` 関数の実装ミスの場合、P-02 全体を git revert

---

### R-10: overview 未呼び出しによる distribution 情報欠落
- **影響度**: MEDIUM
- **発生確率**: MEDIUM
- **関連Plan**: P-01, P-02
- **説明**: `get_design_system_overview` の「最初に呼ぶべき」指示は description テキストのみで、セッション状態管理がない。エージェントが overview を飛ばして直接 get_pattern_recipe を呼ぶと、distribution 情報なしでページ生成される
- **緩和策**:
  - fullPageHtml レスポンスに distribution 情報を自己完結的に含める（overview 未呼び出しでも最低限機能）
  - 将来的にはセッション状態による強制ガードの導入を検討（v0.5.0 スコープ外）
- **rollback手順**: 不要（additive な情報追加のため）

---

### R-11: fullPageHtml による structuredContent 100KB 超過
- **影響度**: MEDIUM
- **発生確率**: MEDIUM
- **関連Plan**: P-02
- **説明**: fullPageHtml の追加で get_pattern_recipe のレスポンスサイズが増大し、MAX_TOOL_RESULT_BYTES（100KB）制限に到達した場合、structuredContent がサイレントに欠落してテキスト専用返却にフォールバックする
- **緩和策**:
  - 全12パターンの fullPageHtml レスポンスサイズを計測する契約テストを追加
  - 100KB 超過時は fullPageHtml を分割し、「サイズ超過のため分割されました」メッセージを含める
- **rollback手順**: fullPageHtml のサイズが大きい場合、include パラメータを無効化して旧動作に戻す

---

### R-12: Recall 75% 目標未達（検証ルール不足）
- **影響度**: MEDIUM
- **発生確率**: HIGH
- **関連Plan**: P-03
- **説明**: Codex レビューにより、name 属性検証 + attribute case warning だけでは FN 42% の捕捉に不十分と判明。slot 検証のグローバル語彙判定、required 対象の狭さ、empty interactive の button 中心の構造的見逃しが存在する
- **緩和策**:
  - required 対象タグの拡大（combobox, file-upload 等）
  - empty interactive 対象の拡張（button 以外）
  - P-08 でアブレーション計測（各ルール追加ごとの Recall 寄与を定量化）
  - 75% 未達でも 65%+ なら段階リリースを検討
- **rollback手順**: 不要（追加ルールは個別に revert 可能）

---

## リスクマトリクス

| リスク | 影響度 | 発生確率 | 優先対応 |
|--------|--------|---------|---------|
| R-08 | HIGH | HIGH | **必須**（P-03でランタイム検証追加） |
| R-09 | HIGH | HIGH | **必須**（P-02でbuildFullPageHtml関数化） |
| R-01 | HIGH | MEDIUM | 必須（テスト・rollback計画） |
| R-05 | HIGH | LOW | 必須（後方互換テスト先行） |
| R-12 | MEDIUM | HIGH | 推奨（P-03でRecall改善ルール追加） |
| R-02 | MEDIUM | HIGH | 推奨（コード構造化） |
| R-10 | MEDIUM | MEDIUM | 推奨（distribution自己完結化） |
| R-11 | MEDIUM | MEDIUM | 推奨（サイズ計測テスト） |
| R-03 | MEDIUM | MEDIUM | 推奨（ベンチマークテスト） |
| R-06 | MEDIUM | MEDIUM | 推奨（索引カバレッジ確認） |
| R-04 | LOW | MEDIUM | 許容 |
| R-07 | LOW | MEDIUM | 許容 |
