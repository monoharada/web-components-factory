# GitHub Pages で `viewer.html` を静的公開する計画（Project Pages）

## 目的

`bun server.ts` で表示できているコンポーネントビューア（`viewer.html`）を、GitHub Pages（Project Pages: `/<repo>/` 配下）でも同等に表示できるようにする。

## 背景（現状整理）

- ローカルでは `server.ts` が以下を担っている
  - `/` → `viewer.html` を返す
  - `/core/*`・`/utils/*`・`/styles/*`・`/components/*`・`/@components/*` を `packages/*` にマッピング
  - `.ts` をオンザフライでトランスパイルして `.js` として配信
- GitHub Pages は静的ホスティングのため、上記を「事前ビルド（静的ファイル生成）」に置き換える必要がある

## レビュー結果（設計上の前提が成立するか）

### ✅ 内部 import の書き方

- `packages/**` の内部 import は「相対パス + `.js` 拡張子」で統一されている
  - 例: `../../core/web-components.js`, `../../components/button/index.js`
- そのため、**出力ディレクトリ構造を正しく作れば**、トランスパイル後も import パスの書き換えは不要

### ✅ 追加で書き換える必要があるのは HTML（と HTML 内の文字列）だけ

- `viewer.html` 内では以下が先頭 `/` の絶対パスになっている
  - import map の value
  - `<link rel="modulepreload" href="...">`
  - `navigator.serviceWorker.register('/sw.js')`
  - `import('/@components/...')` などの dynamic import 文字列
- Project Pages（`/<repo>/`）で動かすため、これらは `./` 始まりの相対パスに寄せる

## 要件（Acceptance Criteria）

- GitHub Pages で `index.html`（= `viewer.html` 相当）が表示される
- `?component=...` の切り替えが動作する
- Autoloader によるロードが動作し、各コンポーネントが表示される
- 404 が発生しない（少なくとも以下）
  - `core/*.js`, `utils/*.js`, `styles/*.js`, `components/**`, `@components/**`, `config.js`, `src/demos.js`
- 初回は Service Worker を無効化してもよい（= SW 起因の 404 を避ける）

## 方針（決定事項）

- 出力先は `dist-pages/` に固定する（GitHub Pages artifact としてアップロード）
- `.ts` → `.js` のトランスパイルは Node.js 上で TypeScript の `transpileModule` を使う（追加のビルド依存を増やさない）
- 依存モジュールの import 文は原則変更しない（相対パス + `.js` を信頼する）
- `viewer.html` のみ、絶対パスを相対パスに置換する
- Service Worker はフェーズ1では無効（フェーズ2で scope 対応を入れてから有効化）

## 生成物（`dist-pages/` の構造）

```
dist-pages/
├── index.html
├── config.js
├── core/
│   ├── web-components.js
│   ├── autoloader.js
│   └── preloader.js
├── utils/
│   └── *.js
├── styles/
│   └── *.js
├── components/
│   └── **/*.js
├── @components/
│   ├── dads/
│   │   └── **/*.js
│   └── meta/
│       └── **/*.js
└── src/
    └── demos.js
```

## 実装ステップ（フェーズ1: “まず動かす”）

### 1) ビルドスクリプト追加

- `scripts/build-pages.cjs` を追加し、`dist-pages/` を生成する
- 処理内容（概要）
  1. `dist-pages/` をクリーン（削除→作り直し）
  2. `viewer.html` → `dist-pages/index.html` にコピーし、パスを書き換える
  3. `packages/**` / `src/demos.ts` をトランスパイルして `dist-pages/` に配置する

### 2) `viewer.html` → `index.html` の書き換えルール

- import map の value
  - `"/@components/...` → `"./@components/...`
  - `"/core/...` → `"./core/...`
  - `"/core/autoloader.js"`（例: `@core/autoloader`）も同様に相対化する
  - `"/src/demos.js"` → `"./src/demos.js"`
- `modulepreload` の `href`
  - `href="/core/...` → `href="./core/...`（他も同様）
- `criticalComponents` / `componentAdapters` の文字列（dynamic import 用）
  - `'/@components/...` → `'./@components/...`
- Service Worker 登録ブロック
  - フェーズ1では削除 or コメントアウト（`sw.js` は出力しない）

### 3) トランスパイル対象と配置マッピング

- `packages/config.ts` → `dist-pages/config.js`
- `packages/core/**/*.ts` → `dist-pages/core/**/*.js`
- `packages/utils/**/*.ts` → `dist-pages/utils/**/*.js`
- `packages/styles/**/*.ts` → `dist-pages/styles/**/*.js`
- `packages/components/**/*.ts` → `dist-pages/components/**/*.js`
- `packages/autoload/dads/**/*.ts` → `dist-pages/@components/dads/**/*.js`
- `packages/autoload/meta/**/*.ts` → `dist-pages/@components/meta/**/*.js`
- `src/demos.ts` → `dist-pages/src/demos.js`

#### 除外（トランスパイルしない）

- `**/*.d.ts`（型定義）
- `**/*.test.ts`（テスト）
- `**/*.stories.ts`（Storybook）

### 4) npm scripts 追加

- `pages:build`（例: `npm run pages:build`）
- （任意）`pages:preview`（例: `npm run pages:preview`。ポートは `PAGES_PORT` または `PORT` で上書き可能）

### 5) `.gitignore` 追加

```
dist-pages/
```

### 6) GitHub Actions（Pages デプロイ）

- `.github/workflows/pages.yml` を追加（main push でデプロイ）
- 概要
  - checkout
  - permissions（`contents: read`, `pages: write`, `id-token: write`）
  - Node.js setup & install（`npm ci`）
  - `npm run pages:build`
  - `actions/upload-pages-artifact`（`dist-pages/`）
  - `actions/deploy-pages`

### 7) 動作確認

- ローカル
  - `pages:build` 実行
  - `dist-pages/` を静的サーブして確認（`index.html` が開ける / Network 404 がない）
- GitHub Pages
  - `https://<user>.github.io/<repo>/?component=button` などで表示確認

## 懸念点と対策

- **絶対パスが残っていると Project Pages で 404**
  - 対策: `index.html` 生成時に、import map / preload / dynamic import 文字列を確実に `./` に統一
- **Service Worker が absolute path をキャッシュしようとして 404**
  - 対策: フェーズ1では SW を無効化してリスクを切り離す

## フェーズ2（SW 有効化 / パフォーマンス最適化）

- `sw.js` を `dist-pages/sw.js` に出力し、scope 対応に修正する
  - `cache.addAll(['/core/...'])` のような絶対パスをやめる（`new URL('core/web-components.js', self.location)` など）
  - `navigator.serviceWorker.register('./sw.js')` のように相対登録へ変更
