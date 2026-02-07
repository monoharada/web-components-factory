/**
 * Content Typeset Styles (Light DOM)
 *
 * - Scope with `[data-dads-typeset]`.
 * - Density switch with `[data-dads-density="compact"]`.
 * - Keep heading large spacing policy in `dads-heading[margin="top"]`.
 */
export const CONTENT_TYPESET_LAYER_ORDER = 'reset, tokens, base, layout, components, contents, page';
export const contentTypesetStylesText = `@layer ${CONTENT_TYPESET_LAYER_ORDER};

@layer contents {
  [data-dads-typeset] {
    --dads-typeset-gap-normal: 1lh;
    --dads-typeset-gap-compact: 1em;
    --dads-typeset-gap-current: var(--dads-typeset-gap-normal);
    --dads-typeset-heading-margin-top-normal: 1lh;
    --dads-typeset-heading-margin-top-compact: 1em;
    --dads-typeset-heading-margin-top-current: var(--dads-typeset-heading-margin-top-normal);
    --dads-typeset-heading-before-extra-normal: 0.5lh;
    --dads-typeset-heading-before-extra-compact: calc(var(--dads-typeset-heading-before-extra-normal) * 0.85);
    --dads-typeset-heading-before-extra-current: var(--dads-typeset-heading-before-extra-normal);
    --dads-heading-margin-block-start-base: var(--dads-typeset-heading-margin-top-current);
    --dads-heading-margin-scale: 1;

    display: grid;
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--dads-typeset-gap-current);
  }

  [data-dads-density='compact'][data-dads-typeset],
  [data-dads-density='compact'] [data-dads-typeset] {
    --dads-typeset-gap-current: var(--dads-typeset-gap-compact);
    --dads-typeset-heading-margin-top-current: var(--dads-typeset-heading-margin-top-compact);
    --dads-typeset-heading-before-extra-current: var(--dads-typeset-heading-before-extra-compact);
  }

  [data-dads-typeset] > :where(*) {
    margin-block: 0;
  }

  [data-dads-typeset] > :is(h1, h2, h3, h4, h5, h6):not(:first-child) {
    margin-block-start: calc(
      var(--dads-typeset-gap-current) + var(--dads-typeset-heading-before-extra-current)
    );
  }
}
`;
export function createContentTypesetStyles() {
    return contentTypesetStylesText;
}
export function installContentTypesetStyle(doc = document) {
    const styleSelector = 'style[data-dads-typeset-style]';
    const existing = doc.querySelector(styleSelector);
    if (existing instanceof HTMLStyleElement)
        return existing;
    const style = doc.createElement('style');
    style.setAttribute('data-dads-typeset-style', '');
    style.textContent = createContentTypesetStyles();
    const head = doc.head ?? doc.documentElement;
    head.append(style);
    return style;
}
