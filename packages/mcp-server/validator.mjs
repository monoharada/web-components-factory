/**
 * Lightweight validator extracted from scripts/wc/validator-core.mjs.
 * Only includes the two functions used by the MCP server:
 *   - collectCemCustomElements
 *   - validateTextAgainstCem
 *   - detectTokenMisuseInInlineStyles
 *   - detectAccessibilityMisuseInMarkup
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

function maskTextPreserveNewlines(fragment) {
  return String(fragment).replace(/[^\n\r]/g, ' ');
}

function sanitizeMarkupForValidation(text) {
  let out = String(text ?? '');
  const patterns = [
    /^---[\s\S]*?\n---/m, // Astro/frontmatter blocks
    /<!--[\s\S]*?-->/g,
    /<script\b[\s\S]*?<\/script>/gi,
    /<style\b[\s\S]*?<\/style>/gi,
    /{%\s*comment\s*%}[\s\S]*?{%\s*endcomment\s*%}/gi,
    /{{!--[\s\S]*?--}}/g,
    /{#[\s\S]*?#}/g,
    /<%[\s\S]*?%>/g,
    /<\?[\s\S]*?\?>/g,
  ];
  for (const pattern of patterns) {
    out = out.replace(pattern, (match) => maskTextPreserveNewlines(match));
  }
  return out;
}

function isTemplateValue(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return false;
  return (
    raw.includes('{{') ||
    raw.includes('{%') ||
    raw.includes('<%') ||
    raw.includes('<?') ||
    raw.includes('${') ||
    (/^\{[\s\S]*\}$/.test(raw))
  );
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

/**
 * Parse a CEM type.text union like "'solid' | 'outlined' | 'text'" into a Set of valid values.
 * Only handles string literal unions. Returns undefined for non-enum types.
 * @param {string} typeText
 * @returns {Set<string> | undefined}
 */
function parseEnumTypeText(typeText) {
  if (typeof typeText !== 'string' || !typeText) return undefined;
  // Must contain at least one single-quoted value
  const literals = typeText.match(/'([^']*)'/g);
  if (!literals || literals.length === 0) return undefined;
  // All parts separated by | must be quoted literals (allow whitespace)
  const parts = typeText.split('|').map((s) => s.trim());
  for (const part of parts) {
    if (!/^'[^']*'$/.test(part)) return undefined;
  }
  const values = new Set();
  for (const lit of literals) {
    values.add(lit.slice(1, -1));
  }
  return values.size > 0 ? values : undefined;
}

/**
 * Build a map of enum attributes from the CEM manifest.
 * Returns Map<tagName, Map<attrName, Set<validValues>>>
 * @param {object} manifest
 * @returns {Map<string, Map<string, Set<string>>>}
 */
export function buildEnumAttributeMap(manifest) {
  const result = new Map();

  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      const tagName = decl?.tagName;
      const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
      if (!isCustomElement || typeof tagName !== 'string' || !tagName) continue;
      const tag = tagName.toLowerCase();

      const attrEnums = new Map();
      const declAttrs = Array.isArray(decl?.attributes) ? decl.attributes : [];
      for (const a of declAttrs) {
        if (typeof a?.name !== 'string' || !a.name) continue;
        const typeText = a?.type?.text;
        const enumValues = parseEnumTypeText(typeText);
        if (enumValues) {
          attrEnums.set(a.name.toLowerCase(), enumValues);
        }
      }

      if (attrEnums.size > 0) {
        result.set(tag, attrEnums);
      }
    }
  }

  return result;
}

/**
 * Detect enum value misuse in HTML markup.
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   enumMap: Map<string, Map<string, Set<string>>>;
 *   severity?: string;
 * }} params
 */
