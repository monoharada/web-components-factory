# STEP09 Review Fixes Plan (Approved)

## Scope
- Address review findings for municipal template implementation.

## Changes
1. Fix `contact.prefecture-issue-specific` channel focus behavior:
   - `channelFocus='phone_email'` must prioritize phone/email and avoid showing form/fax as primary.
2. Fix `service.digital-application-service` external apply contract:
   - external vendor mode must expose external link CTA with `href`, `target="_blank"`, `rel="noopener noreferrer"`, and vendor note.
3. Align demo for `contact.municipal-streamlined-form`:
   - switch sample from `simple` to `multi_step`.
4. Resolve tab ARIA mismatch in tabbed search UI:
   - remove broken tab role/aria-controls pairing or implement valid pairing.
5. Strengthen tests to cover MUST behaviors directly.

## Validation
- npm run validate:wc
- npm run test:run
- npm run agents:verify
