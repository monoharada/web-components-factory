/**
 * Web Components validation configuration.
 *
 * NOTE:
 * - The upstream WC Toolkit wctools package currently publishes without built artifacts on npm.
 * - This config is still useful as a single source of truth for local tooling and future adoption.
 */

export default {
  manifestSrc: './custom-elements.json',
  include: ['viewer.html', 'src/demos.ts', 'src/entry.ts'],
  exclude: ['node_modules/**', 'dist/**', 'dist-pages/**'],
  diagnosticSeverity: {
    unknownElement: 'error',
    unknownAttribute: 'warning',
  },
};
