# カード作例4 余白/リンク調整プラン

## 目標
- Figmaの密度感に合わせて、カード作例4の余白とタイポグラフィのリズムを調整する
- 「導入企業の割合」をリンクとして明確化し、hoverで下線を太くして視認性を上げる

## 背景
- Figmaと現実装で余白が広く見え、情報のまとまりが弱い
- 下線付き見出しはリンク想定と読み取れるため、インタラクションの明確化が必要

## スコープ
- やること：
  - `src/demos/showcase-components.ts` 内のカード作例4のスタイルとマークアップ調整
  - hover時の下線太さ変更（リンク強調）
  - 余白・行間・要素間隔の再設計（Figma準拠）
  - VRTの更新
- やらないこと：
  - JSONスキーマ・データ内容の変更
  - 他作例（1,2,3,5）の見た目変更
  - コンポーネント本体（dads-cardなど）への変更

## 前提 / 制約
- DADSトークン/設計を優先（ハードコード色や !important 禁止）
- hoverは `@media (any-hover: hover)` で限定し、`focus-visible` は崩さない
- Figmaの見た目を優先し、実寸は近似で揃える
- リンク先は仮 `href="#"` のままでOK

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- **リンク強調**：`.card-example-4__title-link` の hover 時に下線太さを 2px 相当へ（defaultは1px維持、focus-visibleでも明確化）
- **余白設計**：単一の `row-gap` ではなく、要素グループ単位で間隔を再設計  
  - Title → Value：やや詰める  
  - Value → Delta：詰める  
  - Delta → Progress：詰める  
  - Progress → Divider：微調整  
  - Divider → Description：少し確保  
  - Description → Footer：少し確保  
- **タイポ/行間**：数値・本文の line-height と字間をFigmaに寄せる（読みやすさ維持）
- **密度の一貫性**：カード上下の padding をFigmaに近づけ、視覚的な“間延び”を減らす

### その他（Docs/Marketing/Infra など）
- VRTスナップショット更新

## 受入基準
- [ ] 見出しリンクは hover で下線が太くなり、リンクであることが一目で分かる
- [ ] Figma比較で、要素間の余白が現実装より締まり、間延び感が解消されている
- [ ] フォーカス可視性が維持されている（リンクの focus-visible が潰れない）
- [ ] VRT（card example 4）が更新され、差分が意図通り

## リスク / エッジケース
- hover 下線強調がフォーカスリングと競合する可能性
- 余白を詰めすぎると可読性が落ちる
- 既存VRTが大きく変わるため、他の差分と混ざる懸念

## 作業項目（Action items）
1. Figma差分の視覚ポイントを整理（どの間隔が広いか明文化）（完了条件: 調整対象の間隔が3〜5箇所に特定されている）
2. `.card-example-4__title-link` の hover/focus-visible スタイルを設計（完了条件: 下線太さと適用条件が決まっている）
3. 余白・行間・padding のローカル変数設計（完了条件: 変更対象の値が変数化される）
4. CSSの調整（row-gap再構成・個別間隔調整）（完了条件: Figmaに近い密度に見える）
5. テストの更新（hoverスタイル/間隔の検証 or VRTで担保）（完了条件: 追加チェック or VRT更新が完了）
6. Playwright VRT更新と差分確認（完了条件: `card-example-4` のスナップ更新済み）

## テスト計画
- `npx playwright test e2e-evidence/card.example-4.vrt.spec.ts --update-snapshots`
- 目視で Figma 比較（余白・リンクホバー）

## オープンクエスチョン
- 詰まる点なし（hover下線太さは 2px 相当で進める前提）
