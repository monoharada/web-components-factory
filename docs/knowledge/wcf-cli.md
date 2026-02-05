# wcf CLI（ShadCN風 vendor install）

このリポジトリには、Web Components を **1コンポーネントずつ vendor ディレクトリへコピー（= detatch可能）**するための CLI `wcf` が含まれます。

## できること（要点）

- `node_modules` ではなく、プロジェクト内の `vendor/` などへ **ソースを配置**します
- 依存関係（deps）や推奨 define 関数は **`registry/install-registry.json`（CEM由来の軽量レジストリ）** を入口として参照します
  - 取得先例：`https://raw.githubusercontent.com/<owner>/<repo>/<ref>/registry/install-registry.json`
- `detach` により、生成物を **管理対象から外して手編集**できます

## 使い方（他リポジトリ側）

## クイックスタート（空ディレクトリで動作確認）

例：`/Users/reiharada/dev/wcf-test2` に “vendor install → ブラウザ表示” まで通す最短手順。

```bash
mkdir -p /Users/reiharada/dev/wcf-test2
cd /Users/reiharada/dev/wcf-test2

wcf init --prefix myui --lang js --out vendor/components/myui
wcf add button --prefix myui --lang js --out vendor/components/myui
```

`index.html` を作り、importmap と autoload を読み込みます（`--lang js` の場合）。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>wcf vendor test</title>
    <link rel="icon" href="data:," />

    <script type="importmap">
      {
        "imports": {
          "@wcf": "./vendor/components/myui/index.js",
          "@wcf/button": "./vendor/components/myui/autoload/button.js"
        }
      }
    </script>
  </head>
  <body>
    <myui-button variant="solid">テスト</myui-button>

    <script type="module">
      import "@wcf/button";
    </script>
  </body>
</html>
```

静的サーバで配信して確認します。

```bash
bunx serve . -l 3000
# http://localhost:3000/
```

### 1) 初期化

```bash
wcf init --prefix myui --lang js --out vendor/components/myui
```

- `--lang js`（デフォルト）: ブラウザ実行しやすい ESM `.js` を vendor に生成し、`importmap.snippet.json` を出します
- `--lang ts`: TypeScript ソースを vendor に配置します（※ブラウザ直実行ではなく、bundler / tsc 前提）
- `--allow-outside-project`: `--out` をプロジェクト外に指定する場合のみ明示的に付けます（削除操作の安全のため、通常は非推奨）

### 2) 追加（依存も含めてインストール）

```bash
wcf add button
```

#### パターンから追加（UIレシピ）

`registry/pattern-registry.json` にある **画面/レイアウトのレシピ**から、必要な componentId（deps込み）をまとめて install できます。

```bash
wcf add --pattern search-form
```

複数指定（カンマ区切り）：

```bash
wcf add --pattern search-form,table-with-pagination
```

#### ローカル改変を上書きしたい（強制）

managed なファイルに手編集が入っている場合、`wcf add` は安全のため上書きを拒否します。

- そのまま編集したい: `wcf detach <id>`（推奨）
- 上書きして最新に戻したい: `wcf add ... --force`

prefix を変える場合：

```bash
wcf add button --prefix myui
```

### 3) importmap（`--lang js` の場合）

生成される `vendor/components/<prefix>/importmap.snippet.json` を importmap にマージします。

### 4) デタッチ（手編集したい）

```bash
wcf detach button
```

以後、同じ componentId のファイルは `wcf add` で上書きされません（管理対象から外れます）。

#### 共有コードも保護したい（任意）

`packages/core` / `packages/utils` 等の共有コード（vendor 内では `wcf/packages/*`）も手編集する場合は、`__shared__` を detach できます。

```bash
wcf detach __shared__
```

### 4.1) 再アタッチ（管理対象に戻す）

```bash
wcf attach button
```

`detach` を解除して、次回以降の `wcf add` で再び更新できるようにします。

### 5) 削除（管理対象だけ消す）

```bash
wcf remove button
```

`detach` 済みのファイルは削除されません。

## 開発中の注意（`--local`）

このリポジトリのローカルチェックアウトを upstream として使いたい場合は `--local` を使えます（例：PR中の動作確認）。

```bash
wcf add button --local /path/to/web-components-factory
```

## トラブルシュート

### `wcf: command not found`（`npm exec` 経由）

- upstream の `main` に `bin/wcf.mjs` が無い場合に起きます
- 対処：
  - `git+...#<branch|tag|sha>` で CLI が入っている ref を指定する
  - または、ローカルの `bin/wcf.mjs` を `node /abs/path/to/bin/wcf.mjs ...` で直接実行する

### `does not provide an export named 'defineX'`

- まず `detach` していると生成物が更新されません（`wcf attach <id>` → `wcf add <id>`）
- その上で、`vendor/.../autoload/<id>.js` の import 先が存在するか確認します
- ブラウザ側のキャッシュが原因の場合はハードリロードしてください

## CEM（custom-elements.json）について

`custom-elements.json` は容量が大きいため、`wcf` はデフォルトで vendor にコピーしません（AI/CLI向けの入口は `registry/install-registry.json` を想定）。

必要な場合のみ `--embed-cem` を付けると、`vendor/components/<prefix>/cem/` にスナップショットを書き出します。
