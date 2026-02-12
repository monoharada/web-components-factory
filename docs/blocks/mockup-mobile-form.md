<!-- GENERATED:WCF_BLOCK_DOC -->

# モックアップ（Mobile Form）

- ID: `mockup-mobile-form`
- Stability: `stable`
- Contract: `1.0`
- Entry hints: `boot`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

モバイル端末上で入力フォームの配置と余白を確認するモックアップ。

## 必須コンポーネント

- `button`
- `device-mock`
- `fieldset`
- `heading`
- `input-text`
- `select`
- `textarea`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern mockup-mobile-form --channel stable
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern mockup-mobile-form --channel stable
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern mockup-mobile-form
```

## サンプルHTML（canonical `dads-*`）

```html
<section data-dads-typeset>
  <dads-device-mock device="mobile" visible-height="560px">
    <main>
      <dads-heading level="2">申請フォーム</dads-heading>
      <form>
        <dads-fieldset>
          <legend>基本情報</legend>
          <dads-input-text name="name" required></dads-input-text>
          <dads-select name="type" required></dads-select>
          <dads-textarea name="detail" required></dads-textarea>
        </dads-fieldset>
        <dads-button type="submit">確認へ進む</dads-button>
      </form>
    </main>
  </dads-device-mock>
</section>
```
