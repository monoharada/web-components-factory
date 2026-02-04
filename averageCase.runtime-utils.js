const isAbsoluteUrl = (value) =>
  /^[a-zA-Z][a-zA-Z+.-]*:/.test(value) || value.startsWith('//');

export const resolveMinifiedSpecifier = ({
  specifier,
  importMap,
  shouldMinify,
  baseURI,
}) => {
  if (!shouldMinify) return specifier;
  const mapped = importMap[specifier];
  if (!mapped) return specifier;

  const url = new URL(mapped, baseURI);
  url.searchParams.set('min', '1');

  if (isAbsoluteUrl(mapped)) return url.href;
  return `${url.pathname}${url.search}${url.hash}`;
};
