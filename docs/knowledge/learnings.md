# 🎓 Learnings

このファイルには、プロジェクト開発中に得られた学習内容を記録します。

---

## [2026-01-17] Web ComponentsのCSSは「Primitive→Semantic→Local→Properties」で責務分離し、フォールバックは原則消す（A11y最小保証のみ例外）
**タグ**: #css #tokens #a11y #webcomponents #markup

### 概要
Shadow DOM内のCSSは、Primitive（グローバルトークン注入）→ Semantic（意味的トークン）→ Local（コンポーネント公開トークン）→ Properties（実スタイル）の4段に責務分離すると、レビュー・カスタマイズ・保守が安定する。

同時に `var(--token, fallback)` のフォールバックは「本当に必要なアクセシビリティ上の最低保証」以外は削除し、**必要なPrimitiveを必ず注入する**（例: `applyDADSTokens()` / `applySpacingTokens()`）。

### 詳細
- ✅ OK: Primitiveは `styles` の先頭で注入する（例: `applyDADSTokens()` / `applySpacingTokens()`）
- ✅ OK: Semantic tokenで Primitive を意味単位に束ねる（例: `--radio-input-border-color`）
- ✅ OK: Local token（`--dads-radio-*` など）を外部カスタマイズの窓口にし、variant/sizeは `:host([size])` で切り替える
- ✅ OK: Stylesでは **Local tokenだけ** を参照し、プロパティ定義は1回・状態変化は変数再代入で表現する
- ✅ OK: Shadow DOMテンプレート内にBEMクラスを残さず、`part` を唯一のスタイリングAPIにする（クラスは誤誘導になる）
- ✅ OK: `:has()` は、DOMを増やさずに条件付きスタイル（「ラベルが空ならpadding無し」など）が書けるなら合理的に採用する
- ❌ NG: Styles内で Primitive（`--color-primitive-*` / `--spacing-*`）を直接参照する（tokenの責務が崩れる）
- ❌ NG: 「とりあえず」フォールバック値を大量に入れる（本番ではトークン注入の不備を隠してしまう）

### 適用例
```ts
styles: withReset([
  applyDADSTokens(),
  applySpacingTokens(),
  radioTokens,
  radioStyles,
], 'minimal')
```

#### A11y: 44pxタップ領域の最低保証（spacing-factor等で縮小しても下回らない）
`applySpacingTokens()` の `--spacing-11` は `--spacing-factor` の影響を受けるため、最低保証が必要な箇所では `--spacing-scale-*`（unitless）をpx化して `max()` で下限を作る。

```css
--radio-target-size-lg: max(var(--spacing-11), calc(var(--spacing-scale-11) * 1px));
```

---

## [2026-01-16] DADS Checkbox/Radioのサイズ分岐は`:host([size])`で管理する
**タグ**: #css #webcomponents #dads

### 概要
Shadow DOM内部要素へ`data-size`をコピーして`[part="base"][data-size="lg"]`のように分岐するのではなく、ホスト属性`size`をソースにして`:host([size="lg"])`でサイズトークンを切り替える（例: checkbox/radio）。

### 詳細
- ✅ OK: `:host([size="lg"]) { --_gap: ... }` のようにホストでトークンを定義し、内部要素は変数参照のみで描画する
- ✅ OK: px→rem変換の`calc(17 / 16 * 1rem)`は書かず、`--font-size-*` / `--spacing-*` を参照する
- ✅ OK: 内部要素の選択は`part`を使用する（例: `[part="base"]`）
- ✅ OK: ホバー状態は`@media (any-hover: hover)`でガードし、タッチ環境に不用意に適用しない
- ❌ NG: `--_label-font-size: calc(17 / 16 * 1rem);` のようなpx→rem変換を直書きする
- ❌ NG: `[part="base"][data-size="lg"] { ... }` のように内部要素へサイズ状態を複製してスタイル分岐する（保守コスト増・ルール逸脱の温床）
- ❌ NG: `@media (hover: hover)` や無条件`:hover`でホバースタイルを適用する（`any-hover`優先）

### 適用例
```css
:host([size="lg"]) {
  /* 前提: Primitive（spacing/font）を注入していること */
  --_gap: var(--spacing-3);
  --_label-font-size: var(--font-size-17);
}

[part="base"] {
  gap: var(--_gap);
}

[part="label"] {
  font-size: var(--_label-font-size);
}
```

