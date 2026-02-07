import {
  CONTENT_TYPESET_LAYER_ORDER,
  contentTypesetStylesText,
  createContentTypesetStyles,
} from '../packages/styles/content-typeset.ts';

describe('content typeset styles', () => {
  it('defines layer order and contents rules', () => {
    expect(contentTypesetStylesText).toContain(`@layer ${CONTENT_TYPESET_LAYER_ORDER};`);
    expect(contentTypesetStylesText).toContain('@layer contents');
    expect(contentTypesetStylesText).toContain('[data-dads-typeset]');
    expect(contentTypesetStylesText).toContain('row-gap: var(--dads-typeset-gap-current);');
  });

  it('uses compact density as 0.85 multiplier', () => {
    expect(contentTypesetStylesText).toContain(
      '--dads-typeset-gap-compact: calc(var(--dads-typeset-gap-normal) * 0.85);',
    );
    expect(contentTypesetStylesText).toContain("[data-dads-density='compact'][data-dads-typeset]");
  });

  it('keeps heading fallback only for native headings', () => {
    expect(contentTypesetStylesText).toContain(
      '[data-dads-typeset] > :is(h1, h2, h3, h4, h5, h6):not(:first-child)',
    );
    expect(contentTypesetStylesText).not.toContain('dads-heading');
    expect(createContentTypesetStyles()).toBe(contentTypesetStylesText);
  });
});
