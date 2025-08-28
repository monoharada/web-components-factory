/**
 * アコーディオンコンポーネント用パフォーマンス自動監視システム
 */

import type { PerformanceMetrics, WebVitalsReport } from '../types/accordion';

export class AutoPerformanceMonitor {
  static #instance?: AutoPerformanceMonitor;
  #metrics = new Map<string, number[]>();
  #observers = new Map<string, PerformanceObserver>();
  #reportInterval?: number;
  #analyticsEndpoint?: string;
  #debug = false;
  
  // Web Vitals メトリクス
  #cls = 0;
  #fid = 0;
  #lcp = 0;
  #ttfb = 0;
  #inp = 0;
  
  private constructor(options?: {
    reportInterval?: number;
    analyticsEndpoint?: string;
    debug?: boolean;
  }) {
    this.#reportInterval = options?.reportInterval ?? 60000; // デフォルト1分
    this.#analyticsEndpoint = options?.analyticsEndpoint;
    this.#debug = options?.debug ?? false;
  }
  
  /**
   * シングルトンインスタンスの取得/初期化
   */
  static init(options?: {
    reportInterval?: number;
    analyticsEndpoint?: string;
    debug?: boolean;
  }): AutoPerformanceMonitor {
    if (!this.#instance) {
      this.#instance = new AutoPerformanceMonitor(options);
      this.#instance.startMonitoring();
    }
    return this.#instance;
  }
  
  /**
   * インスタンスの取得
   */
  static getInstance(): AutoPerformanceMonitor | undefined {
    return this.#instance;
  }
  
  /**
   * 監視の開始
   */
  startMonitoring(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver APIがサポートされていません');
      return;
    }
    
    this.observeCLS();
    this.observeFID();
    this.observeLCP();
    this.observeTTFB();
    this.observeINP();
    this.observeCustomMetrics();
    
