# Web Components 開発ガイドライン

## 🎯 重要な設計原則

### 1. ::part() を使用したスタイリング戦略

#### 原則
Shadow DOM 内の要素をスタイリング可能にする場合、**クラス名ではなく `part` 属性を使用**してください。

#### 理由
- **カプセル化**: Shadow DOM の境界を維持しながら、意図的に公開したい部分のみをスタイリング可能にする
- **明示的な API**: どの要素がカスタマイズ可能かを明確に示す
- **名前空間の分離**: グローバルなクラス名の衝突を防ぐ
- **セマンティック**: part名で要素の役割を意味的に表現できる

#### 実装例

```typescript
// ✅ 正しい実装
class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`
      <header part="header">
        <h2 part="title">
          <slot name="title"></slot>
        </h2>
        <button part="close-button">
          <svg part="close-icon">...</svg>
        </button>
      </header>
      <main part="content">
        <slot></slot>
      </main>
      <footer part="footer">
        <slot name="footer"></slot>
      </footer>
    `,
    styles: css`
      /* 内部スタイルは最小限に */
      :host {
        display: block;
      }
      
      [part="header"] {
        display: flex;
        justify-content: space-between;
      }
    `
  };
}
```

```css
/* 利用者側でのカスタマイズ */
my-component::part(header) {
  background: linear-gradient(to right, #667eea, #764ba2);
  padding: 20px;
}

my-component::part(title) {
  color: white;
  font-size: 24px;
}

/* テーマの適用例 */
.dark-theme my-component::part(header) {
  background: #2a2a2a;
}

.dark-theme my-component::part(content) {
  background: #1a1a1a;
  color: #e0e0e0;
}
```

#### ❌ 避けるべき実装

```typescript
// 避けるべき: クラス名に依存した実装
template: html`
  <div class="component-header">
    <h2 class="component-title">...</h2>
  </div>
`
```

### 2. ネイティブHTML要素の優先使用

#### 原則
カスタム実装を行う前に、**適切なネイティブHTML要素が存在しないか確認**してください。

#### 推奨される使用例

| ユースケース | ネイティブ要素 | 理由 |
|------------|--------------|------|
| アコーディオン | `<details>`/`<summary>` | ネイティブのキーボード操作とARIA |
| モーダルダイアログ | `<dialog>` | フォーカストラップとESCキー対応 |
| 日付入力 | `<input type="date">` | ブラウザネイティブのカレンダー |
| 時刻入力 | `<input type="time">` | ネイティブの時刻選択UI |
| カラーピッカー | `<input type="color">` | OS統合のカラーピッカー |
| プログレスバー | `<progress>` | セマンティックな進捗表示 |
| メーター | `<meter>` | 範囲内の値の表示 |

#### 実装例: details/summary ベースのアコーディオン

```typescript
class AccordionItem extends WebComponent {
  static definition = {
    name: 'accordion-item',
    template: html`
      <details part="details">
        <summary part="summary">
          <span part="icon">▶</span>
          <slot name="header"></slot>
        </summary>
        <div part="content">
          <slot name="content"></slot>
        </div>
      </details>
    `,
    styles: css`
      /* ネイティブマーカーを非表示 */
      summary {
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      
      /* アニメーション */
      [part="content"] {
        animation: slideDown 300ms ease-out;
      }
      
      @keyframes slideDown {
        from { 
          opacity: 0;
          height: 0;
        }
        to {
          opacity: 1;
          height: var(--content-height);
        }
      }
    `
  };
}
```

### 3. スロットと Part の使い分け

#### スロット (slot)
- **用途**: コンテンツの挿入点を定義
- **いつ使うか**: ユーザーが提供するコンテンツを配置する場所

#### パート (part)
- **用途**: スタイリング可能な要素を定義
- **いつ使うか**: コンポーネント内部の要素を外部からスタイリング可能にする

#### 併用例

```html
<article part="card">
  <header part="card-header">
    <slot name="header"></slot>  <!-- コンテンツ挿入 -->
  </header>
  <main part="card-body">
    <slot></slot>  <!-- デフォルトスロット -->
  </main>
  <footer part="card-footer">
    <slot name="footer"></slot>
  </footer>
</article>
```

### 4. アクセシビリティの考慮

#### チェックリスト
- [ ] キーボード操作が完全に可能か
- [ ] 適切なARIA属性が設定されているか
- [ ] フォーカスの視覚的表示が明確か
- [ ] スクリーンリーダーで正しく読み上げられるか
- [ ] カラーコントラスト比が WCAG AA 基準を満たしているか

#### 実装例

```typescript
connectedCallback() {
  // フォーカス可能にする
  this.setAttribute('tabindex', '0');
  
  // ARIAロールを設定
  this.setAttribute('role', 'button');
  
  // キーボードイベント
  this.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
}
```

### 5. パフォーマンスの最適化

#### ガイドライン
- Shadow DOM の再レンダリングを最小限に
- `will-change` プロパティの適切な使用
- CSS アニメーションの優先（JavaScript アニメーションより）
- Intersection Observer での遅延初期化

```typescript
// 遅延初期化の例
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      this.#initialize();
      observer.unobserve(this);
    }
  });
});

observer.observe(this);
```

## 📋 開発チェックリスト

新しい Web Component を作成する際は、以下を確認してください：

- [ ] ネイティブHTML要素で実現できないか検討した
- [ ] Shadow DOM 内の要素には `part` 属性を使用している（クラスではなく）
- [ ] スロットを適切に使用している
- [ ] キーボード操作が完全に可能
- [ ] ARIA属性が適切に設定されている
- [ ] モバイルデバイスでの操作性を確認した
- [ ] ダークモード対応を考慮した
- [ ] RTL言語への対応を考慮した
- [ ] TypeScript の型定義が完全である
- [ ] エラー処理が適切に実装されている

## 🚫 アンチパターン

### 避けるべき実装

1. **Shadow DOM 内でのクラス名過多**
   ```html
   <!-- ❌ 悪い例 -->
   <div class="wrapper inner-wrapper content-wrapper">
   ```

2. **ネイティブ要素の再発明**
   ```typescript
   // ❌ 悪い例: カスタムダイアログの実装
   class MyDialog extends WebComponent { ... }
   
   // ✅ 良い例: dialog要素の拡張
   class MyDialog extends HTMLDialogElement { ... }
   ```

3. **part属性の過度な細分化**
   ```html
   <!-- ❌ 悪い例: 細かすぎる -->
   <span part="text text-primary text-large text-bold">
   
   <!-- ✅ 良い例: 役割ベース -->
   <span part="heading">
   ```

## 📚 参考資料

- [MDN: Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [MDN: ::part()](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Web Components Best Practices](https://www.webcomponents.org/community/articles/web-components-best-practices)

---

**最終更新**: 2025-08-28
**バージョン**: 1.0.0