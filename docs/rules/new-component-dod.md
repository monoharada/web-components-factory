# 新規コンポーネント Definition of Done (DoD)

このドキュメントは、新規コンポーネントをリポジトリに追加する際の「完了の定義（DoD）」を規定します。

## 概要

新規コンポーネントは以下を満たすことでマージ可能となります：

1. **CEM（Custom Elements Manifest）** に正しく登録される
2. **JSDoc** でメタデータが完備している
3. **Demos** が viewer.html / src/demos.ts に追加されている
4. **テスト** が存在し、CI がパスする
5. **検証コマンド** が全てパスする

---

## 必須チェックリスト

### (A) CEM (Single Source of Truth)

Custom Elements Manifest (`custom-elements.json`) はこのリポジトリにおけるコンポーネントAPIの「単一の真実」です。

- [ ] JSDoc で `@customElement` + `@tagname` を記載（CEM抽出保証）
- [ ] `npm run cem:analyze` 実行後、`custom-elements.json` に差分があればコミット
- [ ] sanity テストがパス（tagName存在、bogus event無し）

**参照**: [Custom Elements Manifest 運用](../knowledge/custom-elements-manifest.md)

### (B) JSDoc Metadata

コンポーネントクラスのJSDocには以下を記載します：

| タグ | 必須 | 説明 |
|-----|------|------|
| `@customElement` | ✅ | CEM抽出のマーカー |
| `@tagname dads-<name>` | ✅ | タグ名（canonical prefix） |
| `@attr {type} name - 説明` | ✅ | 公開属性（型付き） |
| `@slot name - 説明` | ✅ | 公開スロット |
| `@csspart name - 説明` | ✅ | 公開 CSS Part |
| `@fires event-name - 説明` | ✅ | 公開イベント |
| `@cssprop --dads-<name>-* - 説明` | 推奨 | 公開 CSS Properties（style API） |
| `@deprecated reason` | 条件付 | 非推奨APIがある場合 |

**属性の型記法例**:
- `@attr {string} variant - バリアント ('solid' \| 'outlined')`
- `@attr {boolean} disabled - 無効状態`
- `@attr {'sm' \| 'md' \| 'lg'} size - サイズ`

### (C) Prefix / Define / Import

- [ ] tagName は canonical `dads-*` で定義
- [ ] import は `.js` 拡張子運用を維持
- [ ] `packages/autoload/dads/<component>.ts` に Autoloader アダプタ追加

**例**: `packages/autoload/dads/my-component.ts`
```typescript
import { DadsMyComponent, defineMyComponent } from '../../components/my-component/index.js';

defineMyComponent();

export default DadsMyComponent;
```

### (D) Demos (Viewer Rule)

- [ ] `src/demos.ts` にデモ関数追加
- [ ] `viewer.html` にセレクタオプション追加
- [ ] **新規HTMLファイルは作成禁止**

**参照**: [コンポーネント雛形](../knowledge/component-skeleton.md)

### (E) 検証コマンド

以下が全てパスすること：

```bash
npm run cem:analyze     # CEM生成
npm run validate:wc     # マークアップ検証
npm run test:run        # 単体テスト
npm run type-check      # 型チェック
npm run ci              # CI pipeline
```

---

## 推奨項目

以下は必須ではありませんが、品質向上のため推奨します：

- [ ] `@cssprop` で CSS 変数 API を記載（cssProperties 充実方針）
- [ ] `a11yAnnotations` を記載（categories / callouts）
- [ ] unit test で ARIA 状態変化、キーボード操作、イベント発火を確認
- [ ] E2E / Fidelity テストを `e2e-evidence/` に追加

---

## JSDoc テンプレート

新規コンポーネント作成時は以下のテンプレートを使用してください：

