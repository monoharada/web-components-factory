# ADR-002: Form-Associated Web Componentsのバリデーションアーキテクチャ

## ステータス

**承認済み** (2026-01-08)

## コンテキスト

### 背景

デジタル庁デザインシステム（DADS）に準拠したForm-Associated Custom Elements（`<dads-input-text>`、`<dads-button>`等）を開発している。フォームバリデーションにおいて、ネイティブHTML要素のバリデーションとカスタムバリデーションの干渉により、予期しない動作が発生することが判明した。

### 発生したバグ

**シナリオ**: `required` + `type="email"` + `auto-validate` 属性を持つ入力フィールド

1. "test" と入力 → Email形式エラー表示（正常）
2. 入力を全削除 → エラークリア（正常）
3. 再送信 → **期待**: 必須エラー表示、**実際**: エラー表示されない

### 根本原因

2つの独立した問題が絡み合っていた：

#### 問題1: ElementInternals.setValidity()の状態管理

`#clearValidationError()` でエラー状態をクリアする際、属性の削除だけでなく `_internals.setValidity({})` を呼ぶ必要がある。これを呼ばないと、ブラウザ内部のvalidation stateがdirtyのまま残り、次回のフォーム送信処理に影響する。

#### 問題2: reportValidity()とネイティブinput type="email"の干渉

`<dads-button type="submit">` が `form.reportValidity()` を呼ぶと、Shadow DOM内の `<input type="email">` のネイティブバリデーションが実行される。ネイティブ `<input type="email">` は空でない不正な値に対して `validity.typeMismatch = true` を返すため、カスタムバリデーション（空 → 必須エラー）の前にブロックされてしまう。

```
期待フロー:
dads-button click → form.requestSubmit() → submit event → カスタムバリデーション

問題のフロー:
dads-button click → form.reportValidity() → ネイティブvalidation失敗 → requestSubmit()呼ばれない
```

### 検討した選択肢

#### 選択肢1: ネイティブバリデーションを活用する

内部の `<input>` に `required`、`type="email"` を転送し、ネイティブバリデーションに委ねる。

**メリット**:
- 実装がシンプル
- ブラウザ標準の動作

**デメリット**:
- エラーメッセージのカスタマイズが困難
- バリデーションタイミングの制御が困難
- DADSのエラー表示仕様と異なる
- 複数バリデーションの優先順位制御が困難

#### 選択肢2: ネイティブバリデーションを完全に無効化 【採用】

内部 `<input>` にはバリデーション関連属性を転送せず、カスタムバリデーションで全て制御する。

**メリット**:
- 完全なバリデーション制御
- DADSエラーメッセージ仕様への準拠
- バリデーション優先順位の明確化（required → typeMismatch）
- カスタムエラースロットによる柔軟なメッセージ

**デメリット**:
- 実装の複雑化
- ネイティブUIヒント（入力候補等）の一部喪失

#### 選択肢3: ハイブリッドアプローチ

ネイティブバリデーションをベースに、カスタム処理でオーバーライド。

**メリット**:
- 一部ネイティブ機能を活用可能

**デメリット**:
- 状態管理が複雑
- 予期しない干渉のリスク（今回のバグの原因）

## 決定

**選択肢2「ネイティブバリデーションを完全に無効化」を採用する。**

### 設計原則

```
┌─────────────────────────────────────────────────────────────────┐
│  Form-Associated Web Components バリデーション設計原則           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ネイティブバリデーションを回避                                │
│     - required属性を内部inputに転送しない                        │
│     - 代わりにaria-requiredでアクセシビリティを維持               │
│                                                                 │
│  2. カスタムバリデーションはsubmitイベントで実行                  │
│     - form.addEventListener('submit', handler)                  │
│     - e.preventDefault()でバリデーション失敗時の送信を阻止        │
│                                                                 │
│  3. ボタンコンポーネントはrequestSubmit()を直接呼ぶ              │
│     - reportValidity()は使わない（ネイティブ干渉を防ぐ）          │
│     - カスタムバリデーションに判断を委ねる                        │
│                                                                 │
│  4. エラークリア時はsetValidity({})で状態をリセット              │
│     - 属性削除だけでは不十分                                     │
│     - 次回submit時のバリデーション再実行を保証                    │
│                                                                 │
│  5. バリデーション優先順位を明確化                               │
│     - required（必須）→ typeMismatch（形式）→ その他            │
│     - 最初に失敗したルールのエラーのみ表示                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 技術的実装

### 1. 入力コンポーネント（dads-input-text）

#### required属性の処理

```typescript
// packages/components/input-text/input-text.ts

