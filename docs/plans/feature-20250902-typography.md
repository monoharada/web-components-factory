# デジタル庁タイポグラフィシステム実装計画（Shape Up版）

## 🎯 Pitch（ピッチ）

### Problem（問題）
デジタル庁のタイポグラフィガイドラインを実装する標準的な方法がなく、各プロジェクトで車輪の再発明が発生している。

### Appetite（アペタイト）
**Small Batch: 1週間** - これ以上は投資しない
- 固定時間、可変スコープの原則を適用
- 完璧より「Good Enough」を優先

### Solution（解決策の概要）
1. CSS変数によるタイポグラフィトークンシステム
2. 最小限だが実用的な`<dads-text>`コンポーネント
3. 他のコンポーネントが継承できる基盤構造

## 🎭 Shaped Work（形作られた作業）

### Must Have（必須要素）
1. ✅ タイポグラフィトークン（CSS変数）
2. ✅ 基本テキストコンポーネント1つ
3. ✅ 既存プロジェクトでの動作確認

### Nice to Have（あれば良い要素）
- ⭕ 完全なバリエーション対応
- ⭕ fluid typography
- ⭕ 包括的なアクセシビリティ
- ⭕ 詳細なドキュメント

### Explicitly Out（意図的に除外）
- ❌ 全テキストスタイルの実装（最重要3つのみ）
- ❌ 完全なWCAG 2.2 AA準拠（次サイクル）
- ❌ レスポンシブタイポグラフィの完全実装
- ❌ Storybookストーリー（次サイクル）

## 🔍 Research Findings

### Internal Code References
- `packages/styles/design-tokens/button-tokens.ts` - デザイントークン実装パターン
- `packages/core/web-components.ts` - ベースクラス構造
- `docs/css-variable-pattern.md` - CSS変数設計ガイドライン
- `docs/knowledge/patterns.md` - コンポーネント定義パターン

### External Documentation URLs
- https://design.digital.go.jp/foundations/typography/ - 基本タイポグラフィ
- https://design.digital.go.jp/foundations/typography/text-style/ - テキストスタイル定義
- https://design.digital.go.jp/foundations/typography/accessibility/ - アクセシビリティ要件
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.7.0 - Figmaデザインデータ

### Best Practices Discovered

#### デジタル庁ガイドライン要点
1. **フォントファミリー**
   - プライマリ: "Noto Sans JP" (sans-serif)
   - モノスペース: "Noto Sans Mono"
   - フォールバック: -apple-system, BlinkMacSystemFont

2. **フォントウェイト**
   - Normal (N): 400
   - Bold (B): 700
   - 数値指定: 100-900

3. **テキストスタイルカテゴリ**
   - Display (Dsp): 表示用大型テキスト
   - Standard (Std): 標準テキスト
   - Dense (Dns): 密集表示
   - Oneline (Oln): 一行表示
   - Mono: 等幅

4. **サイズ範囲**
   - 最小推奨: 16px
   - 範囲: 14-64px
   - 14px使用時は注意が必要

5. **行高**
   - 最小推奨: 1.5 (150%)
   - 範囲: 100%-175%
   - 用途別:
     - 100%: UIコンポーネント
     - 120-130%: 密集情報
     - 140-150%: 見出し
     - 160-175%: 本文

## 🗻 Hill Chart（ヒルチャート）- 3つの不確実性

### 不確実性1: トークンシステム設計
```
      頂上
       /\
  登り/  \下り
     /    \
問題解決   実装

状態: [登り] デザイントークンのCSS変数マッピング方法を決定
ゴール: 「これが分かれば下り坂」= 変数の階層構造が確定
```

### 不確実性2: コンポーネントAPI
```
状態: [未着手] 
ゴール: 「これが分かれば下り坂」= 属性とスタイルの対応が明確
```

### 不確実性3: 既存システムとの統合
```
状態: [未着手]
ゴール: 「これが分かれば下り坂」= Shadow DOM内での動作確認
```

## 🏗️ Minimal Architecture（最小アーキテクチャ）

### Week 1 Scope（今週のスコープ）
```
packages/
├── styles/
│   └── design-tokens/
│       └── typography-tokens.ts    # 最小限のトークン
└── components/
    └── typography/
        └── dads-text.ts            # 1つの汎用コンポーネント
```

