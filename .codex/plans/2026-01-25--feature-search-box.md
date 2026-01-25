# 検索ボックス（`dads-search-box`）コンポーネント追加 Plan

## 目標
- DADS（デジタル庁デザインシステム）HTML版の「検索ボックス」を参照実装として、Web Components版 `dads-search-box` を追加する
- a11yAnnotations（categories + callouts）を付与し、viewerデモで確認できるようにする
- 公開APIとして「属性/プロパティ」および「CSS変数」のAPIテーブルを用意し、CEM（`custom-elements.json`）に反映される状態にする

## 背景
- DADSのStorybook（`/dads/html/?path=/docs/...`）側は内容取得が困難だったため、デジタル庁のHTML参照実装（`digital-go-jp/design-system-example-components-html` の `search-box`）を構造・CSSの一次情報として採用する
- CSS設計は `css-writing-rules` と `headless-component-design` に従う（`--dads-*` 変数API、part公開、状態は属性、変数再代入、!important禁止、角丸8px 等）

## スコープ
- やること：
  - `dads-search-box`（検索語入力 +（任意）検索対象select + 検索ボタン）の追加
  - DADS HTML参照実装に合わせた見た目（Shadow DOM向け移植）と状態（hover/focus/forced-colors）
  - a11yAnnotations、公開API（属性/イベント/parts/CSS vars）定義、viewerデモ、テスト、CEM更新、validate:wc通過
- やらないこと：
  - 「詳細検索パネル」「固定キーワードショートカット」等（参照HTMLに含まれない機能は v1 では入れない）
  - サジェスト/オートコンプリートUIなどの追加機能
  - 既存コンポーネントの大規模改修（共通化のための大規模リファクタ等）

## 前提 / 制約
- 参照元（一次情報）
  - HTML参照実装: `digital-go-jp/design-system-example-components-html/src/components/search-box/*`（MDX/Playground/CSS）
- Figmaリンクは提示されているが、まずは HTML参照実装を優先し、差分があれば後追いで微調整する

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
#### 参照HTMLの構造（要点）
- ルートは横並び flex（fields と submit button）
- fields 内に
  - 任意の select（検索対象）
  - search input（虫眼鏡アイコン + visually-hidden ラベル + `<input type="search">`）
- select がある場合は input 側の左角丸を落とし、`-1px` で境界線を重ねて一体化

#### Web Componentsとしての実装方針（v1確定）
- **Form-Associated Custom Element** として実装し、`ElementInternals#setFormValue(FormData)` で **複数のname/value（query + scope）** をフォームへ提供する（hidden input同期はしない）
- Enterキー/ボタン押下で **cancelable な `dads-search` イベント**を発火し、`preventDefault()` されていなければ `internals.form?.requestSubmit()` を呼ぶ
- scope option は `dads-select` と同様に **Light DOMの `option/optgroup` を監視して Shadow内の `<select>` へ複製**（MutationObserver）

#### 公開API（案）: 属性 / プロパティ
| 区分 | 名前 | 型 | デフォルト | 目的 |
|---|---|---|---|---|
| attr/prop | `value` | `string` | `""` | 検索語（query） |
| attr/prop | `name` | `string` | `"q"` | query のフォーム名 |
| attr/prop | `placeholder` | `string` | `""` | input placeholder |
| attr/prop | `disabled` | `boolean` | `false` | 全体の無効化（select/input/button） |
| attr | `label` | `string` | `"検索"` | query の視覚的に非表示ラベル（label要素内） |
| attr | `aria-label` | `string` | `null` | query inputへ転写（label未指定の補助） |
| attr | `aria-labelledby` | `string` | `null` | query inputへ転写（外部ラベル参照） |
| attr | `aria-describedby` | `string` | `null` | query inputへ転写（外部説明参照） |
| attr/prop | `scope-label` | `string` | `"検索対象"` | スコープselectの可視ラベル |
| attr/prop | `scope-name` | `string` | `"scope"` | scope のフォーム名（optionsがある時のみ） |
| attr/prop | `scope-value` | `string` | `""` | scope の選択値（内部selectへ反映） |
| attr/prop | `button-label` | `string` | `"検索"` | 送信ボタンラベル |

#### 公開API（案）: Events / Parts
- Events
  - `dads-search`：検索実行（detail: `{ query: string; scope: string }`、`cancelable: true`）
- CSS Parts（Shadow DOMのスタイリングポイント）
  - `base`, `fields`
  - `scope`, `scope-label`, `scope-select`, `scope-icon`
  - `query`, `search-icon`, `visually-hidden`, `input`
  - `button`（内包する `<dads-button>` ホスト要素）

