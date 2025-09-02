# 🔸 Claude Code Slash Commands

このディレクトリには、Claude Codeのスラッシュコマンドの詳細定義が含まれています。

## 📋 Available Commands

| Command | Purpose | Output |
|---------|---------|--------|
| `/design` | 実装計画の作成 | `docs/plans/` に計画書 |
| `/revise` | 計画の修正・更新 | 既存計画の更新 |
| `/implement` | TDD実装の実行 | コード実装とテスト |
| `/review` | 多角的コードレビュー | `tmp/review-*.md` |
| `/recap` | 振り返りと知識抽出 | `docs/knowledge/` 更新 |
| `/ask` | コードベース質問 | 回答と説明 |
| `/instruct` | 具体的指示実行 | 指定タスクの完了 |

## 🔄 Standard Workflow

```mermaid
graph LR
    A[/design] --> B[/implement]
    B --> C[/review]
    C --> D[/recap]
    B --> E[/revise]
    E --> B
```

## 📁 File Structure

```
.claude/slash-commands/
├── README.md        # This file
├── design.md        # /design command spec
├── revise.md        # /revise command spec
├── implement.md     # /implement command spec
├── review.md        # /review command spec
├── recap.md         # /recap command spec
├── ask.md          # /ask command spec
└── instruct.md     # /instruct command spec
```

## 🎯 Quick Start Examples

### New Feature Development
```
1. /design アコーディオンコンポーネントの実装
2. /implement TASK-001: 基本構造の作成
3. /review
4. /implement TASK-002: アニメーション追加
5. /review
6. /recap アコーディオン実装完了
```

### Bug Fix
```
1. /ask ボタンのホバー状態のバグについて
2. /design ホバー状態バグの修正
3. /implement バグ修正
4. /review
5. /recap ホバーバグ修正
```

### Refactoring
```
1. /design CSS変数パターンのリファクタリング
2. /implement リファクタリング実行
3. /review パフォーマンスとコード品質
4. /recap リファクタリング完了
```

## 🔧 Customization

各コマンドはプロジェクト固有の要件に合わせてカスタマイズされています：

### Web Components特有の考慮事項
- Shadow DOM の適切な使用
- ::part() によるスタイリング
- カスタム要素の登録

### TypeScript要件
- strict モードの遵守
- any 型の禁止
- 適切な型定義

### アクセシビリティ
- WCAG 2.2 AA 準拠
- キーボードナビゲーション
- スクリーンリーダー対応

## 📚 Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - プロジェクト設定
- [claude-code-workflow.md](../../docs/claude-code-workflow.md) - ワークフロー
- [slash-commands.md](../../docs/slash-commands.md) - ユーザーガイド

## 🔄 Command Lifecycle

### Planning Phase
- `/design` - Create initial plan
- `/revise` - Update based on feedback

### Implementation Phase
- `/implement` - Execute development
- `/ask` - Get clarification
- `/instruct` - Specific tasks

### Quality Phase
- `/review` - Quality assessment

### Knowledge Phase
- `/recap` - Extract learnings

## ⚙️ Integration Points

### With NPM Scripts
Commands work in conjunction with npm scripts:
- `npm run tdd` - Used during `/implement`
- `npm run claude:review` - Used during `/review`
- `npm run claude:verify` - Final validation

### With Git
- Commits after each `/implement` task
- Branch management during development
- PR creation after `/review`

### With Documentation
- Plans in `docs/plans/`
- Knowledge in `docs/knowledge/`
- Reviews in `tmp/`

## 🚀 Best Practices

1. **Always start with `/design`**
   - Clear plan before implementation
   - Identify risks early

2. **Use `/implement` incrementally**
   - Small, testable chunks
   - Frequent commits

3. **Regular `/review`**
   - After each major task
   - Before merging

4. **Never skip `/recap`**
   - Capture learnings immediately
   - Update knowledge base

## 🔍 Troubleshooting

### Command Not Working?
1. Check prerequisites (files, context)
2. Verify command syntax
3. Review command-specific documentation

### Output Not Generated?
1. Check output directories exist
2. Verify write permissions
3. Look for error messages

### Integration Issues?
1. Ensure npm scripts are set up
2. Check Git repository status
3. Verify serena tools availability

---

*These commands are designed to work together as a cohesive development system.*