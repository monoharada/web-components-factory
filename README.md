# Web Components Factory

TypeScriptで実装された Web Components ライブラリとコンポーネント集。デジタル庁デザインシステムに準拠した高品質なコンポーネントを提供します。

## 🚀 起動方法

```bash
# Bunで開発サーバーを起動（TypeScript自動トランスパイル対応）
bun server.ts
```

http://localhost:3000/ にアクセスして、コンポーネントビューアが表示されます。

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
bun server.ts

# TypeScriptの型チェック
tsc --noEmit packages/core/web-components.ts --strict

# 特定コンポーネントのコンパイル（必要な場合）
tsc packages/components/accordion.ts --target ES2020 --module ES2020
```

## ⚠️ 注意事項

- **HTMLファイルの作成について**: 新しいデモHTMLファイルを作成する代わりに、`viewer.html`を使用してください
- **TypeScriptコンパイル**: `server.ts`が自動的に.tsファイルをトランスパイルします
- **インポート**: TypeScriptファイルでも`.js`拡張子でインポートしてください（ESモジュール仕様準拠）
