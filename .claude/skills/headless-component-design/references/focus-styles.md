# フォーカススタイル

## DADS公式準拠

公式実装（GitHub: digital-go-jp/design-system-example-components）に基づく。

### 公式のTailwindクラス

```css
focus-visible:outline
focus-visible:outline-4
focus-visible:outline-black
focus-visible:outline-offset-[calc(2/16*1rem)]
focus-visible:ring-[calc(2/16*1rem)]
focus-visible:ring-yellow-300
```

### CSSに変換

```css
outline: .25rem solid #000000;
outline-offset: .125rem;
box-shadow: 0 0 0 .125rem #ffd43d;
```

## 重要な発見

**公式では `border-radius` はフォーカス時に変更されない**

これはボタン、テキストエリア、アコーディオン、すべてのコンポーネントに共通。

## フォーカストークン

```css
:host {
  /* セマンティック層 */
  --focus-outline-color: var(--color-neutral-black, #000000);
  --focus-outline-width: .25rem;
  --focus-outline-offset: .125rem;
  --focus-ring-color: var(--color-primitive-yellow-300, #ffd43d);
  --focus-ring-width: .125rem;
  --focus-text-element-bg: var(--color-primitive-yellow-300, #ffd43d);

  /* ローカル層（API） */
  --dads-focus-outline-color: var(--focus-outline-color);
  --dads-focus-outline-width: var(--focus-outline-width);
  --dads-focus-outline-offset: var(--focus-outline-offset);
  --dads-focus-ring-color: var(--focus-ring-color);
  --dads-focus-ring-width: var(--focus-ring-width);
  --dads-focus-text-element-bg: var(--focus-text-element-bg);
}
```

## 要素別フォーカススタイル

| 要素 | outline | box-shadow | background |
|---|---|---|---|
| solid/outlined ボタン | あり | 黄色リング | 変更なし |
| text ボタン | あり | 黄色リング | 黄色 |
| アコーディオン | あり | 黄色リング | 黄色 |
| textarea/input | あり | 黄色リング | 変更なし |

## 使用方法

```typescript
import { applyDADSFocusStyles } from '@/styles/mixins/focus-styles-official';

class MyComponent extends WebComponent {
  static definition = {
    styles: [
      componentTokens,
      componentStyles,
      applyDADSFocusStyles()  // フォーカススタイルを適用
    ]
  };
}
```

## オーバーライド例

```html
<style>
  /* フォーカスリングの色を変更 */
  dads-button {
    --dads-focus-ring-color: #ff0000;
  }

  /* アウトラインの幅を変更 */
  dads-textarea {
    --dads-focus-outline-width: .5rem;
  }
</style>
```

## 参照

- ファイル: `packages/styles/mixins/focus-styles-official.ts`
- 公式: https://github.com/digital-go-jp/design-system-example-components
