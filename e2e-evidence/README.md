# E2E Evidence (Fidelity checks)

Menu List / Menu List Box / Description List の「DADS/Figma準拠度」を **実ブラウザ（Playwright）** で検証するためのテスト群です。

## 実行

- すべて実行: `npm run test:e2e`
- Menu List Box だけ: `npm run test:e2e:menu-list-box`
- List（Fidelity/VRT）だけ: `npm run test:e2e:list-fidelity`
- Description List（Storybook Fidelity）だけ: `npm run test:e2e:description-list-fidelity`

Playwright の `webServer` 設定で `bun server.ts` を起動し、`http://localhost:3000` へアクセスします。

## デモページの分離

E2E テストは **Fidelity用デモページ** を参照します。人間向けショーケースとは分離されています。

| ページ | URL | 用途 |
|--------|-----|------|
| menuListBox | `/?component=menuListBox` | 人間向けショーケース（API/CSS Variables/実務例） |
| menuListBoxFidelity | `/?component=menuListBoxFidelity` | E2E/Figma検証用（ID安定性優先） |
| listFidelity | `/?component=listFidelity` | E2E/VRT検証用（ID安定性優先） |
| descriptionListFidelity | `/?component=descriptionListFidelity` | Storybook PlaygroundとのVRT比較検証用（`maxDiffPixelRatio: 0.01`） |

**重要**: E2E テストは `menuListBoxFidelity` を参照するため、ショーケース整理時にE2Eが壊れることはありません。

## 何を検証しているか（Menu List Box）

`e2e-evidence/menu-list-box.fidelity.spec.ts` で以下を検証します。

- opener の間隔（icon↔label / label↔arrow）
- divider の inset / margin-block / reset耐性（inline margin-block）
- start-icon が混在する場合の「空アイコン枠」確保（ラベルの揃え）

失敗時（または補助情報として）以下を添付します。

- `font-diagnostics`（`font-family` / `line-height` / `fonts-loaded|fonts-error` など）
- スクリーンショット（表示位置の都合で fullPage になる場合あり）

## Figma オーバーレイ（任意）

Figma のベースラインPNGが `resources/dads/components/menu-list-box/figma/images/` に存在する場合のみ、
オーバーレイ（alpha / difference）を生成して添付します。

1) `FIGMA_ACCESS_TOKEN` を環境変数に設定  
2) `npm run dads:sync -- --component menu-list-box --force` を実行  

上記が未実施の場合、このテストは `skipped` になります。
