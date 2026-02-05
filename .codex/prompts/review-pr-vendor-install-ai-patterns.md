# レビュー依頼：vendor install（wcf）+ AIレジストリ + UIパターン

あなたはコードレビュー担当です。以下の PR を読み、**設計の妥当性 / 落とし穴 / 破壊的変更 / セキュリティ**観点でレビューしてください。

- PR: https://github.com/monoharada/web-components-factory/pull/47
- Branch: `codex/vendor-install-ai-patterns`

## 目的（このPRで実現したいこと）

1. ShadCN UI 風に、Web Components を **1コンポーネントずつ vendor ディレクトリへ install**できる（node_modules依存しない）
2. AI が「何を入れるべきか」を高速に判断できる **軽量レジストリ**（CEM由来）を提供する
3. 画面/レイアウトも “レシピ（パターン）” として登録し、AI が対話で UI を組めるようにする
4. 新規コンポーネント追加が増えても壊れないよう **contracts/CI**で強制する

## レビューで欲しいアウトプット（フォーマット）

1. **重大（P0/P1）**: 直さないと危険/破綻する点（理由 + 具体的修正案）
2. **改善（P2/P3）**: いま直すと良い点（理由 + 具体的修正案）
3. **確認事項**: 仕様として合意が必要な点（質問形式）
4. **テスト観点**: 追加すべきテスト/検証（最小）

## 重点レビュー観点（必須）

### A) `wcf` CLI の安全性/保守性

- `bin/wcf.mjs` の挙動が **予測可能**で、破壊的になっていないか
- detach/attach/remove の契約が分かりやすいか（手編集ファイルが誤って上書きされないか）
- remote（GitHub clone/tarball）周りの扱いが妥当か
  - ref解決、エラー表示、失敗時の後始末、ネットワーク失敗時のUX
- `--lang js` のTS→JS変換が **ESM** を保証できているか（ブラウザ実行の前提）
- `--pattern` による install が直感的か（patternのみで add できる/複数指定できる）

### B) “単一の真実” と軽量レジストリ

- CEM（`custom-elements.json`）→ install metadata（`decl.custom.install`）→ `registry/install-registry.json` の流れが破綻していないか
- CI が更新漏れを確実に検出するか（`contracts:check` / `registry:check`）
- vendor へ CEM をデフォルトで入れない方針が守れているか（`--embed-cem` のみ）

### C) UIパターン（レシピ）の契約

- `registry/pattern-registry.json` の形式が妥当か（将来拡張余地も含む）
- `scripts/patterns/check-pattern-registry.mjs` のチェックが “強すぎ/弱すぎ” でないか
  - `<script>/<style>` 禁止の妥当性
  - canonical prefix（`dads-*`）縛りの妥当性
  - CEM による unknownElement 検出が機能しているか

### D) MCP（Design System MCP）の道具立て

- `scripts/mcp/design-system-mcp.mjs` の新tool（patterns関連）が
  - 入出力が安定しているか
  - prefix変換が壊れていないか
  - install-registry と整合しているか

## 変更が大きい主要ファイル（読む場所）

- CLI: `bin/wcf.mjs`
- CEM注入: `custom-elements-manifest.config.js` / `custom-elements.json`
- contracts: `scripts/contracts/check-autoload.mjs`, `scripts/contracts/check-install-metadata.mjs`
- install registry: `scripts/registry/generate-install-registry.mjs`, `registry/install-registry.json`
- pattern registry: `registry/pattern-registry.json`, `scripts/patterns/check-pattern-registry.mjs`
- MCP: `scripts/mcp/design-system-mcp.mjs`
- CI: `.github/workflows/ci.yml`
- Docs: `docs/knowledge/ai-consumption.md`, `docs/knowledge/wcf-cli.md`, `docs/knowledge/skill-map.md`,
  `docs/rules/installable-component-contract.md`, `docs/rules/ui-pattern-contract.md`

## ローカル検証（必要なら）

```bash
npm run cem:analyze
npm run contracts:check
npm run registry:check
npm run patterns:check
npm run validate:wc
npm run ci
```

CLIの最小確認（consumer想定の空ディレクトリ）：

```bash
mkdir -p /tmp/wcf-consumer && cd /tmp/wcf-consumer
node /ABS/PATH/TO/web-components-factory/bin/wcf.mjs init --prefix myui --lang js --out vendor/components/myui
node /ABS/PATH/TO/web-components-factory/bin/wcf.mjs add --pattern search-form --prefix myui --lang js --out vendor/components/myui --local /ABS/PATH/TO/web-components-factory
```

