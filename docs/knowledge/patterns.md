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

## Slot Fallback Span Pattern
**タグ**: #slots #webcomponents #forms
**適用場面**: スロットと属性の両方でコンテンツを設定可能にする時

### 問題
スロット親要素のtextContentを属性値で上書きすると、スロットされたコンテンツが破壊される。

### 解決策
```html
<!-- テンプレート: スロットとフォールバックを分離 -->
<label part="label">
  <span part="label-text">
    <slot name="label"></slot>
  </span>
  <span part="label-fallback" aria-hidden="true"></span>
</label>
```

```typescript
// スロットに内容があるかチェック
#hasSlotContent(slotName: string): boolean {
  const slot = this.#refs[`${slotName}Slot`] as HTMLSlotElement;
  return slot?.assignedNodes().filter(isNotWhitespace).length > 0;
}

// フォールバック要素のみ更新
#updateLabelFallback() {
  const fallback = this.shadowRoot?.querySelector('[part="label-fallback"]');
  if (!fallback) return;

  // スロットに内容がある場合はフォールバック非表示
  if (this.#hasSlotContent('label')) {
    fallback.textContent = '';
  } else {
    fallback.textContent = this.getAttribute('label') || '';
  }
}
```

### 結果
- **メリット**: スロット優先・属性フォールバックの両立、スロット内容の保護
- **デメリット**: DOM構造が少し複雑になる

### 関連パターン
- Slot Content Detection Pattern

---

## Focus Style Mixin Pattern（DADS公式準拠版）
**タグ**: #css #focus #accessibility #mixins #dads
**適用場面**: 複数コンポーネントで一貫したフォーカススタイルを適用する時

### 問題
各コンポーネントで個別にフォーカススタイルを定義すると、デザインの不整合やメンテナンスコストが発生する。

### 解決策

**重要**: DADS公式実装では`border-radius`はフォーカス時に変更されない。

