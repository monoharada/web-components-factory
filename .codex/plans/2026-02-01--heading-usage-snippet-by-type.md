# Heading: Usage(HTML) を type 別の最小マークアップにする（shoulder/icon/chip で不要なslotを出さない）

## 目標
- Heading デモの Usage(HTML) が、`type` の選択に応じて「必要な要素だけ」のマークアップになる
  - `type="default"`: 本文のみ
  - `type="shoulder"`: shoulder slot + 本文のみ
  - `type="icon"`: icon slot + 本文のみ
  - `type="chip"`: 本文のみ（chipは属性で表現されるので slot は不要）
- Preview と Usage が矛盾しない（Controlsで選んだ状態が、そのまま Usage に反映される）
- type 切替時は **typeごとに初期値へリセット**（保持しない）

## 背景
- 現状の Usage テンプレートは `<span slot="shoulder">` と `<svg slot="icon">` を常に含むため、`type="default"` でも「全部入り」HTMLになって誤解を生む
- `bindApiControls()` は attr/prop/css-var の反映は強いが、Usage生成時に「DOMノードの追加/削除」を自動でやる仕組みは持っていない
- そのため、デモ側で `type` 変更に合わせて Preview DOM を実際に add/remove し、Usageはそれを反映するのが合理的

## スコープ
- やること：
  - Heading デモの API/Controls 内で、`type` 変更時に slot ノードを add/remove する
  - Usage(HTML) は template ではなく Preview の clone を使って生成し、不要な内部 wiring 属性を出さない
  - type 切替時に肩/アイコンの値は初期値へリセットする
- やらないこと：
  - `bindApiControls()` を「type別スニペット生成」に対応させる（汎用化はしない）
  - 他コンポーネントへの横展開

## 前提 / 制約
- Usageを Preview clone から生成する場合、内部 wiring 属性（例: `data-api-target`）はスニペットに出さない必要がある
- Reset操作は programmatic に値が変更されるため、`change` イベントが発火しない場合がある（slot差し替えの追加ケアが必要）

## 変更内容（案）
### データ / バックエンド
該当なし

### UI / UX
- `src/demos/showcase-components.ts`（HeadingのAPI/Controls）で:
  - `type` 変更時に `<dads-heading>` 内の `[slot="shoulder"]` / `[slot="icon"]` を add/remove（type別の最小DOM）
  - type 切替時に shoulderText/iconName を初期値へリセット
  - Reset クリック時も slot 差し替えが追従するように同期
- `src/viewer-api-controls.ts` で:
  - Usage を Preview clone から生成する際、`data-api-*` を除去してスニペットに出さない

### その他（Docs/Marketing/Infra など）
該当なし

## 受入基準
- [ ] Heading デモの Usage(HTML) が type 別に最小化される
  - [ ] default: slot 要素が出ない
  - [ ] shoulder: shoulder slot だけ出る
  - [ ] icon: icon slot だけ出る
  - [ ] chip: slot 要素は出ない（type 属性のみ）
- [ ] type 切替直後に Usage も追従する（リロード不要）
- [ ] Reset でも Usage が type の最小形へ戻る
- [ ] `npm run type-check` が通る

## リスク / エッジケース
- Reset が programmatic で change が飛ばず、slot差し替えが置き去りになる
  - 対策: Reset クリック後に type を再同期して Usage を再生成させる

## 作業項目（Action items）
1. Heading API/Controls の Preview/Usage/Controls の依存関係を確認。（完了条件: type と slot の関係が整理できる）
2. type 変更時に slot ノードを add/remove するデモ側ロジックを追加。（完了条件: Preview DOM が type と一致）
3. Usage を Preview clone ベースに切り替え、内部属性の混入を防ぐ。（完了条件: `data-api-*` がスニペットに出ない）
4. Reset でも slot 差し替えが追従するように同期。（完了条件: Reset後の Usage が正しい）
5. `npm run type-check` と viewer 目視確認。（完了条件: 受入基準を満たす）

## テスト計画
- `npm run type-check`
- `npm run test:run`
- viewer目視（Heading → API/Controls で type を切替し、Usage(HTML) を確認）

## オープンクエスチョン
該当なし

