/**
 * Core package exports
 */

// Base Web Components
export * from './web-components.js';

// Typography System
export {
  TypographyWebComponent,
  TypographyFormComponent,
  baseTypographyStyles,
  fontLoadingStyles,
  initializeGlobalFonts,
  ensureFontsInitialized
} from './typography/index.js';

// Preloader (HTTP/2 Server Push クライアント側フォールバック)
export {
  CORE_DEPENDENCIES,
  preloadCoreDependencies,
  preloadCoreDependenciesWhenIdle,
  generatePreloadHTML,
  generateLinkHeader,
  type PreloadOptions
} from './preloader.js';