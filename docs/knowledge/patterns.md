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

## Nested Component Styling Pattern（CSS変数 + `part` 公開）
**タグ**: #webcomponents #css #designsystem
**適用場面**: 親コンポーネントの内部で別コンポーネント（例: `dads-button`）を使い、見た目を親側の要件に合わせたい時

### 問題
- Shadow DOM内の子コンポーネント内部（さらに別のShadow DOM）に対して、親から直接CSSを当てられない。
- その結果、親が子のスタイルを“再実装”しがちで、保守性が落ちる。

### 解決策
1. **子コンポーネントにスタイリングAPI（CSS変数）を用意する**
2. **親コンポーネントは子ホスト要素に `part` を付けて公開し、CSS変数を上書きする**

```html
<!-- 親（shadow） -->
<dads-button part="nav-button" variant="secondary" size="small" aria-label="前の月">
  <svg slot="icon-start" ...></svg>
</dads-button>
```

```css
/* 親（shadow）: 子ホストのCSS変数を調整して“アイコンのみ正方形ボタン”にする */
[part~="nav-button"] {
  --dads-button-padding: 0;
  --dads-button-min-height: 44px;
  --dads-button-width: var(--dads-button-min-height);
  --dads-button-min-width: var(--dads-button-min-height);
  --dads-button-aspect-ratio: 1 / 1;
}
```

補足: `dads-button` 側は `min-height: var(--dads-button-min-height, var(--dads-button-min-height-default, ...))` のように、
外部オーバーライド（`--dads-button-min-height`）と内部デフォルト（`--dads-button-min-height-default`）を分離すると扱いやすい。

```css
/* 外部（light DOM）: 親が公開したpartを通じて調整することも可能 */
dads-calendar::part(nav-button) {
  --dads-button-min-height: 44px;
}

/* もしくは、親コンポーネント側が“揃える用の変数”を公開している場合 */
dads-calendar {
  --dads-calendar-control-size: 44px;
}
```

### 結果
- **メリット**: 子コンポーネントの責務（見た目のロジック）を再実装せず、CSS変数で一貫して調整できる
- **デメリット**: CSS変数（スタイリングAPI）の設計・命名が必要

### 関連パターン
- CSS Variable State Pattern

---

## Date Range Selection Pattern（開始日→終了日 + aria-live）
**タグ**: #a11y #calendar
**適用場面**: 期間（開始日/終了日）を2ステップで選択し、視覚表示＋読み上げを同時に提供したい時

### 解決策（例: `dads-calendar`）
- `range` 属性でモードを切り替える
- 画面下に「開始日/終了日」表示と、次にすべき操作を示すサポートテキストを出す
- `aria-live="polite"` で選択操作の結果を読み上げる

```html
<dads-calendar range></dads-calendar>
```

```js
document.querySelector('dads-calendar')?.addEventListener('date-range-selected', (e) => {
  const { startDate, endDate } = e.detail;
  // startDate が入ったら終了日選択へ誘導、両方揃ったら確定処理へ
});
```

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

## ::slotted() Limitation Pattern
**タグ**: #css #slots #webcomponents #shadowdom
**適用場面**: スロットに投入されたLight DOM要素にスタイルを適用する時
**追加日**: 2026-01-29

### 問題
`::slotted()`は**直接の子要素**にしかスタイルを適用できない。`::slotted(h2 a)`のような子孫セレクタは無効。

### 解決策
**直接の子要素のみスタイル可能:**
```css
/* ✅ OK: h2直接に適用 */
[part="main"] ::slotted(h2) {
  color: var(--dads-card-title-color);
  font-size: var(--dads-card-title-font-size);
}

/* ❌ NG: h2内のaには適用不可 */
[part="main"] ::slotted(h2 a) { /* 無効 */ }
[part="main"] ::slotted(h2) a { /* 無効 */ }
```

