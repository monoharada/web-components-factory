/**
 * Figma Export fixture script for dads-button.
 * window.__WCF_EXPORT_BUTTON__(stateLabel) を提供する。
 */
import { flattenElementToLightDom, serializeNode } from '../packages/figma-export/flatten.js';

declare global {
  interface Window {
    __WCF_EXPORT_BUTTON__: (stateLabel: string) => string;
  }
}

window.__WCF_EXPORT_BUTTON__ = (stateLabel: string): string => {
  const target = document.querySelector('#target');
  if (!target) {
    return `<!-- target element not found -->`;
  }

  const flattened = flattenElementToLightDom(target, {
    dropDisplayNone: true,
    inlineAllComputed: true,
    keepAttributes: ['aria-*', 'data-*', 'role', 'part', 'type'],
  });

  // state ラベル付きラッパーで包む
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-component', 'dads-button');
  wrapper.setAttribute('data-state', stateLabel);
  wrapper.appendChild(flattened);

  return wrapper.outerHTML;
};
