# 実装計画: Combobox Phase 1（Figma Study反映）

## 概要
- **作成日**: 2026-02-19
- **作成者**: Codex
- **ステータス**: Approved
- **優先度**: High
- **見積もり工数**: 24h（実装/検証/ドキュメント更新を含む）

## 背景と目的
`dads-select` はネイティブ `<select>` ベースであり、検索可能リスト・複数選択チップ・インクリメンタル絞り込みを同時に満たせない。  
Figma study の最新分岐を基準に、DADS準拠の `dads-combobox` を Phase 1 で定義し、実装に着手できる計画に落とし込む。

## Figma 調査サマリ

### 調査対象ノード
| ノードID | 役割 |
|---|---|
| `22900:119` | study全体の基準ボード |
| `25022:13257` | 一時コンポーネント整理（Select系） |
| `24714:15074` | 2/18時点のスタディまとめ |
| `25036:16077` | 2/18時点のスタディまとめ2（Input/List Box系） |
| `25022:13314` | `_Select--0210` |
| `25023:14970` | `Search` |
| `25023:13592` | `_List Box 2018` |
| `25022:13235` | `_List Item Multiple` |
| `25022:13294` | `_List Item Single` |
| `25036:16359` | `Input List Box` |
| `25036:16085` | `_Input List Item Single` |
| `25036:16292` | `Input Text` |

### 観察結果（実装に効く要点）
1. トリガーは「入力欄と同等の見た目」を持つが、ポップアップ操作と一体で設計されている。
2. 単一選択と複数選択でアイテム描画が異なる（選択マーク/チップ/補助テキスト差分）。
3. Search と List Box が独立ではなく、`入力 -> 候補絞り込み -> 選択` の連続体として扱われている。
4. Input List Box では、入力編集中に候補の意味的グルーピングが必要になる。
5. DADSのフォーム要件（ラベル、補助テキスト、エラー、必須）を崩さないことが前提。

## ユーザー確定事項（この計画の拘束条件）
1. **Close時はクリア**: ポップアップを閉じたら検索語をクリアする。
2. **Single未選択時の復帰**: 迷い入力で未確定のまま離脱した場合、既存選択へ自然復帰する。
3. **その他はDADS準拠**: 命名、フォーム挙動、視覚/状態設計、a11y方針は既存DADS仕様を優先する。
4. **Single選択表示中の再入力開始**: close状態で選択ラベル表示中に入力を開始した場合、検索queryは新規入力文字列のみを採用する（表示ラベルを接頭辞連結しない）。
5. **検索エイリアス提供方式**: 一括JSON属性は採用しない。option単位の `data-search`（JSON配列文字列）で明示供給する。
6. **ローマ字変換方針**: 内蔵自動変換は採用せず、`value` と `data-search` による予測可能な一致を優先する。

## 行動科学・認知科学ベースの操作方針
1. **Status quo bias 活用**: 明示確定（Enter/クリック）までは値を変更しない。
2. **エラー予防優先**: Blur/Tab で暗黙確定しない。誤選択を防ぐ。
3. **認知負荷低減**: 閉じたらクエリを消し、次回開始時にニュートラル状態へ戻す。
4. **可逆性担保**: Escape や外部クリックで安全に離脱できる。
5. **予測可能性維持**: 同一アクションで常に同一結果（キーボード/マウス間で整合）。

## ゴールと成功条件
- [ ] `dads-combobox` の API 契約（属性/イベント/slot/part）が確定している
- [ ] 単一選択・複数選択・検索入力の3系統シナリオが実装可能な状態遷移を持つ
- [ ] DADSフォーム要件（label/support/error/required/disabled）を満たす
- [ ] WCAG 2.2 AA で重大違反（BLOCKER/HIGH）がない
- [ ] `agents:verify` 相当の検証コマンドを通過可能な計画になっている

## 非ゴール（Phase 1外）
- 非同期サジェスト（APIフェッチ）
- 仮想スクロール
- 候補の高度ランキング/学習
- モバイル専用ジェスチャ最適化（将来phase）

## 技術設計

### コンポーネント戦略
- 新規: `packages/components/combobox/` に `dads-combobox`
- 再利用: `dads-input-text`, `dads-menu-list-box`, `dads-chip-label`, `dads-checkbox` の設計資産を優先
- 設計基準: `.claude/skills/css-writing-rules/SKILL.md` と `.claude/skills/headless-component-design/SKILL.md`

### API草案（Phase 1）

