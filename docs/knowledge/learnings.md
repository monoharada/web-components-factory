# 🎓 Learnings

このファイルには、プロジェクト開発中に得られた学習内容を記録します。

---

## [2026-02-09] Utility Link 実装での学び（download優先・slot可視判定・APIデモ）
**タグ**: #utility-link #webcomponents #a11y #testing #dads

### 概要
`dads-utility-link` 実装では、`target="_blank"` と `download` の同時指定時のふるまい、および `slot="lead-icon"` の可視判定が落とし穴になった。結果として、**download時は新規タブ挙動よりダウンロード挙動を優先**し、slot内容の `hidden` 変更にも追従する設計に整理した。

### つまずきと原因
- `lead-icon` の表示切替で、要素を残したまま `hidden` を付けると見た目が更新されないケースがあった。
- `target="_blank"` と `download` が同居すると、UI（末尾アイコン）と実際のリンク属性の意図が曖昧になりやすい。
- APIデモの `<select>` は `aria-label` を持っていても、差分lintのヒューリスティックで警告される場合がある。

### 学び
1. `download` を持つリンクは、コンポーネント内部では `target` を反映しないほうが挙動が明確。
2. slotの有無判定は `slotchange` だけでなく、`hidden` など属性変更の監視も必要。
3. デモUIは `aria-label` に加えて `label` 関連付けを入れておくと監査耐性が上がる。

### 実施した対策
- `download` 属性がある場合、内部 `<a>` の `target` を無効化し、末尾アイコンはダウンロードアイコンを優先表示。
- `lead-icon` は `MutationObserver` で `slot` / `hidden` の変更を監視し、`data-has-lead-icon` を再評価。
- APIデモの `lead-icon` 制御 `<select>` に `label` + `id` を付与。

### 再発防止
- 「見た目の状態（アイコン）」「リンク実属性（target/download）」は常に同じ優先順位で設計する。
- slot可視判定テストは、追加/削除だけでなく `hidden` の付け外しまで含める。

## [2026-02-09] Language Selector のアイコン位置ズレは「SVG基準線 + viewBox + slot整列」を同時に揃える
**タグ**: #language-selector #menu-list-box #css #svg #accessibility #testing

### 概要
`dads-language-selector` の `opener="icon"` で、地球儀アイコンと `LANG` の位置がずれる問題は、単一要因ではなく、`svg` の基準線余白・アイコン用 viewBox・slot コンテナ整列の3点が重なって発生していた。

### 学び
1. `slot="icon"` に `svg` を入れる構成では、`::slotted(svg) { display: block; width: 100%; height: 100%; }` を先に入れて基準線余白を消す
2. アイコンとラベルを縦積みする場合は、`opener-icon` 単体だけでなく、親レイアウト（grid）と矢印配置も同時に固定する
3. Figma由来のアイコンを使う際は、`path` だけ差し替えると見た目が崩れることがあるため、`viewBox` もセットで合わせる
4. 共通基盤（`menu-list-box`）側の `:host([data-has-opener-icon]) [part="opener-icon"]` に `align-items: center` を入れると、他コンポーネントでも再発しにくい

### 再発防止
- スタイル差分は `cssRules/cssText` の回帰テストを必ず追加する
- CEM更新を伴う変更は `custom-elements.json` を同一PRに含める
- PR前は `npm run agents:verify` を実行し、ガードレール結果を記録する

---

## [2026-02-09] Language Selector 実装での学び（a11y注釈・イベントAPI・テスト網羅）
**タグ**: #accessibility #testing #webcomponents #language-selector #a11y-annotate

### 概要
`dads-language-selector` 実装時に、見た目・挙動が正しくても `a11y-annotate` が期待表示されない事象が起きた。原因はコンポーネント実装ではなく、**注釈メタデータ（CEM注入元）の未定義**だった。

### つまずきと原因
- 症状: `?a11y=1&component=languageSelector` で注釈パネル/コールアウトが弱い、または出ない
- 原因: `docs/knowledge/a11y-annotations.json` に `dads-language-selector` エントリが未登録
- 補足: `a11y-annotate` は `custom-elements.json` の `custom.a11yAnnotations` を読むため、CEM注入元が空だとUI側で頑張っても解決しない

### 学び
1. **a11y注釈は実装コードではなく CEMメタデータの品質で決まる**
2. Menu系コンポーネントは、最低でも `opener / popup / current item / selected icon` の4観点を注釈化するとレビュー可能性が上がる
3. 公開イベント（`dads-change`）と公開取得API（`getSelectedLanguage()`）は、必ず相互整合テストを持つべき
4. 継承コンポーネントでも、キーボード操作（Arrow/Home/End/Escape）を統合テストで1本確認しておくと回帰検出が速い

### 実施した対策
- `docs/knowledge/a11y-annotations.json` に `dads-language-selector` 注釈を追加
- `npm run cem:analyze` で CEMへ反映
- `language-selector.test.ts` に以下を追加
  - キーボード操作と `aria-expanded` 同期
  - `selectedIndex` fallback
  - `slot="label"` / `slot="icon"` の明示優先
  - 明示 `start-icon` と自動チェックアイコンの競合防止

### 再発防止
- 新規コンポーネント追加時は「注釈定義ファイル追加 → CEM再生成 → `validate:wc`」を同一PRで必須化する
- `agents:verify` 実行前に、生成物差分（`custom-elements.json` / `registry/install-registry.json`）を意図通り含める

---

## [2026-02-06] MutationObserverの自己再帰でUIが固まる問題と防止ルール
**タグ**: #webcomponents #mutationobserver #debug #performance #breadcrumb

### 概要
`dads-breadcrumb` の構造化データ（microdata）同期で、`MutationObserver` が**自分のDOM更新を再検知**し続け、`sync` が無限に再入してブラウザタブが実質フリーズする事象が発生した。

### 根本原因
- 監視対象が `subtree: true` で広く、`replaceChildren()` などの内部更新まで観測していた
- 観測コールバック内で `sync` を呼び、その `sync` が再び観測対象DOMを更新していた
- 「同期待ちフラグ」だけでは、コールバックキューに積まれた後続通知を十分に止められないケースがあった

### 再発防止ルール
1. **Observerが監視するDOMを、Observer自身の同期で更新する場合は必ず `disconnect()` してから更新する**
2. 更新後にのみ `observe()` を再開する（`finally` で必ず再開）
3. 監視オプションは定数化し、再登録時に同じ条件を使う
4. `subtree: true` を使う場合は「同期対象に内部ミラーDOMが含まれるか」をレビュー観点に含める
5. 「構造化データON時の再描画」を必ずテストに入れる（属性切替・子要素変更・off復帰）

### 適用例（要点）
```ts
// sync前に監視停止
observer.disconnect();
try {
  sync();
} finally {
  // sync後に監視再開
  observer.observe(host, OBSERVER_OPTIONS);
}
```

### 対象実装
- `/packages/components/breadcrumb/breadcrumb.ts` の `#syncAll()` / `#startObservingMutations()`

## [2026-01-31] 見出し（Heading）のチップ/アイコンは相対単位（em/lh）でサイズ追従させる（トークン増殖を防ぐ）
**タグ**: #heading #dads #figma #tokens #css #webcomponents #testing

### 概要
見出しコンポーネントの chip / icon は固定pxで個別トークンを増やすのではなく、**グローバルトークンを代入**し、`size` 差分は `:host([size])` の **変数再代入**で表現する。chip幅など小数pxは **spacingスケールへ丸め**、px literal を避ける。

