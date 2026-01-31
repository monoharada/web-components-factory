---
name: card-example-4-dashboard-json
status: approved
---

# カード作例4（ダッシュボード・JSON反映）実装プラン

## 目標
- 添付のダッシュボード風カードを作例4として追加し、JSONから値を反映する
- Android/iOS ラベルは dads-chip-label を使用

## 背景
- Storybookのコードが無いため、Figma/画像を基に再現
- ダッシュボード用途を想定したデータ駆動カードが必要

## スコープ
- やること：
  - 作例4を作例3と作例5の間に追加
  - `<script type="application/json">` でデータ受け渡し
  - JSON値の反映（タイトル/数値/増減/進捗/件数/説明/チップ/更新日時）
  - VRT追加
- やらないこと：
  - dads-card / dads-chip-label 本体の仕様変更

## 前提 / 制約
- JSON埋め込み方式（A）を採用
- CSSは css-writing-rules に準拠

## 変更内容（案）
### データ / バックエンド
- 該当なし

### UI / UX
- 新作例4の構成要素を実装し、JSONで反映
- dads-chip-label で Android/iOS チップを描画

### その他（Docs/Marketing/Infra など）
- VRT追加

## 受入基準
- [ ] 作例4が4番目に追加される
- [ ] JSON値が全て反映される
- [ ] dads-chip-label が使われる
- [ ] VRTがグリーン

## リスク / エッジケース
- 値の0/100や長文での崩れ

## 作業項目（Action items）
1. 作例4の挿入位置を確定（完了条件: 作例3と作例5の間）
2. JSONスキーマ定義（完了条件: key一覧確定）
3. HTML構造実装（完了条件: 9ブロック構成）
4. JSON反映スクリプト追加（完了条件: 値反映）
5. dads-chip-label 実装（完了条件: Android/iOS表示）
6. CSS調整（完了条件: 画像に近い見た目）
7. VRT追加（完了条件: スナップ作成・実行）

## テスト計画
- 目視: /?component=card
- VRT: npm run test:e2e -- e2e-evidence/card.example-4.vrt.spec.ts

## オープンクエスチョン
- なし
