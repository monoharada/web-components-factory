# CSS Variables Management

## Contents

- [Token Architecture](#token-architecture)
- [Critical: Always Use Global Tokens](#critical-always-use-global-tokens)
- [Critical Pattern: Property-Variable Mapping](#critical-pattern-property-variable-mapping)
- [Scope Chain](#scope-chain)
- [Token Definition in TypeScript](#token-definition-in-typescript)
- [Global Variables (:root)](#global-variables-root)
- [Fallback Values](#fallback-values)
- [Component Token File Structure](#component-token-file-structure)
- [DevTools Debugging](#devtools-debugging)

## Token Architecture

3層のトークン構造：

```
Primitive Tokens    →   Semantic Tokens       →   Local Tokens         →   Properties
--color-blue-900        --button-primary-bg       --dads-button-bg         background-color
```

### 1. Primitive Tokens（プリミティブ）

デザインシステムの基本値：

```css
:root {
  --color-primitive-blue-900: #0017c1;
  --color-primitive-blue-1000: #00118f;
  --space-4: 1rem;
}
```

### 2. Semantic Tokens（セマンティック）

意味を持つ値：

```css
:host {
  --button-primary-bg: var(--color-primitive-blue-900);
  --button-primary-bg-hover: var(--color-primitive-blue-1000);
  --button-primary-text: var(--color-primitive-white);
}
```

### 3. Local Tokens（ローカル）

コンポーネントのカスタマイズ用：

```css
:host {
  --dads-button-background: var(--button-primary-bg);
  --dads-button-color: var(--button-primary-text);
  --dads-button-border-color: var(--button-primary-border);
}
```

## Critical: Always Use Global Tokens

**ハードコードされた色値は絶対禁止。常にグローバルトークンを参照する。**

```css
/* NG: ハードコード */
@media print {
  [part="base"] {
    --dads-button-color: #000000;
  }
}

/* OK: グローバルトークン参照 */
@media print {
  [part="base"] {
    --dads-button-color: var(--color-neutral-black);
  }
}
```

### 理由

1. **一貫性**: デザインシステム全体で色を統一管理
2. **保守性**: 色の変更が1箇所で済む
3. **テーマ対応**: ダークモード等への切り替えが容易
4. **トレーサビリティ**: どの色がどこで使われているか追跡可能

### 許容される例外

- `transparent`（透明）
- `currentColor`（継承色）
- `inherit`（継承値）

## Critical Pattern: Property-Variable Mapping

### 基本原則

1. **プロパティと変数のマッピングは一度だけ定義**
2. **状態変化は変数の再代入で実現**
3. **重複定義の徹底排除**

### OK: 正しいパターン

```css
/* ベース要素で全プロパティを変数マッピング（一度だけ） */
[part="base"] {
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
  border: var(--dads-button-border-width) solid var(--dads-button-border-color);
}

/* 状態変化は変数の再代入のみ */
:host([variant="solid"]:not([disabled])) [part="base"]:hover {
  --dads-button-background: var(--button-primary-bg-hover);
  /* プロパティの再定義はしない */
}

:host([variant="outlined"]:not([disabled])) [part="base"]:hover {
  --dads-button-background: var(--button-secondary-bg-hover);
  --dads-button-color: var(--button-secondary-text-hover);
  --dads-button-border-color: var(--button-secondary-border-hover);
}
```

### NG: 避けるべきパターン

```css
/* 悪い例: プロパティを何度も定義 */
:host([variant="solid"]) [part="base"] {
  background-color: var(--dads-button-background, #0017c1);  /* 1回目 */
}

:host([variant="solid"]) [part="base"]:hover {
  background-color: var(--dads-button-background-hover, #00118f);  /* 重複！ */
}
```

## Scope Chain

変数の継承順序：

```
:host → [part="base"] → :hover/:focus → ::before/::after
```

各レベルで変数を再定義可能：

```css
/* :hostレベル - バリアント初期値 */
:host([variant="solid"]) {
  --dads-button-background: var(--button-primary-bg);
}

/* [part]レベル - ベース定義 */
[part="base"] {
  background-color: var(--dads-button-background);
}

/* 状態レベル - 状態変化 */
:host([variant="solid"]:hover) {
  --dads-button-background: var(--button-primary-bg-hover);
}
```

## Token Definition in TypeScript

### OK: 文字列として定義 → css関数で変換

```typescript
// セマンティックトークンを文字列として定義
const buttonSemanticTokensText = `
  :host {
    --button-primary-bg: var(--color-primitive-blue-900);
    --button-primary-bg-hover: var(--color-primitive-blue-1000);
  }
`;

// ローカルトークンを文字列として定義
const buttonLocalTokensText = `
  :host {
    --dads-button-background: var(--button-primary-bg);
    --dads-button-color: var(--button-primary-text);
  }
`;

// 最後にcss関数で変換
export const buttonTokens = css`
  ${buttonSemanticTokensText}
  ${buttonLocalTokensText}
`;
```

### NG: CSSStyleSheetを文字列内で展開

```typescript
// ❌ 悪い: CSSStyleSheetオブジェクトを文字列内で展開
// 変数の値が失われる！
export const styles = css`
  ${someExistingStyleSheet}
`;

// ❌ 悪い: css関数の結果を文字列結合
const partA = css`:host { color: blue; }`;
const combined = css`${partA}`;  // 変数が消失
```

## Global Variables (:root)

`tokens`レイヤーで一元管理：

```css
@layer tokens {
  :root {
    /* Colors */
    --system-base-color: #fff;
    --system-text-color: #333;

    /* Font sizes */
    --text-size-sm: 0.875rem;
    --text-size-md: 1rem;
    --text-size-lg: 1.25rem;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;

    /* Others */
    --rounded-sm: 0.25rem;
    --speed-md: 0.4s;
    --z-modal: 1000;
  }
}
```

## Fallback Values

### 開発中

フォールバック値を設定してデバッグを容易に：

```css
background-color: var(--dads-button-background, hotpink);
```

### 本番

トークンシステムを信頼し、フォールバックを削除：

```css
background-color: var(--dads-button-background);
```

## Component Token File Structure

### File Location

```
packages/styles/design-tokens/
├── button-tokens.ts
├── accordion-tokens.ts
├── typography-tokens.ts
└── {component}-tokens.ts
```

### File Naming

`{component}-tokens.ts` 形式で命名。

### Complete Token File Template

```typescript
/**
 * {Component}コンポーネント用デザイントークン
 */
import { css } from '../../core/web-components.js';

/**
 * セマンティックトークン（意味的な値）
 */
const componentSemanticTokensText = `
  :host {
    /* Primary */
    --component-primary-bg: var(--color-primitive-blue-900);
    --component-primary-bg-hover: var(--color-primitive-blue-1000);
    --component-primary-text: var(--color-primitive-white);

    /* Secondary */
    --component-secondary-bg: var(--color-primitive-white);
    --component-secondary-bg-hover: var(--color-primitive-blue-200);
    --component-secondary-text: var(--color-primitive-blue-900);

    /* Disabled */
    --component-disabled-bg: var(--color-neutral-solid-gray-300);
    --component-disabled-text: var(--color-neutral-solid-gray-50);

    /* Size */
    --component-padding-small: 8px 16px;
    --component-padding-medium: 12px 24px;
    --component-padding-large: 16px 32px;
  }
`;

/**
 * ローカルコンポーネントトークン（カスタマイズ用）
 */
const componentLocalTokensText = `
  :host {
    /* デフォルト値 */
    --dads-component-background: var(--component-primary-bg);
    --dads-component-color: var(--component-primary-text);
    --dads-component-padding: var(--component-padding-medium);
  }

  /* バリアント別の上書き */
  :host([variant="solid"]) {
    --dads-component-background: var(--component-primary-bg);
    --dads-component-color: var(--component-primary-text);
  }

  :host([variant="outlined"]) {
    --dads-component-background: var(--component-secondary-bg);
    --dads-component-color: var(--component-secondary-text);
  }

  /* サイズ別の上書き */
  :host([size="small"]) {
    --dads-component-padding: var(--component-padding-small);
  }

  :host([size="large"]) {
    --dads-component-padding: var(--component-padding-large);
  }

  /* 無効状態 */
  :host([disabled]) {
    --dads-component-background: var(--component-disabled-bg);
    --dads-component-color: var(--component-disabled-text);
  }
`;

// 個別エクスポート
export const componentSemanticTokens = css`${componentSemanticTokensText}`;
export const componentLocalTokens = css`${componentLocalTokensText}`;

// 統合トークン
export const componentTokens = css`
  ${componentSemanticTokensText}
  ${componentLocalTokensText}
`;

/**
 * TypeScript型定義（オプション）
 */
export interface ComponentTokens {
  background: string;
  color: string;
  padding: string;
}
```

### Variant Token Override Pattern

バリアントごとにローカルトークンを上書き：

```css
/* デフォルト（primaryバリアント相当） */
:host {
  --dads-button-background: var(--button-primary-bg);
  --dads-button-color: var(--button-primary-text);
}

/* solidバリアント */
:host([variant="solid"]) {
  --dads-button-background: var(--button-primary-bg);
  --dads-button-color: var(--button-primary-text);
}

/* outlinedバリアント */
:host([variant="outlined"]) {
  --dads-button-background: var(--button-secondary-bg);
  --dads-button-color: var(--button-secondary-text);
  --dads-button-border-width: 1px;
}

/* textバリアント */
:host([variant="text"]) {
  --dads-button-background: transparent;
  --dads-button-border-width: 0;
}
```

### State + Variant Combination

バリアントと状態を組み合わせる：

```css
/* 無効状態はバリアント別に定義 */
:host([variant="solid"][disabled]) {
  --dads-button-background: var(--button-disabled-primary-bg);
  --dads-button-color: var(--button-disabled-primary-text);
}

:host([variant="outlined"][disabled]) {
  --dads-button-background: var(--button-disabled-secondary-bg);
  --dads-button-color: var(--button-disabled-secondary-text);
}
```

### External Customization

コンポーネント利用者はローカルトークンを上書き：

```css
/* ユーザーカスタマイズ */
dads-button {
  --dads-button-background: #ff0000;
  --dads-button-border-radius: 24px;
}

dads-button.my-custom {
  --dads-button-padding: 20px 40px;
}
```

## DevTools Debugging

1. **継承チェーン確認**: Elements > Computed > Show all
2. **変数の上書き確認**: Elements > Styles で各セレクタの変数値を確認
3. **無効な変数**: `var(--undefined)` はDevToolsで警告表示
