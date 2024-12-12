import fs from 'node:fs';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { parse } from 'dotenv';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    env: parse(fs.readFileSync('.env.local', { encoding: 'utf8' })),
  },
  plugins: [
    react(),
    vanillaExtractPlugin(),
  ],
});