**:is()で複数要素をグループ化可能:**
```css
[part="main"] ::slotted(:is(h1, h2, h3, h4, h5, h6)) {
  color: var(--dads-card-title-color);
}
```

### 子孫要素のスタイリングが必要な場合
→ **Light DOM Styling for Descendant Elements Pattern** を参照

### 結果
- **メリット**: Shadow DOMのカプセル化を維持、明示的なスタイリングAPI
- **デメリット**: 子孫要素のスタイリングには別の方法が必要

### 関連パターン
- Light DOM Styling for Descendant Elements Pattern
- Slot Content Detection Pattern

---

## Light DOM Styling for Descendant Elements Pattern
**タグ**: #css #slots #lightdom #demos
**適用場面**: スロット内の子孫要素（`::slotted()`で届かない要素）にスタイルを適用する時
**追加日**: 2026-01-29

### 問題
`::slotted()`の制限により、`<h2><a>...</a></h2>`のような構造で`a`タグに直接スタイルを適用できない。

### 解決策
**デモ/利用側のLight DOMでスタイルを定義:**
```css
/* showcase-components.ts や利用者のCSS */
dads-card.card-example-1 h2 a {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: calc(1 / 16 * 1rem);
  text-underline-offset: calc(3 / 16 * 1rem);
}

@media (hover: hover) {
  dads-card.card-example-1:hover h2 a {
    text-decoration-thickness: calc(3 / 16 * 1rem);
  }
}
```

### 設計指針
1. **コンポーネントの責務**: `::slotted()`で直接の子要素をスタイリング
2. **利用者の責務**: 子孫要素のスタイリングはLight DOMで行う
3. **作例固有のスタイル**: デモ側に配置（他の作例では異なる構造の可能性あり）

### 適用例（カード作例1）
```
DADS公式構造:           現在のWC構造:
<a class="card">        <dads-card>
  <h2>タイトル</h2>       <h2><a>タイトル</a></h2>
</a>                    </dads-card>

→ h2内のaへのスタイルはLight DOMで適用
```

### 結果
- **メリット**: Shadow DOMの制約を回避、作例ごとのカスタマイズが容易
- **デメリット**: スタイルが分散する（コンポーネント内 + 利用側）

### 関連パターン
- ::slotted() Limitation Pattern
- CSS Variable State Pattern

---

## CSS Token 3-Layer Architecture Pattern
**タグ**: #css #tokens #designsystem #dads
**適用場面**: デザインシステムに準拠したCSS変数設計
**追加日**: 2026-01-29

### 問題
ハードコードされた値（`#000000`、`calc(20/16 * 1rem)`）は保守性が低く、テーマ対応が困難。

### 解決策
**3層トークン構造:**
```
Primitive Tokens → Semantic Tokens → Local Tokens → Properties
--color-blue-900    --card-title-color    --dads-card-title-color    color
```

**実装例（card-tokens.ts）:**
```typescript
const cardSemanticTokensText = `
  :host {
    /* Semantic: グローバルトークンを参照 */
    --card-title-color: var(--color-neutral-solid-gray-900);
    --card-title-font-size: var(--font-size-20);
    --card-title-font-weight: var(--font-weight-700);
    --card-title-line-height: var(--line-height-150);
    --card-title-letter-spacing: 0.02em; /* グローバルトークンなし */
  }
`;

const cardLocalTokensText = `
  :host {
    /* Local: 外部公開API（カスタマイズ用） */
    --dads-card-title-color: var(--card-title-color);
    --dads-card-title-font-size: var(--card-title-font-size);
  }
`;

export const cardTokens = css`
  ${cardSemanticTokensText}
  ${cardLocalTokensText}
`;
```

**スタイルでの使用:**
```css
[part="main"] ::slotted(:is(h1, h2, h3, h4, h5, h6)) {
  color: var(--dads-card-title-color);
  font-size: var(--dads-card-title-font-size);
}
```