export function detectEnumValueMisuse({
  filePath = '<input>',
  text,
  enumMap,
  severity = 'error',
}) {
  const diagnostics = [];
  if (!(enumMap instanceof Map) || enumMap.size === 0) return diagnostics;

  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();
    if (!tag.includes('-')) continue;

    const attrEnums = enumMap.get(tag);
    if (!attrEnums) continue;

    const attrChunk = String(m[2] ?? '');
    const rawAttrsStart = m.index + 1 + tag.length;
    const attrs = parseAttributes(attrChunk);

    for (const { name, offset, value } of attrs) {
      const attrName = name.toLowerCase();
      const validValues = attrEnums.get(attrName);
      if (!validValues) continue;

      // Skip empty values (boolean-style attributes)
      if (value === undefined || value.trim() === '' || isTemplateValue(value)) continue;

      if (!validValues.has(value)) {
        const startIndex = rawAttrsStart + offset;
        const endIndex = startIndex + name.length;
        const range = makeRange(lineStarts, startIndex, endIndex);
        const validList = [...validValues].map((v) => `'${v}'`).join(' | ');
        diagnostics.push({
          file: filePath,
          range,
          severity,
          code: 'invalidEnumValue',
          message: `Invalid value "${value}" for attribute "${attrName}" on <${tag}>. Valid values: ${validList}`,
          tagName: tag,
          attrName,
          hint: `Use one of: ${validList}`,
        });
      }
    }
  }

  return diagnostics;
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
  return parseAttributes(rawAttrs).map(({ name, offset }) => ({ name, offset }));
}

function readBalancedBraces(text, startIndex) {
  let index = startIndex;
  let depth = 0;
  let quote = null;

  while (index < text.length) {
    const ch = text[index];
    if (quote) {
      if (ch === '\\') {
        index += 2;
        continue;
      }
      if (ch === quote) quote = null;
      index += 1;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      index += 1;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      index += 1;
      if (depth === 0) break;
      continue;
    }

    index += 1;
  }

  return index;
}

