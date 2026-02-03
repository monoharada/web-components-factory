export function getPrefixFromLocalName(
  localName: string,
  suffix: string,
  fallbackPrefix: string = 'dads',
): string {
  if (localName.endsWith(suffix)) {
    return localName.slice(0, Math.max(0, localName.length - suffix.length));
  }
  return fallbackPrefix;
}

export function ensurePrefixedElement<T extends HTMLElement>(
  root: ParentNode,
  id: string,
  expectedName: string,
  forceReplace = false,
): T | null {
  const current = root.querySelector(`#${id}`) as T | null;
  if (!current) return null;
  if (current.localName === expectedName && !forceReplace) return current;

  const replacement = document.createElement(expectedName) as T;

  for (const attrName of current.getAttributeNames()) {
    const val = current.getAttribute(attrName);
    if (val === null) replacement.setAttribute(attrName, '');
    else replacement.setAttribute(attrName, val);
  }

  while (current.firstChild) replacement.appendChild(current.firstChild);

  current.parentNode?.replaceChild(replacement, current);

  return replacement;
}