#### 公開API（案）: CSS変数（`--dads-search-box-*`）
（v1は「必要十分」から開始し、足りなければ追加）
| CSS変数 | デフォルト案 | 用途 |
|---|---|---|
| `--dads-search-box-gap` | `var(--spacing-4, 1rem)` | fields と button の間隔 |
| `--dads-search-box-color` | `var(--color-neutral-solid-gray-900)` | 全体の文字色 |
| `--dads-search-box-font-size` | `var(--font-size-16, 1rem)` | ベース文字サイズ |
| `--dads-search-box-letter-spacing` | `0.02em` | 文字詰め |
| `--dads-search-box-border-color` | `var(--color-neutral-solid-gray-600)` | input/select の枠線色 |
| `--dads-search-box-border-color-hover` | `var(--color-neutral-black)` | hover時の枠線色 |
| `--dads-search-box-border-radius` | `var(--border-radius-8, 0.5rem)` | 角丸（8px） |
| `--dads-search-box-scope-width` | `calc(160 / 16 * 1rem)` | scope select 幅 |
| `--dads-search-box-scope-bg` | `var(--color-neutral-solid-gray-50)` | scope select 背景 |
| `--dads-search-box-scope-label-color` | `var(--color-neutral-solid-gray-700)` | scopeラベル色 |
| `--dads-search-box-scope-icon-color` | `var(--color-neutral-solid-gray-600)` | caret色 |
| `--dads-search-box-input-bg` | `var(--color-neutral-white)` | query input 背景 |
| `--dads-search-box-input-placeholder-color` | `var(--color-neutral-solid-gray-600)` | placeholder色 |
| `--dads-search-box-search-icon-color` | `var(--color-neutral-solid-gray-600)` | 虫眼鏡色 |
| `--dads-search-box-input-padding` | `calc(12/16*1rem) calc(16/16*1rem) calc(12/16*1rem) calc(48/16*1rem)` | query input padding |

#### a11yAnnotations 方針（案）
- categories
  - semantics: `<input type="search">` と（任意の）`<select>`、送信ボタンで構成する複合コンポーネント
  - labels: 外部ラベルがある場合は `aria-labelledby` を推奨、無い場合は `label`（visually-hidden）または `aria-label` を使用
  - keyboard: Tab順（scope→query→button）、Enterで検索実行、buttonで検索実行
  - zoom: 44x44以上の操作領域
  - forced-colors: アイコン色の強制色対応（CanvasText）
  - motion: アニメーションなし
- callouts（最低3つ）
  - scope select（`[part="scope-select"]`）
  - query input（`[part="input"]`）
  - submit button（`[part="button"]`）

### その他（Docs/Marketing/Infra など）
- 追加ファイル（予定）
  - `packages/components/search-box/*`（本体/define/tokens/styles/test/index）
  - `packages/autoload/dads/search-box.ts`
- 既存ファイル更新（予定）
  - `packages/components/index.ts`（export追加）
  - `src/demos.ts`（検索ボックスデモ + a11y-annotate）
  - `viewer.html`（セレクタに追加）
  - `packages/utils/icons.ts`（虫眼鏡アイコン追加）
  - `custom-elements.json`（`npm run cem:analyze`で更新）

## 受入基準
- [ ] `dads-search-box` が追加され、DADS HTML参照実装と同等のレイアウト（scopeあり/なし）が再現できる
- [ ] Light DOMの option/optgroup が scope select に反映され、0件なら scope UI が無効/非表示になる
- [ ] `aria-labelledby` / `aria-label` / `aria-describedby` が input に反映され、アクセシブルネームが成立する
- [ ] `dads-search` が（Enter/ボタン）で発火し、`preventDefault()` された場合は submit 相当処理を行わない
- [ ] CSS変数（`--dads-search-box-*`）と CSS part がCEMに出力され、上書き可能になっている
- [ ] viewerデモで表示確認でき、a11y-annotate の callout が表示される
- [ ] `npm run validate:wc` が通る
- [ ] `npm run ci` が通る

## リスク / エッジケース
- `option` のスタイリングはブラウザ差が大きい（完全一致しない可能性）
- scope有無で callout のターゲットが欠けると annotation 表示が崩れる可能性（デモでは scopeあり/なしを分ける）

## 作業項目（Action items）
1. `packages/components/search-box/` を雛形で追加（完了条件: `dads-search-box` がdefine可能でShadow DOMが描画される）
2. DADS参照CSSをShadow DOM向けに移植し、tokens + styles に分離（完了条件: scopeあり/なしの見た目が概ね一致）
3. scope options 複製（MutationObserver）を実装（完了条件: Light DOMのoption変更がselectに反映され、選択値が可能な限り保持される）
4. 検索実行（Enter/クリック）→ `dads-search` 発火 + `requestSubmit()` を実装（完了条件: cancelableで抑止可能、form内でsubmit相当が動作）
5. a11yAnnotations（categories + callouts）を追加（完了条件: viewerで注釈パネルとコールアウトが表示される）
6. テスト `packages/components/search-box/search-box.test.ts` を追加（完了条件: 主要属性反映、scope複製、イベント発火がテストされる）
7. Autoloader + exports + viewerデモを追加（完了条件: `import('dads-search-box')` とviewerセレクタで表示できる）
8. `npm run cem:analyze` / `npm run validate:wc` / `npm run ci` を実行して差分を整える（完了条件: DoDの必須コマンドが通り、`custom-elements.json` が最新）

## テスト計画
- 自動
  - `npm run test:run`
  - `npm run type-check`
  - `npm run validate:wc`
  - `npm run cem:analyze`
  - `npm run ci`
- 手動（viewer）
  - scopeあり/なし表示、hover/focus-visible、forced-colorsでのアイコン視認性
  - ラベル戦略（`aria-labelledby` 指定時 / `aria-label` 指定時 / `label` のみ）での読み上げ確認
  - Enter/ボタンで `dads-search` が発火し、form内でsubmit相当が動く（preventDefault で抑止できる）

## オープンクエスチョン
- 該当なし（承認時に「汎用性/拡張性/クリーンコード」優先で決定済み）

