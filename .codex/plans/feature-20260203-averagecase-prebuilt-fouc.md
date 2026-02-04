# averageCase runtime 外部化 + preload 無効化

## 目標
`averageCase.html` とプリビルド用 `dist-pages/index.html` から、module script を外部化し、**modulepreload を無効化**して FOUC 検証をしやすくする。

## 背景
- 現在はインライン module script と modulepreload により初期ロードが最適化されている。
- FOUC 検証では preload を外すことで差分が観測しやすい。
- `dist-pages/index.html` は averageCase をベースに生成済み。

## スコープ
- やること：
  - module script を外部ファイルへ移動。
  - `averageCase.html` / `averageCase.prebuilt.html` から同一ファイルを参照。
  - modulepreload を削除。
  - `pages:build` で runtime を `dist-pages` にコピー。
- やらないこと：
  - lazy ロードや importmap の仕様変更。
  - コンポーネント挙動変更。

## 前提 / 制約
- `server.ts` は変更しない。
- Service Worker 無効化の短い script はインラインのまま。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `averageCase.runtime.js` を新設し、module script を外部化。
- `averageCase.html` と `averageCase.prebuilt.html` から
  `<script type="module" src="...">` を参照。
- **modulepreload の `<link rel="modulepreload">` を削除。**

### その他（Docs/Marketing/Infra など）
必要なら検証手順へ追記。

## 受入基準
- [ ] 2つの HTML が外部 module script を参照。
- [ ] modulepreload が削除されている。
- [ ] `pages:build` で `dist-pages/averageCase.runtime.js` が生成。
- [ ] `bunx serve dist-pages` で MIME エラーなし。

## リスク / エッジケース
- preload 削除により初回ロードが遅くなる（意図的）。
- external script の配置ミスで 404。

## 作業項目（Action items）
1. runtime 外部化の配置を確定（完了条件: 参照パス決定）
2. `averageCase.runtime.js` を作成（完了条件: 既存 module script を移動）
3. `averageCase.html` を更新（完了条件: 外部参照 + modulepreload 削除）
4. `averageCase.prebuilt.html` を更新（完了条件: 外部参照 + modulepreload 削除）
5. `pages:build` に runtime コピーを追加（完了条件: dist-pages に生成）
6. 動作確認（完了条件: `bunx serve dist-pages` で MIME エラーなし）

## テスト計画
- `npm run pages:build`
- `bunx serve dist-pages -l 3000` → `/` で確認

## オープンクエスチョン
なし
