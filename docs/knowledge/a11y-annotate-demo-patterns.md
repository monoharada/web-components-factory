# a11y-annotate デモ実装パターン

## 概要

a11y-annotate（アクセシビリティ注釈）コンポーネントをデモページに実装する際のベストプラクティスとレイアウトパターンをまとめたドキュメント。

## 基本構成

### 1. トグル機能の実装

全デモで `src/demos/shared.ts` の共通ヘルパーを使い、コールアウトマーカーのON/OFF切り替えを提供する。

```ts
${renderAnnotationToggleBlock()}
```

`renderAnnotationToggleBlock()` は `annotationToggleUI()` + `annotationToggleScript()` の互換ラッパー。

**重要**:
- 公開APIの `mode` 属性で切り替え（内部パーツに依存しない）
- 右側のパネルは常時表示される
- デフォルトで `checked` （表示状態）

**`mode` 属性の仕様**:

| 値 | 動作 |
|---|------|
| `both`（デフォルト）| パネル + コールアウトマーカー表示 |
| `panel` | パネルのみ表示（コールアウト非表示） |
| `callouts` | コールアウトマーカーのみ表示 |

### 2. アクセシビリティ注釈セクション

#### 基本パターン（ボタン等の小さい要素）

```html
<section style="margin-bottom: 40px;">
  ${renderA11ySectionHeader()}
  <a11y-annotate target-selector="dads-button">
    <div style="display: grid; place-content: center; padding: 60px 0;">
      <dads-button variant="solid" size="medium">ボタンテキスト</dads-button>
    </div>
  </a11y-annotate>
</section>
```

#### フォーム要素パターン（textarea・input-text等の横幅制御が必要な要素）

```html
<section style="margin-bottom: 40px;">
  ${renderA11ySectionHeader()}
  <a11y-annotate target-selector="dads-textarea">
    <div style="display: grid; place-content: center; padding: 60px 0;">
      <dads-textarea
        label="お問い合わせ内容"
        support-text="500文字以内で入力してください"
        required
        show-counter
        maxlength="500"
        rows="3"
        style="width: 500px;"
      ></dads-textarea>
    </div>
  </a11y-annotate>
</section>
```

**ポイント**:
- `a11y-annotate` が横幅いっぱいに広がる
- その内側に `<div style="display: grid; place-content: center; padding: 60px 0;">` でコンポーネントを中央揃え（推奨）
- `padding: 60px 0;` でコールアウトマーカーが枠線からはみ出さないようにする（必須）
- コンポーネント自体に `style="width: 500px;"` を適用（固定幅で横幅制御）
- a11y-annotateが横幅いっぱいに広がることで、右側のパネルが適切に表示される
- gridレイアウトにより縦横両方向で中央配置され、コールアウトマーカーが枠内に収まる

#### 横幅いっぱいパターン（accordion・blockquote等のfill型コンポーネント）

```html
<section style="margin-bottom: 40px;">
  ${renderA11ySectionHeader()}
  <a11y-annotate target-selector="dads-accordion-details">
    <div style="padding: 60px 0;">
      <dads-accordion-details>
        <dads-accordion-item-details expanded>
          <span slot="header">アコーディオンヘッダー</span>
          <div slot="content">
            <p>アコーディオンのコンテンツ内容です。</p>
          </div>
        </dads-accordion-item-details>
      </dads-accordion-details>
    </div>
  </a11y-annotate>
</section>
```

**ポイント**:
- accordion・blockquote等のコンテナ幅いっぱいに広がるべきコンポーネント用パターン
- `display: grid; place-content: center;` を**使用しない**（中央揃えしない）
- `padding: 60px 0;` のみを適用（コールアウトマーカーが枠線からはみ出さないように）
- コンポーネントに`width`スタイルを**適用しない**（自然な幅で表示）
- コンポーネントがコンテナ幅いっぱいに広がり、自然なレイアウトを維持
- 右側のパネル領域は適切に確保される