### 詳細
- **アイコンサイズ**: DADS HTML 実装は `width/height: 1.25em` + `vertical-align: -0.25em` で追従させる。
- **チップ幅/余白**: Figmaで小数pxが出るため、`--spacing-*` に丸めて `:host([size='xx']) { --heading-chip-width: var(--spacing-?); }` の形で管理する（px literal は使わない）。
- **高さは `top/bottom` で制御**: `height` 固定ではなく `top` / `bottom` で高さを決める（chipは情報ではなく意匠）。
- **lh（line-height）対応**: `@supports (top: 1lh)` が使える環境では `0.5lh` を使って上下インセットをより安定させる。
- **ショルダー有り時の top 補正**: `top = (shoulder-size * (line-height - 1)) / 2` の式で chip の上インセットを補正すると DADS と整合しやすい。
- **チップは group につける**: `heading` パートではなく `group` パートに紐づけると、ショルダー＋見出し全体に沿った配置になる。
- **トークン設計**: px→rem の `calc(64 / 16 * 1rem)` は避け、`--font-size-*` / `--spacing-*` の **グローバルトークンを代入**する。size差分は `:host([size='xx']) { --heading-*: ... }` の **変数再代入**で表現する。
  - 例外: `calc(var(--spacing-10) + var(--spacing-1-5))` のような **グローバルトークン同士の加算** は許容する（設計意図が明確で、ハードコードに戻らないため）。
  - chip幅などで小数pxが出る場合は **最も近い spacing トークンへ丸める**（px literal を許容しない運用）。
- **テスト方針**: happy-dom では CSS 変数の実値が取れないため、`adoptedStyleSheets` の `cssText` からルール存在を検証する。
- **marginは「上余白」に寄せる**: DADSの作例（Figma）で示されるのは「見出しの前の余白（上方向）」だったため、`margin="top"` を「上方向の余白」のAPIとして整理した。
  - 実装: ホストmarginではなく Shadow DOM 内（`[part="group"]`）の `margin-block-start` で表現する（外部CSSが Shadow DOM に侵入できないため安定）。

## [2026-02-01] Heading の API 設計: 構造（slot）と装飾（attr）の分離
**タグ**: #heading #api #slots #attrs #a11y #webcomponents #ux

### 概要
`type` のようなプリセット属性で見た目を切り替える設計は、Usage（HTML）例の生成や slot の実在と噛み合わず、誤解を生みやすい。代わりに、**情報としての構造は slot の有無**、**純粋な装飾は attribute で明示**という分離が合理的だった。

### 詳細
- **`type` は公開APIから削除**: `<dads-heading type="...">` ではなく、slot/attr で表現する。
- **構造は slot**: `slot="shoulder"`（ショルダー）と `slot="icon"`（先頭アイコン）は、マークアップとして与えたときに表示されるのが自然。
- **装飾は attr**: `chip`（左チップ）や `rule`（下線）は意味を持たないため、属性で ON/OFF を明示できると管理しやすい。
- **注釈（a11y-annotate）の制約**: 擬似要素はターゲットにできないため、チップは `[part="chip"]` の実体を Shadow DOM に置き、注釈アンカーとして使う。
- **Usage（HTML）生成の落とし穴**: 実DOMからクローンすると、コンポーネントが自動付与する `role` / `aria-*` / 内部 `data-*` まで出力に混ざる。
  - 対策: Usage生成側で内部属性をストリップできる仕組み（例: `data-api-strip-attrs`）と、ターゲットDOM変化（slot追加/削除）に追従する仕組み（MutationObserver）が必要。

## [2026-02-01] Custom Element の value は「アップグレード前代入」で壊れる（property shadowing）
**タグ**: #webcomponents #custom-elements #forms #demos #testing #gotcha

### 概要
Custom Element に対して **定義（customElements.define）前** に `el.value = ...` を行うと、その値が「インスタンスの own-property」として固定され、クラスの `get/set value()` アクセサを **永続的にシャドーイング** してしまう。結果として `this.value` が古い値を返し続け、イベントdetailなどが更新されなくなる。

### 対策
- **コンポーネント側で upgrade する**（推奨）:
  - `connectedCallback()` で `hasOwnProperty('value')` を検出して `delete this.value` → 内部input参照が取れた後に setter 経由で復元する。
- **デモ/利用側での予防**:
  - カスタム要素がアップグレードされる前は `.value` を直接触らず、`value` 属性を設定する（または `customElements.whenDefined()` 後に `.value` を使う）。

## [2026-01-20] Menu List / Menu List Box のFigma再現メモ（divider/hr・余白・ダミーアイコン・スクロールバー）
**タグ**: #css #webcomponents #dads #figma

### 概要
Menu List / Menu List Box の見た目を DADS / Figma に寄せる際、実装でハマりやすいポイントを整理。

### 詳細
- **ディバイダーは border で擬似表現しない**: DADS Divider のガイドに合わせ、メニュー内の区切りは `<hr>` を使用する（`role="separator"` は必要に応じて付与）。
  - 参考: https://design.digital.go.jp/dads/components/divider/
- **インセットディバイダー（左右余白）**: コンテナいっぱいではなく左右に余白を残す（`::slotted(hr)` を inset で制御）。
- **ディバイダーの上下余白**: DADSの指針として「リスト: 8px以上 / セクション: 16px以上」。Menu List Box のポップアップ内は 16px をデフォルト値に寄せた。
- **`hr` の余白がリセットで潰れる問題**: ページ側の `* { margin: 0 }` などで `<hr>` の `margin-block` が消えることがある。
  - 対策: Shadow DOM の `::slotted(hr)` で指定するだけでなく、`dads-menu-list-box` 側で slotchange 時に divider へ `margin-block` を inline style で補強する（外部影響下でも余白が維持される）。
- **スクロールバーは“見せるために余白を確保”しない**: Figmaの右側余白はスクロール表現だが、実装ではOS/ブラウザのネイティブ挙動に任せる（固定で reserved space を作らない）。
- **作例のダミーアイコンは DADS 作例に合わせる**: Menu List の作例では「ダミーアイコン」として同じSVG（front/end）を使っているため、リポジトリ内の作例でも同じSVGパスに統一する。
  - 参考: https://design.digital.go.jp/dads/html/?path=/docs/components-%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%AA%E3%82%B9%E3%83%88--docs

## [2026-01-17] Web ComponentsのCSSは「Primitive→Semantic→Local→Properties」で責務分離し、フォールバックは原則消す（A11y最小保証のみ例外）
**タグ**: #css #tokens #a11y #webcomponents #markup

### 概要
Shadow DOM内のCSSは、Primitive（グローバルトークン注入）→ Semantic（意味的トークン）→ Local（コンポーネント公開トークン）→ Properties（実スタイル）の4段に責務分離すると、レビュー・カスタマイズ・保守が安定する。

同時に `var(--token, fallback)` のフォールバックは「本当に必要なアクセシビリティ上の最低保証」以外は削除し、**必要なPrimitiveを必ず注入する**（例: `applyDADSTokens()` / `applySpacingTokens()`）。

### 詳細
- ✅ OK: Primitiveは `styles` の先頭で注入する（例: `applyDADSTokens()` / `applySpacingTokens()`）
- ✅ OK: Semantic tokenで Primitive を意味単位に束ねる（例: `--radio-input-border-color`）
- ✅ OK: Local token（`--dads-radio-*` など）を外部カスタマイズの窓口にし、variant/sizeは `:host([size])` で切り替える
- ✅ OK: Stylesでは **Local tokenだけ** を参照し、プロパティ定義は1回・状態変化は変数再代入で表現する
- ✅ OK: Shadow DOMテンプレート内にBEMクラスを残さず、`part` を唯一のスタイリングAPIにする（クラスは誤誘導になる）
- ✅ OK: `:has()` は、DOMを増やさずに条件付きスタイル（「ラベルが空ならpadding無し」など）が書けるなら合理的に採用する
- ❌ NG: Styles内で Primitive（`--color-primitive-*` / `--spacing-*`）を直接参照する（tokenの責務が崩れる）
- ❌ NG: 「とりあえず」フォールバック値を大量に入れる（本番ではトークン注入の不備を隠してしまう）

