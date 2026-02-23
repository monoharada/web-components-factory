# Progress Indicator Component - Design Document

**作成日**: 2026-02-23
**更新日**: 2026-02-23 (GPT-5.2レビュー反映 rev.2)
**ステータス**: 計画完了・実装待ち
**ブランチ**: `worktree-feat_progress_indicator_component`

---

## 1. Context

DADSデザインシステムのプログレスインジケーターコンポーネントを3分割で実装する。
DADSの公式ガイドラインは「準備中」のため、Figmaデザインデータ(v2.10.3)とWAI-ARIA仕様を根拠に設計した。

### Figma参照

| Page | URL |
|------|-----|
| Overview | https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/branch/e5LDmzUc7toyyDdxqXDw0G/Digital-Agency-Design-Data-2.10.3?node-id=9730-259&m=dev |
| Components | https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/branch/e5LDmzUc7toyyDdxqXDw0G/Digital-Agency-Design-Data-2.10.3?node-id=9730-267&m=dev |
| Examples | https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/branch/e5LDmzUc7toyyDdxqXDw0G/Digital-Agency-Design-Data-2.10.3?node-id=9730-306&m=dev |

- File key: `MlgRomC0DHXGlB0t79w4wL` / Branch key: `e5LDmzUc7toyyDdxqXDw0G`

### 調査チーム
| Agent | 役割 | 成果 |
|-------|------|------|
| Explore | 既存パターン分析 | ファイル構造・トークン・テストパターン特定 |
| Comprehensive Researcher | DADS仕様・ARIA・アニメーション調査 | ARIA progressbar仕様、CSS animation手法整理 |
| Codex Messenger | クロスバリデーション | `style`属性衝突の発見、`scaleX`推奨、`aria-busy`配置の指摘 |
| Figma MCP | デザイン詳細取得 | 全バリアントのCSS値・トークン・サイズ特定 |

---

## 2. Goal

3つの独立したWeb Componentsをリポジトリに追加し、DoD(Definition of Done)を満たす。
- Determinate（進捗率）モードは初期スコープに含む（Linear）
- WCAG 2.2 AA準拠
- `prefers-reduced-motion` 対応

---

## 3. Scope - 3コンポーネント

### 3.1 `dads-spinner`
| 項目 | 値 |
|------|-----|
| Tag | `dads-spinner` |
| 用途 | 円形回転アニメーション（indeterminate専用） |
| サイズ | `sm`(24px) / `lg`(48px, default) |
| ARIA | `role="progressbar"` (aria-valuenow省略=indeterminate) |
| アニメーション | SVG stroke-dasharray/dashoffset チェイスアニメーション |

### 3.2 `dads-progress-bar`
| 項目 | 値 |
|------|-----|
| Tag | `dads-progress-bar` |
| 用途 | 水平プログレスバー（determinate + indeterminate） |
| value | 0〜max の進捗値（未設定=indeterminate）。不正値(NaN/負値)は無視 |
| max | 最大値（default=1、ネイティブ`<progress>`準拠）。max<=0 は 1 にclamp |
| 高さ | 4px |
| ARIA | Determinate: `role="progressbar"` + `aria-valuenow`(0..100正規化) + `aria-valuemin="0"` + `aria-valuemax="100"` |
| | Indeterminate: `role="progressbar"` のみ（aria-valuenow/min/max すべて省略） |
| 更新方法 | `transform: scaleX()` (width不使用、GPU composited) |
| 値の正規化 | 内部: `clamp(0, value, max) / max` → CSS `--progress: 0..1`、ARIA: `Math.round(normalized * 100)` → `aria-valuenow` |

### 3.3 `dads-loading-icon`
| 項目 | 値 |
|------|-----|
| Tag | `dads-loading-icon` |
| 用途 | 砂時計アイコン（静的表示） |
| サイズ | `sm`(24px) / `lg`(48px, default) |
| ARIA | `dads-icon`パターン踏襲: label未指定時=`aria-hidden="true"`（SR読み上げ抑制）、label指定時=`role="img"` + `aria-labelledby`（SVG title要素経由） |

