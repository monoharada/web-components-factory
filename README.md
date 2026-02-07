# Web Components Factory

TypeScriptで実装された Web Components ライブラリとコンポーネント集。デジタル庁デザインシステムに準拠した高品質なコンポーネントを提供します。

## 🧰 セットアップ

```bash
npm ci
```

## 🚀 起動方法

```bash
# Bunで開発サーバーを起動（推奨: watchあり）
bun --watch serve.ts

# watchなし（`bun serve.ts` でも通常リロード反映）
bun serve.ts

# npm 経由でもOK（Bunが必要）
npm run dev
```

http://localhost:3000/ にアクセスして、コンポーネントビューアが表示されます。
通常リロードで変更反映できるよう、開発サーバーはHTTPキャッシュを `no-store` で返します。

## 🧩 CEM（Custom Elements Manifest）/ 検証 / MCP（AIネイティブ）

この repo は **CEM を “単一の真実”** として、コンポーネント API・検証・AI向けツールを駆動します。

### 1) CEM（`custom-elements.json`）

- 生成（コミット運用）

```bash
npm run cem:analyze
```

- `package.json` の `"customElements": "custom-elements.json"` を維持し、外部ツールが CEM を発見できるようにしています。
- 詳細: `docs/knowledge/custom-elements-manifest.md`

### 2) CEM 駆動のマークアップ検証（`validate:wc`）

viewer / demos のマークアップを CEM と突き合わせて、unknown element / unknown attribute を検出します。

```bash
npm run validate:wc
```

- 設定: `wc.config.js`（対象は `viewer.html` と `src/demos.ts`）
- 詳細: `docs/knowledge/wctools-validate.md`

### 3) prefix 変更ユーザー向け（CEM の tagName 変換）

canonical は `dads-*` ですが、prefix を変えて運用する利用者向けに tagName だけ置換した CEM を生成できます。

```bash
npm run cem:prefix -- --prefix my-ui
```

### 4) Design System MCP（stdio）

CEM を読み込んで、Design System 向けの “skills（安定した道具）” を提供する MCP サーバーを同梱しています。

```bash
npm run mcp:design-system
```

- tools: `list_components`, `get_component_api`, `generate_usage_snippet`, `validate_markup`
- 詳細: `docs/knowledge/design-system-mcp.md`

### 5) Chrome DevTools MCP（実行時検証）

実行時の Shadow DOM / イベント / a11y を確認したい場合は、Chrome DevTools MCP と `viewer.html` を併用します。

- 詳細: `docs/knowledge/chrome-devtools-mcp.md`

## 🌐 GitHub Pages での公開（Project Pages）

`viewer.html` を静的化して `dist-pages/` に出力し、GitHub Pages で表示できます（`dist-pages/` はコミットせず、CIで生成してデプロイします）。

```bash
# 静的ファイル生成
npm run pages:build

# ローカルプレビュー（デフォルト: http://localhost:3001/）
npm run pages:preview
```

- デプロイは `.github/workflows/pages.yml` で main push をトリガーに実行されます
- GitHub のリポジトリ設定で Pages の Source を **GitHub Actions** に設定してください

## 📦 利用可能なコンポーネント

### Component Viewer (`viewer.html`)
すべてのコンポーネントを確認できる統一ビューア。URLパラメータでコンポーネントを切り替え：

- `http://localhost:3000/?component=accordion` - アコーディオン（details/summary版）
- `http://localhost:3000/?component=resetCss` - リセットCSS適用デモ（Shadow DOM隔離）

## 🏗 プロジェクト構造