## レイアウト原則

### 1. 横幅制御の方針

#### パターンA: 中央揃え型（button, textarea, input-text等）

| 要素 | 適用箇所 | 理由 |
|------|----------|------|
| **a11y-annotate** | `<a11y-annotate>` | 横幅いっぱいに広がる（パネル表示領域確保） |
| **中央揃えコンテナ** | `<div style="display: grid; place-content: center; padding: 60px 0;">` | コンポーネントを中央に配置（推奨） |
| **パディング** | `padding: 60px 0;` | コールアウトマーカーが枠線からはみ出さないようにする（必須） |
| **コンポーネント** | `<dads-textarea style="width: 500px;">` | コンポーネント自体の幅を固定 |

**推奨レイアウト**: `display: grid; place-content: center; padding: 60px 0;`
- 縦横両方向で完全な中央配置
- `padding: 60px 0;` でコールアウトマーカーが枠線からはみ出さない（必須）
- `display: flex; justify-content: center;` より視覚的に安定

#### パターンB: 横幅いっぱい型（accordion・blockquote等のfill型コンポーネント）

| 要素 | 適用箇所 | 理由 |
|------|----------|------|
| **a11y-annotate** | `<a11y-annotate>` | 横幅いっぱいに広がる（パネル表示領域確保） |
| **パディングコンテナ** | `<div style="padding: 60px 0;">` | 上下のパディングのみ（中央揃えなし） |
| **パディング** | `padding: 60px 0;` | コールアウトマーカーが枠線からはみ出さないようにする（必須） |
| **コンポーネント** | `<dads-accordion-details>` | 幅制限なし（自然な幅で表示） |

**推奨レイアウト**: `padding: 60px 0;` のみ
- コンポーネントがコンテナ幅いっぱいに広がる
- `display: grid; place-content: center;` を**使用しない**
- コンポーネント自体に`width`スタイルを**適用しない**
- accordion・blockquote等のfill型コンポーネントの自然なレイアウトを維持

**NG例**:
```html
<!-- ❌ a11y-annotateの外側にmax-widthを適用すると右側が空いてしまう -->
<div style="max-width: 500px;">
  <a11y-annotate>
    <dads-textarea ...></dads-textarea>
  </a11y-annotate>
</div>

<!-- ❌ a11y-annotateが中央揃えコンテナの中にあるとパネルが表示されない -->
<div style="display: flex; justify-content: center;">
  <a11y-annotate>
    <dads-textarea style="max-width: 500px;" ...></dads-textarea>
  </a11y-annotate>
</div>

<!-- ❌ コンポーネントが左寄せでコールアウトマーカーがはみ出す -->
<a11y-annotate>
  <dads-button>ボタン</dads-button>
</a11y-annotate>

<!-- ❌ パディングがないとコールアウトマーカーが枠線からはみ出す -->
<a11y-annotate>
  <div style="display: grid; place-content: center;">
    <dads-button>ボタン</dads-button>
  </div>
</a11y-annotate>
```

**OK例**:
```html
<!-- ✅ パターンA: 中央揃え型 - gridで中央揃え + padding（縦横完全センタリング） -->
<a11y-annotate target-selector="dads-textarea">
  <div style="display: grid; place-content: center; padding: 60px 0;">
    <dads-textarea style="width: 500px;" rows="3" ...></dads-textarea>
  </div>
</a11y-annotate>

<!-- ✅ パターンA: 小要素（button）もgridで中央揃え + padding -->
<a11y-annotate target-selector="dads-button">
  <div style="display: grid; place-content: center; padding: 60px 0;">
    <dads-button variant="solid">ボタンテキスト</dads-button>
  </div>
</a11y-annotate>

<!-- ✅ パターンB: blockquoteはpaddingのみ（中央揃えなし） -->
<a11y-annotate target-selector="dads-blockquote">
  <div style="padding: 60px 0;">
    <dads-blockquote>
      <p>引用テキスト</p>
    </dads-blockquote>
  </div>
</a11y-annotate>

<!-- ✅ パターンB: 横幅いっぱい型 - paddingのみ（中央揃えなし） -->
<a11y-annotate target-selector="dads-accordion-details">
  <div style="padding: 60px 0;">
    <dads-accordion-details>
      <dads-accordion-item-details expanded>
        <span slot="header">ヘッダー</span>
        <div slot="content">コンテンツ</div>
      </dads-accordion-item-details>
    </dads-accordion-details>
  </div>
</a11y-annotate>
```

