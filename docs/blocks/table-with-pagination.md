<!-- GENERATED:WCF_BLOCK_DOC -->

# テーブル + ページネーション

- ID: `table-with-pagination`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

テーブル一覧とページネーションの基本構成

## 必須コンポーネント

- `table`
- `page-navigation`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern table-with-pagination
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern table-with-pagination
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern table-with-pagination
```

## サンプルHTML（canonical `dads-*`）

```html
<main data-dads-typeset>
  <dads-heading level="1">一覧</dads-heading>
  <dads-table>
    <table>
      <thead>
        <tr><th>項目</th><th>値</th></tr>
      </thead>
      <tbody>
        <tr><td>サンプル</td><td>1</td></tr>
      </tbody>
    </table>
  </dads-table>
  <dads-page-navigation current="1" total="3"></dads-page-navigation>
</main>
```
