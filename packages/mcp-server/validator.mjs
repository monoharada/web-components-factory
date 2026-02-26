/**
 * Lightweight validator extracted from scripts/wc/validator-core.mjs.
 * Only includes the two functions used by the MCP server:
 *   - collectCemCustomElements
 *   - validateTextAgainstCem
 */

const GLOBAL_ATTR_ALLOW_PREFIXES = Object.freeze(['aria-', 'data-']);
const GLOBAL_ATTR_ALLOW_SET = Object.freeze(
  new Set([
    'class',
    'id',
    'style',
    'title',
    'slot',
    'part',
    'exportparts',
    'tabindex',
    'role',
    'lang',
    'dir',
    'hidden',
    'inert',
  ]),
);

const FORBIDDEN_ATTR_SET = Object.freeze(new Set(['placeholder']));
const TOKEN_MISUSE_STYLE_PROPS = Object.freeze(new Set([
  'color',
  'background-color',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
]));

function isForbiddenAttr(attrName) {
  return FORBIDDEN_ATTR_SET.has(attrName.toLowerCase());
}

function computeLineIndex(text) {
  const out = [0];
  for (let i = 0; i < text.length; i += 1) {
    if (text.charCodeAt(i) === 10) out.push(i + 1);
  }
  return out;
}

function indexToLineCol(lineStarts, index) {
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = lineStarts[mid];
    if (start === index) return { line: mid + 1, col: 1 };
    if (start < index) lo = mid + 1;
    else hi = mid - 1;
  }
  const line = Math.max(0, lo - 1);
  const col = index - lineStarts[line];
  return { line: line + 1, col: col + 1 };
}

export function collectCemCustomElements(manifest) {
  /** @type {Map<string, { attributes: Set<string> }>} */
  const byTag = new Map();

  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      const tagName = decl?.tagName;
      const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
      if (!isCustomElement || typeof tagName !== 'string' || !tagName) continue;
      const tag = tagName.toLowerCase();

      const attrs = new Set();
      const declAttrs = Array.isArray(decl?.attributes) ? decl.attributes : [];
      for (const a of declAttrs) {
        if (typeof a?.name !== 'string' || !a.name) continue;
        attrs.add(a.name.toLowerCase());
      }

      byTag.set(tag, { attributes: attrs });
    }
  }

  return byTag;
}

function shouldSkipAttr(attrName) {
  const name = attrName.toLowerCase();
  if (GLOBAL_ATTR_ALLOW_SET.has(name)) return true;
  for (const prefix of GLOBAL_ATTR_ALLOW_PREFIXES) {
    if (name.startsWith(prefix)) return true;
  }
  if (name.startsWith('on')) return true;
  return false;
}

function makeRange(lineStarts, startIndex, endIndex) {
  const start = indexToLineCol(lineStarts, startIndex);
  const end = indexToLineCol(lineStarts, endIndex);
  return { start, end };
}

function normalizeStyleValue(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseInlineStyleAttribute(attrChunk) {
  const styleMatch = /\bstyle\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrChunk);
  if (!styleMatch) return undefined;

  const quoted = styleMatch[1] ?? '';
  const styleValue = styleMatch[2] ?? styleMatch[3] ?? '';
  if (!styleValue) return undefined;

  return {
    styleValue,
    styleValueOffsetInAttr: styleMatch.index + quoted.indexOf(styleValue),
  };
}

function parseAttributeNames(rawAttrs) {
  /** @type {{ name: string, offset: number }[]} */
  const out = [];

  const len = rawAttrs.length;
  let i = 0;

  const isSpace = (code) =>
    code === 9 || code === 10 || code === 12 || code === 13 || code === 32;

  while (i < len) {
    while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;
    if (i >= len) break;

    const c = rawAttrs[i];
    if (c === '/' || c === '>') break;

    const nameStart = i;
    while (i < len) {
      const ch = rawAttrs[i];
      if (ch === '=' || ch === '>' || ch === '/' || isSpace(rawAttrs.charCodeAt(i))) break;
      i += 1;
    }

    const name = rawAttrs.slice(nameStart, i);
    if (name && !name.startsWith('${') && !name.includes('{') && !name.includes('}')) {
      out.push({ name, offset: nameStart });
    }

    while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;

    if (i < len && rawAttrs[i] === '=') {
      i += 1;
      while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;
      if (i >= len) break;

      const quote = rawAttrs[i];
      if (quote === '"' || quote === "'") {
        i += 1;
        while (i < len && rawAttrs[i] !== quote) i += 1;
        if (i < len) i += 1;
      } else {
        while (i < len) {
          const cc = rawAttrs[i];
          if (cc === '>' || cc === '/' || isSpace(rawAttrs.charCodeAt(i))) break;
          i += 1;
        }
      }
    }
  }

  return out;
}