```typescript
// packages/styles/mixins/focus-styles-official.ts
export function applyDADSFocusStyles() {
  return css`
    :host {
      /* セマンティックトークン（DADS公式準拠） */
      --focus-outline-color: var(--color-neutral-black, #000000);
      --focus-outline-width: .25rem;
      --focus-outline-offset: .125rem;
      --focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
      --focus-ring-width: .125rem;
      --focus-text-element-bg: var(--color-primitive-yellow-300, #ffd43d);

      /* ローカルトークン（オーバーライド用API） */
      --dads-focus-outline-color: var(--focus-outline-color);
      --dads-focus-outline-width: var(--focus-outline-width);
      --dads-focus-outline-offset: var(--focus-outline-offset);
      --dads-focus-ring-color: var(--focus-ring-color);
      --dads-focus-ring-width: var(--focus-ring-width);
      --dads-focus-text-element-bg: var(--focus-text-element-bg);
    }

    /* ボタン - border-radiusは変更しない（公式準拠） */
    :host [part="base"]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      position: relative;
    }

    /* solid/outlined: box-shadowのみ（背景色変更なし） */
    :host([variant="solid"]) [part="base"]:focus-visible,
    :host([variant="outlined"]) [part="base"]:focus-visible {
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* text: 背景を黄色に */
    :host([variant="text"]) [part="base"]:focus-visible {
      background-color: var(--dads-focus-text-element-bg);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* テキストエリア・インプット */
    :host [part="textarea"]:focus-visible,
    :host [part="input"]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }

    /* アコーディオン - 背景を黄色に */
    :host [part="summary"]:focus-visible {
      outline: var(--dads-focus-outline-width) solid var(--dads-focus-outline-color);
      outline-offset: var(--dads-focus-outline-offset);
      background-color: var(--dads-focus-text-element-bg);
      box-shadow: 0 0 0 var(--dads-focus-ring-width) var(--dads-focus-ring-color);
    }
  `;
}
```

```typescript
// 各コンポーネントでの使用
static definition = {
  styles: [
    componentTokens,
    componentStyles,
    applyDADSFocusStyles()  // ミックスインを追加
  ]
};
```

### オーバーライド例
```css
/* フォーカス色をカスタマイズ */
dads-button {
  --dads-focus-ring-color: #your-focus-color;
  --dads-focus-outline-color: #your-outline-color;
}
```

### 結果
- **メリット**: 一貫したUX、メンテナンス性向上、WCAG準拠の保証、オーバーライド可能なAPI
- **デメリット**: 新しいpart属性追加時にミックスイン更新が必要

### 関連パターン
- CSS Variable State Pattern
- 3層トークン構造（Primitive → Semantic → Local）

---

## Attribute Sync with queueMicrotask Pattern
**タグ**: #webcomponents #lifecycle #async
**適用場面**: 属性がconnectedCallback後に設定される可能性がある時

### 問題
HTMLパーサーや動的生成により、connectedCallback時点で属性が未設定の場合がある。

### 解決策
```typescript
connectedCallback() {
  super.connectedCallback();

  // 即座に利用可能な属性を処理
  this.#initializeFromAttributes();

  // マイクロタスクで遅延設定された属性を再同期
  queueMicrotask(() => {
    // 切断されていたら何もしない
    if (!this.isConnected) return;

    // 属性を再同期
    this.#syncTextareaAttributes();
    this.#updateAllFallbacks();
    this.#updateAriaDescribedBy();
  });
}

// 属性変更コールバックでも同じ処理
attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
  if (oldValue === newValue) return;

  // 属性に応じた更新処理
  switch (name) {
    case 'label':
      this.#updateLabelFallback();
      break;
    // ...
  }
}
```

### 結果
- **メリット**: 属性設定タイミングに依存しない堅牢な初期化
- **デメリット**: 初期化が2回走る可能性（パフォーマンス影響は軽微）

### 関連パターン
- Async Initialization Pattern

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

## Static Error Text Pattern (DADS準拠)
**タグ**: #accessibility #aria #dads #forms
**適用場面**: フォーム要素のエラー表示
**追加日**: 2026-01-07

### 問題
`aria-live`や`role="alert"`を使用すると、エラー表示時にスクリーンリーダーの読み上げが割り込み、ユーザーの操作を妨げる。

### 解決策
```html
<!-- テンプレート: aria-live/role="alert" を使わない -->
<textarea
  part="textarea"
  id="textarea"
  aria-describedby="support-text counter error-text"
  aria-invalid="false"
></textarea>

<!-- カウンター: aria-live なし -->
<span part="counter" id="counter">0/100</span>

<!-- エラーテキスト: role="alert" なし -->
<div part="error-text" id="error-text">
  <span id="error-fallback"></span>
</div>
```

```typescript
// aria-describedby を動的に管理
#updateAriaDescribedBy(): void {
  const ids: string[] = [];

  if (this.#hasSupportText()) ids.push('support-text');
  if (this.hasAttribute('show-counter')) ids.push('counter');
  if (this.hasAttribute('error')) ids.push('error-text');

  if (ids.length > 0) {
    this.#textarea.setAttribute('aria-describedby', ids.join(' '));
  } else {
    this.#textarea.removeAttribute('aria-describedby');
  }
}

// エラー表示（aria-live に依存しない）
#showError(message: string): void {
  this.setAttribute('error', '');
  this.#errorFallback.textContent = message;
  this.#textarea.setAttribute('aria-invalid', 'true');
  this.#updateAriaDescribedBy();
}
```

### 結果
- **メリット**: スクリーンリーダーユーザーの操作を妨げない、DADS/WCAG準拠
- **デメリット**: エラー発生時の即時読み上げがない（フォーカス移動で読み上げ）

### 関連パターン
- Slot Fallback Span Pattern
- CSS Variable State Pattern

### 参照
- [DADS Input Text Accessibility](https://design.digital.go.jp/dads/components/input-text/accessibility/)
- [詳細ドキュメント](./accessibility-guidelines.md)

---

## Dynamic aria-describedby Pattern
**タグ**: #accessibility #aria #forms
**適用場面**: 複数の説明要素を状態に応じて関連付ける時
**追加日**: 2026-01-07

### 問題
サポートテキスト、カウンター、エラーテキストなど、複数の説明要素の関連付けを状態に応じて管理する必要がある。

### 解決策
```typescript
#updateAriaDescribedBy(): void {
  if (!this.#textarea) return;

  const ids: string[] = [];

  // サポートテキストがある場合（非表示でなければ）
  const supportText = this.shadowRoot?.querySelector('#support-text') as HTMLElement;
  if (supportText && supportText.style.display !== 'none') {
    ids.push('support-text');
  }

  // カウンターが表示されている場合
  if (this.hasAttribute('show-counter')) {
    ids.push('counter');
  }

  // エラーがある場合
  if (this.hasAttribute('error')) {
    ids.push('error-text');
  }

  // 関連付けを設定/削除
  if (ids.length > 0) {
    this.#textarea.setAttribute('aria-describedby', ids.join(' '));
  } else {
    this.#textarea.removeAttribute('aria-describedby');
  }
}
```

### 呼び出しタイミング
```typescript
connectedCallback() {
  super.connectedCallback();
  this.#updateAriaDescribedBy(); // 初期化
}

attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
  switch (name) {
    case 'support-text':
    case 'show-counter':
    case 'error':
      this.#updateAriaDescribedBy(); // 関連属性変更時
      break;
  }
}

#showValidationError(): void {
  // エラー表示後
  this.#updateAriaDescribedBy();
}

#clearValidationError(): void {
  // エラークリア後
  this.#updateAriaDescribedBy();
}
```

### 結果
- **メリット**: 状態に応じた正確なアクセシビリティ情報、WCAG準拠
- **デメリット**: 更新呼び出しの管理が必要

### 関連パターン
- Static Error Text Pattern
- Attribute Sync with queueMicrotask Pattern

---

*継続的に更新されます*