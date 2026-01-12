/**
 * Spacing Tokens
 *
 * - `--spacing-scale-*` are unitless numbers (treat as px at 16px root).
 * - `--spacing-*` are `rem`-based and can be density-tuned via `--spacing-factor`.
 * - `--spacing-*-px` are fixed `px` values (useful for hairlines / inline padding).
 *
 * This module is intentionally "headless": it provides a predictable scale without
 * prescribing semantic aliases (e.g. gap-stack). Components should define their own
 * semantic tokens and reference this scale.
 */

import { css } from '../core/web-components.js';

export function applySpacingTokens() {
  return css`
    :host {
      /* ==========================================
       * Spacing Tokens
       * ========================================== */

      /**
       * Rem conversion base (unitless).
       * - 16 means: 1rem is treated as 16px for the scale mapping.
       * - If you redefine your root font-size, override this value to keep the mapping aligned.
       */
      --spacing-root-font-size: 16;

      /**
       * Global multiplier for density tuning.
       * - 1: default
       * - <1: tighter
       * - >1: looser
       */
      --spacing-factor: 1;

      /* Spacing scale (unitless) */
      --spacing-scale-0: 0;
      --spacing-scale-0-5: 2;
      --spacing-scale-1: 4;
      --spacing-scale-1-5: 6;
      --spacing-scale-2: 8;
      --spacing-scale-2-5: 10;
      --spacing-scale-3: 12;
      --spacing-scale-3-5: 14;
      --spacing-scale-4: 16;
      --spacing-scale-5: 20;
      --spacing-scale-6: 24;
      --spacing-scale-7: 28;
      --spacing-scale-8: 32;
      --spacing-scale-9: 36;
      --spacing-scale-10: 40;
      --spacing-scale-11: 44;
      --spacing-scale-12: 48;
      --spacing-scale-14: 56;
      --spacing-scale-15: 60;
      --spacing-scale-16: 64;
      --spacing-scale-18: 72;
      --spacing-scale-20: 80;
      --spacing-scale-24: 96;
      --spacing-scale-28: 112;
      --spacing-scale-32: 128;
      --spacing-scale-36: 144;
      --spacing-scale-40: 160;

      /* Spacing (rem) */
      --spacing-0: 0;
      --spacing-0-5: calc(
        var(--spacing-scale-0-5) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-1: calc(
        var(--spacing-scale-1) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-1-5: calc(
        var(--spacing-scale-1-5) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-2: calc(
        var(--spacing-scale-2) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-2-5: calc(
        var(--spacing-scale-2-5) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-3: calc(
        var(--spacing-scale-3) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-3-5: calc(
        var(--spacing-scale-3-5) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-4: calc(
        var(--spacing-scale-4) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-5: calc(
        var(--spacing-scale-5) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-6: calc(
        var(--spacing-scale-6) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-7: calc(
        var(--spacing-scale-7) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-8: calc(
        var(--spacing-scale-8) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-9: calc(
        var(--spacing-scale-9) * var(--spacing-factor) * (1rem / var(--spacing-root-font-size))
      );
      --spacing-10: calc(
        var(--spacing-scale-10) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-11: calc(
        var(--spacing-scale-11) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-12: calc(
        var(--spacing-scale-12) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-14: calc(
        var(--spacing-scale-14) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-15: calc(
        var(--spacing-scale-15) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-16: calc(
        var(--spacing-scale-16) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-18: calc(
        var(--spacing-scale-18) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-20: calc(
        var(--spacing-scale-20) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-24: calc(
        var(--spacing-scale-24) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-28: calc(
        var(--spacing-scale-28) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-32: calc(
        var(--spacing-scale-32) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-36: calc(
        var(--spacing-scale-36) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );
      --spacing-40: calc(
        var(--spacing-scale-40) *
          var(--spacing-factor) *
          (1rem / var(--spacing-root-font-size))
      );

      /* Spacing (px) */
      --spacing-0-px: 0;
      --spacing-0-5-px: calc(var(--spacing-scale-0-5) * var(--spacing-factor) * 1px);
      --spacing-1-px: calc(var(--spacing-scale-1) * var(--spacing-factor) * 1px);
      --spacing-1-5-px: calc(var(--spacing-scale-1-5) * var(--spacing-factor) * 1px);
      --spacing-2-px: calc(var(--spacing-scale-2) * var(--spacing-factor) * 1px);
      --spacing-2-5-px: calc(var(--spacing-scale-2-5) * var(--spacing-factor) * 1px);
      --spacing-3-px: calc(var(--spacing-scale-3) * var(--spacing-factor) * 1px);
      --spacing-3-5-px: calc(var(--spacing-scale-3-5) * var(--spacing-factor) * 1px);
      --spacing-4-px: calc(var(--spacing-scale-4) * var(--spacing-factor) * 1px);
      --spacing-5-px: calc(var(--spacing-scale-5) * var(--spacing-factor) * 1px);
      --spacing-6-px: calc(var(--spacing-scale-6) * var(--spacing-factor) * 1px);
      --spacing-7-px: calc(var(--spacing-scale-7) * var(--spacing-factor) * 1px);
      --spacing-8-px: calc(var(--spacing-scale-8) * var(--spacing-factor) * 1px);
      --spacing-9-px: calc(var(--spacing-scale-9) * var(--spacing-factor) * 1px);
      --spacing-10-px: calc(var(--spacing-scale-10) * var(--spacing-factor) * 1px);
      --spacing-11-px: calc(var(--spacing-scale-11) * var(--spacing-factor) * 1px);
      --spacing-12-px: calc(var(--spacing-scale-12) * var(--spacing-factor) * 1px);
      --spacing-14-px: calc(var(--spacing-scale-14) * var(--spacing-factor) * 1px);
      --spacing-15-px: calc(var(--spacing-scale-15) * var(--spacing-factor) * 1px);
      --spacing-16-px: calc(var(--spacing-scale-16) * var(--spacing-factor) * 1px);
      --spacing-18-px: calc(var(--spacing-scale-18) * var(--spacing-factor) * 1px);
      --spacing-20-px: calc(var(--spacing-scale-20) * var(--spacing-factor) * 1px);
      --spacing-24-px: calc(var(--spacing-scale-24) * var(--spacing-factor) * 1px);
      --spacing-28-px: calc(var(--spacing-scale-28) * var(--spacing-factor) * 1px);
      --spacing-32-px: calc(var(--spacing-scale-32) * var(--spacing-factor) * 1px);
      --spacing-36-px: calc(var(--spacing-scale-36) * var(--spacing-factor) * 1px);
      --spacing-40-px: calc(var(--spacing-scale-40) * var(--spacing-factor) * 1px);
    }
  `;
}
