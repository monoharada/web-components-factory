<!-- GENERATED:WCF_BLOCK_DOC -->

# モックアップ（App Shell）

- ID: `mockup-app-shell`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

業務画面向けのヘッダー + サイドバー + メイン領域を device-mock で再現するモックアップ。

## 必須コンポーネント

- `card`
- `device-mock`
- `heading`
- `layout-shell`
- `layout-sidebar`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern mockup-app-shell --channel stable
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern mockup-app-shell --channel stable
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern mockup-app-shell
```

## サンプルHTML（canonical `dads-*`）

```html
<section data-dads-typeset>
  <dads-device-mock device="desktop">
    <dads-layout-shell pattern="app-shell" mode="desktop">
      <div slot="header">
        <dads-heading level="2">申請管理ダッシュボード</dads-heading>
      </div>
      <dads-layout-sidebar slot="sidebar">
        <ul>
          <li>一覧</li>
          <li>承認待ち</li>
          <li>設定</li>
        </ul>
      </dads-layout-sidebar>
      <section>
        <dads-card>
          <dads-heading level="3">本日の処理件数</dads-heading>
          <p>処理済み 128 件 / 未処理 24 件</p>
        </dads-card>
      </section>
    </dads-layout-shell>
  </dads-device-mock>
</section>
```
