# デザイントークン管理ガイド

## 概要

このプロジェクトでは、デジタル庁の公式デザインシステムトークン（[@digital-go-jp/design-tokens](https://www.npmjs.com/package/@digital-go-jp/design-tokens)）を使用しています。

## 🔄 自動更新システム

### 1. 自動更新の仕組み

デザイントークンは以下の3つの方法で自動更新されます：

1. **GitHub Actions（推奨）**
   - 毎週月曜日の朝に自動実行
   - 新バージョンを検出すると自動でPull Request作成
   - 型チェックも自動実行

2. **手動実行**
   ```bash
   # 最新バージョンをチェック
   npm run check-tokens
   
   # デザイントークンを更新
   npm run update-tokens
   ```

3. **依存関係更新時**
   ```bash
   # package.jsonも同時に更新
   npm install @digital-go-jp/design-tokens@latest
   npm run update-tokens
   ```

### 2. 更新プロセス

1. **検出**: 新しいバージョンのチェック
2. **ダウンロード**: 公式パッケージから最新のtokens.cssを取得
3. **解析**: CSSカスタムプロパティを抽出
4. **生成**: TypeScriptファイル（`packages/styles/design-tokens/index.ts`）を自動生成
5. **検証**: 型チェックを実行
6. **コミット**: 変更を自動コミット&PR作成

## 📁 ファイル構成

```
├── packages/styles/design-tokens/
│   ├── index.ts                     # メイン: applyDADSTokens()関数
│   └── accordion-tokens.ts          # コンポーネント固有トークン
├── scripts/
│   └── update-design-tokens.js      # 更新スクリプト
├── .github/workflows/
│   └── update-design-tokens.yml     # GitHub Actions設定
└── docs/
    └── design-tokens-management.md  # このファイル
```

## 🎨 利用方法

### 基本的な使い方

```typescript
import { applyDADSTokens } from '../styles/design-tokens/index.js';
import { withReset } from '../styles/reset-css.js';

class MyComponent extends WebComponent {
  static definition = {
    name: 'my-component',
    template: html`<div part="content">コンテンツ</div>`,
    styles: withReset([
      applyDADSTokens(),  // デジタル庁トークンを適用
      css`
        :host {
          color: var(--color-text-primary);
          background: var(--color-background);
          border-radius: var(--border-radius-8);
        }
        
        [part="content"]:focus-visible {
          background: var(--color-primitive-yellow-300);
          outline: 2px solid var(--color-neutral-black);
        }
      `
    ])
  };
}
```

### 利用可能なトークン

#### カラートークン
- **プリミティブカラー**: `--color-primitive-{color}-{weight}`
  - Blue, Light Blue, Cyan, Green, Lime, Yellow, Orange, Red, Magenta, Purple
  - 重み: 50, 100, 200, ..., 1200
- **ニュートラルカラー**: `--color-neutral-{type}-{weight}`
- **セマンティックカラー**: `--color-semantic-{type}-{number}`

#### コンポーネントエイリアス
- `--color-primary`, `--color-text-primary`, `--color-border`
- `--component-font-family`, `--component-border-radius`

#### タイポグラフィ
- `--font-size-{size}`: 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 45, 48, 57, 64
- `--line-height-{height}`: 100, 120, 130, 140, 150, 160, 170, 175
- `--font-weight-{weight}`: 400, 700

#### レイアウト
- `--border-radius-{size}`: 4, 6, 8, 12, 16, 24, 32, full
- `--elevation-{level}`: 1～8（ボックスシャドウ）

## 🔧 カスタマイズ

### コンポーネント固有トークンの追加

`packages/styles/design-tokens/accordion-tokens.ts` のようにコンポーネント固有のトークンファイルを作成：

```typescript
export const myComponentTokens = css`
  :host {
    --my-component-spacing: var(--spacing-16);
    --my-component-color: var(--color-primary);
  }
`;
```

### エイリアストークンのカスタマイズ

`scripts/update-design-tokens.js` の `generateTypeScriptContent` 関数内でエイリアストークンを編集できます。

## 🚨 トラブルシューティング

### よくある問題

1. **トークンが未定義**
   ```
   --color-primitive-yellow-300 is not defined
   ```
   **解決**: `npm run update-tokens` を実行

2. **型エラー**
   ```
   Property 'applyDADSTokens' does not exist
   ```
   **解決**: インポートパスを確認、`npm run type-check` を実行

3. **古いトークンの使用**
   **解決**: `npm run check-tokens` でバージョン確認、更新が必要な場合は手動実行

### 手動修復

```bash
# 1. 依存関係を最新に更新
npm install @digital-go-jp/design-tokens@latest

# 2. トークンファイルを再生成
npm run update-tokens

# 3. 型チェック
npm run type-check

# 4. 動作確認
bun server.ts
# http://localhost:3000/?component=accordion でテスト
```

## 📋 更新チェックリスト

新バージョン適用時の確認項目：

- [ ] `npm run update-tokens` が正常に実行される
- [ ] `npm run type-check` がエラーなく完了
- [ ] フォーカススタイル（黄色背景+黒枠線）が表示される
- [ ] 既存コンポーネントのスタイルに問題がない
- [ ] 新しいトークンの変更点をREADMEに反映

## 🔗 参考リンク

- [デジタル庁デザインシステム（Figma）](https://www.figma.com/community/file/1255349027535859598)
- [@digital-go-jp/design-tokens（npm）](https://www.npmjs.com/package/@digital-go-jp/design-tokens)
- [デジタル庁デザイントークンリポジトリ](https://github.com/digital-go-jp/design-tokens)
- [デザインシステム活用ガイド](https://www.digital.go.jp/policies/servicedesign/designsystem/)

## 📝 更新履歴

- **2025-08-29**: 自動更新システム導入（v1.1.1対応）
- **2025-08-29**: GitHub Actions追加
- **2025-08-29**: 完全なプリミティブカラー実装