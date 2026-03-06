/**
 * core/tokens.mjs — Design token operations: normalization, relationships, and payloads.
 */

import { levenshteinDistance } from './prefix.mjs';

// Single-module constants (DD-14)
const TOKEN_MISUSE_ALLOWED_TYPES = Object.freeze(new Set(['color', 'spacing']));
const TOKEN_THEMES = Object.freeze(new Set(['light', 'dark', 'all']));
const WCAG_LEVELS = Object.freeze(new Set(['A', 'AA', 'AAA', 'all']));

export function normalizeTokenValue(value) {
  if (typeof value === 'string') return value.trim().toLowerCase().replace(/\s+/g, ' ');
  if (typeof value === 'number') return String(value);
  return '';
}

export function normalizeCssVariable(value) {
  if (typeof value !== 'string') return '';

  const raw = value.trim();
  if (!raw) return '';
  if (raw.startsWith('--')) return raw;

  const varMatch = /^var\(\s*(--[^,\s)]+)\s*(?:,\s*[^)]+)?\)$/.exec(raw);
  if (varMatch) return varMatch[1];

  return '';
}

export function buildTokenSuggestionMap(designTokensData) {
  if (!Array.isArray(designTokensData?.tokens)) return new Map();

  const out = new Map();
  for (const token of designTokensData.tokens) {
    const type = String(token?.type ?? '').toLowerCase();
    if (!TOKEN_MISUSE_ALLOWED_TYPES.has(type)) continue;

    const cssVariable = normalizeCssVariable(token?.cssVariable);
    if (!cssVariable) continue;

    const normalized = normalizeTokenValue(token?.value);
    if (normalized && !out.has(normalized)) out.set(normalized, cssVariable);
  }
  return out;
}

export function normalizeTokenIdentifier(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (!raw) return '';
  const cssVariable = normalizeCssVariable(raw);
  if (cssVariable) return cssVariable;
  if (raw.startsWith('--')) return raw;
  return `--${raw.replace(/^[-]+/, '')}`;
}

export function resolveTokenTheme(theme) {
  const requested = String(theme ?? 'light').trim().toLowerCase() || 'light';
  if (!TOKEN_THEMES.has(requested)) {
    return {
      ok: false,
      errorCode: 'INVALID_THEME',
      message: `Unsupported theme: ${requested}. Allowed values are light, dark, all.`,
    };
  }
  if (requested !== 'light') {
    return {
      ok: false,
      errorCode: 'INVALID_THEME',
      message: `Theme "${requested}" is not available yet. Use theme="light" (NG-06).`,
    };
  }
  return {
    ok: true,
    requested,
    resolved: 'light',
    available: ['light'],
  };
}

export function extractReferencedTokenNames(value) {
  if (typeof value !== 'string') return [];
  const refs = [];
  const re = /var\(\s*(--[^,\s)]+)\s*(?:,\s*[^)]+)?\)/g;
  let match;
  while ((match = re.exec(value))) {
    const tokenName = normalizeTokenIdentifier(match[1]);
    if (tokenName) refs.push(tokenName);
  }
  return [...new Set(refs)];
}

export function buildTokenRelationshipIndex(designTokensData) {
  const byToken = {};
  const tokens = Array.isArray(designTokensData?.tokens) ? designTokensData.tokens : [];
  const fromData = designTokensData?.relationships?.byToken;
  if (fromData && typeof fromData === 'object') {
    for (const [rawName, rawRel] of Object.entries(fromData)) {
      const name = normalizeTokenIdentifier(rawName);
      if (!name) continue;
      const refs = Array.isArray(rawRel?.references)
        ? rawRel.references.map((r) => normalizeTokenIdentifier(r)).filter(Boolean)
        : [];
      const referencedBy = Array.isArray(rawRel?.referencedBy)
        ? rawRel.referencedBy.map((r) => normalizeTokenIdentifier(r)).filter(Boolean)
        : [];
      byToken[name] = {
        references: [...new Set(refs)].sort(),
        referencedBy: [...new Set(referencedBy)].sort(),
      };
    }
  }

  if (Object.keys(byToken).length > 0) {
    return { byToken };
  }

  for (const token of tokens) {
    const name = normalizeTokenIdentifier(token?.name);
    if (!name) continue;
    if (!byToken[name]) byToken[name] = { references: [], referencedBy: [] };
    const refs = extractReferencedTokenNames(token?.value);
    byToken[name].references = refs;
  }

  for (const [sourceName, relation] of Object.entries(byToken)) {
    for (const refName of relation.references) {
      if (!byToken[refName]) byToken[refName] = { references: [], referencedBy: [] };
      byToken[refName].referencedBy.push(sourceName);
    }
  }

  for (const relation of Object.values(byToken)) {
    relation.references = [...new Set(relation.references)].sort();
    relation.referencedBy = [...new Set(relation.referencedBy)].sort();
  }

  return { byToken };
}

