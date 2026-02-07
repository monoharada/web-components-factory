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

  it('uses compact density tokens for gap and heading spacing', () => {
    expect(contentTypesetStylesText).toContain('--dads-typeset-gap-normal: 1lh;');
    expect(contentTypesetStylesText).toContain('--dads-typeset-gap-compact: 1em;');
    expect(contentTypesetStylesText).toContain('--dads-typeset-heading-margin-top-normal: 1lh;');
    expect(contentTypesetStylesText).toContain('--dads-typeset-heading-margin-top-compact: 1em;');
    expect(contentTypesetStylesText).toContain(
      '--dads-typeset-heading-before-extra-compact: calc(var(--dads-typeset-heading-before-extra-normal) * 0.85);',
    );
    expect(contentTypesetStylesText).toContain("[data-dads-density='compact'][data-dads-typeset]");
  });

  it('keeps heading fallback only for native headings', () => {
    expect(contentTypesetStylesText).toContain(
      '[data-dads-typeset] > :is(h1, h2, h3, h4, h5, h6):not(:first-child)',
    );
    expect(contentTypesetStylesText).toContain(
      '--dads-heading-margin-block-start-base: var(--dads-typeset-heading-margin-top-current);',
    );
    expect(contentTypesetStylesText).toContain('--dads-heading-margin-scale: 1;');
    expect(contentTypesetStylesText).not.toContain('--dads-typeset-density-factor');
    expect(contentTypesetStylesText).toContain(
      'var(--dads-typeset-heading-before-extra-current)',
    );
    expect(contentTypesetStylesText).not.toContain('[data-dads-typeset] > dads-heading');
    expect(createContentTypesetStyles()).toBe(contentTypesetStylesText);
  });
});
