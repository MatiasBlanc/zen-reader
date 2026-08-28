import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        pocketAlternative: resolve(import.meta.dirname, 'pocket-alternative/index.html'),
        omnivoreAlternative: resolve(import.meta.dirname, 'omnivore-alternative/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        changelog: resolve(import.meta.dirname, 'changelog/index.html'),
        docs: resolve(import.meta.dirname, 'docs/index.html'),
      },
    },
  },
});
