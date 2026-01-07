# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Claude Code Development Workflow

### Development Flow Type
This project follows an **incremental, review-driven development flow** optimized for Claude Code collaboration.

### Core Principles
1. **Incremental Development**: Work in small, reversible chunks
2. **Clear Work Scopes**: Each task should have clear boundaries
3. **Frequent Commits**: Commit after each logical change
4. **Continuous Review**: Review at each stage of development
5. **Knowledge Capture**: Document learnings and patterns

## 🔠 Slash Commands (Claude Code)

Claude Code supports slash commands for streamlined workflow. Full definitions are in `.claude/slash-commands/`.

### Core Commands
| Command | Purpose | Details |
|---------|---------|--------|
| `/design` | Create implementation plan | → [design.md](.claude/commands/design.md) |
| `/revise` | Update plan based on feedback | (standard command) |
| `/implement` | Execute TDD implementation | → [implement.md](.claude/commands/implement.md) |
| `/review` | Multi-perspective code review | → [review.md](.claude/commands/review.md) |
| `/recap` | Extract learnings & knowledge | → [recap.md](.claude/commands/recap.md) |
| `/ask` | Query about codebase | Standard command |
| `/instruct` | Execute specific tasks | Standard command |

### Workflow Example
```
/design 新機能
  ↓
/implement TASK-001
  ↓
/review
  ↓
/recap
```

### Project-Specific Behavior
Commands are customized for Web Components development:
- **Testing**: TDD with vitest
- **Styling**: ::part() instead of classes
- **Types**: No `any`, strict mode
- **Accessibility**: WCAG 2.2 AA compliance
- **Documentation**: Automatic knowledge capture

## Project Overview

This is a TypeScript utility library for creating Web Components with strict typing and no use of `any` types or `Array.forEach`.

## 📋 Standard Development Commands

### Quick Start Commands
```bash
# Start development server
bun server.ts  # TypeScript auto-transpile with viewer.html

# Run tests
npm test       # Run all tests
npm run tdd    # Test-driven development mode

# Type checking
npm run type-check  # Check TypeScript types

# Code quality
npm run lint    # ESLint checking
npm run format  # Prettier formatting

# Build
npm run build   # Production build
npm run ci      # CI pipeline (type-check + test + build)
```

### Advanced Commands
```bash
# Design tokens management
npm run update-tokens  # Update design tokens
npm run check-tokens   # Check token version

# Testing variations
npm run test:watch     # Watch mode
npm run test:ui        # UI test runner
npm run test:coverage  # Coverage report

# Storybook
npm run storybook       # Development mode
npm run build-storybook # Build static Storybook
```

## 🔄 Claude Code Workflow Commands

### 1. Planning Phase
```bash
# Create implementation plan
echo "Create detailed implementation plan in docs/plans/"
# Review existing plans
ls -la docs/plans/
```

### 2. Implementation Phase
```bash
# Start TDD workflow
npm run tdd
# Type check continuously
npm run type-check -- --watch
```

### 3. Review Phase
```bash
# Run all quality checks
npm run ci
# Generate review report
mkdir -p tmp && echo "Review results" > tmp/review-$(date +%Y%m%d-%H%M%S).md
```

### 4. Knowledge Management
```bash
# Create knowledge document
mkdir -p docs/knowledge
touch docs/knowledge/$(date +%Y%m%d)-learnings.md
```

## Running a Single Test

```bash
# Run a specific test file
npm test -- packages/components/accordion.test.ts

# Run tests matching a pattern
npm test -- --grep "accordion"

# Run with verbose output
npm test -- --reporter=verbose
```

## Code Architecture

### File Location Pattern
Files prefixed with `@` (e.g., `@web-components.ts`) are located in `packages/core/` or `packages/utils/`:
- `@web-components.ts` → `packages/core/web-components.ts`
- `@aria.ts` → `packages/utils/aria.ts`
- `@behaviors.ts` → `packages/utils/behaviors.ts`
- `@dom.ts` → `packages/utils/dom.ts`

### Core Library (packages/core/web-components.ts)

1. **WebComponent Base Class**
   - Base class for all web components
   - Handles shadow DOM, styles, and attribute management
   - Static `define()` method for registration

2. **FormComponent**
   - Extends WebComponent for form-associated custom elements
   - Implements form participation API

3. **Template System**
   - `ViewTemplate`: HTML template management with caching
   - `View`: DOM fragment wrapper with ref system for element access
   - `html` template literal function for creating templates