/**
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   cem: Map<string, { attributes: Set<string> }>;
 *   severity?: { unknownElement?: string; unknownAttribute?: string };
 *   ignoreTags?: Set<string>;
 * }} params
 */
export function validateTextAgainstCem({
  filePath = '<input>',
  text,
  cem,
  severity = {},
  ignoreTags = new Set(),
}) {
  const diagnostics = [];
  const lineStarts = computeLineIndex(text);

  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;
  while ((m = tagRe.exec(text))) {
    const tag = String(m[1] ?? '').toLowerCase();

    const tagOffset = m.index + 1;
    const attrChunk = String(m[2] ?? '');

    const attrNames = parseAttributeNames(attrChunk);
    for (const { name, offset } of attrNames) {
      const attrName = name.toLowerCase();
      if (!isForbiddenAttr(attrName)) continue;

      const rawAttrsStart = m.index + 1 + tag.length;
      const startIndex = rawAttrsStart + offset;
      const endIndex = startIndex + attrName.length;
      const range = makeRange(lineStarts, startIndex, endIndex);
      diagnostics.push({
        file: filePath,
        range,
        severity: 'error',
        code: 'forbiddenAttribute',
        message: `Forbidden attribute: ${attrName} (use explicit labels/support text instead)`,
        tagName: tag,
        attrName,
      });
    }

    if (!tag.includes('-')) continue;
    if (ignoreTags.has(tag)) continue;

    const meta = cem.get(tag);
    if (!meta) {
      const range = makeRange(lineStarts, tagOffset, tagOffset + tag.length);
      diagnostics.push({
        file: filePath,
        range,
        severity: severity.unknownElement ?? 'error',
        code: 'unknownElement',
        message: `Unknown element: ${tag}`,
        tagName: tag,
      });
      continue;
    }

    for (const { name, offset } of attrNames) {
      const attrName = name.toLowerCase();
      if (isForbiddenAttr(attrName)) continue;
      if (shouldSkipAttr(attrName)) continue;
      if (meta.attributes.has(attrName)) continue;

      const rawAttrsStart = m.index + 1 + tag.length;
      const startIndex = rawAttrsStart + offset;
      const endIndex = startIndex + attrName.length;
      const range = makeRange(lineStarts, startIndex, endIndex);
      diagnostics.push({
        file: filePath,
        range,
        severity: severity.unknownAttribute ?? 'warning',
        code: 'unknownAttribute',
        message: `Unknown attribute on <${tag}>: ${attrName}`,
        tagName: tag,
        attrName,
      });
    }
  }

  return diagnostics;
}

/**
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   valueToToken?: Map<string, string>;
 *   severity?: string;
 * }} params
 */
export function detectTokenMisuseInInlineStyles({
  filePath = '<input>',
  text,
  valueToToken = new Map(),
  severity = 'warning',
}) {
  const diagnostics = [];
  if (!(valueToToken instanceof Map) || valueToToken.size === 0) return diagnostics;

  const lineStarts = computeLineIndex(text);
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  while ((m = tagRe.exec(text))) {
    const tag = String(m[1] ?? '').toLowerCase();
    const attrChunk = String(m[2] ?? '');
    const inlineStyle = parseInlineStyleAttribute(attrChunk);
    if (!inlineStyle) continue;

    const { styleValue, styleValueOffsetInAttr } = inlineStyle;
    const rawAttrsStart = m.index + 1 + tag.length;

    const declarationRe = /([a-z-]+)\s*:\s*([^;]+)/gi;
    let d;
    while ((d = declarationRe.exec(styleValue))) {
      const prop = String(d[1] ?? '').trim().toLowerCase();
      if (!TOKEN_MISUSE_STYLE_PROPS.has(prop)) continue;

      const valueRaw = String(d[2] ?? '').trim();
      if (!valueRaw || /^var\(/i.test(valueRaw)) continue;

      const normalizedValue = normalizeStyleValue(valueRaw);
      const cssVariable = valueToToken.get(normalizedValue);
      if (!cssVariable) continue;

      const valueOffsetInDecl = d[0].indexOf(d[2]);
      const valueOffsetInStyle = d.index + Math.max(0, valueOffsetInDecl);
      const startIndex = rawAttrsStart + styleValueOffsetInAttr + valueOffsetInStyle;
      const endIndex = startIndex + d[2].length;
      const range = makeRange(lineStarts, startIndex, endIndex);

      diagnostics.push({
        file: filePath,
        range,
        severity,
        code: 'tokenMisuse',
        message: `Use var(${cssVariable}) instead of ${valueRaw} for ${prop}`,
        tagName: tag,
        attrName: 'style',
        hint: `Replace ${prop}: ${valueRaw} with ${prop}: var(${cssVariable})`,
      });
    }
  }

  return diagnostics;
}
