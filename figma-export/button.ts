/**
 * Figma Export fixture script for dads-button.
 * window.__WCF_EXPORT_BUTTON__(stateLabel) を提供する。
 */
import { flattenElementToLightDom } from '../packages/figma-export/flatten.js';
import { postProcessForFigma } from '../packages/figma-export/figma-post-process.js';

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

  // Figma HTML-to-Design で正しく変換されないプロパティを後処理
  const processed = postProcessForFigma(flattened, stateLabel);

  // state ラベル付きラッパーで包む
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-component', 'dads-button');
  wrapper.setAttribute('data-state', stateLabel);
  wrapper.appendChild(processed);

  return wrapper.outerHTML;
};
