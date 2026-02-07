<!-- GENERATED:WCF_BLOCK_DOC -->

# 検索結果一覧

- ID: `search-results`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

見出し + 検索フォーム + 結果カード + ページネーション

## 必須コンポーネント

- `heading`
- `search-box`
- `card`
- `page-navigation`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern search-results
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern search-results
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern search-results
```

## サンプルHTML（canonical `dads-*`）

```html
<main data-dads-typeset>
  <dads-heading level="1">検索</dads-heading>
  <form id="search-form">
    <dads-search-box aria-label="検索"></dads-search-box>
  </form>
  <h2>結果</h2>
  <ul>
    <li><dads-card>ダミー結果 1</dads-card></li>
    <li><dads-card>ダミー結果 2</dads-card></li>
    <li><dads-card>ダミー結果 3</dads-card></li>
  </ul>
  <dads-page-navigation current="1" total="1"></dads-page-navigation>
</main>
```
