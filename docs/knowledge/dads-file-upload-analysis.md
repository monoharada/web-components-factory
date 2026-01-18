# DADS コンポーネント分析: file-upload（ファイルアップロード／ドロップエリア）

## 対象

- DADS公式: ファイルアップロード／ドロップエリア
  - 概要: https://design.digital.go.jp/dads/components/file-upload/
  - 使い方: https://design.digital.go.jp/dads/components/file-upload/usage/
  - アクセシビリティ: https://design.digital.go.jp/dads/components/file-upload/accessibility/

## 取得状況（ローカル資材）

- 取得結果（manifest）: `resources/dads/components/file-upload/manifest.json`
- DADS公式ページ（キャプチャ/テキスト/画像）:
  - 概要: `resources/dads/components/file-upload/docs/overview/`
  - 使い方: `resources/dads/components/file-upload/docs/usage/`
  - アクセシビリティ: `resources/dads/components/file-upload/docs/accessibility/`
- DADS HTML版 Storybook:
  - `resources/dads/components/file-upload/storybook/entries.json` は空（該当エントリなし）
  - DADS公式の「各種リソース」上も、HTML版の GitHub/Storybook は **提供予定**（2025-12-24 更新時点）
- 上流 `design-system-example-components-html`:
  - `src/components/file-upload` が存在しないため取得なし（`resources/dads/components/file-upload/upstream/.../META.json` に記録）

## 概要（DADS記載）

- HTMLの `<input type="file">` に対応し、単体または複数ファイルを選択してアップロードできるようにするコンポーネント
- ファイルの選択はドラッグ＆ドロップでも行える
- ユースケース例:
  - フォームでファイルアップロードを受け付ける
  - ウェブアプリケーションの一覧画面でファイルを追加する

## 外観・構成（DADS「使い方」より）

### 通常時（ファイル未選択）

- 項目ラベル（必須）
- 要否ラベル
- サポートテキスト
- ファイル選択ボタン（必須）
- ファイル未選択メッセージ（必須）
- ドロップエリア（ファイル選択ボタンの後ろに「または、このエリア内にドラッグ＆ドロップ」のテキストをともなう）
  - ファイル選択ボタンとテキストの間は **少なくとも 56 CSS px** の空きを持つ
- 「ドロップ領域拡大」チェックボックス（表示する場合は必須）

### ファイル選択時 / エラー

- 選択ファイルの表示
- ファイル選択ボタンに関するエラー時は、エラーテキスト（必須）
- 選択ファイルに対するエラー表現（エラーテキストをともなう選択ファイル）

## 振る舞い（DADS「使い方」より）

### ドラッグ＆ドロップ範囲の拡大（ユーザー選択）

- ドラッグ操作に不慣れ/困難がある状況ではターゲットエリアが広いほうが使いやすい一方、見通しの阻害もありうる
- そのため本コンポーネントは、ドラッグ＆ドロップ範囲をウィンドウ全体に広げるかどうかを **ユーザーに選ばせる構造**
- 拡大を有効にした場合:
  - ファイルのドラッグ状態のカーソルがビューポートに重なると、ビューポート全体がドロップエリアとなり、促すメッセージが表示される

## アクセシビリティ（DADS「アクセシビリティ」より）

- **必ずファイル選択ボタンを配置**し、ドロップエリアのみで完結させない
  - 上肢障害、振動障害、チック症、マウス操作の困難などにより「ドラッグ操作」が難しい人がいるため
  - カスタマイズ時も「ドラッグなしのシングルポインタ」でファイル選択を完遂できること
- 参考: WCAG 2.2 達成基準 2.5.7（ドラッグ動作, AA）

## 実装に向けた論点（このリポジトリ向け）

※ DADS HTML版の実装ソース/Storybook が未提供のため、現時点では DADS公式ドキュメント記載をベースに論点を整理する。

- 要素分割方針:
  - `dads-file-upload`（ファイル選択 + ドロップエリア + 選択ファイル表示）としてまとめるか
  - ドロップエリア（オーバーレイ含む）を別コンポーネントに分けるか
- API（暫定）:
  - `multiple`（複数選択）
  - 受け付け形式（`accept` 相当）
  - 「ドロップ領域拡大」機能の提供方法（属性/内部チェックボックス/外部スロット等）
- A11y:
  - ドラッグ操作に依存しない導線（ボタン）を常に提供
  - 既存のフォーム系コンポーネント方針（`aria-live` を使わない等）との整合

## 参照用エビデンス（画像）

- 概要ページキャプチャ: `resources/dads/components/file-upload/docs/overview/screenshot.png`
- 概要のコンポーネント画像: `resources/dads/components/file-upload/docs/overview/images/file_upload_overview.png`
- 使い方ページキャプチャ: `resources/dads/components/file-upload/docs/usage/screenshot.png`
- 使い方ページ内画像: `resources/dads/components/file-upload/docs/usage/images/`
- アクセシビリティページキャプチャ: `resources/dads/components/file-upload/docs/accessibility/screenshot.png`

