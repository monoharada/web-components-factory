# Figma Export Pipeline - Web Components to Figma Design

## Overview

Web Components (Shadow DOM) を Figma デザインとして取り込むためのパイプライン。
Shadow DOM → Light DOM フラット化 → インラインスタイル → Figma HTML-to-Design 変換 の流れで動作する。

## Architecture

```
fixture.html (Web Component + CSS)
    ↓ bun server.ts (localhost:3456)
    ↓
Playwright (headless Chromium)
    ↓ page.evaluate() で export 関数を呼び出し
    ↓
flattenElementToLightDom()        ← packages/figma-export/flatten.ts
    ↓ Shadow DOM 展開 + getComputedStyle() 全プロパティインライン化
    ↓
postProcessForFigma()              ← packages/figma-export/figma-post-process.ts
    ↓ Figma 非対応 CSS → 代替 DOM 要素に変換
    ↓
tmp/figma/*.export.html            ← 出力
    ↓ Figma MCP / HTML-to-Design プラグイン
    ↓
Figma Frame (絶対配置)
```

### File Map

| ファイル | 役割 |
|---------|------|
| `figma-export/button.html` | Button fixture HTML |
| `figma-export/button.ts` | Button export script (`__WCF_EXPORT_BUTTON__`) |
| `figma-export/card.html` | Card 作例3 fixture HTML |
| `figma-export/card.ts` | Card export script (`__WCF_EXPORT_CARD__`) |
| `packages/figma-export/flatten.ts` | Shadow DOM → Light DOM 変換 |
| `packages/figma-export/figma-post-process.ts` | Figma 向け後処理 |
| `scripts/figma/export-shared.mjs` | Playwright export 共通ユーティリティ（サーバ起動/Chromium探索） |
| `scripts/figma/export-button.mjs` | Playwright button export |
| `scripts/figma/export-card.mjs` | Playwright card export |

## Figma HTML-to-Design の CSS 互換性

### 確実に変換される CSS プロパティ

| プロパティ | Figma 変換結果 |
|-----------|---------------|
| `background-color` | Fill |
| `color` | Text fill |
| `width` / `height` | Frame size |
| `padding` | Padding (auto layout) |
| `border-radius` | Corner radius |
| `border` | Stroke |
| `font-size`, `font-weight`, `line-height` | Text style |
| `display: flex` / `grid` | Auto layout (部分的) |
| `gap` | Item spacing |
| `opacity` | Layer opacity |

### 変換されない CSS プロパティ (要回避策)

| プロパティ | 症状 | 回避策 |
|-----------|------|--------|
| `text-decoration: underline` | 下線が表示されない | 新規 `<div>` (background-color + height: 1px) で再現 |
| `outline` | フォーカスリングが表示されない | ラッパー `<div>` (background-color + padding) で再現 |
| `box-shadow` (spread-only, `0 0 0 Npx`) | 影が表示されない | ラッパー `<div>` (background-color + padding) で再現 |
| `text-decoration-*` (longhand) | 同上 | shorthand でも longhand でもダメ |

### 重要な制約

| 制約 | 詳細 |
|------|------|
| **絶対配置** | HTML-to-Design はブラウザの視覚レンダリング位置をそのまま Figma フレームの座標に変換する。auto layout ではなく絶対配置になる |
| **テキスト幅の差異** | CJK テキストの描画幅がブラウザと Figma で異なる。ブラウザで1行に収まるテキストが Figma では2行になる場合がある |
| **localhost URL** | 画像の `src` が localhost 相対パスだと Figma が解決できない。data URI に変換が必要 |
| **インラインスタイルの height** | height を除去しても HTML-to-Design はブラウザの描画結果から位置を決定するため、フレーム高さは変わらない |

## 回避策の実装詳細

### 1. text-decoration: underline → background-color div

```
Before: <span style="text-decoration: underline rgb(255,255,255); ...">テキスト</span>

After:  <span style="text-decoration: none; ...">
          テキスト
          <div data-figma-underline style="background-color: rgb(255,255,255); height: 1px; width: 100%; margin-top: 2px"></div>
        </span>
```

**設計判断**: 既存要素の `border-bottom` ではなく新規 div を使う理由:
- 計算済みスタイルが ~250 プロパティある既存要素に `border-bottom` を追加すると、Figma パーサーが競合するプロパティを正しく解決できない
- 最小限のスタイル (3-4個) だけを持つ新規要素なら確実に変換される

### 2. outline + box-shadow → ラッパー div のフォーカスリング

```
Before: <button style="outline: rgb(0,0,0) solid 4px; outline-offset: 2px;
                        box-shadow: rgb(255,212,61) 0px 0px 0px 2px; ...">

After:  <div data-figma-ring="outer" style="background-color: rgb(0,0,0); padding: 4px; border-radius: 22px;">
          <div data-figma-ring="inner" style="background-color: rgb(255,212,61); padding: 2px; border-radius: 18px;">
            <div data-figma-ring="gap" style="background-color: transparent; padding: 2px; border-radius: 16px;">
              <button style="outline: none; box-shadow: none; ...">
            </div>
          </div>
        </div>
```

