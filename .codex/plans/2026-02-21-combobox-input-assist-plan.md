# 2026-02-21 Combobox Input Assist Plan

## Metadata
- Plan ID: `CBX-INPUT-ASSIST-2026-02-21`
- Status: `CONDITIONAL GO`
- Approved by: User (`APPROVE PLAN`)
- Target: `dads-combobox`
- Base branch: `main`
- Revision basis: `A1-A7 review (2026-02-21 19:16)`

## Background
現行 combobox は選択支援型を中心に構成される。  
本Planは入力支援型（サジェスト + 候補外入力確定）を追加し、既存挙動を壊さず導入するための改訂版である。

## Scope
### In Scope
- 入力支援型の導入（single / multiple 両対応）
- 候補なし時挙動の切替（`notice` / `create`）
- blur確定の導入（4ガード付き）
- 選択後表示のチップタグ統一
- 既存選択支援型との非破壊共存
- テスト、デモ、CEM反映

### Out of Scope
- 非同期サジェストAPI
- 仮想スクロール
- 学習ランキング

## Implementation Start Preconditions (Must)
1. OQ-01（notice通知UI）の仕様を確定する。
2. State Designに不足遷移（5系統以上）を追記済みであること。
3. P-11 を「チップ描画」だけでなく「内部状態 + FormData + 復元」まで拡張済みであること。
4. T-13〜T-16（detail/FormData/blur relatedTarget/dads-input）をテスト計画に追加済みであること。

## Confirmed Decisions
- D-01 (`U-01`): 入力支援型は `multiple` にも適用する。
- D-02 (`U-02`): 候補なし時挙動をプロップスで切替可能にする。
  - `no-match-behavior="notice|create"`
  - default: `notice`
- D-03 (`U-03`): `blur` でも確定する。
- D-04 (`U-04`): 選択後表示はチップタグにする。
- D-05: 入力支援型のタイピングサーフェスは `#input`（control内）に一本化する。
- D-06: `behavior="input"` 時は `#input.readOnly = false`、`#searchInput` は非表示/不使用とする。
- D-07: `behavior="input"` 時の `filterable` は暗黙有効扱いとし、二重フィルタを禁止する。
- D-08: `no-match-behavior="create"` の free-text は `value = label = inputText` を採用する。
- D-09: 空文字 `blur` はコミットせず `cancelled` 扱いにする。
- D-10: placeholder 既定値は `behavior="selection" => "選択してください"`、`behavior="input" => "入力してください"`。
- D-11: `behavior="input"` では `data-has-chip` 時も `#input` を視覚的/操作的に有効に保つ（0幅化しない）。
- D-12: `open.nothingFound` で `activeIndex < 0` の Enter は、`notice => no-op`、`create => commit`。
- D-13 (OQ-01): `notice` 通知UIは `aria-describedby` の動的付与で通知し、`aria-live` は使わない。
- D-14 (OQ-02): 属性名は `behavior` / `no-match-behavior` を維持する。
- D-15: `aria-autocomplete` は現フェーズでは `selection/input` ともに `list` を基本とする。
  - `both` は将来、インライン補完実装時にのみ採用する。

## UX / Interaction Contract
- C-01: 既存「選択支援型」のデフォルト挙動を破壊しない。
- C-02: 入力中は候補をリアルタイム絞り込みする。
- C-03: `notice` は候補なし通知のみで値は確定しない。
- C-04: `create` は候補外文字列を確定可能とする。
- C-05: Enter / Click / Blur で確定、Escapeでキャンセル。
- C-06: IME合成中は Enter / Blur / Space で確定しない。
- C-07: single / multiple とも選択済み表示はチップタグを使用。
- C-08: `behavior="input"` では Space を文字入力として扱い、開閉ショートカットを無効化。
- C-09: blur確定は以下4ガード通過時のみ実施。
  - relatedTarget（パネル内遷移は確定しない）
  - mousedown/pointerdown（option click 中の blur は無視）
  - isComposing（IME中は無視）
  - timing（`setTimeout(0)` で遅延判定）

## API Draft
- 追加属性
  - `behavior="selection|input"`（default: `selection`）
  - `no-match-behavior="notice|create"`（default: `notice`）
- 既存属性
  - `mode="single|multiple"`
  - `filterable`, `value`, `open`, `disabled`, `required`, `name`, `size`
- ARIA
  - `aria-autocomplete="list"` を基本値として動的維持
  - `behavior` 変更時は `aria-activedescendant` をリセット
- イベント
  - `dads-input`: 入力更新
  - `dads-change`: 確定時（Enter / Click / Blur）
    - detail: `{ value, source: 'option' | 'free-text' }`
  - `dads-open`, `dads-close`

## State Design
- `closed.idle`
- `open.filtering`
- `open.composing`
- `open.nothingFound`
- `open.commitCandidate`
- `closed.committed`
- `closed.cancelled`

### Transition Table (Required Paths)
| Event | From | Condition | To |
|---|---|---|---|
| compositionstart | open.filtering/open.nothingFound/open.commitCandidate | IME開始 | open.composing |
| compositionend | open.composing | filtered > 0 | open.filtering or open.commitCandidate |
| compositionend | open.composing | filtered = 0 | open.nothingFound |
| Enter | open.nothingFound | notice | open.nothingFound (no-op) |
| Enter | open.nothingFound | create + query>0 | closed.committed |
| blur (4ガード通過) | open.filtering | activeIndex>=0 | closed.committed |
| blur (4ガード通過) | open.filtering | activeIndex<0 | closed.cancelled |
| blur (4ガード通過) | open.nothingFound | create + query>0 | closed.committed |
| blur (4ガード通過) | open.nothingFound | notice or query=0 | closed.cancelled |
| Tab external | open.nothingFound/open.commitCandidate/open.composing | 外部離脱 | closed.cancelled |
| ArrowUp/Down | open.composing | IME中 | state維持（候補移動しない） |

