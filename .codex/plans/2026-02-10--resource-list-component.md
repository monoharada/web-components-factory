# dads-resource-list 実装計画（アクセシビリティ注釈込み）

## Summary
- `dads-resource-list` を既存実装と同じ体裁で新規追加（フル互換）
- アクセシビリティ注釈を CEM 注入経路に載せ、viewer の `a11y-annotate` セクションにも反映
- スキル適用順: `css-writing-rules` → `headless-component-design`

## Public API（新規）
- Custom Element: `dads-resource-list`
- Class: `DadsResourceList`
- Define: `defineResourceList(prefix?, registry?)`, `defineDefaultResourceList()`
- 主要属性: `data-style`, `data-interaction`, `href`, `target`, `rel`, `download`
- 主要 slot: `control`, `icon`, `title`, `label`, `support`, `sub`, `action`
- 主要 part: `base`, `body`, `control`, `icon`, `contents`, `title`, `label`, `support`, `sub`, `action`
- CSS API: `--dads-resource-list-*`

## 変更対象
- `packages/components/resource-list/*`
- `packages/components/index.ts`
- `packages/autoload/dads/resource-list.ts`
- `viewer.html`
- `src/demos/showcase-components.ts`
- `src/demos/showcase-components.test.ts`
- `docs/knowledge/a11y-annotations.json`
- `custom-elements.json`
- `registry/install-registry.json`

## 検証
1. `npm run cem:analyze`
2. `npm run contracts:check`
3. `npm run registry:generate`
4. `npm run registry:check`
5. `npm run validate:wc`
6. `npm run test:run`
7. `npm run type-check`

## Assumptions
- 初版は `dads-resource-list` 単体提供
- 注釈は `docs/knowledge/a11y-annotations.json` を SoT とし CEM 注入
- E2E/VRT は初版スコープ外
