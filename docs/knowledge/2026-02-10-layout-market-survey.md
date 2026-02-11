# 2026-02-10 レイアウト市場調査メモ

## 目的

Webサイト・業務アプリ・SaaSで頻出する画面レイアウトパターンを抽出し、
`dads-layout-shell` 系コンポーネントの初期仕様に反映する。

## 調査サマリ

- 高頻出: Header + Sidebar + Main の App Shell
- 高頻出: Sidebar のレスポンシブ切替（固定 / rail / mobileでは非表示・オーバーレイ連携）
- 中頻出: Master-Detail（二画面構成、desktopで並列・mobileで縦積み）
- 中頻出: コンテンツ主導の Website レイアウト（Hero + Section + Footer）

## v1に採用したパターン

1. Website: Hero + Section + Footer
2. App/SaaS: Header + Sidebar + Main
3. Master-Detail: Main + Aside

## 仕様反映の要点

- `pattern` 属性でパターン切替
- `mode` 属性で `auto|desktop|tablet|mobile` を選択
- `auto` は `80rem / 48rem` で `desktop / tablet / mobile` を判定
- app-shell では tablet を rail 幅で扱う
- master-detail は tablet/mobile で縦積みにフォールバック

## 参考ソース

- [Ant Design Layout](https://ant.design/components/layout/)
- [Ant Design Grid](https://ant.design/components/grid/)
- [Mantine AppShell](https://mantine.dev/core/app-shell/)
- [Carbon UI Shell Left Panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)
- [Atlassian Layout Foundations](https://atlassian.design/foundations/layout/)
- [GitLab Navigation Responsive Behavior](https://design.gitlab.com/product-foundations/navigation/responsive-behavior/)
- [Fluent 2 Nav (React)](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- [Shopify Polaris Layout](https://shopify.dev/docs/api/checkout-ui-extensions/latest/polaris-web-components/structure/layout)
- [SAP Fiori Flexible Column Layout](https://experience.sap.com/fiori-design-web/page-types-flexible-column-layout/)
- [USWDS Landing Page Template](https://designsystem.digital.gov/templates/landing-page/)
- [USWDS Page Templates](https://designsystem.digital.gov/templates/page-templates/)
- [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [Tailwind UI Sidebars](https://tailwindcss.com/plus/ui-blocks/application-ui/application-shells/sidebar)
- [Bootstrap Examples](https://getbootstrap.jp/docs/5.3/examples/)
- [Bootstrap Dashboard Example](https://getbootstrap.jp/docs/5.3/examples/dashboard/)
- [AdminLTE](https://adminlte.io/)