#syncInputAttributes() {
  if (!this.#input) return;

  // ❌ required を内部inputに転送しない（ネイティブバリデーションを回避）
  // ✅ aria-required でアクセシビリティを維持
  if (this.hasAttribute('required')) {
    this.#input.setAttribute('aria-required', 'true');
  } else {
    this.#input.removeAttribute('aria-required');
  }
}
```

#### バリデーション実行（submitイベント）

```typescript
#handleFormSubmit = (e: Event): void => {
  // disabled/readonlyの場合はバリデーションしない
  if (this.hasAttribute('disabled') || this.hasAttribute('readonly')) return;

  // 優先順位: required → typeMismatch
  const isRequiredValid = this.#validateRequired();
  if (!isRequiredValid) {
    e.preventDefault();
    return;
  }

  const isTypeMismatchValid = this.#validateTypeMismatch();
  if (!isTypeMismatchValid) {
    e.preventDefault();
  }
};
```

#### エラー表示

```typescript
#showValidationError(type: 'required' | 'typeMismatch'): void {
  this.#validationErrorType = type;
  const message = this.#getErrorMessage(type);
  this.setAttribute('error', '');
  this.setAttribute('error-text', message);
  this.#updateValidationUI(true);

  // ElementInternalsにも状態を設定
  this._internals.setValidity(
    { customError: true },
    message,
    this.#input ?? undefined
  );
}
```

#### エラークリア（重要）

```typescript
#clearValidationError(): void {
  if (this.#validationErrorType === null) return;
  this.#validationErrorType = null;
  this.removeAttribute('error');
  this.removeAttribute('error-text');
  this.#updateValidationUI(false);

  // ⚠️ 重要: setValidity({})で状態をリセット
  // これを呼ばないと、次回submitが正しく処理されない
  this._internals.setValidity({});
}
```

### 2. ボタンコンポーネント（dads-button）

#### フォームアクション処理

```typescript
// packages/components/button/button.ts

#handleFormAction() {
  const form = this._internals.form;
  if (!form) return;

  const buttonType = this.getAttribute('type') || 'button';
  switch (buttonType) {
    case 'submit':
      // ⚠️ 重要: reportValidity()は呼ばない
      // 理由: ネイティブinput[type="email"]のバリデーションが干渉するため
      // カスタムバリデーションはsubmitイベントハンドラで処理される
      form.requestSubmit();
      break;
    case 'reset':
      form.reset();
      break;
    // 'button'タイプは何もしない
  }
}
```

### 3. バリデーションユーティリティ

```typescript
// packages/utils/validation.ts

export interface ValidationRule<T = HTMLElement> {
  type: string;
  defaultMessage: string;
  errorSlotName: string;
  validate: (value: string, element: T) => boolean;
}

export const VALIDATION_RULES = {
  required: {
    type: 'required',
    defaultMessage: 'この項目は入力が必須です',
    errorSlotName: 'required-error',
    validate: (value: string) => value.trim().length > 0,
  },
  typeMismatch: {
    type: 'typeMismatch',
    defaultMessage: 'メールアドレスの形式が正しくありません',
    errorSlotName: 'type-mismatch-error',
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  },
} as const;
```

## シーケンス図

### 正常なバリデーションフロー

```
User          dads-button      Form         dads-input-text
  │                │             │                │
  │  click         │             │                │
  ├───────────────►│             │                │
  │                │             │                │
  │                │ requestSubmit()              │
  │                ├────────────►│                │
  │                │             │                │
  │                │             │ submit event   │
  │                │             ├───────────────►│
  │                │             │                │
  │                │             │ validate       │
  │                │             │                ├──┐
  │                │             │                │  │ #validateRequired()
  │                │             │                │  │ #validateTypeMismatch()
  │                │             │                │◄─┘
  │                │             │                │
  │                │             │ preventDefault()│
  │                │             │◄───────────────┤ (if invalid)
  │                │             │                │
  │                │             │                │ #showValidationError()
  │                │             │                ├──┐
  │                │             │                │  │ setAttribute('error')
  │                │             │                │  │ setValidity({customError})
  │                │             │                │◄─┘
  │  error shown   │             │                │
  │◄───────────────┴─────────────┴────────────────┤
```

### エラークリア→再送信フロー

```
User          dads-input-text      Form
  │                │                 │
  │  input event   │                 │
  ├───────────────►│                 │
  │                │                 │
  │                │ #clearValidationError()
  │                ├──┐              │
  │                │  │ removeAttribute('error')
  │                │  │ setValidity({})  ←── 重要！
  │                │◄─┘              │
  │                │                 │
  │  submit        │                 │
  ├────────────────┼────────────────►│
  │                │                 │
  │                │  submit event   │
  │                │◄────────────────┤
  │                │                 │
  │                │ バリデーション再実行
  │                ├──┐              │
  │                │  │ #validateRequired()
  │                │◄─┘              │
  │                │                 │
  │  new error     │                 │
  │◄───────────────┤                 │
