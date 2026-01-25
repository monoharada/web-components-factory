import path from 'node:path';

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

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function computeLineIndex(text) {
  const out = [0];
  for (let i = 0; i < text.length; i += 1) {
    if (text.charCodeAt(i) === 10 /* \n */) out.push(i + 1);
  }
  return out;
}

function indexToLineCol(lineStarts, index) {
  // Binary search for last lineStart <= index
  let lo = 0;
  let hi = lineStarts.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = lineStarts[mid];
    if (start === index) {
      return { line: mid + 1, col: 1 };
    }
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
  // Inline event handlers (onclick, oninput, ...) are out of scope for CEM validation.
  if (name.startsWith('on')) return true;
  return false;
}

function makeRange(lineStarts, startIndex, endIndex) {
  const start = indexToLineCol(lineStarts, startIndex);
  const end = indexToLineCol(lineStarts, endIndex);
  return { start, end };
}

function parseAttributeNames(rawAttrs) {
  /** @type {{ name: string, offset: number }[]} */
  const out = [];

  const len = rawAttrs.length;
  let i = 0;

  const isSpace = (code) =>
    code === 9 /* \t */ ||
    code === 10 /* \n */ ||
    code === 12 /* \f */ ||
    code === 13 /* \r */ ||
    code === 32; /* space */

  while (i < len) {
    // Skip whitespace
    while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;
    if (i >= len) break;

    const c = rawAttrs[i];
    // Self-close marker or tag end.
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

    // Skip whitespace
    while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;

    // Skip value if present
    if (i < len && rawAttrs[i] === '=') {
      i += 1; // '='
      while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;
      if (i >= len) break;

      const quote = rawAttrs[i];
      if (quote === '"' || quote === "'") {
        i += 1;
        while (i < len && rawAttrs[i] !== quote) i += 1;
        if (i < len) i += 1; // closing quote
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
  // eslint-disable-next-line no-cond-assign
  while ((m = tagRe.exec(text))) {
    const tag = String(m[1] ?? '').toLowerCase();
    if (!tag.includes('-')) continue;
    if (ignoreTags.has(tag)) continue;

    const tagOffset = m.index + 1; // after '<'
    const attrChunk = String(m[2] ?? '');

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

    const attrNames = parseAttributeNames(attrChunk);
    for (const { name, offset } of attrNames) {
      const attrName = name.toLowerCase();
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

export function isGlobLike(p) {
  return /[*?[\]{}()]/.test(p);
}

export function matchesGlob(filePath, pattern) {
  const file = filePath.split(path.sep).join('/');
  const pat = pattern.split(path.sep).join('/');

  if (!isGlobLike(pat)) return file === pat;

  // Cheap fast paths for common patterns.
  if (pat.endsWith('/**')) {
    const prefix = pat.slice(0, -3);
    return file === prefix || file.startsWith(`${prefix}/`);
  }
  if (pat.startsWith('**/')) return file.endsWith(pat.slice(3));

  // Minimal glob -> regex (supports *, **, ?).
  const reSrc =
    '^' +
    escapeRegex(pat)
      .replaceAll('\\*\\*', '§§DOUBLE_STAR§§')
      .replaceAll('\\*', '[^/]*')
      .replaceAll('\\?', '.')
      .replaceAll('§§DOUBLE_STAR§§', '.*') +
    '$';
  return new RegExp(reSrc).test(file);
}
