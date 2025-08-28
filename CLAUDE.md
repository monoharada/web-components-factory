# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript utility library for creating Web Components with strict typing and no use of `any` types or `Array.forEach`.

## Commands

### TypeScript Compilation
```bash
# Type check only (no emit)
tsc --noEmit web-components.ts --strict

# Compile to JavaScript
tsc web-components.ts --strict --target ES2020 --module ES2020
```

Note: No package.json or build system is configured. Consider setting up proper tooling as the project grows.

## Code Architecture

### Core Library (@web-components.ts)

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

## Development Workflow

When modifying code:
1. Maintain strict TypeScript compliance
2. Follow existing patterns for component creation
3. Use the established attribute behavior system
4. Ensure proper encapsulation with private fields
5. Type check with: `tsc --noEmit web-components.ts --strict`

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