### 注意点
- `data-*` はスタイルガイド上の疑似状態表示（例: `data-state="hover"`）など、明確な理由がある場合に限定する。

---

## [2025-09-02] Claude Code開発フローの確立
**タグ**: #workflow #claudecode #productivity

### 概要
Zenn記事「私の好きなClaude Codeの使い方」を基に、プロジェクト固有の開発フローを確立。

### 詳細
- インクリメンタル開発の重要性を認識
- 小さく可逆的な変更の積み重ねが効率的
- 頻繁なコミットとレビューがコード品質を向上
- ナレッジ管理システムの構築で知識の蓄積が可能に

### 適用例
```bash
# 新機能開発の標準フロー
npm run claude:plan    # 計画
npm run tdd           # TDD開発
npm run claude:review # レビュー
npm run claude:verify # 検証
```

### 注意点
- 計画なしに実装を始めない
- テストを書いてから実装する
- 各ステップで検証を行う

---

## [2025-09-02] Web Componentsベストプラクティス
**タグ**: #webcomponents #architecture #css

### 概要
Web Components開発における重要な原則とパターンを確立。

### 詳細
1. **::part()の使用**: クラスではなく::part()でスタイリング
2. **ネイティブHTML優先**: details/summary, dialog等を活用
3. **Shadow DOM隔離**: スタイルの適切なカプセル化
4. **CSS変数パターン**: 重複定義を避け、変数の再代入で状態変化

### 適用例
```typescript
// 正しいpart属性の使用
template: html`
  <div part="base">
    <button part="trigger">
      <slot></slot>
    </button>
  </div>
`

// CSS変数パターン
styles: css`
  [part="base"] {
    background: var(--button-bg);
  }
  :host(:hover) {
    --button-bg: var(--button-bg-hover);
  }
`
```

### 注意点
- グローバルクラスの使用を避ける
- ネイティブ要素の機能を再実装しない
- CSS変数の重複定義に注意

---

## [2025-09-02] TypeScript厳格モードの価値
**タグ**: #typescript #quality #typesafety

### 概要
`strict: true`と`any`型の禁止による開発品質向上。

### 詳細
- 型安全性により実行時エラーを大幅に削減
- IDE支援が向上し、開発速度が向上
- リファクタリングが安全に実行可能
- ドキュメントとしての役割も果たす

### 適用例
```typescript
// BAD: any型の使用
function process(data: any) { /* ... */ }

// GOOD: 適切な型定義
interface ProcessData {
  id: string;
  value: number;
}
function process(data: ProcessData) { /* ... */ }
```

### 注意点
- 初期段階から厳格モードを有効にする
- 型定義の作成に時間を投資する価値がある
- unknown型を適切に活用する

---

## [2025-09-02] TDDサイクルの効果
**タグ**: #testing #tdd #quality

### 概要
Test-Driven Development（TDD）による品質と設計の向上。

### 詳細
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコード
3. **Refactor**: コードを改善

このサイクルにより:
- 設計が明確になる
- 回帰テストが自動的に構築される
- リファクタリングが安全になる
- ドキュメントとしても機能する

### 適用例
```bash
# TDDワークフロー
npm run tdd  # watch modeでテスト駆動開発
```

### 注意点
- テストを書きすぎない（YAGNI原則）
- モックを適切に使用する
- E2Eテストとユニットテストのバランス

---

## [2025-01-07] Textareaコンポーネント実装から得た学び
**タグ**: #webcomponents #slots #focus #forms #tdd

### 概要
DADS準拠Textareaコンポーネントの実装を通じて、スロット管理、フォーカススタイルの共通化、属性同期のベストプラクティスを確立。

### 詳細

#### 1. スロットフォールバックの正しい実装
**問題**: スロット親要素の`textContent`を上書きすると、スロットされたコンテンツが破壊される

```typescript
// ❌ BAD: スロットが破壊される
labelElement.textContent = this.getAttribute('label') || '';

// ✅ GOOD: 別のフォールバック要素を使用
<label part="label">
  <span part="label-text"><slot name="label"></slot></span>
  <span part="label-fallback"></span>  <!-- フォールバック用 -->
</label>
// フォールバック要素のみ更新
fallbackElement.textContent = this.getAttribute('label') || '';
```