### 3.4 全コンポーネント共通属性
| 属性 | 型 | Default | 説明 |
|------|-----|---------|------|
| `composition` | `'stacked' \| 'inlined'` | `'stacked'` | レイアウト方向 |
| `underlay` | `boolean` | `false` | カード背景表示 |
| `label` | `@attr {string}` | `null` | 表示ラベル兼アクセシブル名（`dads-icon`パターン踏襲） |

#### label属性の仕様 (A-001解決)
- **`@attr {string} label`** に統一（slotは使用しない）
- Spinner/Progress-bar: `label`指定時に`[part="label"]`要素を表示し、`aria-label`としても設定
- Loading-icon: `dads-icon`と同一パターン — label未指定=`aria-hidden="true"`、指定時=`role="img"`+`aria-labelledby`
- 利用者が`aria-label`/`aria-labelledby`/`aria-describedby`をホスト要素に直接指定した場合、そちらを優先（属性委譲なし）

#### inlined composition のレイアウト仕様
| Property | Value |
|----------|-------|
| display | `inline-flex` |
| align-items | `center` |
| gap | `var(--spacing-2)` (8px) |
| label min-width | `0` (テキスト折返し・縮小許可) |
| white-space | `nowrap` (default) |

---

## 4. Figmaデザイン詳細

### 4.1 デザイントークン

| Figma Token | CSS Variable (公開API) | Semantic Source |
|-------------|----------------------|----------------|
| `color-primitive-blue-100` | `--dads-progress-track-color` | `var(--color-primitive-blue-100, #d9e6ff)` |
| `color-primitive-blue-1200` | `--dads-progress-indicator-color` | `var(--color-primitive-blue-1200, #000060)` |
| `color-neutral-solid-gray-900` | `--dads-progress-label-color` | `var(--color-neutral-solid-gray-900, #1a1a1a)` |
| `color-neutral-white` | `--dads-progress-underlay-bg` | `var(--color-neutral-white, white)` |
| `color-neutral-solid-gray-500` | `--dads-progress-underlay-border` | `var(--color-neutral-solid-gray-500, #7f7f7f)` |

### 4.2 レイアウト仕様

| 構成 | Direction | Gap | Alignment |
|------|-----------|-----|-----------|
| Stacked | flex-column | `--spacing-4` (16px) | center |
| Inlined | flex-row | (自動) | center |

| Underlay | 値 |
|----------|-----|
| min-width | 128px |
| min-height | 128px |
| border-radius | 12px |
| border | 1px solid `--color-neutral-solid-gray-500` |
| background | `--color-neutral-white` |

### 4.3 タイポグラフィ

| Property | Value |
|----------|-------|
| font-family | `var(--font-family-sans)` |
| font-size | `var(--font-size-16, 16px)` |
| font-weight | `var(--font-weight-400, 400)` |
| line-height | 1.7 |
| letter-spacing | 0.32px |
| color | `var(--color-neutral-solid-gray-900, #1a1a1a)` |

### 4.4 Spinner Building Block

| Property | Value |
|----------|-------|
| Large | 48x48px |
| Small | 24x24px |
| Structure | SVG circle: Background(track) + Border + Front(indicator) |
| Track color | `--color-primitive-blue-100` |
| Indicator color | `--color-primitive-blue-1200` |
| Stroke width | Track/Border: 1px, Front(indicator): 4px |

### 4.5 Linear Building Block

| Property | Value |
|----------|-------|
| Height | 4px |
| Long width | 240px (or 100%) |
| Short width | 80px |
| Track background | `--color-primitive-blue-100` |
| Indicator | `--color-primitive-blue-1200` |
| Border | 1px bottom line |

### 4.6 Static (Hourglass) Building Block

| Property | Value |
|----------|-------|
| Large | 48x48px |
| Small | 24x24px |
| SVG色 | `--color-primitive-blue-1200` |
| 構造 | 砂時計形状のパスSVG |

