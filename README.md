# Web Components Factory

TypeScriptで実装された Web Components ライブラリとコンポーネント集。

## 🚀 起動方法

```bash
# Bunで開発サーバーを起動（TypeScriptを直接実行）
bun --hot view.html
```

http://localhost:3000/ にアクセスして、コンポーネントビューアが表示されます。

## 📦 利用可能なコンポーネント

### Component Viewer (`view.html`)
すべてのコンポーネントを確認できる統一ビューア。URLパラメータでコンポーネントを切り替え：

- `http://localhost:3000/?component=accordion` - アコーディオン（details/summary版）
- `http://localhost:3000/?component=accordion-improved` - アコーディオン（改善版）
- `http://localhost:3000/?component=adaptive-card` - アダプティブカード

## 🏗 プロジェクト構造

```
web-components-factory/
├── view.html              # 統一コンポーネントビューア
├── web-components.ts      # コアライブラリ
├── src/
│   ├── dads-accordion-details.ts    # アコーディオン実装
│   ├── dads-accordion-improved.ts   # 改善版アコーディオン
│   ├── design-tokens.ts             # デザイントークン
│   └── adaptive-card-semantic.js    # アダプティブカード
├── docs/                  # ドキュメント
└── CLAUDE.md             # Claude Code用ガイドライン
```

## 📋 開発ガイドライン

### 重要な原則
1. **::part() を使用** - Shadow DOM内の要素はクラスではなく`part`属性でスタイリング
2. **ネイティブHTML優先** - `details/summary`、`dialog`など適切な要素を使用
3. **TypeScript厳格モード** - `any`型の使用禁止
4. **アクセシビリティファースト** - WCAG 2.1 AA準拠

詳細は [CLAUDE.md](./CLAUDE.md) と [WEB_COMPONENTS_GUIDELINES.md](./WEB_COMPONENTS_GUIDELINES.md) を参照。

## 🛠 開発コマンド

```bash
# 開発サーバー起動（Bun）
bun --hot view.html

# TypeScriptの型チェック
tsc --noEmit

# 特定コンポーネントのコンパイル（必要な場合）
tsc src/component.ts --target ES2020 --module ES2020
```

## ⚠️ 注意事項

- **HTMLファイルの作成について**: 新しいデモHTMLファイルを作成する代わりに、`view.html`を使用してください
- **TypeScriptコンパイル**: Bunを使用することで、TypeScriptファイルを直接実行できます
