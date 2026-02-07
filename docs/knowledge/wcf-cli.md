# WCF CLI（導入体験 v1）

`wcf` は no-build 前提の vendor install 体験を提供します。  
目的は「発見 → 1コマンド導入 → ページ生成」を一貫させることです。
生成物は `vendor/components/<prefix>/components/**` を中心に編集します（`elements/` 分離は行いません）。

## 主要コマンド

```bash
# blocks 一覧（patterns alias）
node scripts/wcf/cli.js blocks list
node scripts/wcf/cli.js blocks show search-results

# vendor 資材導入
node scripts/wcf/cli.js vendor install --prefix myui --dir vendor/components/myui --pattern search-results

# importmap出力
node scripts/wcf/cli.js vendor print-importmap --prefix myui --dir vendor/components/myui --pattern search-results --format html

# ページ生成
node scripts/wcf/cli.js page create --pattern search-results --prefix myui --dir . --entry boot
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
npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git -- wcf --help
bunx --package git+https://github.com/monoharada/web-components-factory.git wcf --help
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
