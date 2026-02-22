# Web Components Factory 拡張点ガイド

このドキュメントでは、コンポーネントが公開する拡張点（CSS Custom Properties, CSS Parts, Slots, Events）を使ったカスタマイズ方法を解説します。

## 拡張点の種類

| 種類 | 用途 | CEM フィールド |
|------|------|---------------|
| CSS Custom Properties | スタイルの外部カスタマイズ | `cssProperties` |
| CSS Parts (`::part()`) | Shadow DOM 内要素のスタイリング | `cssParts` |
| Slots | コンテンツの差し込み | `slots` |
| Events | 状態変化の通知 | `events` |

## CSS Custom Properties による公開トークン

### 命名規則

| プレフィックス | 分類 | 外部利用 |
|--------------|------|---------|
| `--dads-{component}-*` | **公開 API** | Yes（CEM に記載） |
| `--{component}-*` | 内部セマンティックトークン | No（変更は自己責任） |
| `--spacing-*`, `--color-*` | グローバルデザイントークン | 直接参照は非推奨 |

公開トークン（`--dads-*`）は Custom Elements Manifest の `cssProperties` に登録され、LLM ドキュメントやツールチェインから機械的に参照できます。

### 実装例: ボタンのカスタマイズ

```css
/* ボタンの基本スタイル変更 */
dads-button {
  --dads-button-background: #1a73e8;
  --dads-button-color: #ffffff;
  --dads-button-border-color: #1a73e8;
  --dads-button-border-radius: 9999px;
  --dads-button-font-weight: 600;
}

/* ホバー・アクティブ時のカスタマイズ */
dads-button {
  --dads-button-background-hover: #1557b0;
  --dads-button-background-active: #0d47a1;
}

/* サイズのカスタマイズ */
dads-button.large {
  --dads-button-padding: var(--spacing-4) var(--spacing-8);
  --dads-button-font-size: 1.125rem;
  --dads-button-min-height: 56px;
}
```

### 実装例: ダイアログのカスタマイズ

```css
/* ダイアログの外観変更 */
dads-dialog {
  --dads-dialog-background: var(--color-neutral-solid-gray-50);
  --dads-dialog-border-radius: 1rem;
  --dads-dialog-padding-inline: var(--spacing-8);
  --dads-dialog-padding-block: var(--spacing-8);
  --dads-dialog-backdrop-background: rgba(0, 0, 0, 0.5);
}

/* ダイアログ幅のカスタマイズ */
dads-dialog.narrow {
  --dads-dialog-width: 400px;
}
```

### 実装例: 入力フィールドのカスタマイズ

```css
/* 入力フィールドの外観変更 */
dads-input-text {
  --dads-input-background: var(--color-neutral-solid-gray-50);
  --dads-input-border-radius: 0.25rem;
  --dads-input-height: 40px;
  --dads-input-font-size: 0.875rem;
}

/* エラー時の色変更 */
dads-input-text[error] {
  --dads-input-border-color: var(--color-semantic-error-1);
  --dads-input-error-color: var(--color-semantic-error-1);
}
```

## CSS Parts (`::part()`) によるスタイリング

```css
/* ボタンのベース要素にカスタムスタイル */
dads-button::part(base) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}

dads-button::part(base):hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* アイコンスロットのカスタムスタイル */
dads-button::part(icon-start) {
  margin-inline-end: var(--spacing-2);
}
```

## 公開トークンの確認方法

### CEM から参照

```bash
# CEM を再生成
npm run cem:analyze

# コンポーネントの cssProperties を確認
node -e "
  const cem = require('./custom-elements.json');
  const decl = cem.modules
    .flatMap(m => m.declarations || [])
    .find(d => d.tagName === 'dads-button');
  console.table(decl.cssProperties);
"
```

### LLM ドキュメントから参照

```bash
# ドキュメント生成
npm run llms:generate

# 個別コンポーネントのドキュメント確認
cat docs/llms/button.md
```

## トークン設計の2層構造

各コンポーネントのトークンは2層で設計されています:

```
グローバルトークン        セマンティックトークン      ローカルトークン（公開）
--color-primary     →  --button-primary-bg    →  --dads-button-background
--spacing-3         →  --button-padding       →  --dads-button-padding
```

1. **グローバルトークン** (`--color-*`, `--spacing-*`): デザインシステム全体の値
2. **セマンティックトークン** (`--{component}-*`): 内部実装、意味的な名前
3. **ローカルトークン** (`--dads-{component}-*`): 公開 API、外部カスタマイズ用

外部からのカスタマイズには必ず **ローカルトークン**（`--dads-*`）を使用してください。
