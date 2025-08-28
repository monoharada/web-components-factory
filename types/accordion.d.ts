/**
 * デジタル庁デザインシステム アコーディオンコンポーネント型定義
 * @version 1.0.0
 */

// ============================================================================
// 基本型定義
// ============================================================================

export type AnimationType = 'none' | 'smooth' | 'bounce' | 'custom';
export type IconPosition = 'left' | 'right';
export type ErrorLevel = 'animation' | 'interaction' | 'critical';

// ============================================================================
// アニメーション関連
// ============================================================================

export interface AnimationFunction {
  (element: HTMLElement, expanded: boolean): Animation | void;
}

export interface AnimationRegistry {
  name: string;
  function: AnimationFunction;
}

// ============================================================================
// イベント定義
// ============================================================================

export interface DadsAccordionEventMap {
  'dads-accordion-change': CustomEvent<{
    expanded: DadsAccordionItem[];
    collapsed: DadsAccordionItem[];
  }>;
  'dads-accordion-initialized': CustomEvent<{
    itemCount: number;
  }>;
}

export interface DadsAccordionItemEventMap {
  'dads-accordion-item-toggle': CustomEvent<{
    expanded: boolean;
    item: DadsAccordionItem;
  }>;
  'dads-accordion-item-before-toggle': CustomEvent<{
    expanded: boolean;
    cancelable: true;
  }>;
  'dads-accordion-item-animation-start': CustomEvent<{
    animationType: AnimationType;
  }>;
  'dads-accordion-item-animation-end': CustomEvent<{
    animationType: AnimationType;
  }>;
}

// ============================================================================
// 状態管理
// ============================================================================

export interface AccordionState {
  items: Map<string, ItemState>;
  allowMultiple: boolean;
  animationType: AnimationType;
  keyboardNavEnabled: boolean;
  focusedIndex: number;
  respectMotionPreference: boolean;
  highContrastMode: boolean;
}

export interface ItemState {
  id: string;
  expanded: boolean;
  disabled: boolean;
  height: number | 'auto';
  animating: boolean;
  focusable: boolean;
}

// ============================================================================
// パフォーマンス監視
// ============================================================================

export interface PerformanceMetrics {
  renderTime: number;
  animationFPS: number;
  memoryUsage?: number;
  interactionDelay?: number;
}

export interface WebVitalsReport {
  timestamp: number;
  cls?: number;  // Cumulative Layout Shift
  fid?: number;  // First Input Delay
  lcp?: number;  // Largest Contentful Paint
  ttfb?: number; // Time to First Byte
  inp?: number;  // Interaction to Next Paint
}

// ============================================================================
// コンポーネントインターフェース
// ============================================================================

export interface DadsAccordion extends HTMLElement {
  // 属性
  allowMultiple: boolean;
  animation: AnimationType;
  keyboardNav: boolean;
  respectMotionPreference: boolean;
  
  // メソッド
  expandAll(): void;
  collapseAll(): void;
  getExpandedItems(): DadsAccordionItem[];
  registerAnimation(name: string, fn: AnimationFunction): void;
  getPerformanceMetrics(): PerformanceMetrics;
  
  // イベントリスナー
  addEventListener<K extends keyof DadsAccordionEventMap>(
    type: K,
    listener: (ev: DadsAccordionEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof DadsAccordionEventMap>(
    type: K,
    listener: (ev: DadsAccordionEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

export interface DadsAccordionItem extends HTMLElement {
  // 属性
  expanded: boolean;
  disabled: boolean;
  iconPosition: IconPosition;
  
  // メソッド
  toggle(): void;
  expand(): void;
  collapse(): void;
  focus(): void;
  
  // イベントリスナー
  addEventListener<K extends keyof DadsAccordionItemEventMap>(
    type: K,
    listener: (ev: DadsAccordionItemEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof DadsAccordionItemEventMap>(
    type: K,
    listener: (ev: DadsAccordionItemEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

// ============================================================================
// 設定オプション
// ============================================================================

export interface AccordionOptions {
  animation?: AnimationType;
  allowMultiple?: boolean;
  keyboardNav?: boolean;
  respectMotionPreference?: boolean;
  customAnimations?: AnimationRegistry[];
  performanceMonitoring?: boolean;
  debugMode?: boolean;
}

// ============================================================================
// アクセシビリティ
// ============================================================================

export interface A11yConfig {
  announceStateChange: boolean;
  focusTrapEnabled: boolean;
  autoFocusOnExpand: boolean;
  ariaLiveRegion: 'polite' | 'assertive' | 'off';
}

// ============================================================================
// エラーハンドリング
// ============================================================================

export interface ErrorReport {
  timestamp: number;
  level: ErrorLevel;
  message: string;
  stack?: string;
  component: 'accordion' | 'accordion-item';
  context?: Record<string, unknown>;
}

// ============================================================================
// テスト用ヘルパー
// ============================================================================

export interface TestHelpers {
  simulateClick(item: DadsAccordionItem): void;
  simulateKeyPress(key: string, item?: DadsAccordionItem): void;
  getAllStates(): ItemState[];
  resetComponent(): void;
  enableDebugMode(): void;
}