## Implementation Tasks
- P-01: API契約反映（attributes, default, JSDoc, CEM）
- P-02: 入力支援型ルートの状態機械追加
- P-03: `no-match-behavior` 分岐実装
- P-04: blur確定 + IME保護実装
- P-05: single/multiple チップ表示契約統一
- P-06: テストを `selection` / `input` で再編
- P-07: デモ/ドキュメント更新
- P-08: 検証コマンド実行
- P-09: `#syncInputAttributes` の `readOnly` / placeholder / aria分岐実装
- P-10: blur 4ガード（relatedTarget, pointerdown, isComposing, timing）実装
- P-11: free-text 対応スコープ拡張
  - チップ描画
  - 内部状態保持（`#selectedSingle` / `#selectedMultiple`）
  - FormData反映（`#syncFormValue`）
  - 復元（`formStateRestoreCallback`）
- P-12: Spaceキーの `behavior` 分岐実装
- P-13: `attributeChangedCallback('behavior'|'no-match-behavior')` 追加
- P-14: `behavior="input"` 時の chip + input 共存スタイル追加（input 0幅化無効）
- P-15: `open.nothingFound` + Enter/Blur の分岐実装
- P-16: `#input` 側 compositionstart/end リスナー追加と `open.composing` 遷移実装
- P-17: `#isFilterable` 集約ゲッター導入（暗黙filterable対応）
- P-18: サブフェーズ導入（A/B/C/D）とPR分割運用

## Test Plan
- T-01: input-support + single + blur確定
- T-02: input-support + multiple + blur確定
- T-03: `notice` の通知表示
- T-04: `create` の候補外確定
- T-05: Escapeキャンセル、IME中非確定
- T-06: selection既存挙動の非劣化
- T-07: single/multiple チップ表示回帰
- T-08: IME合成中 blur で確定しない
- T-09: `behavior="input"` で Space が文字入力
- T-10: free-text 確定値のチップ描画
- T-11: 空文字 blur はキャンセル
- T-12: `behavior` 動的切替のリセット整合
- T-13: `dads-change` detail 契約（value/source）
- T-14: FormData反映（single/multiple/free-text）
- T-15: blur relatedTarget/pointerdown ガード（option click競合）
- T-16: `dads-input` 発火タイミング（通常入力/IME中）
- T-17: free-text 確定後の `value` getter
- T-18: `behavior` 未指定時の selection デフォルト回帰

## Risks
- R-01: `combobox.ts` / `combobox.test.ts` の競合
- R-02: blur誤確定
- R-03: `search-input` 前提テスト破綻
- R-04: 分岐増加による保守性低下
- R-05: `#searchInput` / `#input` 二重フィルタ競合
- R-06: free-text チップのラベル/状態不整合
- R-07: IME中 blur 確定不具合
- R-08: Spaceキー誤開閉
- R-09: aria不整合によるSR誤読
- R-10: PR肥大化（7,000行超）

## Mitigation
- M-01: `selection` / `input` をテストで明示分離
- M-02: Escape優先・IME保護
- M-03: 既存 selection テスト74件を固定回帰
- M-04: API既定値で後方互換維持
- M-05: 入力面を `#input` に一本化
- M-06: blur 4ガードを仕様化して実装
- M-07: free-text の source 識別をイベント/detailと内部状態に持たせる
- M-08: `behavior="input"` の chip/input CSS競合を明示オーバーライド
- M-09: `setTimeout(0)` ベースで blur timing 判定を統一
- M-10: PRをSubphaseごとに分割し、各段で検証ゲートを通す

## Rollout Strategy
- Subphase A: API + readOnly + behavior lifecycle
- Subphase B: State遷移 + blur4ガード + IME
- Subphase C: free-text + chip + FormData
- Subphase D: tests + demos + CEM + verify

PR運用:
1. PR-1: Subphase A/B（基盤）
2. PR-2: Subphase C/D（機能完成と品質）

## Open Issues
- OI-01: `notice` 通知テキストの文言最終確定（文言レビュー待ち）

## Verification Commands
- `npm run validate:wc`
- `npm run cem:analyze`
- `npm run test:run`
- `npm run type-check`
- `npm run agents:pre-pr`
- `npm run agents:verify`

## Agent Teams (Claude Code)
- A0 Orchestrator: 進行管理・Go/No-Go
- A1 UX Reviewer: 入力体験/誤操作防止
- A2 A11y Reviewer: ARIA/WCAG監査
- A3 API Reviewer: 属性/イベント互換性
- A4 State Reviewer: 遷移破綻/境界条件
- A5 Test Reviewer: テスト不足/回帰観点
- A6 Design Reviewer: Figma整合
- A7 Risk Reviewer: PR競合/導入リスク

## Revision Log
### 2026-02-21 Rev-2 (planning-reviser)
- Addressed BLOCKER:
  - A1 NEW-1 (`data-has-chip` 0幅化矛盾)
  - A3-1（`behavior`/`no-match-behavior` 属性未定義）
  - A3-2（P-11 スコープ不足）
- Addressed HIGH:
  - placeholder 分岐
  - Enter + activeIndex<0 分岐
  - blur 4ガード実装仕様
  - `behavior` lifecycle / aria更新
  - T-13〜T-16 追加
- Resolved OQ:
  - OQ-01（notice UI方針）
  - OQ-02（属性名）

## Done Criteria
- 前提4条件を満たした状態で着手
- `U-01`〜`U-04` をテストで拘束
- selection回帰なし
- CEM/検証コマンド通過
- ドキュメント/デモ更新済み
