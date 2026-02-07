# Agent instructions

## 必ず参照するガイドライン（Source of Truth）

このリポジトリでは、実装ガイドラインの正は `.claude/skills/*` です。

- `.claude/skills/css-writing-rules/SKILL.md`
- `.claude/skills/headless-component-design/SKILL.md`

## Codex での参照（推奨）

Codex の Skills は `~/.codex/skills` を参照するため、初回のみ以下を実行してコピーをインストールしてください。

- `npm run codex:install-skills`

手順の詳細は `docs/codex-skills.md` を参照してください。

## 運用ルール

- CSS/トークン設計/セレクタ設計の変更は `css-writing-rules` を最優先で適用する
- コンポーネントAPI設計（part/override/3層トークン等）は `headless-component-design` を適用する
- `.claude/skills` の内容を勝手にコピーして別ファイルに二重管理しない（必要なら `.claude/skills` を更新する）
- 組版（コンテンツ内余白）は `docs/rules/content-typeset-rules.md` を基準にし、テンプレートは原則 `data-dads-typeset` を付与する

## 開発サーバー（デフォルト）

- デフォルト起動コマンド: `npm run dev`（実体: `bun --watch serve.ts`）
- 単独起動: `bun --watch serve.ts`
- watchなし起動: `bun serve.ts`
- `serve.ts` は起動エントリで、実装本体は `server.ts`
- 開発時は `Cache-Control: no-store` を返すため、変更確認は通常リロードで行う（ハード再読み込み不要）
- キャッシュ有効化が必要な検証時のみ `DEV_DISABLE_HTTP_CACHE=0` を指定する

## CEM / 検証 / MCP（AIネイティブ）

この repo では **CEM（`custom-elements.json`）を “単一の真実”** として、DX と AI 向けツールを駆動します。

### CEM（Custom Elements Manifest）

- 生成: `npm run cem:analyze`
- `custom-elements.json` は **コミット運用**（CI で `cem:analyze` 実行後に差分があると失敗）
- `package.json` の `"customElements": "custom-elements.json"` を維持する
- prefix は canonical を `dads-*` とし、利用者向けに `npm run cem:prefix -- --prefix my-ui` で tagName 置換版 CEM を生成可能

### CEM 駆動のマークアップ検証

- 実行: `npm run validate:wc`
- 設定: `wc.config.js`（対象は `viewer.html` と `src/demos.ts`）
- unknownElement は error / unknownAttribute は warning

※ `@wc-toolkit/wctools` は将来的な本命候補だが、現状の npm 取得物で `dist/` 不在などにより安定実行できない場合があるため、CI では `validate:wc`（軽量 validator）を使用している。

### Design System MCP（stdio）

- 起動: `npm run mcp:design-system`
- tools: `list_components`, `get_component_api`, `generate_usage_snippet`, `validate_markup`

関連 docs:
- `docs/knowledge/custom-elements-manifest.md`
- `docs/knowledge/wctools-validate.md`
- `docs/knowledge/design-system-mcp.md`
- `docs/knowledge/chrome-devtools-mcp.md`

## AIエージェントPR前必須ガードレール

Codex / Claude Code を含む AI エージェントは、PR作成・更新前に以下を必ず実行してください。

- 必須コマンド: `npm run agents:verify`
- 日常の軽量チェック: `npm run agents:pre-pr`
- `custom-elements.json` / `registry/install-registry.json` に差分が出た場合は、同一PRに含めるまでPR更新禁止

### 対象変更トリガ（この変更がある場合は必須）

- `packages/components/**`
- `packages/core/**`
- `packages/autoload/**`
- `custom-elements-manifest.config.js`
- `registry/overrides.json`
- `src/demos.ts`
- `viewer.html`

迷ったら常に `npm run agents:verify` を実行してください。

## 新規コンポーネント作成

新規コンポーネントを追加する際は、以下のドキュメントを参照してください：

- **DoD（Definition of Done）**: `docs/rules/new-component-dod.md`
  - 必須チェックリスト
  - JSDoc テンプレート
  - 検証コマンド
- **コンポーネント雛形**: `docs/knowledge/component-skeleton.md`
  - ファイル構成
  - トークン設計
  - Autoloader アダプタ

新規コンポーネントは以下を満たす必要があります：
1. CEM（`custom-elements.json`）に正しく登録される
2. `validate:wc` がパスする
3. `npm run ci` がパスする
