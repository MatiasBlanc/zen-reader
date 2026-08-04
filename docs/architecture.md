# ZenReader — Arquitectura del código fuente (`src/`)

> **Este documento describe lo que cambia poco** (capas, reglas de dependencia,
> flujos). El detalle fino de cada archivo vive en sus **JSDoc/comentarios del
> propio código**, no aquí. Por eso no se desactualiza:
>
> - Las **reglas de capas se verifican en CI** con `dependency-cruiser`
>   (`npm run arch`). Si un PR las rompe, el CI falla.
> - El **grafo de dependencias** al final se regenera con `npm run arch:graph`
>   (mermaid, renderizado por GitHub).
> - Las **decisiones** de arquitectura se registran en
>   [docs/decisions/](decisions/README.md) (ADRs), nunca se editan aquí.

---

## Regla de dependencias (verificada en CI)

```
domain → application → presentation/background
               ↑
     infrastructure (implementa ports)
```

- **`domain/`** — entidades y funciones puras. No importa nada externo ni otras capas.
- **`application/`** — casos de uso y contratos (ports). Conoce `domain`; no conoce infraestructura ni UI.
- **`infrastructure/`** — implementaciones concretas de los ports (Dexie, Readability, notificaciones, sonido) y el **composition root** (`di/container.ts`). Solo `di/container.ts` se importa desde fuera de `infrastructure`.
- **`presentation/`** y **`background/`** — UI y service worker. Solo consumen casos de uso vía el container.

Regla estricta: **ningún componente de `presentation/` importa Dexie**; todo
pasa por un caso de uso de `application/` inyectado desde el container.

La verificación vive en [`.dependency-cruiser.cjs`](../.dependency-cruiser.cjs):
`npm run arch` falla si se rompe una regla. Las excepciones conocidas están
listadas como deuda técnica al final de este documento.

## Grafo de dependencias (generado)

El siguiente diagrama se regenera con `npm run arch:graph`; no lo edites a mano:

<!-- GENERADO: no editar a mano. Regenerar con `npm run arch:graph`. -->
[Ver grafo completo](architecture-graph.md)

## Capas y archivos clave

> Detalle por archivo: ver los JSDoc en el código. Aquí solo el mapa.

### `src/domain/` — sin dependencias externas

| Archivo | Responsabilidad |
|---|---|
| `entities/article.ts` | Modelo central: `Article` (persistido) y `ArticleMetadata` (sin `contentHTML`, para listar) |
| `entities/preferences.ts` | Preferencias: tema, tamaño de fuente, idioma (fila única `id: 'user'`) |
| `errors/article-errors.ts` | Errores de dominio con mensajes en español (`ArticleNotFoundError`, `ArticleNotReadableError`) |
| `services/reading-calculator.ts` | Función pura: minutos estimados de lectura |
| `services/text-sanitizer.ts` | Wrapper de DOMPurify (excepción aceptada en ADR-0001) |

### `src/application/` — casos de uso y contratos

| Archivo | Responsabilidad |
|---|---|
| `ports/article-repository.port.ts` | Contrato de persistencia que implementa Dexie |
| `ports/notifier.port.ts` | Contrato de notificaciones (toast / silencioso en SW) |
| `ports/sound-player.port.ts` | Contrato de sonidos de interacción (implementado con Cuelume) |
| `messaging/message-types.ts` | Tipos de mensajes entre content script / background / popup / dashboard |
| `use-cases/clip-article.use-case.ts` | Guardar un artículo (validación, UUID, excerpt, persistir, notificar) |
| `use-cases/mark-as-read.use-case.ts` | Cambiar estado pendiente ⇄ leído |
| `use-cases/delete-article.use-case.ts` | Eliminar artículo |
| `use-cases/get-library.use-case.ts` | Listado ligero + carga del artículo completo (resanificado) |
| `use-cases/update-preferences.use-case.ts` | Leer/actualizar preferencias (merge parcial, defaults) |

