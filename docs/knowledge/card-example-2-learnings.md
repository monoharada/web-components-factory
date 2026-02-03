# Card Example 2 実装からの学び

## 概要

DADS（デジタル庁デザインシステム）のカード作例2をWeb Components版で実装する際に得られた知見をまとめる。

**実装期間**: 2026-01-28〜29
**対象ファイル**: `src/demos/showcase-components.ts`
**参照元**: `resources/dads/components/card/upstream/design-system-example-components-html/`

---

## 1. Shadow DOM と overflow の落とし穴

### 問題

フォーカスリングがカードの境界でクリップされる。

```
┌─────────────────────┐
│  Card               │
│    ┌─────┐          │
│    │ Btn │←─────────── フォーカスリングがここで切れる
│    └─────┘          │
└─────────────────────┘
```

### 原因

`card-styles.ts` の `[part="base"]` に `overflow: clip` が設定されている。

```css
/* packages/components/card/card-styles.ts:27 */
[part="base"] {
  overflow: clip;  /* これがフォーカスリングをクリップする */
}
```

### 解決策

デモCSS側で `::part()` を使って上書きする。

```css
/* src/demos/showcase-components.ts */
dads-card.card-example-2::part(base) {
  overflow: visible;
}
```

### 教訓

| ポイント | 説明 |
|---------|------|
| `overflow: clip` の影響範囲 | 子要素のフォーカスリング、box-shadow、outline すべてに影響 |
| コンポーネント設計時の考慮 | overflow 設定は慎重に。フォーカス表示を考慮 |
| `::part()` の活用 | コンポーネントのデフォルト動作を外部から変更可能にする |

---

## 2. `::slotted(*)` によるマージンリセット

### 問題

Light DOM に配置した要素のマージンが効かない。

```html
<!-- Light DOM -->
<dads-card>
  <div class="divider" style="margin: 8px 0">...</div>  <!-- マージンが無視される -->
</dads-card>
```

### 原因

カードコンポーネントの Shadow DOM スタイルで全スロット要素のマージンをリセットしている。

```css
/* packages/components/card/card-styles.ts:86-88 */
[part="main"] ::slotted(*) {
  margin: 0;  /* すべてのスロット要素のマージンをリセット */
  min-width: 0;
}
```

### 解決策

マージンの代わりにパディングを使う。

```css
/* ❌ NG: マージンは ::slotted(*) でリセットされる */
.card-example-2__divider {
  margin-top: calc(8 / 16 * 1rem);
  margin-bottom: calc(8 / 16 * 1rem);
  border-top: 1px solid var(--color-neutral-solid-gray-536);
}

/* ✅ OK: パディングは影響を受けない */
.card-example-2__divider {
  padding-top: var(--spacing-2);
  padding-bottom: var(--spacing-2);
  border-top: 1px solid var(--color-neutral-solid-gray-536);
}
```

### 教訓

| ポイント | 説明 |
|---------|------|
| `::slotted(*)` の強制力 | Shadow DOM のスタイルは Light DOM より優先される |
| マージン vs パディング | スロット要素のスペーシングはパディングで実現 |
| コンポーネント設計 | `::slotted(*)` でリセットする項目は最小限に |

---

## 3. CSS簡素化のベストプラクティス

### 実績

| 指標 | Before | After | 削減率 |
|------|--------|-------|--------|
| CSS行数 | ~137行 | ~107行 | 22% |
| カスタム変数 | 8個 | 0個 | 100% |
| ハードコード calc() | 25箇所 | 0箇所 | 100% |

### パターン1: カスタム変数をデザイントークンに置換

```css
/* ❌ Before: カスタム変数を定義 */
:host {
  --card-example-2-row-gap: calc(16 / 16 * 1rem);
  --card-example-2-button-size: calc(44 / 16 * 1rem);
}

.card-example-2__main {
  row-gap: var(--card-example-2-row-gap);
}

/* ✅ After: デザイントークンを直接使用 */
.card-example-2__main {
  row-gap: var(--spacing-4);
}
```

### パターン2: calc() をスペーシングトークンに置換

```css
/* ❌ Before: ハードコードされた calc() */
padding: calc(16 / 16 * 1rem) calc(24 / 16 * 1rem);
gap: calc(16 / 16 * 1rem);
width: calc(44 / 16 * 1rem);

/* ✅ After: スペーシングトークン */
padding: var(--spacing-4) var(--spacing-6);
gap: var(--spacing-4);
width: var(--touch-target-min);  /* 44px = タッチターゲット最小サイズ */
```

### パターン3: セマンティックな意味を持つ値

```css
/* ❌ Before: 数値だけでは意図が不明 */
width: calc(44 / 16 * 1rem);
height: calc(44 / 16 * 1rem);

/* ✅ After: 意図が明確 */
width: var(--touch-target-min);   /* タッチターゲット最小サイズ */
height: var(--touch-target-min);
```

### 教訓

| ポイント | 説明 |
|---------|------|
| 中間変数は不要 | デザイントークンを直接使用すれば中間変数は不要 |
| セマンティックトークン | 数値でなく意味を持つトークン名を使う |
| 一貫性 | プロジェクト全体で同じトークンを使用 |

---

## 4. DADS公式との差異チェックリスト

### 発見された20の差異

カード作例2の実装で発見された差異一覧：