#### 2. フォーカススタイルはミックスインで共通化
**問題**: 各コンポーネントで個別にフォーカススタイルを定義すると不整合が生じる

```typescript
// focus-styles-official.ts に集約
export function applyDADSFocusStyles() {
  return css`
    :host [part="base"]:focus-visible { /* ボタン */ }
    :host [part="summary"]:focus-visible { /* アコーディオン */ }
    :host [part="textarea"]:focus-visible { /* テキストエリア */ }
    :host [part="input"]:focus-visible { /* インプット */ }
  `;
}

// 各コンポーネントで使用
static definition = {
  styles: [tokens, styles, applyDADSFocusStyles()]
};
```

#### 3. 属性の遅延同期にqueueMicrotaskを使用
**問題**: `connectedCallback`時点では属性がまだ設定されていないケースがある

```typescript
connectedCallback() {
  super.connectedCallback();
  // 初期設定...

  // 属性が接続後に設定された場合のために再同期
  queueMicrotask(() => {
    if (!this.isConnected) return;
    this.#syncAllAttributes();
  });
}
```

#### 4. happy-domでのrows属性の型
**問題**: happy-domは`textarea.rows`を文字列として返す場合がある

```typescript
// ❌ 失敗する可能性
expect(textarea?.rows).toBe(5);

// ✅ 安全な比較
expect(Number(textarea?.rows)).toBe(5);
```

### 適用例
`packages/components/textarea/` の実装全体、特に:
- `textarea.ts`: スロットフォールバック、queueMicrotask
- `textarea-styles.ts`: ミックスインへの委譲
- `textarea.test.ts`: 型安全なテスト

### 注意点
- スロット親要素のtextContentは絶対に上書きしない
- フォーカススタイルは必ず共通ミックスインを使用
- テスト環境とブラウザ環境の差異を考慮

---

## [2025-01-07] DADS公式準拠フォーカススタイルとヘッドレスWebComponent設計思想
**タグ**: #dads #focus #tokens #design-philosophy #headless

### 概要
DADS（デジタル庁デザインシステム）公式実装を調査し、フォーカススタイルの不整合を発見・修正。同時に、ヘッドレスWebComponentライブラリとしての設計思想をドキュメント化。

### 詳細

#### 1. DADS公式フォーカススタイルの発見
**問題**: フォーカス時の`border-radius: .25rem`が公式にはない

公式実装（GitHub: digital-go-jp/design-system-example-components）を調査:
```css
/* Button.tsx / Textarea.tsx 共通 */
focus-visible:outline
focus-visible:outline-4
focus-visible:outline-black
focus-visible:outline-offset-[calc(2/16*1rem)]
focus-visible:ring-[calc(2/16*1rem)]
focus-visible:ring-yellow-300
/* ← border-radiusの変更なし */
```

**対応**: `focus-styles-official.ts`から全ての`border-radius`を削除

#### 2. 3層トークン構造の確立
```
Primitive Tokens (DADS公式)
    ↓
Semantic Tokens (意味層)
    ↓
Local Tokens (--dads-* オーバーライド用API)
    ↓
CSS Properties
```

各層の役割:
- **Primitive**: DADS公式の基本値（変更しない）
- **Semantic**: 意味的なマッピング（低頻度変更）
- **Local**: 外部カスタマイズ用API（ユーザーが変更可能）

#### 3. ヘッドレスWebComponentライブラリ思想
Radix UI / shadcn UIから着想:
- DADS準拠をデフォルトに
- `--dads-*` プレフィックスでオーバーライドポイントを提供
- Shadow DOMのカプセル化を活かしながらCSS変数APIで安全に拡張

### 適用例
```typescript
// フォーカストークンの3層構造
:host {
  /* セマンティック層 */
  --focus-outline-color: var(--color-neutral-black);
  --focus-ring-color: var(--color-primitive-yellow-300);

  /* ローカル層（API） */
  --dads-focus-outline-color: var(--focus-outline-color);
  --dads-focus-ring-color: var(--focus-ring-color);
}

/* 利用者によるオーバーライド */
dads-button {
  --dads-focus-ring-color: #your-brand-focus-color;
}
```

