# ZenReader

Extensión de navegador minimalista de tipo "read-it-later". Guarda artículos con un clic y léelos después, cómodo y sin distracciones — 100% local, sin cuentas, sin backend.

## Por qué existe

Pocket cerró en julio de 2025. Omnivore cerró en noviembre de 2024. El mercado post-Pocket quedó con opciones que son o muy completas y de pago (Readwise Reader), o requieren auto-hospedar tu propio servidor (Wallabag). ZenReader apuesta por el extremo minimalista: instalar y usar, sin fricción, sin cuenta, sin que tus artículos salgan nunca de tu dispositivo.

## Filosofía

- **100% local y offline** — sin servidor, sin cuentas
- **Privado por diseño** — el contenido nunca sale del dispositivo
- **Minimalista** — sin organización compleja, sin feature bloat
- **Rápido** — carga instantánea, cero impacto en RAM durante la navegación normal

## Funcionalidades (V1)

- [ ] Clipper de 1 clic + atajo de teclado
- [ ] Limpieza de contenido con Readability.js (sin menús, ads ni trackers)
- [ ] Toast de confirmación no intrusivo
- [ ] Dashboard/New Tab con artículos pendientes y leídos
- [ ] Modo lector con tema papel (estilo Kindle) y tema oscuro técnico
- [ ] Marcar como leído / archivar / eliminar
- [ ] Persistencia local con IndexedDB (sin límite de tamaño)
- [ ] Español / Inglés

Fuera de alcance de la V1 (ver roadmap): tags, búsqueda, export a Markdown, progreso de lectura, IA.

## Stack tecnológico

| Capa                 | Tecnología                                |
| -------------------- | ----------------------------------------- |
| UI                   | Preact                                    |
| Bundler              | Vite + `@crxjs/vite-plugin`               |
| Estilos              | Tailwind CSS v4                           |
| Estado               | Zustand                                   |
| Persistencia         | Dexie.js (IndexedDB) + `unlimitedStorage` |
| Parsing de contenido | Readability.js (Mozilla)                  |
| Sanitización         | DOMPurify                                 |
| i18n                 | `chrome.i18n` nativo                      |
| Backend              | Ninguno — todo corre local                |

Entorno: Manifest V3, compatible con Chrome, Edge y Firefox/Zen Browser.

## Arquitectura

Clean Architecture con 4 capas, dependencias apuntando siempre hacia adentro:

```
src/
├── domain/          # entidades y funciones puras, sin dependencias externas
├── application/      # casos de uso y contratos (ports)
├── infrastructure/  # adaptadores: Dexie, Readability, notificaciones
├── background/       # service worker (orquestación de eventos)
└── presentation/     # UI en Preact: clipper, popup, dashboard
```

Regla: ningún componente de `presentation/` accede a Dexie directamente — siempre pasa por un caso de uso de `application/`.

Ver `docs/zenreader-spec-v1.md` para el detalle completo de arquitectura, modelo de datos, paleta de colores, tipografía y criterios de aceptación.

## Desarrollo

```bash
npm install

# Para Chrome/Edge (Vite Dev Server con HMR)
npm run dev

# Para Firefox / Zen Browser (Build Watch + web-ext)
# Terminal 1: Recompila dist/ al guardar cambios
npm run build:watch

# Terminal 2: Inicia Firefox con hot reload usando web-ext
web-ext run -s dist
```

El comando `dev` inicia Vite en modo watch con HMR para navegadores basados en Chromium. Para **Firefox**, debido al soporte de Manifest V3 y HMR, se recomienda usar `npm run build:watch` en combinación con `web-ext run -s dist`.

## Build y carga en el navegador

Para probar la extensión empaquetada:

```bash
npm run build
```

Luego carga la extensión según tu navegador:

- **Chrome/Edge**: 
  1. Abrir `chrome://extensions` o `edge://extensions`
  2. Activar "Modo desarrollador"
  3. "Cargar extensión sin empaquetar" → seleccionar la carpeta `dist/`

- **Firefox/Zen Browser**: 
  1. Empaquetar la extensión: `npm run build:firefox`
  2. Abrir `about:debugging#/runtime/this-firefox`
  3. "Cargar complemento temporal" → seleccionar `dist/zen-reader.xpi`

> **Nota**: Firefox no carga extensiones temporales desde directorios sueltos por un bug conocido con `_locales`. Siempre empaquetar como `.xpi`.

## Build Instructions (for AMO reviewers)

### System Requirements

- **OS**: Windows, macOS or Linux
- **Node.js**: v20+ (https://nodejs.org)
- **npm**: v10+ (included with Node.js)

### Steps to reproduce the build

```bash
# 1. Clone the repository
git clone https://github.com/MatiasBlanc/zen-reader.git
cd zen-reader

# 2. Install dependencies
npm install

# 3. Build the extension (Chrome/Edge output in dist/)
npm run build

# 4. (Optional) Build for Firefox (output: dist/zen-reader.xpi)
npm run build:firefox
```

The `dist/` folder contains the built extension. No code is minified.

## Roadmap

- **Pronto (extensión chica de V1):** 3 temas de lectura (Focus / Calm / Night) en vez de los 2 actuales.
- **V2:**
  - Tags manuales
  - Destacador (resaltar texto en el lector)
  - Búsqueda full-text
  - Export a Markdown
  - Bulk actions (marcar / archivar / eliminar varios artículos a la vez)
- **V3:**
  - Resumen con IA local (on-device) o API key propia (BYOK), con aviso explícito de privacidad
  - Auto-tagging asistido
- **V4:** RSS feeds — fase propia por el peso de permisos que añade.

Backlog sin fecha: sonido ambiente (Sound), progreso de lectura, importar desde Pocket/Instapaper, virtualización de listas.

## Licencia

MIT License. Ver `LICENSE` para más detalles.
