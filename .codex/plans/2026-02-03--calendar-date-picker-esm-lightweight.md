# date-picker.ts / calendar.ts ESM軽量化 + 遅延ロード Plan（更新）

## 目標
- `packages/components/date-picker/date-picker.ts` と `packages/components/calendar/calendar.ts` の **ESMとしての配信サイズ** を、minify以外で削減する
- `date-picker` のカレンダー機能を **遅延ロード** し、カレンダー不要ケースの配信/初期実行コストを下げる
- `calendar` の描画ホットパスを最適化し、メインスレッド負荷（割り当て・Intl生成・DOM更新）を下げる

## 背景
- 現状の素のソースサイズは概ね `date-picker.ts` ≒ 31KB、`calendar.ts` ≒ 38KB（合計 ≒ 69KB）で、ESM配信でも無視できない
- `calendar.ts` は `Intl.DateTimeFormat` の生成/formatや `Date` 生成が多く、ホットパス最適化で体感改善が見込める
- 配信形態は「Viteでバンドル」も「ESMそのまま」もあり得るが、今回は **ESM自体の軽量化** を最優先とする
- `date-picker` のカレンダー遅延ロードは許容（初回の僅かな待ちOK）。Web Worker案も検討余地あり

## スコープ
- やること：
  - `date-picker` から `calendar` への依存を **dynamic import化**（遅延ロード）
  - `calendar` の描画・ラベル生成のホットパス最適化（Intl/Date生成・DOM更新の削減）
  - 重複ロジック（例: prefix付きカスタム要素置換）を `packages/utils` に集約し、ESMで共有（重複排除）
  - （任意/効果大）`a11yAnnotations` を “本体” から分離し、**lite entrypoint** を用意（Runtime最小版）
- やらないこと：
  - 単なるminifyだけ
  - 互換性を壊す変更（イベント/属性/外部APIの破壊）
  - Workerを無理に導入して **コード総量が増える** 方向の最適化（効果が薄い場合は見送る）

## 前提 / 制約
- ESM軽量化の主戦場は「(1) 読み込まれないように分割（遅延）」と「(2) 重複排除（共有モジュール化）」と「(3) optional化（lite入口）」になる
- `a11yAnnotations` は現状テストやCEM運用上 “存在前提” になりがちなので、デフォルトは維持しつつ **別入口で外せる** 形が安全
- Web Workerは「DOM操作は移せない」ため、移せるのは “日付グリッド計算/文字列生成” 程度。追加コード（worker本体+メッセージング）で **ESM総量が増え得る** ので、まずは遅延ロード＋ホットパス最適化を優先する

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 遅延ロード時の初回オープンで、以下を守る（どれを採用するかは実装前に決める）
  - (推奨) 初回クリック時はボタンを一時disabledにして二重操作防止、ロード完了後にポップオーバー表示＋フォーカス
  - 失敗時はポップオーバーを開かず、consoleに警告（もしくはフォールバックで `<input>` のみ運用）
- キーボード操作（Esc/Tabトラップ/矢印移動/range選択）を維持

### その他（Docs/Marketing/Infra など）
**推奨アプローチ（順序つき）**
1) **案C（遅延ロード）を先に**：`date-picker` がカレンダーを必要としたときだけ `calendar` を読み込む（ESMの“配信”に直撃で効く）
2) **案A（ホットパス最適化 + 重複排除）**：`calendar` のランタイムも改善しつつ、共通処理を `packages/utils` に寄せてESM重複を削る
3) **案D（効果最大だが設計追加）**：`calendar-lite` / `date-picker-lite` のような “runtime最小入口” を追加し、`a11yAnnotations` 等を外せる選択肢を提供（shadcn的にも相性が良い）
4) Workerは「効果が測れたら」検討（先に上3つで十分下がる可能性が高い）

## 受入基準
- [ ] `npm run type-check` が通る
- [ ] `npm run test:run` が通る（特に `packages/components/calendar/calendar.test.ts` / `packages/components/date-picker/date-picker.test.ts`）
- [ ] `npm run validate:wc` が通る
- [ ] `npm run build` が通る
- [ ] 遅延ロードにより「カレンダーを使わない利用」で `calendar` が初期ロードに含まれない（挙動で確認できる）
- [ ] `calendar` の操作（矢印/Tab/range/今日/削除）が従来通り
- [ ] サイズ差分が記録され、改善が確認できる（gzip/brotliで比較）

## リスク / エッジケース
- 遅延ロードで `defineCalendar(prefix)` のタイミングが遅れるため、初回オープン時の `focus()` や要素アップグレード順が崩れやすい
- prefix置換（`#ensureCalendarElement`）と dynamic import の順序を間違えると、`<my-ui-calendar>` が未定義のままになる
- `a11yAnnotations` の分離（lite入口）は、既存テスト/利用側が静的プロパティ存在を期待していると破壊になるため、デフォルト入口は維持が必須
- Worker導入はコード総量増・デバッグ難化・ビルド設定追加になりやすい（ESM軽量化に逆行する可能性）

## 作業項目（Action items）
1. サイズ計測の基準を確定（完了条件: `vite build` 産物でgzip/brotli差分を取る手順が決まる）
2. `date-picker` の `defineCalendar` を dynamic import 化（完了条件: 初期ロードで `calendar` が不要なら読まれない）
3. 遅延ロード時のUX/フォーカス仕様を実装（完了条件: 初回オープンで二重操作が起きず、フォーカスが安定）
4. `calendar` の `Intl.DateTimeFormat` 生成をキャッシュ（完了条件: renderごとの formatter 生成がなくなる）
5. `calendar` の描画ループの割り当て削減（Date生成/DOMクリア方法等）（完了条件: render中の不要生成が減り、テストが通る）
6. prefix付き要素置換ロジックを `packages/utils` に集約（完了条件: `calendar`/`search-box` などの重複が解消）
7. （任意）`calendar-lite` 等の入口追加（完了条件: `a11yAnnotations` なしで使える入口が提供され、既存入口は互換維持）
8. 回帰＋計測（完了条件: `npm run ci` 成功、サイズ差分が記録される）

## テスト計画
- `npm run test:run -- packages/components/calendar/calendar.test.ts`
- `npm run test:run -- packages/components/date-picker/date-picker.test.ts`
- `npm run validate:wc`
- `npm run build`
- サイズ: `vite build` 後に `dist/assets` を gzip/brotli して差分比較（実装時にコマンド確定）

## オープンクエスチョン
1. `a11yAnnotations` を外せる **`*-lite` の追加エントリポイント**（例: `packages/components/calendar/lite`）を用意してもよいですか？（デフォルト入口は互換維持のまま）