### Future Cycles（将来のサイクル）
- Cycle 2: 追加コンポーネント（heading, paragraph）
- Cycle 3: アクセシビリティ強化
- Cycle 4: レスポンシブ対応

## 📅 Circuit Breaker Schedule（サーキットブレーカースケジュール）

### Day 1-2: 不確実性の解決
**月曜-火曜: 登り坂を攻略**
```markdown
✅ MUST: トークンシステムの設計確定
✅ MUST: CSS変数の階層構造決定
✅ MUST: 最小限の動作確認
⭕ NICE: TypeScript型定義
❌ SKIP: 全テキストスタイル定義
```

### Day 3-4: 実装スプリント
**水曜-木曜: 下り坂を駆け下りる**
```markdown
✅ MUST: typography-tokens.ts実装
✅ MUST: dads-textコンポーネント（最小版）
✅ MUST: viewer.htmlでの動作確認
⭕ NICE: 基本的なテスト
❌ SKIP: 他のコンポーネント
```

### Day 5: Cool-down
**金曜: 統合とラップアップ**
```markdown
✅ MUST: 既存プロジェクトでの動作確認
✅ MUST: 次サイクルへの申し送り作成
⭕ NICE: 簡潔なREADME
❌ SKIP: 詳細ドキュメント
```

## 🎲 Betting Table Questions（ベッティングテーブルの質問）

### このプロジェクトに賭けるべきか？
1. **問題は実在するか？** → Yes、標準化の欠如は実際の痛み
2. **解決策は明確か？** → Yes、CSS変数とWeb Components
3. **1週間で価値を提供できるか？** → Yes、最小限でも有用
4. **次のサイクルに延期できるか？** → No、基盤なので今必要

### リスクと対策
| リスク | 緩和策 | Go/No-Go |
|--------|--------|----------|
| Shadow DOM内でのフォント継承 | Day 1に検証 | Day 2判断 |
| パフォーマンス問題 | 最小構成で開始 | 継続 |
| デザイントークンの複雑化 | シンプルに保つ | 継続 |

## 🧪 Minimal Test Strategy（最小限のテスト戦略）

### Week 1 Testing（今週のテスト）
```markdown
✅ MUST: viewer.htmlでの手動確認
✅ MUST: 基本的な動作テスト1つ
⭕ NICE: ユニットテスト
❌ SKIP: E2Eテスト（次サイクル）
```

### Definition of Done（完了の定義）
- [ ] CSS変数が適用される
- [ ] コンポーネントが表示される
- [ ] エラーが出ない
- これで十分！完璧は敵

## ⚠️ Rabbit Holes to Avoid（避けるべき落とし穴）

### Week 1で避けること
1. **パフォーマンス最適化の沼**
   - 動けばOK、最適化は次サイクル
   
2. **完全なアクセシビリティ対応**
   - 基本的な構造のみ、詳細は次サイクル
   
3. **全バリエーションの実装**
   - 3つのスタイルで十分、残りは必要になってから

### Day 2のGo/No-Go判断基準
```markdown
GO条件:
✅ CSS変数が動作する
✅ Shadow DOM内で表示される
✅ 既存コンポーネントと共存できる

NO-GO条件:
❌ フォント継承が解決不可能
❌ パフォーマンスが致命的
❌ 根本的な設計問題が発覚
```

## 🎯 Fat Marker Sketches（太マーカースケッチ）

### 最終成果物のイメージ
```html
<!-- これが動けば成功！ -->
<dads-text variant="standard" size="16">
  デジタル庁のテキスト
</dads-text>

<!-- CSS変数でカスタマイズ可能 -->
<style>
  dads-text {
    --typography-font-size: 18px;
  }
</style>
```

## 📅 Daily Stand-up Questions（毎日の質問）

### 毎朝自問すること
1. **今日必須のものは何か？**
2. **これがなければ金曜日に困るか？**
3. **来週に回せないか？**

### 毎夕確認すること
1. **ヒルチャートのどこにいるか？**
2. **明日も続けるか、方向転換するか？**
3. **スコープを削る必要があるか？**

## 🏁 Ship It!（出荷！）

### 金曜日の出荷条件
- [ ] typography-tokens.tsが存在する
- [ ] dads-text.tsが動作する
- [ ] viewer.htmlで確認できる
- [ ] 次サイクルへの申し送りがある

**これだけ！完璧を待たない！**

---

*作成日: 2025-09-02*
*作成者: Claude Code*
*バージョン: 1.0.0*