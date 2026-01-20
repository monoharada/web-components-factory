# viewer.html 用：Storybook風「API/Controls テーブル」サンプル（Controls + CSS Vars）

## 目標
- `viewer.html`（※ご指定の webcomponentviewer.html は現状 `viewer.html`）上で、各コンポーネントのAPI（Attributes/Properties）と CSS vars を説明できる「固定デザインのテーブルUI」を用意する。
- テーブル内のコントロール操作が、その場のデモ（ターゲット要素）に即時反映される（Storybook Controls 相当）。
- 他のコンポーネントデモへ継続的に挿入できるよう、再利用方法をドキュメント化する。

## 背景
- 現在のビューアは `viewer.html` が `src/demos.ts` のHTML文字列を差し替えて表示する方式。
- 既に `dads-table` があり、DADS準拠の見た目・水平スクロール等を提供できるため、説明用テーブルの器として再利用したい。

## スコープ
- やること：
  - “Controls（Attributes/Properties）” と “CSS vars” を **別テーブル** で表示する固定レイアウト/スタイルを `viewer.html` に追加する
  - デモ側（`src/demos.ts`）に、テーブル行の `data-*` 定義だけでバインドできる汎用スクリプト（作例）を追加する
  - まず1コンポーネントでサンプル実装を入れる
  - 使い方を `docs/knowledge/` に残す
- やらないこと：
  - 新しいWeb Component（例：`dads-api-table`）の新規実装（今回は viewer 専用パターンで進める）
  - ソースコードからAPIを自動抽出して表生成（手書き定義でOK）
  - Storybook自体への依存・統合

## 前提 / 制約
- `src/demos.ts` のHTMLは `innerHTML` で挿入されるため、JSは `document.currentScript` 起点で **そのデモ範囲にスコープ** して初期化する（他デモと衝突しない）。
- Custom Element は定義前に property を触ると upgrade 後に壊れる可能性があるため、バインドスクリプトは必要コンポーネントを `import()` してから動かす。
- 固定デザインは viewer 全体のCSSとして提供し、クラス接頭辞（例：`.wc-api-*`）で影響範囲を限定する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `viewer.html` に “APIパネル” 用の固定CSSを追加（例：`.wc-api-panel`, `.wc-api-grid`, `.wc-api-table`, `.wc-api-code` など）。
- デモに挿入する2つのテーブル構成：
  1) **Controls テーブル**（Attributes/Properties）
     - 列案：`Name / Kind(attr|prop) / Type / Default / Control / Description`
     - Controlは v1 で以下をサポート
       - boolean：`dads-switch`
       - string/number：`dads-input-text`（`dads-input` で即時反映）
       - enum：ネイティブ `select`（固定デザインCSSで見た目を整える）
  2) **CSS vars テーブル**
     - 列案：`Name / Default / Value / Description`
     - Value は `dads-input-text`（空なら `style.removeProperty()`）
- 反映先（ターゲット要素）指定は `data-target-selector` 等の `data-*` で行い、各Control要素に `data-api-attr` / `data-api-prop` / `data-api-css-var` のような宣言で紐付ける。
- 任意で “現在の設定から生成したスニペット” を表示（HTML + JS を分け、property はJS側に出す）して、Storybook的な「いまの状態が分かる」を担保する。
- “Reset” ボタン（`dads-button`）でデフォルト状態へ戻せるようにする（各行に `data-default` を持たせる等）。

### その他（Docs/Marketing/Infra など）
- `docs/knowledge/` に「API/Controls テーブル（viewer用）パターン」ドキュメントを新規追加：
  - 目的（いつ使うか）
  - コピペ用テンプレ（Controls/CSS vars の2テーブル）
  - `data-*` 仕様（attr/prop/css-var、型、default、ターゲット指定）
  - 追加手順（`src/demos.ts` のどこに置くか、scriptの置き方、注意点）
  - よくある落とし穴（custom element 定義前の property、空値の扱い、enumの扱い）

## 受入基準
- [ ] `viewer.html?component=...` でサンプルが表示され、Controlsテーブルの操作がターゲット要素へ即時反映される
- [ ] CSS vars テーブルの入力が `style.setProperty/removeProperty` でターゲットへ反映される
- [ ] デモ切り替え（別component → 戻る）でもJSが衝突せず、コンソールエラーが出ない
- [ ] テーブルデザインが固定化され、横幅不足時は `dads-table` のスクロールで破綻しない
- [ ] `docs/knowledge/` に再利用手順があり、別デモへ展開できる形になっている

## リスク / エッジケース
- `innerHTML` 差し替えによりイベントリスナーが多重登録される可能性 → `document.currentScript` 起点のスコープ化＋初期化対象をデモ内に限定する。
- property反映（`el[prop] = ...`）は定義前に触ると危険 → スクリプト冒頭で `import()` を保証。
- property はHTMLスニペットに載らない → “HTML/JSスニペットを分離表示” して混乱を避ける。
- CSS var の値はトークン参照（`var(--...)`）が多い → カラーピッカー等は v1 では採用せず、文字入力で扱う。

## 作業項目（Action items）
1. `viewer.html` に APIパネル用の固定CSSを追加（完了条件: クラス付きマークアップが意図通りのレイアウト/見た目になる）
2. `src/demos.ts` に APIテーブル用の汎用バインドスクリプト（文字列生成関数）を追加（完了条件: data定義だけで attr/prop/css-var が反映できる）
3. `src/demos.ts` にサンプル用のセクションを1つ追加（完了条件: Controls + CSS vars の2テーブルが動く実例が viewer で確認できる）
4. “現在の状態スニペット（HTML/JS）” 表示をサンプルに追加（完了条件: 操作に追従して表示が更新される）
5. `docs/knowledge/` に再利用ドキュメントを追加（完了条件: 別コンポーネントに展開できる手順とテンプレが書かれている）
6. 手動確認を実施（完了条件: 受入基準の操作を一通り満たす）
7. `npm run type-check` を実行（完了条件: エラーなし）
8. `npm run test:run` を実行（完了条件: 既存テストが落ちない）

## テスト計画
- `bun server.ts` → `http://localhost:3000/viewer.html?component=<sample>` を開く
- Controlsテーブル：
  - boolean/enum/string/number の操作が即時反映される
  - Resetで初期状態へ戻る
- CSS vars テーブル：
  - 値変更で見た目が変わる
  - 空にすると removeProperty で戻る
- デモ切替で衝突しない（表示→別→戻る）
- `npm run type-check` / `npm run test:run`

## オープンクエスチョン
該当なし

