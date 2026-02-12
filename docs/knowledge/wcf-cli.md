# WCF CLI（導入体験 v1）

`wcf` は no-build 前提の vendor install 体験を提供します。  
目的は「発見 → 1コマンド導入 → ページ生成」を一貫させることです。
生成物は `vendor/components/<prefix>/components/**` を中心に編集します（`elements/` 分離は行いません）。
実運用の既定は `--channel stable`（固定SHA + 自動フォールバック）です。`--channel` 未指定時は `local` 扱いです。

## 組版CSS（標準同梱）

- `page create` で生成される `index.html` には、`@layer ... contents` の組版CSS（`<style data-wcf-typeset>`）が標準で入る
- コンテンツルートには `data-dads-typeset` を付ける（pattern定義も同契約）
- 密度を詰める場合のみ `data-dads-density="compact"` を付与する
- `dads-heading` の大きい上余白は `margin="top"` を優先し、組版CSSはフォールバックのみ担当する

## 主要コマンド

```bash
# blocks 一覧（patterns alias）
node scripts/wcf/cli.js blocks list --channel stable
node scripts/wcf/cli.js blocks show search-results --channel stable

# 初期導入（vendor install + page create）
node scripts/wcf/cli.js init --prefix myui --dir . --pattern search-results --entry boot --channel stable

# vendor 資材導入（空ディレクトリ向け）
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern search-results --channel stable

# 既存 vendor への段階追加（merge再生成）
node scripts/wcf/cli.js vendor add --prefix myui --dir vendor/components/myui --component card --channel stable

# importmap出力
node scripts/wcf/cli.js vendor print-importmap --prefix myui --dir vendor/components/myui --pattern search-results --format html --channel stable

# ページ生成
node scripts/wcf/cli.js page create --pattern search-results --prefix myui --dir . --entry boot --channel stable
```

## `vendor install --force`

- 既定では出力先が non-empty の場合は失敗（従来仕様）
- `--force` 指定時のみ再生成を許可
- 危険パス（空/無効、project root、project 外）は拒否
- 未管理ディレクトリには `--force` を適用しない（管理済み vendor 出力のみ再生成）

```bash
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern search-results --force
```

## `vendor add` の差分保護

- `components/*.js` から既存導入コンポーネントを推定し、`--pattern`/`--component` と union して再生成
- target に既存ファイルがあり、再生成結果との差分がある場合は `E_VENDOR_DRIFT` で停止
- `--force` 指定時のみ drift ファイルを上書き

```bash
# drift があると E_VENDOR_DRIFT
node scripts/wcf/cli.js vendor add --prefix myui --dir vendor/components/myui --component card

# 上書き許可
node scripts/wcf/cli.js vendor add --prefix myui --dir vendor/components/myui --component card --force
```

## エントリモード（`page create --entry`）

- `boot`: tagName importmap + `boot.js` を使用（vendor-runtime方式）
- `index`: `vendor/components/<prefix>/index.js` を直接import（互換モード, deprecated）
- `@wcf`: importmapに `@wcf` を定義して import（互換モード, deprecated）
- 方針: 現リリース（N）は互換維持し、次リリース（N+1）で `boot` のみに収束予定

## 互換性ポリシー（contract）

- `vendor-runtime/registry.json` の pattern には `contractVersion` を持たせる
- CLI 側の契約メジャー差分は 1 リリース猶予で警告
- 猶予超過時はエラーとして扱う

## 同等導線（npm / bunx / bun create）

```bash
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- wcf --help --channel stable
bunx --package git+https://github.com/monoharada/web-components-factory.git wcf --help --channel stable
bun create github.com/monoharada/web-components-factory my-app
```

## KPI smoke（初回表示まで）

```bash
# Node実行系
npm run wcf:smoke:node

# Bun実行系（ネットワーク環境依存）
npm run wcf:smoke:bun

# 外部取得導線（主に夜間CI）
npm run wcf:smoke:npm
npm run wcf:smoke:bunx

# remote package を明示する場合
WCF_PACKAGE=git+https://github.com/monoharada/web-components-factory.git npm run wcf:smoke:npm
WCF_PACKAGE=git+https://github.com/monoharada/web-components-factory.git npm run wcf:smoke:bunx
```