### 重要ルール
1. **ハードコード禁止**: 色値は必ずグローバルトークン参照
2. **例外**: `letter-spacing: 0.02em`（グローバルトークンなし）、`transparent`、`currentColor`、`inherit`
3. **文字列→css関数**: CSSStyleSheetを直接展開しない

### 結果
- **メリット**: 一貫性、テーマ対応、保守性、トレーサビリティ
- **デメリット**: 初期設計コスト

### 関連パターン
- CSS Variable State Pattern
- Focus Style Mixin Pattern

---

## Div Soup Reduction Pattern
**タグ**: #webcomponents #shadowdom #html #accessibility
**適用場面**: Shadow DOMの構造をシンプルに保つ時
**追加日**: 2026-01-29

### 問題
Shadow DOM内に不要なdivが増えると（Div Soup）、DOMが肥大化し、アクセシビリティやパフォーマンスに悪影響。

### 解決策
**最小限のShadow DOM + Light DOMの活用:**

```html
<!-- ❌ Div Soup（7階層） -->
<article part="base">
  <section part="media">
    <div part="media-inner">
      <slot name="media"></slot>
    </div>
  </section>
  <section part="main">
    <div part="title">
      <slot name="title"></slot>
    </div>
    <div part="content">
      <slot name="content"></slot>
    </div>
  </section>
</article>

<!-- ✅ 最小限（3セクション） -->
<article part="base">
  <section part="media">
    <slot name="media"></slot>
  </section>
  <section part="main">
    <slot></slot>  <!-- デフォルトスロット -->
  </section>
  <section part="sub">
    <slot name="sub"></slot>
  </section>
</article>
```

**Light DOMでの自由なマークアップ:**
```html
<dads-card>
  <img slot="media" src="..." alt="...">
  <h2><a href="#">タイトル</a></h2>  <!-- 見出しタグを自由に選択 -->
  <p>本文テキスト</p>
  <button slot="sub">アクション</button>
</dads-card>
```

### 設計指針
1. **Shadow DOM**: 構造的なコンテナのみ（article、section）
2. **Light DOM**: セマンティックな要素（h1-h6、p、a等）は利用者が配置
3. **スロット**: デフォルトスロットで複数要素を受け入れ
4. **スタイリング**: `::slotted()`で直接の子要素にスタイル適用

### 結果
- **メリット**: シンプルなDOM、セマンティックなHTML、アクセシビリティ向上
- **デメリット**: 子孫要素のスタイリングは利用者側で行う必要あり

### 関連パターン
- ::slotted() Limitation Pattern
- Light DOM Styling for Descendant Elements Pattern
- Slot Content Detection Pattern

---

## Slotted Margin Reset Workaround Pattern
**タグ**: #webcomponents #css #slotted
**適用場面**: `::slotted(*)` でマージンがリセットされる要素にスペーシングを適用したい時
**発見日**: 2026-01-29（Card Example 2実装）

### 問題
コンポーネント内で `::slotted(*)` を使って全スロット要素のマージンをリセットしている場合、Light DOM側で設定したマージンが無効化される。

```css
/* コンポーネントのShadow DOM */
[part="main"] ::slotted(*) {
  margin: 0;  /* すべてのスロット要素のマージンをリセット */
}
```

```html
<!-- Light DOM -->
<my-component>
  <div class="divider" style="margin: 8px 0">...</div>  <!-- 効かない -->
</my-component>
```

### 解決策
マージンの代わりにパディングを使用する。

```css
/* ❌ NG: マージンは ::slotted(*) でリセットされる */
.divider {
  margin-top: 8px;
  margin-bottom: 8px;
  border-top: 1px solid gray;
}

/* ✅ OK: パディングは影響を受けない */
.divider {
  padding-top: var(--spacing-2);
  padding-bottom: var(--spacing-2);
  border-top: 1px solid gray;
}
```

### 結果
- **メリット**: コンポーネントの内部実装に依存しないスペーシング
- **デメリット**: パディングとマージンの使い分けを意識する必要あり

