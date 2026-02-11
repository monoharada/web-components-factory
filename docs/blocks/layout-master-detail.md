<!-- GENERATED:WCF_BLOCK_DOC -->

# レイアウト（Master-Detail: Main + Aside）

- ID: `layout-master-detail`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

一覧 + 詳細を同時表示する2カラムレイアウト。

## 必須コンポーネント

- `layout-shell`
- `layout-aside`
- `table`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern layout-master-detail
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern layout-master-detail
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern layout-master-detail
```

## サンプルHTML（canonical `dads-*`）

```html
<dads-layout-shell data-dads-typeset pattern="master-detail" mode="auto">
  <section>
    <dads-heading level="2">申請一覧</dads-heading>
    <dads-table>
      <table>
        <thead>
          <tr><th scope="col">申請ID</th><th scope="col">状態</th></tr>
        </thead>
        <tbody>
          <tr><td>A-1001</td><td>審査中</td></tr>
          <tr><td>A-1002</td><td>差戻し</td></tr>
        </tbody>
      </table>
    </dads-table>
  </section>
  <dads-layout-aside slot="aside">
    <dads-heading level="3">詳細情報</dads-heading>
    <p>選択中レコードの詳細を表示します。</p>
  </dads-layout-aside>
</dads-layout-shell>
```