    // 定期レポート開始
    if (this.#reportInterval) {
      setInterval(() => this.reportMetrics(), this.#reportInterval);
    }
    
    // ページ離脱時のレポート
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics(true);
      }
    });
    
    if (this.#debug) {
      console.log('パフォーマンス監視を開始しました');
    }
  }
  
  /**
   * CLS (Cumulative Layout Shift) の監視
   */
  private observeCLS(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('value' in entry) {
          this.#cls += (entry as any).value;
          this.recordMetric('cls', this.#cls);
        }
      }
    });
    
    try {
      observer.observe({ type: 'layout-shift', buffered: true });
      this.#observers.set('cls', observer);
    } catch (e) {
      console.warn('CLS監視の開始に失敗:', e);
    }
  }
  
  /**
   * FID (First Input Delay) の監視
   */
  private observeFID(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          this.#fid = fidEntry.processingStart - fidEntry.startTime;
          this.recordMetric('fid', this.#fid);
        }
      }
    });
    
    try {
      observer.observe({ type: 'first-input', buffered: true });
      this.#observers.set('fid', observer);
    } catch (e) {
      console.warn('FID監視の開始に失敗:', e);
    }
  }
  
  /**
   * LCP (Largest Contentful Paint) の監視
   */
  private observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.#lcp = lastEntry.startTime;
        this.recordMetric('lcp', this.#lcp);
      }
    });
    
    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.#observers.set('lcp', observer);
    } catch (e) {
      console.warn('LCP監視の開始に失敗:', e);
    }
  }
  
  /**
   * TTFB (Time to First Byte) の測定
   */
  private observeTTFB(): void {
    if (performance.timing) {
      this.#ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      this.recordMetric('ttfb', this.#ttfb);
    } else if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        this.#ttfb = navEntries[0].responseStart;
        this.recordMetric('ttfb', this.#ttfb);
      }
    }
  }
  
  /**
   * INP (Interaction to Next Paint) の監視
   */
  private observeINP(): void {
    let maxINP = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('interactionId' in entry) {
          const eventEntry = entry as PerformanceEventTiming;
          const inp = eventEntry.duration;
          if (inp > maxINP) {
            maxINP = inp;
            this.#inp = inp;
            this.recordMetric('inp', this.#inp);
          }
        }
      }
    });
    
    try {
      observer.observe({ type: 'event', buffered: true });
      this.#observers.set('inp', observer);
    } catch (e) {
      // INPは新しいAPIなのでサポートされていない可能性がある
      if (this.#debug) {
        console.info('INP監視はサポートされていません');
      }
    }
  }
  
  /**
   * カスタムメトリクスの監視（アコーディオン専用）
   */
  private observeCustomMetrics(): void {
    // アコーディオンの展開/折りたたみ時間を測定
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith('accordion-')) {
          this.recordMetric(entry.name, entry.duration);
        }
      }
    });
    
    try {
      observer.observe({ type: 'measure', buffered: false });
      this.#observers.set('custom', observer);
    } catch (e) {
      console.warn('カスタムメトリクス監視の開始に失敗:', e);
    }
  }
  
  /**
   * メトリクスの記録
   */
  private recordMetric(name: string, value: number): void {
    if (!this.#metrics.has(name)) {
      this.#metrics.set(name, []);
    }
    
    const values = this.#metrics.get(name)!;
    values.push(value);
    
    // 最新100件のみ保持（メモリ節約）
    if (values.length > 100) {
      values.shift();
    }
    
    if (this.#debug) {
      console.log(`メトリクス記録: ${name} = ${value.toFixed(2)}`);
    }
  }
  
  /**
   * アコーディオン操作のパフォーマンス測定
   */
  measureAccordionOperation(
    operationName: string,
    operation: () => void | Promise<void>
  ): void {
    const startMark = `accordion-${operationName}-start`;
    const endMark = `accordion-${operationName}-end`;
    const measureName = `accordion-${operationName}`;
    
    performance.mark(startMark);
    
    const complete = () => {
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);
      
      // マークをクリーンアップ
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
    };
    
    const result = operation();
    if (result instanceof Promise) {
      result.then(complete, complete);
    } else {
      complete();
    }
  }
  
  /**
   * 現在のメトリクスを取得
   */
  getCurrentMetrics(): WebVitalsReport {
    return {
      timestamp: Date.now(),
      cls: this.#cls,
      fid: this.#fid,
      lcp: this.#lcp,
      ttfb: this.#ttfb,
      inp: this.#inp
    };
  }
  
  /**
   * メトリクスの統計情報を取得
   */
  getStatistics(metricName: string): {
    min: number;
    max: number;
    avg: number;
    p50: number;
    p75: number;
    p95: number;
    count: number;
  } | null {
    const values = this.#metrics.get(metricName);
    if (!values || values.length === 0) {
      return null;
    }
    
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p75: sorted[Math.floor(sorted.length * 0.75)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      count: sorted.length
    };
  }
  
  /**
   * メトリクスのレポート送信
   */
  private async reportMetrics(immediate = false): Promise<void> {
    const report: WebVitalsReport & {
      statistics: Record<string, any>;
      userAgent: string;
      url: string;
      componentVersion?: string;
    } = {
      ...this.getCurrentMetrics(),
      statistics: {},
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // 各メトリクスの統計情報を追加
    for (const [name] of this.#metrics) {
      const stats = this.getStatistics(name);
      if (stats) {
        report.statistics[name] = stats;
      }
    }
    
    if (this.#debug) {
      console.table(report);
    }
    
    // Analyticsエンドポイントに送信
    if (this.#analyticsEndpoint) {
      try {
        const response = await fetch(this.#analyticsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(report),
          keepalive: immediate // ページ離脱時でも送信を完了
        });
        
        if (!response.ok && this.#debug) {
          console.warn('メトリクスレポートの送信に失敗:', response.status);
        }
      } catch (error) {
        if (this.#debug) {
          console.error('メトリクスレポートの送信エラー:', error);
        }
      }
    }
    
    // カスタムイベントの発火（他のシステムと統合用）
    window.dispatchEvent(new CustomEvent('performance-metrics-report', {
      detail: report
    }));
  }
  
  /**
   * 監視の停止
   */
  stopMonitoring(): void {
    // すべてのオブザーバーを停止
    for (const observer of this.#observers.values()) {
      observer.disconnect();
    }
    this.#observers.clear();
    
    // 最終レポートを送信
    this.reportMetrics(true);
    
    if (this.#debug) {
      console.log('パフォーマンス監視を停止しました');
    }
  }
  
  /**
   * メトリクスのリセット
   */
  reset(): void {
    this.#metrics.clear();
    this.#cls = 0;
    this.#fid = 0;
    this.#lcp = 0;
    this.#ttfb = 0;
    this.#inp = 0;
    
    if (this.#debug) {
      console.log('メトリクスをリセットしました');
    }
  }
}