function parseAttributes(rawAttrs) {
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
    if (c === '{') {
      i = readBalancedBraces(rawAttrs, i);
      continue;
    }

    const nameStart = i;
    while (i < len) {
      const ch = rawAttrs[i];
      if (ch === '=' || ch === '>' || ch === '/' || ch === '{' || isSpace(rawAttrs.charCodeAt(i))) break;
      i += 1;
    }

    const name = rawAttrs.slice(nameStart, i);
    let value = '';

    while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;

    if (i < len && rawAttrs[i] === '=') {
      i += 1;
      while (i < len && isSpace(rawAttrs.charCodeAt(i))) i += 1;
      if (i >= len) break;

      const quote = rawAttrs[i];
      if (quote === '"' || quote === "'") {
        i += 1;
        const valueStart = i;
        while (i < len && rawAttrs[i] !== quote) i += 1;
        value = rawAttrs.slice(valueStart, i);
        if (i < len) i += 1;
      } else if (quote === '{') {
        const valueStart = i;
        i = readBalancedBraces(rawAttrs, i);
        value = rawAttrs.slice(valueStart, i);
      } else {
        const valueStart = i;
        while (i < len) {
          const cc = rawAttrs[i];
          if (cc === '>' || cc === '/' || isSpace(rawAttrs.charCodeAt(i))) break;
          i += 1;
        }
        value = rawAttrs.slice(valueStart, i);
      }
    }

    if (name && !name.startsWith('${') && !name.includes('{') && !name.includes('}')) {
      out.push({ name, offset: nameStart, value });
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
  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);

  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;
  while ((m = tagRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();

    const tagOffset = m.index + 1;
    const attrChunk = String(m[2] ?? '');
    const rawAttrsStart = m.index + 1 + tag.length;

    const attrNames = parseAttributeNames(attrChunk);
    for (const { name, offset } of attrNames) {
      const attrName = name.toLowerCase();
      if (!isForbiddenAttr(attrName)) continue;

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

  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
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
      if (!valueRaw || /^var\(/i.test(valueRaw) || isTemplateValue(valueRaw)) continue;

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

/**
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   severity?: string;
 *   cemTagNames?: Set<string>;
 * }} params
 */
export function detectAccessibilityMisuseInMarkup({
  filePath = '<input>',
  text,
  severity = 'warning',
  cemTagNames,
}) {
  const diagnostics = [];
  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();
    const attrChunk = String(m[2] ?? '');
    const rawAttrsStart = m.index + 1 + tag.length;

    const attrNames = parseAttributeNames(attrChunk);
    for (const { name, offset } of attrNames) {
      const attrName = String(name ?? '').toLowerCase();
      if (attrName !== 'aria-live') continue;

      const startIndex = rawAttrsStart + offset;
      const endIndex = startIndex + attrName.length;
      const range = makeRange(lineStarts, startIndex, endIndex);
      diagnostics.push({
        file: filePath,
        range,
        severity,
        code: 'ariaLiveNotRecommended',
        message: 'Avoid aria-live in component markup; use static text with aria-describedby instead.',
        tagName: tag,
        attrName: 'aria-live',
        hint: 'Remove aria-live and connect error/support text via aria-describedby.',
      });
    }

    const parsedAttrs = parseAttributes(attrChunk);

    const roleAttr = parsedAttrs.find(({ name }) => String(name ?? '').toLowerCase() === 'role');
    const roleValue = String(roleAttr?.value ?? '').trim().toLowerCase();
    if (roleAttr && roleValue === 'alert') {
      const attrName = 'role';
      const roleOffsetInChunk = roleAttr.offset;
      const startIndex = rawAttrsStart + roleOffsetInChunk;
      const endIndex = startIndex + attrName.length;
      const range = makeRange(lineStarts, startIndex, endIndex);
      diagnostics.push({
        file: filePath,
        range,
        severity,
        code: 'roleAlertNotRecommended',
        message: 'Avoid role=\"alert\" in component markup; prefer static error text and aria-describedby.',
        tagName: tag,
        attrName,
        hint: 'Replace role=\"alert\" with non-live text associated to the control.',
      });
    }

    // Empty label / aria-label detection (v0.4.0, DD-26)
    // Only check CEM-registered custom elements to avoid false positives on third-party elements
    const isCemElement = cemTagNames ? cemTagNames.has(tag) : tag.includes('-');
    if (isCemElement) {
      const EMPTY_LABEL_CHECKS = [
        { attr: 'label', code: 'emptyLabel', hint: 'Set label to a descriptive text, e.g. label="氏名".', msg: (t) => `Empty label attribute on <${t}>. Provide a meaningful label for accessibility.` },
        { attr: 'aria-label', code: 'emptyAriaLabel', hint: 'Set aria-label to descriptive text or use a visible <label> element instead.', msg: (t) => `Empty aria-label attribute on <${t}>. Provide a meaningful label for accessibility.` },
      ];
      for (const { name, offset, value } of parsedAttrs) {
        const attrLower = String(name ?? '').toLowerCase();
        if (typeof value !== 'string' || value.trim() !== '' || isTemplateValue(value)) continue;
        const check = EMPTY_LABEL_CHECKS.find((c) => c.attr === attrLower);
        if (!check) continue;
        const startIndex = rawAttrsStart + offset;
        const endIndex = startIndex + name.length;
        const range = makeRange(lineStarts, startIndex, endIndex);
        diagnostics.push({
          file: filePath,
          range,
          severity,
          code: check.code,
          message: check.msg(tag),
          tagName: tag,
          attrName: check.attr,
          hint: check.hint,
        });
      }
    }
  }

  return diagnostics;
}

/**
 * Build a map of slot names per component from the CEM manifest.
 * Returns Map<tagName, Set<validSlotNames>>
 * @param {object} manifest
 * @returns {Map<string, Set<string>>}
 */
export function buildSlotNameMap(manifest) {
  const result = new Map();

  const modules = Array.isArray(manifest?.modules) ? manifest.modules : [];
  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      const tagName = decl?.tagName;
      const isCustomElement = decl?.customElement === true || decl?.kind === 'custom-element';
      if (!isCustomElement || typeof tagName !== 'string' || !tagName) continue;
      const tag = tagName.toLowerCase();

      const slotNames = new Set();
      const declSlots = Array.isArray(decl?.slots) ? decl.slots : [];
      for (const s of declSlots) {
        if (typeof s?.name !== 'string') continue;
        slotNames.add(s.name);
      }

      if (slotNames.size > 0) {
        result.set(tag, slotNames);
      }
    }
  }

  return result;
}

/**
 * Detect invalid slot names in HTML markup.
 * Checks if `slot="name"` values match any known slot across the design system.
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   slotMap: Map<string, Set<string>>;
 *   severity?: string;
 * }} params
 */
export function detectInvalidSlotName({
  filePath = '<input>',
  text,
  slotMap,
  severity = 'error',
}) {
  const diagnostics = [];
  if (!(slotMap instanceof Map) || slotMap.size === 0) return diagnostics;

  const sourceText = sanitizeMarkupForValidation(text);
  const globalSlotNames = new Set();
  for (const slotNames of slotMap.values()) {
    for (const name of slotNames) globalSlotNames.add(name);
  }

  const lineStarts = computeLineIndex(sourceText);
  const stack = [];
  const tagRe = /<\/?([a-z][a-z0-9-]*)\b([^<>]*?)\/?>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
    const fullMatch = String(m[0] ?? '');
    const tag = String(m[1] ?? '').toLowerCase();
    const attrChunk = String(m[2] ?? '');
    const isClosing = fullMatch.startsWith('</');
    const isSelfClosing = fullMatch.endsWith('/>');
    const rawAttrsStart = m.index + 1 + tag.length;

    if (isClosing) {
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index] === tag) {
          stack.splice(index, 1);
          break;
        }
      }
      continue;
    }

    const attrs = parseAttributes(attrChunk);
    const nearestComponentParent = [...stack].reverse().find((item) => slotMap.has(item));

    for (const { name, offset, value } of attrs) {
      const attrName = name.toLowerCase();
      if (attrName !== 'slot') continue;
      if (value === undefined || value.trim() === '' || isTemplateValue(value)) continue;
      if (value === 'default') continue;

      const startIndex = rawAttrsStart + offset;
      const endIndex = startIndex + name.length;
      const range = makeRange(lineStarts, startIndex, endIndex);

      if (nearestComponentParent) {
        const allowedSlots = slotMap.get(nearestComponentParent) ?? new Set();
        if (!allowedSlots.has(value)) {
          diagnostics.push({
            file: filePath,
            range,
            severity,
            code: 'invalidSlotName',
            message: `Unknown slot name "${value}" for parent <${nearestComponentParent}>.`,
            tagName: tag,
            attrName: 'slot',
            hint: `Check <${nearestComponentParent}> for available slot names.`,
          });
        }
        continue;
      }

      if (!globalSlotNames.has(value)) {
        diagnostics.push({
          file: filePath,
          range,
          severity,
          code: 'invalidSlotName',
          message: `Unknown slot name "${value}". No component in the design system defines this slot.`,
          tagName: tag,
          attrName: 'slot',
          hint: `Check the parent component's API for available slot names.`,
        });
      }
    }

    if (!isSelfClosing && !HTML_VOID_ELEMENTS.has(tag) && tag.includes('-')) {
      stack.push(tag);
    }
  }

  return diagnostics;
}