### 適用例
```ts
styles: withReset([
  applyDADSTokens(),
  applySpacingTokens(),
  radioTokens,
  radioStyles,
], 'minimal')
```

#### A11y: 44pxタップ領域の最低保証（spacing-factor等で縮小しても下回らない）
`applySpacingTokens()` の `--spacing-11` は `--spacing-factor` の影響を受けるため、最低保証が必要な箇所では `--spacing-scale-*`（unitless）をpx化して `max()` で下限を作る。

```css
--radio-target-size-lg: max(var(--spacing-11), calc(var(--spacing-scale-11) * 1px));
```

---

## [2026-01-16] DADS Checkbox/Radioのサイズ分岐は`:host([size])`で管理する
**タグ**: #css #webcomponents #dads

### 概要
Shadow DOM内部要素へ`data-size`をコピーして`[part="base"][data-size="lg"]`のように分岐するのではなく、ホスト属性`size`をソースにして`:host([size="lg"])`でサイズトークンを切り替える（例: checkbox/radio）。

### 詳細
- ✅ OK: `:host([size="lg"]) { --_gap: ... }` のようにホストでトークンを定義し、内部要素は変数参照のみで描画する
- ✅ OK: px→rem変換の`calc(17 / 16 * 1rem)`は書かず、`--font-size-*` / `--spacing-*` を参照する
- ✅ OK: 内部要素の選択は`part`を使用する（例: `[part="base"]`）
- ✅ OK: ホバー状態は`@media (any-hover: hover)`でガードし、タッチ環境に不用意に適用しない
- ❌ NG: `--_label-font-size: calc(17 / 16 * 1rem);` のようなpx→rem変換を直書きする
- ❌ NG: `[part="base"][data-size="lg"] { ... }` のように内部要素へサイズ状態を複製してスタイル分岐する（保守コスト増・ルール逸脱の温床）
- ❌ NG: `@media (hover: hover)` や無条件`:hover`でホバースタイルを適用する（`any-hover`優先）

### 適用例
```css
:host([size="lg"]) {
  /* 前提: Primitive（spacing/font）を注入していること */
  --_gap: var(--spacing-3);
  --_label-font-size: var(--font-size-17);
}

[part="base"] {
  gap: var(--_gap);
}

[part="label"] {
  font-size: var(--_label-font-size);
}
```

### 注意点
- `data-*` はスタイルガイド上の疑似状態表示（例: `data-state="hover"`）など、明確な理由がある場合に限定する。

---

## [2026-01-15] `dads-button` のスタイリングAPI（サイズ/比率）とバリアント別hover/active
**タグ**: #css #webcomponents #designtokens

### 概要
複合コンポーネント（例: `dads-calendar`）内部で `dads-button` を「アイコンのみの正方形ボタン」や「コンポーネント固有のpadding/高さ」に合わせる必要が出たため、`dads-button` のスタイリング用CSS変数（API）を整理し、`primary/secondary/tertiary` バリアントでも hover/active が効くようにしました。

### 詳細
- **`dads-button` のサイズ/レイアウトをCSS変数で調整できるようにする**
  - `--dads-button-width / --dads-button-min-width / --dads-button-max-width`
  - `--dads-button-min-height`（外部オーバーライド用）
  - `--dads-button-min-height-default`（コンポーネント内部のデフォルト用）
  - `--dads-button-padding`
  - `--dads-button-aspect-ratio`（例: `1 / 1`）
- **親コンポーネント側で“揃える”用の変数を用意する（例: `dads-calendar`）**
  - `--dads-calendar-control-size`（年セレクト / 前後ボタン / フッターの高さを合わせる）
- **バリアント名の揺れに注意**
  - トークン側は `variant="primary|secondary|tertiary"` を許容しているため、スタイル（hover/active/disabled）も同様に対応させる必要がある。

### 適用例
```css
/* 例: カレンダー全体のコントロール高さを揃える（外から上書き可能） */
dads-calendar {
  --dads-calendar-control-size: 44px;
}

/* 例: 親コンポーネント側で子の dads-button を正方形アイコンボタンにする */
parent-component::part(nav-button) {
  --dads-button-padding: 0;
  --dads-button-min-height: 44px;
  --dads-button-width: var(--dads-button-min-height);
  --dads-button-min-width: var(--dads-button-min-height);
  --dads-button-aspect-ratio: 1 / 1;
}
```

### 注意点
- 子コンポーネントのShadow DOM内部を直接スタイルできないため、**CSS変数（=スタイリングAPI）** と **`part` の公開** で“外から調整できる余地”を残す。
- `min-height` を“無効化”したい場合は `--dads-button-min-height: initial;`（または `unset`）を設定して初期値に戻す。

---

## [2026-01-15] `dads-calendar` の期間選択（`range`）と読み上げ（aria-live）
**タグ**: #a11y #calendar #webcomponents

### 概要
`dads-calendar` に `range` 属性を付与すると、開始日→終了日の順に2点を選択できる“期間選択モード”になります。

### 仕様メモ
- **表示**: カレンダー下部に「開始日 / 終了日」を表示する（未選択は `未選択`）。
- **サポートテキスト**:
  - 開始日未選択: `開始日を選択してください。`
  - 開始日選択済み: `終了日をお選びください。`
  - 両方選択済み: `開始日と終了日を選択しました。`
- **読み上げ**: 選択操作時に `aria-live="polite"` を使って状態変化を読み上げる。
- **イベント**: `date-range-selected` を発火し、`detail.startDate / detail.endDate`（`Date | null`）を渡す。

### 使用例
```html
<dads-calendar range></dads-calendar>
```

```js
document.querySelector('dads-calendar')?.addEventListener('date-range-selected', (e) => {
  const { startDate, endDate } = e.detail;
  console.log(startDate, endDate);
});
```

---

## [2025-09-02] Claude Code開発フローの確立
**タグ**: #workflow #claudecode #productivity

### 概要
Zenn記事「私の好きなClaude Codeの使い方」を基に、プロジェクト固有の開発フローを確立。

### 詳細
- インクリメンタル開発の重要性を認識
- 小さく可逆的な変更の積み重ねが効率的
- 頻繁なコミットとレビューがコード品質を向上
- ナレッジ管理システムの構築で知識の蓄積が可能に

### 適用例
```bash
# 新機能開発の標準フロー
npm run claude:plan    # 計画
npm run tdd           # TDD開発
npm run claude:review # レビュー
npm run claude:verify # 検証
```

### 注意点
- 計画なしに実装を始めない
- テストを書いてから実装する
- 各ステップで検証を行う

---

## [2025-09-02] Web Componentsベストプラクティス
**タグ**: #webcomponents #architecture #css

### 概要
Web Components開発における重要な原則とパターンを確立。

### 詳細
1. **::part()の使用**: クラスではなく::part()でスタイリング
2. **ネイティブHTML優先**: details/summary, dialog等を活用
3. **Shadow DOM隔離**: スタイルの適切なカプセル化
4. **CSS変数パターン**: 重複定義を避け、変数の再代入で状態変化

### 適用例
```typescript
// 正しいpart属性の使用
template: html`
  <div part="base">
    <button part="trigger">
      <slot></slot>
    </button>
  </div>
