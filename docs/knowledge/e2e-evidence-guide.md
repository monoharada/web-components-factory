# E2Eエビデンス取得ガイド（Playwright MCP）

## 目次
- [概要](#概要)
- [前提条件](#前提条件)
- [基本的な流れ](#基本的な流れ)
- [エージェント呼び出し方法](#エージェント呼び出し方法)
- [テストシナリオ設計](#テストシナリオ設計)
- [ファイル命名規則](#ファイル命名規則)
- [Shadow DOM対応](#shadow-dom対応)
- [エビデンス整理](#エビデンス整理)
- [プロンプトテンプレート](#プロンプトテンプレート)

---

## 概要

Playwright MCPを使用してWeb Componentsのブラウザ操作を自動化し、スクリーンショットと動画でエビデンスを取得する方法をまとめる。

### 取得できるエビデンス
- **スクリーンショット**: 各操作ステップごとのPNG画像
- **動画**: 操作全体の流れを記録したWebM動画
- **検証結果**: aria-invalid、テキスト内容などの状態確認

---

## 前提条件

### 1. 開発サーバーの起動

```bash
# サーバー起動
bun server.ts

# 確認
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# → 200 が返ればOK
```

### 2. 対象URLの確認

```
http://localhost:3000/?component={コンポーネント名}
```

例:
- `?component=textareaValidation` - テキストエリアバリデーション
- `?component=button` - ボタンデモ
- `?component=accordion` - アコーディオン

### 3. エビデンス保存ディレクトリ

```bash
# 存在確認・作成
mkdir -p e2e-evidence
```

---

## 基本的な流れ

```
1. サーバー起動確認
    ↓
2. テストシナリオ設計
    ↓
3. playwright-automation-expert エージェント呼び出し
    ↓
4. スクリーンショット + 動画取得
    ↓
5. エビデンス確認・整理
```

---

## エージェント呼び出し方法

### Task toolを使用

```typescript
// Claude Code内での呼び出し
Task({
  description: "E2E evidence capture",
  prompt: "...(詳細なプロンプト)...",
  subagent_type: "playwright-automation-expert"
})
```

### 重要なポイント

1. **subagent_type**: 必ず `playwright-automation-expert` を指定
2. **プロンプト**: 以下を明確に記載
   - 対象URL
   - 操作手順（ステップバイステップ）
   - スクリーンショット/動画のファイル名
   - 保存先ディレクトリ（絶対パス）
   - 期待する結果

---

## テストシナリオ設計

### シナリオの種類

| シナリオ | 目的 | 例 |
|---------|------|-----|
| 初期状態確認 | コンポーネントが正しくレンダリングされているか | ボタン表示、フォーム初期値 |
| ユーザー操作 | インタラクションが正しく動作するか | クリック、入力、フォーカス |
| バリデーション | エラー処理が正しく動作するか | 必須エラー、文字数制限 |
| 状態遷移 | 状態変化が正しく反映されるか | 開閉、有効/無効 |

### シナリオ設計テンプレート

```markdown
### シナリオ: {シナリオ名}

**目的**: {何を検証するか}

**手順**:
1. {操作1}
2. スクリーンショット取得: `{ファイル名}.png`
3. {操作2}
4. スクリーンショット取得: `{ファイル名}.png`
5. ...

**期待結果**:
- {期待する状態1}
- {期待する状態2}
```

### 実例: テキストエリアバリデーション

```markdown
### シナリオ1: 必須バリデーション
**目的**: 必須フィールド未入力時のエラー表示確認

**手順**:
1. ページにアクセス
2. 初期状態スクリーンショット: `01-initial-state.png`
3. 送信ボタンをクリック（未入力のまま）
4. エラー表示スクリーンショット: `02-validation-error.png`

**期待結果**:
- エラーメッセージ「この項目は入力が必須です」表示
- aria-invalid="true" が設定される
- 赤いボーダーでエラー状態を視覚的に表示

### シナリオ2: 文字数制限バリデーション
**目的**: 最大文字数超過時のエラー表示確認

**手順**:
1. 文字数制限のあるtextareaを特定（maxlength=15）
2. 16文字以上入力: "これは16文字以上のテキストです"
3. 入力状態スクリーンショット: `03-char-exceeded.png`
4. フォーカスを外す（blur）
5. エラー表示スクリーンショット: `04-char-error.png`

**期待結果**:
- カウンター表示: "16/15"（赤色）
- エラーメッセージ「入力できる文字数を超えています」
- aria-invalid="true"
```

---

## ファイル命名規則

### スクリーンショット

```
{連番2桁}-{状態の説明}.png
```

例:
- `01-initial-state.png` - 初期状態
- `02-after-input.png` - 入力後
- `03-validation-error.png` - バリデーションエラー
- `04-fixed-state.png` - 修正後

### 動画

```
{機能名}-recording-{タイムスタンプ}.webm
```

例:
- `textarea-validation-recording-20260107-172008.webm`
- `char-limit-validation-recording-20260107-172440.webm`

### サブシナリオがある場合

```
{連番2桁}{サブ記号}-{状態の説明}.png
```

例:
- `02a-textarea-with-input.png`
- `02b-after-reset.png`

---

## Shadow DOM対応

### Web Componentsの特徴

このプロジェクトのコンポーネントはShadow DOMを使用している。
Playwright MCPはShadow DOM内の要素にもアクセス可能。

### セレクタの書き方

```javascript
// Light DOM要素
page.locator('dads-button')

// Shadow DOM内の要素（Playwrightは自動的にShadow DOMを貫通）
page.locator('dads-textarea').locator('textarea')

// part属性を使用
page.locator('dads-button::part(button)')
```

### 注意点

1. **カスタム要素のロード待ち**: `customElements.whenDefined()` を待つ
2. **Shadow DOM内の要素**: Playwrightは自動的に貫通するが、複雑な場合は `evaluate()` を使用
3. **aria属性の確認**: `getAttribute('aria-invalid')` などで状態確認

---

## エビデンス整理

### ディレクトリ構造

```
e2e-evidence/
├── README.md                    # エビデンス一覧と説明
├── EVIDENCE-SUMMARY.md          # 詳細なテスト結果
├── 01-initial-state.png         # スクリーンショット
├── 02-after-input.png
├── ...
├── textarea-validation-recording-*.webm  # 動画
└── test-script.mjs              # 再実行用スクリプト（オプション）
```

### README.mdテンプレート

```markdown
# E2Eエビデンス

## 対象
- URL: http://localhost:3000/?component=textareaValidation
- 取得日: 2026-01-07

## エビデンス一覧

### スクリーンショット
| ファイル | 内容 |
|---------|------|
| 01-initial-state.png | 初期状態 |
| 02-validation-error.png | バリデーションエラー |
| ... | ... |

### 動画
| ファイル | 内容 | サイズ |
|---------|------|-------|
| textarea-validation-recording-*.webm | ボタン操作フロー | 466KB |
| ... | ... | ... |

## 確認結果
- [x] コンポーネントが正しくレンダリングされる
- [x] バリデーションが正しく動作する
- [x] エラーメッセージがDADS準拠
```

---

## プロンプトテンプレート

### スクリーンショット取得用

```markdown
Use Playwright MCP to capture E2E evidence for {コンポーネント名}.

## Target URL
http://localhost:3000/?component={コンポーネント名}

## Test Scenarios with Screenshots

### Scenario 1: {シナリオ名}
1. Navigate to the URL
2. Wait for page to fully load
3. Take screenshot: `{ファイル名}.png`
4. {操作}
5. Take screenshot: `{ファイル名}.png`

### Scenario 2: ...

## Output Requirements
- Save to: /Users/.../e2e-evidence/
- Resolution: 1280x720 or higher

## Key Points
- The page uses Shadow DOM components ({コンポーネント一覧})
- Report back all file paths
```

### 動画取得用

```markdown
Use Playwright MCP to capture VIDEO RECORDING of {コンポーネント名}.

## Target URL
http://localhost:3000/?component={コンポーネント名}

## IMPORTANT: Video Recording Required

## Test Flow (Single Video)
1. Navigate to URL
2. Wait for page load (pause 2 seconds)
3. {操作1 - ゆっくり実行}
4. Pause 2 seconds
5. {操作2}
6. Pause 3 seconds
7. End recording

## Video Output Requirements
- Save to: /Users/.../e2e-evidence/
- Filename: {機能名}-recording-{timestamp}.webm
- Format: webm
- Resolution: 1280x720

## Key Points
- Use slow interactions (200ms per character for typing)
- Add pauses between actions for visibility
- Shadow DOM components: {コンポーネント一覧}
```

### 複合テンプレート（スクリーンショット + 動画）

```markdown
Use Playwright MCP to capture E2E evidence with SCREENSHOTS and VIDEO.

## Target URL
http://localhost:3000/?component={コンポーネント名}

## Test Scenarios

### Scenario 1: {シナリオ名}
**Screenshots**:
- `01-{状態}.png` - {説明}
- `02-{状態}.png` - {説明}

**Video Flow**:
1. {操作} (pause 2s)
2. {操作} (pause 2s)
...

## Output
- Screenshots: /Users/.../e2e-evidence/
- Video: {機能名}-recording-{timestamp}.webm

## Validation Points
- {検証項目1}
- {検証項目2}
```

---

## トラブルシューティング

### サーバーが起動していない

```bash
# 確認
curl http://localhost:3000/
# → Connection refused

# 解決
bun server.ts
```

### コンポーネントが見つからない

```bash
# URLパラメータの確認
# ?component= の値がdemos.tsで定義されているか確認
```

### Shadow DOM内の要素にアクセスできない

```javascript
// evaluate()を使用
await page.evaluate(() => {
  const component = document.querySelector('dads-textarea');
  const shadowRoot = component.shadowRoot;
  const textarea = shadowRoot.querySelector('textarea');
  return textarea.value;
});
```

### 動画が保存されない

- Playwrightの設定で `recordVideo` が有効になっているか確認
- 保存先ディレクトリの権限を確認

---

## 参考リンク

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Video Recording](https://playwright.dev/docs/videos)
- [Shadow DOM Testing](https://playwright.dev/docs/selectors#shadow-dom)
- [DADS Design System](https://design.digital.go.jp/)