| # | カテゴリ | 項目 | 現在 | DADS公式 |
|---|---------|------|------|----------|
| 1 | ボタン | border | none | 1px solid transparent |
| 2 | ボタン | border-radius | 4px | 6px |
| 3 | ボタン | color | #333 | トークン |
| 4 | ボタン | ホバー背景 | gray-100 | gray-50 |
| 5 | ボタン | ホバー枠線 | なし | black |
| 6 | タイトル | letter-spacing | なし | 0.02em |
| 7 | タイトル | min-width | なし | 0 |
| 8 | リンク | display | inline-flex | flex |
| 9 | リンク | align-self | flex-end | なし |
| 10 | リンク | letter-spacing | なし | 0.02em |
| 11 | コンテナ | column-gap | なし | 16px |
| 12 | コンテナ | justify-content | flex-end | end |
| 13 | 全体 | transition | 200ms | なし |
| 14 | 全体 | transition | 200ms | なし |
| 15 | 本文 | min-width | なし | 0 |
| 16 | 本文 | margin | なし | 0 |
| 17 | カード | border-radius | 16px | 0 |
| 18 | カード | 画像右ボーダー | なし | 1px |
| 19 | 区切り線 | margin | 効かない | 8px 0 |
| 20 | フォーカス | overflow | clip | visible相当 |

### 調査方法

1. **HTMLソース比較**: DADS公式の `example-2.html` と実装を比較
2. **CSSソース比較**: `card-example-2.css` と実装を比較
3. **ブラウザ検証**: DevToolsで計算値を比較
4. **視覚的比較**: スクリーンショットの重ね合わせ

### 教訓

| ポイント | 説明 |
|---------|------|
| 細部まで確認 | letter-spacing、min-width など見落としやすい |
| トランジション | DADS公式にはトランジションがない場合が多い |
| 色の指定 | ハードコードでなくトークンを使用 |
| justify-content | `flex-end` と `end` は異なる（後方互換性） |

---

## 5. Web Components でのデモ実装パターン

### 推奨構造

```typescript
// showcase-components.ts

// 1. トークン・スタイルの取得
import { applyDADSTokens } from '../packages/styles/design-tokens/index.js';
import { applySpacingTokens } from '../packages/styles/spacing-tokens.js';

// 2. デモ固有スタイル
const demoStyles = css`
  /* コンポーネントのデフォルトを上書き */
  dads-card.card-example-2::part(base) {
    overflow: visible;
  }

  /* デモ固有のレイアウト */
  .card-example-2-list {
    display: grid;
    gap: var(--spacing-6);
  }
`;

// 3. HTML構造
const cardExample2Demo = {
  name: 'card-example-2',
  html: `
    <ul class="card-example-2-list">
      <li>
        <dads-card class="card-example-2" layout="horizontal">
          <!-- Light DOM でコンテンツを配置 -->
        </dads-card>
      </li>
    </ul>
  `,
  styles: [applyDADSTokens(), applySpacingTokens(), demoStyles]
};
```

### ベストプラクティス

| ポイント | 説明 |
|---------|------|
| トークンの注入 | デモでも必ずデザイントークンを使用 |
| `::part()` による上書き | コンポーネントのデフォルトを変更する場合 |
| Light DOM の活用 | 柔軟なマークアップのため |
| 属性での制御 | `layout="horizontal"` などコンポーネントAPIを活用 |

---

## 6. よくある間違いと対策

### 間違い1: コンポーネント内部を直接変更

```css
/* ❌ NG: Shadow DOM 内部は外部CSSでアクセス不可 */
dads-card [part="base"] {
  overflow: visible;
}

/* ✅ OK: ::part() を使用 */
dads-card::part(base) {
  overflow: visible;
}
```

### 間違い2: マージンに依存したスペーシング

```css
/* ❌ NG: ::slotted(*) でリセットされる可能性 */
.slotted-element {
  margin-bottom: 16px;
}

/* ✅ OK: パディングまたは親要素の gap を使用 */
.slotted-element {
  padding-bottom: var(--spacing-4);
}
/* または親で */
[part="main"] {
  gap: var(--spacing-4);
}
```

### 間違い3: ハードコード値の使用

```css
/* ❌ NG: ハードコード */
padding: 16px 24px;
color: #1a1a1c;

/* ✅ OK: トークン使用 */
padding: var(--spacing-4) var(--spacing-6);
color: var(--color-neutral-solid-gray-900);
```

### 間違い4: 独自トランジションの追加

```css
/* ❌ NG: DADS公式にないトランジション */
.button {
  transition: background-color 200ms ease;
}

/* ✅ OK: DADS公式に準拠（トランジションなし） */
.button {
  /* transition なし */
}
```

---

## 7. チェックリスト

### 実装前

- [ ] DADS公式のHTMLソースを確認
- [ ] DADS公式のCSSソースを確認
- [ ] 使用するデザイントークンを特定
- [ ] コンポーネントのデフォルト設定を確認

### 実装中

- [ ] ハードコード値を避ける
- [ ] `::part()` で上書きが必要な箇所を特定
- [ ] `::slotted(*)` の影響を考慮
- [ ] フォーカス表示を確認

### 実装後

- [ ] DADS公式との視覚的比較
- [ ] DevToolsで計算値を確認
- [ ] キーボード操作でフォーカス確認
- [ ] 各ブラウザでの表示確認

---

## 参考リンク

- [DADS Card Storybook](resources/dads/components/card/)
- [CSS Variable Pattern](docs/css-variable-pattern.md)
- [Spacing Tokens](packages/styles/spacing-tokens.ts)
- [Card Component](packages/components/card/)

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-29 | 初版作成（Card Example 2実装からの学び） |