---

## 5. CSS Parts (per component)

| Component | Parts |
|-----------|-------|
| `dads-spinner` | `base`, `svg`, `track`, `indicator`, `label`, `underlay` |
| `dads-progress-bar` | `base`, `track`, `indicator`, `label`, `underlay` |
| `dads-loading-icon` | `base`, `icon`, `label`, `underlay` |

---

## 6. ARIA / Accessibility設計

### 6.1 Key Decisions

| 決定事項 | 実装 | 根拠 |
|---------|------|------|
| Indeterminate時のaria属性 | `aria-valuenow`/`aria-valuemin`/`aria-valuemax` **すべて省略** | ARIA APG仕様。値がないことが「不確定」を意味する |
| Determinate時のaria | `aria-valuenow`(0..100正規化) + `aria-valuemin="0"` + `aria-valuemax="100"` | 内部value/maxから正規化して出力 |
| aria-busy | **コンポーネント内に付けない** | 更新されるコンテナ側の責務。ドキュメントで案内 |
| Spinner | `role="progressbar"` + `aria-label` | 標準的なプログレス表示 |
| Loading Icon | label未指定=`aria-hidden="true"` / 指定時=`role="img"`+`aria-labelledby` | `dads-icon`パターン踏襲。SR読み上げノイズ回避 (A-005) |
| aria-live | **使用しない** | DADS方針準拠 |
| Status Messages | **本コンポーネントは status message を担わない**。必要時は利用側で`role="status"`等を設置 (A-006) |

### 6.2 WCAG対応

| Criterion | Level | Implementation |
|-----------|-------|----------------|
| 1.3.1 Info and Relationships | A | `role="progressbar"` with value attributes |
| 1.4.11 Non-text Contrast | AA | Indicator vs track >= 3:1 contrast ratio |
| 2.3.3 Animation from Interactions | AAA | `prefers-reduced-motion: reduce` で完全停止 (`animation: none`) |
| 4.1.2 Name, Role, Value | A | `role="progressbar"` + `aria-label` + value属性 |

> **Note (A-006)**: WCAG 4.1.3 Status Messages は本コンポーネントのスコープ外。進捗表示は 4.1.2 の領域。利用側で `role="status"` 等の設置を案内する。

### 6.3 Determinate ARIA (dads-progress-bar) (A-002解決)

```html
<!-- Determinate: value="0.45" max="1" → aria-valuenow="45" (0..100正規化) -->
<dads-progress-bar value="0.45" label="ファイルアップロード中"></dads-progress-bar>
<!-- 内部出力 ↓ -->
<div part="base" role="progressbar"
     aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"
     aria-label="ファイルアップロード中">
  <div part="track"><div part="indicator" style="--progress: 0.45"></div></div>
  <span part="label">ファイルアップロード中</span>
</div>

<!-- Indeterminate: value未設定 → aria-valuenow/min/max すべて省略 -->
<dads-progress-bar label="読み込み中"></dads-progress-bar>
<!-- 内部出力 ↓ -->
<div part="base" role="progressbar" aria-label="読み込み中">
  <div part="track"><div part="indicator"></div></div>
  <span part="label">読み込み中</span>
</div>
```

#### 値の正規化ルール
| 入力 | 処理 | CSS --progress | aria-valuenow |
|------|------|---------------|---------------|
| value="0.45" max="1" | 0.45/1 = 0.45 | 0.45 | 45 |
| value="3" max="10" | 3/10 = 0.3 | 0.3 | 30 |
| value="-1" | 不正値 → clamp(0) | 0 | 0 |
| value="2" max="1" | clamp(0, 2, 1) = 1 | 1 | 100 |
| value="abc" | NaN → indeterminate扱い | (animation) | (省略) |
| max="0" | max<=0 → 1にclamp | 正常計算 | 正常計算 |
| value未設定 | indeterminate | (animation) | (省略) |

### 6.4 aria-busy の使い方（ドキュメント案内用）

