## Scope of reading
- `AGENTS.md`
- `docs/rules/new-component-dod.md`
- `docs/knowledge/component-skeleton.md`
- `.claude/skills/css-writing-rules/SKILL.md`
- `.claude/skills/headless-component-design/SKILL.md`
- `packages/components/carousel/carousel.ts`
- `packages/components/carousel/carousel.test.ts`
- `packages/components/step-navigation/step-navigation.ts`
- `packages/components/page-navigation/page-navigation.ts`
- `packages/components/index.ts`
- `packages/autoload/dads/*`
- `src/demos.ts`
- `viewer.html`
- `package.json`

## Figma references (inspected)
- File key: `X2RMSvbCRl0G4lsCC5p2tP`
- Overview:
  - `24274:7683` (Tab 説明)
  - `24274:7691` (Components 全体)
- Component variants:
  - `24231:7539` (Type=Top)
  - `24231:7536` (Type=Top Reflow)
  - `24231:7542` (Type=Bottom)
  - `24231:7551` (Type=Bottom Reflow)
  - `24231:7545` (Type=Left)
  - `24231:7548` (Type=Right)
- Building blocks:
  - `24144:6929` (Tab Label Horizontal)
  - `24228:7220` (Tab Label Vertical)
  - `24144:6861` (Tab Panel)
- Examples:
  - `24274:7751`, `25181:379`, `24274:7713`

## Current state facts
- 現時点で `packages/components` 配下に `tab` コンポーネントは存在しない。
- `carousel` に `tablist` / `tab` / `tabpanel` と Arrow/Home/End の挙動実装および対応テストがあり、最も再利用価値が高い。
- 新規コンポーネント導線として、少なくとも以下の同期が必要:
  - `packages/components/<component>/...`
  - `packages/components/index.ts`
  - `packages/autoload/dads/<component>.ts`
  - `src/demos.ts`（必要に応じて `src/demos/*`）
  - `viewer.html`（import map とセレクタ導線）
  - `custom-elements.json`
  - `registry/install-registry.json`（必要時）
- リポジトリ運用上、PR前に `npm run agents:verify` が必須。

## A11y/APG baseline
- 適合基準は WCAG 2.2 AA を最低ラインとする。
- Tabs のインタラクションは WAI-ARIA APG Tabs Pattern を準拠対象とする。
- 必須観点:
  - roving tabindex
  - `aria-selected` の単一性
  - `tab` と `tabpanel` の双方向関連（controls/labelledby）
  - `orientation` に応じたキー操作整合
  - disabled項目のフォーカス/アクション抑止
  - focus-visible の視認性維持

## Resolved decisions
- 単一コンポーネントで提供する。
- `activation-mode="auto|manual"` の両対応を初版に含める。
- 4方向 + reflow を初版スコープに含める。
- 初版ラベルはテキストのみ保証する。

## Unknowns (with validation method)
- なし
