# command-store / commandfor 運用ガイド

このドキュメントは、このリポジトリ内で `command` / `commandfor` を使って宣言的に操作連携するための実践メモです。

## 1. 前提（いまの実装）

- `dads-button` は `command` / `commandfor` を受け取れるが、実行はしません（属性を `part="base"` へ委譲するだけ）。
- 実行は `defaultCommandStore.bind(root)` で有効化されます。
- `bind(root)` された範囲内で、invoker（`[command]`）の click/keydown を拾い、`commandfor` のターゲットを解決します。
- ターゲットに `dads-command`（cancelable）を投げ、`preventDefault()` されなければ `on(command, handler)` の購読者を呼びます。

関連実装:

- `packages/components/button/button.ts`
- `packages/utils/command-store.ts`

## 2. 最小使用例（宣言的連携）

```html
<section id="dialog-scope">
  <dads-button commandfor="#sample-dialog" command="show-modal">開く</dads-button>
  <dads-dialog id="sample-dialog">
    <span slot="title">タイトル</span>
    本文
    <dads-button commandfor="#sample-dialog" command="close">閉じる</dads-button>
  </dads-dialog>
</section>

<script type="module">
  import { defaultCommandStore } from './packages/utils/command-store.js';

  const root = document.getElementById('dialog-scope');
  if (root && !root.hasAttribute('data-command-store-bound')) {
    root.setAttribute('data-command-store-bound', 'true');
    defaultCommandStore.bind(root);
  }
</script>
```

## 3. 簡易パブサブとして使う

`defaultCommandStore.on(command, handler)` を使うと、軽量な pub/sub 的運用ができます。

```ts
import { defaultCommandStore } from './packages/utils/command-store.js';

const offClear = defaultCommandStore.on('clear-recipients', (detail) => {
  const target = detail.target;
  if (!target) return;
  target.dispatchEvent(
    new CustomEvent('dads-command', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { command: 'remove-all', invoker: detail.invoker, target, value: null, originalEvent: detail.originalEvent },
    }),
  );
});

// 後始末
offClear();
```

ポイント:

- `on()` は unsubscribe 関数を返します。
- ターゲット側で `dads-command` を `preventDefault()` すると、store handler 側への伝播を止められます。

## 4. 失敗しやすい点

- `bind(root)` の `root` に invoker と target の両方が含まれていない。
- 再描画ごとに `bind()` して多重バインドする。
- `commandfor` の指定が `root` から解決できない（ID/selector のスコープ違い）。

推奨:

- `data-*-command-store-bound` フラグで多重バインドを防止する。
- 可能ならコンテナ単位で `bind(root)` し、責務を閉じる。

## 5. 改善提案（次の一手）

現状でも運用可能ですが、導入体験を上げるなら次を検討すると良いです。

- `initCommandStore(root, key)` の薄いヘルパーを追加して、bindガードの重複を削減する。
- `CommandName` の型（union）を集約して、`on()`/`command` のタイプミスを減らす。
- 公開エントリから `defaultCommandStore` を再exportし、importパスを安定化する。