/**
 * Parent-child constraints: child → expected parent.
 * If a child tag appears without its parent wrapping it, emit a warning.
 */
const PARENT_CHILD_CONSTRAINTS = new Map([
  ['dads-accordion-item-details', 'dads-accordion-details'],
  ['dads-breadcrumb-item', 'dads-breadcrumb'],
  ['dads-list-item', 'dads-list'],
  ['dads-step-navigation-item', 'dads-step-navigation'],
  ['dads-global-menu-item', 'dads-global-menu'],
  ['dads-menu-list-item', 'dads-menu-list'],
]);

/**
 * HTML void elements that never have a closing tag.
 */
const HTML_VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr',
]);

/**
 * Detect orphaned child components (child appears without expected parent).
 * Uses a lightweight tag-stack approach: only prefix-matching tags (e.g. dads-*)
 * are tracked on the stack; all other HTML elements are ignored.
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   prefix?: string;
 *   severity?: string;
 * }} params
 */
export function detectOrphanedChildComponents({
  filePath = '<input>',
  text,
  prefix = 'dads',
  severity = 'warning',
}) {
  const diagnostics = [];
  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const p = prefix.toLowerCase();
  const canonicalPrefix = 'dads';

  // Build prefix-aware constraint map (child → parent)
  const constraints = new Map();
  for (const [child, parent] of PARENT_CHILD_CONSTRAINTS.entries()) {
    const mappedChild = p !== canonicalPrefix ? child.replace(canonicalPrefix, p) : child;
    const mappedParent = p !== canonicalPrefix ? parent.replace(canonicalPrefix, p) : parent;
    constraints.set(mappedChild, mappedParent);
  }

  const prefixDash = `${p}-`;
  // Stack of currently open prefix-matching tags
  const stack = [];

  // Regex matches opening tags, closing tags, and self-closing tags
  const tagRe = /<\/?([a-z][a-z0-9-]*)\b[^<>]*?\/?>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
    const fullMatch = m[0];
    const tag = String(m[1] ?? '').toLowerCase();
    const isClosing = fullMatch.startsWith('</');
    const isSelfClosing = fullMatch.endsWith('/>');

    // Only track prefix-matching tags on the stack
    if (!tag.startsWith(prefixDash)) continue;

    if (isClosing) {
      // Pop the matching opening tag from the stack (search from top)
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i] === tag) {
          stack.splice(i, 1);
          break;
        }
      }
      continue;
    }

    // Check if this is a child that needs a parent
    const expectedParent = constraints.get(tag);
    if (expectedParent) {
      const hasParent = stack.includes(expectedParent);
      if (!hasParent) {
        const tagOffset = m.index + 1;
        const range = makeRange(lineStarts, tagOffset, tagOffset + tag.length);
        diagnostics.push({
          file: filePath,
          range,
          severity,
          code: 'orphanedChildComponent',
          message: `<${tag}> should be a child of <${expectedParent}>.`,
          tagName: tag,
          hint: `Wrap <${tag}> inside <${expectedParent}>...</${expectedParent}>.`,
        });
      }
    }

    // Push opening tag to stack (skip void elements and self-closing)
    if (!isSelfClosing && !HTML_VOID_ELEMENTS.has(tag)) {
      stack.push(tag);
    }
  }

  return diagnostics;
}

