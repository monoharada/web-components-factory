# a11y-annotate のアノテーション表示を既存DADSコンポーネントと揃える

## 目標
`a11y-annotate` のコールアウト（色/角丸/影/タイポグラフィ）を、既存の DADS コンポーネント実装（トークン/形/文字）に合わせて統一し、`dads-card` 等の表示物と「揃って」見える状態にする。

## 背景
- `packages/components/annotate/annotate.ts` にハードコード色/角丸/影・コードっぽいフォント指定があり、既存コンポーネントの実装パターン（DADSトークン参照、TypographyWebComponent前提）とズレる余地がある。
- コールアウト枠（点線矩形）の角丸が、対象要素（例: `dads-card` の外周）と揃わない可能性がある。

## スコープ
- やること：
  - コールアウト色を既存コンポーネント同様に DADS トークン参照へ寄せる（例: フォーム系のエラー色と同系統）
  - コールアウトタグのラベル（`container`/`main` 等）を、既存コンポーネントの“通常本文”タイポグラフィに寄せる（コードフォント強制をやめる）
  - コールアウト枠の角丸をターゲット要素の角丸に追従させる（見た目を揃える）
  - `a11y-annotate` 内の残っている直値（色/影/角丸）をトークン参照へ寄せる
- やらないこと：
  - `dads-card` 等、注釈対象コンポーネント自体の仕様/見た目変更
  - `a11y-annotate` の外部API互換性に影響する破壊的変更（part/attrのリネーム等）

## 前提 / 制約
- CSSは `css-writing-rules` に従い、色/角丸/影はできるだけグローバルトークン参照（例: `--color-semantic-error-1`, `--border-radius-*`, `--elevation-*`）に寄せる。
- コールアウト色の基準は既存のフォーム系実装に合わせる（`packages/components/*/*-tokens.ts` でのエラー色参照パターンに追従）。
- コールアウトタグのラベルは「既存コンポーネントの通常テキスト」同様に扱う（モノスペ強制はしない）。スナップショット等“コード表示”は引き続きモノスペでよい。
- `a11y-annotate` は Light DOM 描画（現方針）を維持する。
- CEM（`custom-elements.json`）は単一の真実（JSDocに変更が出る場合のみ `npm run cem:analyze`）。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `packages/components/annotate/annotate.ts`
  - コールアウト色のデフォルトを既存実装に合わせて `--color-semantic-error-1` 系へ寄せる（例: textarea/input/select が参照しているトークン）
  - `.callout-tag code` の `font-family: ui-monospace...` 強制をやめ、既存コンポーネント同様 `inherit` に寄せる（表示物と揃える）
  - 影（`--a11y-annotate-shadow`）を `--elevation-*` 系参照に寄せる
  - 直値の色（例: `--a11y-annotate-text-muted`, `--a11y-annotate-snapshot-border` 等）を `--color-text-*` / `--color-border-*` 参照へ寄せる
  - `#layoutCallouts()` でターゲット要素の computed `border-*-radius` を読み取り、`pad` を加味して `.callout-box` の角丸を inline style 反映（`dads-card` 等と枠線形状を揃える）

### その他（Docs/Marketing/Infra など）
- 必要なら `docs/accessibility-annotations.md` に「枠線角丸はターゲットに追従する」旨を追記（任意）

## 受入基準
- [ ] コールアウト色が既存コンポーネントのトークン参照パターンに揃っている（例: `--color-semantic-error-1` 系、直値rgba/rgbが残らない）
- [ ] コールアウトタグのラベルが“コードっぽい等幅”強制ではなく、既存コンポーネントの本文タイポグラフィに揃っている
- [ ] `dads-card` の container/main コールアウト枠の角丸がカード外周と視覚的に揃う
- [ ] `npm run type-check` / `npm run test:run` / `npm run validate:wc` が通る
- [ ] （JSDoc公開APIに変更が出た場合のみ）`npm run cem:analyze` 後に `custom-elements.json` 差分が解消している

## リスク / エッジケース
- ターゲット要素が複雑な角丸（cornerごと、%指定など）の場合の扱い（数値化できない場合はフォールバックが必要）
- `pad` 加算で角丸が過大になるケース（上限クランプ要否）
- `happy-dom` 環境で `getBoundingClientRect` が 0 になりやすく、見た目寄りの挙動は自動テストで担保しづらい（目視確認が重要）

## 作業項目（Action items）
1. 既存のエラー色トークン参照パターンを確認（例: `packages/components/textarea/textarea-tokens.ts` など）。（完了条件: 採用すべきトークン参照が確定している）
2. `packages/components/annotate/annotate.ts` のコールアウト色デフォルトを既存パターンに揃える。（完了条件: rgba/rgb直値がなくなりトークン参照になっている）
3. `.callout-tag code` の等幅フォント強制を撤去し、既存コンポーネント同様の本文表示に寄せる。（完了条件: ラベルが通常フォントで表示される）
4. 影/境界/テキスト等の残直値をトークン参照へ寄せる。（完了条件: `#334155` や `#e2e8f0` 等の直値が解消している）
5. `#layoutCallouts()` に角丸追従ロジックを追加。（完了条件: `dads-card` の枠角丸がカードと揃う）
6. `npm run type-check`。（完了条件: PASS）
7. `npm run test:run`。（完了条件: PASS）
8. `npm run validate:wc`。（完了条件: PASS）
9. （必要なら）`docs/accessibility-annotations.md` 追記。（完了条件: 仕様として説明が追記されている）

## テスト計画
- 自動: `npm run type-check` / `npm run test:run` / `npm run validate:wc`
- 目視: `npm run dev` → `viewer.html` で `dads-card` を選択し、注釈ONで「色」「ラベル文字」「枠角丸」の揃いを確認