### 成果物
- `packages/styles/mixins/focus-styles-official.ts` - 公式準拠版に修正
- `docs/architecture/design-philosophy.md` - 設計思想ドキュメント
- `.claude/skills/headless-component-design/` - Claude Skills化

### 注意点
- 公式実装は必ずGitHubで確認（Tailwindクラスの解読が必要）
- `border-radius`はフォーカス時に変更しない（公式準拠）
- トークンの3層構造を維持し、API層（--dads-*）を公開する

---

## [2025-01-07] DADS角丸（Corner Shapes）仕様の発見と修正
**タグ**: #dads #corner-shapes #border-radius #design-tokens

### 概要
Textareaコンポーネントの角丸が公式仕様と異なることを発見し、修正。DADS公式の角丸設計ルールを文書化。

### 詳細

#### 発見した問題
実装では `0.25rem (4px)` を使用していたが、公式は `0.5rem (8px)` を使用。

```typescript
// ❌ 間違い
--textarea-border-radius: var(--border-radius-4, 0.25rem);

// ✅ 正解
--textarea-border-radius: var(--border-radius-8, 0.5rem);
```

#### DADS公式の角丸5段階スタイル

| スタイル | 正方形 | 長方形 | 用途 |
|---------|--------|--------|------|
| 角丸なし | 0px | 0px | シャープな印象 |
| **角丸スモール** | **8px** | **8px** | **フォーム要素** |
| 角丸ミディアム | 16px | 12px | カード、モーダル |
| 角丸ラージ | 32px | 16px | 大きな強調要素 |
| 角丸フル | 50% | 50% | ピル、アバター |

#### 重要な原則
**同じスタイルでもサイズによって視覚的印象が異なる**
- 小さいコンポーネント → 角丸の影響が強く見える
- コンポーネント種別ごとに個別調整が必要

### 適用例
```css
/* フォーム要素は角丸スモール（8px）を使用 */
--textarea-border-radius: var(--border-radius-8, 0.5rem);
--button-border-radius: var(--border-radius-8, 0.5rem);
--input-border-radius: var(--border-radius-8, 0.5rem);
```

### 成果物
- `packages/components/textarea/textarea-tokens.ts` - 角丸を0.5remに修正
- `docs/architecture/design-philosophy.md` - 角丸セクション追加
- `.claude/skills/headless-component-design/references/corner-shapes.md` - 角丸リファレンス

### 注意点
- フォーム要素（Button, Textarea, Input）は **8px (0.5rem)** を使用
- 4px (0.25rem) は極小要素用であり、フォーム要素には使用しない
- 公式ドキュメント: https://design.digital.go.jp/dads/foundations/corner-shapes/

---

## [2025-01-07] placeholder属性非推奨の実装とアクセシビリティガイドライン
**タグ**: #dads #accessibility #placeholder #deprecated #forms

### 概要
DADS公式アクセシビリティガイドラインに基づき、フォーム入力要素の`placeholder`属性を非推奨として警告・禁止する仕組みを実装。

### 詳細

#### 1. placeholder非推奨の理由（DADS公式）
**参照**: https://design.digital.go.jp/dads/components/input-text/accessibility/

1. **コントラスト比が低い**: 視認性が良くない
2. **入力中の消失**: ユーザーが入力条件を確認できない
3. **スクリーンリーダー対応**: 読み上げられない場合がある

#### 2. 実装パターン: ソフトな禁止

```typescript
// packages/utils/deprecated-attrs.ts
export const DEPRECATED_FORM_ATTRS: DeprecatedAttrConfig[] = [
  {
    name: 'placeholder',
    reason: 'プレースホルダーはコントラスト比が低く、入力中に消えるためアクセシビリティ上の問題があります',
    alternative: 'support-text属性を使用してください',
    docsUrl: 'https://design.digital.go.jp/dads/components/input-text/accessibility/'
  }
];

// コンポーネント側での使用
connectedCallback() {
  checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);
}
```

**挙動**:
- 開発モードで警告を出力
- 内部のネイティブ要素には転送しない
- 本番環境（`NODE_ENV=production`）では警告なし