```ts
// attributes/properties
mode: 'single' | 'multiple'            // default: 'single'
filterable: boolean                    // default: true
clear-on-close: boolean                // default: true（ユーザー確定）
restore-on-cancel: boolean             // default: true（singleのみ）
open: boolean
disabled: boolean
required: boolean
name: string
value: string | string[]               // modeで型を分岐
placeholder: string
size: 'sm' | 'md' | 'lg'

// option extension (light DOM)
// 例: <option value="fukuoka" data-search='["福岡","ふくおか","f"]'>福岡県</option>
// data-search は JSON 文字列配列。parse失敗時は無視し、label/value検索にフォールバックする。

// events
dads-input    // query入力変化
dads-change   // 明示確定時のみ
dads-open
dads-close

// slots
label / support-text / error-text / required-error / default(option-like children)

// css parts (例)
wrapper / control / input / chip-list / listbox / option / option-label / option-meta / indicator
```

### 状態遷移（要点）
1. `closed.idle`  
2. `open.browsing`  
3. `open.filtering`  
4. `open.committing`  
5. `closed.restored`（single未確定離脱時のみ）

### 主要インタラクション契約
| 操作 | single | multiple |
|---|---|---|
| Enter（候補にフォーカス） | 候補を確定し close | 候補をトグル選択し open維持 |
| Escape | close + query clear + 既存値に復帰 | close + query clear + 選択維持 |
| 外部クリック | Escapeと同様 | Escapeと同様 |
| Tab離脱 | 未確定なら復帰 | 既確定のみ保持、未確定ハイライトは破棄 |
| close状態で選択表示中に文字入力開始 | queryを新規入力文字列で開始（ラベル連結しない） | queryを新規入力文字列で開始 |
| 1件ヒット時 | 自動確定しない（明示確定まで値不変） | 自動確定しない（明示確定まで値不変） |

## タスク分解（実装前提）
1. **契約固定（3h）**
   - API（attr/property/event/slot/part）確定
   - CEM出力前提のJSDoc定義
2. **状態機械実装（5h）**
   - open/filter/commit/cancel遷移
   - single復帰ロジック、close時クリア
3. **UIレイヤー実装（5h）**
   - listbox表示、option描画、multiple chip表示
   - size/disabled/error/required反映
4. **アクセシビリティ実装（3h）**
   - combobox/listbox ARIA
   - キーボード操作・読み上げ検証
5. **検証と回帰保護（4h）**
   - unit/E2E観点テスト
   - `validate:wc`/`cem:analyze`/`agents:pre-pr`
6. **ドキュメント整備（4h）**
   - demo更新
   - 利用ガイドと制約明記

## テスト計画
- 単体: 状態遷移、確定条件、復帰条件
- 統合: フォーム連携（required/name/value/disabled）
- a11y: キーボード操作、読み上げ属性、フォーカス循環
- 回帰: 既存 select/input-text への影響なし
- 追加: single選択表示中の再入力開始でquery連結が起きないこと
- 追加: `data-search` によるひらがな/略称一致
- 追加: `data-search` が不正JSONでも例外で落ちずに検索継続すること

### 実行コマンド（実装時）
```bash
npm run validate:wc
npm run cem:analyze
npm run test:run
npm run type-check
npm run agents:pre-pr
# PR前最終
npm run agents:verify
```

## リスクと対策
| リスク | 影響度 | 発生確率 | 対策 |
|---|---|---|---|
| ARIA実装の解釈差で読み上げ差異 | High | Medium | combobox APG準拠表を事前に固定し、NVDA/VoiceOverで検証 |
| single復帰仕様の誤実装 | High | Medium | 「明示確定のみ変更」ルールをテストで強制 |
| 既存フォーム検証との競合 | Medium | Medium | `form-component-helpers` 再利用を優先し独自実装を最小化 |
| CSS token命名の乱れ | Medium | Low | `css-writing-rules` のレイヤー規約に合わせる |

## 依存関係
- 既存フォーム基盤: `packages/utils/form-component-helpers.ts`
- 既存UI資産: select/input-text/menu-list-box/chip-label/checkbox
- CEM/検証フロー: `custom-elements.json`, `validate:wc`, `agents:verify`

## 検証方法
1. Figma比較: 主要ノードと視覚状態を対応確認
2. インタラクション: キーボード/ポインタで仕様表どおりか確認
3. API: CEM出力をレビューし公開契約として妥当か確認
4. 品質ゲート: `agents:verify` を通す

## 更新履歴
- 2026-02-19: 初版作成（Figma study反映）
- 2026-02-19: ユーザー確定事項（close時クリア / single復帰 / DADS準拠）を反映して承認済みに更新
- 2026-02-20: 入力体験改善（再入力時query再初期化）と `data-search` 方針を反映
