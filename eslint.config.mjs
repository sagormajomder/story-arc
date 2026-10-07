import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import boundaries from 'eslint-plugin-boundaries';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * Dependency Graph for Feature Modules
 * -------------------------------------------------------------
 * Defines which feature modules are permitted to depend on other feature modules.
 * Rule: Inter-feature communication is strictly restricted to public entry points (*.index.ts).
 */
const dependencyMap = {
  auth: [],
  books: ['reviews'], // 'books' module embeds reviews (BookReviewsSection)
  dashboard: [],
  genres: [],
  library: [],
  reviews: [],
  tutorials: [],
  users: [],
};

const featureNames = Object.keys(dependencyMap);
const sharedLayers = ['components', 'providers', 'hooks', 'lib', 'config', 'types'];

/**
 * Architecture Elements
 * -------------------------------------------------------------
 * Categorizes the project codebase into architectural layers:
 * 1. Feature Modules (src/features/*)
 * 2. App Layer       (Next.js App Router: pages, layouts, route handlers)
 * 3. Components      (shared UI primitives, layouts, common components)
 * 4. Providers       (React context providers)
 * 5. Hooks           (shared custom React hooks)
 * 6. Lib             (HTTP client, shared utilities)
 * 7. Config          (environment variables & API configuration)
 * 8. Types           (shared domain interfaces & API types)
 */
const elements = [
  ...featureNames.map(name => ({
    type: name,
    pattern: `src/features/${name}/**`,
  })),
  {
    type: 'app',
    pattern: 'src/app/**',
  },
  {
    type: 'components',
    pattern: 'src/components/**',
  },
  {
    type: 'providers',
    pattern: 'src/providers/**',
  },
  {
    type: 'hooks',
    pattern: 'src/hooks/**',
  },
  {
    type: 'lib',
    pattern: 'src/lib/**',
  },
  {
    type: 'config',
    pattern: 'src/config/**',
  },
  {
    type: 'types',
    pattern: 'src/types/**',
  },
];

/**
 * Architectural Policies (eslint-plugin-boundaries)
 * -------------------------------------------------------------
 */
const policies = [
  // 1. App layer can consume feature modules ONLY via module entrypoints (*.index.ts)
  {
    from: { element: { type: 'app' } },
    allow: {
      to: {
        element: {
          type: featureNames,
          fileInternalPath: '*.index.ts',
        },
      },
    },
  },

  // 2. App layer can consume shared layers and internal app files
  {
    from: { element: { type: 'app' } },
    allow: {
      to: {
        element: {
          type: [...sharedLayers, 'app'],
        },
      },
    },
  },

  // 3. Inter-feature communication: Only allowed via declared dependencyMap through entrypoint (*.index.ts)
  ...Object.entries(dependencyMap).flatMap(([from, deps]) =>
    deps.map(dep => ({
      from: { element: { type: from } },
      allow: {
        to: { element: { type: dep, fileInternalPath: '*.index.ts' } },
      },
    }))
  ),

  // 4. Feature modules can consume shared layers
  {
    from: { element: { type: featureNames } },
    allow: {
      to: { element: { type: sharedLayers } },
    },
  },

  // 5. Types layer can access feature type definitions (types/*.types.ts)
  {
    from: { element: { type: 'types' } },
    allow: {
      to: {
        element: {
          type: featureNames,
          fileInternalPath: 'types/*.types.ts',
        },
      },
    },
  },

  // 6. Components layer can access shared utilities, hooks, types, and other components
  {
    from: { element: { type: 'components' } },
    allow: {
      to: { element: { type: ['components', 'lib', 'hooks', 'types'] } },
    },
  },

  // 7. Providers layer can access lib, config, types, and other providers
  {
    from: { element: { type: 'providers' } },
    allow: {
      to: { element: { type: ['providers', 'lib', 'config', 'types'] } },
    },
  },

  // 8. Hooks layer can access lib, types, and other hooks
  {
    from: { element: { type: 'hooks' } },
    allow: {
      to: { element: { type: ['hooks', 'lib', 'types'] } },
    },
  },

  // 9. Lib layer can access config, types, and other lib utils
  {
    from: { element: { type: 'lib' } },
    allow: {
      to: { element: { type: ['lib', 'config', 'types'] } },
    },
  },

  // 10. Shared layers, Components, and Config must NOT depend on feature modules or app layer
  {
    from: { element: { type: sharedLayers } },
    disallow: {
      to: { element: { type: ['app'] } },
    },
  },
  {
    from: { element: { type: ['components', 'providers', 'hooks', 'lib', 'config'] } },
    disallow: {
      to: { element: { type: featureNames } },
    },
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Architecture boundaries & cycle prevention
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
      'boundaries/elements': elements,
    },
    rules: {
      // Enforce architectural boundary constraints strictly
      'boundaries/dependencies': ['error', { default: 'disallow', policies }],

      // Detect and prevent circular dependencies across modules
      'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
