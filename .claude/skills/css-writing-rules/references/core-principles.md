# Core CSS Principles

## Fundamental Philosophy

### CSS優先順位
画像・アセットの代替としてCSSを優先：

1. **CSS only** - 最優先
2. **SVG files** - ベクター図形
3. **Image formats** - WebP, AVIF, PNG
4. **Web fonts** - 最後の手段

チェブロン、三角形、矢印などはCSSで実装。

### 論理プロパティ優先

方向に依存しない論理プロパティを使用：

```css
/* OK: 論理プロパティ */
margin-inline: 1rem;
padding-block-start: 2rem;
inset: 0;

/* NG: 物理プロパティ */
margin-left: 1rem;
margin-right: 1rem;
padding-top: 2rem;
```

### 省略プロパティの制限

以下のみ省略形を許可：
- `border`, `outline`
- `padding`, `margin`（対称値の場合のみ）

```css
/* OK */
padding-inline: 1rem;
padding-block: 0.5rem;

/* NG: 不要な省略形 */
padding: 0.5rem 1rem;
```

## Absolutely Prohibited

### 1. !important

```css
/* 絶対禁止 */
color: red !important;
```

代替: `@layer`で詳細度を管理

**唯一の例外**: `prefers-reduced-motion` 対応
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. カラーキーワード・ハードコード色値

```css
/* NG: カラーキーワード */
color: black;
background: white;

/* NG: ハードコード値（コンポーネント内） */
color: #000000;
--dads-button-color: #000000;

/* OK: グローバルトークン参照 */
color: var(--color-neutral-black);
--dads-button-color: var(--color-neutral-black);
```

**Note**: プリミティブトークン定義内（`:root`）では HEX/RGB/HSL を使用する。

### 3. html font-size: 62.5%

```css
/* 絶対禁止 - ユーザー設定を破壊 */
html { font-size: 62.5%; }
```

ユーザーエージェントのデフォルトを尊重すること。

### 4. 無秩序なショートハンド

```css
/* NG: 暗黙的なリセット */
background: blue;  /* background-imageなども暗黙的にリセット */

/* OK: 明示的 */
background-color: blue;
```

## Required Tools

### Stylelint

プロパティ順序と構文を強制：

```bash
# 設定ファイル
monosus/lint-tools/.stylelintrc.json
```

例外が必要な場合：
```css
/* stylelint-disable-next-line declaration-no-important */
#legacy-id { color: pink !important; }
```

### Formatter

**Biome推奨**（速度優先）、Prettierも可

## Output Quality Checklist

- [ ] `!important`未使用（`prefers-reduced-motion`例外のみ）
- [ ] 論理プロパティを使用
- [ ] カラーキーワード未使用
- [ ] ハードコード色値未使用（グローバルトークン参照）
- [ ] `html { font-size: 62.5% }`未使用
- [ ] 省略プロパティは制限された用途のみ
- [ ] Stylelint準拠
