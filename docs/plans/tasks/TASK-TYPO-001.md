# TASK-TYPO-001: タイポグラフィトークン定義

## 📋 概要
デジタル庁デザインシステムのタイポグラフィ基盤となるデザイントークンを定義する。

## 🎯 完了条件
- [ ] プリミティブトークンの定義完了
- [ ] セマンティックトークンの定義完了
- [ ] TypeScript型定義の作成
- [ ] ユニットテストの作成と全パス
- [ ] CSS変数として利用可能な状態

## 📝 実装詳細

### 1. プリミティブトークン
```typescript
// packages/styles/design-tokens/typography-tokens.ts

const typographyPrimitiveTokensText = `
  :host {
    /* Font Families */
    --font-family-sans: "Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif;
    --font-family-mono: "Noto Sans Mono", monospace;
    
    /* Font Sizes (14-64px) */
    --font-size-14: 0.875rem;
    --font-size-16: 1rem;
    --font-size-17: 1.0625rem;
    --font-size-18: 1.125rem;
    --font-size-20: 1.25rem;
    --font-size-24: 1.5rem;
    --font-size-28: 1.75rem;
    --font-size-32: 2rem;
    --font-size-45: 2.8125rem;
    --font-size-64: 4rem;
    
    /* Font Weights */
    --font-weight-100: 100;
    --font-weight-200: 200;
    --font-weight-300: 300;
    --font-weight-400: 400;  /* Normal */
    --font-weight-500: 500;
    --font-weight-600: 600;
    --font-weight-700: 700;  /* Bold */
    --font-weight-800: 800;
    --font-weight-900: 900;
    
    /* Line Heights */
    --line-height-100: 1;      /* 100% */
    --line-height-120: 1.2;    /* 120% */
    --line-height-130: 1.3;    /* 130% */
    --line-height-140: 1.4;    /* 140% */
    --line-height-150: 1.5;    /* 150% */
    --line-height-160: 1.6;    /* 160% */
    --line-height-175: 1.75;   /* 175% */
  }
`;
```

### 2. セマンティックトークン
```typescript
const typographySemanticTokensText = `
  :host {
    /* Display Category */
    --typography-display-font: var(--font-family-sans);
    --typography-display-weight-normal: var(--font-weight-400);
    --typography-display-weight-bold: var(--font-weight-700);
    
    /* Standard Category */
    --typography-standard-font: var(--font-family-sans);
    --typography-standard-weight-normal: var(--font-weight-400);
    --typography-standard-weight-bold: var(--font-weight-700);
    
    /* Dense Category */
    --typography-dense-font: var(--font-family-sans);
    --typography-dense-weight-normal: var(--font-weight-400);
    --typography-dense-weight-bold: var(--font-weight-700);
    
    /* Oneline Category */
    --typography-oneline-font: var(--font-family-sans);
    --typography-oneline-weight-normal: var(--font-weight-400);
    --typography-oneline-weight-bold: var(--font-weight-700);
    
    /* Mono Category */
    --typography-mono-font: var(--font-family-mono);
    --typography-mono-weight-normal: var(--font-weight-400);
    --typography-mono-weight-bold: var(--font-weight-700);
  }
`;
```

### 3. TypeScript型定義
```typescript
export interface TypographyTokens {
  // Primitive
  fontFamilySans: string;
  fontFamilyMono: string;
  fontSize14: string;
  fontSize16: string;
  // ... etc
  
  // Semantic
  displayFont: string;
  displayWeightNormal: string;
  displayWeightBold: string;
  // ... etc
}
```

## 🧪 テスト要件
- CSS変数が正しく定義されているか
- フォールバックが機能するか
- 値の範囲が仕様通りか
- TypeScript型が正しく機能するか

## 📚 参考資料
- https://design.digital.go.jp/foundations/typography/
- デジタル庁デザインシステム v2.7.0

## ⏱️ 見積時間
2時間

## 🔗 依存関係
なし（最初のタスク）

## 📦 成果物
- `packages/styles/design-tokens/typography-tokens.ts`
- `tests/design-tokens/typography-tokens.test.ts`

## 🏷️ ラベル
#typography #design-tokens #foundation

---
*Status: Ready*
*Priority: High*
*Assignee: -* 