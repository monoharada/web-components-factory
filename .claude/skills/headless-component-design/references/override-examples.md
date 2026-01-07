# オーバーライド例

## パターン1: CSS変数でカスタマイズ

### ボタンのカスタマイズ

```html
<style>
  dads-button {
    /* 背景色を変更 */
    --dads-button-background: var(--my-brand-color);

    /* 角丸を変更 */
    --dads-button-border-radius: 0;

    /* フォーカスリングの色を変更 */
    --dads-focus-ring-color: var(--my-focus-color);
  }
</style>

<dads-button variant="solid">カスタムボタン</dads-button>
```

### テキストエリアのカスタマイズ

```html
<style>
  dads-textarea {
    /* ボーダー色を変更 */
    --dads-textarea-border-color: var(--my-border-color);

    /* 背景色を変更 */
    --dads-textarea-background: var(--my-bg-color);
  }
</style>

<dads-textarea label="カスタムテキストエリア"></dads-textarea>
```

## パターン2: ::part()でスタイリング

### 要素レベルのカスタマイズ

```html
<style>
  /* テキストエリアのフォントを変更 */
  dads-textarea::part(textarea) {
    font-family: monospace;
    letter-spacing: 0.05em;
  }

  /* ボタンのテキストを大文字に */
  dads-button::part(base) {
    text-transform: uppercase;
  }

  /* ラベルのスタイルを変更 */
  dads-textarea::part(label) {
    font-weight: 700;
  }
</style>
```

## パターン3: サービス全体のテーマ設定

### プリミティブトークンの上書き

```css
:root {
  /* ブランドカラーに変更 */
  --color-primitive-blue-900: #your-brand-blue;
  --color-primitive-blue-1000: #your-brand-blue-dark;

  /* フォーカス色を変更 */
  --color-primitive-yellow-300: #your-focus-color;
}
```

### セマンティックトークンの上書き

```css
:root {
  /* ボタンのプライマリ色を変更 */
  --button-primary-bg: var(--your-primary-color);
  --button-primary-bg-hover: var(--your-primary-color-dark);
}
```

## パターン4: コンポーネント単位のテーマ

### 特定のコンポーネントのみカスタマイズ

```html
<style>
  /* 特定のクラスを持つボタンのみ */
  dads-button.danger {
    --dads-button-background: var(--color-semantic-error-1);
    --dads-button-background-hover: #b91c1c;
  }

  /* 特定のセクション内のコンポーネント */
  .dark-section dads-button {
    --dads-button-background: #ffffff;
    --dads-button-color: #000000;
  }
</style>
```

## パターン5: 状態別のカスタマイズ

### ホバー・アクティブ状態

```html
<style>
  dads-button {
    /* ホバー時の背景色 */
    --dads-button-background-hover: var(--my-hover-color);

    /* アクティブ時の背景色 */
    --dads-button-background-active: var(--my-active-color);
  }
</style>
```

## 利用可能なCSS変数一覧

### ボタン

| 変数 | 説明 |
|------|------|
| `--dads-button-background` | 背景色 |
| `--dads-button-color` | テキスト色 |
| `--dads-button-border-color` | ボーダー色 |
| `--dads-button-border-radius` | 角丸 |
| `--dads-button-padding` | パディング |
| `--dads-button-font-size` | フォントサイズ |

### テキストエリア

| 変数 | 説明 |
|------|------|
| `--dads-textarea-background` | 背景色 |
| `--dads-textarea-color` | テキスト色 |
| `--dads-textarea-border-color` | ボーダー色 |
| `--dads-textarea-border-radius` | 角丸 |
| `--dads-textarea-padding` | パディング |

### フォーカス（共通）

| 変数 | 説明 |
|------|------|
| `--dads-focus-outline-color` | アウトライン色 |
| `--dads-focus-outline-width` | アウトライン幅 |
| `--dads-focus-outline-offset` | アウトラインオフセット |
| `--dads-focus-ring-color` | リング色 |
| `--dads-focus-ring-width` | リング幅 |
