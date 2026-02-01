# カード作例5 実装で得た学び（2026-01-31）

## 概要
作例5の横レイアウト・ボタン配色・見出しリンク領域調整の実装を通じて得た、カード作成時の具体的な知見をまとめる。

## レイアウト（横レイアウト時）
- `dads-card` の `layout="horizontal"` は 2カラム前提なので、3カラム（media/main/actions）にしたい場合は `::part(base)` の grid を上書きする。
- 横レイアウトのカードを 1列にまとめたい場合は、ラッパーの `ul` に `grid-template-columns: minmax(0, 1fr)` を適用し、横時だけ `max-width` を設定する。
- 横時の横幅制限は `ul`（例: `.card-example-5-list[data-layout-horizontal]`）に置くと、カード内部の幅調整と分離できる。

## 見出しリンク領域
- 見出しリンクのクリック領域を広げたい場合は、タイトル内リンクに `display: block; width: 100%;` を付与する。
- これによりテキスト以外のタイトル領域もリンクとして扱える。

## ボタン配色（DADS作例準拠）
- DADS作例5は cyan 系のプリミティブカラーを使用している。
- `dads-button` では `--dads-button-*` をスコープ限定で上書きすれば、ボタン本体を改修せずに配色を合わせられる。
- 例（作例5・cyanトーン）:
  - outlined
    - text/border: `--color-primitive-cyan-900`
    - hover text/border: `--color-primitive-cyan-1000`
    - active text/border: `--color-primitive-cyan-1100`
    - hover bg: `--color-primitive-cyan-50`
    - active bg: `--color-primitive-cyan-100`
  - solid
    - bg: `--color-primitive-cyan-900`
    - hover bg: `--color-primitive-cyan-1000`
    - active bg: `--color-primitive-cyan-1200`
    - text: `--color-primitive-white`

## VRT / TDD 観点
- 期待値（色/幅など）は CSS 変数の実値（computed）で検証できる。
- トークンは computed で実色値に展開されるため、テストは hex 値で比較する。
- 横レイアウト時のラッパー幅は `getBoundingClientRect()` で検証するのが確実。

## 参照ファイル
- 実装: `src/demos/showcase-components.ts`
- VRT: `e2e-evidence/card.example-5.vrt.spec.ts`
- DADS参考CSS: `resources/dads/components/card/upstream/design-system-example-components-html/src/components/card/card-example-5.css`
