# ADR-003: DADS外部資料のローカル資材化フロー

## ステータス

**承認済み** (2026-01-17)

## コンテキスト

### 背景

デジタル庁デザインシステム（DADS）準拠のコンポーネントを実装するにあたり、開発中に都度Web参照（ドキュメント/Storybook/上流ソース）を行う運用では以下の問題が発生しやすい。

- 参照元の揺れ・抜け漏れ（特にアクセシビリティ要件）
- 実装根拠（画像/HTML/ソース）のレビュー共有が難しい
- AIエージェントが「ローカルで完結して確認→計画/実装」を行えない

そのため、実装前の調査とリソース取得を標準化し、ローカルに集約してgit管理する必要がある。

### 検討した選択肢

#### 選択肢1: 都度Web参照（現状維持）

**メリット**:
- 追加実装が不要
- リポジトリが肥大化しない

**デメリット**:
- 参照元の揺れ/抜け漏れが起こりやすい
- スクリーンショット等のエビデンスが残りにくい
- AIエージェントの作業が毎回ネットワーク依存になる

#### 選択肢2: URLリンク集のみをgit管理

**メリット**:
- 追加実装が最小
- リポジトリ肥大化を抑えられる

**デメリット**:
- 見た目/HTML/ソースの「スナップショット」にならず、差分確認が難しい
- 上流変更で内容が変わる（再現性が弱い）
- AIエージェントが参照しに行く必要が残る

#### 選択肢3: 外部資料をローカルにスナップショットし、git管理する【採用】

**メリット**:
- 実装根拠（テキスト/画像/HTML/上流ソース）をローカルで参照できる
- 差分確認が容易で、レビューで根拠を共有しやすい
- AIエージェントが「ローカル資材→計画/実装」を回せる

**デメリット**:
- 画像等のバイナリによりリポジトリが肥大化する
- 取得フローのメンテナンスが必要（上流の構造変更に追従）

## 決定

選択肢3「外部資料をローカルにスナップショットし、git管理する」を採用する。

## 技術的実装

### 1. 保存先（git管理）

- `resources/dads/` を DADS資材のルートとする
- コンポーネント単位で `resources/dads/components/<slug>/` を作り、`manifest.json` で取得状況を記録する

### 2. 同期コマンド（資材生成）

- `npm run dads:sync -- --component <slug> [--force]`
  - DADS公式ページ（`/dads/components/<slug>/`）のHTML/テキスト/画像/ページキャプチャを保存
  - DADS HTML版 Storybook（`/dads/html/`）は `index.json` を解析し、対象コンポーネントの docs/story を列挙して以下を保存
    - UI（`?path=/docs|story/<id>`）全体のキャプチャ
    - Canvas（`iframe.html?id=<id>`）全体のキャプチャ
    - `iframe` 内 `#storybook-root` のHTML（スニペット補助）
  - 上流 `digital-go-jp/design-system-example-components-html` は `src/components/<slug>` をスナップショット（存在しない場合は欠損として記録）
  - Figma（任意）:
    - `resources/dads/components/<slug>/figma/config.json` が存在し、かつ `FIGMA_ACCESS_TOKEN` が設定されている場合、該当 node の画像（PNG）と「利用箇所JSON（抽出）」を保存する（巨大になりがちな生の nodes JSON は保存しない）
    - 対象 node は自動探索できないため、URLは人間が渡して `dads:figma:add` で `config.json` を更新する
    - 大きい `SECTION` を指定した場合は、`dads:figma:expand` で子 `FRAME` を `config.json` に展開し、個別画像を追加取得できる
      - `npm run dads:figma:expand -- --component <slug> --from <nodeId>`

### 3. 検証コマンド（不足検知）

- `npm run dads:validate -- --component <slug>`
  - `manifest.json` と実ファイルの欠損（空ファイル含む）を検出する

### 4. 実装上の知見（運用ルール）

- DADS公式サイトはページにより `main` の検出が不安定なケースがあるため、同期処理は `main` と `#mainContents` を基準にリトライする
- `agent-browser set media ... reduced-motion` は環境により失敗し得るため、同期は致命にせず `manifest.notes` に記録して継続する
- DADS側で「提供予定」のリソース（HTML版 Storybook / GitHub 等）は取得できないため、`manifest.json` に `not_found` / `missing` として記録する（取得失敗ではなく、上流未提供として扱う）
- Figma APIはトークン必須のため、トークン未設定時は同期を失敗させず `manifest.figma.status = "skipped"` として記録する
- Figmaは node のURLが前提になるため、同期前に `dads:figma:add` で node 一覧を明示しておく
- Figmaの `SECTION` は画像が大きくなりやすいため、必要に応じて `dads:figma:expand` で子 `FRAME` を個別取得する

## 影響

### 変更対象ファイル

- `resources/dads/**`（生成物・索引・manifest）
- `scripts/dads/sync.cjs`
- `scripts/dads/validate.cjs`
- `package.json`

### 破壊的変更

- なし（ただし `resources/dads/**` の追加によりリポジトリサイズは増える）

### 移行ガイド

- 新規コンポーネント開始前に `npm run dads:sync -- --component <slug>` を実行する
- 取得結果を `resources/dads/components/<slug>/manifest.json` と画像で確認し、必要なら `--force` で再取得する

## テスト

- `npm run dads:sync -- --component file-upload --force`
- `npm run dads:validate -- --component file-upload`

## 将来の検討事項

- 画像を大量に同梱する場合の運用（Git LFS、解像度、取得範囲）
- Storybook UIの読み込み待機条件の強化（安定したキャプチャ取得）
- 取得対象の定義ファイル化（複数コンポーネントを一括同期するケース）

## 参考資料

- DADS公式: https://design.digital.go.jp/dads/
- DADS HTML版 Storybook: https://design.digital.go.jp/dads/html/
- `agent-browser`（vercel-labs/agent-browser）
- 上流（HTML版実装例）: https://github.com/digital-go-jp/design-system-example-components-html
- ローカル運用: `resources/dads/README.md`
- 取得例: `resources/dads/components/file-upload/manifest.json`

---

*作成日: 2026-01-17*
*最終更新: 2026-01-18*
