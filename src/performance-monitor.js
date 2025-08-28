/**
 * アコーディオンコンポーネント用パフォーマンス自動監視システム
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _AutoPerformanceMonitor_instance, _AutoPerformanceMonitor_metrics, _AutoPerformanceMonitor_observers, _AutoPerformanceMonitor_reportInterval, _AutoPerformanceMonitor_analyticsEndpoint, _AutoPerformanceMonitor_debug, _AutoPerformanceMonitor_cls, _AutoPerformanceMonitor_fid, _AutoPerformanceMonitor_lcp, _AutoPerformanceMonitor_ttfb, _AutoPerformanceMonitor_inp;
export class AutoPerformanceMonitor {
    constructor(options) {
        _AutoPerformanceMonitor_metrics.set(this, new Map());
        _AutoPerformanceMonitor_observers.set(this, new Map());
        _AutoPerformanceMonitor_reportInterval.set(this, void 0);
        _AutoPerformanceMonitor_analyticsEndpoint.set(this, void 0);
        _AutoPerformanceMonitor_debug.set(this, false);
        // Web Vitals メトリクス
        _AutoPerformanceMonitor_cls.set(this, 0);
        _AutoPerformanceMonitor_fid.set(this, 0);
        _AutoPerformanceMonitor_lcp.set(this, 0);
        _AutoPerformanceMonitor_ttfb.set(this, 0);
        _AutoPerformanceMonitor_inp.set(this, 0);
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_reportInterval, options?.reportInterval ?? 60000, "f"); // デフォルト1分
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_analyticsEndpoint, options?.analyticsEndpoint, "f");
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_debug, options?.debug ?? false, "f");
    }
    /**
     * シングルトンインスタンスの取得/初期化
     */
    static init(options) {
        if (!__classPrivateFieldGet(this, _a, "f", _AutoPerformanceMonitor_instance)) {
            __classPrivateFieldSet(this, _a, new _a(options), "f", _AutoPerformanceMonitor_instance);
            __classPrivateFieldGet(this, _a, "f", _AutoPerformanceMonitor_instance).startMonitoring();
        }
        return __classPrivateFieldGet(this, _a, "f", _AutoPerformanceMonitor_instance);
    }
    /**
     * インスタンスの取得
     */
    static getInstance() {
        return __classPrivateFieldGet(this, _a, "f", _AutoPerformanceMonitor_instance);
    }
    /**
     * 監視の開始
     */
    startMonitoring() {
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
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_reportInterval, "f")) {
            setInterval(() => this.reportMetrics(), __classPrivateFieldGet(this, _AutoPerformanceMonitor_reportInterval, "f"));
        }
        // ページ離脱時のレポート
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.reportMetrics(true);
            }
        });
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
            console.log('パフォーマンス監視を開始しました');
        }
    }
    /**
     * CLS (Cumulative Layout Shift) の監視
     */
    observeCLS() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if ('value' in entry) {
                    __classPrivateFieldSet(this, _AutoPerformanceMonitor_cls, __classPrivateFieldGet(this, _AutoPerformanceMonitor_cls, "f") + entry.value, "f");
                    this.recordMetric('cls', __classPrivateFieldGet(this, _AutoPerformanceMonitor_cls, "f"));
                }
            }
        });
        try {
            observer.observe({ type: 'layout-shift', buffered: true });
            __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").set('cls', observer);
        }
        catch (e) {
            console.warn('CLS監視の開始に失敗:', e);
        }
    }
    /**
     * FID (First Input Delay) の監視
     */
    observeFID() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'first-input') {
                    const fidEntry = entry;
                    __classPrivateFieldSet(this, _AutoPerformanceMonitor_fid, fidEntry.processingStart - fidEntry.startTime, "f");
                    this.recordMetric('fid', __classPrivateFieldGet(this, _AutoPerformanceMonitor_fid, "f"));
                }
            }
        });
        try {
            observer.observe({ type: 'first-input', buffered: true });
            __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").set('fid', observer);
        }
        catch (e) {
            console.warn('FID監視の開始に失敗:', e);
        }
    }
    /**
     * LCP (Largest Contentful Paint) の監視
     */
    observeLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
                __classPrivateFieldSet(this, _AutoPerformanceMonitor_lcp, lastEntry.startTime, "f");
                this.recordMetric('lcp', __classPrivateFieldGet(this, _AutoPerformanceMonitor_lcp, "f"));
            }
        });
        try {
            observer.observe({ type: 'largest-contentful-paint', buffered: true });
            __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").set('lcp', observer);
        }
        catch (e) {
            console.warn('LCP監視の開始に失敗:', e);
        }
    }
    /**
     * TTFB (Time to First Byte) の測定
     */
    observeTTFB() {
        if (performance.timing) {
            __classPrivateFieldSet(this, _AutoPerformanceMonitor_ttfb, performance.timing.responseStart - performance.timing.navigationStart, "f");
            this.recordMetric('ttfb', __classPrivateFieldGet(this, _AutoPerformanceMonitor_ttfb, "f"));
        }
        else if (performance.getEntriesByType) {
            const navEntries = performance.getEntriesByType('navigation');
            if (navEntries.length > 0) {
                __classPrivateFieldSet(this, _AutoPerformanceMonitor_ttfb, navEntries[0].responseStart, "f");
                this.recordMetric('ttfb', __classPrivateFieldGet(this, _AutoPerformanceMonitor_ttfb, "f"));
            }
        }
    }
    /**
     * INP (Interaction to Next Paint) の監視
     */
    observeINP() {
        let maxINP = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if ('interactionId' in entry) {
                    const eventEntry = entry;
                    const inp = eventEntry.duration;
                    if (inp > maxINP) {
                        maxINP = inp;
                        __classPrivateFieldSet(this, _AutoPerformanceMonitor_inp, inp, "f");
                        this.recordMetric('inp', __classPrivateFieldGet(this, _AutoPerformanceMonitor_inp, "f"));
                    }
                }
            }
        });
        try {
            observer.observe({ type: 'event', buffered: true });
            __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").set('inp', observer);
        }
        catch (e) {
            // INPは新しいAPIなのでサポートされていない可能性がある
            if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
                console.info('INP監視はサポートされていません');
            }
        }
    }
    /**
     * カスタムメトリクスの監視（アコーディオン専用）
     */
    observeCustomMetrics() {
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
            __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").set('custom', observer);
        }
        catch (e) {
            console.warn('カスタムメトリクス監視の開始に失敗:', e);
        }
    }
    /**
     * メトリクスの記録
     */
    recordMetric(name, value) {
        if (!__classPrivateFieldGet(this, _AutoPerformanceMonitor_metrics, "f").has(name)) {
            __classPrivateFieldGet(this, _AutoPerformanceMonitor_metrics, "f").set(name, []);
        }
        const values = __classPrivateFieldGet(this, _AutoPerformanceMonitor_metrics, "f").get(name);
        values.push(value);
        // 最新100件のみ保持（メモリ節約）
        if (values.length > 100) {
            values.shift();
        }
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
            console.log(`メトリクス記録: ${name} = ${value.toFixed(2)}`);
        }
    }
    /**
     * アコーディオン操作のパフォーマンス測定
     */
    measureAccordionOperation(operationName, operation) {
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
        }
        else {
            complete();
        }
    }
    /**
     * 現在のメトリクスを取得
     */
    getCurrentMetrics() {
        return {
            timestamp: Date.now(),
            cls: __classPrivateFieldGet(this, _AutoPerformanceMonitor_cls, "f"),
            fid: __classPrivateFieldGet(this, _AutoPerformanceMonitor_fid, "f"),
            lcp: __classPrivateFieldGet(this, _AutoPerformanceMonitor_lcp, "f"),
            ttfb: __classPrivateFieldGet(this, _AutoPerformanceMonitor_ttfb, "f"),
            inp: __classPrivateFieldGet(this, _AutoPerformanceMonitor_inp, "f")
        };
    }
    /**
     * メトリクスの統計情報を取得
     */
    getStatistics(metricName) {
        const values = __classPrivateFieldGet(this, _AutoPerformanceMonitor_metrics, "f").get(metricName);
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
    async reportMetrics(immediate = false) {
        const report = {
            ...this.getCurrentMetrics(),
            statistics: {},
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        // 各メトリクスの統計情報を追加
        for (const [name] of __classPrivateFieldGet(this, _AutoPerformanceMonitor_metrics, "f")) {
            const stats = this.getStatistics(name);
            if (stats) {
                report.statistics[name] = stats;
            }
        }
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
            console.table(report);
        }
        // Analyticsエンドポイントに送信
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_analyticsEndpoint, "f")) {
            try {
                const response = await fetch(__classPrivateFieldGet(this, _AutoPerformanceMonitor_analyticsEndpoint, "f"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(report),
                    keepalive: immediate // ページ離脱時でも送信を完了
                });
                if (!response.ok && __classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
                    console.warn('メトリクスレポートの送信に失敗:', response.status);
                }
            }
            catch (error) {
                if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
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
    stopMonitoring() {
        // すべてのオブザーバーを停止
        for (const observer of __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").values()) {
            observer.disconnect();
        }
        __classPrivateFieldGet(this, _AutoPerformanceMonitor_observers, "f").clear();
        // 最終レポートを送信
        this.reportMetrics(true);
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
            console.log('パフォーマンス監視を停止しました');
        }
    }
    /**
     * メトリクスのリセット
     */
    reset() {
        __classPrivateFieldGet(this, _AutoPerformanceMonitor_metrics, "f").clear();
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_cls, 0, "f");
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_fid, 0, "f");
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_lcp, 0, "f");
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_ttfb, 0, "f");
        __classPrivateFieldSet(this, _AutoPerformanceMonitor_inp, 0, "f");
        if (__classPrivateFieldGet(this, _AutoPerformanceMonitor_debug, "f")) {
            console.log('メトリクスをリセットしました');
        }
    }
}
_a = AutoPerformanceMonitor, _AutoPerformanceMonitor_metrics = new WeakMap(), _AutoPerformanceMonitor_observers = new WeakMap(), _AutoPerformanceMonitor_reportInterval = new WeakMap(), _AutoPerformanceMonitor_analyticsEndpoint = new WeakMap(), _AutoPerformanceMonitor_debug = new WeakMap(), _AutoPerformanceMonitor_cls = new WeakMap(), _AutoPerformanceMonitor_fid = new WeakMap(), _AutoPerformanceMonitor_lcp = new WeakMap(), _AutoPerformanceMonitor_ttfb = new WeakMap(), _AutoPerformanceMonitor_inp = new WeakMap();
_AutoPerformanceMonitor_instance = { value: void 0 };
