<!-- GENERATED:WCF_BLOCK_DOC -->

# Blocks

shadcn風の「発見 → 1コマンド導入 → ページ生成」を行うためのパターン一覧です。

## 使い方

```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf blocks list --channel stable
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- \
  wcf page create --pattern <patternId> --prefix myui --dir . --entry boot --channel stable
```

## Pattern List

- [`application-form-single-validation`](./application-form-single-validation.md): 申請フォーム（1ページ・検証エラー） (experimental)
- [`application-form-step-validation`](./application-form-step-validation.md): 申請フォーム（ステップ・検証エラー） (experimental)
- [`card-grid`](./card-grid.md): カードグリッド (stable)
- [`layout-app-shell`](./layout-app-shell.md): レイアウト（App/SaaS: Header + Sidebar + Main） (stable)
- [`layout-master-detail`](./layout-master-detail.md): レイアウト（Master-Detail: Main + Aside） (stable)
- [`layout-website-hero-section-footer`](./layout-website-hero-section-footer.md): レイアウト（Website: Hero + Section + Footer） (stable)
- [`mockup-app-shell`](./mockup-app-shell.md): モックアップ（App Shell） (stable)
- [`mockup-mobile-form`](./mockup-mobile-form.md): モックアップ（Mobile Form） (stable)
- [`mockup-website`](./mockup-website.md): モックアップ（Website） (stable)
- [`search-form`](./search-form.md): 検索フォーム（最小） (stable)
- [`search-results`](./search-results.md): 検索結果一覧 (stable)
- [`table-with-pagination`](./table-with-pagination.md): テーブル + ページネーション (stable)
