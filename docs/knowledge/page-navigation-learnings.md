# Page Navigation コンポーネント開発ナレッジ

作成日: 2026-01-20

## 概要

`dads-page-navigation` コンポーネントの開発で得られた知見とパターンをまとめる。

---

## 1. 2層トークン設計（Semantic → Local）

### パターン

```
DADS Primitives → Semantic Tokens → Local Tokens → CSS Properties
      ↓                 ↓                ↓              ↓
  --color-*        --page-nav-*    --dads-page-*    background
```

### 実装例

```typescript
// page-navigation-tokens.ts

// 1層目: セマンティックトークン（内部参照用）
const semanticTokensText = `
  :host {
    --page-navigation-color: var(--color-primitive-blue-900);
    --page-navigation-hover-bg: var(--color-primitive-blue-50);
  }
`;

// 2層目: ローカルトークン（外部カスタマイズAPI）
const localTokensText = `
  :host {
    --dads-page-navigation-control-color: var(--page-navigation-color);
    --dads-page-navigation-control-background-hover: var(--page-navigation-hover-bg);
  }
`;

// 統合エクスポート
export const tokens = css`
  ${semanticTokensText}
  ${localTokensText}
`;
```

### 学び

1. **文字列テンプレートで定義してから `css` 関数でラップ**
   - `CSSStyleSheet` オブジェクトを文字列テンプレート内で展開すると `[object CSSStyleSheet]` になる
   - 必ず生文字列を `css` タグで最終変換する

2. **セマンティック層の役割**
   - DADSプリミティブとの橋渡し
   - 意味的な名前付け（color, hover-bg など）
   - コンポーネント内でのみ参照

3. **ローカル層の役割**
   - 外部からのカスタマイズAPI（`--dads-` プレフィックス）
   - 利用者が上書き可能なポイント
   - ドキュメント化対象

---

## 2. CSS変数による状態管理

### 原則

**プロパティ定義は1回だけ、状態変化は変数の再代入で実現**

### 実装例

```css
/* ❌ 悪い例: 同じプロパティを複数回定義 */
[part~="control"] {
  background-color: transparent;
}
[part~="control"]:hover {
  background-color: var(--hover-bg);  /* 重複定義 */
}

/* ✅ 良い例: 変数再代入 */
[part~="control"] {
  background-color: var(--dads-page-navigation-control-background);
}

@media (any-hover: hover) {
  [part~="control"]:hover {
    --dads-page-navigation-control-background: var(--dads-page-navigation-control-background-hover);
  }
}
```

### メリット

1. **一貫性**: プロパティと変数のマッピングが明確
2. **保守性**: 変更箇所が特定しやすい
3. **カスタマイズ性**: 利用者が hover 時の値を個別に上書き可能

---

## 3. アクセシブルネーム（Visually Hidden）

### 課題

Arrow タイプではアイコンのみ表示するが、スクリーンリーダー向けにラベルが必要。

### 解決策

**Clip-path によるVisually Hidden**

```css
:host([type="arrow"]) [part~="label"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### HTML構造

```html
<a part="control prev">
  <svg part="icon" aria-hidden="true">...</svg>
  <span part="label">前のページ</span>  <!-- 常にDOM内に存在 -->
</a>
```

### 学び

1. **SVGは `aria-hidden="true"`**: 装飾的な要素として扱う
2. **テキストラベルは常に存在**: CSS で視覚的に隠すだけ
3. **`display: none` は使わない**: スクリーンリーダーから完全に隠れてしまう

---

## 4. 優先順位付きスロット設計

### 要件

ステータス表示は様々なフォーマットに対応:
- `1/24`
- `9,999 / 9,999`
- `全120件 1/24`
- `ページ名`

### 設計

**優先順位: slot > attribute > computed**

```html
<!-- 1. slot が最優先 -->
<dads-page-navigation>
  <span slot="status">カスタム表示</span>
</dads-page-navigation>

<!-- 2. status 属性 -->
<dads-page-navigation status="全120件"></dads-page-navigation>