/**
 * Interactive elements that should have content (text or slotted content).
 */
const INTERACTIVE_ELEMENTS = new Set([
  'dads-button',
]);

/**
 * Detect empty interactive elements (e.g., button with no text content).
 * Severity: warning (DIG-04).
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   prefix?: string;
 *   severity?: string;
 * }} params
 */
export function detectEmptyInteractiveElement({
  filePath = '<input>',
  text,
  prefix = 'dads',
  severity = 'warning',
}) {
  const diagnostics = [];
  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const p = prefix.toLowerCase();
  const canonicalPrefix = 'dads';

  const elements = new Set();
  for (const el of INTERACTIVE_ELEMENTS) {
    elements.add(p !== canonicalPrefix ? el.replace(canonicalPrefix, p) : el);
  }

  // Match self-closing tags: <dads-button ... />
  const selfClosingRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)\/>/gi;
  let m;

  while ((m = selfClosingRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();
    if (!elements.has(tag)) continue;

    // Check if aria-label is present
    const attrChunk = String(m[2] ?? '');
    const attrs = parseAttributes(attrChunk);
    const hasAriaLabel = attrs.some(({ name }) => name.toLowerCase() === 'aria-label');
    if (hasAriaLabel) continue;

    const tagOffset = m.index + 1;
    const range = makeRange(lineStarts, tagOffset, tagOffset + tag.length);
    diagnostics.push({
      file: filePath,
      range,
      severity,
      code: 'emptyInteractiveElement',
      message: `<${tag}> appears empty. Add text content or aria-label for accessibility.`,
      tagName: tag,
      hint: `Add visible text or aria-label="..." to <${tag}>.`,
    });
  }

  // Match open+close with no content: <dads-button ...></dads-button>
  for (const tag of elements) {
    const emptyRe = new RegExp(`<(${tag})\\b([^<>]*?)>\\s*</${tag}>`, 'gi');
    let em;
    while ((em = emptyRe.exec(sourceText))) {
      const matchedTag = String(em[1] ?? '').toLowerCase();
      const attrChunk = String(em[2] ?? '');
      const attrs = parseAttributes(attrChunk);
      const hasAriaLabel = attrs.some(({ name }) => name.toLowerCase() === 'aria-label');
      if (hasAriaLabel) continue;

      const tagOffset = em.index + 1;
      const range = makeRange(lineStarts, tagOffset, tagOffset + matchedTag.length);
      diagnostics.push({
        file: filePath,
        range,
        severity,
        code: 'emptyInteractiveElement',
        message: `<${matchedTag}> appears empty. Add text content or aria-label for accessibility.`,
        tagName: matchedTag,
        hint: `Add visible text or aria-label="..." to <${matchedTag}>.`,
      });
    }
  }

  return diagnostics;
}