#### 3. support-textが代替として機能
```html
<!-- ❌ 非推奨 -->
<dads-textarea placeholder="入力例: 山田太郎"></dads-textarea>

<!-- ✅ 推奨 -->
<dads-textarea support-text="入力例: 山田太郎"></dads-textarea>
```

`support-text`の利点:
- 常に表示される（入力中も消えない）
- 高いコントラスト比
- `aria-describedby`で適切に関連付け

#### 4. テストのポイント
属性を設定してからDOMに追加する順序が重要:

```typescript
// ✅ 正しい順序
element = document.createElement('dads-textarea');
element.setAttribute('placeholder', '...'); // 先に属性設定
document.body.appendChild(element); // 後でDOM追加

// ❌ 間違い（警告が発火しない）
element = createTestElement('dads-textarea'); // DOM追加済み
element.setAttribute('placeholder', '...'); // connectedCallback後
```

### 成果物
- `packages/utils/deprecated-attrs.ts` - 非推奨属性ユーティリティ（新規）
- `packages/components/textarea/textarea.ts` - placeholder禁止実装
- `packages/components/textarea/textarea.test.ts` - 非推奨属性テスト追加
- `docs/architecture/design-philosophy.md` - アクセシビリティセクション追加
- `.claude/skills/headless-component-design/references/accessibility.md` - 参照ドキュメント（新規）

### 注意点
- placeholder属性は`observedAttributes`から除外
- `#syncTextareaAttributes`でも転送しない
- 将来的にエラーとして扱う可能性を考慮した設計
- support-textは必ず`aria-describedby`で関連付け

---

## [2026-01-07] フォームラベル・エラー表示の設計パターン
**タグ**: #dads #forms #labels #errors #accessibility

### 概要
フォームコンポーネントの要否ラベルとエラー表示の設計パターンを確立。任意ラベルの廃止、読み取り専用ラベルの追加、エラープレフィックスの統一。

### 詳細

#### 1. 要否ラベルの設計
| 状態 | 表示テキスト | 備考 |
|------|--------------|------|
| 必須 (required) | ※必須 | 赤色で表示 |
| 読み取り専用 (readonly) | 読み取り専用 | デフォルト色 |
| 任意 | **表示なし** | optional属性は廃止 |

**重要な排他制御**: `required`と`readonly`が両方設定された場合、`required`が優先される。

```typescript
#updateRequirement() {
  // required と readonly は排他的（required優先）
  if (this.hasAttribute('required')) {
    requirement.textContent = '※必須';
  } else if (this.hasAttribute('readonly')) {
    requirement.textContent = '読み取り専用';
  } else {
    requirement.textContent = '';
    requirement.style.display = 'none';
  }
}
```

#### 2. エラーメッセージのプレフィックス
**ルール**: 属性経由のエラーには全角「＊」をプレフィックス（スペースなし）

```typescript
// error-text属性経由の場合
fallback.textContent = errorAttr ? `＊${errorAttr}` : '';

// スロット経由のカスタムエラーにはプレフィックス不要
// ユーザーが自由にフォーマットできるため
```

表示例:
- `error-text="入力が必須です"` → 表示: `＊入力が必須です`
- `<span slot="error-text">カスタムエラー</span>` → 表示: `カスタムエラー`

#### 3. optional属性の廃止理由
- ユーザーテストで「任意」表示は冗長と判断
- 必須以外はデフォルトで任意と理解される
- シンプルなUIがアクセシビリティ向上に寄与

#### 4. readonly用汎用ミックスインの作成
複数のフォームコンポーネント間で一貫したreadonlyスタイルを提供:

