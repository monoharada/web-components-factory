# 2026-02-05: 将来の新規コンポーネントにも “vendor install + AI理解” を自動適用するためのルール/設定追加

## サマリ
- **ルール（ドキュメント）**と**ルール（CIで強制されるチェック）**を両方入れ、今後コンポーネントが増えても「インストール可能」「AIが使い方を取得できる」を壊さない。
- “単一の真実” は引き続き **CEM（`custom-elements.json`）**としつつ、CEM生成時に **install/usage メタを自動注入**して、MCP/CLI/AIが CEM だけで判断できる状態に寄せる。

## 成功条件（Done）
1. 新しいコンポーネントを `docs/knowledge/component-skeleton.md` に沿って追加すると、`npm run cem:analyze` 後の `custom-elements.json` に `decl.custom.install`（後述）が必ず入る。
2. CI（`.github/workflows/ci.yml`）が、以下を自動で検証し、欠けていれば落ちる：
   - `custom-elements.json` が最新
   - すべての `dads-*` タグに対して autoload アダプタが存在
   - すべての `dads-*` タグに対して `decl.custom.install` が存在（= vendor install / AI recipe が取れる）
3. MCP（`npm run mcp:design-system`）が `custom-elements.json` から「使い方 + install recipe」を返せる（新規 tool 追加）。

---

## 追加/変更する “開発ルール”（ドキュメント）
### 1) DoD を拡張（既存のDoDに追記）
対象：`docs/rules/new-component-dod.md`

追記する必須項目（チェックボックス追加）：
- `packages/components/<componentId>/` 配下に **define エントリ**があり、CEM生成時に依存/define情報が抽出できること  
  - 原則ファイル名：`packages/components/<componentId>/<componentId>-define.ts`
  - 例外（既存互換が必要な場合）は明示して許可（後述の overrides で吸収）
- define 内の依存は **define関数で宣言**されていること（既存の `// dependencies` パターンを推奨）
- `npm run cem:analyze` 後の `custom-elements.json` に、当該タグの `custom.install` が入ること（CIでチェック）
- 新規タグが増えた場合、`packages/autoload/dads/<tag-suffix>.ts` が追加されていること（CIでチェック）
- MCP の install recipe が生成できること（手元で `npm run mcp:design-system` → tool呼び出しで確認、もしくはスナップショットテスト）

### 2) “Installable Component Contract” を新規ドキュメント化
追加：`docs/rules/installable-component-contract.md`（新規）

記載内容（決め切り）：
- **componentId の定義**：`packages/components/<dir>` の `<dir>` を componentId とする
- **tagName の canonical**：`dads-*` を canonical とする（prefix変換は後段）
- **install recipe の出力先**：CEM の `decl.custom.install` に統一
- **install metadata の必須フィールド**（全 custom element 宣言に入る）
  - `id`: componentId（例：`"button"`）
  - `tags`: 同一 componentId が提供する tagName 配列（例：`["dads-accordion-details","dads-accordion-item-details"]`）
  - `define`: 推奨 define 関数名（例：`"defineButton"`）
  - `deps`: componentId の依存配列（例：`["menu-list"]`）
  - `source`: `componentDir`（例：`"packages/components/button"`）※CLIがコピー元特定に使えるように
- **例外**（複数タグ/defineファイル命名が例外の場合）をどう扱うか：
  - 例外は `registry/overrides.json`（後述）で明示し、CIは「例外が宣言されていること」を要求する

### 3) AI入口（このrepoをAIが読むためのガイド）を追加
追加：`docs/knowledge/ai-consumption.md`（新規）

内容：
- “AIはまず CEM を読む” 方針
- `decl.custom.install` の仕様
- MCPで取得できるtoolと、期待する入出力（AIが自動化しやすい形式）

---

## 追加/変更する “設定/自動化”（コード・CI）
### 4) CEM生成パイプラインに「install metadata 注入」を追加（最重要）
対象：`custom-elements-manifest.config.js`

