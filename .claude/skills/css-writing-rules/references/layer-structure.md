# @layer Cascade Structure

## Layer Priority

低い → 高い の順（後のレイヤーが優先）：

| Layer | Purpose | Example |
|-------|---------|---------|
| `reset` | CSSリセット | normalize, kiso.css |
| `tokens` | グローバル変数 | `:root`の変数定義 |
| `base` | サイト全体の基本 | html, body, a, img |
| `layout` | ランドマーク | header, footer, nav |
| `components` | 再利用UIパーツ | buttons, cards, forms |
| `contents` | コンテンツ内余白 | 要素間のmargin |
| `page` | ページ固有 | about.css |
| `operational` | **一時的**上書き | ホットフィックス |

## Layer Declaration

HTMLで必ずレイヤー順序を宣言：

```css
@layer reset, tokens, base, layout, components, contents, page;
```

**重要**: すべてのスタイルは`@layer`内に記述。`@layer`外のスタイルは禁止。

## Shadow DOM Integration（Web Components）

**このプロジェクトはWeb Components中心のため、以下が重要。**

Shadow DOM内では`@layer`が使用できないため、スタイル配列の順序で詳細度を管理：

```typescript
styles: withReset([
  applyDADSTokens(),    // ≈ tokens layer
  componentTokens,       // ≈ component-specific tokens
  componentStyles,       // ≈ components layer
  applyDADSFocusStyles() // ≈ focus styles
], 'minimal')            // ≈ reset layer
```

順序が重要：後のスタイルが前のスタイルを上書き。

## File Organization

### 単一ファイル層

`src/assets/css/common/`に配置：
- `reset.css`
- `tokens.css`
- `base.css`
- `contents.css`

### 分割ファイル層

`src/assets/css/_import/`に個別ファイル：

```css
/* src/assets/css/_import/button.css */
@layer components {
  .button { /* ... */ }
}
```

PostCSSでインポート：
```css
/* src/assets/css/common/components.css */
@import '../_import/button.css';
@import '../_import/card.css';
```

### ページ固有・運用層

`src/assets/css/{page-name}/`に配置：
- `about.css`
- `about-operational.css`

## Usage Examples

### Components Layer

```css
@layer components {
  .card-group {
    display: grid;
    gap: var(--space-md);
  }
}
```

### Operational Layer

```css
@layer operational {
  /* 開発中の一時修正 - 本番前に削除必須 */
  .debug-outline { outline: 2px solid red; }
}
```

## Critical Rules

1. **すべてのCSSは`@layer`内**
   ```css
   /* NG: @layer外 */
   .button { color: blue; }

   /* OK */
   @layer components {
     .button { color: blue; }
   }
   ```

2. **1ファイル = 1コンポーネント**
   ```css
   /* NG: 複数コンポーネントを混在 */
   @layer components {
     .card { }
     .button { }  /* 別ファイルへ */
   }
   ```

3. **operational層は本番に含めない**
   - 一時的な修正のみ
   - PR前に適切なレイヤーへ移行
   - デプロイ前に削除確認
