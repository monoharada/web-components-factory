---
name: wcf-ui-builder
description: wcf（vendor install）+ install-registry（軽量）+ CEM/MCP（詳細）を使い、対話的に「画面/レイアウト」を組み立てるための実装スキル図（ワークフロー）。Use when (1) 別リポジトリにコンポーネントを持ち込みたい, (2) コンポーネント選定〜インストール〜マークアップ生成〜検証までを一貫してやりたい, (3) 画面パターンを継続的に増やしたい。
---

# wcf UI Builder（Skill Map）

このスキルは「ShadCN UI 風に 1コンポーネントずつ vendor install して、AI が理解した上で UI を組み立てる」ための **スキル図（ワークフロー）**です。

## North Star（設計の軸）

- **vendor install**: `node_modules` ではなく `vendor/` にソースを置く（detach/attach 可能）
- **AI がまず軽量入口**: `registry/install-registry.json`（deps/define/call/source/tags）
- **詳細は必要時だけ**: `custom-elements.json`（CEM）または MCP（API/usage/validate）
- **将来の新規コンポーネントでも壊れない**: contracts/CI が “install可能” を強制する

## スキル図（最小）

1. **要件分解（UI intent）**
   - 画面の目的、主要タスク、必要な入力/出力、状態（loading/error/empty）を短く確定する
2. **コンポーネント選定（Discovery）**
   - まず `registry/install-registry.json` で “必要な componentId + deps” を決める
   - 不明点が残る時だけ CEM/MCP を見る（属性/slots/events/cssParts）
3. **vendor install（Install）**
   - consumer 側で `wcf init` → `wcf add <componentId...>` を実行
   - 手編集したいものは `detach`、更新したい場合は `attach`
4. **配線（Wiring）**
   - `--lang js` の場合：importmap と `autoload/*.js` を読み込む
   - `--lang ts` の場合：consumer 側の bundler/tsc 前提で import する
5. **マークアップ生成（Compose）**
   - usage snippet を起点に、要件の状態/バリエーションを埋めた最小 HTML を作る
6. **検証（Validate）**
   - `npm run validate:wc` or MCP `validate_markup` で unknownElement/error を潰す
7. **仕上げ（A11y/UX）**
   - 必要なら `$a11y-checker` / `$practical-ui-2nd-edition` の観点で仕上げる

## 実行インターフェース（エージェントが使う道具）

### 入口（軽量）

- `registry/install-registry.json`
  - `components[componentId] = { tags, define, call, deps, source.componentDir }`
  - `tags[tagName] = componentId`

### UI パターン（レイアウト/画面レシピ）

- `registry/pattern-registry.json`
  - `patterns[patternId] = { requires(componentId[]), html(dads-*), title, description }`

### 詳細（必要時のみ）

- `custom-elements.json`（CEM）
  - API（attributes/slots/events/cssParts）
  - `decl.custom.install`（install recipe の単一の真実）
- Design System MCP
  - `get_install_recipe({ component, prefix? })`
  - `get_component_api({ tagName|className, prefix? })`
  - `generate_usage_snippet({ component, prefix? })`
  - `validate_markup({ html, prefix? })`
  - `list_patterns()`
  - `get_pattern_recipe({ patternId, prefix? })`
  - `generate_pattern_snippet({ patternId, prefix? })`

### インストール（consumer 側）

- `wcf init --prefix <myui> --lang js --out vendor/components/<myui>`
- `wcf add <componentId...> --prefix <myui> --lang js --out vendor/components/<myui>`

## Conversation Protocol（対話の型）

1. 「何を作るか（目的/画面名）」→「入力/操作/出力」→「状態（loading/error/empty）」を先に確定
2. “必要最小” の componentId を提案し、deps は自動で含める前提で合意
3. vendor install を行い、まず 1画面を **動く最小**で通す
4. 仕様の詰め（バリデーション/エッジケース/アクセシビリティ）を後段で詰める

## 拡張（パターンが増えたとき）

- 画面/レイアウトの再利用は `registry/pattern-registry.json` に “レシピ” として追加するのがスケールしやすい
  - 例：`patternId`, `requires(componentId[])`, `html(dads-*)`
- パターンは MCP `get_pattern_recipe` で取得でき、consumer 側で `wcf add` に直結できる
