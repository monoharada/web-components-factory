# 実装計画: Notification Banner コンポーネント

## 概要
- 作成日: 2026-02-07
- ステータス: Approved
- 優先度: High
- 対象: `dads-notification-banner`

## 背景と目的
DADSのノティフィケーションバナー（概要/HTML実装/Figma）を基準に、既存Web Components基盤へ規約準拠で実装する。

## ゴール
- DADS仕様の type/variant/パーツ構成を実装
- closeイベント契約と dismissible 振る舞いを実装
- 既存viewer/demos/autoload/CEM/registryの導線を整備
- `agents:verify` を通す

## 公開API（計画）
- attrs: `type`, `variant`, `dismissible`, `close-style`, `interaction`, `close-label`
- slots: `title`, `icon`, `meta`, `default`, `actions`
- parts: `base`, `header`, `icon`, `title`, `close`, `close-icon`, `close-label`, `body`, `meta`, `description`, `actions`
- event: `dads-notification-banner-close`

## 主要実装ファイル
- `packages/components/notification-banner/*`
- `packages/autoload/dads/notification-banner.ts`
- `packages/components/index.ts`
- `src/demos/showcase-components.ts`
- `viewer.html`

## 実装手順
1. コンポーネント本体/define/indexを追加
2. token/styleを2層トークン構造で追加
3. テスト追加
4. demos/viewer接続
5. CEM/registry/verify実行

## 検証コマンド
1. `npm run cem:analyze`
2. `npm run contracts:check`
3. `npm run registry:check`
4. `npm run validate:wc`
5. `npm run test:run`
6. `npm run ci`
7. `npm run agents:verify`

## 参照
- DADS: https://design.digital.go.jp/dads/components/notification-banner/
- HTML Storybook: https://design.digital.go.jp/dads/html/?path=/docs/components-%E3%83%8E%E3%83%86%E3%82%A3%E3%83%95%E3%82%A3%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%90%E3%83%8A%E3%83%BC--docs
- HTML実装: https://github.com/digital-go-jp/design-system-example-components-html/tree/main/src/components/notification-banner
- React実装: https://github.com/digital-go-jp/design-system-example-components-react/tree/main/src/components/NotificationBanner
- Figma: Digital Agency Design Data 2.10.2（提供ノード）
