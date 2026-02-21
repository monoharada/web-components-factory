# Frontend Implementation Learnings

## Context
- Feature or PR: `dads-combobox`（single/multiple + filterable + keyboard/a11y + 入力支援型）
- Date: 2026-02-21
- Scope:
  - Figma準拠のヘッダー/パネル状態
  - キーボード操作（開閉・選択・解除・離脱）
  - フォーカス順序（control → search → option → chip remove）
  - `mode` → `multiple` boolean属性リネーム
  - `behavior="input"` / `no-match-behavior` API追加
  - Shadow DOM event retargeting バグ修正
  - coverage 非劣化ゲート

## What Worked
- 「close時にqueryを必ずクリア」「single未確定離脱時の復帰」をテストで拘束しながら実装できた。
- `dads-chip-tag` を使った選択済み表示へ統一し、single/multiple のUI差分を縮小できた。
- キーボード経路をユースケース単位で追加し、`Escape` 離脱と `Tab` 遷移を安定化できた。
- coverage比較で base を上回る結果を維持できた（lines/statements/functions/branches 全て改善）。
  - lines: 87.65% -> 87.94% (+0.29pp)
  - statements: 82.82% -> 83.11% (+0.29pp)
  - functions: 86.10% -> 86.45% (+0.35pp)
  - branches: 69.23% -> 69.54% (+0.31pp)
- `mode="single"|"multiple"` → `BooleanAttr('multiple')` への移行で、HTML `<select multiple>` と同じ直感的API になった。
- `#isFilterable` 集約getterで `behavior === 'input' || hasAttribute('filterable')` を一元化し、散在していた条件分岐を統一できた。

## What Blocked Progress
- `agents:pre-pr` / `agents:verify` は generated files clean-check で停止した。
  - `custom-elements.json`
  - `registry/install-registry.json`
- `a11y-checker` の diff lint は `outline: none` を機械検知しやすく、代替フォーカス実装の文脈評価が必要だった。

## Root Causes
- generated outputs を反映したコミット前だと `check-generated-clean.mjs` を通過できない。
- combobox のように control/input/search/option/chip が混在するUIは、意図したタブ順が崩れやすい。

---

## New Rules

### Rule 1: Shadow DOM host の capture リスナーでは `event.composedPath()` を使う
- **Rationale**: `this.addEventListener('keydown', handler, true)` でホスト要素にcaptureリスナーを登録した場合、Chrome の Shadow DOM event retargeting により `event.target` はホスト要素自身にリターゲットされる。`event.target === this.#input` のようなガードは常に false になり、イベントが二重処理される。
- **Symptoms**: ArrowDown/ArrowUp で active index が2つ飛ぶ、キーボード操作の不安定な挙動。
- **Fix**:
  ```typescript
  // NG: event.target は host にリターゲットされる
  const target = event.target;
  if (target === this.#input) return;

  // OK: composedPath() で実際の発行元を判定
  const path = event.composedPath();
  if (this.#input && path.includes(this.#input)) return;
  ```
- **Note**: happy-dom は event retargeting を実装しないため、テスト環境では検出できない。ブラウザ実機テストが必要。

### Rule 2: Boolean属性パターンは HTML `<select multiple>` に倣う
- **Rationale**: `mode="single"|"multiple"` よりも `multiple` boolean属性の方が、HTML標準との一貫性がある。
- **Migration pattern**:
  - `PropertyAttr('mode')` → `BooleanAttr('multiple')`
  - `getAttribute('mode') === 'multiple'` → `hasAttribute('multiple')`
  - CSS: `:host([mode='single'])` → `:host(:not([multiple]))`
  - CSS: `:host([mode='multiple'])` → `:host([multiple])`
  - デモ: `<select>` → `<dads-switch>` with `data-api-attr`

### Rule 3: combobox系は「フォーカス順」と「Escape離脱」を必ずユースケーステストで固定する
- **Rationale**: 視覚差分より先に操作不能が発生しやすく、回帰コストが高い。
- **Example**:
  - open後 `Tab` で `search-input` に移動
  - `search-input` から `Tab` で option へ移動
  - option/chip remove 上の `Escape` で close + control復帰

### Rule 4: generated file 差分を含む変更では、PR前に出力更新を差分に含める
- **Rationale**: `agents:pre-pr` の clean-check 条件を満たすため。
- **Example**: `custom-elements.json`, `registry/install-registry.json`

### Rule 5: API テーブルの連動制御は `syncBehaviorDependents` パターンで統一する
- **Rationale**: `behavior` のような親属性が切り替わると、依存する属性コントロール（`multiple` switch, `no-match-behavior` select）を disabled/reset する必要がある。
- **Pattern**:
  ```javascript
  const syncBehaviorDependents = () => {
    const isInput = behaviorSelect.value === 'input';
    multipleSwitch.disabled = isInput;
    noMatchSelect.disabled = !isInput;
    // 非活性化時はデフォルト値にリセット + change イベント発火
  };
  behaviorSelect.addEventListener('change', syncBehaviorDependents);
  syncBehaviorDependents(); // 初期状態も同期
  ```

---

## Next Time Checklist
- [ ] キーボードユースケース（single/multiple）を先に Red で追加する
- [ ] Figma状態差分はスクリーンショット比較で確認する
- [ ] generated file 差分を早期に確認し、PR差分へ含める
- [ ] Shadow DOM host リスナーでは `event.target` ではなく `event.composedPath()` を使う
- [ ] テスト環境 (happy-dom) では Shadow DOM event retargeting を検出できないため、キーボード操作はブラウザ実機で最終確認する
