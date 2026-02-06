# Installable Component Contract（vendor install / AI recipe）

このドキュメントは、コンポーネントを「ShadCN UI 風に 1 つずつ vendor にインストール」し、さらに AI（Codex / Claude Code 等）が必要なコンポーネントと使い方を機械的に取得できるようにするための **契約（contract）**を定義します。

## 1) 用語

### componentId
- 原則：`packages/components/<dir>` の `<dir>` を componentId とする
  - 例：`packages/components/button/` → `button`

### canonical tagName
- canonical は `dads-*` とする（prefix カスタマイズは後段で変換/差し替え）

## 2) 単一の真実（Source of Truth）

この repo における install recipe の単一の真実は **CEM（`custom-elements.json`）**です。

vendor install / AI recipe に必要なメタデータは、CEM 生成時に各 declaration の `decl.custom.install` に注入されます。

補助（軽量レジストリ）：
- `registry/install-registry.json` を CEM から生成してコミットします（AI/CLI が高速に取得する入口）

## 3) CEM に注入される install metadata

対象：
- `tagName` が `dads-*` の custom element declarations

必須フィールド：
- `decl.custom.componentId`（string）
- `decl.custom.install`（object）
  - `id`（string）: componentId
  - `tags`（string[]）: 同一 componentId が提供する canonical tagName 群
    - 例：`["dads-accordion-details","dads-accordion-item-details"]`
  - `define`（string）: 推奨 define 関数名
    - 例：`"defineButton"`
  - `call`（string）: define 呼び出しスタイル（`"none" | "registry" | "prefix-registry"`）
  - `deps`（string[]）: 依存 componentId（存在する `packages/components/<dep>` を指す）
  - `source`（object）
    - `componentDir`（string）: コピー元の特定に使う
      - 例：`"packages/components/button"`

## 4) define の規約（推奨）

新規コンポーネントは次を推奨します：
- `packages/components/<componentId>/<componentId>-define.ts` を用意
- `export function define*()`（`defineDefault*` 以外）を少なくとも 1 つ含める
- 依存コンポーネントは define 内で `// dependencies` の下に `defineX(...)` を呼び出して宣言する

## 5) 例外（overrides）

規約から外れる事情（既存互換・特殊構成等）がある場合は、`registry/overrides.json` に **理由つきで**明示します。

- define 名/define 抽出の補正
- deps の補正
- source（componentDir）の補正

## 6) CI での強制（contracts）

CI は次を満たさない場合に失敗します：
- すべての `dads-*` タグに `packages/autoload/dads/<tag-suffix>.ts` が存在する
- すべての `dads-*` タグの declaration に `decl.custom.install` が注入されている

実行：
```bash
npm run contracts:check
```
