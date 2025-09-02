# 🔧 Patterns

このファイルには、プロジェクトで発見・確立された再利用可能なパターンを記録します。

---

## Component Definition Pattern
**タグ**: #webcomponents #architecture
**適用場面**: 新しいWeb Componentを作成する時

### 問題
Web Componentの定義が散らばり、一貫性がない。

### 解決策
```typescript
class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`
      <div part="base">
        <slot></slot>
      </div>
    `,
    styles: css`
      :host {
        display: block;
      }
      [part="base"] {
        /* styles */
      }
    `,
    attributes: [
      'value',
      BooleanAttr('disabled'),
      NonReflectingPropertyAttr('data')
    ]
  };
  
  connectedCallback() {
    super.connectedCallback();
    // initialization
  }
}

MyComponent.define();
```

### 結果
- **メリット**: 一貫性のある構造、型安全、保守性向上
- **デメリット**: 初期学習コスト

---

## CSS Variable State Pattern
**タグ**: #css #statemanagement
**適用場面**: コンポーネントの状態に応じたスタイル変更

### 問題
状態ごとにCSSプロパティを重複定義すると、保守性が低下する。

### 解決策
```css
/* ベース定義（一度だけ） */
[part="button"] {
  background: var(--btn-bg);
  color: var(--btn-color);
  border: var(--btn-border);
}

/* 状態変化は変数の再代入のみ */
:host([variant="primary"]) {
  --btn-bg: var(--color-primary);
  --btn-color: var(--color-white);
}

:host([variant="primary"]:hover) {
  --btn-bg: var(--color-primary-dark);
}

:host([disabled]) {
  --btn-bg: var(--color-disabled);
  pointer-events: none;
}
```

### 結果
- **メリット**: DRY原則、明確な変数スコープ、保守性向上
- **デメリット**: CSS変数のブラウザサポート確認が必要

---

## Test Helper Pattern
**タグ**: #testing #utilities
**適用場面**: コンポーネントのテストセットアップ

### 問題
各テストでコンポーネントのセットアップが重複する。

### 解決策
```typescript
// test-helpers.ts
export function createTestComponent<T extends HTMLElement>(
  tag: string,
  props?: Record<string, any>
): T {
  const element = document.createElement(tag) as T;
  
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, String(value));
      }
    });
  }
  
  document.body.appendChild(element);
  return element;
}

export function cleanupTest() {
  document.body.innerHTML = '';
}

// 使用例
describe('MyComponent', () => {
  afterEach(() => cleanupTest());
  
  it('should render', () => {
    const component = createTestComponent<MyComponent>(
      'my-component',
      { value: 'test' }
    );
    expect(component).toBeDefined();
  });
});
```

### 結果
- **メリット**: テストコードのDRY化、一貫性、読みやすさ
- **デメリット**: ヘルパーの学習が必要

---

## Async Initialization Pattern
**タグ**: #async #initialization #webcomponents
**適用場面**: 非同期処理が必要なコンポーネント初期化

### 問題
connectedCallbackは同期的で、非同期初期化が難しい。

### 解決策
```typescript
class AsyncComponent extends WebComponent {
  #initialized = false;
  #initPromise: Promise<void> | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.#initPromise = this.#initialize();
  }

  async #initialize() {
    if (this.#initialized) return;
    
    try {
      // ローディング状態を表示
      this.setAttribute('loading', '');
      
      // 非同期処理
      const data = await fetchData();
      this.#render(data);
      
      this.#initialized = true;
    } catch (error) {
      this.#handleError(error);
    } finally {
      this.removeAttribute('loading');
    }
  }

  // 公開メソッドで初期化を待つ
  async whenInitialized() {
    return this.#initPromise;
  }
}
```

### 結果
- **メリット**: 非同期処理の適切な管理、エラーハンドリング
- **デメリット**: 複雑性の増加

---

## Event Delegation Pattern
**タグ**: #events #performance
**適用場面**: 多数の子要素でイベント処理が必要な時

### 問題
各子要素にイベントリスナーを付けると、メモリ使用量が増える。

### 解決策
```typescript
class ListComponent extends WebComponent {
  connectedCallback() {
    super.connectedCallback();
    
    // 親要素に一つだけリスナーを追加
    this.shadowRoot?.addEventListener('click', this.#handleClick);
  }

  #handleClick = (event: Event) => {
    const target = event.target as HTMLElement;
    
    // data属性でアクションを判定
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    
    switch (action) {
      case 'delete':
        this.#handleDelete(target);
        break;
      case 'edit':
        this.#handleEdit(target);
        break;
    }
  };

  static definition = {
    template: html`
      <ul part="list">
        <li part="item">
          <button data-action="edit" part="edit-btn">Edit</button>
          <button data-action="delete" part="delete-btn">Delete</button>
        </li>
      </ul>
    `
  };
}
```

### 結果
- **メリット**: メモリ効率、動的要素対応、パフォーマンス向上
- **デメリット**: イベントバブリングの理解が必要

---

## Slot Content Detection Pattern
**タグ**: #slots #webcomponents
**適用場面**: スロットの内容に応じた表示制御

### 問題
空のスロットを表示したくない。

### 解決策
```typescript
class SlotAwareComponent extends WebComponent {
  connectedCallback() {
    super.connectedCallback();
    
    // スロット変更を監視
    const slot = this.shadowRoot?.querySelector('slot');
    slot?.addEventListener('slotchange', this.#handleSlotChange);
    
    // 初期チェック
    this.#handleSlotChange();
  }

  #handleSlotChange = () => {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    const hasContent = slot?.assignedNodes()
      .filter(isNotWhitespace).length > 0;
    
    this.toggleAttribute('has-content', hasContent);
  };

  static definition = {
    styles: css`
      :host(:not([has-content])) [part="wrapper"] {
        display: none;
      }
    `,
    template: html`
      <div part="wrapper">
        <slot></slot>
      </div>
    `
  };
}
```

### 結果
- **メリット**: 自動的な表示制御、クリーンなDOM
- **デメリット**: スロット変更の監視オーバーヘッド

---

## テンプレート（新しいパターン用）

## Pattern Name
**タグ**: #tag1 #tag2
**適用場面**: いつ使うか

### 問題
解決したい問題の説明

### 解決策
```typescript
// コード例
```

### 結果
- **メリット**: 
- **デメリット**: 

### 関連パターン
- 関連するパターン名

---

*継続的に更新されます*