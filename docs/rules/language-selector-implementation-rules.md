# ランゲージセレクター実装ルール

`dads-language-selector` を追加・改修するときの再発防止ルールです。  
既存の `menu-list-box` 継承前提で、アクセシビリティと運用整合を崩さないことを目的にします。

## 適用範囲

- `packages/components/language-selector/**`
- `src/demos/showcase-navigation.ts` の language selector セクション
- `docs/knowledge/a11y-annotations.json`
- `custom-elements.json`（`cem:analyze` 生成物）

## 必須ルール

1. **イベント互換性を維持する**
- `menuitemselect` は継続発火させる
- `dads-change` の detail 形状（`value`, `selectedValue`, `selectedIndex`, `selectedItem`）を壊さない

2. **選択取得APIの整合を維持する**
- `getSelectedLanguage()` は `current` / `aria-current` の正規化結果と一致すること
- 選択なしは `null` を返すこと

3. **単一選択を保証する**
- 複数 `current` がある場合は先頭1件のみ採用し、残りを解除する
- `aria-current` は選択中のみ `true` を維持する

4. **自動補完は「明示指定優先」にする**
- `slot="label"` がある場合は `label` 自動補完を行わない
- `slot="icon"` がある場合は opener 自動アイコンを挿入しない
- `slot="start-icon"` が明示されている項目には自動チェックアイコンを挿入しない

5. **a11y注釈を同一PRで更新する**
- `docs/knowledge/a11y-annotations.json` に `dads-language-selector` の定義を持つこと
- 最低限の callout 対象: `opener`, `opener-label`, `popup/menu`, `current item`, `selected icon`
- 変更後は必ず `npm run cem:analyze` で CEMに反映する

## テスト最小セット（必須）

- 初期値:
  - `opener=text` / `label=Language`
  - `opener=icon` / `label=LANG`
- 選択:
  - `current` / `aria-current` 単一正規化
  - `dads-change` detail 検証
  - `getSelectedLanguage()` との整合検証
- キーボード:
  - Arrow/Home/End/Escape の開閉・移動（継承動作）
  - `aria-expanded` 同期
- 補完優先順位:
  - `slot="label"` / `slot="icon"` / `slot="start-icon"` 明示時の自動補完抑止

## PR前チェック

```bash
npm run test:run -- packages/components/language-selector/language-selector.test.ts
npm run type-check
npm run cem:analyze
npm run validate:wc
npm run agents:verify
```

`agents:verify` で `custom-elements.json` / `registry/install-registry.json` 差分警告が出る場合は、同一PRに含めること。