### 関連パターン
- ::slotted() Limitation Pattern
- Light DOM Styling for Descendant Elements Pattern

### 詳細
→ [Card Example 2 実装からの学び](card-example-2-learnings.md)

---

## Overflow and Focus Ring Pattern
**タグ**: #webcomponents #css #accessibility #focus
**適用場面**: コンポーネント内のフォーカスリングがコンテナ外にはみ出す場合
**発見日**: 2026-01-29（Card Example 2実装）

### 問題
コンポーネントに `overflow: clip` や `overflow: hidden` が設定されていると、内部要素のフォーカスリング（outline、box-shadow）がクリップされる。

```css
/* コンポーネントのShadow DOM */
[part="base"] {
  overflow: clip;  /* フォーカスリングをクリップしてしまう */
}
```

### 解決策
デモや利用側で `::part()` を使って overflow を上書きする。

```css
/* 利用側のCSS */
my-component::part(base) {
  overflow: visible;
}
```

### 設計への示唆
コンポーネント設計時、overflow の設定は慎重に行う：

```css
/* コンポーネント側での対策案 */
[part="base"] {
  /* overflow: clip; の代わりに */
  overflow-x: clip;  /* 必要な方向のみ */

  /* または、フォーカス用の余白を確保 */
  padding: 4px;
  margin: -4px;
}
```

### 結果
- **メリット**: フォーカスが正しく表示され、アクセシビリティ向上
- **デメリット**: コンテンツがはみ出す可能性がある

### 詳細
→ [Card Example 2 実装からの学び](card-example-2-learnings.md)

---

## CSS Token Simplification Pattern
**タグ**: #css #designtokens #refactoring
**適用場面**: ハードコードされたCSS値をデザイントークンに置き換える時
**発見日**: 2026-01-29（Card Example 2実装）

### 問題
CSS内にハードコードされた `calc()` 値やカスタム変数が散在し、保守性が低い。

```css
/* ❌ NG: ハードコードされた値 */
:host {
  --my-component-gap: calc(16 / 16 * 1rem);
  --my-component-padding: calc(24 / 16 * 1rem);
}

.element {
  gap: var(--my-component-gap);
  padding: var(--my-component-padding);
}
```

### 解決策
デザイントークンを直接使用し、中間変数を削除する。

```css
/* ✅ OK: デザイントークンを直接使用 */
.element {
  gap: var(--spacing-4);        /* 16px */
  padding: var(--spacing-6);    /* 24px */
}
```

### スペーシングトークン対応表

| 値 | トークン | 用途 |
|---|---------|------|
| 4px | `--spacing-1` | 極小余白 |
| 8px | `--spacing-2` | 小余白 |
| 12px | `--spacing-3` | 中小余白 |
| 16px | `--spacing-4` | 標準余白 |
| 20px | `--spacing-5` | 中余白 |
| 24px | `--spacing-6` | 大余白 |
| 32px | `--spacing-8` | 特大余白 |
| 44px | `--touch-target-min` | タッチターゲット |

### セマンティックトークンの活用

```css
/* 数値でなく意味で指定 */
width: var(--touch-target-min);   /* 44px タッチターゲット最小サイズ */
color: var(--color-neutral-solid-gray-900);  /* #1a1a1c ではなく */
```

### 結果
- **メリット**: 保守性向上、一貫性、意図の明確化
- **デメリット**: トークン名を覚える必要あり

### 実績（Card Example 2）
| 指標 | Before | After | 削減率 |
|------|--------|-------|--------|
| CSS行数 | ~137行 | ~107行 | 22% |
| カスタム変数 | 8個 | 0個 | 100% |
| ハードコード calc() | 25箇所 | 0箇所 | 100% |

### 詳細
→ [Card Example 2 実装からの学び](card-example-2-learnings.md)

---

*継続的に更新されます*
