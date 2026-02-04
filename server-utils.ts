const shouldRewriteSpecifier = (specifier: string): boolean =>
  specifier.startsWith('.') || specifier.startsWith('/');

const appendMinQuery = (specifier: string): string => {
  const hashIndex = specifier.indexOf('#');
  const base = hashIndex === -1 ? specifier : specifier.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : specifier.slice(hashIndex);

  const queryIndex = base.indexOf('?');
  const path = queryIndex === -1 ? base : base.slice(0, queryIndex);
  const query = queryIndex === -1 ? '' : base.slice(queryIndex + 1);

  const params = new URLSearchParams(query);
  params.set('min', '1');
  const newQuery = params.toString();

  return `${path}${newQuery ? `?${newQuery}` : ''}${hash}`;
};

export function rewriteModuleSpecifiers(code: string): string {
  const rewrite = (specifier: string) =>
    shouldRewriteSpecifier(specifier) ? appendMinQuery(specifier) : specifier;

  let result = code.replace(
    /\b(import|export)\s*(?:\*\s*)?(?:[^'"]*?from\s*)?["']([^"']+)["']/g,
    (match, _keyword, specifier) => match.replace(specifier, rewrite(specifier))
  );

  result = result.replace(
    /export\*\s*from\s*["']([^"']+)["']/g,
    (match, specifier) => match.replace(specifier, rewrite(specifier))
  );

  result = result.replace(
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    (match, specifier) => match.replace(specifier, rewrite(specifier))
  );

  return result;
}
