<!-- GENERATED:WCF_BLOCK_DOC -->

# 申請フォーム（ステップ・検証エラー）

- ID: `application-form-step-validation`
- Stability: `experimental`
- Contract: `1.0`
- Entry hints: `boot`, `@wcf`, `index`
- Entry policy: 推奨は `boot`。`@wcf` / `index` は互換モード（deprecated, N+1で廃止予定）

## 概要

ステップナビゲーション付き申請フォームと検証エラー表示

## 必須コンポーネント

- `step-navigation`
- `fieldset`
- `input-text`
- `button`

## コマンド例

### npm (`npx`互換)
```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern application-form-step-validation
```

### Bun (`bunx`)
```bash
bunx --package git+https://github.com/monoharada/web-components-factory.git \
  wcf vendor install --prefix myui --dir vendor/components/myui --pattern application-form-step-validation
```

### Bun (`bun create`経由)
```bash
bun create github.com/monoharada/web-components-factory my-app
cd my-app
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern application-form-step-validation
```

## サンプルHTML（canonical `dads-*`）

```html
<main>
  <dads-heading level="1">申請フォーム（ステップ）</dads-heading>
  <dads-step-navigation current="1" total="3"></dads-step-navigation>
  <form id="application-form-step">
    <dads-fieldset>
      <legend>ステップ1: 申請者情報</legend>
      <dads-input-text name="name" required error error-text="氏名は必須です"></dads-input-text>
    </dads-fieldset>
    <dads-button type="submit">次へ</dads-button>
  </form>
</main>
```