**3層構造の意味**:
- outer: `outline-color` + `outline-width` を再現
- inner: `box-shadow` の spread 色 + spread 幅を再現
- gap: `outline-offset` を透明な padding で再現

### 3. 画像の data URI 変換

```typescript
// flatten の前に呼び出す（ブラウザコンテキスト必須）
convertImagesToDataUri(target);
```

- canvas 経由で `<img>` を base64 data URI に変換
- CORS エラーは無視（画像が取れないだけ）
- 既に data URI の場合はスキップ
- Playwright export script 側で画像の読み込み完了を待ってから呼び出す

### 4. height 除去（テキストオーバーフロー防止）

```typescript
relaxFixedHeights(el);
```

- `height`, `block-size`, `min-height`, `min-block-size`, `max-height`, `max-block-size` を全除去
- replaced 要素（`img`, `svg`, `video` 等）はスキップ
- Figma 後処理要素（`data-figma-ring`, `data-figma-underline`）もスキップ

**注意**: height 除去だけではテキスト重なりは解消しない場合がある（次セクション参照）

## Lessons Learned

### テキスト重なり問題の根本原因と対策

**問題**: カード内の見出し「郵送する際のポイント」がブラウザでは1行（幅 ~188px）だが、Figma では2行に折り返される（Figma のテキストレンダリング幅が異なるため）。固定高さの30pxフレーム内で60px分のテキストが溢れる。

**失敗した対策**:
1. `height` → `min-height` 変換: Figma は絶対配置なので min-height で親が拡張されても兄弟要素の位置は変わらない
2. `height` 完全除去: HTML-to-Design がブラウザの描画結果から位置を決定するため、インラインスタイルの height を消しても効果なし

**成功した対策**: fixture CSS で見出しコンテナに `flex: 1` を追加し、ブラウザ上でのテキスト描画幅を ~188px → ~224px に拡大。余裕のある幅にすれば Figma でも1行に収まる。

**Rule**: Figma エクスポート用の fixture CSS では、テキストコンテナに十分な幅を確保する。CJK テキストは Figma で ~10-15% 広い幅が必要と見積もる。

### 新規 DOM 要素 vs 既存要素のスタイル変更

**Rule**: Figma HTML-to-Design で変換されない CSS を代替する場合、既存要素のスタイル変更ではなく、最小限のスタイルを持つ新規 DOM 要素を挿入する。

**理由**: `getComputedStyle()` でインライン化された要素は ~250 プロパティを持ち、新規プロパティを追加しても Figma パーサーが競合を正しく解決できない。3-4個のプロパティだけの新規要素なら確実に変換される。

### Export script の画像待機

**Rule**: 画像を含むコンポーネントでは、Playwright export script に画像の読み込み完了待機を追加する。

```javascript
await page.waitForFunction(() => {
  const imgs = document.querySelectorAll('#target img');
  for (const img of imgs) {
    if (!img.complete || img.naturalWidth === 0) return false;
  }
  return imgs.length > 0;
}, { timeout: 15000 });
```

### Autoload パスの確認

**Rule**: fixture HTML の import パスは `packages/autoload/dads/` の実際のファイル名と一致させる。`card-define.js` のような推測パスを使わない。

```javascript
// 実際のファイルを確認してからパスを決定
// packages/autoload/dads/card.ts が存在する場合:
import '/@components/dads/card.js';
```

## コンポーネント追加手順

新しいコンポーネントを Figma Export パイプラインに追加する手順:

1. **fixture HTML 作成**: `figma-export/<component>.html`
   - DADS 公式作例を元にマークアップ
   - `<script type="module">` で autoload と fixture script を読み込む
   - テキスト重なり防止のため十分な幅を確保する CSS を記述

2. **export script 作成**: `figma-export/<component>.ts`
   - `window.__WCF_EXPORT_<NAME>__` 関数を提供
   - 画像があれば `convertImagesToDataUri()` を先に呼ぶ
   - `flattenElementToLightDom()` → `postProcessForFigma()` → wrapper div

3. **Playwright script 作成**: `scripts/figma/export-<component>.mjs`
   - `export-button.mjs` をテンプレートとして使用
   - サーバ起動/Chromium探索は `scripts/figma/export-shared.mjs` を利用して重複を避ける
   - 状態キャプチャ（default/hover/focus-visible/active）をコンポーネントに応じて設定
   - 画像待機を含める

4. **npm script 追加**: `package.json`
   ```json
   "figma:export:<component>": "node scripts/figma/export-<component>.mjs"
   ```

5. **実行と検証**:
   ```bash
   npm run figma:export:<component>
   # → tmp/figma/dads-<component>.export.html
   # Figma MCP で capture → get_screenshot で確認
   ```
