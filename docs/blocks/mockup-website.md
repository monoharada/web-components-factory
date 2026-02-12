<!-- GENERATED:WCF_BLOCK_DOC -->

# モックアップ（Website）

- ID: `mockup-website`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

Webサイト向けのヒーロー + セクション構成を device-mock で確認するモックアップ。

## 必須コンポーネント

- `button`
- `card`
- `device-mock`
- `heading`
- `layout-shell`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern mockup-website --channel stable
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern mockup-website --channel stable
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern mockup-website
```

## サンプルHTML（canonical `dads-*`）

```html
<section data-dads-typeset>
  <dads-device-mock device="desktop">
    <dads-layout-shell pattern="website" mode="desktop">
      <header slot="header">
        <dads-heading level="1">公共サービス ポータル</dads-heading>
        <p>申請・確認・問い合わせを1つの画面で行えます。</p>
      </header>
      <section>
        <dads-card>
          <dads-heading level="2">新着のお知らせ</dads-heading>
          <p>重要なお知らせを確認してください。</p>
          <dads-button variant="outlined">詳細</dads-button>
        </dads-card>
      </section>
      <footer slot="footer">© Digital Service</footer>
    </dads-layout-shell>
  </dads-device-mock>
</section>
```