### 2. 中央揃えの効果（grid + padding推奨）

- コンポーネントが画面中央に配置される（縦横両方向）
- `padding: 60px 0;` でコールアウトマーカーが枠線からはみ出さない（必須）
- 左右のコールアウトマーカーが均等に表示され、枠内に収まる
- 右側のパネル領域が確保される
- 注釈が見やすくなる
- gridの`place-content: center`により、flexboxより視覚的に安定した配置

## コンポーネント別の適用状況

| コンポーネント | a11yAnnotations（CEM） | トグル | レイアウトタイプ | 中央揃え (grid) | padding | 備考 |
|---------------|-----------------|--------|-----------------|----------------|---------|------|
| checkbox | ✅ 既存 | ✅ | パターンA | ✅ | ✅ 60px | fieldset内で表示、width: 520px |
| fieldset | ✅ 既存 | ✅ | パターンA | ✅ | ✅ 60px | checkbox含む、width: 500px |
| accordion | ✅ 既存 | ✅ | **パターンB** | ❌ | ✅ 60px | details/summary、横幅いっぱい |
| switch | ✅ 既存 | ✅ | - | - | - | 参考実装 |
| blockquote | ✅ 新規 | ✅ | **パターンB** | ❌ | ✅ 60px | width指定なし（横幅いっぱい） |
| button | ✅ 新規 | ✅ | パターンA | ✅ | ✅ 60px | 自動サイズ |
| textarea | ✅ 新規 | ✅ | パターンA | ✅ | ✅ 60px | width: 500px, rows: 3 |
| inputText | ✅ 新規 | ✅ | パターンA | ✅ | ✅ 60px | width: 500px |

## 実装チェックリスト

新しいコンポーネントにa11y-annotateを追加する際のチェックリスト：

### コンポーネントファイル（.ts）

- [ ] `import type { A11yAnnotations } from '../../utils/a11y-annotations.js';` を追加
- [ ] `docs/knowledge/a11y-annotations.json` に注釈を定義
- [ ] `categories` を6項目定義（semantics, keyboard, zoom, states, labels, motion）
- [ ] `callouts` でShadow DOM内の要素を指定（`scope: 'shadow', selector: '[part="..."]'`）
- [ ] 型チェックが通ることを確認（`npm run type-check`）

### デモファイル（demos.ts）

- [ ] トグルUIを追加（dads-switch）
- [ ] トグルスクリプトを追加（customElements.whenDefined）
- [ ] アクセシビリティ注釈セクションを追加
- [ ] `a11y-annotate` でコンポーネントをラップ
- [ ] `target-selector` 属性を指定（必須）
- [ ] **レイアウトタイプの判定**
  - **パターンA（中央揃え型）**: button, textarea, input-text等
    - [ ] **必須**: `<div style="display: grid; place-content: center; padding: 60px 0;">` で中央揃え
    - [ ] **必須**: `padding: 60px 0;` を追加（コールアウトマーカーが枠線からはみ出さないように）
    - [ ] フォーム要素の場合、コンポーネント自体に `width: 500px` を適用
  - **パターンB（横幅いっぱい型）**: accordion・blockquote等のfill型コンポーネント
    - [ ] **必須**: `<div style="padding: 60px 0;">` のみ（中央揃えなし）
    - [ ] **必須**: `padding: 60px 0;` を追加（コールアウトマーカーが枠線からはみ出さないように）
    - [ ] コンポーネント自体に`width`スタイルを**適用しない**（自然な幅で表示）

