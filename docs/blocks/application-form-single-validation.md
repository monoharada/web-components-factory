<!-- GENERATED:WCF_BLOCK_DOC -->

# 申請フォーム（1ページ・検証エラー）

- ID: `application-form-single-validation`
- Stability: `experimental`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

必須項目を含む1ページ申請フォームとバリデーションエラー表示

## 必須コンポーネント

- `fieldset`
- `input-text`
- `button`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern application-form-single-validation
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern application-form-single-validation
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern application-form-single-validation
```

## サンプルHTML（canonical `dads-*`）

```html
<main data-dads-typeset>
  <dads-heading level="1">申請フォーム</dads-heading>
  <form id="application-form-single">
    <dads-fieldset>
      <legend>申請情報</legend>
      <dads-input-text name="name" required error error-text="氏名は必須です"></dads-input-text>
      <dads-select name="type" required></dads-select>
      <dads-textarea name="reason" required></dads-textarea>
    </dads-fieldset>
    <dads-button type="submit">送信</dads-button>
  </form>
</main>
```
