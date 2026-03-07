/**
 * core/response.mjs — Response envelope, structured content, and query helpers.
 */

import {
  STRUCTURED_CONTENT_DISABLE_FLAG,
  MAX_TOOL_RESULT_BYTES,
} from './constants.mjs';

// Single-module constants (DD-14)
const STRUCTURED_CONTENT_DISABLE_TRUE_VALUES = Object.freeze(new Set(['1', 'true', 'yes', 'on']));

// Unidirectional synonym table: key → expands to include these terms (DIG-09)
const SYNONYM_TABLE = new Map([
  ['aria-live', ['role=alert', 'aria-describedby', 'live region', 'error text']],
  ['keyboard', ['focus', 'tab', 'tabindex', 'key event', 'focus trap']],
  ['contrast', ['color', 'wcag', 'color contrast']],
  ['spacing', ['margin', 'padding', 'gap', 'spacing token', '--spacing']],
  ['skip-navigation', ['skip-link', 'landmark', 'skip nav']],
  ['heading', ['heading hierarchy', 'h1', 'heading level']],
  ['form', ['input', 'validation', 'required', 'label']],
  ['part', ['::part', 'css part', 'shadow dom styling']],
  ['layout', ['grid', 'flexbox', 'layout-shell', 'responsive', 'breakpoint']],
  ['responsive', ['media query', 'breakpoint', 'viewport', 'mobile']],
  ['error', ['validation', 'aria-invalid', 'aria-describedby', 'error text']],
  ['focus', ['focus-visible', 'focus ring', 'outline', 'tabindex', 'keyboard']],
  ['token', ['design token', 'css variable', 'custom property', 'spacing token']],
  ['div-soup', ['wrapper', 'unnecessary div', 'minimal dom']],
]);

export function expandQueryWithSynonyms(query) {
  const q = String(query ?? '').toLowerCase().trim();
  if (!q) return [q];
  const terms = [q];
  for (const [key, synonyms] of SYNONYM_TABLE) {
    if (q.includes(key)) {
      for (const syn of synonyms) {
        if (!terms.includes(syn)) terms.push(syn);
      }
    }
  }
  return terms;
}

export function isStructuredContentDisabled(env = process.env) {
  const raw = String(env?.[STRUCTURED_CONTENT_DISABLE_FLAG] ?? '').trim().toLowerCase();
  return STRUCTURED_CONTENT_DISABLE_TRUE_VALUES.has(raw);
}

export function toStructuredContent(data) {
  return {
    type: 'application/json',
    data,
  };
}

export function measureToolResultBytes(result) {
  return Buffer.byteLength(JSON.stringify(result), 'utf8');
}

export function buildJsonToolResponse(payload, { env = process.env } = {}) {
  const content = [{
    type: 'text',
    text: JSON.stringify(payload, null, 2),
  }];

  if (isStructuredContentDisabled(env)) {
    return { content };
  }

  const withStructuredContent = {
    content,
    structuredContent: toStructuredContent(payload),
  };

  // Keep response size under the 100KB guardrail even when structuredContent is enabled.
  if (measureToolResultBytes(withStructuredContent) > MAX_TOOL_RESULT_BYTES) {
    return { content };
  }

  return withStructuredContent;
}

export function buildJsonToolErrorResponse(payload, options) {
  return {
    ...buildJsonToolResponse(payload, options),
    isError: true,
  };
}
