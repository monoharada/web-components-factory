# アクセシビリティ注釈（`a11y-annotate`）

Design System コンポーネントをドキュメンテーション用途で「注釈付き表示」するためのラッパーコンポーネントです。

- 右側に **注釈パネル（文章中心）**
- コンポーネントの周りに **番号コールアウト（吹き出し/マーカー）**

を同時に表示します。

## 使い方（Viewer / ドキュメント）

```html
<a11y-annotate>
  <dads-accordion-details>...</dads-accordion-details>
</a11y-annotate>
```

### devオンデマンド

注釈は **dev専用** で表示します。以下のどちらかで有効化してください。

- URL: `?a11y=1` を付与
- `localStorage.setItem('dads:a11y', '1')`

### オプション

- `mode="both" | "panel" | "callouts"`（デフォルト: `both`）
  - `both`: パネル + コールアウト
  - `panel`: パネルのみ
  - `callouts`: コールアウトのみ
- `target-selector="..."`（任意）
  - ラップ内で注釈対象を切り替えたい場合の CSS セレクタ
- `no-live`（任意）
  - 付与するとライブ追従（属性変化の監視）を無効化

## 6カテゴリ（記事準拠）

`a11y-annotate` は以下のカテゴリを表示します（未記載の場合は `（未記載）` を表示）。

1. セマンティクス / 関係性 / 構造
2. キーボード操作
3. ズーム / レスポンシブ
4. 状態 / フィードバック
5. ラベル / インストラクション
6. モーション / アニメーション / タイミング

## コンポーネント側の注釈メタデータ

注釈メタデータは **CEMに集約**します。

- 定義ファイル: `docs/knowledge/a11y-annotations.json`
- CEM出力: `custom-elements.json` の `custom.a11yAnnotations`
- 型: `A11yAnnotations`（`packages/utils/a11y-annotations.ts`）

更新手順:
1. `docs/knowledge/a11y-annotations.json` を更新
2. `npm run cem:analyze` を実行して `custom-elements.json` に反映

### コールアウトターゲットの指定

`callouts[].target` は「どの要素に紐付けるか」を指定します。

- `selector`: 対象要素の CSS セレクタ
- `scope: "light" | "shadow"`（デフォルト: `light`）
  - `shadow`: `host.shadowRoot.querySelector(selector)` を使用
- `hostSelector`: ターゲットを `target.querySelector(hostSelector)` で絞り込み、その要素をホストとして解決します

例（最初のアイテムの Shadow DOM 内のボタンを参照）:

```ts
{
  id: 'return-button',
  title: '先頭に戻るボタン',
  category: 'labels',
  target: {
    hostSelector: 'dads-accordion-item-details',
    scope: 'shadow',
    selector: '[part="return-button"]',
  },
}
```

## 実装メモ（位置合わせ）

- `a11y-annotate` は **Anchor Positioning を使えるように Light DOM で描画**します（Shadow DOM を使うと、アンカー参照が成立しないケースがあるため）
- `callouts[].target.scope: "shadow"` のように **Shadow DOM 内を参照するコールアウトは、JS（getBoundingClientRect）で位置合わせ**します
