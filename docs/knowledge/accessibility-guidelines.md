# Web Components アクセシビリティガイドライン

**タグ**: #accessibility #webcomponents #aria #dads #wcag
**最終更新**: 2026-01-07
**適用対象**: フォーム要素、インタラクティブコンポーネント

---

## 概要

このドキュメントは、DADSガイドライン（デジタル庁デザインシステム）に準拠したWeb Componentsのアクセシビリティ実装における重要な知見をまとめたものです。

---

## 1. aria-live / role="alert" を使わない

### 背景
DADSガイドラインでは、**エラーテキストの読み上げにaria-liveを使わない**ことを明確に規定しています。

### 理由
> 「エラーテキストの読み上げが割り込んでくることになり、スクリーンリーダーユーザーの閲覧や操作の妨げとなります」
> — DADS input-text accessibility

### 技術的背景

| 属性/ロール | 動作 | 問題点 |
|------------|------|--------|
| `aria-live="assertive"` | 即座に読み上げを中断して通知 | ユーザーの操作を妨げる |
| `aria-live="polite"` | 現在の読み上げ後に通知 | 入力のたびに通知が発生 |
| `role="alert"` | `aria-live="assertive"`と同等 | 上記と同じ |

### 正しい実装

```html
<!-- NG: aria-live/role="alert"を使用 -->
<span id="error" aria-live="polite">エラーメッセージ</span>
<div id="error" role="alert">エラーメッセージ</div>

<!-- OK: 静的テキスト + aria-describedby -->
<input aria-describedby="error support-text" aria-invalid="true">
<span id="error">エラーメッセージ</span>
<span id="support-text">入力のヒント</span>
```

### エラー通知の代替手法

1. **aria-describedby**: エラーテキストをフォームコントロールに関連付け
2. **aria-invalid**: エラー状態を明示（`true`/`false`）
3. **静的表示**: エラーメッセージは通常のテキストとして表示

```typescript
// 正しい実装例
#showValidationError(message: string): void {
  // aria-invalidでエラー状態を明示
  this.#textarea.setAttribute('aria-invalid', 'true');

  // aria-describedbyでエラーテキストを関連付け
  this.#updateAriaDescribedBy(); // 'support-text error-text counter' など

  // エラーテキストを静的に表示（aria-live なし）
  this.#errorFallback.textContent = message;
}
```

---

## 2. aria-describedby の動的管理

### 原則
複数の説明要素（サポートテキスト、カウンター、エラーメッセージ）を状態に応じて動的に管理します。

### 実装パターン

```typescript
#updateAriaDescribedBy(): void {
  const ids: string[] = [];

  // サポートテキストがある場合
  const supportText = this.shadowRoot?.querySelector('#support-text');
  if (supportText?.textContent?.trim()) {
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

  // 関連付けを設定
  if (ids.length > 0) {
    this.#textarea.setAttribute('aria-describedby', ids.join(' '));
  } else {
    this.#textarea.removeAttribute('aria-describedby');
  }
}
```

### 呼び出しタイミング

- `connectedCallback` で初期化時
- 関連する属性が変更された時（`support-text`, `show-counter`, `error`）
- バリデーション状態が変化した時

---

## 3. フォーム要素のアクセシビリティ

### 必須要件

| 要件 | 実装方法 |
|------|----------|
| ラベル関連付け | `<label for="id">` と `<input id="id">` |
| エラー状態 | `aria-invalid="true/false"` |
| 説明テキスト | `aria-describedby` |
| 必須表示 | `aria-required="true"` + 視覚的表示 |
| 無効状態 | `aria-disabled="true"` + `disabled` 属性 |

### NG パターン

```html
<!-- NG: maxlength属性（文字変換時にデータロス） -->
<textarea maxlength="100"></textarea>

<!-- NG: disabledでキーボードアクセス不可 -->
<button disabled>送信</button>

<!-- NG: placeholderをラベル代わりに -->
<input placeholder="お名前">
```

### OK パターン

```html
<!-- OK: maxlengthはバリデーションで制御 -->
<textarea aria-describedby="counter"></textarea>
<span id="counter">0/100</span>

<!-- OK: aria-disabledでキーボードアクセス維持 -->
<button aria-disabled="true">送信</button>

<!-- OK: ラベルを明示的に表示 -->
<label for="name">お名前</label>
<input id="name" aria-describedby="name-hint">
<span id="name-hint">姓名の順でご入力ください</span>
```

---

## 4. 文字数カウンターの実装

### DADSガイドライン

- カウンターは常時表示（動的通知ではなく静的表示）
- `aria-describedby` でフォームコントロールに関連付け
- 超過時は視覚的にエラー状態を表示

### 実装例

```typescript
// テンプレート（aria-live なし）
template: html`
  <textarea part="textarea" id="textarea"></textarea>
  <span part="counter" id="counter"></span>