/**
 * Extract which components reference which design tokens via var() in CEM cssProperties.
 * Returns Map<tokenName, Set<componentTagName>>.
 * DD-25: var(--token, fallback) fallback values are not extracted (known limitation).
 */
export function buildComponentTokenReferencedBy(manifest) {
  const result = new Map();
  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  const varRe = /var\((--[\w-]+)/g;
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      const tag = decl?.tagName;
      if (typeof tag !== 'string') continue;
      const cssProps = Array.isArray(decl?.cssProperties) ? decl.cssProperties : [];
      for (const prop of cssProps) {
        const defaultVal = typeof prop?.default === 'string' ? prop.default : '';
        let m;
        while ((m = varRe.exec(defaultVal)) !== null) {
          const tokenName = normalizeTokenIdentifier(m[1]);
          if (!tokenName) continue;
          if (!result.has(tokenName)) result.set(tokenName, new Set());
          result.get(tokenName).add(tag);
        }
        // Also index the css property name itself as a token → component mapping
        const propName = normalizeTokenIdentifier(prop?.name);
        if (propName) {
          if (!result.has(propName)) result.set(propName, new Set());
          result.get(propName).add(tag);
        }
      }
    }
  }
  return result;
}

function toTokenSummary(token) {
  return {
    name: String(token?.name ?? ''),
    value: String(token?.value ?? ''),
    type: String(token?.type ?? ''),
    category: String(token?.category ?? ''),
    cssVariable: String(token?.cssVariable ?? ''),
  };
}

export function suggestTokenNames(targetName, tokens, maxSuggestions = 5) {
  const target = normalizeTokenIdentifier(targetName);
  if (!target) return [];
  const allNames = [...new Set(tokens
    .map((token) => normalizeTokenIdentifier(token?.name))
    .filter(Boolean))];

  const startsWith = allNames.filter((name) => name.startsWith(target));
  if (startsWith.length >= maxSuggestions) return startsWith.slice(0, maxSuggestions);

  const includes = allNames.filter((name) => name.includes(target) && !startsWith.includes(name));
  const ranked = allNames
    .filter((name) => !startsWith.includes(name) && !includes.includes(name))
    .map((name) => ({ name, distance: levenshteinDistance(target, name) }))
    .sort((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))
    .map((entry) => entry.name);

  return [...startsWith, ...includes, ...ranked].slice(0, maxSuggestions);
}

function buildUsageExamples(token) {
  const cssVar = String(token?.cssVariable ?? '');
  const type = String(token?.type ?? '').toLowerCase();
  if (!cssVar) return [];
  if (type === 'color') {
    return [
      `.example { color: ${cssVar}; }`,
      `.example { background-color: ${cssVar}; }`,
    ];
  }
  if (type === 'spacing') {
    return [
      `.example { padding: ${cssVar}; }`,
      `.example { gap: ${cssVar}; }`,
    ];
  }
  if (type === 'typography') {
    return [
      `.example { font-size: ${cssVar}; }`,
      `.example { line-height: ${cssVar}; }`,
    ];
  }
  if (type === 'radius') {
    return [`.example { border-radius: ${cssVar}; }`];
  }
  if (type === 'shadow') {
    return [`.example { box-shadow: ${cssVar}; }`];
  }
  return [`.example { --token-value: ${cssVar}; }`];
}

function buildTokenErrorPayload(code, message, extra = {}) {
  return {
    isError: true,
    payload: {
      error: { code, message },
      ...extra,
    },
  };
}

