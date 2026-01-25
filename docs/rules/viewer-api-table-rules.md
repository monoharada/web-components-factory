# viewer.html API テーブル記述ルール

## 概要

`src/demos.ts` で定義するコンポーネントの API テーブル（CSS vars セクション）における Default カラムの表示形式を規定する。

## CSS vars テーブルの Default カラム表示ルール

### 1. グローバルトークン参照

デザイントークンを参照している場合：

```html
<td>
  <code>--token-name</code><br>
  <small style="color:#666">(実値)</small>
</td>
```

**例:**
| 変数 | 表示 |
|------|------|
| `--spacing-4` | `--spacing-4`<br>`(16px)` |
| `--color-neutral-solid-gray-600` | `--color-neutral-solid-gray-600`<br>`(#666)` |
| `--color-primitive-blue-900` | `--color-primitive-blue-900`<br>`(#1a4ccc)` |

### 2. リテラル値

直接値を指定している場合（トークン参照なし）：

```html
<td><code>1px</code></td>
```

**例:**
- `1px`
- `transparent`
- `0`

### 3. calc 計算値

`calc()` で計算している場合、rem 値と px 換算値を表示：

```html
<td>
  <code>1.5rem</code><br>
  <small style="color:#666">(24px)</small>
</td>
```

**例:**
| 元の定義 | 表示 |
|---------|------|
| `calc(24 / 16 * 1rem)` | `1.5rem`<br>`(24px)` |
| `calc(16 / 16 * 1rem)` | `1rem`<br>`(16px)` |

### 4. 複合値

複数の値を組み合わせている場合、展開した値を表示：

```html
<td><code>20px 40px 0 16px</code></td>
```

**例:**
- padding: `20px 40px 0 16px`
- margin: `0 auto`

### 5. rem 値

単純な rem 値の場合、px 換算を併記：

```html
<td>
  <code>8rem</code><br>
  <small style="color:#666">(128px)</small>
</td>
```

## 色値の省略形式

色のトークンで実値を表示する際は、以下の省略形式を使用：

| 完全形 | 省略形 |
|--------|--------|
| `#666666` | `#666` |
| `#ffffff` | `#fff` |
| `#000000` | `#000` |

6桁の HEX で省略可能な場合は 3桁に省略する。

## 実装例

```typescript
// demos.ts 内の CSS vars テーブル行
<tr>
  <th scope="row"><code>--dads-search-box-gap</code></th>
  <td><code>--spacing-4</code><br><small style="color:#666">(16px)</small></td>
  <td>
    <div class="wc-api-control">
      <dads-input-text
        label="--dads-search-box-gap"
        value=""
        data-api-css-var="--dads-search-box-gap"
        data-default=""
      ></dads-input-text>
    </div>
  </td>
  <td>fields と button の間隔</td>
</tr>
```

## トークン値の調査方法

1. コンポーネントの `*-tokens.ts` ファイルを確認
2. セマンティックトークン → グローバルトークンの参照関係を追跡
3. グローバルトークンの実値は `packages/styles/design-tokens/` を参照

## 関連ファイル

- `src/demos.ts` - デモ定義
- `packages/components/*/[component]-tokens.ts` - コンポーネントトークン
- `packages/styles/design-tokens/` - グローバルデザイントークン
