# Card Component (`dads-card`)

DADS「カード」の構造を提供するWeb Componentsコンポーネント。

## 概要

カードは柔軟なレイアウトコンテナで、以下の3つの領域で構成されます：

- **Media**: 画像や動画などのメディア（任意）
- **Main**: タイトル、説明文などの主要コンテンツ
- **Sub**: ボタンやリンクなどの補助要素（任意）

## 基本的な使い方

```html
<dads-card>
  <img slot="media" src="image.jpg" alt="説明">
  <h2>タイトル</h2>
  <p>コンテンツの説明文</p>
  <div slot="sub">
    <button>アクション</button>
  </div>
</dads-card>
```

## レイアウト

### 縦レイアウト（デフォルト）

```html
<dads-card>
  <!-- Media → Main → Sub の順で縦に配置 -->
</dads-card>
```

### 横レイアウト

```html
<dads-card layout="horizontal">
  <!-- Mediaが左、Main/Subが右に配置 -->
</dads-card>
```

## クリック委譲（カード面クリック）

カード全体をクリック可能にするには、主リンクに `data-dads-card-primary` と `data-dads-card-delegate` を付与します。

```html
<dads-card>
  <h2>
    <a href="/detail" data-dads-card-primary data-dads-card-delegate>
      タイトル（クリックで遷移）
    </a>
  </h2>
  <p>カードのどこをクリックしてもリンクへ遷移します</p>
</dads-card>
```

**注意事項**:
- テキスト選択やカード内のボタン操作は阻害されません
- キーボード操作は主リンクへフォーカスして Enter で可能です

---

## カスタマイズ

### 設計思想: Token-Driven Customization

カードは`variant`属性を持ちません。CSSトークンと`::part()`で自由にカスタマイズできます。

### 方法1: CSSトークンの上書き

```css
dads-card {
  --dads-card-background: #f5f5f5;
  --dads-card-border-width: 2px;
  --dads-card-border-radius: 8px;
}
```

### 方法2: ::part()によるスタイリング

```css
dads-card::part(base) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

dads-card::part(media) {
  background: linear-gradient(45deg, #667eea, #764ba2);
}
```

---

## カスタマイズパターン例

### Elevatedスタイル（影付き）

```css
dads-card.elevated {
  --dads-card-border-width: 0;
  --dads-card-border-radius: var(--border-radius-16);
}

dads-card.elevated::part(base) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

### Borderedスタイル（枠線強調）

```css
dads-card.bordered {
  --dads-card-border-width: 2px;
  --dads-card-border-color: var(--color-neutral-solid-gray-600);
}
```

### Transparentスタイル（背景透明）

```css
dads-card.transparent {
  --dads-card-background: transparent;
  --dads-card-border-width: 0;
  --dads-card-divider-width: 0;
}
```

---

## 利用可能なCSS変数（トークン）

### Container

| トークン | デフォルト | 説明 |
|---------|-----------|------|
| `--dads-card-background` | `--color-neutral-white` | 背景色 |
| `--dads-card-border-color` | `--color-neutral-solid-gray-420` | ボーダー色 |
| `--dads-card-border-width` | `1px` | ボーダー幅 |
| `--dads-card-border-radius` | `--border-radius-16` | 角丸 |
| `--dads-card-divider-color` | `--color-neutral-solid-gray-420` | 区切り線色 |
| `--dads-card-divider-width` | `1px` | 区切り線幅 |

### Layout

| トークン | デフォルト | 説明 |
|---------|-----------|------|
| `--dads-card-media-width` | `352px` | 横レイアウト時のメディア幅 |
| `--dads-card-media-aspect-ratio` | `auto` | メディアのアスペクト比 |
| `--dads-card-padding-block` | `--spacing-4` | 上下パディング |
| `--dads-card-padding-inline` | `--spacing-6` | 左右パディング |
| `--dads-card-gap` | `--spacing-4` | エリア内の余白 |

### Typography - Title

| トークン | デフォルト | 説明 |
|---------|-----------|------|
| `--dads-card-title-color` | `--color-neutral-solid-gray-900` | タイトル文字色 |
| `--dads-card-title-font-size` | `--font-size-20` | タイトルサイズ |
| `--dads-card-title-font-weight` | `--font-weight-700` | タイトルウェイト |
| `--dads-card-title-line-height` | `1.5` | タイトル行高 |
| `--dads-card-title-letter-spacing` | `0.02em` | タイトル字間 |

### Typography - Content

| トークン | デフォルト | 説明 |
|---------|-----------|------|
| `--dads-card-content-color` | `--color-neutral-solid-gray-800` | コンテンツ文字色 |
| `--dads-card-content-font-size` | `--font-size-16` | コンテンツサイズ |
| `--dads-card-content-font-weight` | `--font-weight-400` | コンテンツウェイト |
| `--dads-card-content-line-height` | `1.7` | コンテンツ行高 |
| `--dads-card-content-letter-spacing` | `0.02em` | コンテンツ字間 |

---

## 利用可能なParts

| Part | 要素 | 用途 |
|------|------|------|
| `base` | `<article>` | カード全体のコンテナ |
| `media` | `<section>` | メディア領域 |
| `main` | `<section>` | メインコンテンツ領域 |
| `sub` | `<section>` | サブ領域 |

---

## 既知の課題と対処法

### overflow: clip問題

カード内のfocus ringやbox-shadowがクリップされる場合があります。

**対処法**:
```css
dads-card::part(base) {
  overflow: visible;
}
```

### ::slotted() margin問題

Light DOM要素の`margin`が`::slotted(*) { margin: 0 }`で上書きされます。

**対処法**: `margin`の代わりに`padding`を使用してください。

```html
<!-- NG: marginが効かない -->
<dads-card>
  <h2 style="margin-bottom: 16px;">タイトル</h2>
</dads-card>

<!-- OK: paddingを使用 -->
<dads-card>
  <h2 style="padding-bottom: 16px;">タイトル</h2>
</dads-card>
```

### タイトル内リンクのスタイリング

`::slotted()`は直接の子要素のみスタイル可能です。`h2`内の`a`タグは外部CSSでスタイルします。

```css
/* Light DOM側で指定 */
dads-card h2 a {
  color: inherit;
  text-decoration: underline;
}
```

---

## アクセシビリティ

- カード自体はフォーカス可能にしません
- キーボード操作は主リンクへフォーカスして Enter で遷移
- 見出しレベル（h1-h6）は文書構造に応じて適切に選択してください
- 画像には必ず`alt`属性を指定してください

---

## インタラクティブデモ

viewer.htmlで実際の動作を確認できます：

```bash
bun server.ts
# http://localhost:3000/?component=card
```

---

## 関連ドキュメント

- [DADS公式: カードコンポーネント](https://design.digital.go.jp/dads/components/card/)
- [learnings.md: カードコンポーネントの学習記録](../knowledge/learnings.md)
