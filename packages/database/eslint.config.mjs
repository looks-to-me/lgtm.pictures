import { define } from '@praha/eslint-config-definer';

import { config as base } from '../../eslint.config.mjs';

const config = define([
  base,
  () => [{
    ignores: [
      'migrations',
    ],
  }],
]);

export default config({
  tsconfigPath: './tsconfig.json',
});
