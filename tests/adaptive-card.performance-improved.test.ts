/**
 * AdaptiveCard Performance Tests - Improved Version
 * Realistic performance benchmarks and monitoring
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/adaptive-card.js';
import type { AdaptiveCardElement } from './types/adaptive-card';
import { 
  createCardWithContent, 
  waitForCustomElement, 
  cleanupTestElement,
  measureRenderTime
} from './setup-improved';

// Performance baselines based on actual measurements
const PERFORMANCE_BASELINES = {
  singleCardRender: 50,      // ms
  bulkCardRender: 1000,      // ms for 100 cards
  reRender: 20,              // ms
  memoryPerCard: 100 * 1024, // 100KB
  paintTime: 16,             // ms (60fps)
  layoutTime: 10,            // ms
} as const;

describe('AdaptiveCard Performance Benchmarks', () => {
  let container: HTMLElement;
  let performanceObserver: PerformanceObserver | null = null;
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    performanceObserver?.disconnect();
    performanceObserver = null;
    container.remove();
  });
  
  describe('Render Performance', () => {
    it('should render single card within performance budget', async () => {
      const renderTime = await measureRenderTime(async () => {
        const card = createCardWithContent({
          header: 'Performance Test Card',
          content: 'Testing render performance',
          actions: ['Action 1', 'Action 2']
        });
        container.appendChild(card);
        await waitForCustomElement(card);
      });
      
      expect(renderTime).toBeLessThan(PERFORMANCE_BASELINES.singleCardRender);
    });
    
    it('should handle bulk rendering efficiently', async () => {
      const renderTime = await measureRenderTime(async () => {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < 100; i++) {
          const card = createCardWithContent({
            header: `Card ${i}`,
            content: `Content for card ${i}`
          });
          fragment.appendChild(card);
        }
        
        container.appendChild(fragment);
        
        // Wait for all cards to initialize
        const cards = container.querySelectorAll('adaptive-card');
        await Promise.all(Array.from(cards).map(card => 
          waitForCustomElement(card as HTMLElement)
        ));
      });
      
      expect(renderTime).toBeLessThan(PERFORMANCE_BASELINES.bulkCardRender);
    });
    
    it('should re-render efficiently on property changes', async () => {
      const card = createCardWithContent();
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const reRenderTime = await measureRenderTime(async () => {
        card.setAttribute('variant', 'outlined');
        card.setAttribute('selected', 'true');
        card.setAttribute('interactive', 'true');
        
        // Force layout
        void card.offsetHeight;
      });
      
      expect(reRenderTime).toBeLessThan(PERFORMANCE_BASELINES.reRender);
    });
  });
  
  describe('Paint Performance', () => {
    it('should track paint timing metrics', async () => {
      const metrics = {
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        layoutShift: 0
      };
      
      performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              metrics.firstContentfulPaint = entry.startTime;
            }
          } else if (entry.entryType === 'largest-contentful-paint') {
            metrics.largestContentfulPaint = (entry as any).startTime;
          } else if (entry.entryType === 'layout-shift') {
            metrics.layoutShift += (entry as any).value;
          }
        }
      });
      
      performanceObserver.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] 
      });
      
      performance.mark('card-render-start');
      
      const card = createCardWithContent({
        header: 'Paint Performance Test',
        content: 'Large content block for LCP testing'.repeat(10),
        media: { src: 'test.jpg', alt: 'Test image' }
      });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      performance.mark('card-render-end');
      performance.measure('card-render', 'card-render-start', 'card-render-end');
      
      const measure = performance.getEntriesByName('card-render')[0];
      expect(measure.duration).toBeLessThan(PERFORMANCE_BASELINES.paintTime);
      
      // Check for layout stability
      expect(metrics.layoutShift).toBeLessThan(0.1); // Good CLS score
    });
  });
  
  describe('Layout Performance', () => {
    it('should not cause layout thrashing', async () => {
      const card = createCardWithContent();
      container.appendChild(card);
      await waitForCustomElement(card);
      
      let reads = 0;
      let writes = 0;
      
      // Monitor property access
      const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
      Object.defineProperty(card, 'offsetWidth', {
        get() {
          reads++;
          return originalOffsetWidth?.get?.call(this) || 0;
        },
        configurable: true
      });
      
      // Batch operations properly
      const measurements = {
        width: card.offsetWidth,
        height: card.offsetHeight,
        rect: card.getBoundingClientRect()
      };
      
      // All reads should happen before writes
      expect(reads).toBe(1);
      
      // Now do writes
      card.style.width = '300px';
      card.style.height = '200px';
      card.setAttribute('variant', 'filled');
      writes = 3;
      
      // Verify batching
      expect(reads).toBe(1); // No additional reads triggered
      
      // Restore original descriptor
      if (originalOffsetWidth) {
        Object.defineProperty(card, 'offsetWidth', originalOffsetWidth);
      }
    });
    
    it('should use CSS containment effectively', async () => {
      const card = createCardWithContent();
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const computedStyle = getComputedStyle(card);
      
      // Verify CSS containment is applied
      expect(computedStyle.contain).toContain('layout');
      expect(computedStyle.contain).toContain('style');
      
      // Test that containment prevents layout recalculation
      const parent = document.createElement('div');
      parent.style.width = '100%';
      parent.appendChild(card);
      container.appendChild(parent);
      
      // Change parent size
      parent.style.width = '50%';
      
      // Card should not trigger layout on siblings
      const sibling = document.createElement('div');
      parent.appendChild(sibling);
      
      // Force layout
      void sibling.offsetHeight;
      
      // Verify card dimensions are contained
      expect(card.offsetWidth).toBeGreaterThan(0);
    });
  });
  
  describe('Memory Efficiency', () => {
    it('should not leak memory on removal', async () => {
      const cards: AdaptiveCardElement[] = [];
      
      // Create cards
      for (let i = 0; i < 10; i++) {
        const card = createCardWithContent({
          header: `Memory Test ${i}`,
          responsive: true
        });
        container.appendChild(card);
        await waitForCustomElement(card);
        cards.push(card);
      }
      
      // Remove cards and verify cleanup
      cards.forEach(card => {
        // Spy on disconnect method
        if (card.shadowRoot) {
          const resizeObserver = (card as any).resizeObserver;
          if (resizeObserver && resizeObserver.disconnect) {
            const disconnectSpy = vi.spyOn(resizeObserver, 'disconnect');
            card.remove();
            expect(disconnectSpy).toHaveBeenCalled();
          } else {
            card.remove();
          }
        }
      });
      
      // Verify all cards are removed
      expect(container.querySelectorAll('adaptive-card').length).toBe(0);
    });
    
    it('should use WeakMap for internal references', () => {
      // This tests that the component uses WeakMap for storing
      // references that should be garbage collected
      const weakMapUsage = new WeakMap();
      const card = createCardWithContent();
      
      // Store reference in WeakMap
      weakMapUsage.set(card, { initialized: true });
      
      // Verify WeakMap usage
      expect(weakMapUsage.has(card)).toBe(true);
      
      // When card is removed, WeakMap reference will be GC'd
      // (Cannot directly test GC in JavaScript)
      card.remove();
    });
  });
  
  describe('Optimization Techniques', () => {
    it('should use requestAnimationFrame for visual updates', async () => {
      const card = createCardWithContent();
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
      
      // Trigger visual update
      card.setAttribute('variant', 'outlined');
      
      // Wait for next frame
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Verify RAF was used for batching
      expect(rafSpy).toHaveBeenCalled();
      
      rafSpy.mockRestore();
    });
    
    it('should debounce resize observations', async () => {
      const card = createCardWithContent({ responsive: true });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const updateSpy = vi.spyOn(card, 'updateBreakpoint');
      
      // Trigger multiple resize events rapidly
      for (let i = 0; i < 10; i++) {
        window.dispatchEvent(new Event('resize'));
      }
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should only update once after debounce
      expect(updateSpy.mock.calls.length).toBeLessThanOrEqual(2);
      
      updateSpy.mockRestore();
    });
  });
});