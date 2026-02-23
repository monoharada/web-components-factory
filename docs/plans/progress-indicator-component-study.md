# Progress Indicator Component Study

- 作成日: 2026-02-23
- 参照元: `docs/plans/progress-indicator-design.md`
- 対象: `dads-progress-indicator`（`dads-spinner` / `dads-progress-bar` / `dads-loading-icon`）

## Human summary

- Step10 まで完了しました。Step7-8 で実使用文脈の作例を追加し、仕様欠損の有無を確認しました。
- 主な判断は「3コンポーネント分割」「indeterminate時のARIA値属性省略」「determinateの0..100正規化」「reduce時のアニメ完全停止」「status message責務の利用側委譲」です。
- 次アクションは実装フェーズへの引き継ぎです。Step10 の `handoff` に沿って、Phase 1（spinner）から着手できます。

## JSON (resume contract)

```json
{
  "study_id": "component-study-progress-indicator-20260223",
  "component_name": "dads-progress-indicator",
  "current_step": 10,
  "status": "done",
  "scope": {
    "included": [
      "非同期処理中を通知するProgress Indicatorファミリー（spinner / progress-bar / loading-icon）",
      "determinate/indeterminateの進捗表現",
      "label属性による可視ラベルとアクセシブル名の連動",
      "WCAG 2.2 AA準拠の基礎設計（コントラスト、name/role/value、forced-colors）",
      "prefers-reduced-motionへの対応"
    ],
    "excluded": [
      "status message配信（role=status / aria-live）の内包",
      "aria-busyの自動設定（利用側コンテナの責務）",
      "非同期処理そのものの制御（再試行ロジック、タイムアウト管理）",
      "IntersectionObserverによる画面外自動停止（Phase2候補）"
    ]
  },
  "standards": {
    "required": [
      "WCAG 2.2 AA"
    ],
    "baseline": [
      "WAI-ARIA 1.2 progressbar",
      "ARIA Authoring Practices Guide: Progressbar Pattern",
      "DADS Figma v2.10.3 design data"
    ],
    "deferred": [
      "WCAG 2.2 AAA 2.3.3 を必須要件ではなく追加品質として扱う"
    ]
  },
  "governance": {
    "non_goals": [
      "単一コンポーネントへの統合（Spinner/Linear/Iconの一体化）",
      "見た目優先での仕様決定",
      "利用側のライブリージョン設計をコンポーネント内部に吸収すること"
    ],
    "constraints": [
      "タグ接頭辞は canonical の dads-* を採用",
      "label APIは @attr {string} に統一（slotを使わない）",
      "indeterminate時は aria-valuenow/min/max を付与しない",
      "CSSは transform中心（scaleX / translateX）で更新",
      "Reduced motion時は animation: none で完全停止"
    ],
    "failure_definition": "ユーザーが処理進行中を認知できない、またはName/Role/ValueやAA要件を満たせない状態"
  },
  "steps": {
    "1": {
      "outcome": "done",
      "artifacts": {
        "case_log": [
          "Figma v2.10.3でSpinner/Linear/Hourglassの3系統が独立ビルディングブロックとして定義されている",
          "既存コンポーネント（icon/divider）からtoken・define・testの再利用パターンを抽出した",
          "ARIA progressbar仕様でindeterminate時の値属性省略を確認した",
          "Codex cross-validationでA-001〜A-010の設計差分を収集した"
        ],
        "pattern_map": [
          "indeterminate = dads-spinner",
          "determinate/indeterminate linear = dads-progress-bar",
          "静的シンボル表示 = dads-loading-icon",
          "フォーカス/トークン運用 = 既存DADSコンポーネントのwithReset+token layering"
        ]
      },
      "review_ok": true
    },
    "2": {
      "outcome": "done",
      "artifacts": {
        "observations": [
          {
            "id": "O-01",
            "text": "label APIがslot/attribute混在で定義されていた"
          },
          {
            "id": "O-02",
            "text": "value/maxとARIAのスケール定義が混在していた"
          },
          {
            "id": "O-03",
            "text": "linear indeterminateにleft/widthベースの案が含まれていた"
          },
          {
            "id": "O-04",
            "text": "reduced-motionで無限アニメ継続前提の記述があった"
          },
          {
            "id": "O-05",
            "text": "loading-iconでlabel未指定時にも読み上げられるリスクがあった"
          },
          {
            "id": "O-06",
            "text": "aria-busyをコンポーネント内部に持たせる案が検討対象だった"
          }
        ],
        "evaluations": [
          {
            "id": "E-01",
            "text": "APIの一貫性欠如は利用者の誤用を増やす",
            "related_standard": [
              "WCAG 2.2 A 4.1.2"
            ]
          },
          {
            "id": "E-02",
            "text": "内部値とARIA公開値の分離規則が必要",
            "related_standard": [
              "WCAG 2.2 A 4.1.2"
            ]
          },
          {
            "id": "E-03",
            "text": "left/width更新は多インスタンス時の再レイアウトコストを増やす",
            "related_standard": [
              "品質目標: 認知負荷と体感応答"
            ]
          },
          {
            "id": "E-04",
            "text": "動きを減らしたい利用者意図に反する可能性がある",
            "related_standard": [
              "WCAG 2.2 AAA 2.3.3 (baseline+)"
            ]
          },
          {
            "id": "E-05",
            "text": "装飾アイコンの不要読み上げは情報ノイズになる",
            "related_standard": [
              "WCAG 2.2 A 4.1.2"
            ]
          },
          {
            "id": "E-06",
            "text": "aria-busyは更新領域の責務で、インジケーター単体責務から外れる",
            "related_standard": [
              "WAI-ARIA role/state ownership"
            ]
          }
        ],
        "hypotheses": [
          "H-01: labelは@attr {string}に統一し、表示とアクセシブル名を同期する",
          "H-02: 内部値は0..1、ARIAは0..100へ正規化して公開する",
          "H-03: determinate/indeterminateともtransform中心で描画する",
          "H-04: reduced-motion時は全アニメーションを停止する",
          "H-05: loading-iconはlabel未指定時aria-hidden=trueを既定にする",
          "H-06: aria-busyとstatus messageは利用側実装ガイドへ委譲する"
        ]
      }
    },
    "3": {
      "outcome": "done",
      "artifacts": {
        "state_inventory": [
          "idle",
          "default_loading_indeterminate",
          "loading_determinate",
          "success",
          "error_recoverable",
          "error_unrecoverable",
          "disabled_context"
        ],
        "pseudo_wireframe": [
          "stacked: [indicator] + [label]（中央寄せ）",
          "inlined: [indicator][label]（横並び・gap 8px）",
          "underlay=true: 128x128以上のカード上にindicator+label"
        ],
        "transition_conditions": [
          "idle -> default_loading_indeterminate: API呼び出し開始時",
          "default_loading_indeterminate -> loading_determinate: 総量が判明した時",
          "loading_determinate -> success: value >= max",
          "loading_* -> error_recoverable: 一時エラー/タイムアウト",
          "error_recoverable -> loading_*: 再試行時",
          "loading_* -> error_unrecoverable: 回復不能エラー",
          "any -> disabled_context: 親コンテナが操作不能状態"
        ]
      }
    },
    "4": {
      "outcome": "done",
      "artifacts": {
        "acceptance_criteria": [
          {
            "id": "AC-01",
            "criterion": "進捗要素がName/Role/Valueを適切に公開する",
            "related_standard": [
              "WCAG 2.2 A 4.1.2",
              "WAI-ARIA progressbar"
            ],
            "applies_to_states": [
              "default_loading_indeterminate",
              "loading_determinate"
            ]
          },
          {
            "id": "AC-02",
            "criterion": "indeterminate時に値属性を付けず、不確定進行を誤表現しない",
            "related_standard": [
              "WCAG 2.2 A 4.1.2",
              "ARIA APG Progressbar Pattern"
            ],
            "applies_to_states": [
              "default_loading_indeterminate"
            ]
          },
          {
            "id": "AC-03",
            "criterion": "indicator/trackの非テキストコントラストを維持し、forced-colorsでも判別可能にする",
            "related_standard": [
              "WCAG 2.2 AA 1.4.11"
            ],
            "applies_to_states": [
              "default_loading_indeterminate",
              "loading_determinate",
              "disabled_context"
            ]
          },
          {
            "id": "AC-04",
            "criterion": "label表示時の可読性（文字コントラスト）を維持する",
            "related_standard": [
              "WCAG 2.2 AA 1.4.3"
            ],
            "applies_to_states": [
              "default_loading_indeterminate",
              "loading_determinate",
              "error_recoverable"
            ]
          },
          {
            "id": "AC-05",
            "criterion": "動きを抑制したい利用者向けにアニメーションを停止できる",
            "related_standard": [
              "WCAG 2.2 AAA 2.3.3 (project baseline)"
            ],
            "applies_to_states": [
              "default_loading_indeterminate",
              "loading_determinate"
            ]
          },
          {
            "id": "AC-06",
            "criterion": "status message責務を利用側へ明示し、責務境界を曖昧にしない",
            "related_standard": [
              "WCAG 2.2 AA 4.1.3 (consumer side)"
            ],
            "applies_to_states": [
              "success",
              "error_recoverable",
              "error_unrecoverable"
            ]
          }
        ],
        "study_questions": [
          "Q-01: label APIはslotかattributeか",
          "Q-02: Progress Indicatorを単一部品にまとめるか、用途別に分割するか",
          "Q-03: determinate更新はwidthかtransformか",
          "Q-04: reduced-motion時に停止か緩和か",
          "Q-05: aria-busy / status messageの責務境界をどこに置くか"
        ],
        "priority_policy": [
          {
            "level": "must",
            "rule": "WCAG 2.2 AAに関わる項目（1.4.3, 1.4.11, 4.1.2）は必ず定義し、未定義が1件でも前進しない"
          },
          {
            "level": "must",
            "rule": "ARIA progressbarのindeterminate仕様（値属性省略）を崩さない"
          },
          {
            "level": "should",
            "rule": "AAA 2.3.3は加点要件として満たす"
          }
        ]
      }
    },
    "5": {
      "outcome": "done",
      "artifacts": {
        "variation_set": [
          {
            "question_id": "Q-01",
            "id": "A",
            "variant": "label slot + attr併用"
          },
          {
            "question_id": "Q-01",
            "id": "B",
            "variant": "@attr {string} labelに統一"
          },
          {
            "question_id": "Q-02",
            "id": "A",
            "variant": "単一コンポーネントでmode切替"
          },
          {
            "question_id": "Q-02",
            "id": "B",
            "variant": "spinner/progress-bar/loading-iconの3分割"
          },
          {
            "question_id": "Q-03",
            "id": "A",
            "variant": "width/leftで進捗更新"
          },
          {
            "question_id": "Q-03",
            "id": "B",
            "variant": "transform(scaleX/translateX)で進捗更新"
          },
          {
            "question_id": "Q-04",
            "id": "A",
            "variant": "reduced-motion時は緩和アニメを継続"
          },
          {
            "question_id": "Q-04",
            "id": "B",
            "variant": "reduced-motion時はanimation: noneで停止"
          },
          {
            "question_id": "Q-05",
            "id": "A",
            "variant": "コンポーネント内部でaria-busy/aria-liveを制御"
          },
          {
            "question_id": "Q-05",
            "id": "B",
            "variant": "利用側コンテナ責務としてガイド化"
          }
        ],
        "selection_log": [
          {
            "question_id": "Q-01",
            "selected": "B",
            "reason": "APIが単純化されAC-01を満たしやすい",
            "rejected": [
              {
                "id": "A",
                "reason": "利用側がlabel sourceを二重管理しやすい"
              }
            ]
          },
          {
            "question_id": "Q-02",
            "selected": "B",
            "reason": "用途ごとの責務分離でAC-01/AC-03/AC-06を同時に満たす",
            "rejected": [
              {
                "id": "A",
                "reason": "mode分岐が肥大化し、誤用時の品質低下リスクが高い"
              }
            ]
          },
          {
            "question_id": "Q-03",
            "selected": "B",
            "reason": "レンダリング負荷を抑えつつAC-01の値更新を維持できる",
            "rejected": [
              {
                "id": "A",
                "reason": "再レイアウト発生の可能性が高い"
              }
            ]
          },
          {
            "question_id": "Q-04",
            "selected": "B",
            "reason": "動き抑制ニーズを明確に満たし、認知負荷を増やさない",
            "rejected": [
              {
                "id": "A",
                "reason": "停止を望む利用者意図に反する"
              }
            ]
          },
          {
            "question_id": "Q-05",
            "selected": "B",
            "reason": "コンポーネント責務を進捗表示に限定し、AC-06に一致",
            "rejected": [
              {
                "id": "A",
                "reason": "利用文脈に依存する状態通知を部品内で適切に扱えない"
              }
            ]
          }
        ],
        "verification_log": [
          {
            "type": "keyboard",
            "result": "pass",
            "note": "非インタラクティブ要素としてフォーカス強制を持たない設計に統一"
          },
          {
            "type": "sr",
            "result": "pass",
            "note": "progressbarのname/role/value方針を確定。loading-iconはlabel未指定でaria-hidden"
          },
          {
            "type": "error_recovery",
            "result": "pass",
            "note": "error_recoverable時の表示責務を利用側へ明示（コンポーネントは進捗表示に限定）"
          },
          {
            "type": "display_condition",
            "result": "pass",
            "note": "forced-colors/reduced-motion方針を定義済み"
          }
        ]
      }
    },
    "6": {
      "outcome": "done",
      "artifacts": {
        "refined_design": [
          "A-001〜A-010の指摘を設計へ反映済み",
          "Determinate値の内部0..1 / 公開0..100の二層定義を固定",
          "Linear indeterminateをtranslateX/scaleXへ統一",
          "reduce時の完全停止・forced-colors配色を明文化"
        ],
        "tradeoff_notes": [
          "3分割により実装ファイルは増えるが、責務分離とAPI明瞭性が向上",
          "aria-busy/status messageを除外する代わりに、利用ガイドの明確化が必須",
          "画面外アニメ停止はPhase2送り（初期実装の複雑性を抑制）"
        ]
      }
    },
    "7": {
      "outcome": "done",
      "artifacts": {
        "example_case_log": [
          {
            "id": "EXR-01",
            "screen_context": "検索結果一覧ページ（自治体手続き検索）",
            "text_pattern": "「検索中...」→ 完了時に件数表示",
            "failure_or_exception_context": "API timeout時はerror_recoverableへ遷移し、再検索ボタンを利用側UIで表示"
          },
          {
            "id": "EXR-02",
            "screen_context": "複数ファイルアップロード画面",
            "text_pattern": "「ファイルをアップロードしています 45%」",
            "failure_or_exception_context": "ネットワーク断時はerror_recoverableで再試行、上限超過はerror_unrecoverable"
          },
          {
            "id": "EXR-03",
            "screen_context": "夜間バッチ申請反映状況画面",
            "text_pattern": "進行率不明区間はspinner、確定後にprogress-bar determinateへ切替",
            "failure_or_exception_context": "キュー遅延はdefault_loading_indeterminate継続で表現し、新状態追加は不要"
          }
        ]
      }
    },
    "8": {
      "outcome": "done",
      "artifacts": {
        "examples": [
          {
            "id": "EX-01",
            "name": "検索結果読み込み中（indeterminate）",
            "markup": "<div id=\"results\" aria-busy=\"true\"><dads-spinner label=\"検索中...\"></dads-spinner></div>"
          },
          {
            "id": "EX-02",
            "name": "アップロード進捗（determinate）",
            "markup": "<dads-progress-bar value=\"0.45\" max=\"1\" label=\"ファイルアップロード中\"></dads-progress-bar>"
          },
          {
            "id": "EX-03",
            "name": "静的ローディング記号（装飾利用）",
            "markup": "<dads-loading-icon size=\"sm\"></dads-loading-icon>"
          }
        ],
        "spec_feedback": [
          {
            "id": "FB-01",
            "trigger": "no_rollback_required",
            "detail": "作例3件を検証し、新状態・新導線の追加は不要。既存のstate_inventoryで網羅可能。",
            "rollback_to": null,
            "impact": []
          },
          {
            "id": "FB-02",
            "trigger": "doc_enhancement",
            "detail": "利用側ガイドに「role=statusとaria-busyの併用例」を明示すると導入時の誤用を減らせる。",
            "rollback_to": 6,
            "impact": [
              "usage_patterns",
              "handoff"
            ]
          }
        ]
      }
    },
    "9": {
      "outcome": "done",
      "artifacts": {
        "finish_checklist": [
          {
            "item": "命名規則（component/state）整合",
            "status": "pass",
            "note": "dads-spinner / dads-progress-bar / dads-loading-icon で統一"
          },
          {
            "item": "Step3状態一覧との一致",
            "status": "pass",
            "note": "idle/loading/success/error/disabledを実装計画へ反映"
          },
          {
            "item": "Step4-6判断ログの参照可能性",
            "status": "pass",
            "note": "A-001〜A-010とselection_logで追跡可能"
          },
          {
            "item": "AA必須条件の定義",
            "status": "pass",
            "note": "1.4.3, 1.4.11, 4.1.2 を acceptance_criteria に固定"
          },
          {
            "item": "主要フロー検証記録",
            "status": "pass",
            "note": "keyboard/sr/error_recovery/display_condition を verification_log 化"
          },
          {
            "item": "作例リンク・作例記述更新",
            "status": "pass",
            "note": "Step8 examples に3ケース収録"
          }
        ],
        "release_readiness": [
          {
            "item": "naming",
            "status": "pass",
            "note": "コンポーネント名・属性名が衝突回避方針に一致"
          },
          {
            "item": "state_coverage",
            "status": "pass",
            "note": "主要状態遷移が transition_conditions で定義済み"
          },
          {
            "item": "aa_definition",
            "status": "pass",
            "note": "required items defined with criteria mapping"
          },
          {
            "item": "docs_linkage",
            "status": "pass",
            "note": "design doc と task card へ双方向参照可能"
          }
        ]
      }
    },
    "10": {
      "outcome": "done",
      "artifacts": {
        "usage_patterns": [
          {
            "template_name": "search-results-loading",
            "purpose": "検索結果取得中の待機通知",
            "preconditions": [
              "結果領域コンテナを識別できる",
              "取得開始/完了イベントをUIへ反映できる"
            ],
            "required_states": [
              "default_loading_indeterminate",
              "success",
              "error_recoverable"
            ]
          },
          {
            "template_name": "file-upload-progress",
            "purpose": "アップロード進捗の割合提示",
            "preconditions": [
              "total bytes / uploaded bytes が取得できる",
              "失敗時に再試行導線を表示できる"
            ],
            "required_states": [
              "loading_determinate",
              "success",
              "error_recoverable",
              "error_unrecoverable"
            ]
          },
          {
            "template_name": "batch-job-monitor",
            "purpose": "進捗不明から進捗確定への段階表示",
            "preconditions": [
              "ジョブ開始時は総量不明を許容",
              "途中でprogress率を受け取れる"
            ],
            "required_states": [
              "default_loading_indeterminate",
              "loading_determinate",
              "success"
            ]
          }
        ],
        "replaceability_scope": [
          {
            "token_or_part": "--dads-progress-track-color / part=\"track\"",
            "replaceable": true,
            "constraints": [
              "1.4.11の非テキストコントラストを満たす",
              "forced-colors時はシステム色へ委譲"
            ]
          },
          {
            "token_or_part": "--dads-progress-indicator-color / part=\"indicator\"",
            "replaceable": true,
            "constraints": [
              "progress率の視認性を損なわない",
              "動き設定はprefers-reduced-motionを優先"
            ]
          },
          {
            "token_or_part": "labelテキスト",
            "replaceable": true,
            "constraints": [
              "処理内容が理解できる文言にする",
              "成功/失敗通知は利用側status messageで補完する"
            ]
          },
          {
            "token_or_part": "composition / underlay",
            "replaceable": true,
            "constraints": [
              "情報順序（indicator→label）を崩さない",
              "最小タッチ領域はこのコンポーネントでは要求しない（非操作要素）"
            ]
          }
        ],
        "handoff": [
          "対象: packages/components/spinner, progress-bar, loading-icon",
          "依存条件: applyDADSTokens, applySpacingTokens, withReset, TypographyWebComponent",
          "既知の制約: status message/aria-busyは利用側責務、component内部では保持しない",
          "変更時の再検証手順: npm run validate:wc -> npm run test:run -> npm run agents:verify",
          "実装順序: spinner -> progress-bar -> loading-icon -> integration",
          "利用ガイド追記: role=status + aria-busy併用サンプルをdocsに追加する"
        ]
      }
    }
  },
  "evidence_gates": [
    {
      "gate": "purpose_met",
      "passed": true,
      "reason": "Step10までの必須成果物が埋まり、設計判断から作例・引き継ぎまで一連で説明可能"
    },
    {
      "gate": "handoff_ready",
      "passed": true,
      "reason": "実装フェーズで必要な入力（状態、選定理由、検証手順、利用パターン）が揃っている"
    },
    {
      "gate": "scope_consistency",
      "passed": true,
      "reason": "status messageやaria-busy内包などexcluded項目へ逸脱していない"
    },
    {
      "gate": "no_drift",
      "passed": true,
      "reason": "写経・主観採択・品質基準欠落・作例問題隠蔽の禁止事項に該当しない"
    },
    {
      "gate": "current_explainable",
      "passed": true,
      "reason": "現状（Step10完了）・判断（A-001〜A-010反映）・次アクション（実装へ引き継ぎ）を説明可能"
    }
  ],
  "open_questions": [],
  "assumptions": [
    "DADS公式ガイドライン公開まではFigma v2.10.3を暫定規範として扱う",
    "progress indicatorは非インタラクティブであり、操作導線は利用側UIが担う",
    "aria-busy/status messageは利用側の領域コンポジションで実装する"
  ],
  "risks": [
    {
      "id": "R-01",
      "detail": "DADS公式ガイドライン公開後に仕様差分が発生する可能性",
      "mitigation": "トークンと責務境界を分離して差分吸収を容易にする"
    },
    {
      "id": "R-02",
      "detail": "jsdom単体ではSVGアニメーションの挙動検証が限定的",
      "mitigation": "contract testとvisual testを分離し、E2Eで補完する"
    },
    {
      "id": "R-03",
      "detail": "利用側でstatus messageを実装しない場合、進捗完了が十分に伝わらない",
      "mitigation": "利用ガイドにrole=statusパターンを明示する"
    }
  ]
}
```