`

// CSS変数パターン
styles: css`
  [part="base"] {
    background: var(--button-bg);
  }
  :host(:hover) {
    --button-bg: var(--button-bg-hover);
  }
`
```

### 注意点
- グローバルクラスの使用を避ける
- ネイティブ要素の機能を再実装しない
- CSS変数の重複定義に注意

---

## [2025-09-02] TypeScript厳格モードの価値
**タグ**: #typescript #quality #typesafety

### 概要
`strict: true`と`any`型の禁止による開発品質向上。

### 詳細
- 型安全性により実行時エラーを大幅に削減
- IDE支援が向上し、開発速度が向上
- リファクタリングが安全に実行可能
- ドキュメントとしての役割も果たす

### 適用例
```typescript
// BAD: any型の使用
function process(data: any) { /* ... */ }

// GOOD: 適切な型定義
interface ProcessData {
  id: string;
  value: number;
}
function process(data: ProcessData) { /* ... */ }
```

### 注意点
- 初期段階から厳格モードを有効にする
- 型定義の作成に時間を投資する価値がある
- unknown型を適切に活用する

---

## [2025-09-02] TDDサイクルの効果
**タグ**: #testing #tdd #quality

### 概要
Test-Driven Development（TDD）による品質と設計の向上。

### 詳細
1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコード
3. **Refactor**: コードを改善

このサイクルにより:
- 設計が明確になる
- 回帰テストが自動的に構築される
- リファクタリングが安全になる
- ドキュメントとしても機能する

### 適用例
```bash
# TDDワークフロー
npm run tdd  # watch modeでテスト駆動開発
```

### 注意点
- テストを書きすぎない（YAGNI原則）
- モックを適切に使用する
- E2Eテストとユニットテストのバランス

---

## [2025-01-07] Textareaコンポーネント実装から得た学び
**タグ**: #webcomponents #slots #focus #forms #tdd

### 概要
DADS準拠Textareaコンポーネントの実装を通じて、スロット管理、フォーカススタイルの共通化、属性同期のベストプラクティスを確立。

### 詳細

#### 1. スロットフォールバックの正しい実装
**問題**: スロット親要素の`textContent`を上書きすると、スロットされたコンテンツが破壊される

```typescript
// ❌ BAD: スロットが破壊される
labelElement.textContent = this.getAttribute('label') || '';

// ✅ GOOD: 別のフォールバック要素を使用
<label part="label">
  <span part="label-text"><slot name="label"></slot></span>
  <span part="label-fallback"></span>  <!-- フォールバック用 -->
</label>
// フォールバック要素のみ更新
fallbackElement.textContent = this.getAttribute('label') || '';
```

#### 2. フォーカススタイルはミックスインで共通化
**問題**: 各コンポーネントで個別にフォーカススタイルを定義すると不整合が生じる

```typescript
// focus-styles-official.ts に集約
export function applyDADSFocusStyles() {
  return css`
    :host [part="base"]:focus-visible { /* ボタン */ }
    :host [part="summary"]:focus-visible { /* アコーディオン */ }
    :host [part="textarea"]:focus-visible { /* テキストエリア */ }
    :host [part="input"]:focus-visible { /* インプット */ }
  `;
}

// 各コンポーネントで使用
static definition = {
  styles: [tokens, styles, applyDADSFocusStyles()]
};
```

#### 3. 属性の遅延同期にqueueMicrotaskを使用
**問題**: `connectedCallback`時点では属性がまだ設定されていないケースがある

```typescript
connectedCallback() {
  super.connectedCallback();
  // 初期設定...

  // 属性が接続後に設定された場合のために再同期
  queueMicrotask(() => {
    if (!this.isConnected) return;
    this.#syncAllAttributes();
  });
}
```

#### 4. happy-domでのrows属性の型
**問題**: happy-domは`textarea.rows`を文字列として返す場合がある

```typescript
// ❌ 失敗する可能性
expect(textarea?.rows).toBe(5);

// ✅ 安全な比較
expect(Number(textarea?.rows)).toBe(5);
```

### 適用例
`packages/components/textarea/` の実装全体、特に:
- `textarea.ts`: スロットフォールバック、queueMicrotask
- `textarea-styles.ts`: ミックスインへの委譲
- `textarea.test.ts`: 型安全なテスト

### 注意点
- スロット親要素のtextContentは絶対に上書きしない
- フォーカススタイルは必ず共通ミックスインを使用
- テスト環境とブラウザ環境の差異を考慮

---

## [2025-01-07] DADS公式準拠フォーカススタイルとヘッドレスWebComponent設計思想
**タグ**: #dads #focus #tokens #design-philosophy #headless

### 概要
DADS（デジタル庁デザインシステム）公式実装を調査し、フォーカススタイルの不整合を発見・修正。同時に、ヘッドレスWebComponentライブラリとしての設計思想をドキュメント化。

### 詳細

#### 1. DADS公式フォーカススタイルの発見
**問題**: フォーカス時の`border-radius: .25rem`が公式にはない

公式実装（GitHub: digital-go-jp/design-system-example-components）を調査:
```css
/* Button.tsx / Textarea.tsx 共通 */
focus-visible:outline
focus-visible:outline-4
focus-visible:outline-black
focus-visible:outline-offset-[calc(2/16*1rem)]
focus-visible:ring-[calc(2/16*1rem)]
focus-visible:ring-yellow-300
/* ← border-radiusの変更なし */
```

**対応**: `focus-styles-official.ts`から全ての`border-radius`を削除

#### 2. 3層トークン構造の確立
```
Primitive Tokens (DADS公式)
    ↓
Semantic Tokens (意味層)
    ↓
Local Tokens (--dads-* オーバーライド用API)
    ↓
CSS Properties
```

各層の役割:
- **Primitive**: DADS公式の基本値（変更しない）
- **Semantic**: 意味的なマッピング（低頻度変更）
- **Local**: 外部カスタマイズ用API（ユーザーが変更可能）

#### 3. ヘッドレスWebComponentライブラリ思想
Radix UI / shadcn UIから着想:
- DADS準拠をデフォルトに
- `--dads-*` プレフィックスでオーバーライドポイントを提供
- Shadow DOMのカプセル化を活かしながらCSS変数APIで安全に拡張

### 適用例
```typescript
// フォーカストークンの3層構造
:host {
  /* セマンティック層 */
  --focus-outline-color: var(--color-neutral-black);
  --focus-ring-color: var(--color-primitive-yellow-300);

  /* ローカル層（API） */
  --dads-focus-outline-color: var(--focus-outline-color);
  --dads-focus-ring-color: var(--focus-ring-color);
}

/* 利用者によるオーバーライド */
dads-button {
  --dads-focus-ring-color: #your-brand-focus-color;
}
```

### 成果物
- `packages/styles/mixins/focus-styles-official.ts` - 公式準拠版に修正
- `docs/architecture/design-philosophy.md` - 設計思想ドキュメント
- `.claude/skills/headless-component-design/` - Claude Skills化

### 注意点
- 公式実装は必ずGitHubで確認（Tailwindクラスの解読が必要）
- `border-radius`はフォーカス時に変更しない（公式準拠）
- トークンの3層構造を維持し、API層（--dads-*）を公開する

---

## [2025-01-07] DADS角丸（Corner Shapes）仕様の発見と修正
**タグ**: #dads #corner-shapes #border-radius #design-tokens

### 概要
Textareaコンポーネントの角丸が公式仕様と異なることを発見し、修正。DADS公式の角丸設計ルールを文書化。

### 詳細

#### 発見した問題
実装では `0.25rem (4px)` を使用していたが、公式は `0.5rem (8px)` を使用。

