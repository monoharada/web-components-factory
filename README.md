# Web Components Factory

Web Components用のAdaptiveCardコンポーネント実装プロジェクト

## 🎯 主要機能

- **セマンティックHTML5構造**: `<article>`, `<header>`, `<section>`, `<aside>`, `<footer>`
- **アクセシブルなリンクカード**: Stretched Linkパターン実装
- **デジタル庁スタイルフォーカスリング**: 高コントラストキーボードナビゲーション
- **適応的フォーカス制御**: CTAボタン存在時の適切なフォーカス動作
- **WCAG 2.2準拠**: AAレベルアクセシビリティ対応

## 🚀 開発環境

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

## 📁 プロジェクト構成

```
src/
├── adaptive-card-semantic.js  # メインコンポーネント（使用中）
└── old/                      # 開発履歴ファイル（アーカイブ）

index.html                    # デモページ
```

## 🎨 主要実装

### Stretched Linkパターン
```html
<adaptive-card 
    href="https://example.com"
    link-text="リンク先の説明"
    link-target="_blank">
    <h3 slot="title">カードタイトル</h3>
    <p slot="content">カード内容</p>
</adaptive-card>
```

### CTAボタン付きカード
```html
<adaptive-card>
    <h3 slot="title">カードタイトル</h3>
    <p slot="content">カード内容</p>
    <button slot="actions">アクション</button>
</adaptive-card>
```

## 🏆 技術スタック

- **Web Components**: Custom Elements v1, Shadow DOM
- **TypeScript**: ES2022対応
- **Vite**: 開発環境・ビルドツール  
- **モダンCSS**: OKLCH、CSS Layers、Container Queries

## ♿ アクセシビリティ

- デジタル庁レベル高コントラストフォーカスリング
- スクリーンリーダー最適化
- キーボードナビゲーション完全対応
- 意味のある要素のみフォーカス可能