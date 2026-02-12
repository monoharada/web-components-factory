<!-- GENERATED:WCF_BLOCK_DOC -->

# カードグリッド

- ID: `card-grid`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

カードで一覧表示する基本レイアウト

## 必須コンポーネント

- `heading`
- `card`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern card-grid --channel stable
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern card-grid --channel stable
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern card-grid
```

## サンプルHTML（canonical `dads-*`）

```html
<main data-dads-typeset>
  <dads-heading level="1">お知らせ</dads-heading>
  <section>
    <dads-card>
      <h2>カード1</h2>
      <dads-button variant="outlined">詳細</dads-button>
    </dads-card>
    <dads-card>
      <h2>カード2</h2>
      <dads-button variant="outlined">詳細</dads-button>
    </dads-card>
  </section>
</main>
```
