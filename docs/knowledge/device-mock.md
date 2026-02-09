# Device Mock ガイド（AIエージェント向け）

`dads-device-mock` は、デバイス枠（desktop / tablet / mobile）を再現しながら、内部に任意の UI を配置するためのモック用コンポーネントです。  
主用途は viewer デモやキャプチャ検証です。

## 1. 使うべき場面

- Header / Drawer などを「端末枠付き」で見せたいとき
- レスポンシブ別の作例を同じマークアップ構造で比較したいとき
- `visible-height` で「上だけ見せる」切り取り表現をしたいとき

## 2. 最小利用例

```html
<dads-device-mock device="desktop">
  <div>ここに作例コンテンツを配置</div>
</dads-device-mock>
```

`device` が不正値のときは自動で `mobile` に正規化されます。

## 3. 公開 API

### 属性

- `device="desktop|tablet|mobile"`（既定: `mobile`）
- `visible-height="220px"`（任意）
  - 指定時: モック全体をその高さで切り取り
  - 未指定: 全高表示

### slot

- default（safe-area 内）

### CSS Parts

- `base`
- `frame`
- `frame-shape`
- `screen`
- `safe-area`

### CSS カスタムプロパティ

- `--dads-device-mock-frame-width`
- `--dads-device-mock-aspect-ratio`
- `--dads-device-mock-screen-inset`
- `--dads-device-mock-screen-radius`
- `--dads-device-mock-safe-area-top`
- `--dads-device-mock-screen-background`
- `--dads-device-mock-frame-stroke-width`
- `--dads-device-mock-frame-stroke-color`
- `--dads-device-mock-visible-height`

## 4. デバイス別の既定ジオメトリ

### desktop

- `viewBox`: `0 0 1454 1038`
- frame rect: `x=3.5 y=3.5 width=1447 height=1031 rx=11.5`
- stroke-width: `7`

### tablet

- `viewBox`: `0 0 782 1038`
- frame rect: `x=3.5 y=3.5 width=775 height=1031 rx=19.5`
- stroke-width: `7`

### mobile

- `viewBox`: `0 0 405 864`
- frame rect: `x=3 y=3 width=399 height=858 rx=27`
- stroke-width: `6`

## 5. 既存デモでの実運用パターン

- Header デモ: `src/demos/header-container.ts`
  - desktop / tablet / mobile を同一セクションで表示
  - `visible-height` で「ヘッダーだけ見せる」短尺プレビューを作る
- Drawer デモ: `src/demos/drawer.ts`
  - mobile モック内に trigger-layer + drawer を構成

## 6. AIエージェント実装手順（推奨）

1. まず `device` を決める（`desktop` / `tablet` / `mobile`）。
2. 見切れを許容する作例なら `visible-height` を付ける。  
   許容しない作例（完全格納が必要）なら `visible-height` を付けない。
3. ポップアップ系 UI（例: language selector）を入れる場合は、必要なら `::part(popup)` を右寄せしてはみ出しを回避する。
4. viewer デモでは `modulePreloadScript([...])` に `dads-device-mock` を含める。
5. 文字列テストを更新し、`dads-device-mock` と `visible-height` の有無を検証する。

## 7. よくある崩れと対処

### 1) ドロップダウンがモック外にはみ出す

- 原因: `visible-height` が短く、popup が下方向に出る
- 対処:
  - `visible-height` を増やす
  - popup の位置を右寄せ/上寄せに調整する
  - その作例だけ `visible-height` を外す

### 2) 「モック内に収まっていない」見え方になる

- 原因: 切り取り表示（`visible-height`）が有効
- 対処:
  - 完全格納が必要な作例では `visible-height` を削除

### 3) mobile でヘッダー要素同士が重なる

- 原因: safe-area 上端や utility 領域の幅不足
- 対処:
  - utility の要素数を減らす
  - language selector を `opener="icon"` に切り替える
  - 必要ならフォントサイズ/余白をデモ側で微調整する

## 8. 参照すべき実装ファイル

- 本体: `packages/components/device-mock/device-mock.ts`
- styles: `packages/components/device-mock/device-mock-styles.ts`
- tokens: `packages/components/device-mock/device-mock-tokens.ts`
- define: `packages/components/device-mock/device-mock-define.ts`
- test: `packages/components/device-mock/device-mock.test.ts`
- autoload: `packages/autoload/dads/device-mock.ts`

## 9. 最低限の確認コマンド

```bash
npm run test:run -- packages/components/device-mock/device-mock.test.ts src/demos/header-container.test.ts src/demos/drawer.test.ts
npm run type-check
npm run validate:wc
```

## 10. 補足

`dads-mobile-mock` は互換維持で残っています。  
新規デモでは原則 `dads-device-mock` を優先し、既存の `dads-mobile-mock` 利用箇所は段階的に置換してください。