4. **Style Management**
   - `AdoptableStyles`: Manages CSSStyleSheet instances with caching
   - `css` template literal function for creating stylesheets

5. **Attribute System**
   - `PropertyAttr`: Reflected attributes
   - `BooleanAttr`: Boolean attributes
   - `TransferringPropertyAttr`: Transfers attributes to child elements
   - `NonReflectingPropertyAttr`: Non-reflected properties

### Utility Modules

#### @aria.ts
ARIA属性マッピング定義：
- `ariaCommonProperties`: 共通ARIA属性のマッピング（aria-label、aria-hidden等）
- `ariaButtonProperties`: ボタン専用ARIA属性（aria-expanded、aria-pressed）
- JavaScriptプロパティ名とHTML属性名の対応表

使用例：
```typescript
import { ariaCommonProperties } from './aria';

// コンポーネント内でARIA属性を設定
for (const [prop, attr] of ariaCommonProperties) {
  // prop: "ariaLabel", attr: "aria-label"
}
```

#### @behaviors.ts
Web Componentsに共通動作を追加するミックスイン：

- `applyHideEmptySlotBehavior(type, slotId?, targetId?)`
  - 空のスロットを自動的に非表示にする
  - スロットに内容がある場合のみ表示

- `applyStandardFormElementBehavior(type, resetProperty?, resetAttribute?)`
  - フォーム要素の標準動作を実装
  - formResetCallback、formStateRestoreCallback
  - formDisabledCallback、readOnlyChanged

使用例：
```typescript
import { applyHideEmptySlotBehavior, applyStandardFormElementBehavior } from './behaviors';

class MyInput extends FormComponent {
  // クラス定義後に適用
}
applyHideEmptySlotBehavior(MyInput);
applyStandardFormElementBehavior(MyInput);
```

#### @dom.ts
DOM操作ユーティリティ：
- `isNotWhitespace(node)`: 空白のみのテキストノードを除外する判定関数
  - slot要素の内容判定などで使用

## Code Style Requirements

- **Strict TypeScript**: No `any` types allowed
- **No Array.forEach**: Use `for...of` loops instead
- **Private fields**: Use `#` prefix for private class fields
- **Error messages**: Use Japanese for error messages
- **Naming conventions**:
  - Classes: PascalCase
  - Functions/methods: camelCase
  - Private fields: #camelCase

## 🎨 CSS Variable Pattern (重要)

**必読**: `/docs/css-variable-pattern.md` を参照

### 基本原則
1. プロパティと変数のマッピングは一度だけ定義
2. 状態変化は変数の再代入で実現
3. 重複定義の徹底排除

### 正しい実装例
```css
/* ベース要素で一度だけ定義 */
[part="base"] {
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
}

/* 状態変化は変数の再代入のみ */
:host([variant="solid"]:hover) {
  --dads-button-background: var(--button-primary-bg-hover);
}
```

### トークン定義の注意
```typescript
// 文字列として定義
const tokenText = `...`;
// 最後にcss関数で変換
export const tokens = css`${tokenText}`;
```

**重要**: CSSStyleSheetオブジェクトを文字列テンプレート内で展開しないこと

## 🎨 CSS Writing Rules Skill

Claude Code用のCSS実装ガイドラインスキルが `.claude/skills/css-writing-rules/` に配置されています。

### Critical Rules（必須遵守）

1. **!important禁止** - `@layer`で詳細度を管理
2. **::part()必須** - Shadow DOM内でクラスではなくpart属性を使用
3. **変数マッピングは一度だけ** - プロパティ定義は1箇所、状態変化は変数再代入
4. **ネスト1階層** - `@layer`・疑似クラス・メディアクエリを除く
5. **状態はHTML属性** - `.is-open`ではなく`[open]`、`[aria-expanded="true"]`
6. **グローバルトークン必須** - `#000000`ではなく`var(--color-neutral-black)`

### Reference Files

| ファイル | 内容 |
|---------|------|
| `SKILL.md` | クイックリファレンス、ワークフロー |
| `references/core-principles.md` | 基本原則、禁止事項 |
| `references/layer-structure.md` | @layer 8層構造 |
| `references/selectors-and-nesting.md` | セレクタ、ネスト制限 |
| `references/media-queries.md` | レスポンシブ、アクセシビリティ |
| `references/css-variables.md` | 変数パターン、トークン設計 |
| `references/naming-rules.md` | 命名規則 |
| `references/web-components.md` | ::part()、Shadow DOM |

### Sources

