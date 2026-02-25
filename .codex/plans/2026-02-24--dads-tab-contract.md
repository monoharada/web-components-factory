## Contract (Invariants)

- C-01: APG semantics completeness
  - Rule: `tablist` / `tab` / `tabpanel` を正しく付与し、`aria-selected` / `aria-controls` / `aria-labelledby` / `aria-orientation` を矛盾なく同期する。
  - Verification: `tab.test.ts` の role/aria 検証ケースが全通過する。

- C-02: Single active tab
  - Rule: 任意時点で `aria-selected="true"` の tab は最大1つ。
  - Verification: 初期状態・クリック・キーボード遷移の各ケースで `true` が1件のみ。

- C-03: Roving tabindex
  - Rule: フォーカス可能タブは1件のみ `tabindex="0"`、他は `-1` を維持する。
  - Verification: Arrow/Home/End 操作後の tabindex 配列検証が通る。

- C-04: Activation mode behavior
  - Rule: `activation-mode="auto"` はフォーカス移動で選択変更、`manual` は Enter/Space のみで選択変更する。
  - Verification: mode別の同一操作で selected-index の変化差分をテストで確認する。

- C-05: Orientation consistency
  - Rule: `orientation` が `left/right` の場合は `aria-orientation="vertical"`、`top/bottom` は `horizontal` として扱う。
  - Verification: orientation変更時のARIA値・キー操作経路が一致する。

- C-06: Disabled safety
  - Rule: disabledタブは選択/アクション対象外であり、キーボード移動でもスキップされる。
  - Verification: disabled混在ケースで Arrow/Home/End/Enter/Space を検証する。

- C-07: Focus visibility
  - Rule: キーボードフォーカス時の可視インジケータは常に維持し、背景と十分に識別可能である。
  - Verification: focus-visible スタイルに対する属性/状態テストと目視確認を行う。

- C-08: Reflow stability
  - Rule: 折返し発生時も ARIA 関連と selected-index 同期は壊れない。
  - Verification: reflow専用デモ/テストで動作を確認する。

- C-09: Repository integration
  - Rule: CEM, autoload, demos, viewer, registry の整合を崩さない。
  - Verification: `npm run cem:analyze`, `npm run validate:wc`, `npm run agents:verify` が通る。

- C-10: Scope guardrail
  - Rule: 初版ではテキストラベルのみ保証し、アイコン操作仕様には踏み込まない。
  - Verification: 公開APIとデモ内容にアイコン挙動の保証を含めない。
