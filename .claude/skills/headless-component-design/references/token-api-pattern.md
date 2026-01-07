# トークンAPIパターン

## 3層トークン構造

```
┌─────────────────────────────────────────┐
│  Primitive Tokens (DADS公式)            │
│  --color-primitive-blue-900             │
│  --font-size-16                         │
│  --border-radius-8                      │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Semantic Tokens (意味層)               │
│  --button-primary-bg                    │
│  --textarea-border-focus                │
│  --focus-ring-color                     │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Local Tokens (コンポーネントAPI)       │
│  --dads-button-background               │
│  --dads-textarea-border-color           │
│  --dads-focus-ring-color                │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CSS Properties                         │
│  background-color: var(--dads-button-*) │
└─────────────────────────────────────────┘
```

## 各層の役割

| 層 | プレフィックス | 役割 | 変更頻度 |
|---|---|---|---|
| Primitive | `--color-*`, `--font-*` | DADS公式の基本値 | 変更しない |
| Semantic | `--button-*`, `--textarea-*` | 意味的なマッピング | 低 |
| Local | `--dads-*` | 外部カスタマイズ用API | ユーザーが変更可能 |

## 命名規則

```
--dads-{component}-{property}[-{state}]
```

**例:**
- `--dads-button-background`
- `--dads-button-background-hover`
- `--dads-textarea-border-color`
- `--dads-focus-ring-color`

## 実装パターン

### トークン定義（TypeScript）

```typescript
const semanticTokensText = `
  :host {
    /* セマンティック層 */
    --button-primary-bg: var(--color-primitive-blue-900);
    --button-primary-bg-hover: var(--color-primitive-blue-1000);
  }
`;

const localTokensText = `
  :host {
    /* ローカル層（API） */
    --dads-button-background: var(--button-primary-bg);
  }

  :host([variant="solid"]) {
    --dads-button-background: var(--button-primary-bg);
  }
`;

export const buttonTokens = css`
  ${semanticTokensText}
  ${localTokensText}
`;
```

### スタイル定義

```css
/* プロパティ定義は一度だけ */
[part="base"] {
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
}

/* 状態変化は変数再代入のみ */
:host([variant="solid"]:hover) {
  --dads-button-background: var(--button-primary-bg-hover);
  /* background-colorは再定義しない */
}
```

## アンチパターン

```css
/* ❌ プロパティの重複定義 */
:host([variant="solid"]:hover) [part="base"] {
  background-color: var(--button-primary-bg-hover);
}

/* ❌ ハードコード値 */
--dads-button-background: #0017c1;

/* ❌ プリミティブ層の直接使用 */
background-color: var(--color-primitive-blue-900);
```