```

## 影響

### 変更対象ファイル

| ファイル | 変更種別 | 説明 |
|---------|---------|------|
| `packages/components/input-text/input-text.ts` | 修正 | バリデーション実装、setValidity({})追加 |
| `packages/components/button/button.ts` | 修正 | reportValidity()削除、requestSubmit()直接呼び出し |
| `packages/utils/validation.ts` | 新規/修正 | バリデーションルール定義 |
| `viewer.html` | 修正 | クリティカルコンポーネントのプリロード |

### 今後のコンポーネント実装への適用

以下のコンポーネントは同様のパターンを適用すべき：

- [ ] `<dads-textarea>` - 同様のバリデーション実装
- [ ] `<dads-select>` - 同様のバリデーション実装
- [ ] `<dads-checkbox>` / `<dads-radio>` - required バリデーション

### 破壊的変更

- なし（内部実装の修正のみ）

## テスト

### 追加されたテストケース

```typescript
describe('DadsInputText - Emailバリデーション', () => {
  it('Email形式エラー後にテキスト削除して再送信すると必須エラー表示', async () => {
    // バグ再現シナリオ:
    // 1. required + type="email" + auto-validate
    // 2. "test" 入力 → Email形式エラー
    // 3. テキスト削除（空に）→ エラークリア
    // 4. 再送信 → 必須エラーが出るべき

    // Step 1: Email形式エラー確認
    input.value = 'test';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(element.getAttribute('error-text')).toBe('メールアドレスの形式が正しくありません');

    // Step 2: テキスト削除
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(element.hasAttribute('error')).toBe(false);

    // Step 3: 再送信 → 必須エラー
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(element.getAttribute('error-text')).toBe('この項目は入力が必須です');
  });
});
```

### E2Eエビデンス

`e2e-evidence/final-validation-test/` に以下を保存：
- スクリーンショット（各ステップ）
- 動画録画（全操作）
- テスト結果レポート

## 学んだこと

### 1. ElementInternals.setValidity()は状態管理ツール

単にエラーメッセージを設定するためだけでなく、フォームのバリデーション状態全体を管理する。`setValidity({})` を呼ぶことで「このフィールドは現在有効」とマークし、次回のフォーム送信処理で再評価されることを保証する。

### 2. reportValidity()とrequestSubmit()の違い

| メソッド | 動作 |
|---------|------|
| `reportValidity()` | 全フォーム要素のネイティブバリデーションを実行し、UIを更新 |
| `requestSubmit()` | submitイベントを発火（バリデーションはイベントハンドラに委ねる）|

カスタムWeb Componentsでは `requestSubmit()` を使用し、バリデーションロジックを一元管理すべき。

### 3. Shadow DOM内のネイティブ要素の影響

Shadow DOM内に配置された `<input type="email">` も、`form.reportValidity()` のスコープに含まれる。これがカスタムバリデーションと干渉する原因となった。

### 4. クリティカルコンポーネントのプリロード

フォーム送信ボタンのような重要なコンポーネントは、遅延ロードではなくページ読み込み時に即座にロードすべき。これにより、ユーザーの最初のクリックでも確実に動作する。

## 将来の検討事項

### 1. バリデーションフレームワークの抽象化

複数コンポーネントで同じバリデーションパターンを使用するため、共通のミックスインまたはベースクラスの導入を検討。

```typescript
// 将来の実装案
class ValidatableFormComponent extends FormComponent {
  protected validationRules: ValidationRule[];
  protected handleFormSubmit(e: Event): void { /* 共通処理 */ }
  protected showValidationError(type: string): void { /* 共通処理 */ }
  protected clearValidationError(): void { /* 共通処理 */ }
}
```

### 2. 非同期バリデーション対応

サーバーサイドバリデーション（ユニーク性チェック等）への対応を検討。

### 3. バリデーショングループ

複数フィールドの相関バリデーション（パスワード確認等）への対応を検討。

## 参考資料

- [MDN: ElementInternals.setValidity()](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/setValidity)
- [MDN: HTMLFormElement.requestSubmit()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit)
- [MDN: HTMLFormElement.reportValidity()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reportValidity)
- [WHATWG: Form-Associated Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-elements)
- [DADS Input Text Accessibility](https://design.digital.go.jp/dads/components/input-text/accessibility/)

## 関連ドキュメント

- [ADR-001: placeholder属性非推奨化](./ADR-001-placeholder-deprecation.md)
- [アクセシビリティガイドライン](../knowledge/accessibility-guidelines.md)
- [E2Eエビデンス取得ガイド](../knowledge/e2e-evidence-guide.md)

---

*作成日: 2026-01-08*
*最終更新: 2026-01-08*
*作成者: Claude Code*
