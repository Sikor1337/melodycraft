/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Served from the root of https://melodycraft.io/ (Cloudflare Worker with static
  // assets, see wrangler.jsonc). Until 07.11.2026 the site lived on GitHub Pages
  // under /melodycraft.org/ — the frozen docs/ folder is that old build.
  base: '/',
  build: {
    // Output into dist/ (gitignored); `npx wrangler deploy` uploads it.
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});