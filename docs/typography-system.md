# タイポグラフィシステム設計書

## 🎯 概要

すべてのWeb ComponentsでNoto Sans JPを優先適用し、Web Fontは読み込まない運用とする。

## 🏗️ アーキテクチャ

### 3層構造

```
1. グローバルフォント管理層
   └── ensureFontsInitialized()
       └── Web Fontは読み込まない
       └── bodyクラス管理（初期化のみ）

2. ベースコンポーネント層
   └── TypographyWebComponent
       └── 自動フォント初期化
       └── 読み込み状態同期
       └── ベーススタイル適用

3. 個別コンポーネント層
   └── DadsText等
       └── TypographyWebComponent継承
       └── コンポーネント固有スタイル
```

## 📋 実装詳細

### フォント運用方針

1. **Web Fontは読み込まない**
   - ローカルフォントのみ
   - ネットワーク依存を排除

2. **読み込み状態管理**
   ```javascript
   body.fonts-loaded   // 初期化完了
   body.fonts-error    // エラー時（基本は発生しない）
   ```

### チラツキ対策

```css
/* 読み込み中 */
.fonts-loading {
  letter-spacing: 0.03em; /* わずかに広げる */
}

/* 読み込み完了 */
.fonts-loaded {
  letter-spacing: 0.02em; /* 正常値 */
  transition: letter-spacing 0.1s ease-out;
}
```

文字間隔の微調整はローカルフォント前提の見た目調整。

## 🔧 使用方法

### 方法1: TypographyWebComponent継承（推奨）

```typescript
import { TypographyWebComponent } from '@core/typography';

export class MyComponent extends TypographyWebComponent {
  static definition = {
    name: 'my-component',
    template: html`<div>自動的にNoto Sans JP適用</div>`,
    styles: css`:host { color: blue; }`
  };
}
MyComponent.define();
```

### 方法2: 既存コンポーネントへの適用

```typescript
import { WebComponent } from '@core/web-components';
import { baseTypographyStyles, ensureFontsInitialized } from '@core/typography';

export class MyComponent extends WebComponent {
  constructor() {
    super();
    ensureFontsInitialized(); // 手動初期化
  }
  
  static definition = {
    name: 'my-component',
    template: html`...`,
    styles: [
      baseTypographyStyles, // スタイル追加
      css`...`
    ]
  };
}
```

### 方法3: グローバル初期化

```html
<script type="module">
  import { initializeGlobalFonts } from '@core/typography';
  
  // アプリケーション起動時に一度だけ実行
  initializeGlobalFonts(); // Web Fontは読み込まない
</script>
```

## 🎨 カスタマイズ

### CSS変数

```css
:host {
  /* フォントファミリー変更 */
  --base-font-family: "Custom Font", "Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* モノスペースフォント */
  --mono-font-family: "Fira Code", monospace;
  
  /* 文字間隔調整 */
  letter-spacing: 0.05em;
}
```

## ⚡ パフォーマンス

### 最適化ポイント

1. **単一インスタンス管理**
   - フォント読み込みは一度だけ
   - 重複読み込み防止

2. **遅延読み込み**
   - コンポーネント初回使用時に読み込み
   - 不要な場合は読み込まない

3. **キャッシュ活用**
   - ブラウザキャッシュ
   - CDNキャッシュ

### メトリクス

| 指標 | 値 | 備考 |
|------|-----|------|
| 初回読み込み | ~300ms | CDN依存 |
| 2回目以降 | 0ms | キャッシュ利用 |
| FOUT期間 | <100ms | font-display: swap |
| メモリ使用量 | 最小 | 単一インスタンス |

## 🔍 デバッグ

### 読み込み状態確認

```javascript
// コンソールで実行
document.body.className; // fonts-loaded等を確認

// Font Loading API
document.fonts.ready.then(() => {
  console.log('All fonts loaded');
});

  // 個別フォント確認（ブラウザサポートに依存）
  document.fonts.check('16px "Noto Sans JP"'); // true/false
```

### トラブルシューティング

| 問題 | 原因 | 解決策 |
|------|------|--------|
| フォントが適用されない | ローカル未インストール | フォールバックフォントを確認 |
| チラツキが目立つ | ネットワーク遅延 | セルフホスティング検討 |
| フォールバックのまま | 読み込みエラー | fonts-errorクラス確認 |

## 📚 関連ファイル

- `/packages/core/typography/typography-web-component.ts` - ベースクラス
- `/packages/core/typography/base-typography-styles.ts` - スタイル定義
- `/packages/core/typography/font-loader.ts` - 高度なローダー
- `/packages/components/typography/dads-text.ts` - 実装例

## 🚀 今後の改善案

### Phase 1（現在）
- ✅ Web Fontなし運用
- ✅ 基本的な見た目調整
- ✅ 自動適用システム

### Phase 2（次期）
- セルフホスティング（必要なら検討）
- サブセット化（使用文字のみ）
- Service Worker キャッシュ

### Phase 3（将来）
- Variable Fonts対応
- 動的ウェイト調整
- ダークモード最適化

## 📝 メモ

- **Shape Up原則**: 完璧より動作を優先
- **現在の解決策**: CDNで即座に動作
- **技術的負債**: セルフホスティング未対応（意図的）

---

*最終更新: 2025-09-02*
*作成者: Claude Code*
*バージョン: 1.0.0*
