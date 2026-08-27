# Zen Reader

Extensión de navegador minimalista de tipo "read-it-later". Guarda artículos con un clic y léelos después, cómodo y sin distracciones — 100% local, sin cuentas, sin backend.

## Por qué existe

Pocket cerró en julio de 2025. Omnivore cerró en noviembre de 2024. El mercado post-Pocket quedó con opciones que son o muy completas y de pago (Readwise Reader), o requieren auto-hospedar tu propio servidor (Wallabag). Zen Reader apuesta por el extremo minimalista: instalar y usar, sin fricción, sin cuenta, sin que tus artículos salgan nunca de tu dispositivo.

## Filosofía

- **100% local y offline** — sin servidor, sin cuentas
- **Privado por diseño** — el contenido nunca sale del dispositivo
- **Minimalista** — sin organización compleja, sin feature bloat
- **Rápido** — carga instantánea, cero impacto en RAM durante la navegación normal

## Funcionalidades

Estado de V1 y roadmap de V2/V3/V4 (trackeado en issues de GitHub) en [`docs/roadmap.md`](docs/roadmap.md).

## Documentación

La documentación del proyecto está indexada en [`docs/README.md`](docs/README.md):

| Documento | Contenido |
|---|---|
| [docs/roadmap.md](docs/roadmap.md) | Features de V1 y plan V2/V3/V4, enlazado a issues y milestones |
| [docs/development.md](docs/development.md) | Entorno de desarrollo, debugging y build para AMO |
| [docs/decisions/](docs/decisions/) | ADRs — decisiones de arquitectura con contexto |
| [docs/spec/v1.md](docs/spec/v1.md) | Spec histórica de desarrollo de la V1 (detalle de arquitectura, modelo de datos, paleta, criterios de aceptación) |

## Contribuir

Lee [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de abrir tu primer PR. Para proponer una feature usa el [feature request form](.github/ISSUE_TEMPLATE/feature_request.yml): nace como issue con milestone, no como línea de un markdown.

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

## Estructura del Proyecto

El repositorio está organizado como un monorepo:

- **[`app/`](app/)**: Código fuente de la extensión de navegador (Manifest V3, Clean Architecture, Preact + Tailwind).
- **[`web/`](web/)**: Landing page oficial de alta velocidad y optimizada para SEO ([`zen-reader.madeinchile.tech`](https://zen-reader.madeinchile.tech/)).

## Arquitectura de la extensión (`app/`)

Clean Architecture con 4 capas, dependencias apuntando siempre hacia adentro:

```
app/src/
├── domain/          # entidades y funciones puras, sin dependencias externas
├── application/      # casos de uso y contratos (ports)
├── infrastructure/  # adaptadores: IndexedDB, Readability, notificaciones
├── background/       # service worker (orquestación de eventos)
└── presentation/     # UI en Preact: clipper, popup, dashboard
```

Regla: ningún componente de `presentation/` accede al almacenamiento directamente — siempre pasa por un caso de uso de `application/`.

> Estas reglas **se verifican automáticamente** con `dependency-cruiser` (`npm run arch`, corre en CI): un PR que las rompa falla.

Las decisiones de arquitectura se documentan en [`docs/decisions/`](docs/decisions/README.md) (ADRs); la spec histórica de la V1 está en [`docs/spec/v1.md`](docs/spec/v1.md).

## Desarrollo

```bash
npm install

# ── Extensión (app) ──
npm run dev:app       # Vite Dev Server con HMR (Chrome/Edge)
npm run build:app     # Compilar extensión en app/dist
npm run build:firefox # Empaquetar .xpi para Firefox / Zen Browser
npm run arch          # Verificar arquitectura con dependency-cruiser

# ── Landing Page (web) ──
npm run dev:web       # Vite Dev Server para la landing page
npm run build:web     # Compilar landing page estática en web/dist
```

## Build y carga en el navegador

Para compilar todo el proyecto:

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

## Build para revisores de AMO

Instrucciones de build reproducibles (requisitos de sistema y pasos) en [`docs/development.md`](docs/development.md#build-para-revisores-de-amo-firefox-add-ons).


## Licencia

MIT License. Ver `LICENSE` para más detalles.