### 検証

- [ ] ブラウザでデモページを確認（`bun server.ts`）
- [ ] トグルでコールアウトマーカーのON/OFFが切り替わることを確認
- [ ] 右側パネルが常に表示されることを確認
- [ ] 中央揃えが適切に機能していることを確認
- [ ] **必須**: コールアウトマーカーが枠線からはみ出していないことを確認
- [ ] コールアウトマーカーが対象要素の適切な位置に表示されることを確認

## トラブルシューティング

### 問題: 右側が空いてしまう

**原因**: a11y-annotateの外側のコンテナに `max-width` を適用している

**解決策**: コンポーネント自体に `width` を適用し、a11y-annotate内をgridで中央揃え + paddingにする

```html
<!-- ✅ 正しい実装 -->
<a11y-annotate>
  <div style="display: grid; place-content: center; padding: 60px 0;">
    <dads-textarea style="width: 500px;" ...></dads-textarea>
  </div>
</a11y-annotate>
```

### 問題: コールアウトマーカーが枠線からはみ出す

**原因1**: コンポーネントが左寄せで表示されている、または中央揃えが不完全
**原因2**: `padding: 60px 0;` が設定されていない（最も多い原因）

**解決策**: `display: grid; place-content: center; padding: 60px 0;` で完全な中央揃え + 垂直方向のパディングを追加

```html
<!-- ✅ 推奨: gridで縦横完全センタリング + padding（必須） -->
<a11y-annotate>
  <div style="display: grid; place-content: center; padding: 60px 0;">
    <dads-button>ボタン</dads-button>
  </div>
</a11y-annotate>
```

### 問題: トグルが動作しない

**原因**: `customElements.whenDefined('dads-switch')` の前にswitchが読み込まれていない

**解決策**: `Promise.all([import('dads-switch'), ...])` でスクリプトモジュールに追加

### 問題: 注釈パネルが表示されない

**原因**: `target-selector` 属性が指定されていない

**解決策**: `<a11y-annotate target-selector="コンポーネント名">` を指定する

```html
<!-- ❌ NG: target-selectorがない -->
<a11y-annotate>
  <dads-accordion-details>...</dads-accordion-details>
</a11y-annotate>

<!-- ✅ OK: target-selectorを指定 -->
<a11y-annotate target-selector="dads-accordion-details">
  <dads-accordion-details>...</dads-accordion-details>
</a11y-annotate>
```

### 問題: fill型コンポーネント（accordion等）が横幅いっぱいに広がらない

**原因**: パターンAの中央揃えレイアウトを適用している

**解決策**: パターンBの横幅いっぱいレイアウトに変更する

```html
<!-- ❌ NG: 中央揃えパターンを使っている -->
<a11y-annotate target-selector="dads-accordion-details">
  <div style="display: grid; place-content: center; padding: 60px 0;">
    <dads-accordion-details style="width: 500px;">...</dads-accordion-details>
  </div>
</a11y-annotate>

<!-- ✅ OK: 横幅いっぱいパターンを使う -->
<a11y-annotate target-selector="dads-accordion-details">
  <div style="padding: 60px 0;">
    <dads-accordion-details>...</dads-accordion-details>
  </div>
</a11y-annotate>
```

## 参考資料

- a11y-annotate実装: `packages/components/annotate/`
- 既存実装例: switchデモ（`src/demos.ts` の `switch` デモ）
- アクセシビリティガイドライン: `docs/knowledge/accessibility-guidelines.md`

## 更新履歴

- 2026-01-13: 初版作成（blockquote, button, textarea, inputText対応完了）
- 2026-01-13: パターンB（横幅いっぱい型）追加、accordion対応完了、レイアウトタイプ別の実装パターンを明記
- 2026-01-13: blockquoteをパターンB（fill型）に変更
