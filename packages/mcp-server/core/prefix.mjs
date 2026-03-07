/**
 * core/prefix.mjs — Prefix normalization, canonical tag conversion, and diagnostics.
 */

import { CANONICAL_PREFIX, MAX_PREFIX_LENGTH, CATEGORY_MAP } from './constants.mjs';

export function getCategory(tagName) {
  return CATEGORY_MAP[tagName] ?? 'Other';
}

function normalizePrefixRaw(prefix) {
  if (typeof prefix !== 'string' || prefix.trim() === '') return CANONICAL_PREFIX;
  return prefix.trim().toLowerCase();
}

export function normalizePrefix(prefix) {
  return normalizePrefixRaw(prefix).slice(0, MAX_PREFIX_LENGTH);
}

export function withPrefix(tagName, prefix) {
  if (typeof tagName !== 'string') return tagName;
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return tagName;
  const from = `${CANONICAL_PREFIX}-`;
  if (!tagName.startsWith(from)) return tagName;
  return `${p}-${tagName.slice(from.length)}`;
}

export function toCanonicalTagName(tagName, prefix) {
  if (typeof tagName !== 'string') return undefined;
  const raw = tagName.trim().toLowerCase();
  if (!raw) return undefined;
  if (raw.startsWith(`${CANONICAL_PREFIX}-`)) return raw;

  const candidates = [...new Set([normalizePrefix(prefix), normalizePrefixRaw(prefix)])];
  for (const p of candidates) {
    if (p !== CANONICAL_PREFIX && raw.startsWith(`${p}-`)) {
      return `${CANONICAL_PREFIX}-${raw.slice(p.length + 1)}`;
    }
  }

  return raw;
}

export function levenshteinDistance(left, right) {
  const a = String(left ?? '');
  const b = String(right ?? '');
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j];
  }

  return prev[b.length];
}

export function suggestUnknownElementTagName(tagName, cemIndex, prefix) {
  const target = String(tagName ?? '').trim().toLowerCase();
  if (!target || !target.includes('-')) return undefined;

  // Try prefix-prepend before Levenshtein (e.g. input-text → dads-input-text)
  if (prefix && cemIndex instanceof Map) {
    const prefixed = `${String(prefix).toLowerCase()}-${target}`;
    if (cemIndex.has(prefixed)) return prefixed;
  }

  let bestTag;
  let bestDistance = Number.POSITIVE_INFINITY;
  const candidateSource = cemIndex instanceof Map ? cemIndex.keys() : [];
  for (const rawCandidate of candidateSource) {
    const candidate = String(rawCandidate ?? '').toLowerCase();
    if (!candidate || !candidate.includes('-') || candidate === target) continue;
    const distance = levenshteinDistance(target, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestTag = candidate;
    }
  }

  if (!bestTag) return undefined;
  const maxDistance = Math.max(1, Math.ceil(target.length * 0.3));
  if (bestDistance > maxDistance) return undefined;
  return bestTag;
}

export function buildDiagnosticSuggestion({ diagnostic, cemIndex, prefix }) {
  const code = String(diagnostic?.code ?? '');
  if (!code) return undefined;

  if (code === 'unknownElement') {
    const tagName = suggestUnknownElementTagName(diagnostic?.tagName, cemIndex, prefix);
    return tagName ? `Did you mean "${tagName}"?` : undefined;
  }

  if (code === 'canonicalLowercaseRecommendation') {
    return diagnostic?.hint ?? undefined;
  }

  if (code === 'forbiddenAttribute' && String(diagnostic?.attrName ?? '').toLowerCase() === 'placeholder') {
    return 'Use aria-label or aria-describedby support text instead of placeholder.';
  }

  if (code === 'ariaLiveNotRecommended') {
    return 'Remove aria-live and connect support or error text via aria-describedby.';
  }

  if (code === 'roleAlertNotRecommended') {
    return 'Use role="alert" only for urgent live updates; otherwise use static text associated via aria-describedby.';
  }

  if (code === 'emptyLabel') {
    return diagnostic?.hint ?? 'Provide a meaningful label value for accessibility.';
  }

  if (code === 'emptyAriaLabel') {
    return diagnostic?.hint ?? 'Provide a meaningful aria-label value or use a visible <label> element.';
  }

  return undefined;
}

export function applyPrefixToTagMap(map, prefix) {
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return map;

  const out = new Map();
  for (const [tag, value] of map.entries()) {
    out.set(withPrefix(tag, p), value);
  }
  return out;
}

export function mergeWithPrefixed(canonicalMap, prefix) {
  const prefixed = applyPrefixToTagMap(canonicalMap, prefix);
  if (prefixed === canonicalMap) return canonicalMap;
  const combined = new Map(canonicalMap);
  for (const [k, v] of prefixed.entries()) combined.set(k, v);
  return combined;
}

export function applyPrefixToHtml(html, prefix) {
  const p = normalizePrefix(prefix);
  if (p === CANONICAL_PREFIX) return String(html ?? '');
  const from = `${CANONICAL_PREFIX}-`;
  const to = `${p}-`;

  return String(html ?? '').replace(
    new RegExp(`<\\s*(\\/?)\\s*${from}([a-z0-9-]+)(?=[\\s/>])`, 'gi'),
    (_m, slash, rest) => `<${slash ?? ''}${to}${String(rest).toLowerCase()}`,
  );
}
