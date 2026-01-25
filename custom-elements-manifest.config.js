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

function sanitizeCustomElementsManifest(customElementsManifest) {
  const modules = Array.isArray(customElementsManifest?.modules) ? customElementsManifest.modules : [];

  for (const mod of modules) {
    const declarations = Array.isArray(mod?.declarations) ? mod.declarations : [];
    for (const decl of declarations) {
      if (!decl || typeof decl !== 'object') continue;

      // The analyzer marks any class extending HTMLElement as `customElement: true`.
      // Base classes without a tagName should not be treated as custom elements.
      if (decl.customElement === true) {
        const tagName = typeof decl.tagName === 'string' ? decl.tagName.trim() : '';
        if (!tagName) delete decl.customElement;
      }

      if (typeof decl.tagName === 'string' && decl.tagName.trim() === '') {
        delete decl.tagName;
      }

      // The analyzer currently infers events by inspecting `dispatchEvent(new CustomEvent(...))`.
      // In our base class `emitEvent(type, ...)`, the first argument is an identifier (`type`),
      // which can be misinterpreted as an event name and then inherited to all components.
      if (Array.isArray(decl.events) && decl.events.length > 0) {
        decl.events = decl.events.filter((e) => {
          if (!e || typeof e !== 'object') return false;
          if (e.name !== 'type') return true;
          if (e?.type?.text !== 'CustomEvent') return true;
          const inheritedFrom = e?.inheritedFrom?.name;
          const isFromWebComponent = inheritedFrom === 'WebComponent' || decl.name === 'WebComponent';
          return !isFromWebComponent;
        });
      }
    }
  }
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
    {
      name: 'wcf-sanitize-manifest',
      packageLinkPhase({ customElementsManifest }) {
        sanitizeCustomElementsManifest(customElementsManifest);
      },
    },
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
