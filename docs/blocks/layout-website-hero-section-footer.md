<!-- GENERATED:WCF_BLOCK_DOC -->

# レイアウト（Website: Hero + Section + Footer）

- ID: `layout-website-hero-section-footer`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

コンテンツ主導の1カラムサイト向けレイアウト。

## 必須コンポーネント

- `layout-shell`
- `heading`
- `card`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern layout-website-hero-section-footer --channel stable
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern layout-website-hero-section-footer --channel stable
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern layout-website-hero-section-footer
```

## サンプルHTML（canonical `dads-*`）

```html
<dads-layout-shell data-dads-typeset pattern="website" mode="auto">
  <header slot="header">
    <dads-heading level="1">くらしの手続きポータル</dads-heading>
    <p>必要な手続きを1つの画面で確認できます。</p>
  </header>
  <section>
    <dads-card>
      <dads-heading level="2">はじめての方へ</dads-heading>
      <p>制度の概要と申請までの流れを案内します。</p>
      <dads-button variant="outlined">詳しく見る</dads-button>
    </dads-card>
  </section>
  <footer slot="footer">© Digital Service</footer>
</dads-layout-shell>
```
