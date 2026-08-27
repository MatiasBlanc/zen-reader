# Desarrollo — Zen Reader

Cómo configurar el entorno, ejecutar la extensión, depurar y empaquetar. Complementa a [`CONTRIBUTING.md`](../CONTRIBUTING.md) (que cubre el flujo de PRs e issues).

## Requisitos del sistema

- **Node.js** v20+ (https://nodejs.org)
- **npm** v10+ (incluido con Node.js)
- Un navegador: Chrome, Edge, Firefox o Zen Browser

## Scripts disponibles

| Script | Uso |
|---|---|
| `npm run dev` | Vite Dev Server con HMR para Chrome/Edge |
| `npm run build` | Build de producción (Chrome/Edge) en `dist/` |
| `npm run build:firefox` | Build + empaquetado `.xpi` en `dist/zen-reader.xpi` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run arch` | Verifica las reglas de arquitectura (dependency-cruiser) — corre en CI |

## Entorno de desarrollo

```bash
npm install
```

### Chrome / Edge (recomendado para iterar)

```bash
npm run dev
```

Vite compila con HMR: los cambios en `src/` se reflejan al recargar la extensión. Carga `dist/` como extensión sin empaquetar:

1. Abrir `chrome://extensions` o `edge://extensions`
2. Activar "Modo desarrollador"
3. "Cargar extensión sin empaquetar" → seleccionar la carpeta `dist/`

> Nota: con HMR a veces conviene recargar la extensión desde `chrome://extensions` (icono ↻) tras un cambio grande.

### Firefox / Zen Browser

Firefox no soporta HMR para Manifest V3 con `@crxjs` de la misma forma, así que se usa build watch + `web-ext`:

```bash
# Terminal 1: recompila dist/ al guardar cambios
npm run build:watch

# Terminal 2: inicia Firefox con hot reload
web-ext run -s dist
```

> **Nota**: Firefox no carga extensiones temporales desde directorios sueltos por un bug conocido con `_locales`. Siempre empaquetar como `.xpi` con `npm run build:firefox` y cargar desde `about:debugging#/runtime/this-firefox` → "Cargar complemento temporal".

## Depuración

- **Service worker (background)**: `chrome://extensions` → Zen Reader → "service worker" (o "Inspect views"). Ahí viven los logs del SW, incluido el notificador silencioso de errores de clip.
- **Content script / toast**: DevTools de la pestaña donde clippeas. El toast vive en un Shadow DOM (`attachShadow({ mode: 'closed' })`), así que no se ve en el árbol DOM normal; para inspeccionarlo, pon un breakpoint en `ToastNotification.tsx`.
- **Datos (IndexedDB)**: DevTools → Application → IndexedDB → `zen-reader`. Útil para limpiar datos de prueba o verificar migraciones de esquema.
- **Prefijos de build**: `vite.config.ts` usa variables de entorno (p. ej. `ZENREADER_TARGET=firefox`) para ajustar el manifest por navegador.

## Estructura del proyecto

```
src/
├── domain/          # entidades y funciones puras, sin dependencias externas
├── application/     # casos de uso y contratos (ports)
├── infrastructure/  # adaptadores: Dexie, Readability, notificaciones, DI
├── background/      # service worker (orquestación de eventos)
└── presentation/    # UI en Preact: clipper, popup, dashboard
```

Regla de dependencias: `presentation → application → domain`; `infrastructure` implementa los `ports`. Las decisiones de arquitectura y las excepciones conocidas se documentan en [docs/decisions/](decisions/README.md) (ADRs) y se verifican con `npm run arch`.

## Testing

Hoy el proyecto **no tiene suite de tests automatizada**. La verificación manual mínima antes de un PR:

- `npm run build` sin errores de TypeScript.
- Flujo completo: clippear (clic + atajo) → aparece en dashboard → abrir lector → marcar leído/archivar → eliminar.
- Ambos temas y los 3 tamaños de fuente en el lector.
- Cambio de idioma ES/EN.
- Si tocas el clipper: probar en al menos 2-3 sitios distintos (noticia, blog, docs técnica).

Si quieres introducir tests, es un cambio bienvenido: la Clean Architecture (dominio puro + ports) está pensada para que `domain/` y `application/` sean directamente testeables.

## Publicar un release (mantenedores)

El registro de cambios vive en **GitHub Releases**, no en un CHANGELOG manual.
Cada release es un tag en `main` con sus notas (semver).

1. Merge `develop` → `main`.
2. Asegúrate de que la versión de [`manifest.config.ts`](../manifest.config.ts)
   sea la que quieres publicar (es la que ven las stores); súbela si hace falta.
3. Etiqueta y crea el release:

   ```bash
   git switch main
   git pull
   git tag v1.0.0
   git push origin v1.0.0
   gh release create v1.0.0 --generate-notes
   ```

   `--generate-notes` arma las notas desde los PRs mergeados desde el último
   tag. En el **primer release** no hay PRs históricos que agrupar: edita las
   notas a mano.
4. Reutiliza el texto de las notas en AMO y Chrome Web Store.

> Regla: la versión de las stores (`manifest.config.ts`) y el tag deben
> coincidir siempre. `package.json` se mantiene sincronizada como referencia.

## Build para revisores de AMO (Firefox Add-ons)

### Requisitos

- **OS**: Windows, macOS o Linux
- **Node.js**: v20+ (https://nodejs.org)
- **npm**: v10+ (incluido con Node.js)

### Pasos para reproducir el build

```bash
# 1. Clonar el repositorio
git clone https://github.com/MatiasBlanc/zen-reader.git
cd zen-reader

# 2. Instalar dependencias
npm install

# 3. Build de la extensión (salida en dist/)
npm run build

# 4. (Opcional) Build para Firefox (salida: dist/zen-reader.xpi)
npm run build:firefox
```

La carpeta `dist/` contiene la extensión compilada. Ningún código está minificado.
