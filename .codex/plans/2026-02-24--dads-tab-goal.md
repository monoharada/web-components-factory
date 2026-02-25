# Goal
- DADS準拠の新規 `dads-tab` コンポーネントを実装し、Figma指定ノード（Top/Bottom/Left/Right + Reflow + Example）の意図と整合するAPI/挙動を提供する。

## Observed KR
- `apg_conformance_rate`: 100%（WAI-ARIA APG Tabs Patternの必須項目を満たす）
- `a11y_must_tests_pass_rate`: 100%（roving tabindex、キーボード操作、ARIA整合の必須テスト全通過）
- `figma_variant_coverage`: 100%（4方向 + reflow 構成をデモで確認可能）

## Non-goals
- タブラベル内アイコンボタン（`more_vert` 相当）の操作仕様まで初版で確定すること。
- `dads-tab-list` / `dads-tab-panel` など複合コンポーネントへの分割提供。
- タブ外コンテンツの情報設計改善（文言・IAの最適化）。

## Constraints
- WCAG 2.2 AA と WAI-ARIA APG Tabs Pattern を満たすこと。
- 既存リポジトリ規約（CEM、autoload、viewer demo、validate:wc、agents:verify）に準拠すること。
- 初版は単一コンポーネント構成を維持し、公開APIは最小限かつ明示的にすること。

## Failure definition
- `npm run validate:wc`、`dads-tab` 必須unitテスト、`npm run agents:verify` のいずれかが失敗した場合は失敗。
