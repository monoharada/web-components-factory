# Card demo notes (accordion + hover behavior)

Date: 2026-01-31

## Context
- Target page: `/?component=card`
- Reference: DADS Storybook card example 3
- Work focused on the card demo layout and the API/Controls panel for the viewer.

## API panel structure decisions
- Preview is always visible (not inside accordion).
- Tables only are collapsible.
- Accordion order is fixed as:
  1) Usage (HTML)
  2) Content (Demo)
  3) Props / Attrs
  4) CSS vars
- Accordion is non-exclusive: `dads-accordion-details allow-multiple`.

## Usage code block behavior
- Usage (HTML) is inside its own accordion item.
- The code block inside Usage has `data-api-code-collapse="off"` to disable the internal disclosure wrapper.
  - This ensures there is no nested disclosure UI inside the accordion.

## Hover behavior rules for card demo
Goal:
- Delegate ON:
  - Hovering the card container can apply hover emphasis to the main link.
  - Hovering non-primary interactive elements (e.g. footer buttons) must NOT apply the main link hover emphasis.
- Delegate OFF:
  - Only hovering the main link should apply its hover emphasis.
  - Hovering the card container must not apply main link hover emphasis.

Implementation in `src/demos/showcase-components.ts` (card demo CSS):
- Base underline style for `h2 a` stays the same.
- Hover emphasis split into two rules:
  - `dads-card[data-dads-card-delegate]:hover h2 a` for delegate-on card hover.
  - `dads-card h2 a:hover` for link-only hover.
- A guard rule cancels the delegate hover emphasis when hovering non-primary interactive elements:
  - `dads-card[data-dads-card-delegate]:has(:is(dads-button, button, [role="button"], input, select, textarea, a:not([data-dads-card-primary])):hover) h2 a`
  - This resets the underline thickness to the base value when hovering those controls.

## Notes on selectors
- `:has()` is used in multiple components in this repo, so it is an accepted pattern here.
- The guard rule is restricted to the card demo section to avoid global impact.

## Tests added/updated
- `e2e-evidence/card.example-3.vrt.spec.ts` now checks:
  - API panel accordion order and allow-multiple.
  - Preview is outside the accordion.
  - Usage is inside the accordion.
  - No disclosure wrapper inside Usage code block.
  - Hover behavior changes for delegate ON/OFF using text-decoration thickness as the signal.

## Known trade-offs
- The hover guard relies on CSS `:has()` support (Chromium/Safari support is present, older Firefox may lag).
- The hover check is based on underline thickness, which is stable for the current token values.
