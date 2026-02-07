# 試すだけ：UIパターン（レシピ）から vendor install → 画面を作る（他リポジトリ用）

あなたは「consumer 側のリポジトリ（= いま開いている作業フォルダ）」で作業するエージェントです。
目的は、`web-components-factory` が提供する **UIパターン（レシピ）**を起点に、
必要な Web Components を **vendor へ 1コンポーネントずつ install**して、最小の HTML を動かすことです。

## ゴール（Done）
- `vendor/components/<prefix>/` が生成される
- `index.html` をブラウザで開くと、選んだパターンの UI が表示される

## 前提
- Node.js（v20+ 想定）
- 静的配信（例：`bunx serve . -l 3000`）

## 進め方（パターン → install → snippet）

1) パターンを選ぶ（例：`search-form` / `table-with-pagination` / `card-grid`）

2) upstream の pattern registry を参照して、必要な `requires(componentId[])` を確認する  
   - 例：`registry/pattern-registry.json`

3) vendor install（`wcf`）
   - `wcf init --prefix myui --lang js --out vendor/components/myui`
   - `wcf add --pattern <patternId> --prefix myui --lang js --out vendor/components/myui`

4) `index.html` を作る
   - `vendor/components/myui/importmap.snippet.json` を importmap に反映
   - `vendor/components/myui/autoload/*.js` を必要分 `import` する
    - パターンの canonical snippet（`dads-*`）を `<myui-*>` に置換して貼る（prefix変換）

5) 配信して表示確認
   - `bunx serve . -l 3000` → `http://localhost:3000/`

## 出力してほしいもの
- 実行したコマンド（コピペ可）
- 作成/更新したファイル一覧
- `index.html` の中身