追加するプラグイン（例：`wcf-install-metadata`）の仕様：
- 入力：`customElementsManifest`（CEM AST）+ ファイルシステム（`packages/components/**`）
- 推論：
  - 各 declaration の `modulePath`（例：`./packages/components/button/button.ts`）から `componentId=button` を抽出
  - `packages/components/<componentId>/` 内の `*-define.ts` を読み、依存を抽出  
    - まずは堅牢に「`../<dep>/<dep>-define` を import している `<dep>` をdeps扱い」でOK（厳密パース不要）
  - define 関数名は以下で決定：
    - 基本：`export function defineX...` のうち `defineDefault*` 以外の最初の `define*` を採用
    - 例外は overrides（次項）で上書き可能にする
- 注入：
  - `decl.custom.componentId`（既存の a11yAnnotations と同様に `decl.custom` に追加）
  - `decl.custom.install = { id, tags, define, deps, source }`
- 失敗時の挙動（CIで早く気付くため）：
  - `componentId` が推論できない declaration はスキップ（base class等）
  - componentId を推論できたのに define/deps 抽出に失敗した場合は **エラーで落とす**（新規コンポーネントの取りこぼし防止）

### 5) overrides をリポジトリに追加（例外を“明文化”）
追加：`registry/overrides.json`（新規、コミット運用）

用途：
- 命名規約から外れる define ファイル/define名
- 1 componentId が複数フォルダに跨る（原則禁止だが将来の逃げ道）
- deps の手動補正（define抽出だけでは足りない場合）

CIでは「overrides を使った例外があるなら、その例外が理由付きで宣言されていること」を要求。

### 6) 自動チェック用スクリプトを追加
追加：`scripts/contracts/`（新規）

- `scripts/contracts/check-autoload.mjs`
  - `custom-elements.json` の全 tagName（`dads-*`）を列挙
  - 各 tagName の suffix（`dads-foo-bar` → `foo-bar`）に対し `packages/autoload/dads/<suffix>.ts` の存在を検証
- `scripts/contracts/check-install-metadata.mjs`
  - `custom-elements.json` の各 custom element declaration に `decl.custom.install` が入っていることを検証
  - `install.id` が `modulePath` から推論される componentId と一致することを検証
  - `install.deps` が存在する componentId を指すことを検証（`packages/components/<id>` 存在チェック）

package.json scripts 追加（例）：
- `contracts:check` → 上記2つを実行

### 7) CIに組み込む（設定追加）
対象：`.github/workflows/ci.yml`

`Validate demo code blocks` の前後あたりで以下を追加：
- `npm run contracts:check`

これで “新規コンポーネントが増えたのに vendor install/AI recipe が生成できない” を PR 時点で確実に検出。

### 8) MCPを拡張して “install recipe” を返せるようにする
対象：`scripts/mcp/design-system-mcp.mjs`

追加する tool（仕様決め切り）：
- `get_install_recipe({ component, prefix? })`
  - `component` は tagName / className / componentId のいずれでも受け付け
  - 返す JSON には最低限：
    - `componentId`
    - `tagNames`（prefix適用後も返す）
    - `deps`
    - `define`（推奨import/呼び出し例も含める）
    - `usageSnippet`（既存 `generate_usage_snippet` 相当を内包してOK）

---

## テスト/検証観点（実装フェーズでやること）
- `npm run cem:analyze` → `custom-elements.json` に差分が出た場合、`decl.custom.install` の注入結果が期待通りか確認
- `npm run contracts:check` がローカル/CIで通る
- MCP：`npm run mcp:design-system` の `get_install_recipe` が button/accordion 等で期待通りの deps/define/usage を返す

---

## 前提/採用するデフォルト（未確定部分の埋め）
- 「例外」は必ず `registry/overrides.json` に理由付きで残す（暗黙の例外を禁止）
- componentId は **ディレクトリ名**を正とする（人が迷わないため）
- install metadata は **CEMに注入してコミット**（AI/ツールが1ファイルで完結して読めるため）

