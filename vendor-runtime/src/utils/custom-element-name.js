export function getPrefixFromLocalName(localName, suffix, fallbackPrefix = 'dads') {
    if (localName.endsWith(suffix)) {
        return localName.slice(0, Math.max(0, localName.length - suffix.length));
    }
    return fallbackPrefix;
}
export function ensurePrefixedElement(root, id, expectedName, forceReplace = false) {
    const current = root.querySelector(`#${id}`);
    if (!current)
        return null;
    if (current.localName === expectedName && !forceReplace)
        return current;
    const replacement = document.createElement(expectedName);
    for (const attrName of current.getAttributeNames()) {
        const val = current.getAttribute(attrName);
        if (val === null)
            replacement.setAttribute(attrName, '');
        else
            replacement.setAttribute(attrName, val);
    }
    while (current.firstChild)
        replacement.appendChild(current.firstChild);
    current.parentNode?.replaceChild(replacement, current);
    return replacement;
}
