# アクセシビリティガイドライン

DADS公式アクセシビリティ仕様に準拠したフォーム入力要素の設計ガイドライン。

## 公式リファレンス

https://design.digital.go.jp/dads/components/input-text/accessibility/

## 禁止属性一覧

### placeholder（フォーム入力要素全般）

**ステータス**: 🚫 使用禁止

**対象コンポーネント**:
- `<dads-textarea>`
- `<dads-input>` (予定)
- `<dads-select>` (予定)
- その他すべてのフォーム入力要素

**理由**:

1. **コントラスト比が低い**
   - プレースホルダーテキストは通常グレーで表示され、WCAG基準を満たさない場合が多い
   - 視覚障害者や高齢者にとって読みにくい

2. **入力時に消失する**
   - ユーザーが入力を開始すると非表示になる
   - 入力条件を確認するために入力内容を削除する必要がある
   - 認知障害を持つユーザーにとって特に問題

3. **スクリーンリーダー対応の問題**
   - 一部のスクリーンリーダーでは読み上げられない
   - 入力済みテキストとプレースホルダーの区別が困難

**代替手段**: `support-text` 属性

```html
<!-- ❌ 非推奨 -->
<dads-textarea placeholder="入力例: 山田太郎"></dads-textarea>

<!-- ✅ 推奨 -->
<dads-textarea support-text="入力例: 山田太郎"></dads-textarea>
```

## 実装仕様

### 警告出力（開発モードのみ）

```
[DADS Warning] <dads-textarea>: "placeholder" 属性は非推奨です。
理由: プレースホルダーはコントラスト比が低く、入力中に消えるためアクセシビリティ上の問題があります
代替: support-text属性を使用してください
詳細: https://design.digital.go.jp/dads/components/input-text/accessibility/
```

### 挙動

- `placeholder` 属性は内部のネイティブ要素に転送されない
- 属性は設定可能だが、機能しない（ソフトな禁止）
- 本番環境（`NODE_ENV=production`）では警告を出力しない

### 関連ユーティリティ

```typescript
// packages/utils/deprecated-attrs.ts
import { checkDeprecatedAttrs, DEPRECATED_FORM_ATTRS } from '@/utils/deprecated-attrs';

// connectedCallbackで呼び出し
connectedCallback() {
  checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);
}
```

## support-textの実装

### 属性

```html
<dads-textarea
  label="お名前"
  support-text="姓と名の間にスペースを入れてください"
  required
></dads-textarea>
```

### アクセシビリティ対応

- `aria-describedby` で `[part="support-text"]` と関連付け
- 常に表示され、入力中も消えない
- 標準のテキスト色でコントラスト比を確保

### スロット対応

```html
<dads-textarea label="お名前" required>
  <span slot="support-text">
    姓と名の間にスペースを入れてください<br>
    例: 山田 太郎
  </span>
</dads-textarea>
```

## テスト要件

### placeholder非推奨テスト

```typescript
describe('非推奨属性', () => {
  it('placeholder属性を設定すると警告が出力される', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    element = document.createElement('dads-textarea');
    element.setAttribute('placeholder', 'テスト');
    document.body.appendChild(element);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('placeholder')
    );
  });

  it('placeholder属性は内部要素に転送されない', async () => {
    element.setAttribute('placeholder', 'テスト');

    const textarea = element.shadowRoot?.querySelector('[part="textarea"]');
    expect(textarea?.getAttribute('placeholder')).toBeFalsy();
  });
});
```

## 関連ドキュメント

- [設計思想 - アクセシビリティガイドライン](../../../../docs/architecture/design-philosophy.md#アクセシビリティガイドライン)
- [トークンAPIパターン](./token-api-pattern.md)
- [フォーカススタイル](./focus-styles.md)
