import { defineConfig, type Plugin } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import { resolve } from 'path';
import manifest from './manifest.config.js';

/**
 * Navegador objetivo del build.
 * crxjs genera `background.service_worker` (Chrome) o `background.scripts`
 * (Firefox MV3, que no soporta service_worker) a partir de esta opción.
 */
const TARGET = process.env.ZENREADER_TARGET === 'firefox' ? 'firefox' : 'chrome';

/**
 * Plugin que empaqueta el content script como un archivo autocontenido.
 *
 * El content script se inyecta mediante `chrome.scripting.executeScript()`
 * que ejecuta el código como script clásico (no como módulo ESM).
 * Por tanto necesita ser un bundle sin imports ESM externos.
 *
 * Usa esbuild (incluido en Vite) para crear un bundle IIFE autocontenido:
 * - En build (`closeBundle`): justo después del build principal.
 * - En dev (`configureServer`): al arrancar el dev server, porque en modo
 *   dev no se ejecuta `closeBundle` y `executeScript` necesita el archivo
 *   real en `dist/` para poder inyectarlo.
 */
function bundleContentScript(): Plugin {
  /** Empaqueta el content script con esbuild. */
  const runBundle = async (): Promise<void> => {
    const { build } = await import('esbuild');
    const outDir = resolve(import.meta.dirname, 'dist');
    const entry = resolve(import.meta.dirname, 'src/presentation/clipper/content-script.tsx');
    const outfile = resolve(outDir, 'content-script.js');

    await build({
      entryPoints: [entry],
      outfile,
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: 'es2022',
      jsx: 'automatic',
      jsxImportSource: 'preact',
      // chrome es una API global del navegador, no se empaqueta.
      external: ['chrome'],
      resolveExtensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
      alias: {
        '@domain': resolve(import.meta.dirname, 'src/domain'),
        '@application': resolve(import.meta.dirname, 'src/application'),
        '@infrastructure': resolve(import.meta.dirname, 'src/infrastructure'),
        '@presentation': resolve(import.meta.dirname, 'src/presentation'),
        // Los iconos de reicon-react importan desde 'react';
        // en el content script (bundle IIFE con esbuild) resolvemos
        // react → preact/compat, igual que hace @preact/preset-vite
        // en el resto de la app.
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      minify: true,
      treeShaking: true,
      legalComments: 'none',
    });
  };

  return {
    name: 'bundle-content-script',
    closeBundle: runBundle,
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        runBundle().catch((err: unknown) => {
          console.error('[Zen Reader] Error empaquetando el content script:', err);
        });
      });
    },
  };
}

/**
 * Configuración de Vite para la extensión Zen Reader.
 *
 * @crxjs/vite-plugin se encarga de:
 *  - Generar el `manifest.json` final a partir de `manifest.config.ts`.
 *  - Detectar los HTML de popup y newtab y tratarlos como entry points.
 *  - Empaquetar el service worker del background.
 *
 * El content script se genera aparte con esbuild (plugin `bundleContentScript`)
 * porque necesita ser un bundle IIFE autocontenido para inyección bajo demanda.
 */
export default defineConfig({
  plugins: [preact(), crx({ manifest, browser: TARGET }), bundleContentScript()],

  build: {
    target: 'es2022',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        popup: 'src/presentation/popup/index.html',
        dashboard: 'src/presentation/dashboard/index.html',
        // NOTA: el content script no se incluye aquí porque se genera
        // aparte con esbuild como bundle IIFE autocontenido.
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },

  esbuild: {
    legalComments: 'none',
  },

  resolve: {
    alias: {
      '@domain': '/src/domain',
      '@application': '/src/application',
      '@infrastructure': '/src/infrastructure',
      '@presentation': '/src/presentation',
    },
  },
});