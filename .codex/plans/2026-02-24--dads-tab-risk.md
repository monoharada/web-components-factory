## Risks

- R-01 (HIGH): ARIA関連付けの破綻（`aria-controls` / `aria-labelledby` ミスマッチ）
  - Impact: スクリーンリーダーで関係性が崩れ、A11y要件未達となる。
  - Likelihood: Medium
  - Detection: role/aria 検証テストでID整合が失敗する。
  - Mitigation: tab/panel ID生成を単一路線化し、都度再計算しない。
  - Rollback: ID生成ロジックを最小実装に戻し、属性同期のみを再適用。
  - Linked steps: P-03, P-04

- R-02 (HIGH): roving tabindex と selected-index の不一致
  - Impact: キーボード操作が不安定になりAPG非準拠。
  - Likelihood: Medium
  - Detection: Arrow/Home/End 後に `tabindex="0"` が複数/0件になる。
  - Mitigation: フォーカス管理と選択管理の責務を関数分離する。
  - Rollback: `auto` を一時固定し、`manual` を段階導入へ後退。
  - Linked steps: P-03, P-04

- R-03 (MEDIUM): 4方向 + reflow でスタイル条件が肥大化
  - Impact: レイアウト崩れと保守性低下。
  - Likelihood: High
  - Detection: orientation別の見た目差分、selected mark位置不整合。
  - Mitigation: tokens再代入中心で構築し、プロパティ重複を避ける。
  - Rollback: reflowを属性で無効化可能にして段階展開する。
  - Linked steps: P-03, P-05

- R-04 (MEDIUM): disabled項目処理の仕様漏れ
  - Impact: 無効タブにフォーカス/選択が当たり操作性が崩れる。
  - Likelihood: Medium
  - Detection: disabled混在のキーテスト失敗。
  - Mitigation: ナビゲーション対象リスト生成時に disabled を除外する。
  - Rollback: disabled時は一律選択不可・フォーカス不可に固定する。
  - Linked steps: P-03, P-04

- R-05 (HIGH): 生成物同期漏れ（CEM/registry/autoload）
  - Impact: validate/CI 失敗、利用導線崩壊。
  - Likelihood: Medium
  - Detection: `agents:verify` または `validate:wc` 失敗。
  - Mitigation: コマンド順を固定し、差分を同一PRに含める。
  - Rollback: 生成物のみ先に同期コミットし、本体差分を再検証する。
  - Linked steps: P-06, P-07