- [monosus CSS Coding Guidelines](https://coding-guidelines.pages.dev/05-coding-style/03-css/)
- [monosus Naming Rules](https://coding-guidelines.pages.dev/07-naming-rules/)

## 🎨 Reset CSS Integration

### Overview
Web Componentsでのリセットスタイル管理システムを提供。kiso.css (https://tak-dcxi.github.io/kiso.css/) をベースに、Shadow DOM内でのみ適用される安全な実装。

### Key Features
1. **Shadow DOM隔離**: リセットCSSはコンポーネント内部にのみ適用
2. **既存サイトとの共存**: グローバルスタイルに影響を与えない
3. **選択的適用**: コンポーネントごとにリセットレベルを選択可能

### Usage
```typescript
import { WebComponent, css, html } from './web-components';
import { withReset } from './reset-css';

class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`...`,
    // フルリセットを適用
    styles: withReset(css`
      :host { /* component styles */ }
    `, 'full')
  };
}

// リセットレベル:
// 'full' - kiso.css完全版
// 'minimal' - 最小限のリセット
// カスタムリセットも定義可能
```

### Architecture Decision
- **Shadow DOMのみ**: Light DOMには適用しない（既存サイトへの影響を防ぐ）
- **opt-in方式**: 必要なコンポーネントのみリセット適用
- **パフォーマンス考慮**: CSSStyleSheetキャッシング活用
- **カスタマイズ可能**: withReset()ヘルパーで簡単統合

### Testing
リセットCSSの動作確認：
```bash
# サーバー起動
bun server.ts

# ブラウザでアクセス
# http://localhost:3000/?component=resetCss
```

デモページで以下を確認：
- Shadow DOM内でのリセット適用
- 既存サイトスタイルへの非干渉
- フル/最小限/なしの比較

## 🎯 Web Components Best Practices

### MUST: Use ::part() Instead of Classes for Styling

**重要**: Web Components を実装する際は、Shadow DOM 内の要素のスタイリングにクラスではなく `::part()` を使用してください。

#### ✅ 正しい実装
```html
<!-- Shadow DOM 内 -->
<summary part="summary">
  <span part="icon">
    <svg part="icon-svg">...</svg>
  </span>
  <span part="header-text">
    <slot name="header"></slot>
  </span>
</summary>
<div part="content">
  <slot name="content"></slot>
</div>
```

```css
/* 外部からのスタイリング */
my-component::part(summary) { /* ... */ }
my-component::part(icon) { /* ... */ }
my-component::part(content) { /* ... */ }
```

#### ❌ 避けるべき実装
```html
<!-- クラスベースの実装は避ける -->
<div class="accordion-summary">
  <span class="accordion-icon">...</span>
</div>
```

#### なぜ ::part() を使うのか

1. **カプセル化の維持**: Shadow DOM の境界を保ちながら、特定の部分だけを公開
2. **意図的な API**: コンポーネント作者が「どこがカスタマイズ可能か」を明示的に定義
3. **セマンティック**: part属性で要素の役割を意味的に表現
4. **スコープの明確化**: グローバルなクラス名の衝突を避ける
5. **テーマ対応**: 親要素のクラスで子コンポーネントのスタイルを一括変更可能

### MUST: Prefer Native HTML Elements

**重要**: 可能な限りネイティブHTML要素を活用してください。

- `details/summary` をアコーディオンに使用
- `dialog` をモーダルに使用
- `input[type="date"]` を日付選択に使用
- フォーム要素には適切な type 属性を使用

理由：
- ネイティブのアクセシビリティ機能
- ブラウザ標準のキーボード操作
- スクリーンリーダー対応
- プログレッシブエンハンスメント

### MUST: Use viewer.html for Component Testing

**重要**: 新しいデモHTMLファイルを作成しないでください。

コンポーネントのテストや確認は `viewer.html` のみを使用：
```bash
# サーバーを起動（TypeScript自動トランスパイル対応）
bun server.ts
```

アクセス: 
- http://localhost:3000/ - viewer.html（自動的にリダイレクト）
- http://localhost:3000/viewer.html - 直接アクセス

理由：
- HTMLファイルの乱立を防ぐ
- TypeScriptの再コンパイル不要
- 統一されたテスト環境
- クエリパラメータで簡単切り替え

## ♿ Accessibility Guidelines (DADS準拠)

### MUST: aria-live / role="alert" を使わない

**重要**: DADSガイドラインでは、**エラーテキストの読み上げにaria-liveを使わない**ことを規定しています。

```html
<!-- NG: スクリーンリーダーの読み上げが割り込む -->
<span id="error" aria-live="polite">エラーメッセージ</span>
<div id="error" role="alert">エラーメッセージ</div>

<!-- OK: 静的テキスト + aria-describedby -->
<input aria-describedby="error" aria-invalid="true">
<span id="error">エラーメッセージ</span>
```

**理由**: 「エラーテキストの読み上げが割り込んでくることになり、スクリーンリーダーユーザーの閲覧や操作の妨げとなる」

### MUST: aria-describedby で動的関連付け

複数の説明要素（サポートテキスト、カウンター、エラー）を状態に応じて管理：

```typescript
#updateAriaDescribedBy(): void {
  const ids: string[] = [];
  if (this.#hasSupportText()) ids.push('support-text');
  if (this.hasAttribute('show-counter')) ids.push('counter');
  if (this.hasAttribute('error')) ids.push('error-text');

  if (ids.length > 0) {
    this.#input.setAttribute('aria-describedby', ids.join(' '));
  } else {
    this.#input.removeAttribute('aria-describedby');
  }
}
```

### MUST: エラーメッセージはDADS準拠文言

| エラー種別 | 推奨メッセージ |
|-----------|---------------|
| 必須未入力 | この項目は入力が必須です |
| 文字数超過 | 入力できる文字数を超えています |

### Quick Reference

| 要件 | 実装方法 |
|------|----------|
| ラベル関連付け | `<label for="id">` + `<input id="id">` |
| エラー状態 | `aria-invalid="true/false"` |
| 説明テキスト | `aria-describedby` |
| 必須表示 | `aria-required="true"` + 視覚的表示 |

### 詳細ドキュメント

- [アクセシビリティガイドライン](docs/knowledge/accessibility-guidelines.md)
- [DADS Input Text Accessibility](https://design.digital.go.jp/dads/components/input-text/accessibility/)
- [DADS Textarea](https://design.digital.go.jp/dads/components/textarea/)

## 🎬 E2Eエビデンス取得（Playwright MCP）

### 概要
Playwright MCPを使用してブラウザ操作を自動化し、スクリーンショットと動画でエビデンスを取得する。

### 前提条件
```bash
# サーバー起動
bun server.ts

# 確認
curl http://localhost:3000/
```

### エージェント呼び出し
```
Task({
  description: "E2E evidence capture",
  prompt: "...(詳細なプロンプト)...",
  subagent_type: "playwright-automation-expert"
})
```

### エビデンス保存先
```
e2e-evidence/
├── 01-initial-state.png     # スクリーンショット
├── 02-after-action.png
├── *-recording-*.webm       # 動画
└── README.md                # エビデンス一覧
```

### 詳細ガイド
→ [E2Eエビデンス取得ガイド](docs/knowledge/e2e-evidence-guide.md)

---

## Development Workflow

When modifying code:
1. Maintain strict TypeScript compliance
2. Follow existing patterns for component creation
3. Use the established attribute behavior system
4. Ensure proper encapsulation with private fields
5. Type check with: `npm run type-check`

## 📚 Project Documentation Structure

### Knowledge Management
- **[Development Workflow](docs/claude-code-workflow.md)**: Claude Code開発フロー
- **[Knowledge Base](docs/knowledge/)**: 学習内容とパターン
  - [Learnings](docs/knowledge/learnings.md): 学習記録
  - [Patterns](docs/knowledge/patterns.md): 再利用可能パターン
  - [E2Eエビデンス取得ガイド](docs/knowledge/e2e-evidence-guide.md): Playwright MCPによるE2Eテスト
- **[Implementation Plans](docs/plans/)**: 実装計画
- **[Reviews](docs/reviews/)**: レビュー結果

### Quick Reference

#### Slash Commands (Primary)
```
/design      # Create implementation plan
/implement   # Execute implementation
/revise      # Update plan
/review      # Code review
/recap       # Extract knowledge
```

#### NPM Scripts (Support)
```bash
# Testing & Validation
npm run tdd            # TDD mode
npm run claude:check   # Quick type & lint check
npm run claude:quick   # Type check + test
npm run claude:verify  # Full CI verification

# Utilities
npm run claude:docs    # Check documentation
npm run claude:status  # Current status
npm run claude:clean   # Clean build artifacts
```

## Key Patterns

### Creating a Component
```typescript
class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`<div>Content</div>`,
    styles: css`:host { display: block; }`,
    attributes: ['value', BooleanAttr('disabled')]
  };
}
MyComponent.define();
```

### Form-Associated Component
```typescript
class MyInput extends FormComponent {
  static readonly formAssociated = true;
  // Implements form participation
}
```