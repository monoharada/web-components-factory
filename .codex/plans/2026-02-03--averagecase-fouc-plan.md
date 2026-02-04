# Average Case FOUC対策（importmap/auto-load維持）

## 目標
averageCase.html において、Web Components 初期描画時の FOUC を抑え、速やかに安定表示される状態にする（importmap と auto-load は維持）。

## 背景
averageCase で Web Components の定義完了前に素の要素が見える（FOUC）。importmap/auto-load は残す前提のため、最小の表示制御と先行読み込みで改善する必要がある。

## スコープ
- やること：
  - `:not(:defined)` を利用した未定義コンポーネントの表示抑制（FOUC回避）
  - above-the-fold コンポーネントの `modulepreload` 追加（初期描画の速さ向上）
- やらないこと：
  - importmap の削除・差し替え
  - auto-load の廃止
  - 画面構成/文言の大幅変更

## 前提 / 制約
- 変更は `averageCase.html` に限定する。
- `dads-*` の定義は引き続き importmap + auto-load に任せる。
- 追加 CSS は FOUC 抑制目的のみで、コンポーネントの見た目を恒常的に変えない。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `dads-*:not(:defined)` を `visibility: hidden` にして未定義時の表示を抑制。
- 必要であれば最小の `min-height` を与え、レイアウトの急変を軽減（軽微）。

### その他（Docs/Marketing/Infra など）
- `link rel="modulepreload"` に `dads-date-picker` / `dads-calendar` など上部に出る要素を追加。
- importmap/auto-load は現状維持。

## 受入基準
- [ ] averageCase の初期表示で FOUC が視認できない
- [ ] importmap / auto-load の構成は維持されている
- [ ] 追加した preload により描画が遅くならない（体感で悪化しない）
- [ ] 変更は `averageCase.html` のみ

## リスク / エッジケース
- `:not(:defined)` 非対応の古いブラウザで効果が出ない（ただし悪化はしない想定）。
- visibility 制御により、一瞬の空白が見える可能性がある（必要なら min-height で緩和）。

## 作業項目（Action items）
1. `averageCase.html` を確認し、FOUC 対象コンポーネントを洗い出す（完了条件: 対象の dads-* が明確）
2. `style` に `dads-*:not(:defined)` ルールを追加（完了条件: 未定義時の表示が隠れる）
3. 必要に応じて最小の `min-height` を検討・付与（完了条件: レイアウトの急変が抑制される）
4. `link rel="modulepreload"` に `dads-date-picker` / `dads-calendar` を追加（完了条件: preload が増える）
5. above-the-fold 以外は preload 追加しない（完了条件: 不要な preload が増えない）
6. ローカルで averageCase を表示確認（完了条件: FOUC が体感で消える）

## テスト計画
- `npm run dev` → `http://localhost:3000/averageCase.html?nosw=1` で初期表示を目視確認
- 必要に応じて `?lazy=0` で比較確認

## オープンクエスチョン
なし