`

// カウンター更新
#updateCounter(): void {
  const currentLength = this.#textarea.value.length;
  const maxLength = this.getAttribute('maxlength');

  if (maxLength) {
    this.#counter.textContent = `${currentLength}/${maxLength}`;

    // 超過時のエラー状態
    if (currentLength > parseInt(maxLength, 10)) {
      this.#counter.setAttribute('data-exceeded', '');
    } else {
      this.#counter.removeAttribute('data-exceeded');
    }
  }
}
```

```css
/* 超過時のスタイル */
[part="counter"][data-exceeded] {
  color: var(--color-error);
  font-weight: 700;
}
```

---

## 5. エラーメッセージの文言

### DADS推奨文言

| エラー種別 | 推奨メッセージ |
|-----------|---------------|
| 必須未入力 | この項目は入力が必須です |
| 文字数超過 | 入力できる文字数を超えています |
| 形式不正 | 正しい形式で入力してください |

### 実装例

```typescript
const ERROR_MESSAGES = {
  required: 'この項目は入力が必須です',
  overflow: '入力できる文字数を超えています',
  pattern: '正しい形式で入力してください',
} as const;
```

---

## 6. チェックリスト

### コンポーネント実装時

- [ ] `aria-live` / `role="alert"` を**使わない**
- [ ] エラーテキストを `aria-describedby` で関連付け
- [ ] `aria-invalid="true/false"` を適切に設定
- [ ] ラベルとフォームコントロールを `for/id` で関連付け
- [ ] サポートテキストを `aria-describedby` で関連付け
- [ ] カウンターを `aria-describedby` で関連付け
- [ ] `maxlength` 属性は使わない（バリデーションで制御）
- [ ] エラーメッセージはDADS推奨文言を使用

### テスト時

- [ ] スクリーンリーダーでフォーカス時にラベルが読み上げられる
- [ ] スクリーンリーダーでサポートテキストが読み上げられる
- [ ] エラー時に `aria-invalid="true"` が設定される
- [ ] エラー時にエラーメッセージが `aria-describedby` に含まれる
- [ ] **割り込み読み上げが発生しない**

---

## 7. 参照ドキュメント

### DADS（デジタル庁デザインシステム）

- [Input Text Accessibility](https://design.digital.go.jp/dads/components/input-text/accessibility/)
  - aria-liveを使わない理由
  - エラーテキストの実装方法
  - フォーム要素のアクセシビリティ要件

- [Textarea Component](https://design.digital.go.jp/dads/components/textarea/)
  - 文字数制限がある場合の実装
  - エラーメッセージの文言

### WCAG 2.2

- [1.3.1 Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- [4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)

---

## 8. よくある間違いと修正

### Case 1: カウンターにaria-live

```diff
- <span id="counter" aria-live="polite">0/100</span>
+ <span id="counter">0/100</span>
```

**理由**: 入力のたびに読み上げが発生し、ユーザーの操作を妨げる

### Case 2: エラーにrole="alert"

```diff
- <div id="error" role="alert">エラーメッセージ</div>
+ <div id="error">エラーメッセージ</div>
```

**理由**: エラー表示時に読み上げが割り込み、操作を妨げる

### Case 3: maxlength属性の使用

```diff
- <textarea maxlength="100"></textarea>
+ <textarea></textarea>
+ <!-- JavaScript でバリデーション制御 -->
```

**理由**: IME入力時に文字変換でデータが失われる可能性

### Case 4: エラーメッセージの文言

```diff
- '入力可能な文字数を超えています'
+ '入力できる文字数を超えています'
```

**理由**: DADS公式文言に準拠

---

## 9. 実装サンプル

### 完全なフォーム要素の実装

```typescript
class AccessibleTextarea extends FormComponent {
  static definition = {
    template: html`
      <div part="container">
        <label part="label" for="textarea">
          <slot name="label"></slot>
          <span part="label-fallback"></span>
        </label>

        <div part="support-text" id="support-text">
          <slot name="support-text"></slot>
          <span id="support-fallback"></span>
        </div>

        <textarea
          part="textarea"
          id="textarea"
          rows="3"
        ></textarea>

        <!-- aria-live なし -->
        <span part="counter" id="counter"></span>

        <!-- role="alert" なし -->
        <div part="error-text" id="error-text">
          <span id="error-fallback"></span>
        </div>
      </div>
    `,
  };

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

  #showError(message: string): void {
    this.setAttribute('error', '');
    this.#errorFallback.textContent = message;
    this.#textarea.setAttribute('aria-invalid', 'true');
    this.#updateAriaDescribedBy();
  }

  #clearError(): void {
    this.removeAttribute('error');
    this.#errorFallback.textContent = '';
    this.#textarea.setAttribute('aria-invalid', 'false');
    this.#updateAriaDescribedBy();
  }
}
```

---

*このドキュメントは継続的に更新されます*
