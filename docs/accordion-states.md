# アコーディオンコンポーネント状態仕様

## デジタル庁デザインシステム v2.7.0 準拠

### Figmaデザインスペック参照
- **デフォルト状態**: [node-id=8201-29160](https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.7.0?node-id=8201-29160&m=dev)
- **ホバー状態**: [node-id=8201-29177](https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.7.0?node-id=8201-29177&m=dev)

## 状態定義

### 1. デフォルト状態
```css
[part="summary"] {
  background-color: transparent;
  border-bottom: 1px solid var(--color-neutral-solid-gray-420);
}

[part="icon"] {
  border: 1px solid var(--color-primitive-blue-1000);
  background-color: var(--color-neutral-white);
}
```

### 2. ホバー状態（:hover）
```css
[part="summary"]:hover {
  /* 背景色が薄いグレーに変化 */
  background-color: var(--color-neutral-solid-gray-50); /* #f2f2f2 */
}

[part="summary"]:hover [part="icon"] {
  /* アイコンのボーダーが太くなる */
  border-width: 3px;
  padding: 4px; /* サイズ維持のための調整 */
}
```

### 3. フォーカス状態（:focus-visible）
```css
[part="summary"]:focus-visible {
  /* 黄色の背景 + 黒いアウトライン */
  /* 疑似要素で実装 */
}

[part="summary"]:focus-visible::before {
  background-color: var(--color-primitive-yellow-300); /* #ffd43d */
}

[part="summary"]:focus-visible::after {
  border: 4px solid var(--color-neutral-black);
}
```

### 4. アクティブ状態（:active）
```css
[part="summary"]:active {
  /* より濃いグレー背景 */
  background-color: var(--color-neutral-solid-gray-100); /* #e6e6e6 */
}
```

### 5. 展開状態（[open]）
```css
details[open] [part="icon"] svg {
  /* アイコンが180度回転 */
  transform: rotate(180deg);
}
```

### 6. 無効状態（[disabled]）
```css
:host([disabled]) [part="summary"] {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}
```

## インタラクション詳細

### マウス操作
1. **ホバー時**
   - summaryの背景色が薄いグレーに変化
   - アイコンのボーダーが1px→3pxに太くなる
   - トランジション: 0.2秒でスムーズに変化

2. **クリック時（アクティブ）**
   - summaryの背景色がより濃いグレーに
   - 即座に反応（トランジションなし）

### キーボード操作
1. **Tab キー**
   - フォーカスインジケータ表示（黄色背景 + 黒枠）
   
2. **Enter/Space キー**
   - アコーディオンの開閉トグル
   - アクティブ状態の視覚フィードバック

### タッチ操作（モバイル）
1. **タップ**
   - アクティブ状態の視覚フィードバック
   - ホバー効果は適用されない

## アクセシビリティ配慮

### WCAG 2.2 AA準拠
- **2.1.1 キーボード**: すべての機能がキーボードで操作可能
- **2.4.7 フォーカスの可視化**: 明確なフォーカスインジケータ
- **1.4.3 コントラスト（最小）**: テキストと背景のコントラスト比4.5:1以上

### 支援技術対応
- スクリーンリーダーで正しく読み上げ
- ARIAステートの適切な更新
- セマンティックHTML（details/summary）使用

## トークン使用

### カラートークン
- `--color-neutral-solid-gray-50`: ホバー背景色
- `--color-neutral-solid-gray-100`: アクティブ背景色
- `--color-neutral-solid-gray-420`: ボーダー色
- `--color-primitive-blue-1000`: アイコンボーダー色
- `--color-primitive-yellow-300`: フォーカス背景色
- `--color-neutral-black`: フォーカスアウトライン色

### その他のトークン
- `--border-radius-8`: 角丸
- `--font-size-16`: テキストサイズ
- `--line-height-150`: 行高

## テスト確認項目

### 視覚的確認
- [ ] デフォルト状態が正しく表示される
- [ ] ホバー時に背景色が変化する
- [ ] アイコンのボーダーが太くなる
- [ ] フォーカス時に黄色背景と黒枠が表示される
- [ ] アクティブ時に濃いグレー背景になる

### 機能確認
- [ ] クリックで開閉が動作する
- [ ] キーボードで操作できる
- [ ] スクリーンリーダーで正しく読み上げられる
- [ ] モバイルでタップ操作が正常に動作する

### パフォーマンス確認
- [ ] トランジションがスムーズ（60fps）
- [ ] 大量のアイテムでも問題なく動作
- [ ] メモリリークがない

## 実装ファイル

- `/packages/components/accordion.ts` - コンポーネント本体
- `/packages/styles/accordion-styles.ts` - スタイル定義
- `/packages/styles/design-tokens/accordion-tokens.ts` - トークン定義
- `/packages/styles/design-tokens/index.ts` - DADSトークン

## 参考リンク

- [デジタル庁デザインシステム](https://design.digital.go.jp/)
- [Figma Community - v2.7.0](https://www.figma.com/community/file/1377880368787735577/v2-7-0)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)