```typescript
// ❌ 間違い
--textarea-border-radius: var(--border-radius-4, 0.25rem);

// ✅ 正解
--textarea-border-radius: var(--border-radius-8, 0.5rem);
```

#### DADS公式の角丸5段階スタイル

| スタイル | 正方形 | 長方形 | 用途 |
|---------|--------|--------|------|
| 角丸なし | 0px | 0px | シャープな印象 |
| **角丸スモール** | **8px** | **8px** | **フォーム要素** |
| 角丸ミディアム | 16px | 12px | カード、モーダル |
| 角丸ラージ | 32px | 16px | 大きな強調要素 |
| 角丸フル | 50% | 50% | ピル、アバター |

#### 重要な原則
**同じスタイルでもサイズによって視覚的印象が異なる**
- 小さいコンポーネント → 角丸の影響が強く見える
- コンポーネント種別ごとに個別調整が必要

### 適用例
```css
/* フォーム要素は角丸スモール（8px）を使用 */
--textarea-border-radius: var(--border-radius-8, 0.5rem);
--button-border-radius: var(--border-radius-8, 0.5rem);
--input-border-radius: var(--border-radius-8, 0.5rem);
```

### 成果物
- `packages/components/textarea/textarea-tokens.ts` - 角丸を0.5remに修正
- `docs/architecture/design-philosophy.md` - 角丸セクション追加
- `.claude/skills/headless-component-design/references/corner-shapes.md` - 角丸リファレンス

### 注意点
- フォーム要素（Button, Textarea, Input）は **8px (0.5rem)** を使用
- 4px (0.25rem) は極小要素用であり、フォーム要素には使用しない
- 公式ドキュメント: https://design.digital.go.jp/dads/foundations/corner-shapes/

---

## [2025-01-07] placeholder属性非推奨の実装とアクセシビリティガイドライン
**タグ**: #dads #accessibility #placeholder #deprecated #forms

### 概要
DADS公式アクセシビリティガイドラインに基づき、フォーム入力要素の`placeholder`属性を非推奨として警告・禁止する仕組みを実装。

### 詳細

#### 1. placeholder非推奨の理由（DADS公式）
**参照**: https://design.digital.go.jp/dads/components/input-text/accessibility/

1. **コントラスト比が低い**: 視認性が良くない
2. **入力中の消失**: ユーザーが入力条件を確認できない
3. **スクリーンリーダー対応**: 読み上げられない場合がある

#### 2. 実装パターン: ソフトな禁止

```typescript
// packages/utils/deprecated-attrs.ts
export const DEPRECATED_FORM_ATTRS: DeprecatedAttrConfig[] = [
  {
    name: 'placeholder',
    reason: 'プレースホルダーはコントラスト比が低く、入力中に消えるためアクセシビリティ上の問題があります',
    alternative: 'support-text属性を使用してください',
    docsUrl: 'https://design.digital.go.jp/dads/components/input-text/accessibility/'
  }
];

// コンポーネント側での使用
connectedCallback() {
  checkDeprecatedAttrs(this, DEPRECATED_FORM_ATTRS);
}
```

**挙動**:
- 開発モードで警告を出力
- 内部のネイティブ要素には転送しない
- 本番環境（`NODE_ENV=production`）では警告なし

#### 3. support-textが代替として機能
```html
<!-- ❌ 非推奨 -->
<dads-textarea placeholder="入力例: 山田太郎"></dads-textarea>

<!-- ✅ 推奨 -->
<dads-textarea support-text="入力例: 山田太郎"></dads-textarea>
```

`support-text`の利点:
- 常に表示される（入力中も消えない）
- 高いコントラスト比
- `aria-describedby`で適切に関連付け

#### 4. テストのポイント
属性を設定してからDOMに追加する順序が重要:

```typescript
// ✅ 正しい順序
element = document.createElement('dads-textarea');
element.setAttribute('placeholder', '...'); // 先に属性設定
document.body.appendChild(element); // 後でDOM追加

// ❌ 間違い（警告が発火しない）
element = createTestElement('dads-textarea'); // DOM追加済み
element.setAttribute('placeholder', '...'); // connectedCallback後
```

### 成果物
- `packages/utils/deprecated-attrs.ts` - 非推奨属性ユーティリティ（新規）
- `packages/components/textarea/textarea.ts` - placeholder禁止実装
- `packages/components/textarea/textarea.test.ts` - 非推奨属性テスト追加
- `docs/architecture/design-philosophy.md` - アクセシビリティセクション追加
- `.claude/skills/headless-component-design/references/accessibility.md` - 参照ドキュメント（新規）

### 注意点
- placeholder属性は`observedAttributes`から除外
- `#syncTextareaAttributes`でも転送しない
- 将来的にエラーとして扱う可能性を考慮した設計
- support-textは必ず`aria-describedby`で関連付け

---

## [2026-01-07] フォームラベル・エラー表示の設計パターン
**タグ**: #dads #forms #labels #errors #accessibility

### 概要
フォームコンポーネントの要否ラベルとエラー表示の設計パターンを確立。任意ラベルの廃止、読み取り専用ラベルの追加、エラープレフィックスの統一。

### 詳細

#### 1. 要否ラベルの設計
| 状態 | 表示テキスト | 備考 |
|------|--------------|------|
| 必須 (required) | ※必須 | 赤色で表示 |
| 読み取り専用 (readonly) | 読み取り専用 | デフォルト色 |
| 任意 | **表示なし** | optional属性は廃止 |

**重要な排他制御**: `required`と`readonly`が両方設定された場合、`required`が優先される。

```typescript
#updateRequirement() {
  // required と readonly は排他的（required優先）
  if (this.hasAttribute('required')) {
    requirement.textContent = '※必須';
  } else if (this.hasAttribute('readonly')) {
    requirement.textContent = '読み取り専用';
  } else {
    requirement.textContent = '';
    requirement.style.display = 'none';
  }
}
```

#### 2. エラーメッセージのプレフィックス
**ルール**: 属性経由のエラーには全角「＊」をプレフィックス（スペースなし）

```typescript
// error-text属性経由の場合
fallback.textContent = errorAttr ? `＊${errorAttr}` : '';

// スロット経由のカスタムエラーにはプレフィックス不要
// ユーザーが自由にフォーマットできるため
```

表示例:
- `error-text="入力が必須です"` → 表示: `＊入力が必須です`
- `<span slot="error-text">カスタムエラー</span>` → 表示: `カスタムエラー`

#### 3. optional属性の廃止理由
- ユーザーテストで「任意」表示は冗長と判断
- 必須以外はデフォルトで任意と理解される
- シンプルなUIがアクセシビリティ向上に寄与

#### 4. readonly用汎用ミックスインの作成
複数のフォームコンポーネント間で一貫したreadonlyスタイルを提供:

