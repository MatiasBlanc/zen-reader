import { defineManifest } from '@crxjs/vite-plugin';

/**
 * Manifest V3 de ZenReader.
 * crxjs lee este fichero y genera el `manifest.json` final en el dist.
 * Referenciamos paths de origen; el plugin se encarga de resolver los bundles.
 */
export default defineManifest({
  manifest_version: 3,
  name: '__MSG_appName__',
  description: '__MSG_appDesc__',
  version: '1.0.0',
  default_locale: 'es',

  permissions: ['storage', 'unlimitedStorage', 'scripting', 'activeTab'],
  optional_permissions: [],

  commands: {
    'clip-article': {
      suggested_key: { default: 'Ctrl+Shift+S' },
      description: '__MSG_clipCommand__',
    },
  },

  action: {
    default_popup: 'src/presentation/popup/index.html',
    default_icon: {
      '16': 'public/icons/icon-16.png',
      '48': 'public/icons/icon-48.png',
      '128': 'public/icons/icon-128.png',
    },
  },

  background: {
    service_worker: 'src/background/service-worker.ts',
    scripts: ['src/background/service-worker.ts'],
    type: 'module',
  },

  icons: {
    '16': 'public/icons/icon-16.png',
    '48': 'public/icons/icon-48.png',
    '128': 'public/icons/icon-128.png',
  },

  // Obligatorio en Firefox MV3: sin esto Firefox rechaza el XPI como "dañado".
  browser_specific_settings: {
    gecko: {
      id: 'zen-reader@mblanc.dev',
      strict_min_version: '140.0',
      // Requerido por AMO: "none" indica que la extensión no recopila ningún dato.
      data_collection_permissions: {
        isExempt: true,
        required: ['none'],
      },
    },
  },
});