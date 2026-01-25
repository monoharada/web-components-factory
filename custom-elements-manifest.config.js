import { cemValidatorPlugin } from '@wc-toolkit/cem-validator';
import { cemInheritancePlugin } from '@wc-toolkit/cem-inheritance';
import { cemSorterPlugin } from '@wc-toolkit/cem-sorter';
import { modulePathResolverPlugin } from '@wc-toolkit/module-path-resolver';

function normalizePosixPath(p) {
  return p.replaceAll('\\', '/');
}

function ensureDotSlash(p) {
  if (p.startsWith('./')) return p;
  return `./${p}`;
}

export default {
  globs: ['packages/**/*.ts'],
  exclude: [
    '**/*.test.ts',
    'tests/**',
    'src/**',
    'packages/autoload/**',
  ],
  // We manage package.json "customElements" ourselves for stable diffs.
  packagejson: false,
  plugins: [
    {
      name: 'force-schema-version',
      packageLinkPhase({ customElementsManifest }) {
        // The analyzer currently outputs schemaVersion "1.0.0".
        // Tooling (e.g. cem-validator) expects the latest version string.
        customElementsManifest.schemaVersion = '2.1.0';
      },
    },
    // NOTE: This is intentionally conservative for now (normalize + ensure "./").
    // When we have a formal build output layout, we can map to dist/**/*.js here.
    modulePathResolverPlugin({
      modulePathTemplate(modulePath) {
        return ensureDotSlash(normalizePosixPath(modulePath));
      },
      definitionPathTemplate(modulePath) {
        return ensureDotSlash(normalizePosixPath(modulePath));
      },
      typeDefinitionPathTemplate(modulePath) {
        return ensureDotSlash(normalizePosixPath(modulePath));
      },
    }),
    cemInheritancePlugin(),
    cemValidatorPlugin({
      cemFileName: 'custom-elements.json',
      packageJsonPath: './package.json',
      logErrors: true,
      exclude: [
        // Base classes (not custom elements)
        'WebComponent',
        'TypographyWebComponent',
        'TypographyFormComponent',
      ],
      rules: {
        packageJson: {
          packageType: 'error',
          customElementsProperty: 'error',
          main: 'off',
          module: 'off',
          types: 'off',
          exports: 'off',
          publishedCem: 'off',
        },
        manifest: {
          schemaVersion: 'error',
          tagName: 'error',
          modulePath: 'off',
          definitionPath: 'off',
          typeDefinitionPath: 'off',
          exportTypes: 'off',
        },
      },
    }),
    cemSorterPlugin(),
  ],
};
