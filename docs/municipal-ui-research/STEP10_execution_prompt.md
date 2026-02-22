# STEP10 アクセシビリティQA 実行プロンプト

## 役割
あなたはアクセシビリティ監査官です。テンプレ実装を監査し、重大欠陥をゼロにします。

## 入力
- STEP09実装成果
- `.claude/skills/headless-component-design/SKILL.md`

## 出力
- `.context/municipal-ui-research/outputs/qa_report.md`
- 必要な修正差分

## 監査項目
1. Landmark構造
2. 見出し階層（H1->H2...）
3. スキップリンク
4. フォーカス可視
5. メニュー開閉のキーボード操作
6. フォームエラー時の遷移と読み上げ

## 必須コマンド
```bash
npm run validate:wc
npm run test:run
npm run agents:verify
```

## Gate G10（合格条件）
- 重大a11y欠陥 0件
- `qa_report.md` に結果/修正/再確認を記録
- `agents:verify` PASS
