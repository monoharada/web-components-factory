# 実装計画: DADS Tab 実装 Multi-Agent チーム設計

## 概要
- **作成日**: 2026-02-24
- **作成者**: Claude Code
- **対象**: `dads-tab` コンポーネント実装
- **前提**: `.codex/plans/2026-02-24--dads-tab-*.md`（Goal/Scope/Contract/Risk/Plan/Research/Design Study の7文書）を計画ソースとして扱う
- **先行事例**: `docs/plans/feature-20260219-combobox-implementation-multi-agent-team.md`（8エージェント構成）を踏襲・改良

## チーム設計方針

1. comboboxチーム（8名）の経験を踏まえ、タブの複雑度に合わせて **6名に最適化**
2. UX Lead と Product Designer を「デザイン意図のストーリーテラー」に統合
3. QA/Docs を各エージェントに分散
4. すべての成果物を再監査可能な文書/差分として残す
5. DADS準拠と a11y を品質ゲートの最上位に置く
6. 仕様変更はオーケストレーター承認を必須にする

## チーム構成（6エージェント + 2レーン）

| Agent | 名称 | 主責務 | 色 | モデル |
|-------|------|--------|-----|--------|
| **A0** | Orchestrator | 全体進行・品質ゲート・意思決定・最終PR | `blue` | opus |
| **A1** | Design Intent Storyteller | Codex仕様→人間理解可能な設計物語・JSDoc・ナラティブ | `purple` | sonnet |
| **A2** | Markup Expert | Shadow DOM構造・::part() API・スロット設計・最小DOM | `green` | sonnet |
| **A3** | A11y Specialist | WCAG 2.2 AA・WAI-ARIA APG Tabs Pattern・キーボードモデル | `red` | opus |
| **A4** | Component Engineer | TDD実装・TypeScript・テスト・CEM/autoload統合 | `orange` | opus |
| **A5** | CSS/Token Architect | 3層トークン・@layer構造・4方向レイアウト・reflow CSS | `cyan` | sonnet |

### エージェント定義ファイル

```
.claude/agents/
├── tab-orchestrator.md          (A0)
├── tab-design-storyteller.md    (A1)
├── tab-markup-expert.md         (A2)
├── tab-a11y-specialist.md       (A3)
├── tab-component-engineer.md    (A4)
└── tab-css-token-architect.md   (A5)
```

## 実行レーン & フェーズ

### 2レーン構成

| レーン | エージェント | 特性 |
|--------|-------------|------|
| **Core Lane**（逐次・ブロッキング） | A3 → A2 → A4 → A0 | ARIA契約→テンプレート→実装→検証 |
| **Quality Lane**（並行・アドバイザリ） | A1, A5 | ナラティブとCSS/トークンをCore Laneと並行進行 |

### フェーズ ← Codex P-xx マッピング

```
Phase 0: 基盤固定 (P-01)
├─ A0: 制約固定、Codexプラン読み込み
├─ A3: WCAG AA事前監査（component-design-study Step 0）
└─ A1: Codex契約からインタラクションナラティブ初版

Phase 1: 契約設計 (P-02, P-03)
├─ A3: 完全ARIA契約定義
├─ A2: Shadow DOMテンプレート + ::part() API設計
├─ A5: トークン構造設計
├─ A1: 各設計決定の「なぜ」を文書化
└─ Gate: 全エージェントがAPI表面に合意

Phase 2: 実装 (P-04, P-05)
├─ A4: TDD実装（テストファースト）
├─ A5: トークン・スタイル実装
├─ A2: テンプレート忠実度レビュー
└─ A4: type-check + test 継続実行

Phase 3: 品質保証 (P-06)
├─ A3: 実装に対するARIA監査
├─ A0: agents:pre-pr 実行
├─ A5: Visual/CSSレビュー
└─ A1: 設計意図の保全検証

Phase 4: 統合 & ハンドオフ (P-07)
├─ A4: CEM登録、autoloader、デモ作成
├─ A1: 最終ドキュメント・使用ナラティブ
├─ A0: agents:verify、PR作成
└─ A0: /recap で知識キャプチャ
```

## RACI

| タスク | R (実行) | A (承認) | C (相談) | I (通知) |
|--------|----------|----------|----------|----------|
| ARIA契約定義 | A3 | A0 | A2 | A1/A4/A5 |
| テンプレート設計 | A2 | A0 | A3/A5 | A1/A4 |
| インタラクションストーリー | A1 | A0 | A3 | A2/A4/A5 |
| トークン/スタイル設計 | A5 | A0 | A2 | A1/A3/A4 |
| TDD実装 | A4 | A0 | A2/A3/A5 | A1 |
| a11y監査 | A3 | A0 | A1 | A2/A4/A5 |
| テスト/CI | A4 | A0 | A3 | A1/A2/A5 |
| デモ/ドキュメント | A4+A1 | A0 | A2/A3 | A5 |
| 最終検証/PR | A0 | A0 | 全員 | 全員 |

## エージェント間 I/O 契約

### A3 → A2: ARIA契約

```json
{
  "tablist": {
    "role": "tablist",
    "aria-label or aria-labelledby": "required (at least one)",
    "aria-orientation": "horizontal|vertical"
  },
  "tab": {
    "role": "tab",
    "aria-selected": "true|false",
    "aria-controls": "panel-{id}",
    "tabindex": "0|-1"
  },
  "tabpanel": {
    "role": "tabpanel",
    "aria-labelledby": "tab-{id}",
    "hidden": "boolean"
  },
  "keyboard": {
    "horizontal": {
      "ArrowRight": "next",
      "ArrowLeft": "prev",
      "Home": "first",
      "End": "last"
    },
    "vertical": {
      "ArrowDown": "next",
      "ArrowUp": "prev"
    },
    "activation": {
      "auto": "focus→activate",
      "manual": "Enter/Space→activate"
    }
  },
  "disabled": {
    "focusable": false,
    "skipped": true,
    "aria-disabled": true
  }
}
```