```typescript
// packages/styles/mixins/readonly-styles.ts
export function applyReadonlyStyles() {
  return css`
    :host {
      --readonly-background: var(--color-neutral-solid-gray-50, #f2f2f2);
      --dads-readonly-background: var(--readonly-background);
    }
    :host([readonly]) [part="textarea"],
    :host([readonly]) [part="input"] {
      background-color: var(--dads-readonly-background);
      cursor: default;
    }
  `;
}
```

### 適用例
```html
<!-- 必須フィールド -->
<dads-textarea label="お名前" required>
</dads-textarea>
<!-- 表示: お名前 ※必須 -->

<!-- 読み取り専用フィールド -->
<dads-textarea label="ユーザーID" readonly value="user123">
</dads-textarea>
<!-- 表示: ユーザーID 読み取り専用 -->

<!-- エラー表示 -->
<dads-textarea label="コメント" error error-text="入力が必須です">
</dads-textarea>
<!-- 表示: ＊入力が必須です -->
```

### 成果物
- `packages/components/textarea/textarea.ts` - 要否ラベル・エラープレフィックス実装
- `packages/styles/mixins/readonly-styles.ts` - readonly用汎用ミックスイン（新規）
- テスト更新: required/readonly/error表示のテスト追加

### 注意点
- プレフィックスはCSSの`::before`ではなくテキストとして追加（アクセシビリティ向上）
- `required`と`readonly`の排他制御は必ず実装
- `optional`属性は完全に削除（破壊的変更）
- スロット経由のカスタムコンテンツはそのまま表示

---

## [2026-01-07] FormComponent: フォーム参加可能なWeb Components基盤
**タグ**: #webcomponents #forms #formAssociated #elementInternals

### 概要
Web Componentsがネイティブフォームに参加するための基盤クラス`FormComponent`の仕組みと使い方。

### 詳細

#### 1. Form Associated Custom Elementsとは
通常のカスタム要素はShadow DOM内のフォーム要素と外部の`<form>`が接続されない。
Form Associated Custom Elementを使うと、カスタム要素自体がフォームに参加できる。

#### 2. 既存の基盤クラス

| クラス | 場所 | 用途 |
|--------|------|------|
| `FormComponent` | `packages/core/web-components.ts:548` | フォーム参加の基本クラス |
| `TypographyFormComponent` | `packages/core/typography/typography-web-component.ts:108` | タイポグラフィ付きフォーム基盤 |

#### 3. FormComponentの提供機能

```typescript
export class FormComponent extends WebComponent {
  static readonly formAssociated = true;  // フォーム参加を宣言
  readonly _internals: ElementInternals;  // フォームAPIアクセス

  constructor() {
    super();
    this._internals = this.attachInternals();  // 内部状態へのアクセス取得
  }

  // 提供されるプロパティ
  get form() { return this._internals.form; }  // 所属フォーム
  get validity() { return this._internals.validity; }  // バリデーション状態
  get validationMessage() { return this._internals.validationMessage; }

  // 提供されるメソッド
  checkValidity() { return this._internals.checkValidity(); }
  reportValidity() { return this._internals.reportValidity(); }

  // ライフサイクルコールバック
  formDisabledCallback(disabled: boolean) { /* フォーム無効化時 */ }
  formResetCallback() { /* フォームリセット時 */ }
  formStateRestoreCallback(state) { /* 状態復元時 */ }
}
```

#### 4. 使用例: フォーム送信ボタン

```typescript
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';

export class DadsButton extends TypographyFormComponent {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
  }

  #handleClick = () => {
    if (this.hasAttribute('disabled')) return;

    const type = this.getAttribute('type');
    const form = this._internals.form;  // FormComponentから継承

    if (!form) return;

    switch (type) {
      case 'submit':
        form.requestSubmit();  // フォーム送信
        break;
      case 'reset':
        form.reset();  // フォームリセット
        break;
    }
  };
}
```

#### 5. 使用例: 入力コンポーネント

```typescript
export class DadsTextarea extends TypographyFormComponent {
  static readonly formAssociated = true;  // 継承元で宣言済みだが明示も可

  #handleInput = () => {
    // フォーム値の更新
    this._internals.setFormValue(this.#textarea.value);
  };

  // バリデーション設定
  #setInvalidState(message: string) {
    this._internals.setValidity(
      { customError: true },
      message,
      this.#textarea  // バリデーション対象要素
    );
  }

  #clearInvalidState() {
    this._internals.setValidity({});
  }
}
```

### ElementInternals APIまとめ

| メソッド/プロパティ | 説明 |
|---------------------|------|
| `form` | 所属する`<form>`要素 |
| `setFormValue(value)` | フォーム送信時の値を設定 |
| `setValidity(flags, message, anchor)` | バリデーション状態を設定 |
| `checkValidity()` | バリデーションチェック |
| `reportValidity()` | バリデーションエラーを表示 |
| `validity` | ValidityStateオブジェクト |
| `validationMessage` | バリデーションメッセージ |
| `willValidate` | バリデーション対象かどうか |

### 適用例
- `packages/components/textarea/textarea.ts` - 入力コンポーネント
- Issue #5: `dads-button`のフォーム送信対応

### 注意点
- `static readonly formAssociated = true`は必須（宣言がないとattachInternals()が機能しない）
- `attachInternals()`はコンストラクタで1回だけ呼ぶ
- Shadow DOM内のネイティブフォーム要素は外部formと接続されないため、必ず`_internals`経由で操作
- フォームリセット時は`formResetCallback`で初期値に戻す処理が必要

### 参考資料
- [MDN: Form-associated custom elements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals)
- [web.dev: More capable form controls](https://web.dev/articles/more-capable-form-controls)
- GitHub Issue #5: dads-button Form Associated対応

---

## [2026-01-08] Form-Associated Web Componentsのバリデーション設計
**タグ**: #webcomponents #forms #validation #elementInternals #dads

### 概要
Form-Associated Custom Elementsでカスタムバリデーションを実装する際、ネイティブバリデーションとの干渉を避けるための設計パターンを確立。`reportValidity()`の罠と`setValidity({})`の重要性を発見。

### 詳細

#### 1. 発生したバグ
「Email形式エラー → 入力削除 → 再送信 → 必須エラーが表示されない」という問題。

#### 2. 根本原因

**問題A: setValidity({})の欠如**
```typescript
// ❌ 不完全なエラークリア
#clearValidationError(): void {
  this.removeAttribute('error');
  this.removeAttribute('error-text');
  // setValidity({})がない → 内部状態がdirtyのまま
}

// ✅ 正しいエラークリア
#clearValidationError(): void {
  this.removeAttribute('error');
  this.removeAttribute('error-text');
  this._internals.setValidity({});  // 状態を明示的にクリア
}
```

**問題B: reportValidity()とネイティブinputの干渉**
```typescript
// ❌ ネイティブバリデーションが干渉
#handleFormAction() {
  if (form.reportValidity()) {  // ← Shadow DOM内の<input type="email">をチェック
    form.requestSubmit();
  }
}

// ✅ カスタムバリデーションに任せる
#handleFormAction() {
  form.requestSubmit();  // submitイベントでカスタムバリデーション実行
}
```

#### 3. 設計原則

| 原則 | 理由 |
|------|------|
| required属性を内部inputに転送しない | ネイティブバリデーション回避（aria-requiredで代替） |
| カスタムバリデーションはsubmitイベントで実行 | 一元管理、優先順位制御 |
| ボタンはrequestSubmit()を直接呼ぶ | reportValidity()の干渉を防ぐ |
| エラークリア時はsetValidity({})必須 | 次回submit時の再評価を保証 |

#### 4. バリデーション優先順位
```typescript
#handleFormSubmit = (e: Event): void => {
  // 1. required（必須）チェック - 最優先
  const isRequiredValid = this.#validateRequired();
  if (!isRequiredValid) {
    e.preventDefault();
    return;
  }

  // 2. typeMismatch（形式）チェック
  const isTypeMismatchValid = this.#validateTypeMismatch();
  if (!isTypeMismatchValid) {
    e.preventDefault();
  }
};
```

### 適用例
- `packages/components/input-text/input-text.ts` - バリデーション実装
- `packages/components/button/button.ts` - フォームアクション処理
- `packages/utils/validation.ts` - バリデーションルール定義

### 関連ADR
[ADR-002: Form-Associated Web Componentsのバリデーションアーキテクチャ](../adr/ADR-002-form-validation-architecture.md)

### 注意点
- `form.reportValidity()`はShadow DOM内のネイティブ要素もチェックする
- `_internals.setValidity({})`を呼ばないと次回submitがブロックされる可能性
- クリティカルなコンポーネント（送信ボタン等）は遅延ロードではなく即座にロード

---

## テンプレート（新しい学習記録用）

## [日付] タイトル
**タグ**: #tag1 #tag2

### 概要
簡潔な説明

### 詳細
- ポイント1
- ポイント2
- ポイント3

### 適用例
```typescript
// コード例
```

### 注意点
- 注意点1
- 注意点2

---

*継続的に更新されます*
