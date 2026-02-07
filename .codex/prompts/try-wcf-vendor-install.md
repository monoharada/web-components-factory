# 試すだけ：wcf で 1コンポーネントを vendor install（他リポジトリ用）

あなたは「consumer 側のリポジトリ（= いま開いている作業フォルダ）」で作業するエージェントです。目的は、`web-components-factory` の `wcf` CLI を使って **node_modules ではなく vendor ディレクトリへ** Web Components を 1コンポーネントだけインストールし、最小の HTML で動作確認することです。

## ゴール（Done）
- `vendor/components/myui/` 配下に `wcf` が生成したファイルがある
- `vendor/components/myui/importmap.snippet.json` が存在し、`index.html` に取り込まれている
- `index.html` をブラウザで開くと `<myui-button>` が表示される

## 前提
- Node.js がある（v20+ 想定）
- 依存は「vendor へコピーされた ESM」なので、ビルド無しで試すために **importmap を使う**

## 実行手順
1) `wcf` を実行できるようにする（どちらか）
   - A) ローカルパス実行（推奨・確実）  
     `node /ABS/PATH/TO/web-components-factory/bin/wcf.mjs ...`
   - B) npm で GitHub から一回実行（ローカルに repo を置かない）  
     `npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git wcf ...`
   - 注意: `main` に `bin/wcf.mjs` がまだ入っていない場合、B は失敗します。その場合は A を使うか、`#<branch|tag|sha>` を付けて **CLI が入っている ref** を指定してください。
     - 例：`npm exec --yes --package=git+https://github.com/monoharada/web-components-factory.git#<ref> -- wcf ...`

2) 初期化（prefix は `myui`、出力先は `vendor/components/myui`）
   - `wcf init --prefix myui --lang js --out vendor/components/myui`

3) button を追加（依存もあれば一緒に入る）
   - `wcf add button --prefix myui --lang js --out vendor/components/myui`
   - 注意: `main` に install metadata（`decl.custom.install`）がまだ無い場合は `--local` を使ってローカルの upstream を指定します  
     - 例：`wcf add button --prefix myui --lang js --out vendor/components/myui --local /ABS/PATH/TO/web-components-factory`

4) `index.html` を作る（importmap を反映）
   - 生成された `vendor/components/myui/importmap.snippet.json` の `imports` を読み込み、同じ内容を `index.html` の `<script type="importmap">` に入れる
   - `index.html` では `@wcf/button`（= autoload wrapper）を import して定義を走らせる

## 生成する `index.html`（要件）
- `<myui-button variant="solid">テスト</myui-button>` を1つ置く
- `type="module"` で `import "@wcf/button";` を実行する

## 追加の確認（任意）
- `wcf detach button` を実行し、以後 `wcf add button` で vendor 内の button 関連ファイルが上書きされないことを確認する

## 出力してほしいもの
- 実行したコマンド（コピペできる形）
- 作成/更新したファイル一覧
- `index.html` の中身
