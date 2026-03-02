# Plugin Contract v1

wcf-mcp プラグインの正式な契約仕様（v1.0.0）です。

## 概要

プラグインは wcf-mcp サーバーにカスタムツールとデータソース差し替えを追加する仕組みです。

## Plugin オブジェクト

```typescript
/** プラグイン定義 */
interface WcfMcpPlugin {
  /** プラグイン名（必須。組み込みツール名と重複不可） */
  name: string;
  /** プラグインバージョン（必須。semver 推奨） */
  version: string;
  /** カスタムツール定義の配列 */
  tools?: WcfMcpPluginTool[];
  /** データソース差し替え定義の配列 */
  dataSources?: WcfMcpDataSourceConfig[];
}
```

## Tool オブジェクト

```typescript
/** カスタムツール定義 */
interface WcfMcpPluginTool {
  /** ツール名（必須。組み込みツール名と重複不可） */
  name: string;
  /** ツールの説明 */
  description?: string;
  /** 入力スキーマ（JSON Schema 形式） */
  inputSchema?: Record<string, unknown>;
  /** 動的ハンドラ関数。staticPayload と排他 */
  handler?: (args: Record<string, unknown>, context: WcfMcpHandlerContext) => unknown | Promise<unknown>;
  /** 静的レスポンスペイロード。handler と排他 */
  staticPayload?: unknown;
}
```

### handler vs staticPayload

- `handler`: リクエストごとに実行される関数。動的な結果を返す場合に使用
- `staticPayload`: 固定のレスポンスを返す場合に使用。handler より優先度が低い
- 両方指定した場合は `handler` が使用される

## Handler Context

```typescript
/** handler 関数に渡されるコンテキスト */
interface WcfMcpHandlerContext {
  /** プラグイン自身の情報 */
  plugin: { name: string; version: string };
  /** 共通ヘルパー */
  helpers: {
    /** JSON データファイルを読み込む */
    loadJsonData: (fileName: string) => Promise<unknown>;
  };
}
```

## DataSource オブジェクト

```typescript
/** データソース差し替え定義 */
interface WcfMcpDataSourceConfig {
  /** 差し替え対象のファイル名 */
  fileName: string;
  /** 差し替えファイルのパス */
  path: string;
}
```

### 差し替え可能なファイル

| fileName | 説明 |
|----------|------|
| `custom-elements.json` | Custom Elements Manifest |
| `install-registry.json` | インストールレジストリ |
| `pattern-registry.json` | パターンレジストリ |
| `design-tokens.json` | デザイントークン |
| `guidelines-index.json` | ガイドラインインデックス |

## バリデーションルール

1. `name` と `version` は必須
2. ツール名は組み込みツール名と重複不可
3. 複数プラグイン間でツール名の重複不可
4. `dataSources` のファイル名は上記5種のみ
5. 複数プラグイン間で同一ファイルの重複差し替え不可

## 互換性ポリシー

- **契約バージョン**: `1.0.0`（`PLUGIN_CONTRACT_VERSION` 定数で公開）
- **v1.x 内**: 破壊的変更なし。新フィールドは追加のみ（既存フィールドの削除・型変更なし）
- **v2.0**: 破壊的変更を含む可能性あり。メジャーバージョンアップで通知

## @experimental 機能

以下は将来追加される可能性がありますが、まだ安定していません:

- ライフサイクルフック（`onInit`, `onDestroy`）
- プラグイン間依存の宣言

## 設定ファイルからの利用

```json
{
  "plugins": [
    {
      "module": "./plugins/my-plugin.mjs"
    },
    {
      "name": "static-tools",
      "version": "1.0.0",
      "staticTools": [
        { "name": "my_tool", "payload": { "ok": true } }
      ]
    }
  ]
}
```

### module プラグイン

ESM ファイルが `default export` でプラグインオブジェクトを返す:

```javascript
// plugins/my-plugin.mjs
export default {
  name: 'my-plugin',
  version: '1.0.0',
  tools: [
    {
      name: 'my_custom_tool',
      description: 'Custom tool from plugin',
      handler: async (args, { helpers }) => {
        const data = await helpers.loadJsonData('guidelines-index.json');
        return { result: 'ok', dataLoaded: !!data };
      },
    },
  ],
  dataSources: [
    {
      fileName: 'guidelines-index.json',
      path: './custom-guidelines.json',
    },
  ],
};
```