### A2 → A4/A5: テンプレート & API契約

```json
{
  "parts": ["tablist", "tab", "tabpanel", "indicator"],
  "slots": ["default (パネルコンテンツ)"],
  "attributes": [
    { "name": "orientation", "type": "top|bottom|left|right", "default": "top" },
    { "name": "activation-mode", "type": "auto|manual", "default": "auto" },
    { "name": "selected-index", "type": "number", "default": "0" }
  ],
  "events": ["dads-tab-change"]
}
```

### A5 → A4: トークン契約

```json
{
  "local_api_variables": [
    "--dads-tab-background",
    "--dads-tab-color",
    "--dads-tab-indicator-color",
    "--dads-tab-indicator-height",
    "--dads-tab-border-color",
    "--dads-tab-gap"
  ],
  "style_order": [
    "applyDADSTokens()",
    "applySpacingTokens()",
    "tabTokens",
    "tabStyles",
    "applyDADSFocusStyles()"
  ]
}
```

## 品質ゲート

| # | ゲート | 判定者 | 合格条件 |
|---|--------|--------|----------|
| G1 | 仕様ゲート | A0 | ARIA契約・テンプレート・トークン設計が確定、未解決論点ゼロ |
| G2 | APIゲート | A0 | CEMに公開契約が反映（`npm run cem:analyze` 成功） |
| G3 | a11yゲート | A3 | APG Tabs Pattern必須項目全適合、BLOCKER/HIGHゼロ |
| G4 | 回帰ゲート | A4 | 既存コンポーネントへの破壊的影響なし（`npm run test:run` 全通過） |
| G5 | PRゲート | A0 | `npm run agents:verify` 成功 |

## 相互検証マトリクス

| 検証者 | 対象 | 検証方法 |
|--------|------|----------|
| A3 | A2のテンプレート | ARIAロール/状態が契約と一致するか |
| A3 | A4の実装 | WCAG SC一覧に対する監査 |
| A5 | A2の::part() | 全partにトークンマッピングがあるか |
| A5 | A4のスタイル | ハードコード値・トークン未使用を検出 |
| A2 | A4のテンプレート使用 | Shadow DOM構造が仕様と一致するか |
| A1 | A4のJSDoc | 設計意図が伝わる記述になっているか |
| A0 | 全員 | `agents:verify` + DoD チェックリスト |

## コミュニケーションプロトコル

1. **1変更1理由**: 意思決定は Decision Log で管理
2. **仕様逸脱時停止**: 仕様逸脱が必要になった時点で実装停止、A0が再Plan判断
3. **エスカレーション**: A0のみが実施
4. **ブロッカー宣言**: 任意エージェントが `status=blocked` を宣言可能、A0が解決

## Codex契約マッピング

| 契約 | 内容 | 担当Agent | Phase |
|------|------|-----------|-------|
| C-01 | APG semantics completeness | A3, A2 | 1 |
| C-02 | Single active tab | A3, A4 | 1, 2 |
| C-03 | Roving tabindex | A3, A4 | 1, 2 |
| C-04 | Activation mode behavior | A3, A4 | 1, 2 |
| C-05 | Orientation consistency | A3, A5 | 1, 2 |
| C-06 | Disabled safety | A3, A4 | 1, 2 |
| C-07 | Focus visibility | A3, A5 | 2, 3 |
| C-08 | Reflow stability | A5, A4 | 2, 3 |
| C-09 | Repository integration | A4, A0 | 4 |
| C-10 | Scope guardrail | A0 | 0-4 |

## リスクマッピング

| リスク | 内容 | 緩和担当 |
|--------|------|----------|
| R-01 (HIGH) | ARIA関連付けの破綻 | A3が契約で防止、A4がID生成を単一路線化 |
| R-02 (HIGH) | roving tabindex と selected-index の不一致 | A4がフォーカス/選択の責務を関数分離 |
| R-03 (MEDIUM) | 4方向+reflowでスタイル条件肥大化 | A5がtokens再代入中心で構築 |
| R-04 (MEDIUM) | disabled項目処理の仕様漏れ | A3が仕様定義、A4がナビ対象リストから除外 |
| R-05 (HIGH) | 生成物同期漏れ（CEM/registry/autoload） | A0がコマンド順を固定、同一PRに含める |

## Definition of Done（チーム）

- [ ] `dads-tab` が top/bottom/left/right の4方向レイアウトを実装
- [ ] auto/manual アクティベーションモードが動作
- [ ] APG Tabs Pattern のキーボードモデルが完全実装
- [ ] roving tabindex が正しく動作
- [ ] disabled タブのスキップが全経路で一貫
- [ ] reflow時もARIA関連とselected-index同期が維持
- [ ] DADSトークン3層構造が適用
- [ ] `agents:verify` 成功ログと最終ドキュメントが揃っている
- [ ] CEM登録・autoloader・デモが完備

## 参照パターン

- `packages/components/accordion/accordion.ts` — コンテナ+アイテムパターン
- `packages/components/radio/radio.ts` — ElementSelection によるroving tabindex（591-621行）
- `packages/components/menu-list-box/menu-list-box.ts` — 複雑キーボードナビゲーション
- `packages/components/carousel/carousel.ts` — tablist/tab/tabpanel と Arrow/Home/End

## 更新履歴
- 2026-02-24: 初版作成（Codexプランに基づき6エージェント構成で設計）
