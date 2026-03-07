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
  if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    return data;
  }
  return undefined;
}

export function measureToolResultBytes(result) {
  return Buffer.byteLength(JSON.stringify(result), 'utf8');
}

function buildOverflowToolResponse(actualBytes, { env = process.env } = {}) {
  const payload = {
    warning: {
      code: 'TOOL_RESULT_TOO_LARGE',
      message: 'Tool result exceeded the response size limit; returning metadata only.',
      actualBytes,
      limitBytes: MAX_TOOL_RESULT_BYTES,
    },
  };
  const content = [{
    type: 'text',
    text: JSON.stringify(payload),
  }];
  if (isStructuredContentDisabled(env)) {
    return { content };
  }
  const structuredResponse = {
    content,
    structuredContent: payload,
  };
  if (measureToolResultBytes(structuredResponse) <= MAX_TOOL_RESULT_BYTES) {
    return structuredResponse;
  }
  return { content };
}

export function buildJsonToolResponse(payload, { env = process.env } = {}) {
  const prettyText = JSON.stringify(payload, null, 2);
  const compactText = JSON.stringify(payload);
  const buildContent = (text) => [{
    type: 'text',
    text,
  }];
  const prettyContent = buildContent(prettyText);
  const compactContent = buildContent(compactText);
  const structuredPayload = toStructuredContent(payload);

  if (isStructuredContentDisabled(env) || structuredPayload === undefined) {
    const prettyResponse = { content: prettyContent };
    if (measureToolResultBytes(prettyResponse) <= MAX_TOOL_RESULT_BYTES) {
      return prettyResponse;
    }
    const compactResponse = { content: compactContent };
    if (measureToolResultBytes(compactResponse) <= MAX_TOOL_RESULT_BYTES) {
      return compactResponse;
    }
    return buildOverflowToolResponse(measureToolResultBytes(compactResponse), { env });
  }

  const prettyStructuredResponse = {
    content: prettyContent,
    structuredContent: structuredPayload,
  };
  if (measureToolResultBytes(prettyStructuredResponse) <= MAX_TOOL_RESULT_BYTES) {
    return prettyStructuredResponse;
  }

  const compactStructuredResponse = {
    content: compactContent,
    structuredContent: structuredPayload,
  };
  if (measureToolResultBytes(compactStructuredResponse) <= MAX_TOOL_RESULT_BYTES) {
    return compactStructuredResponse;
  }

  const prettyTextOnlyResponse = { content: prettyContent };
  if (measureToolResultBytes(prettyTextOnlyResponse) <= MAX_TOOL_RESULT_BYTES) {
    return prettyTextOnlyResponse;
  }

  const compactTextOnlyResponse = { content: compactContent };
  if (measureToolResultBytes(compactTextOnlyResponse) <= MAX_TOOL_RESULT_BYTES) {
    return compactTextOnlyResponse;
  }

  return buildOverflowToolResponse(measureToolResultBytes(compactTextOnlyResponse), { env });
}

export function buildJsonToolErrorResponse(payload, options) {
  return {
    ...buildJsonToolResponse(payload, options),
    isError: true,
  };
}
