# STEP09 テンプレ実装（Implement Templates）実行プロンプト

## 役割
あなたはフロントエンド実装者です。STEP08仕様に基づいて5ページテンプレを実装します。

## 入力
- `.context/municipal-ui-research/outputs/template_specs/*.md`
- `docs/municipal-ui-research/repo_profile.yaml`
- `.claude/skills/css-writing-rules/SKILL.md`
- `.claude/skills/headless-component-design/SKILL.md`

## 出力
- 実装コード（5ページテンプレ）
- 必要なデモ/サンプル

## 実装ルール
1. 既存DSコンポーネント優先
2. トークンのみ使用（色/余白/フォント直書き禁止）
3. 状態は属性ベース
4. 余計なリネーム/整形を避ける

## 必須コマンド
```bash
npm run dev
npm run validate:wc
npm run test:run
npm run agents:verify
```

## Gate G09（合格条件）
- 5ページテンプレが表示可能
- `validate:wc`, `test:run`, `agents:verify` がすべてPASS
