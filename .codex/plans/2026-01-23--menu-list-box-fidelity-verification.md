# Menu List / Menu List Box の「DADS/Figma準拠度」検証ロジック

## 目標
- `dads-menu-list` / `dads-menu-list-item` / `dads-menu-list-box` が **DADS（HTML版の根拠）** と **Figma作例** に対して「どこまで一致しているか」を、**自動＋半自動（差分エビデンス）** で判定できるようにする。
- フレーキーな揺れは許容するが、**ズレが `font-family` / `line-height` 起因の可能性がある場合は必ずレポート**する。

## 背景
- 既存の Vitest（happy-dom）テストは「挙動（open/close、キーボード、menuitemselect、divider除外）」の担保が中心で、Figmaレベルの見た目（間隔/余白/線/配置）を測るには不足している。
- DADSのコードスニペットが乏しいケースでは、Figma作例を正確にトレースし、差分が出た箇所を特定できる検証が必要。
- リポジトリ方針として、外部根拠は `resources/dads/**` にスナップショットして参照可能にする（ADR-003）。

## スコープ
- やること：
  - DADS（docs/Storybook/上流）とFigmaの根拠を `resources/dads/components/{menu-list,menu-list-box}/` に集約
  - Playwright（実ブラウザ）で **レイアウト計測（px単位）＋視覚差分エビデンス（オーバーレイ）** の検証を追加
  - 「どの項目が合っていて、どこがズレているか」をテスト結果（fail理由/差分画像/計測値）で追える形にする
- やらないこと：
  - `dads-menu-list*` / `dads-menu-list-box` のAPI変更やデザイン修正そのもの（必要なら別Plan）
  - 根拠のない推測ベースの受入基準追加
  - 新規依存の大量導入（必要最小限のみ検討）

## 前提 / 制約
- コーディング規約は当リポジトリを根拠にする（`WEB_COMPONENTS_GUIDELINES.md`、`.claude/skills/css-writing-rules`、`.claude/skills/headless-component-design`）。
- DADS根拠は `resources/dads/**` を正とし、取得は `npm run dads:sync` / `dads:validate` のフローに乗せる（ADR-003）。
- Figma根拠は **node画像（PNG）＋必要ならnodes抽出JSON** を保存し、テストはそれを参照して再現性を担保する。
- 見た目検証は OS/フォント差でブレうるため、**「厳密に測る項目（幾何/px）」と「許容差を持つ項目（オーバーレイ/スクショ）」を分離**する。

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
該当なし（表示仕様の変更は行わず、検証ロジックのみ追加）

### その他（Docs/Marketing/Infra など）
- **根拠資材の追加**
  - `npm run dads:sync -- --component menu-list` / `menu-list-box` で DADS docs / HTML版Storybookキャプチャ / upstreamスナップショットを `resources/dads/components/*` に追加
  - `npm run dads:figma:add` でFigma node を登録し、`dads:sync -- --component ... --force` で `figma/images` と `figma/nodes/*.json` を取得
- **検証ロジック（Playwright）**
  - `@playwright/test` で以下を検証
    - (A) レイアウト計測テスト：`getBoundingClientRect()` / `getComputedStyle()` で **gap/余白/線/角丸/高さ** を px で判定（±許容差）
    - (B) 視覚差分エビデンス：Figma PNG と自前レンダリングを **同一座標に重ねたオーバーレイ**を出力（ズレ位置の特定用。フレーキーは許容）
  - 参照ケースは `src/demos.ts` / `packages/components/menu-list-box/menu-list-box.stories.ts` の Figma参照セクションをベースに固定化する
- **「準拠度」を測る観点（例）**
  - opener: 左アイコン↔テキスト、テキスト↔矢印の間隔、min-height、padding、border-radius、hover/focusの下線/アウトライン
  - popup: border/radius/shadow、padding、menuitemの高さ、start-icon揃え（reserve space）、scroll時の挙動
  - divider: `<hr>`/`role="separator"`、margin-block（外部reset耐性含む）、inset/full-widthの仕様
  - ずれ検知時に `font-family` / `line-height` をログして原因切り分け可能にする

## 受入基準
- [ ] `resources/dads/components/menu-list/` と `resources/dads/components/menu-list-box/` に DADS根拠（docs/Storybook/upstream）が入り、`npm run dads:validate -- --component menu-list(-box)` が通る
- [ ] `resources/dads/components/menu-list-box/figma/` に対象Figma作例のPNGが保存され、テストから参照できる
- [ ] Playwrightで以下が自動判定できる（fail時にどの値がズレたか出る）
  - [ ] opener の主要間隔と主要サイズ
  - [ ] popup の主要サイズと menuitem 配置
  - [ ] divider の `<hr>`/role、margin-block（外部reset下でも維持）、inset/full-widthの仕様
- [ ] オーバーレイ等の差分エビデンスで「ズレ位置」を目視確認できる
- [ ] ずれが `font-family` / `line-height` 起因の可能性がある場合、テスト出力に必ず含まれる
- [ ] `npm run type-check` / `npm run test:run` が既存どおり通る（回帰なし）

## リスク / エッジケース
- フォント/アンチエイリアス差でスクショ比較が不安定になる（→ 幾何(px)テストを主軸にし、スクショ/オーバーレイは補助）。
- Figma export の scale/viewport がズレるとオーバーレイが成立しない（→ 取得条件を `figma/config.json` に固定、テスト側も固定viewport）。
- スクロールバー描画はOS差が大きい（→ “reserved spaceを作らない”など比較可能な観点に限定）。

## 作業項目（Action items）
1. DADS資材を同期（完了条件: `resources/dads/components/menu-list*` が生成され、`dads:validate` がgreen）
2. Figma資材の config を作成（完了条件: `resources/dads/components/menu-list-box/figma/config.json` が更新される）
3. Figma資材を同期（完了条件: `figma/images` と `figma/nodes/index.json` が生成される）
4. Playwrightの検証（幾何/px）を追加（完了条件: 主要項目が自動判定でき、fail理由が具体的）
5. オーバーレイ/差分エビデンス出力を追加（完了条件: ズレ位置が画像で追える）
6. 実行導線（npm script + 手順）を整備（完了条件: 再現手順が docs にまとまる）

## テスト計画
- 既存: `npm run type-check` / `npm run test:run`
- 追加: Playwrightで menu-list-box のフィデリティ検証（幾何＋オーバーレイ）
- 資材整合: `npm run dads:validate -- --component menu-list` / `menu-list-box`

## 参照（Figma URLs）
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19766&t=ymmWSoek4arRMnTh-4
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19788&t=ymmWSoek4arRMnTh-4
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19800&t=ymmWSoek4arRMnTh-11
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19815&t=ymmWSoek4arRMnTh-11
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19774&t=ymmWSoek4arRMnTh-11
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19781&t=ymmWSoek4arRMnTh-11
- https://www.figma.com/design/MlgRomC0DHXGlB0t79w4wL/Digital-Agency-Design-Data-2.10.1?node-id=8263-19830&t=ymmWSoek4arRMnTh-11

