# 📚 Knowledge Base

このディレクトリには、プロジェクトの開発過程で得られた知識、学習内容、パターンを記録します。

## 📂 構造

```
knowledge/
├── README.md           # このファイル
├── learnings.md        # 学習内容の記録
├── patterns.md         # 発見したパターン
├── improvements.md     # 改善提案
└── decisions.md        # 技術的決定事項
```

## 📝 記録すべき内容

### Learnings (learnings.md)
- 新しく学んだ技術やテクニック
- 問題の解決方法
- 効率的な実装パターン
- 避けるべきアンチパターン

### Patterns (patterns.md)
- 再利用可能なコードパターン
- アーキテクチャパターン
- テストパターン
- デバッグパターン

### Improvements (improvements.md)
- ワークフローの改善提案
- ツールの改善案
- プロセスの最適化
- 自動化の機会

### Decisions (decisions.md)
- 技術選定の理由
- アーキテクチャの決定
- トレードオフの記録
- 代替案の検討

## 🔄 更新ルール

1. **即座に記録**: 発見や学習があったらすぐに記録
2. **具体的に書く**: 抽象的な記述を避け、具体例を含める
3. **日付を含める**: 各エントリーに日付を記載
4. **タグを使用**: 関連するトピックにタグを付ける

## 🏷️ タグシステム

よく使用するタグ:
- `#performance` - パフォーマンス関連
- `#accessibility` - アクセシビリティ
- `#testing` - テスト関連
- `#typescript` - TypeScript固有
- `#webcomponents` - Web Components
- `#css` - スタイリング
- `#architecture` - アーキテクチャ
- `#tooling` - ツール・環境
- `#workflow` - ワークフロー
- `#debug` - デバッグ

## 📖 テンプレート

### Learning Entry
```markdown
## [日付] タイトル
**タグ**: #tag1 #tag2

### 概要
簡潔な説明

### 詳細
- 具体的な内容
- コード例
- 参考リンク

### 適用例
実際の使用例

### 注意点
気をつけるべきこと
```

### Pattern Entry
```markdown
## パターン名
**タグ**: #tag1 #tag2
**適用場面**: いつ使うか

### 問題
解決したい問題

### 解決策
```typescript
// コード例
```

### 結果
- メリット
- デメリット

### 関連パターン
- 関連するパターンへのリンク
```

## 🔍 検索方法

```bash
# タグで検索
grep -r "#performance" docs/knowledge/

# キーワード検索
grep -ri "accessibility" docs/knowledge/

# 最近の更新を確認
ls -lt docs/knowledge/
```

## 📊 定期レビュー

月次でナレッジベースをレビューし:
1. 古い情報の更新
2. パターンの抽出
3. CLAUDE.mdへの反映
4. チーム共有用ドキュメントの作成

---

*Knowledge is power - 知識は力なり*