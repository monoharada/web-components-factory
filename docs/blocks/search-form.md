<!-- GENERATED:WCF_BLOCK_DOC -->

# 検索フォーム（最小）

- ID: `search-form`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

見出し + 検索フォーム（検索語 + ボタン）

## 必須コンポーネント

- `heading`
- `search-box`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern search-form
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern search-form
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern search-form
```

## サンプルHTML（canonical `dads-*`）

```html
<main>
  <dads-heading level="1">検索</dads-heading>
  <form id="search-form">
    <dads-search-box aria-label="検索"></dads-search-box>
  </form>
</main>
```
