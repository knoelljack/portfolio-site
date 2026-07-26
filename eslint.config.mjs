import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

/**
 * eslint-config-next 16 ships native flat configs, so they are imported
 * directly. Routing them through `FlatCompat` — which is what this file used
 * to do — makes eslintrc try to validate an already-flat config and blow up
 * with "Converting circular structure to JSON" before a single source file is
 * read.
 *
 * `prettier` goes last: it only turns off rules that would fight the
 * formatter. Formatting itself stays in the `format` / `format:check`
 * scripts rather than running through ESLint.
 */
const eslintConfig = [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'tasks/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
];

export default eslintConfig;
