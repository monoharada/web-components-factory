<!-- GENERATED:WCF_BLOCK_DOC -->

# レイアウト（App/SaaS: Header + Sidebar + Main）

- ID: `layout-app-shell`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

業務アプリ向けの標準App Shellレイアウト。

## 必須コンポーネント

- `card`
- `heading`
- `layout-shell`
- `layout-sidebar`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern layout-app-shell --channel stable
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern layout-app-shell --channel stable
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern layout-app-shell
```

## サンプルHTML（canonical `dads-*`）

```html
<dads-layout-shell data-dads-typeset pattern="app-shell" mode="auto">
  <div slot="header">
    <dads-heading level="2">業務ダッシュボード</dads-heading>
  </div>
  <dads-layout-sidebar slot="sidebar">
    <ul>
      <li>案件一覧</li>
      <li>承認待ち</li>
      <li>設定</li>
    </ul>
  </dads-layout-sidebar>
  <section>
    <dads-card>
      <dads-heading level="3">進捗サマリー</dads-heading>
      <p>主要KPIを表示します。</p>
    </dads-card>
  </section>
</dads-layout-shell>
```
