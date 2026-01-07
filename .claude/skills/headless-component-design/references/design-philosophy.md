# 設計思想

## 基本理念

### DADS準拠 + オーバーライド可能なAPI

デジタル庁デザインシステム（DADS）を基盤としながら、利用者が独自にカスタマイズできる拡張ポイントを提供。

**目標:**
- DADSの品質・アクセシビリティ基準を満たす
- 組み込むサービスのトンマナに合わせてオーバーライド可能
- WebComponentでも安全にスタイル変更ができる

## ヘッドレスWebComponentライブラリ思想

Radix UI / shadcn UI から着想を得た設計原則:

### 1. CSS変数でトークン再代入

デザイントークンをコンポーネントトークンに再代入することで、CSS変数をAPIとして管理。

```css
/* グローバルトークン → セマンティック → ローカル */
--color-primitive-blue-900
    ↓
--button-primary-bg: var(--color-primitive-blue-900)
    ↓
--dads-button-background: var(--button-primary-bg)
```

### 2. オーバーライドポイント

`--dads-*` プレフィックスのCSS変数は、外部からオーバーライド可能なAPI。

### 3. 安全なスタイル変更

- `::part()` による要素レベルのスタイリング
- CSS変数によるプロパティレベルのカスタマイズ
- Shadow DOMのカプセル化を維持

## 参照

詳細は `/docs/architecture/design-philosophy.md` を参照。
