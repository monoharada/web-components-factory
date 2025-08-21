/**
 * Adaptive Card UI Test - Improved Version
 * Tests with proper TypeScript types and async handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/adaptive-card.js';
import type { AdaptiveCardElement } from './types/adaptive-card';
import { 
  createCardWithContent, 
  waitForCustomElement, 
  getShadowContent 
} from './setup-improved';
import { CardVariant } from '../src/adaptive-card.types';

describe('AdaptiveCard - UI Display Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Basic Display', () => {
    it('should display the card', async () => {
      const card = document.createElement('adaptive-card') as AdaptiveCardElement;
      container.appendChild(card);
      await waitForCustomElement(card);
      
      expect(card).toBeInTheDocument();
      expect(card.getAttribute('data-sa-component')).toBe('adaptive-card');
    });

    it('should create Shadow DOM', async () => {
      const card = document.createElement('adaptive-card') as AdaptiveCardElement;
      container.appendChild(card);
      await waitForCustomElement(card);
      
      expect(card.shadowRoot).toBeTruthy();
      expect(card.shadowRoot?.mode).toBe('open');
    });
  });

  describe('Variant Display', () => {
    it('should apply elevated style', async () => {
      const card = createCardWithContent({ variant: CardVariant.ELEVATED });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const shadowCard = getShadowContent<HTMLDivElement>(card, '.card');
      expect(shadowCard?.getAttribute('data-variant')).toBe('elevated');
      expect(card.variant).toBe(CardVariant.ELEVATED);
    });

    it('should apply outlined style', async () => {
      const card = createCardWithContent({ variant: CardVariant.OUTLINED });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const shadowCard = getShadowContent<HTMLDivElement>(card, '.card');
      expect(shadowCard?.getAttribute('data-variant')).toBe('outlined');
      expect(card.variant).toBe(CardVariant.OUTLINED);
    });

    it('should apply filled style', async () => {
      const card = createCardWithContent({ variant: CardVariant.FILLED });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const shadowCard = getShadowContent<HTMLDivElement>(card, '.card');
      expect(shadowCard?.getAttribute('data-variant')).toBe('filled');
      expect(card.variant).toBe(CardVariant.FILLED);
    });
  });

  describe('Interactive State', () => {
    it('should become clickable', async () => {
      const card = createCardWithContent({ interactive: true });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      expect(card.hasAttribute('interactive')).toBe(true);
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.interactive).toBe(true);
    });

    it('should disable interaction when disabled', async () => {
      const card = createCardWithContent({ disabled: true });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      expect(card.hasAttribute('disabled')).toBe(true);
      expect(card.disabled).toBe(true);
      const shadowCard = getShadowContent<HTMLDivElement>(card, '.card');
      expect(shadowCard?.getAttribute('data-disabled')).toBe('true');
    });

    it('should show selected state', async () => {
      const card = createCardWithContent({ selected: true });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      expect(card.hasAttribute('selected')).toBe(true);
      expect(card.selected).toBe(true);
      const shadowCard = getShadowContent<HTMLDivElement>(card, '.card');
      expect(shadowCard?.getAttribute('data-selected')).toBe('true');
    });
  });

  describe('WCAG 2.2 Accessibility Compliance', () => {
    it('should meet Level AA requirements', async () => {
      const card = createCardWithContent({
        interactive: true,
        header: 'Accessible Card',
        content: 'Card content with accessible features',
        actions: ['Primary Action', 'Secondary Action']
      });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      // Test 2.1.1 Keyboard accessibility
      expect(card.getAttribute('tabindex')).toBe('0');
      expect(card.getAttribute('role')).toBe('button');
      
      // Test 2.4.3 Focus Order - no positive tabindex
      const focusableElements = card.querySelectorAll('[tabindex], a, button, input, select, textarea');
      focusableElements.forEach((el) => {
        const tabindex = el.getAttribute('tabindex');
        if (tabindex && parseInt(tabindex) > 0) {
          fail('Positive tabindex values violate WCAG');
        }
      });
      
      // Test 4.1.2 Name, Role, Value
      expect(card.hasAttribute('role')).toBe(true);
      
      // Test focus indicator visibility
      card.focus();
      await new Promise(resolve => setTimeout(resolve, 50));
      const computedStyle = getComputedStyle(card);
      expect(computedStyle.outlineStyle).not.toBe('none');
      
      // Test keyboard interaction
      const clickHandler = vi.fn();
      card.addEventListener('card-click', clickHandler);
      
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      card.dispatchEvent(enterEvent);
      expect(clickHandler).toHaveBeenCalled();
      
      clickHandler.mockClear();
      
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      card.dispatchEvent(spaceEvent);
      expect(clickHandler).toHaveBeenCalled();
    });
    
    it('should announce state changes to screen readers', async () => {
      const card = createCardWithContent({ interactive: true });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      // Test selection announcement
      card.toggleSelection();
      await new Promise(resolve => setTimeout(resolve, 50));
      
      expect(card.selected).toBe(true);
      expect(card.getAttribute('aria-pressed') || card.getAttribute('aria-selected')).toBeTruthy();
    });
    
    it('should support high contrast mode', async () => {
      const card = createCardWithContent({ variant: CardVariant.ELEVATED });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      // Simulate high contrast mode
      const mediaQuery = '(prefers-contrast: high)';
      const matches = window.matchMedia(mediaQuery).matches;
      
      // Check that styles adapt for high contrast
      const shadowCard = getShadowContent<HTMLDivElement>(card, '.card');
      const computedStyle = shadowCard ? getComputedStyle(shadowCard) : null;
      
      if (matches && computedStyle) {
        // In high contrast mode, elevated cards should have borders
        expect(computedStyle.borderStyle).not.toBe('none');
      }
    });
  });

  describe('Performance Characteristics', () => {
    it('should use CSS containment', async () => {
      const card = createCardWithContent();
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const computedStyle = getComputedStyle(card);
      expect(computedStyle.contain).toContain('layout');
      expect(computedStyle.contain).toContain('style');
    });
    
    it('should render quickly', async () => {
      const start = performance.now();
      
      const card = createCardWithContent({
        header: 'Performance Test',
        content: 'Testing render speed',
        actions: ['Action']
      });
      container.appendChild(card);
      await waitForCustomElement(card);
      
      const end = performance.now();
      const renderTime = end - start;
      
      expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
    });
  });
});