```
web-components-factory/
├── packages/
│   ├── core/                        # コアライブラリ
│   │   └── web-components.ts        # Web Components基底クラス
│   ├── components/                  # コンポーネント実装
│   │   ├── accordion.ts            # アコーディオンコンポーネント
│   │   └── reset-card-demo.ts      # リセットCSSデモカード
│   ├── styles/                      # スタイル関連
│   │   ├── design-tokens/          # デザイントークン
│   │   │   └── accordion-tokens.ts # アコーディオン用トークン
│   │   ├── accordion-styles.ts     # アコーディオンスタイル
│   │   └── reset-css.ts            # kiso.css v1.2.2ベースのリセットCSS
│   └── utils/                       # ユーティリティ
│       ├── aria.ts                 # ARIA属性マッピング
│       ├── behaviors.ts            # 共通動作ミックスイン
│       └── dom.ts                  # DOM操作ヘルパー
├── src/
│   └── entry.ts                    # エントリーポイント
├── serve.ts                         # 開発サーバー起動エントリ（watch用）
├── server.ts                        # 開発サーバー（TypeScript対応）
├── viewer.html                      # コンポーネントビューア
└── CLAUDE.md                        # Claude Code用ガイドライン
```

### パッケージ説明

- **core**: Web Components基底クラス、テンプレート、スタイル管理
- **components**: 再利用可能なWeb Components実装
- **styles**: デザイントークン、リセットCSS、コンポーネントスタイル
- **utils**: ARIA、DOM操作、共通動作などのユーティリティ

## 🎨 主な特徴

### 1. Shadow DOM隔離によるリセットCSS
- kiso.css v1.2.2を採用
- Shadow DOM内のみに適用され、既存サイトのスタイルに影響なし
- `withReset()`ヘルパーで選択的適用

### 2. ::part()ベースのスタイリング
- Shadow DOM境界を保ちながら外部からカスタマイズ可能
- クラスベースではなくセマンティックなpart属性を使用

### 3. TypeScript厳格モード
- `any`型の使用禁止
- 完全な型安全性を保証

### 4. コンポーネント名のプレフィックス設定

コンポーネント名のプレフィックス（デフォルト: `dads`）を一括で変更できます。

```typescript
import { setConfig, defineAllComponents } from './packages/system';

// 方法1: グローバル設定を変更
setConfig({ prefix: 'my-ui' });
defineAllComponents();
// → <my-ui-button>, <my-ui-accordion-details> が登録される

// 方法2: 個別にオーバーライド
import { defineButton } from './packages/components/button/button-define';
defineButton('custom');
// → <custom-button> が登録される

// デフォルト（後方互換）
defineAllComponents();
// → <dads-button>, <dads-accordion-details> が登録される
```

**設定API:**
- `getConfig()` - 現在の設定を取得
- `setConfig({ prefix: 'xxx' })` - プレフィックスを変更
- `resetConfig()` - デフォルト設定にリセット
- `getPrefix()` - 現在のprefixを取得（SSR環境でも安全）

## 📋 開発ガイドライン

### 重要な原則
1. **::part() を使用** - Shadow DOM内の要素はクラスではなく`part`属性でスタイリング
2. **ネイティブHTML優先** - `details/summary`、`dialog`など適切な要素を使用
3. **TypeScript厳格モード** - `any`型の使用禁止
4. **アクセシビリティファースト** - WCAG 2.1 AA準拠
5. **Shadow DOM隔離** - リセットCSSはコンポーネント内部のみに適用

詳細は [CLAUDE.md](./CLAUDE.md) を参照。

## 🛠 開発コマンド

```bash
# 開発サーバー起動
bun --watch serve.ts

# CEM生成（custom-elements.json）
npm run cem:analyze

# CEM駆動のマークアップ検証
npm run validate:wc

# TypeScriptの型チェック
npm run type-check

# テスト
npm run test:run

# 一括（type-check + test + build）
npm run ci
```

## ⚠️ 注意事項

- **HTMLファイルの作成について**: 新しいデモHTMLファイルを作成する代わりに、`viewer.html`を使用してください
- **TypeScriptコンパイル**: `serve.ts`（実体は `server.ts`）が自動的に `.ts` をトランスパイルします
- **開発時キャッシュ**: 開発サーバーは `Cache-Control: no-store` を返すため、通常リロードで最新コードを取得します（ハード再読み込み不要）
- **キャッシュを有効化したい場合**: `DEV_DISABLE_HTTP_CACHE=0 bun --watch serve.ts`
- **インポート**: TypeScriptファイルでも`.js`拡張子でインポートしてください（ESモジュール仕様準拠）
