## Summary
<!-- 変更内容の概要を記述してください -->

## Type of Change
<!-- 該当するものにチェックを入れてください -->
- [ ] 新規コンポーネント
- [ ] 既存コンポーネントの修正
- [ ] ドキュメント
- [ ] バグ修正
- [ ] リファクタリング
- [ ] CI / ツール
- [ ] その他

---

## 新規コンポーネントチェックリスト

<!-- 新規コンポーネント追加時は以下を確認してください。それ以外の変更の場合はこのセクションを削除してください。 -->

### CEM (Custom Elements Manifest)
- [ ] `@customElement` + `@tagname dads-<name>` をJSDocに記載
- [ ] `npm run cem:analyze` 実行、`custom-elements.json` を更新・コミット
- [ ] `@attr` で公開属性を型付き記載
- [ ] `@slot` で公開スロットを記載
- [ ] `@csspart` で公開partを記載
- [ ] `@fires` で公開イベントを記載

### Demos & Validation
- [ ] `src/demos.ts` にデモ関数追加
- [ ] `viewer.html` にセレクタ追加
- [ ] 新規HTMLファイルを作成していない
- [ ] `npm run validate:wc` パス

### Tests & Types
- [ ] `packages/components/<component>/<component>.test.ts` 追加
- [ ] `npm run test:run` パス
- [ ] `npm run type-check` パス

### Import & Autoload
- [ ] import は `.js` 拡張子を使用
- [ ] `packages/autoload/dads/<component>.ts` 追加

### 推奨（任意）
- [ ] `@cssprop` でCSS変数API記載
- [ ] `a11yAnnotations` 記載
- [ ] E2E/Fidelityテスト追加

---

## 検証コマンド結果

```bash
npm run ci  # 結果を貼り付けるか、CI通過を確認
```

---

## 関連 Issue / PR
<!-- 関連するIssueやPRがあればリンクしてください -->
- Closes #
- Related to #

---

## スクリーンショット / デモ
<!-- UIに変更がある場合はスクリーンショットを添付してください -->

---

## レビュアーへのメモ
<!-- 特にレビューしてほしいポイントがあれば記述してください -->
