# Claude Code Development Workflow

## 🎯 開発フローの型

このプロジェクトでは、Claude Codeとの協働を最適化した**インクリメンタル・レビュー駆動開発**を採用します。

## 📐 基本原則

1. **使い方の型を決める**: 明確な作業パターンを確立
2. **インクリメンタルに進める**: 小さく、可逆的な変更を積み重ねる
3. **頻繁にコミット**: 各論理的変更後にコミット
4. **継続的レビュー**: 各段階でのレビューと検証
5. **ナレッジの蓄積**: 学習内容とパターンを文書化

## 🔄 標準開発フロー

### 1. 計画フェーズ (Planning)

**スラッシュコマンド**:
```
/design
```
実装計画を作成し、タスクを分解します。

**Claude Codeへの指示例**:
- "この機能の実装計画を作成してください"
- "タスクを最小単位に分解してください"
- "技術的な設計判断を文書化してください"

### 2. 実装フェーズ (Implementation)

**スラッシュコマンド**:
```
/implement
```
計画に基づいて実装を進めます。

```
/revise
```
実装計画を修正・更新します。

**サポートコマンド** (npm scripts):
```bash
# TDDモードで開発開始
npm run tdd

# 型チェックを継続的に実行
npm run type-check -- --watch
```

**インクリメンタル開発のステップ**:
1. 最小限のテストを書く
2. テストを通す最小限のコードを書く
3. リファクタリング
4. コミット
5. 次の機能へ

### 3. レビューフェーズ (Review)

**スラッシュコマンド**:
```
/review
```
コードレビューを実行し、改善点を特定します。

**サポートコマンド** (npm scripts):
```bash
# 包括的なレビュー実行
npm run claude:review

# 全チェック実行
npm run claude:verify
```

**レビューの観点**:
- コード品質
- 型安全性
- テストカバレッジ
- アクセシビリティ
- パフォーマンス
- averageCase の計測仕様（`lazy=0` で全件即時、`min=1` は全モジュール、IO はラッパー監視）を満たすか確認
- キーボードナビゲーション実装は `ElementSelection` を優先（不使用時は理由を明記）

### 4. 振り返りとナレッジ管理 (Reflection)

**スラッシュコマンド**:
```
/recap
```
完了したタスクの振り返りとナレッジの抽出を行います。

**サポートコマンド** (npm scripts):
```bash
# ナレッジドキュメントの確認
npm run claude:docs
```

## 🛠️ Claude Code専用コマンド

### 基本コマンド
| コマンド | 説明 | 使用タイミング |
|---------|------|--------------|
| `npm run claude:plan` | 実装計画の準備 | 新機能開発前 |
| `npm run claude:check` | コード品質チェック | 実装中 |
| `npm run claude:quick` | 型チェック＋テスト | 小さな変更後 |
| `npm run claude:review` | 完全レビュー | 機能完成時 |
| `npm run claude:verify` | CI相当の検証 | プルリクエスト前 |
| `npm run claude:all` | フルパイプライン | リリース前 |
| `npm run claude:clean` | ビルド成果物削除 | 環境リセット時 |
| `npm run claude:status` | 現状確認 | 作業再開時 |
| `npm run claude:docs` | ドキュメント確認 | ナレッジ確認時 |

### ワークフロー例

#### 新機能開発
```bash
# 1. 計画
npm run claude:plan
# 2. TDD開発
npm run tdd
# 3. 定期的なチェック
npm run claude:quick
# 4. レビュー
npm run claude:review
# 5. 最終検証
npm run claude:verify
```

#### バグ修正
```bash
# 1. 現状確認
npm run claude:status
# 2. テスト追加
npm run tdd
# 3. 修正実装
npm run claude:check
# 4. 検証
npm run claude:quick
```

#### リファクタリング
```bash
# 1. 事前チェック
npm run claude:verify
# 2. リファクタリング実装
npm run type-check -- --watch
# 3. テスト確認
npm run test
# 4. 最終検証
npm run claude:all
```

## 📝 タスク管理

### タスクの粒度
- **最小タスク**: 30分以内で完了
- **可逆性**: 簡単にロールバック可能
- **独立性**: 他のタスクに依存しない
- **検証可能**: テストで確認できる

### コミットメッセージ規約
```
type(scope): subject

body

footer
```

**type**:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: フォーマット
- refactor: リファクタリング
- test: テスト
- chore: ビルド、補助ツール

## 🎓 ベストプラクティス

### Claude Codeとの対話
1. **明確な指示**: 具体的で測定可能な目標を設定
2. **段階的な作業**: 大きなタスクは分解して依頼
3. **検証の要求**: 各ステップで動作確認を依頼
4. **ナレッジの共有**: 学習内容をCLAUDE.mdに反映

### 効率的な開発
1. **早期の型チェック**: `npm run claude:check`を頻繁に実行
2. **TDD の実践**: テストファーストで品質を保証
3. **小さなPR**: レビューしやすい単位で分割
4. **継続的な文書化**: コードと同時にドキュメント更新

### トラブルシューティング
1. **環境リセット**: `npm run claude:clean`
2. **依存関係の確認**: `npm ci`
3. **型エラーの解決**: `npm run type-check`
4. **テスト失敗の調査**: `npm run test:ui`

## 📚 関連ドキュメント

- [CLAUDE.md](../CLAUDE.md) - プロジェクト固有の指示
- [TDD-WORKFLOW.md](../TDD-WORKFLOW.md) - TDD実践ガイド
- [WEB_COMPONENTS_GUIDELINES.md](../WEB_COMPONENTS_GUIDELINES.md) - コンポーネント開発指針
- [docs/plans/](./plans/) - 実装計画
- [docs/knowledge/](./knowledge/) - ナレッジベース

## 🔄 継続的改善

このワークフローは継続的に改善されます。フィードバックや改善提案は以下の方法で管理:

1. `docs/knowledge/improvements.md`に記録
2. 定期的なレビューと更新
3. CLAUDE.mdへの反映

---

*Last Updated: 2025-09-02*
*Based on: [Zenn Article - My Favorite Claude Code Usage](https://zenn.dev/frontendflat/articles/acc1095edc0d6d)*