export function buildDesignTokenDetailPayload(designTokensData, name, theme) {
  if (!Array.isArray(designTokensData?.tokens)) {
    return buildTokenErrorPayload(
      'DESIGN_TOKENS_DATA_UNAVAILABLE',
      'Design tokens data not available. Run: npm run mcp:extract-tokens',
    );
  }

  const themeInfo = resolveTokenTheme(theme);
  if (!themeInfo.ok) {
    return buildTokenErrorPayload(themeInfo.errorCode, themeInfo.message);
  }

  const normalizedName = normalizeTokenIdentifier(name);
  if (!normalizedName) {
    return buildTokenErrorPayload('INVALID_TOKEN_INPUT', 'Token name is required.');
  }

  const tokens = designTokensData.tokens;
  const token = tokens.find((item) => normalizeTokenIdentifier(item?.name) === normalizedName);
  if (!token) {
    return buildTokenErrorPayload(
      'TOKEN_NOT_FOUND',
      `Token not found: ${normalizedName}`,
      { suggestions: suggestTokenNames(normalizedName, tokens) },
    );
  }

  const relationshipIndex = buildTokenRelationshipIndex(designTokensData);
  const relation = relationshipIndex.byToken[normalizedName] ?? { references: [], referencedBy: [] };
  const tokenByName = new Map(tokens
    .map((item) => [normalizeTokenIdentifier(item?.name), item])
    .filter(([tokenName]) => tokenName));
  const references = relation.references
    .map((tokenName) => tokenByName.get(tokenName))
    .filter(Boolean)
    .map(toTokenSummary);
  const referencedBy = relation.referencedBy
    .map((tokenName) => tokenByName.get(tokenName))
    .filter(Boolean)
    .map(toTokenSummary);
  const relatedTokens = referencedBy
    .filter((item) => String(item.category).toLowerCase() === 'semantic')
    .map((item) => item.name);

  return {
    isError: false,
    payload: {
      token: {
        ...toTokenSummary(token),
        group: token?.group ?? null,
      },
      references,
      referencedBy,
      relatedTokens,
      usageExamples: buildUsageExamples(token),
      theme: {
        requested: themeInfo.requested,
        resolved: themeInfo.resolved,
        available: themeInfo.available,
      },
    },
  };
}

export function buildDesignTokensPayload(designTokensData, { type, category, query, theme } = {}) {
  if (!designTokensData) {
    return buildTokenErrorPayload(
      'DESIGN_TOKENS_DATA_UNAVAILABLE',
      'Design tokens data not available. Run: npm run mcp:extract-tokens',
    );
  }

  const themeInfo = resolveTokenTheme(theme);
  if (!themeInfo.ok) {
    return buildTokenErrorPayload(themeInfo.errorCode, themeInfo.message);
  }

  let tokens = Array.isArray(designTokensData.tokens) ? designTokensData.tokens : [];
  if (type) tokens = tokens.filter((t) => t.type === type);
  if (category) tokens = tokens.filter((t) => t.category === category);
  if (query) {
    const q = String(query).toLowerCase();
    tokens = tokens.filter((t) => String(t.name ?? '').toLowerCase().includes(q));
  }

  return {
    isError: false,
    payload: {
      total: tokens.length,
      tokens,
      summary: designTokensData.summary,
      theme: {
        requested: themeInfo.requested,
        resolved: themeInfo.resolved,
        available: themeInfo.available,
      },
    },
  };
}

export function buildTokensResourcePayload(designTokensData) {
  if (!Array.isArray(designTokensData?.tokens)) {
    return {
      isError: true,
      error: {
        code: 'DESIGN_TOKENS_DATA_UNAVAILABLE',
        message: 'Design tokens data not available. Run: npm run mcp:extract-tokens',
      },
    };
  }

  const tokens = designTokensData.tokens;
  const tokenTypes = [...new Set(tokens
    .map((token) => String(token?.type ?? '').trim())
    .filter(Boolean))].sort();
  const tokenCategories = [...new Set(tokens
    .map((token) => String(token?.category ?? '').trim())
    .filter(Boolean))].sort();

  return {
    isError: false,
    payload: {
      total: tokens.length,
      summary: designTokensData.summary ?? {},
      themes: designTokensData.themes ?? { default: 'light', available: ['light'] },
      tokenTypes,
      tokenCategories,
      sample: tokens.slice(0, 20).map(toTokenSummary),
    },
  };
}
