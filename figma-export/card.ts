/**
 * Figma Export fixture script for dads-card (作例3).
 * window.__WCF_EXPORT_CARD__(stateLabel) を提供する。
 */
import { flattenElementToLightDom } from '../packages/figma-export/flatten.js';
import { postProcessForFigma, convertImagesToDataUri } from '../packages/figma-export/figma-post-process.js';
import type { FigmaState } from '../packages/figma-export/figma-post-process.js';

declare global {
  interface Window {
    __WCF_EXPORT_CARD__: (stateLabel: FigmaState) => string;
  }
}

window.__WCF_EXPORT_CARD__ = (stateLabel: FigmaState): string => {
  const target = document.querySelector('#target');
  if (!target) {
    return `<!-- target element not found -->`;
  }

  // 画像を data URI に変換（Figma が localhost URL を解決できないため）
  convertImagesToDataUri(target);

  const flattened = flattenElementToLightDom(target, {
    dropDisplayNone: true,
    inlineAllComputed: true,
    keepAttributes: ['aria-*', 'data-*', 'role', 'part', 'type', 'href', 'alt', 'src', 'width', 'height'],
  });

  // Figma HTML-to-Design で正しく変換されないプロパティを後処理
  const processed = postProcessForFigma(flattened, stateLabel);

  // state ラベル付きラッパーで包む
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-component', 'dads-card');
  wrapper.setAttribute('data-state', stateLabel);
  wrapper.appendChild(processed);

  return wrapper.outerHTML;
};
