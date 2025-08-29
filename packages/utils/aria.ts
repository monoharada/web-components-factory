// aria.ts
// TypeScript port of aria.js

// If you need stricter tuple typing for Object.entries, consider a typedEntries<T>() helper.
// For simplicity and compatibility, we export as ReadonlyArray<[string, string]>.
export const ariaCommonProperties: ReadonlyArray<readonly [string, string]> = Object.entries({
  ariaAtomic: 'aria-atomic',
  ariaBusy: 'aria-busy',
  ariaCurrent: 'aria-current',
  ariaDisabled: 'aria-disabled',
  ariaHasPopup: 'aria-haspopup',
  ariaHidden: 'aria-hidden',
  ariaInvalid: 'aria-invalid',
  ariaKeyShortcuts: 'aria-keyshortcuts',
  ariaLabel: 'aria-label',
  ariaLive: 'aria-live',
  ariaRelevant: 'aria-relevant',
  ariaRoleDescription: 'aria-roledescription',
}) as ReadonlyArray<readonly [string, string]>;

export const ariaButtonProperties: ReadonlyArray<readonly [string, string]> = Object.entries({
  ariaExpanded: 'aria-expanded',
  ariaPressed: 'aria-pressed',
}) as ReadonlyArray<readonly [string, string]>;