```html
<!-- コンポーネント利用者が自身で設定 -->
<div id="results" aria-busy="true">
  <dads-spinner label="検索中..."></dads-spinner>
</div>
```

---

## 7. Spinner Animation仕様

### 7.1 CSS Keyframes

```css
/* Container rotation: 2s linear infinite */
@keyframes spinner-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### 7.2 SVG Structure

```html
<svg viewBox="0 0 48 48" part="svg">
  <circle part="track" cx="24" cy="24" r="20"
          stroke-width="1" />
  <circle part="indicator" cx="24" cy="24" r="20"
          fill="none" stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="31.42 125.66" />
</svg>
```

- Circumference = 2 * pi * 20 = ~125.66
- Spinner = container rotate(2s linear) + fixed front arc

### 7.3 Linear Indeterminate Animation (A-007: transform-based に統一)

```css
/* transform-based: layout thrashing回避、GPU composited */
[part="indicator"] {
  position: absolute;
  inset: 0;
  transform-origin: left;
  will-change: transform;
}

@keyframes linear-indeterminate {
  0% {
    transform: translateX(-100%) scaleX(0.4);
  }
  50% {
    transform: translateX(0%) scaleX(0.6);
  }
  100% {
    transform: translateX(100%) scaleX(0.4);
  }
}
```

> **Note**: `left`/`width` ではなく `translateX`/`scaleX` を使用。Performance章 (8) との整合性を確保。

### 7.4 Reduced Motion (A-003: 完全停止に統一)

```css
@media (prefers-reduced-motion: reduce) {
  /* 全アニメーション完全停止 */

  /* Spinner: 静的な部分弧を表示 */
  [part="svg"] {
    animation: none;
  }
  [part="indicator"] {
    stroke-dasharray: 31.42 125.66;
  }

  /* Linear indeterminate: 静的な部分バーを表示 */
  [part="indicator"] {
    animation: none;
    transform: translateX(0) scaleX(0.6); /* 60%幅で静止 */
  }
}
```

> **方針**: `prefers-reduced-motion: reduce` では `animation: none` で完全停止。gentle-pulse も使用しない。ユーザーの「動きを止めたい」意図を尊重する。セレクタはコンポーネントごとにスコープ分割し衝突を回避。

---

### 7.5 Forced Colors (A-004)

```css
@media (forced-colors: active) {
  /* Spinner */
  [part="track"] {
    stroke: CanvasText;
  }
  [part="indicator"] {
    stroke: Highlight;
  }

  /* Linear */
  [part="track"] {
    background-color: CanvasText;
  }
  [part="indicator"] {
    background-color: Highlight;
  }

  /* Underlay */
  [part="underlay"] {
    border-color: CanvasText;
  }
}
```

> `divider-styles.ts` の `CanvasText` パターンに準拠。track=CanvasText、indicator=Highlight で明確なコントラストを確保。0%付近でもtrack境界線により要素が視認可能。

---

## 8. Performance Considerations (Codex指摘)

| 対策 | 理由 |
|------|------|
| `transform: scaleX()` for determinate | GPU composited、Layout Thrashing回避 |
| `contain: layout paint style` | 複数インスタンス時のリフロー防止 |
| `IntersectionObserver` for off-screen pause | 画面外のアニメーション停止（推奨・Phase2） |
| SVG stroke animation | CSS-only、JS不要、composited |

---

## 9. File Structure

```
packages/components/
├── spinner/
│   ├── spinner.ts
│   ├── spinner-tokens.ts
│   ├── spinner-styles.ts
│   ├── spinner-define.ts
│   ├── spinner.test.ts
│   └── index.ts
├── progress-bar/
│   ├── progress-bar.ts
│   ├── progress-bar-tokens.ts
│   ├── progress-bar-styles.ts
│   ├── progress-bar-define.ts
│   ├── progress-bar.test.ts
│   └── index.ts
└── loading-icon/
    ├── loading-icon.ts
    ├── loading-icon-tokens.ts
    ├── loading-icon-styles.ts
    ├── loading-icon-define.ts
    ├── loading-icon.test.ts
    └── index.ts