/**
 * Required attributes per form component (DIG-08).
 * Both `label` and `name` are required for components that declare them in CEM.
 * Note: dads-date-picker and dads-file-upload use slots for labels, not attributes.
 */
const REQUIRED_ATTRIBUTES = new Map([
  ['dads-input-text', ['label', 'name']],
  ['dads-textarea', ['label', 'name']],
  ['dads-select', ['label', 'name']],
  ['dads-checkbox', ['label', 'name']],
  ['dads-radio', ['label', 'name']],
  ['dads-combobox', ['label', 'name']],
]);

/**
 * Detect missing required attributes on form elements.
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   prefix?: string;
 *   severity?: string;
 * }} params
 */
export function detectMissingRequiredAttributes({
  filePath = '<input>',
  text,
  prefix = 'dads',
  severity = 'error',
}) {
  const diagnostics = [];
  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  // Build prefix-aware required map
  const requiredMap = new Map();
  for (const [tag, attrs] of REQUIRED_ATTRIBUTES.entries()) {
    const p = prefix.toLowerCase();
    const canonicalPrefix = 'dads';
    const mappedTag = p !== canonicalPrefix ? tag.replace(canonicalPrefix, p) : tag;
    requiredMap.set(mappedTag, attrs);
  }

  while ((m = tagRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();
    const requiredAttrs = requiredMap.get(tag);
    if (!requiredAttrs) continue;

    const attrChunk = String(m[2] ?? '');
    const attrs = parseAttributes(attrChunk);
    const presentAttrs = new Set(attrs.map(({ name }) => name.toLowerCase()));

    for (const required of requiredAttrs) {
      if (!presentAttrs.has(required)) {
        const tagOffset = m.index + 1;
        const range = makeRange(lineStarts, tagOffset, tagOffset + tag.length);
        diagnostics.push({
          file: filePath,
          range,
          severity,
          code: 'missingRequiredAttribute',
          message: `<${tag}> requires attribute "${required}" for accessibility.`,
          tagName: tag,
          attrName: required,
          hint: `Add ${required}="..." to <${tag}>.`,
        });
      }
    }
  }

  return diagnostics;
}

/**
 * Detect duplicate id attributes within a single markup document.
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   severity?: string;
 * }} params
 */
export function detectDuplicateIdsInMarkup({
  filePath = '<input>',
  text,
  severity = 'error',
}) {
  const diagnostics = [];
  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const seen = new Map();
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();
    const attrChunk = String(m[2] ?? '');
    const rawAttrsStart = m.index + 1 + tag.length;
    const attrs = parseAttributes(attrChunk);
    const idAttr = attrs.find(({ name }) => String(name ?? '').toLowerCase() === 'id');
    const idValue = String(idAttr?.value ?? '').trim();
    if (!idAttr || idValue === '' || isTemplateValue(idValue)) continue;

    const startIndex = rawAttrsStart + idAttr.offset;
    const endIndex = startIndex + idAttr.name.length;
    const range = makeRange(lineStarts, startIndex, endIndex);
    const previous = seen.get(idValue);
    if (previous) {
      diagnostics.push({
        file: filePath,
        range,
        severity,
        code: 'duplicateId',
        message: `Duplicate id "${idValue}" found. IDs must be unique within a document.`,
        tagName: tag,
        attrName: 'id',
        hint: `Rename or remove one of the duplicated id="${idValue}" attributes.`,
      });
      continue;
    }

    seen.set(idValue, { tag, range });
  }

  return diagnostics;
}

/**
 * Detect attributes written in non-lowercase on known custom elements.
 * HTML attributes are case-insensitive, but WCF uses lowercase canonically.
 * @param {{
 *   filePath?: string;
 *   text: string;
 *   cem: Map<string, { attributes: Set<string> }>;
 *   severity?: string;
 * }} params
 */
