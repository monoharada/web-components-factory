<!-- GENERATED:WCF_BLOCK_DOC -->

# Blocks

shadcn風の「発見 → 1コマンド導入 → ページ生成」を行うためのパターン一覧です。

## 使い方

```bash
node scripts/wcf/cli.js blocks list
node scripts/wcf/cli.js page create --pattern <patternId> --prefix myui --dir . --entry boot
```

## Pattern List

- [`application-form-single-validation`](./application-form-single-validation.md): 申請フォーム（1ページ・検証エラー） (experimental)
- [`application-form-step-validation`](./application-form-step-validation.md): 申請フォーム（ステップ・検証エラー） (experimental)
- [`card-grid`](./card-grid.md): カードグリッド (stable)
- [`search-form`](./search-form.md): 検索フォーム（最小） (stable)
- [`search-results`](./search-results.md): 検索結果一覧 (stable)
- [`table-with-pagination`](./table-with-pagination.md): テーブル + ページネーション (stable)
