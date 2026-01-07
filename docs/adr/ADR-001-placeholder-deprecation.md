# ADR-001: フォーム入力要素のplaceholder属性非推奨化

## ステータス

**承認済み** (2025-01-07)

## コンテキスト

### 背景

デジタル庁デザインシステム（DADS）に準拠したWebComponentsライブラリを開発している。フォーム入力要素（Textarea、Input等）において、`placeholder`属性の使用がアクセシビリティ上の問題を引き起こすことが判明した。

### DADS公式仕様

**参照**: https://design.digital.go.jp/dads/components/input-text/accessibility/

DADS公式アクセシビリティガイドラインでは、プレースホルダーの使用を非推奨としている。

**理由**:

1. **視認性の問題**: プレースホルダーテキストはコントラスト比が低く、視覚障害者や高齢者にとって視認性が良くない
2. **入力中の消失**: ユーザーが入力を開始すると非表示になり、入力条件を確認するために入力内容を削除する必要がある
3. **スクリーンリーダー対応**: 一部のスクリーンリーダーでは読み上げられない場合や、入力済みテキストとプレースホルダーの判別が困難

### 検討した選択肢

#### 選択肢1: placeholder属性を完全に禁止（エラーをスロー）

**メリット**:
- 強制力が高い
- 誤使用を完全に防止

**デメリット**:
- 既存コードの移行が困難
- 開発者体験の悪化
- 段階的な移行が不可能

#### 選択肢2: 警告のみ出力（属性は機能する）

**メリット**:
- 移行期間を設けられる
- 既存コードが動作し続ける

**デメリット**:
- 警告が無視される可能性
- アクセシビリティ問題が継続

#### 選択肢3: 警告を出力し、内部要素には転送しない（ソフトな禁止）【採用】

**メリット**:
- 開発者に問題を通知
- 実際には機能しないため移行を促進
- 段階的な移行が可能
- 将来的な完全禁止への布石

**デメリット**:
- 属性設定自体はエラーにならない

## 決定

**選択肢3「警告を出力し、内部要素には転送しない（ソフトな禁止）」を採用する。**

### 実装方針

1. `placeholder`属性を`observedAttributes`から除外
2. `connectedCallback`でplaceholder属性の存在をチェックし、開発モードで警告を出力
3. 内部のネイティブ要素（`<textarea>`、`<input>`）にはplaceholder値を転送しない
4. 代替として`support-text`属性を推奨

### 技術的実装

#### 非推奨属性ユーティリティ

```typescript
// packages/utils/deprecated-attrs.ts
export interface DeprecatedAttrConfig {
  name: string;
  reason: string;
  alternative: string;
  docsUrl?: string;
}

export const DEPRECATED_FORM_ATTRS: DeprecatedAttrConfig[] = [
  {
    name: 'placeholder',
    reason: 'プレースホルダーはコントラスト比が低く、入力中に消えるためアクセシビリティ上の問題があります',
    alternative: 'support-text属性を使用してください',
    docsUrl: 'https://design.digital.go.jp/dads/components/input-text/accessibility/'
  }
];

export function warnDeprecatedAttr(
  element: HTMLElement,
  attrName: string,
  config: DeprecatedAttrConfig
): void {
  if (process.env.NODE_ENV === 'production') return;

  console.warn(
    `[DADS Warning] <${element.tagName.toLowerCase()}>: "${attrName}" 属性は非推奨です。\n` +
    `理由: ${config.reason}\n` +
    `代替: ${config.alternative}\n` +
    `詳細: ${config.docsUrl ?? ''}`
  );
}

export function checkDeprecatedAttrs(
  element: HTMLElement,
  deprecatedAttrs: DeprecatedAttrConfig[] = DEPRECATED_FORM_ATTRS
): string[] {
  const foundDeprecated: string[] = [];
  for (const config of deprecatedAttrs) {
    if (element.hasAttribute(config.name)) {
      warnDeprecatedAttr(element, config.name, config);
      foundDeprecated.push(config.name);
    }
  }
  return foundDeprecated;
}
```

#### コンポーネント側の実装

```typescript
// packages/components/textarea/textarea.ts
import { checkDeprecatedAttrs, DEPRECATED_FORM_ATTRS } from '../../utils/deprecated-attrs.js';

connectedCallback() {
  super.connectedCallback();

  // 非推奨属性のチェック（警告を出力）
  checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);

  // ...
}

#syncTextareaAttributes() {
  // placeholder は非推奨: 内部textareaには転送しない
  const transferAttrs = ['maxlength', 'name']; // 'placeholder' 除外
  // ...
}
```