packages/autoload/dads/
├── spinner.ts
├── progress-bar.ts
└── loading-icon.ts
```

---

## 10. Implementation Order

### Phase 1: dads-spinner (最もシンプル、アニメーション検証)
1. `spinner.ts` - SVG template + size/composition/underlay/label attributes + JSDoc (@customElement, @tagname, @attr, @csspart, @cssprop)
2. `spinner-tokens.ts` - semantic → local tokens
3. `spinner-styles.ts` - animation keyframes + layout + forced-colors + reduced-motion
4. `spinner-define.ts` - registration (defineSpinner / defineDefaultSpinner)
5. `spinner.test.ts` - ARIA、属性、part存在確認、label有無でaria-label切替、indeterminate ARIA検証
6. `index.ts` - exports
7. `packages/autoload/dads/spinner.ts`
8. `packages/components/index.ts` に `export * from './spinner/index.js'` 追加 (A-010)
9. `src/demos.ts` - デモ関数追加 + Usage `<dads-code-block>` + API/Controlsテーブル (A-009)
10. `viewer.html` - セレクタオプション追加

### Phase 2: dads-progress-bar (determinate + indeterminate)
1. `progress-bar.ts` - value/max attributes + ARIA正規化(0..100) + 不正値clamp + JSDoc
2. `progress-bar-tokens.ts`
3. `progress-bar-styles.ts` - scaleX determinate + translateX/scaleX indeterminate + forced-colors + reduced-motion
4. `progress-bar-define.ts`
5. `progress-bar.test.ts` - determinate/indeterminate切替、値正規化テスト(NaN/負値/範囲外/max<=0)、ARIA出力検証
6. Autoload adapter
7. `packages/components/index.ts` に export 追加 (A-010)
8. `src/demos.ts` - デモ + Usage code block + API/Controlsテーブル (A-009)
9. `viewer.html` - セレクタ追加

### Phase 3: dads-loading-icon (最も簡単)
1. `loading-icon.ts` - hourglass inline SVG + label連動aria-hidden/role切替 (A-005) + JSDoc
2. `loading-icon-tokens.ts`
3. `loading-icon-styles.ts` + forced-colors
4. `loading-icon-define.ts`
5. `loading-icon.test.ts` - label有無でaria-hidden/role="img"切替テスト
6. Autoload adapter
7. `packages/components/index.ts` に export 追加 (A-010)
8. `src/demos.ts` - デモ + Usage code block + API/Controlsテーブル (A-009)
9. `viewer.html` - セレクタ追加

### Phase 4: Integration & DoD
1. `npm run cem:analyze` - CEM生成、`custom-elements.json` 差分コミット
2. `npm run contracts:check` - install contract
3. `npm run registry:check` - registry (`install-registry.json` 差分コミット)
4. `npm run validate:wc` - markup検証
5. `npm run type-check` - 型チェック
6. `npm run test:run` - 全テスト
7. `npm run ci` - CI pipeline
8. **`npm run agents:verify`** - PR前必須ガードレール (A-008)
9. PR作成

---

## 11. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| SVGアニメーションのブラウザ互換性 | 中 | 低 | stroke-dasharray/offsetは広くサポート。fallbackにCSS rotate |
| jsdomでのSVGテスト制限 | 中 | 高 | 属性・ARIA状態のcontractテストに集中。アニメーションE2Eはplaywright |
| `prefers-reduced-motion`テスト | 低 | 中 | CSS matchMedia mockで検証 |
| 3コンポーネントの管理コスト | 中 | 中 | 共通トークンファイルで一元管理、定型的な構造で統一 |
| Determinate更新パフォーマンス | 低 | 低 | `scaleX` + `contain: layout paint style` で対応 |
| DADS公式ガイドライン公開後の乖離 | 中 | 中 | Figma忠実+ARIA準拠により最小限の修正で対応可能 |
| `style`属性名衝突 (Codex発見) | 高 | - | **回避済み**: `type`/`variant`/`composition`等を使用 |

---

## 12. Verification

```bash
# Each component test
npm test -- packages/components/spinner/spinner.test.ts
npm test -- packages/components/progress-bar/progress-bar.test.ts
npm test -- packages/components/loading-icon/loading-icon.test.ts

