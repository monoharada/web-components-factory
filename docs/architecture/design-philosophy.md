# Web Components Factory 設計思想

## Contents

- [基本理念](#基本理念)
- [ヘッドレスWebComponentライブラリ思想](#ヘッドレスwebcomponentライブラリ思想)
- [トークン設計](#トークン設計)
- [CSS変数API](#css変数api)
- [角の形状（Corner Shapes）](#角の形状corner-shapes)
- [フォーカススタイル](#フォーカススタイル)
- [アクセシビリティガイドライン](#アクセシビリティガイドライン)
- [オーバーライドパターン](#オーバーライドパターン)

---

## 基本理念

### DADS準拠 + オーバーライド可能なAPI

このプロジェクトは、**デジタル庁デザインシステム（DADS）**を基盤としながら、利用者が独自にカスタマイズできる拡張ポイントを提供します。

**目標:**
- DADSの品質・アクセシビリティ基準を満たす
- 組み込むサービスのトンマナに合わせてオーバーライド可能
- WebComponentでも安全にスタイル変更ができる

---

## ヘッドレスWebComponentライブラリ思想

Radix UI / shadcn UI から着想を得た設計原則:

### 1. CSS変数でトークン再代入

デザイントークンをコンポーネントトークンに再代入することで、CSS変数をAPIとして管理します。

```css
/* グローバルトークン（DADS公式） */
--color-primitive-blue-900: #0017c1;

/* コンポーネントセマンティックトークン */
--button-primary-bg: var(--color-primitive-blue-900);

/* コンポーネントローカルトークン（API） */
--dads-button-background: var(--button-primary-bg);
```

### 2. オーバーライドポイント

`--dads-*` プレフィックスのCSS変数は、外部からオーバーライド可能なAPIです。

```html
<style>
  dads-button {
    --dads-button-background: #ff0000;
    --dads-button-border-radius: 24px;
  }
</style>
```

### 3. 安全なスタイル変更

Shadow DOMのカプセル化を活かしながら、CSS変数APIで安全に拡張できます。

- `::part()` による要素レベルのスタイリング
- CSS変数によるプロパティレベルのカスタマイズ
- 予期しないスタイル汚染を防止

---

## トークン設計

### 3層トークン構造

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

### 各層の役割

| 層 | プレフィックス | 役割 | 変更頻度 |
|---|---|---|---|
| Primitive | `--color-*`, `--font-*` | DADS公式の基本値 | 変更しない |
| Semantic | `--button-*`, `--textarea-*` | 意味的なマッピング | 低 |
| Local | `--dads-*` | 外部カスタマイズ用API | ユーザーが変更可能 |

---

## CSS変数API

### 命名規則

```
--dads-{component}-{property}[-{state}]
```

**例:**
- `--dads-button-background`
- `--dads-button-background-hover`
- `--dads-textarea-border-color`
- `--dads-focus-ring-color`

### 変数再代入パターン

**原則: プロパティ定義は一度だけ、状態変化は変数の再代入**

```css
/* ベース定義（一度だけ） */
[part="base"] {
  background-color: var(--dads-button-background);
  color: var(--dads-button-color);
}

/* 状態変化は変数の再代入のみ */
:host([variant="solid"]:hover) {
  --dads-button-background: var(--button-primary-bg-hover);
  /* background-colorは再定義しない */
}
```

**利点:**
- CSSパーサーの負荷軽減
- 変数の継承チェーンが明確
- 重複定義がなく保守性が高い

---

## 角の形状（Corner Shapes）

### DADS公式仕様

[公式ドキュメント](https://design.digital.go.jp/dads/foundations/corner-shapes/)に基づく角丸設計。

### 5段階のスタイル

| スタイル | 正方形 | 長方形 | 用途例 |
|---------|--------|--------|--------|
| 角丸なし | 0px | 0px | シャープな印象 |
| **角丸スモール** | **8px (0.5rem)** | **8px (0.5rem)** | **フォーム要素、小〜中コンポーネント** |
| 角丸ミディアム | 16px (1rem) | 12px (0.75rem) | カード、モーダル |
| 角丸ラージ | 32px (2rem) | 16px (1rem) | 大きな強調要素 |
| 角丸フル | 50% | 高さの50% | ピル形状、アバター |

### 重要な原則

**同じスタイルでもサイズによって視覚的印象が異なる**

小さいコンポーネントは角丸の視覚的影響が強く見えるため、コンポーネント種別ごとにサイズに応じた個別調整が必要。

### コンポーネント別の適用

| コンポーネント | 推奨スタイル | 値 |
|---------------|-------------|-----|
| Button | 角丸スモール | 8px (0.5rem) |
| Textarea | 角丸スモール | 8px (0.5rem) |
| Input | 角丸スモール | 8px (0.5rem) |
| Card | 角丸ミディアム | 12px (0.75rem) |
| Modal | 角丸ミディアム | 16px (1rem) |
| Avatar | 角丸フル | 50% |

### トークン設計

```css
:host {
  /* プリミティブ層（DADS公式値） */
  --border-radius-0: 0;
  --border-radius-4: 0.25rem;   /* 4px - 極小要素用 */
  --border-radius-8: 0.5rem;    /* 8px - 角丸スモール */
  --border-radius-12: 0.75rem;  /* 12px - 角丸ミディアム（長方形） */
  --border-radius-16: 1rem;     /* 16px - 角丸ミディアム（正方形） */
  --border-radius-full: 9999px; /* 角丸フル */

  /* セマンティック層 */
  --textarea-border-radius: var(--border-radius-8);
  --button-border-radius: var(--border-radius-8);

  /* ローカル層（オーバーライド用） */
  --dads-textarea-border-radius: var(--textarea-border-radius);
  --dads-button-border-radius: var(--button-border-radius);
}
```

---

## フォーカススタイル

### DADS公式準拠

公式実装（GitHub: digital-go-jp/design-system-example-components）に基づく:

```css
/* 公式のフォーカススタイル */
outline: 4px solid black;
outline-offset: 2px;
box-shadow: 0 0 0 2px yellow;
```

**重要: `border-radius` はフォーカス時に変更しない（公式準拠）**

### フォーカストークン

```css
:host {
  /* セマンティック層 */
  --focus-outline-color: var(--color-neutral-black);
  --focus-ring-color: var(--color-primitive-yellow-300);

  /* ローカル層（オーバーライド用） */
  --dads-focus-outline-color: var(--focus-outline-color);
  --dads-focus-ring-color: var(--focus-ring-color);
}
```

### 要素別フォーカススタイル

| 要素 | outline | box-shadow | background |
|---|---|---|---|
| solid/outlined ボタン | あり | 黄色リング | 変更なし |
| text ボタン | あり | 黄色リング | 黄色 |
| アコーディオン | あり | 黄色リング | 黄色 |
| textarea/input | あり | 黄色リング | 変更なし |

---

## アクセシビリティガイドライン

### DADS公式準拠

DADS公式のアクセシビリティガイドラインに準拠し、WCAG 2.2 AA基準を満たすコンポーネントを提供します。

**参照**: [DADS アクセシビリティ](https://design.digital.go.jp/dads/components/input-text/accessibility/)

### 禁止属性

#### placeholder（フォーム入力要素全般）

**ステータス**: 🚫 **使用禁止**

**理由**:
1. **視認性の問題**: コントラスト比が低く視認性が良くない
2. **入力中の消失**: 入力開始時に非表示になり、ユーザーが入力条件を確認できない
3. **スクリーンリーダー対応**: 読み上げられない場合や、入力済みテキストとの判別が困難

**代替手段**: `support-text` 属性を使用

```html
<!-- ❌ 非推奨: placeholder属性 -->
<dads-textarea placeholder="入力例: 山田太郎"></dads-textarea>

<!-- ✅ 推奨: support-text属性 -->
<dads-textarea support-text="入力例: 山田太郎"></dads-textarea>
```

### 実装上の挙動

- `placeholder` 属性を設定すると、開発モードでコンソールに警告が出力される
- `placeholder` 属性の値は内部のネイティブ要素に転送されない（ソフトな禁止）
- 将来的にエラーとして扱う可能性あり

### support-textの利点

1. **常に表示**: 入力中も消えない
2. **高いコントラスト比**: 標準のテキスト色で表示
3. **スクリーンリーダー対応**: `aria-describedby` で適切に関連付け
4. **複数行対応**: 長いヒントテキストも表示可能

---

## オーバーライドパターン

### パターン1: CSS変数でカスタマイズ

```html
<style>
  dads-button {
    --dads-button-background: var(--my-brand-color);
    --dads-button-border-radius: 0;
  }
</style>

<dads-button variant="solid">カスタムボタン</dads-button>
```

### パターン2: ::part()でスタイリング

```html
<style>
  dads-textarea::part(textarea) {
    font-family: monospace;
  }

  dads-button::part(base) {
    text-transform: uppercase;
  }
</style>
```

### パターン3: サービス全体のテーマ設定

```css
:root {
  /* プリミティブトークンを上書き */
  --color-primitive-blue-900: #your-brand-blue;
  --color-primitive-yellow-300: #your-focus-color;
}
```

---

## 参考資料

- [デジタル庁デザインシステム](https://design.digital.go.jp/)
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [CSS変数パターン](../css-variable-pattern.md)
- [デザイントークン管理](../design-tokens-management.md)

---

*このドキュメントはプロジェクトの設計思想を記録したものです。新しいコンポーネント追加時はこの思想に従ってください。*