export function detectNonLowercaseAttributes({
  filePath = '<input>',
  text,
  cem,
  severity = 'warning',
}) {
  const diagnostics = [];
  if (!(cem instanceof Map) || cem.size === 0) return diagnostics;

  const sourceText = sanitizeMarkupForValidation(text);
  const lineStarts = computeLineIndex(sourceText);
  const tagRe = /<([a-z][a-z0-9-]*)\b([^<>]*?)>/gi;
  let m;

  while ((m = tagRe.exec(sourceText))) {
    const tag = String(m[1] ?? '').toLowerCase();
    if (!tag.includes('-')) continue;

    const meta = cem.get(tag);
    if (!meta) continue;

    const attrChunk = String(m[2] ?? '');
    const rawAttrsStart = m.index + 1 + tag.length;
    const attrs = parseAttributes(attrChunk);

    for (const { name, offset } of attrs) {
      // Check if attribute has non-lowercase characters BEFORE normalizing
      if (name === name.toLowerCase()) continue;

      const lower = name.toLowerCase();

      // Skip global attributes and event handlers
      if (shouldSkipAttr(lower)) continue;

      // Only flag if the lowercase form is a known CEM attribute
      if (!meta.attributes.has(lower)) continue;

      const startIndex = rawAttrsStart + offset;
      const endIndex = startIndex + name.length;
      const range = makeRange(lineStarts, startIndex, endIndex);
      diagnostics.push({
        file: filePath,
        range,
        severity,
        code: 'canonicalLowercaseRecommendation',
        message: `Attribute "${name}" should be lowercase: "${lower}".`,
        tagName: tag,
        attrName: name,
        hint: `Use "${lower}" instead of "${name}".`,
      });
    }
  }

  return diagnostics;
}

/**
 * Detect CDN URLs in markup that should use local vendor paths instead.
 */
export function detectCdnReferences({
  filePath = '<input>',
  text,
  severity = 'warning',
}) {
  const diagnostics = [];
  const lineStarts = computeLineIndex(text);
  const cdnRe = /https?:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|esm\.sh)/g;
  let m;
  while ((m = cdnRe.exec(text))) {
    const range = makeRange(lineStarts, m.index, m.index + m[0].length);
    diagnostics.push({
      file: filePath,
      range,
      severity,
      code: 'cdnReference',
      message: `CDN URL detected: "${m[0]}". This design system is self-hosted. Use local vendor paths instead.`,
      tagName: '',
      hint: 'Replace CDN URLs with local paths (e.g., ./vendor-runtime/components/...). Run `wcf init` to set up local assets.',
    });
  }

  return diagnostics;
}

/**
 * Detect missing importmap or boot.js in a full HTML page.
 * Only triggers when the markup contains a full page structure (<!DOCTYPE html>).
 */
export function detectMissingRuntimeScaffold({
  filePath = '<input>',
  text,
  severity = 'warning',
}) {
  const diagnostics = [];

  // Only check full HTML pages
  if (!text.includes('<!DOCTYPE html>') && !text.includes('<!doctype html>')) {
    return diagnostics;
  }

  const lineStarts = computeLineIndex(text);

  if (!/<script\b[^>]*\btype\s*=\s*['"]importmap['"][^>]*>/i.test(text)) {
    const range = makeRange(lineStarts, 0, Math.min(text.length, 15));
    diagnostics.push({
      file: filePath,
      range,
      severity,
      code: 'missingImportmap',
      message: 'Full HTML page is missing <script type="importmap">. WCF components require an import map for module resolution.',
      tagName: '',
      hint: 'Add <script type="importmap">{"imports":{...}}</script> in <head>. Run `wcf init` to generate one.',
    });
  }

  if (!text.includes('boot.js')) {
    const range = makeRange(lineStarts, 0, Math.min(text.length, 15));
    diagnostics.push({
      file: filePath,
      range,
      severity,
      code: 'missingBootScript',
      message: 'Full HTML page is missing boot.js script. WCF components require the boot script to initialize.',
      tagName: '',
      hint: 'Add <script type="module" src="./vendor-runtime/boot.js"></script> in <head>.',
    });
  }

  return diagnostics;
}
