# ADR-004: 外部レジストリ拡張機構

## ステータス

承認済み

## コンテキスト

現行の `wcf` CLI/runtime は `registry/install-registry.json` と `registry/pattern-registry.json` にのみ依存しており、他チーム・第三者配布の拡張コンポーネントを標準導線で導入できない。外部拡張パッケージを追加できる機構が必要。

## 決定事項

### 1. 外部レジストリスキーマ

外部レジストリは `install-registry.json` と同等のスキーマに `meta` セクションを追加した形式とする。

```json
{
  "schemaVersion": 1,
  "meta": { "name": "...", "version": "...", "description": "..." },
  "canonicalPrefix": "ext",
  "components": { ... },
  "tags": { ... },
  "patterns": { ... }
}
```

### 2. マージ優先順位

`local > explicit --registry > .wcf/extensions.json > core`

### 3. タグ名衝突は2段階検出

- **Phase 1（マージ時）**: 生タグ名の重複 → ハードエラー
- **Phase 2（install時）**: `--prefix` 適用後の suffix 重複 → ハードエラー

### 4. namespace:id 形式

- 内部マップキー・CLI引数のみで使用
- ファイルパスには使用禁止（Windows の `:` 制限）

### 5. `.wcf/extensions.json`

- Git 追跡対象とする
- プロジェクト単位の拡張設定を管理

### 6. MVP スコープ

- ローカルパスのみサポート
- URL/npm/git フェッチは将来フェーズ
- **拡張コンポーネントの vendor install は未サポート**: 拡張コンポーネントはマージ・衝突検出・CRUD管理のみ機能する。拡張コンポーネントの runtime 生成・ファイルコピーは Phase 2 で実装予定。

### 7. パストラバーサル防御

外部レジストリの `source.componentDir` に `../` や絶対パスを含む値を拒否する。

### 8. 循環依存検出

DFS による循環依存検出を実装。拡張間依存は `depsNamespace` フィールドで `namespace:id` 形式をサポート。

## 影響

- `scripts/wcf/extension.js` 新規作成
- `scripts/wcf/core.js` 改修（loadMergedRegistry、vendorInstall 拡張）
- `scripts/wcf/cli.js` 改修（extension コマンド群追加）
- 拡張未設定時は全関数が現在と完全同一動作（後方互換保証）