### 使用例

```html
<!-- ❌ 非推奨: 警告が出力され、placeholderは表示されない -->
<dads-textarea placeholder="入力例: 山田太郎"></dads-textarea>

<!-- ✅ 推奨: support-textを使用 -->
<dads-textarea
  label="お名前"
  support-text="入力例: 山田太郎"
  required
></dads-textarea>
```

### support-textの優位性

| 項目 | placeholder | support-text |
|------|-------------|--------------|
| 入力中の表示 | 消失する | 常に表示 |
| コントラスト比 | 低い（グレー） | 高い（標準テキスト色） |
| スクリーンリーダー | 不安定 | `aria-describedby`で確実に関連付け |
| 複数行テキスト | 不可 | 可能 |

## 影響

### 変更対象ファイル

| ファイル | 変更種別 | 説明 |
|---------|---------|------|
| `packages/utils/deprecated-attrs.ts` | 新規作成 | 非推奨属性ユーティリティ |
| `packages/components/textarea/textarea.ts` | 修正 | placeholder禁止実装 |
| `packages/components/textarea/textarea.test.ts` | 修正 | 非推奨属性テスト追加（4件） |
| `docs/architecture/design-philosophy.md` | 修正 | アクセシビリティセクション追加 |
| `.claude/skills/headless-component-design/SKILL.md` | 修正 | Decision Treeに追加 |
| `.claude/skills/headless-component-design/references/accessibility.md` | 新規作成 | アクセシビリティ参照ドキュメント |
| `docs/knowledge/learnings.md` | 修正 | 学び追記 |

### 今後の対応が必要なコンポーネント

- [ ] `<dads-input>` - 同様の実装を適用
- [ ] `<dads-select>` - 同様の実装を適用
- [ ] その他のフォーム入力要素

### 破壊的変更

- `placeholder`属性を使用している既存コードは、警告が出力され、プレースホルダーが表示されなくなる
- `support-text`属性への移行が必要

### 移行ガイド

1. `placeholder`属性を`support-text`属性に置き換える
2. 必要に応じてスロットを使用して複雑なヒントテキストを提供

```html
<!-- Before -->
<dads-textarea placeholder="500文字以内で入力"></dads-textarea>

<!-- After (属性) -->
<dads-textarea support-text="500文字以内で入力"></dads-textarea>

<!-- After (スロット - 複雑な内容) -->
<dads-textarea>
  <span slot="support-text">
    500文字以内で入力してください<br>
    <strong>例:</strong> 山田太郎
  </span>
</dads-textarea>
```

## テスト

### 追加されたテストケース

```typescript
describe('DadsTextarea - 非推奨属性', () => {
  it('placeholder属性を設定すると警告が出力される');
  it('placeholder属性は内部textareaに転送されない');
  it('support-text属性が代替として機能する');
  it('support-text属性がaria-describedbyで関連付けられる');
});
```

### テスト結果

- 全33件のtextareaテストがパス
- 新規追加テスト4件すべてパス

## 将来の検討事項

### フェーズ2: 完全禁止（検討中）

将来的に、十分な移行期間の後、以下の強化を検討:

1. 警告ではなくエラーをスロー
2. ESLintルールの追加
3. TypeScript型定義からplaceholderを除外

### 他の非推奨候補

`deprecated-attrs.ts`の設計により、将来的に他の非推奨属性も同様のパターンで追加可能:

```typescript
export const DEPRECATED_FORM_ATTRS: DeprecatedAttrConfig[] = [
  { name: 'placeholder', /* ... */ },
  // 将来追加可能
  // { name: 'autofocus', reason: '...', alternative: '...' },
];
```

## 参考資料

- [DADS アクセシビリティガイドライン](https://design.digital.go.jp/dads/components/input-text/accessibility/)
- [WCAG 2.2 AA ガイドライン](https://www.w3.org/TR/WCAG22/)
- [W3C Forms Best Practices](https://www.w3.org/WAI/tutorials/forms/)
- [MDN: placeholder属性](https://developer.mozilla.org/ja/docs/Web/HTML/Element/input#placeholder)

## 関連ドキュメント

- [設計思想 - アクセシビリティガイドライン](../architecture/design-philosophy.md#アクセシビリティガイドライン)
- [Skills - アクセシビリティ参照](../../.claude/skills/headless-component-design/references/accessibility.md)
- [学習記録](../knowledge/learnings.md#2025-01-07-placeholder属性非推奨の実装とアクセシビリティガイドライン)

---

*作成日: 2025-01-07*
*最終更新: 2025-01-07*
*作成者: Claude Code*
