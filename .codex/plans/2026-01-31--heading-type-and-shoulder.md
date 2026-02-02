# Heading: Type切替 + Shoulder制御（利用者目線のAPI整理）

## 目標
- APIテーブル上で **ショルダーのON/OFF** を切り替えられるようにする（Preview/Usageに反映）
- Figma上の「Default / Shoulder / Front-icon / Chip」を、利用者が迷わず再現できる **合理的な切替API** を設計する
- 既存の柔軟な組み合わせ（例: chip + icon + shoulder）も必要に応じて維持し、DADS実装との整合性を取る

## 背景
- 現状デモ（API/Controls）では `shoulder` はスロット有無依存で、テーブル操作だけでON/OFFできない
- FigmaのHeadingsコンポーネントは `Style=Default/Shoulder/Front-icon/Chip` の **1-of** 表現になっている
- 一方、DADSのHTMLサンプル（`design-system-example-components-html`）では `chip` + shoulder + icon を同時に使う例があり、**実装としては合成可能**（=FigmaのStyleは「例の切替」であって、必ずしも禁止ではない可能性が高い）

## スコープ
- やること：
  - `dads-heading` に **shoulder表示の明示制御** を追加（APIテーブルで切替可能に）
  - **Type（Style）切替** を導入し、Default/Shoulder/Icon/Chip を選べるようにする（`custom` あり）
  - デモ（APIテーブル）に shoulder と type を追加し、利用者が試しやすい形にする
  - docs / CEM / テストを整備する
- やらないこと：
  - 既存の `chip` / `icon` / slot API を即座に破壊的変更で置き換える（互換性は維持）
  - 「常に1-ofでしか使えない」ように強制（`custom` で合成を許可）

## 前提 / 制約
- viewerの `bindApiControls()` は attr/prop/css-var の反映は得意だが、UsageテンプレートのDOM構造自体を大きく作り替える用途には向かない
- `dads-heading` は現在 `slot` の有無を見て `data-has-*` を付与し、CSSで表示/非表示を切り替える設計
- 互換性: 既存の `<span slot="shoulder">…</span>` / `<span slot="icon">…</span>` / `chip` 等を壊さない

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
**コンポーネントAPI**
- `shoulder="auto|on|off"`（default: `auto`）
  - `auto`: スロットの有無に追従
  - `on`: スロット有無に関わらず shoulder領域を有効化
  - `off`: スロットがあっても shoulder領域を無効化
- `type="custom|default|shoulder|icon|chip"`（default: `custom`）
  - `custom`: 現状どおり合成可能
  - `default/shoulder/icon/chip`: FigmaのStyleに合わせたプリセット表示（他要素は非表示扱い）
  - 優先順位: `type !== custom` のときは `type` が最優先（個別の `chip/icon/shoulder` は無視）

**デモ（API / Controls）**
- Props/Attrsテーブルに `shoulder` 行を追加（auto/on/off）
- Props/Attrsテーブルに `type` 行を追加（custom/default/shoulder/icon/chip）

### その他（Docs/Marketing/Infra など）
- `dads-heading` のJSDoc（attrs/css props）に `type` / `shoulder` を追記
- `custom-elements.json` を再生成してCEMに反映

## 受入基準
- [ ] viewerのHeadingデモで、APIテーブル操作のみで shoulder をON/OFFできる
- [ ] `type` を切り替えると Default/Shoulder/Icon/Chip の見た目に切り替わる（FigmaのStyleの意図を再現）
- [ ] `type="custom"` では従来どおり合成（chip + icon + shoulder 等）が可能
- [ ] 既存の利用（`chip`/`icon`/slot）に破壊的変更がない
- [ ] `packages/components/heading/heading.test.ts` に `type` と `shoulder` の挙動テストが追加される
- [ ] `npm run type-check` と heading のvitest が通る
- [ ] `npm run cem:analyze` で `custom-elements.json` に新APIが反映される

## リスク / エッジケース
- `type` と個別トグル（chip/icon/shoulder）の同時指定で混乱しやすい
  - 対策: type優先を明記し、デモUIでも注釈（または無効化）を入れる
- Usage snippetが「typeに応じた最小HTML」を自動で出せない
  - 対策: まずは属性で状態が伝わることを優先し、必要なら次フェーズで改善

## 作業項目（Action items）
1. 参照実装の整理（Figma variants / DADS HTMLサンプル / 既存実装差分の確認）（完了条件: type設計の根拠を箇条書きで残す）
2. `dads-heading` のAPI設計確定（type/shoulderの名称・優先順位・default）（完了条件: 受入基準に対応する仕様が決まる）
3. `dads-heading` に `shoulder` 属性を追加（auto/on/off）し `data-has-shoulder` の算出へ組み込み（完了条件: shoulder制御が単体でテスト可能）
4. `dads-heading` に `type` 属性を追加し、custom/default/shoulder/icon/chip の表示制御を実装（完了条件: typeの各モードで表示が切り替わる）
5. heading のテスト追加（type/shoulderの境界、既存挙動の回帰）（完了条件: vitestでRED→GREENを確認）
6. viewerのHeadingデモに `shoulder` / `type` 行を追加し、操作でPreview/Usageが追従するよう調整（完了条件: UI操作だけで切替できる）
7. JSDoc/CEM更新（`npm run cem:analyze`）（完了条件: `custom-elements.json` に `type`/`shoulder` が載る）
8. 仕上げの検証（headingテスト + type-check + 必要ならviewer目視）（完了条件: 受入基準を満たす）

## テスト計画
- `npx vitest run --cache=false packages/components/heading/heading.test.ts`
- `npm run type-check`
- `npm run cem:analyze`
- viewerで目視（Headingデモで `type` と `shoulder` の切替、Figmaの各Style相当の見た目になっているか）

## オープンクエスチョン
- 該当なし（`custom` ありで合意）

