## Risks

- R-01 (HIGH): `references/` 分割が不十分で、SKILL.md が再び肥大化する
  - Impact: コンテキスト圧迫により実行精度が低下
  - Likelihood: Medium
  - Detection: `SKILL.md` が参照リンク中心にならず、詳細説明が過密なまま残る
  - Mitigation: P-02 で参照ファイル分割を先行実施し、P-03 以降は参照先へ追記する運用に固定
  - Rollback: 分割が破綻した場合は最小セット（思想/判定/運用）に再編し、旧本文の差分を参照ファイルへ退避
  - Linked steps: P-02, P-03

- R-02 (HIGH): JSON schema と本文の不整合が残り、自動処理が不安定になる
  - Impact: 機械可読出力の再現性が崩れる
  - Likelihood: High
  - Detection: Step artifacts のキー名が本文とJSON例で一致しない
  - Mitigation: P-04 で Step1-10 を一括定義し、Step本文と相互参照でレビューする
  - Rollback: 不整合発生時は schema を本文準拠に即時統一し、矛盾したキーを deprecated として明示
  - Linked steps: P-04, P-08

- R-03 (MEDIUM): 並行実行モデルの導入で手順が複雑化し、利用者理解が低下する
  - Impact: 運用時の誤用増加
  - Likelihood: Medium
  - Detection: few-shot で Step遷移が説明不能、または差し戻し条件が曖昧
  - Mitigation: P-03 と P-06 で「原則→条件→例」の順に記述し、例を3パターン固定
  - Rollback: 複雑化した場合はループ条件を4条件に限定し、詳細は referencesへ退避
  - Linked steps: P-03, P-06

- R-04 (MEDIUM): 失敗コード/ゲート判定が過剰厳格となり、不要な `blocked` が増える
  - Impact: 進行停止が増え、運用効率が下がる
  - Likelihood: Medium
  - Detection: `STUDY_NO_QUALITY_BASIS` などが軽微ケースでも頻発
  - Mitigation: P-05 で発火条件を if-then で最小化し、warning と blocker の境界を分ける
  - Rollback: blocker条件を再定義し、軽微違反は warning 扱いへ戻す
  - Linked steps: P-05, P-08

- R-05 (LOW): docs/registry/tests の周辺整合漏れ
  - Impact: 導入ガイドが誤解を生む
  - Likelihood: Medium
  - Detection: docs記載件数やコマンド例と実態が不一致
  - Mitigation: P-07/P-08で差分確認、`npm run skills:check` を必須実行
  - Rollback: ドキュメント差分のみを即修正し、Skill本体変更と切り離して再反映
  - Linked steps: P-07, P-08

- R-06 (MEDIUM): 2週間3案件の評価母数不足（U-02）
  - Impact: KR評価が未確定になる
  - Likelihood: Medium
  - Detection: 期間内に 3案件へ適用できない
  - Mitigation: 一次ルールとして評価期間延長を適用し、延長後に不足が続く場合のみ対象補充を検討する
  - Rollback: 評価結果を暫定扱いにし、次スプリントへ再評価を繰り越す
  - Linked steps: P-09
