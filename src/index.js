/**
 * デジタル庁デザインシステム アコーディオンコンポーネント
 * エントリーポイント
 */
// コンポーネントのインポートと登録
export { DadsAccordion } from './dads-accordion';
export { DadsAccordionItem } from './dads-accordion-item';
// デザイントークンのエクスポート
export * from './design-tokens';
// パフォーマンスモニターのエクスポート（オプショナル）
export { AutoPerformanceMonitor } from './performance-monitor';
// バリデーション付き属性のエクスポート（オプショナル）
export { ValidatedPropertyAttr, Validators, ErrorRecovery } from './validated-property-attr';
// グローバル登録関数
export function registerAccordionComponents() {
    // コンポーネントの自動登録
    import('./dads-accordion');
    import('./dads-accordion-item');
    console.info('デジタル庁デザインシステム アコーディオンコンポーネントを登録しました');
}