# Full validation pipeline
npm run cem:analyze
npm run contracts:check
npm run registry:check
npm run validate:wc
npm run type-check
npm run test:run
npm run ci

# PR前必須ガードレール (A-008)
npm run agents:verify

# Visual verification
bun server.ts
# http://localhost:3000/?component=spinner
# http://localhost:3000/?component=progressBar
# http://localhost:3000/?component=loadingIcon
```

---

## 13. Key References (Reuse)

| Pattern | Source File |
|---------|------------|
| Component base class | `packages/core/typography/typography-web-component.ts` |
| Token pattern | `packages/components/icon/icon-tokens.ts` |
| Style pattern | `packages/components/divider/divider-styles.ts` |
| Define pattern | `packages/components/icon/icon-define.ts` |
| Test helpers | `test/utils/test-helpers.ts` |
| Demo pattern | `src/demos.ts` |
| Reset CSS | `packages/styles/reset-css.ts` → `withReset()` |
| Design tokens | `packages/styles/design-tokens/index.ts` → `applyDADSTokens()` |
| Spacing tokens | `packages/styles/spacing-tokens.ts` → `applySpacingTokens()` |
| DoD checklist | `docs/rules/new-component-dod.md` |
| Component skeleton | `docs/knowledge/component-skeleton.md` |
| CSS variable pattern | `docs/css-variable-pattern.md` |

---

## 14. Codex Cross-Validation Summary

### Essential Findings (設計に反映済み)
1. **`style`属性名衝突** → `composition`/`size`/`value` 等を使用
2. **複数コンポーネント推奨** → 3分割を採用
3. **aria-valuenow省略** → Indeterminate時は付けない
4. **aria-busy配置** → コンポーネント外（コンテナ側）の責務
5. **scaleX更新** → width不使用、GPU composited

### Useful Findings (実装時に参照)
- SVG `stroke-dasharray` + `stroke-dashoffset` が最も堅牢
- `IntersectionObserver` で画面外アニメ停止（Phase2推奨）
- `contain: layout paint style` で複数インスタンス最適化
- テスト二層分離: vitest(contract) + playwright(visual/animation)

---

## 15. GPT-5.2 Review Traceability (rev.2)

| Issue ID | Severity | Title | Resolution |
|----------|----------|-------|-----------|
| A-001 | HIGH | label APIがslotと属性で不整合 | `@attr {string} label` に統一 (3.4章) |
| A-002 | HIGH | value/maxとARIAスケール混在 | max=1, ARIA 0..100正規化 + clampルール (3.2, 6.3章) |
| A-003 | MEDIUM | reduced-motionで無限アニメ前提 | `animation: none` 完全停止 (7.4章) |
| A-004 | MEDIUM | forced-colorsと0%時視認性 | CanvasText/Highlight追加 (7.5章) |
| A-005 | HIGH | loading-iconのARIAが読み上げ過多 | dads-iconパターン: label未指定=aria-hidden (3.3, 6.1章) |
| A-006 | LOW | WCAG 4.1.3記述のぶれ | 4.1.3削除→4.1.2に修正、status message非対応を明記 (6.1, 6.2章) |
| A-007 | MEDIUM | linear indeterminateがleft/widthでパフォーマンス不整合 | translateX/scaleXに統一 (7.3章) |
| A-008 | MEDIUM | agents:verifyが手順にない | Phase 4 + Verification に追加 (10, 12章) |
| A-009 | MEDIUM | DoD Viewer要件がPlanに未展開 | Phase 1-3に Usage code block + API/Controls表を明記 (10章) |
| A-010 | MEDIUM | components/index.ts更新漏れ | Phase 1-3に export追加を明記 (10章) |