```typescript
// packages/styles/mixins/readonly-styles.ts
export function applyReadonlyStyles() {
  return css`
    :host {
      --readonly-background: var(--color-neutral-solid-gray-50, #f2f2f2);
      --dads-readonly-background: var(--readonly-background);
    }
    :host([readonly]) [part="textarea"],
    :host([readonly]) [part="input"] {
      background-color: var(--dads-readonly-background);
      cursor: default;
    }
  `;
}
```

### 適用例
```html
<!-- 必須フィールド -->
<dads-textarea label="お名前" required>
</dads-textarea>
<!-- 表示: お名前 ※必須 -->

<!-- 読み取り専用フィールド -->
<dads-textarea label="ユーザーID" readonly value="user123">
</dads-textarea>
<!-- 表示: ユーザーID 読み取り専用 -->

<!-- エラー表示 -->
<dads-textarea label="コメント" error error-text="入力が必須です">
</dads-textarea>
<!-- 表示: ＊入力が必須です -->
```

### 成果物
- `packages/components/textarea/textarea.ts` - 要否ラベル・エラープレフィックス実装
- `packages/styles/mixins/readonly-styles.ts` - readonly用汎用ミックスイン（新規）
- テスト更新: required/readonly/error表示のテスト追加

### 注意点
- プレフィックスはCSSの`::before`ではなくテキストとして追加（アクセシビリティ向上）
- `required`と`readonly`の排他制御は必ず実装
- `optional`属性は完全に削除（破壊的変更）
- スロット経由のカスタムコンテンツはそのまま表示

---

## [2026-01-07] FormComponent: フォーム参加可能なWeb Components基盤
**タグ**: #webcomponents #forms #formAssociated #elementInternals

### 概要
Web Componentsがネイティブフォームに参加するための基盤クラス`FormComponent`の仕組みと使い方。

### 詳細

#### 1. Form Associated Custom Elementsとは
通常のカスタム要素はShadow DOM内のフォーム要素と外部の`<form>`が接続されない。
Form Associated Custom Elementを使うと、カスタム要素自体がフォームに参加できる。

#### 2. 既存の基盤クラス

| クラス | 場所 | 用途 |
|--------|------|------|
| `FormComponent` | `packages/core/web-components.ts:548` | フォーム参加の基本クラス |
| `TypographyFormComponent` | `packages/core/typography/typography-web-component.ts:108` | タイポグラフィ付きフォーム基盤 |

#### 3. FormComponentの提供機能

```typescript
export class FormComponent extends WebComponent {
  static readonly formAssociated = true;  // フォーム参加を宣言
  readonly _internals: ElementInternals;  // フォームAPIアクセス

  constructor() {
    super();
    this._internals = this.attachInternals();  // 内部状態へのアクセス取得
  }

  // 提供されるプロパティ
  get form() { return this._internals.form; }  // 所属フォーム
  get validity() { return this._internals.validity; }  // バリデーション状態
  get validationMessage() { return this._internals.validationMessage; }

  // 提供されるメソッド
  checkValidity() { return this._internals.checkValidity(); }
  reportValidity() { return this._internals.reportValidity(); }

  // ライフサイクルコールバック
  formDisabledCallback(disabled: boolean) { /* フォーム無効化時 */ }
  formResetCallback() { /* フォームリセット時 */ }
  formStateRestoreCallback(state) { /* 状態復元時 */ }
}
```

#### 4. 使用例: フォーム送信ボタン

```typescript
import { TypographyFormComponent } from '../../core/typography/typography-web-component.js';

export class DadsButton extends TypographyFormComponent {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.#handleClick);
  }

  #handleClick = () => {
    if (this.hasAttribute('disabled')) return;

    const type = this.getAttribute('type');
    const form = this._internals.form;  // FormComponentから継承

    if (!form) return;

    switch (type) {
      case 'submit':
        form.requestSubmit();  // フォーム送信
        break;
      case 'reset':
        form.reset();  // フォームリセット
        break;
    }
  };
}
```

#### 5. 使用例: 入力コンポーネント

```typescript
export class DadsTextarea extends TypographyFormComponent {
  static readonly formAssociated = true;  // 継承元で宣言済みだが明示も可

  #handleInput = () => {
    // フォーム値の更新
    this._internals.setFormValue(this.#textarea.value);
  };

  // バリデーション設定
  #setInvalidState(message: string) {
    this._internals.setValidity(
      { customError: true },
      message,
      this.#textarea  // バリデーション対象要素
    );
  }

  #clearInvalidState() {
    this._internals.setValidity({});
  }
}
```

### ElementInternals APIまとめ

| メソッド/プロパティ | 説明 |
|---------------------|------|
| `form` | 所属する`<form>`要素 |
| `setFormValue(value)` | フォーム送信時の値を設定 |
| `setValidity(flags, message, anchor)` | バリデーション状態を設定 |
| `checkValidity()` | バリデーションチェック |
| `reportValidity()` | バリデーションエラーを表示 |
| `validity` | ValidityStateオブジェクト |
| `validationMessage` | バリデーションメッセージ |
| `willValidate` | バリデーション対象かどうか |

### 適用例
- `packages/components/textarea/textarea.ts` - 入力コンポーネント
- Issue #5: `dads-button`のフォーム送信対応

### 注意点
- `static readonly formAssociated = true`は必須（宣言がないとattachInternals()が機能しない）
- `attachInternals()`はコンストラクタで1回だけ呼ぶ
- Shadow DOM内のネイティブフォーム要素は外部formと接続されないため、必ず`_internals`経由で操作
- フォームリセット時は`formResetCallback`で初期値に戻す処理が必要

### 参考資料
- [MDN: Form-associated custom elements](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals)
- [web.dev: More capable form controls](https://web.dev/articles/more-capable-form-controls)
- GitHub Issue #5: dads-button Form Associated対応

---

## [2026-01-08] Form-Associated Web Componentsのバリデーション設計
**タグ**: #webcomponents #forms #validation #elementInternals #dads

### 概要
Form-Associated Custom Elementsでカスタムバリデーションを実装する際、ネイティブバリデーションとの干渉を避けるための設計パターンを確立。`reportValidity()`の罠と`setValidity({})`の重要性を発見。

### 詳細

#### 1. 発生したバグ
「Email形式エラー → 入力削除 → 再送信 → 必須エラーが表示されない」という問題。

#### 2. 根本原因

**問題A: setValidity({})の欠如**
```typescript
// ❌ 不完全なエラークリア
#clearValidationError(): void {
  this.removeAttribute('error');
  this.removeAttribute('error-text');
  // setValidity({})がない → 内部状態がdirtyのまま
}

// ✅ 正しいエラークリア
#clearValidationError(): void {
  this.removeAttribute('error');
  this.removeAttribute('error-text');
  this._internals.setValidity({});  // 状態を明示的にクリア
}
```

**問題B: reportValidity()とネイティブinputの干渉**
```typescript
// ❌ ネイティブバリデーションが干渉
#handleFormAction() {
  if (form.reportValidity()) {  // ← Shadow DOM内の<input type="email">をチェック
    form.requestSubmit();
  }
}

// ✅ カスタムバリデーションに任せる
#handleFormAction() {
  form.requestSubmit();  // submitイベントでカスタムバリデーション実行
}
```

#### 3. 設計原則

| 原則 | 理由 |
|------|------|
| required属性を内部inputに転送しない | ネイティブバリデーション回避（aria-requiredで代替） |
| カスタムバリデーションはsubmitイベントで実行 | 一元管理、優先順位制御 |
| ボタンはrequestSubmit()を直接呼ぶ | reportValidity()の干渉を防ぐ |
| エラークリア時はsetValidity({})必須 | 次回submit時の再評価を保証 |

#### 4. バリデーション優先順位
```typescript
#handleFormSubmit = (e: Event): void => {
  // 1. required（必須）チェック - 最優先
  const isRequiredValid = this.#validateRequired();
  if (!isRequiredValid) {
    e.preventDefault();
    return;
  }

  // 2. typeMismatch（形式）チェック
  const isTypeMismatchValid = this.#validateTypeMismatch();
  if (!isTypeMismatchValid) {
    e.preventDefault();
  }
};
```

### 適用例
- `packages/components/input-text/input-text.ts` - バリデーション実装
- `packages/components/button/button.ts` - フォームアクション処理
- `packages/utils/validation.ts` - バリデーションルール定義

### 関連ADR
[ADR-002: Form-Associated Web Componentsのバリデーションアーキテクチャ](../adr/ADR-002-form-validation-architecture.md)

### 注意点
- `form.reportValidity()`はShadow DOM内のネイティブ要素もチェックする
- `_internals.setValidity({})`を呼ばないと次回submitがブロックされる可能性
- クリティカルなコンポーネント（送信ボタン等）は遅延ロードではなく即座にロード

---

## [2026-01-16] CSSにおけるSpacing Tokensの徹底活用
**タグ**: #css #design-tokens #spacing #maintainability

### 概要
CSSでハードコードされた`calc(X / 16 * 1rem)`形式の値を、`--spacing-*`トークンに置き換えることで保守性と一貫性を向上。CLAUDE.mdのガイドラインに準拠。

### 詳細

#### 1. 置き換えルール

| ハードコード値 | Spacing Token |
|---------------|---------------|
| `calc(4 / 16 * 1rem)` (4px) | `var(--spacing-1)` |
| `calc(8 / 16 * 1rem)` (8px) | `var(--spacing-2)` |
| `calc(12 / 16 * 1rem)` (12px) | `var(--spacing-3)` |
| `calc(16 / 16 * 1rem)` (16px) | `var(--spacing-4)` |
| `calc(24 / 16 * 1rem)` (24px) | `var(--spacing-6)` |
| `calc(40 / 16 * 1rem)` (40px) | `var(--spacing-10)` |
| `calc(48 / 16 * 1rem)` (48px) | `var(--spacing-12)` |

#### 2. 例外ケース（px値を許容）

```css
/* ボーダー幅（1px, 2px, 3px）はpxで指定 */
border: 1px solid var(--color-neutral-solid-gray-600);
border-width: 3px; /* hover時のボーダー幅 */

/* hairline（2px未満）の高さ */
height: 2px; /* hairline - ボーダー幅なのでpx指定 */

/* 存在しないトークンの代替 */
width: 2.75rem; /* 44px - spacing-11が存在しないため */
height: 3.5rem; /* 56px - spacing-14が存在しないため */
```

#### 3. 負の値を使う場合

```css
/* calc()で負の値に変換 */
margin-left: calc(var(--spacing-1) * -1);  /* -4px */
top: calc(var(--spacing-3) * -1);           /* -12px */
```

### 適用例
```css
/* ❌ BAD: ハードコード */
padding: calc(16 / 16 * 1rem);
column-gap: calc(8 / 16 * 1rem);
outline: calc(4 / 16 * 1rem) solid var(--color-neutral-black);

/* ✅ GOOD: Spacing Tokens */
padding: var(--spacing-4);
column-gap: var(--spacing-2);
outline: var(--spacing-1) solid var(--color-neutral-black);
```

### 成果物
- `packages/components/calendar/calendar-styles.ts` - トークン適用
- `packages/components/date-picker/date-picker-styles.ts` - トークン適用

### 注意点
- フォーカススタイル（outline, outline-offset, box-shadow）もトークン化する
- 存在しないトークンはコメントで理由を明記して`rem`値を使用
- Light DOMコンポーネントではフォールバック値を指定: `var(--spacing-4, 16px)`

---

## [2026-01-16] Web Components間の型安全なPublic API定義
**タグ**: #typescript #webcomponents #type-safety #interfaces

### 概要
親コンポーネントが子コンポーネントのメソッドを呼び出す際、`as unknown as {...}`の型アサーションではなく、インターフェースを定義してexportすることで型安全性を確保。

### 詳細

#### 1. 問題: 型アサーションの乱用

```typescript
// ❌ BAD: インラインの型アサーション
const calendar = this.#calendar as unknown as {
  setSelectedDate: (date: Date) => void;
  setDisplayMonth: (year: number, monthIndex0: number) => void;
  focus: () => void;
} | null;
```

**問題点**:
- 型定義が重複する可能性
- APIの変更時に追跡が困難
- コンポーネント間の契約が不明確

#### 2. 解決策: Public APIインターフェースの定義

```typescript
// calendar.ts
/**
 * DadsCalendarコンポーネントの公開API（型安全な参照用）
 */
export interface DadsCalendarPublicAPI {
  /** 選択日付を設定 */
  setSelectedDate(date: Date | null): void;
  /** 表示月を設定 */
  setDisplayMonth(year: number, monthIndex0: number): void;
  /** カレンダーにフォーカスを移動 */
  focus(): void;
}

// index.ts
export type { DadsCalendarPublicAPI } from './calendar.js';
```

#### 3. 利用側での型安全な参照

```typescript
// date-picker.ts
import type { DadsCalendarPublicAPI } from '../calendar/index.js';

// 型安全にキャスト
const calendar = this.#calendar as (HTMLElement & DadsCalendarPublicAPI) | null;

// TypeScriptが型チェックを行う
calendar?.setSelectedDate(new Date(year, month - 1, day));
calendar?.setDisplayMonth(year, month - 1);
calendar?.focus();
```

### 適用パターン

| シナリオ | パターン |
|----------|----------|
| 親→子のメソッド呼び出し | Public APIインターフェースをexport |
| 子→親のイベント通知 | CustomEventのdetail型を定義 |
| 動的ロード | defineXxx()関数で登録後に参照 |

### 成果物
- `packages/components/calendar/calendar.ts` - `DadsCalendarPublicAPI`インターフェース追加
- `packages/components/calendar/index.ts` - 型のexport追加
- `packages/components/date-picker/date-picker.ts` - 型安全な参照に修正

### 注意点
- インターフェースはpublicメソッドのみ定義（privateは含めない）
- JSDocコメントで各メソッドの用途を明記
- `type`キーワードでexportすることでランタイムバンドルに影響なし
- HTMLElementとの交差型`(HTMLElement & PublicAPI)`を使用

---

## テンプレート（新しい学習記録用）

## [日付] タイトル
**タグ**: #tag1 #tag2

### 概要
簡潔な説明

### 詳細
- ポイント1
- ポイント2
- ポイント3

### 適用例
```typescript
// コード例
```

### 注意点
- 注意点1
- 注意点2

---

## [2026-01-29] カードコンポーネント: ::slotted()の制限とLight DOMスタイリング
**タグ**: #css #webcomponents #slots #shadowdom #dads

### 概要
カードコンポーネントの実装で、`::slotted()`の重要な制限を発見。スロット内の子孫要素へのスタイリングは、Light DOM側で行う必要がある。

### 詳細

#### ::slotted()の制限
- `::slotted()`は**直接の子要素のみ**スタイル可能
- `::slotted(h2 a)`や`::slotted(h2) a`は**無効**
- `:is()`を使った複数要素のグループ化は可能: `::slotted(:is(h1, h2, h3))`

#### 構造の違いによる影響
```
DADS公式:                現在のWC:
<a class="card">         <dads-card>
  <h2>タイトル</h2>        <h2><a>タイトル</a></h2>
</a>                     </dads-card>
```
→ WCでは`h2`にスタイルは適用できるが、内部の`a`には`::slotted()`で届かない

#### 解決策
1. **コンポーネント内**: `::slotted()`で直接の子要素（h2, p等）にスタイル
2. **デモ/利用側**: Light DOMで子孫要素（h2 > a等）にスタイル

```css
/* コンポーネント内（Shadow DOM） */
[part="main"] ::slotted(:is(h1, h2, h3, h4, h5, h6)) {
  color: var(--dads-card-title-color);
}

/* デモ側（Light DOM） */
dads-card.card-example-1 h2 a {
  text-decoration: underline;
}
```

### 適用例
```typescript
// card-styles.ts
[part="main"] ::slotted(:is(h1, h2, h3, h4, h5, h6)) {
  color: var(--dads-card-title-color);
  font-size: var(--dads-card-title-font-size);
  font-weight: var(--dads-card-title-font-weight);
  line-height: var(--dads-card-title-line-height);
  letter-spacing: var(--dads-card-title-letter-spacing);
}
```

### 注意点
- `::part()`はLight DOM要素には使用不可（Shadow DOM内部の要素のみ）
- 作例固有のスタイルはデモ側に配置（他の作例で異なる構造の可能性）
- CSS変数は必ずグローバルトークンを参照（ハードコード禁止）
- 例外: `letter-spacing: 0.02em`（グローバルトークンなし）

### 関連パターン
- ::slotted() Limitation Pattern
- Light DOM Styling for Descendant Elements Pattern
- CSS Token 3-Layer Architecture Pattern
- Div Soup Reduction Pattern

---

## [2026-01-29] カードコンポーネント: Token-Driven Customization（バリアント属性なし）
**タグ**: #css #webcomponents #design-tokens #architecture #dads

### 概要
カードコンポーネントの視覚的バリエーション（bordered, elevated, filled等）は、`variant`属性ではなくCSSトークンと`::part()`による外部カスタマイズで実現する設計を採用。

### 詳細

#### なぜvariant属性を追加しないか

| コンポーネント | variant属性 | 理由 |
|--------------|-------------|------|
| `dads-button` | あり（solid/outlined/text） | ボタンはセマンティックな目的を持つ |
| `dads-card` | **なし** | カードはレイアウトコンテナ、視覚スタイルはコンテキスト依存 |

**根拠**:
1. **DADS哲学**: DADSカードは構造的柔軟性を重視し、視覚バリアントを定義していない
2. **作例の多様性**: DADS公式の6作例は、同じコンポーネントでも大きく異なる視覚表現
3. **柔軟性**: 固定バリアントでは表現できないデザインが多い

#### カスタマイズ方法

```css
/* "Elevated" スタイル */
dads-card.elevated {
  --dads-card-border-width: 0;
  --dads-card-border-radius: var(--border-radius-16);
  box-shadow: var(--elevation-4);
}

/* "Bordered" スタイル */
dads-card.bordered {
  --dads-card-border-width: 1px;
  --dads-card-border-color: var(--color-neutral-solid-gray-420);
}

/* "Transparent" スタイル */
dads-card.transparent {
  --dads-card-background: transparent;
  --dads-card-border-width: 0;
  --dads-card-divider-width: 0;
}
```

### 適用例
- `packages/components/card/card.ts` - JSDocに設計思想を明記
- `packages/components/card/card-tokens.ts` - 公開APIトークンを文書化
- `src/demos/showcase-components.ts` - 各パターンの実装例

### 注意点
- トークン（`--dads-card-*`）は公開API、セマンティック（`--card-*`）は内部使用
- `::part()`で各領域（base, media, main, sub）をカスタマイズ可能
- 利用者にはCSS知識が必要だが、制限なく自由にスタイリング可能

---

## [2026-01-29] カードコンポーネント: overflow: clip問題と対処法
**タグ**: #css #webcomponents #focus #shadowdom

### 概要
カードコンポーネントの`[part="base"]`に設定された`overflow: clip`が、内部要素のfocus ringやbox-shadowをクリップする問題を発見。

### 詳細

#### 問題の発生条件
1. カード内にフォーカス可能な要素（リンク、ボタン）がある
2. その要素がカードの端に近い位置にある
3. `[part="base"]`に`overflow: clip`が設定されている

#### 影響
- focus ringの一部が見切れる
- box-shadowがクリップされる
- アクセシビリティ上の問題（フォーカス位置が不明瞭）

#### 対処法

```css
/* 利用側で::part()を使ってoverflowを解除 */
dads-card::part(base) {
  overflow: visible;
}
```

#### なぜデフォルトでclipなのか
- コンテンツがカードからはみ出さないようにするため
- 画像のアスペクト比制御のため
- 意図しないレイアウト崩れを防ぐため

### 適用例
```css
/* DADS Example 1: オーバーラップするmain領域 */
dads-card.card-example-1::part(base) {
  overflow: visible;  /* main領域がmediaに被るため必須 */
}

dads-card.card-example-1::part(main) {
  margin-top: calc(var(--spacing-6) * -1);  /* 負のマージンでオーバーラップ */
}
```

### 注意点
- `overflow: visible`にすると、意図しないはみ出しが発生する可能性
- 必要なカードインスタンスのみ選択的にオーバーライド
- focus ringが必要な場合は必ず対処を実施
- JSDocとREADMEに対処法を明記

---

## [2026-02-09] グローバルメニュー: a11y-annotate の配置調整と nav 命名
**タグ**: #a11y #annotation #navigation #webcomponents #dads

### 概要
グローバルメニューの注釈で `callout-lane="top"` を固定すると、`<nav>` / `role="list"` / サブメニュートリガーのコールアウトが重なりやすい。広い横並びナビゲーションでは既定配置を優先した方が可読性が安定した。

### 詳細
- 横幅の広い target（`dads-global-menu`）に対してレーン固定をすると、複数コールアウトが同一帯に集まり、線が交差しやすい。
- `a11y-annotate` は既定配置（callout-lane未指定）に戻し、周辺余白だけ最小限確保する方が他コンポーネントと同じ見え方になる。
- `dads-global-menu` は内部に `<nav>` を持つため、`aria-label` / `aria-labelledby` でナビゲーション名を必ず付与できるAPIと作例を揃える。

### 適用例
```html
<a11y-annotate target-selector="dads-global-menu">
  <div style="padding: 60px 0;">
    <dads-global-menu aria-label="主要メニュー">
      ...
    </dads-global-menu>
  </div>
</a11y-annotate>
```

### 注意点
- 同一ページに複数のナビゲーションランドマークがある場合は、`aria-label` か `aria-labelledby` のどちらかで必ず命名する。
- 注釈の見切れや重なり対策は、まず `callout-lane` ではなく target 周辺の余白調整で解決する。

## [2026-02-09] Project Pagesで `src/demos` 絶対パスが404になる問題と予防策
**タグ**: #webcomponents #workflow #debug #architecture

### 概要
`tableControl` デモ内の dynamic import が `import('/src/demos/...')` になっていたため、GitHub Pages（Project Pages: `/<repo>/`）で `https://<user>.github.io/src/demos/...` に解決されて 404 になり、MVC デモの初期化が失敗した。

### 詳細
#### 症状
- `table-control-mvc.js` / `table-control-municipal-mvc.js` / `table-control-preset-mvc.js` の取得が 404
- `dads-table-control` は読み込まれるが、データ連動デモが表示されない

#### 原因
- 埋め込み `script type="module"` の dynamic import が先頭 `/` の絶対パスだった
- Project Pages はルート配信ではなく `/<repo>/` 配下のため、`/src/...` はリポジトリ外を指してしまう

#### 修正
- `src/demos/showcase-table-control.ts` の import を `./src/demos/...` に変更
- `src/demos/showcase-table-control.test.ts` で相対パス期待値へ更新し、`import('/src/demos/` を含まないことを検証
- `tests/pages-build-viewer.test.ts` で `dist-pages/src/demos/showcase-table-control.js` に絶対パスが残っていないことを検証

### 再発防止
- レビュー観点: viewer埋め込み script の dynamic import は先頭 `/` を禁止し、`./` など `document.baseURI` 基準の相対パスを使う
- テスト観点: Pages ビルド後の `dist-pages/src/demos/*.js` に対して絶対パス混入を検知する

### 注意点
- `deepl-input-controller` の解決失敗はリポジトリ内定義がなく、ブラウザ拡張注入などのノイズの可能性が高い。今回の主因とは切り分ける

---

*継続的に更新されます*
