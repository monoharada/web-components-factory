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

