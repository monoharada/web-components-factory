# Menu List / Menu List Box UIデザイン改善 Plan（DADS優先）

## 目標
- `dads-menu-list-box` / `dads-menu-list` / `dads-menu-list-item` の見た目を **DADS HTML上流（design-system-example-components-html）** に合わせて改善する。
- Figma作例は「証跡（overlay/diff）」として残すが、**準拠の判定は DADS を優先**する。
- description（2行）表現は **コンポーネントAPI拡張は行わず**、デモ/Docsで「推奨マークアップ」として扱う。

## 背景
- `menu-list-box` はフィデリティ検証（Playwright + overlay）が整備済みだが、現状のトークン/スタイルが DADS 上流CSSとズレている項目がある（opener/popupの余白、popupの角丸、scroll container など）。
- UI改善は「DADS準拠の数値項目（px）」を中心に詰め、Figma PNG overlay は差分の位置特定・証跡用途に留める。

## スコープ
### やること
- `dads-menu-list-box`
  - opener（sm）の padding-x を DADS 値（4px）へ
  - opener の label↔arrow 間隔を DADS 値（gapのみ = 4px）へ
  - popup を DADS 値へ寄せる（top=100%、padding=16px 0、border-color=gray-420、border-radius=8px 0 0 8、overflow-y=auto）
  - scrollbar 判定 (`data-has-popup-scrollbar`) を **実際のスクロールコンテナ**で測る（popupに寄せる）
  - `data-has-popup-scrollbar` のトークン切替（min-width/border/divider 等）をCSSに反映（デフォルトは DADS と同一でもよい）
- `e2e-evidence/menu-list-box.fidelity.spec.ts`
  - opener gap の期待値を DADS に合わせて更新
  - 必要なら popup 主要スタイル（padding/radius/border/top/overflow）を px/計算可能な形で追加ゲート化
- Docs/デモ
  - description 2行は `src/demos.ts` の推奨マークアップを維持（API変更なし）。必要なら `e2e-evidence/README.md` に明記する。

### やらないこと
- `dads-menu-list-box` の slot/属性追加などのAPI拡張（description用の slot 追加など）
- Figma作例の完全一致を合否条件にする（overlay は証跡のみ）
- 依存追加や大規模リファクタ

## 受入基準
- [ ] opener（sm）の DADS 主要値が一致（padding-x=4px、label↔arrow gap=4px）
- [ ] popup の DADS 主要値が一致（top/padding/radius/border/overflow）
- [ ] `npm run type-check` / `npm test` が通る
- [ ] `npm run dads:validate -- --component menu-list` と `menu-list-box` が通る
- [ ] `npm run test:e2e:menu-list-box` が通る（overlay は証跡として添付される）

## テスト計画
- `npm run type-check`
- `npm test`
- `npm run dads:validate -- --component menu-list`
- `npm run dads:validate -- --component menu-list-box`
- `npm run test:e2e:menu-list-box`

