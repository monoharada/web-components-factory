# Chrome DevTools MCP × `viewer.html`

Design System MCP（`docs/knowledge/design-system-mcp.md`）は **静的な API / ルール（CEM）** を扱いますが、実際の挙動（Shadow DOM / イベント / a11y / レイアウト等）は **実行時の観測**が必要です。

Chrome DevTools MCP を併用すると、AI エージェントが DevTools Protocol 経由でブラウザ状態を参照しながらデバッグできます。

## 使い方（概要）

1. viewer を起動

```bash
npm run dev
```

2. ブラウザで開く

- `http://localhost:3000/`

3. Chrome DevTools MCP を起動

Chrome for Developers の手順に従って起動してください。まずは help を見るのが安全です：

```bash
npx chrome-devtools-mcp@latest --help
```

## 何ができる？

- Shadow DOM 内の構造 / 属性反映 / ::part の適用状況の確認
- ユーザー操作（クリック・入力）→ 発火イベントの確認
- `console.warn`（例: `placeholder` の非推奨警告）などの観測
- a11y（role/aria、focus、キーボード操作）検証の補助

## 使い分け

- **Design System MCP**: “何が正しい API か” を CEM から引く（静的）
- **Chrome DevTools MCP**: “実際に何が起きているか” をブラウザから観測（動的）