```typescript
/**
 * @module <component-name>
 * <コンポーネントの簡潔な説明>
 * @version 1.0.0
 */

import {
  html,
  css,
  BooleanAttr,
  PropertyAttr,
} from '../../core/web-components.js';
import { TypographyWebComponent } from '../../core/typography/typography-web-component.js';
import { applyDADSTokens } from '../../styles/design-tokens/index.js';
import { applySpacingTokens } from '../../styles/spacing-tokens.js';
import { withReset } from '../../styles/reset-css.js';
import { componentTokens } from './<component>-tokens.js';
import { componentStyles } from './<component>-styles.js';

/**
 * <ComponentName>コンポーネント
 *
 * @customElement dads-<component-name>
 * @tagname dads-<component-name>
 *
 * @slot default - デフォルトスロットの説明
 * @slot icon - アイコンスロット（オプション）
 *
 * @csspart base - ルート要素
 * @csspart label - ラベル要素
 *
 * @attr {string} variant - バリアント ('solid' | 'outlined')
 * @attr {'sm' | 'md' | 'lg'} size - サイズ
 * @attr {boolean} disabled - 無効状態
 *
 * @cssprop --dads-<component>-background - 背景色
 * @cssprop --dads-<component>-color - テキスト色
 * @cssprop --dads-<component>-border-radius - 角丸
 *
 * @fires dads-<event-name> - イベント説明（detail: { value: string }）
 *
 * @example
 * ```html
 * <dads-<component-name> variant="solid" size="md">
 *   コンテンツ
 * </dads-<component-name>>
 * ```
 */
export class Dads<ComponentName> extends TypographyWebComponent {
  static definition = {
    name: 'dads-<component-name>',
    template: html`
      <div part="base">
        <slot></slot>
      </div>
    `,
    styles: withReset([
      applyDADSTokens(),
      applySpacingTokens(),
      componentTokens,
      componentStyles,
    ], 'minimal'),
    attributes: [
      PropertyAttr('variant'),
      PropertyAttr('size'),
      BooleanAttr('disabled'),
    ],
  };

  // Public properties
  declare variant: string | null;
  declare size: string | null;
  declare disabled: boolean;
}
```

---

## コピペ用チェックリスト

PRコメントや自己レビュー用：

```markdown
## 新規コンポーネント DoD チェックリスト

### 必須
- [ ] `@customElement dads-<name>` + `@tagname dads-<name>` をJSDocに記載
- [ ] `@attr` で公開属性を型付き記載
- [ ] `@slot` で公開スロットを記載
- [ ] `@csspart` で公開partを記載
- [ ] `@fires` で公開イベントを記載
- [ ] `npm run cem:analyze` 実行、`custom-elements.json` 更新・コミット
- [ ] `src/demos.ts` にデモ追加
- [ ] `viewer.html` にセレクタ追加
- [ ] `packages/autoload/dads/<component>.ts` 追加
- [ ] `<component>.test.ts` 追加
- [ ] `npm run validate:wc` パス
- [ ] `npm run ci` パス

### 推奨
- [ ] `@cssprop` でCSS変数API記載（cssProperties充実）
- [ ] `a11yAnnotations` 記載（categories/callouts）
- [ ] E2E/Fidelityテスト追加
```

---

## Diagnostics Schema

`validate:wc` が出力する診断情報のスキーマ：

| フィールド | 型 | 説明 |
|-----------|------|------|
| `file` | string | ファイルパス |
| `range` | `{ start: { line, col }, end: { line, col } }` | 位置情報 |
| `severity` | `'error' \| 'warning'` | 重要度 |
| `code` | `'unknownElement' \| 'unknownAttribute'` | 診断コード |
| `message` | string | メッセージ |
| `tagName` | string? | 対象タグ名 |
| `attrName` | string? | 対象属性名 |
| `hint` | string? | 修正ヒント |

新しい診断コードを追加する場合は、このドキュメントを更新してください。

---

## 関連ドキュメント

- [Custom Elements Manifest 運用](../knowledge/custom-elements-manifest.md)
- [Web Components 検証](../knowledge/wctools-validate.md)
- [Design System MCP](../knowledge/design-system-mcp.md)
- [コンポーネント雛形](../knowledge/component-skeleton.md)
- [CSSコーディングルール](../../.claude/skills/css-writing-rules/SKILL.md)
- [ヘッドレスコンポーネント設計](../../.claude/skills/headless-component-design/SKILL.md)

---

**最終更新**: 2026-01-25
**バージョン**: 1.0.0