<!-- 3. current + total から算出 -->
<dads-page-navigation current="1" total="24"></dads-page-navigation>
```

### 実装ロジック

```typescript
#syncStatus(): void {
  const hasSlotted = this.querySelector('[slot="status"]') !== null;
  const statusText = this.getAttribute('status');
  const currentText = this.getAttribute('current');
  const totalText = this.getAttribute('total');

  // 優先順位判定
  if (hasSlotted) {
    // slot 内容を表示
    this.#statusFallback.textContent = '';
    return;
  }

  if (statusText) {
    // status 属性を表示
    this.#statusFallback.textContent = statusText;
    return;
  }

  if (currentText && totalText) {
    // 算出値を表示
    const separator = this.getAttribute('status-separator') ?? '/';
    this.#statusFallback.textContent = `${currentText}${separator}${totalText}`;
    return;
  }

  // 何もない場合は非表示
  this.#statusWrapper.setAttribute('hidden', '');
}
```

### 学び

1. **Light DOM slot の検出**: `querySelector('[slot="status"]')` で slotted 要素を検出
2. **slotchange イベント**: slot 内容の動的変更に対応
3. **フォールバック要素**: slot と並列に配置し、slot が空の場合のみ表示

---

## 5. テスト戦略（vitest × Web Components）

### 基本パターン

```typescript
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import './page-navigation-define.js';  // 先にdefine

describe('dads-page-navigation', () => {
  let el: HTMLElement;

  beforeAll(async () => {
    // コンポーネント定義を待つ
    await customElements.whenDefined('dads-page-navigation');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render shadow DOM', () => {
    el = document.createElement('dads-page-navigation');
    document.body.appendChild(el);

    expect(el.shadowRoot).toBeTruthy();
    expect(el.shadowRoot?.querySelector('[part~="nav"]')).toBeTruthy();
  });
});
```

### テスト観点

| カテゴリ | テスト内容 |
|---------|----------|
| 基本レンダリング | Shadow DOM生成、デフォルト属性 |
| 属性変更 | type/size/href/label の反映 |
| 状態表示 | slot/status/current+total の優先順位 |
| レイアウト | balanced/start の切り替え |
| アクセシビリティ | aria-label、visually-hidden |

### 学び

1. **`whenDefined()` で待機**: カスタム要素定義の完了を待つ
2. **`afterEach` でクリーンアップ**: テスト間の影響を防ぐ
3. **Shadow DOM内の検索**: `el.shadowRoot?.querySelector()` を使用
4. **属性変更のテスト**: `el.setAttribute()` 後に DOM を検証

---

## 6. 数値のローカライズ

### 要件

`9999` → `9,999` のようにカンマ区切りで表示。

### 実装

```typescript
function toFormattedNumberText(value: string | null): string | null {
  if (value == null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return value;  // 数値でなければそのまま
  return new Intl.NumberFormat().format(n);
}
```

### 学び

1. **`Intl.NumberFormat`**: ロケール依存の数値フォーマット
2. **`Number.isFinite`**: NaN や Infinity を除外
3. **フォールバック**: 数値以外の文字列はそのまま返す

---

## 7. レイアウト切り替え（data属性）

### 要件

- 両方のコントロールがある場合: `prev  [status]  next` (space-around)
- 片方のみの場合: `prev  [status]` または `[status]  next` (flex-start)

### 実装

```typescript
#syncLayout(): void {
  const hasPrev = !this.#prev.hasAttribute('hidden');
  const hasNext = !this.#next.hasAttribute('hidden');
  const layout = hasPrev && hasNext ? 'balanced' : 'start';
  this.#nav.setAttribute('data-layout', layout);
}
```

```css
[part="nav"][data-layout="balanced"] {
  justify-content: space-around;
}

[part="nav"][data-layout="start"] {
  justify-content: flex-start;
}
```

### 学び

1. **data属性でモード管理**: CSS セレクタで状態を表現
2. **属性セレクタ**: `[data-layout="balanced"]` で条件分岐

---

## 関連ドキュメント

- [CSS Variable Pattern](../css-variable-pattern.md)
- [Accessibility Guidelines](./accessibility-guidelines.md)
- [DADS Page Navigation](https://design.digital.go.jp/dads/components/page-navigation/)
