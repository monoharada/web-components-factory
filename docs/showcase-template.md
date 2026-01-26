# ショーケーステンプレート

Web Components ショーケースデモの標準テンプレートです。新しいコンポーネントのデモを作成する際に参照してください。

## 章立て

```
1. Overview（用途・操作要点・注意）
2. A11y（a11y-annotate）
3. API / Controls
   3.1 Preview
   3.2 Attributes / Properties テーブル
   3.3 CSS Variables テーブル（カテゴリ別に details で折りたたみ）
4. Examples（2〜3件、実務寄り）
5. Notes（任意）
```

## Fidelity 分離の原則

- **E2E/Figma検証用デモ** は `{componentName}Fidelity` として分離する
- ショーケースからは検証用 ID 依存を外す（`#demo-xxx-basic` 等）
- Fidelity デモは **ID安定性を最優先**（ショーケース整理でE2Eが壊れない）

| ページ | 用途 |
|--------|------|
| `componentName` | 人間向けショーケース（API/CSS Vars/実務例） |
| `componentNameFidelity` | E2E/Figma検証用（ID安定性優先） |

## API Controls パターン

### 必須データ属性

| 属性 | 用途 |
|------|------|
| `data-api-target` | 制御対象のコンポーネント |
| `data-api-attr="attrName"` | HTML属性の制御 |
| `data-api-prop="propName"` | JSプロパティの制御 |
| `data-api-css-var="--var-name"` | CSS変数の制御 |
| `data-api-reset` | リセットボタン |
| `data-default="value"` | 初期値（リセット時に戻す値） |

### スクリプト初期化

```html
<script>
  (function() {
    var currentScript = document.currentScript;
    Promise.all([
      import('dads-component-name'),
      import('dads-table'),
      import('dads-switch'),
      import('dads-input-text'),
      import('dads-button'),
      import('/src/viewer-api-controls.js')
    ]).then(function(mods) {
      var root = currentScript?.parentElement;
      if (!root || !root.isConnected) return;
      var api = mods[5];
      if (api && api.bindApiControls) api.bindApiControls(root);
    });
  })();
<\/script>
```

## a11y-annotate 統合

### トグルUI

```javascript
function annotationToggleUI(): string {
  return `
    <div style="display: flex; align-items: center; gap: 16px; ...">
      <span>アクセシビリティ注釈:</span>
      <dads-switch data-annotation-toggle checked>
        <span slot="label-left">非表示</span>
        <span slot="label-right">表示</span>
      </dads-switch>
    </div>
  `;
}
```

### トグルスクリプト

```javascript
function annotationToggleScript(): string {
  return `
    <script>
      (function() {
        var currentScript = document.currentScript;
        customElements.whenDefined('dads-switch').then(function() {
          var root = currentScript?.parentElement;
          if (!root || !root.isConnected) return;
          var toggle = root.querySelector('[data-annotation-toggle]');
          if (!toggle) return;
          var updateAnnotations = function() {
            var isChecked = toggle.hasAttribute('checked');
            var annotations = root.querySelectorAll('a11y-annotate');
            for (var i = 0; i < annotations.length; i++) {
              annotations[i].setAttribute('mode', isChecked ? 'both' : 'panel');
            }
          };
          toggle.addEventListener('dads-change', updateAnnotations);
          updateAnnotations();
        });
      })();
    <\/script>
  `;
}
```

## CSS Variables テーブルのパターン

### 折りたたみ構造

```html
<div class="wc-api-panel__section">
  <h4 class="wc-api-panel__section-title">CSS Variables</h4>

  <details open>
    <summary>カテゴリ1（例: Opener）</summary>
    <dads-table>
      <table>
        <thead>
          <tr>
            <th scope="col">変数名</th>
            <th scope="col">説明</th>
            <th scope="col">初期値</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>--dads-xxx-property</code></td>
            <td>説明文</td>
            <td>初期値</td>
          </tr>
        </tbody>
      </table>
    </dads-table>
  </details>

  <details>
    <summary>カテゴリ2（例: Popup）</summary>
    <!-- ... -->
  </details>
</div>
```

### 推奨カテゴリ

1. **Layout** - サイズ、パディング、ギャップ
2. **Colors** - 背景、ボーダー、テキスト
3. **Typography** - フォント関連
4. **Focus** - フォーカス状態
5. **State** - ホバー、アクティブ、disabled

## 実務的な作例のパターン

### 避けるべき作例

- API テーブルで確認できる単純なバリエーション（size sm/md など）
- Figma検証用のデモ（Fidelity に分離）

### 含めるべき作例

- カテゴリ + divider の組み合わせ
- 説明文付きアイテム
- スクロールが発生するケース
- 実務でよくある使用パターン

## viewer.html への追加

セレクタに新しいコンポーネントを追加する際は、Fidelity も同時に追加：

```html
<option value="componentName">Component Name</option>
<option value="componentNameFidelity">Component Name (Fidelity)</option>
```

## チェックリスト

- [ ] Overview セクションがある
- [ ] Usage（HTML）コードブロック（`<dads-code-block>`）がある
- [ ] a11y-annotate が表示される
- [ ] API / Controls に Props/Attrs テーブルがある
- [ ] API / Controls に CSS Variables テーブルがある（折りたたみ）
- [ ] Examples が 2〜3件に絞られている
- [ ] E2E用 ID は Fidelity デモに移動済み
- [ ] viewer.html に Fidelity オプションがある
- [ ] E2E テストが Fidelity を参照している