### `src/infrastructure/` — adaptadores al mundo exterior

| Archivo | Responsabilidad |
|---|---|
| `persistence/dexie-article.repository.ts` | Implementación de `ArticleRepository` sobre IndexedDB |
| `parser/readability.parser.ts` | Wrapper de Readability.js (se ejecuta en el content script) |
| `notifications/chrome-toast.notifier.ts` | Toast DOM para popup/dashboard |
| `sound/cuelume-sound-player.ts` | Sonidos de éxito/error con Cuelume |
| `di/container.ts` | **Composition root** — único punto que conoce las implementaciones concretas |

### `src/presentation/` y `src/background/` — UI y orquestación

| Archivo | Responsabilidad |
|---|---|
| `clipper/content-script.tsx` | Extrae con Readability, sanitiza y envía el artículo al background |
| `clipper/ToastNotification.tsx` | Toast del clipper en Shadow DOM |
| `popup/PopupApp.tsx` | Popup: guardar página, ver biblioteca, contador de pendientes |
| `dashboard/DashboardApp.tsx` | Raíz del dashboard: lector, sidebar con listas, estado vacío |
| `dashboard/store.ts` | Store de Zustand: biblioteca, lector, preferencias (acciones optimistas) |
| `dashboard/hooks/useArticles.ts` | Suscripción al store y carga inicial |
| `dashboard/components/` | `ArticleCard`, `ReaderView`, `ThemeToggle`, `Sidebar` |
| `icons.ts` | Iconos (reicon-react), compartidos por popup y dashboard |
| `background/service-worker.ts` | Orquesta comandos, inyección del clipper y mensajes |

## Flujos principales

### Clip (guardar artículo)

1. Clic en el icono, atajo (`Ctrl+Shift+S`) o botón del popup.
2. El service worker inyecta el content script en la pestaña activa
   (`chrome.scripting.executeScript`; ver ADR-0002).
3. El content script ejecuta Readability, sanitiza con DOMPurify y envía
   `CLIP_EXTRACTED` al background.
4. El caso de uso `clipArticle` valida, persiste vía el repositorio y notifica.
5. Toast de éxito/error dentro de un Shadow DOM (no interfiere con la página).

### Lectura

1. Abrir dashboard (New Tab) o "Ver biblioteca".
2. `getLibrary()` trae solo metadatos ligeros (sin `contentHTML`).
3. Al abrir una tarjeta se carga el artículo completo **resanificado** y se
   renderiza en `ReaderView` con el tema y tamaño de fuente elegidos.

## Deuda técnica (violaciones permitidas)

Registradas en `.dependency-cruiser.cjs` (regla `ui-no-importa-infra-salvo-container`,
campo `pathNot`) y en [`docs/roadmap.md`](roadmap.md). Son importaciones directas
de `presentation/` a `infrastructure/` que deberían pasar por un port:

- `content-script.tsx → parser/readability.parser.ts` — el clipper usa Readability
  sin port. Fix: extraer `parser.port.ts` e implementarlo en `infrastructure`.
- `store.ts → notifications/chrome-toast.notifier.ts` — el store instancia el
  notifier directo. Fix: inyectarlo vía el container.

> Regla de oro: **no añadas excepciones nuevas** a `pathNot` sin abrir un issue.
> Al resolver la deuda, elimina la excepción y la regla vuelve a cubrir el caso.

## Cómo mantener esto actualizado

1. **Cambiaste la estructura de capas** (nuevo directorio, nueva dependencia
   entre capas): corre `npm run arch`; si falla, o arreglas la violación o
   documentas la excepción con issue. Si es una decisión de arquitectura, crea
   un ADR en `docs/decisions/`.
2. **Añadiste/quitaste archivos**: el grafo se actualiza solo con
   `npm run arch:graph` (cierra el PR regenerándolo si cambia la estructura).
3. **Cambiaste responsabilidades de un archivo**: actualiza los JSDoc del
   código, no este documento.
