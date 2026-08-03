# ZenReader — Arquitectura del código fuente (`src/`)

Explicación de cada archivo y su responsabilidad dentro de la Clean Architecture.

---

## CAPA 1 — `src/domain/` (Dominio)

> **Regla:** esta capa no depende de nada externo. Solo tipos, interfaces y funciones puras.

---

### `src/domain/entities/article.ts`

Define el **modelo de datos central** de toda la app. Dos tipos:

- **`Article`** — la entidad completa que se persiste en IndexedDB. Tiene: `id` (UUID), `title`, `url`, `excerpt` (~150 chars para tarjetas), `contentHTML` (el HTML limpio), `savedAt` (timestamp), `isArchived` (boolean binario pendiente/leído).

- **`ArticleMetadata`** — un `Pick` del Artículo **sin** `contentHTML`. Se usa para listar tarjetas en el dashboard sin transferir megabytes de HTML. El contenido completo solo se carga bajo demanda al abrir el lector.

```typescript
// Lo esencial:
export type ArticleMetadata = Pick<
  Article, 'id' | 'title' | 'url' | 'excerpt' | 'savedAt' | 'isArchived'
>;
```

---

### `src/domain/entities/preferences.ts`

Modela las **preferencias del usuario** (una sola fila en la DB):

- `theme`: `'paper' | 'dark'` — los dos temas de lectura.
- `fontSize`: `'small' | 'medium' | 'large'` — 3 niveles ajustables.
- `language`: `'es' | 'en'` — idiomas soportados.

El `id` es siempre `'user'` (una única fila de preferencias).

---

### `src/domain/errors/article-errors.ts`

**Errores de dominio** con mensajes en español:

- **`ArticleNotFoundError`** — se lanza cuando se intenta operar sobre un artículo que no existe en la DB. Guarda el `articleId` para contexto.
- **`ArticleNotReadableError`** — se lanza cuando Readability no pudo extraer contenido legible de una página.

---

### `src/domain/services/reading-calculator.ts`

**Función pura** (sin efectos, sin dependencias) que estima minutos de lectura:

```typescript
export function estimateReadingMinutes(text: string): number
```

Cuenta palabras, divide por 200 ppm (palabras por minuto conservadoras para lectura profunda), redondea hacia arriba, mínimo 1. Es una utilidad de V2, pero está en el dominio como helper reutilizable.

---

### `src/domain/services/text-sanitizer.ts`

**Wrapper de DOMPurify** — la segunda barrera de seguridad contra XSS (Readability ya limpia bastante, esto es el seguro).

```typescript
export function sanitizeHtml(html: string): string
```

Configura DOMPurify para bloquear `script`, `style`, `iframe`, `object`, `embed`, `form`, `input`. Se usa en dos sitios: al extraer el contenido en el content script, y al cargarlo en el lector.

> ⚠️ Nota arquitectónica: DOMPurify necesita `window`, así que técnicamente viola "domain sin dependencias externas". Pero es un wrapper tan mínimo que la espec lo listó aquí.

---

## CAPA 2 — `src/application/` (Aplicación)

> **Regla:** define los **casos de uso** y los **contratos (ports)** que la infraestructura implementa. No conoce Dexie, no conoce el DOM.

---

### `src/application/ports/article-repository.port.ts`

**Contrato de persistencia** — la interfaz que la infraestructura (Dexie) implementa:

```typescript
export interface ArticleRepository {
  save(article: Article): Promise<void>;
  delete(articleId: string): Promise<void>;
  markAsRead(articleId: string, isArchived: boolean): Promise<void>;
  getLibrary(): Promise<ArticleMetadata[]>;
  getById(articleId: string): Promise<Article | undefined>;
  getPreferences(): Promise<UserPreferences | undefined>;
  savePreferences(preferences: UserPreferences): Promise<void>;
}
```

Los casos de uso dependen de esta interfaz, **no** de Dexie directamente.

---

### `src/application/ports/notifier.port.ts`

**Contrato de notificación** — cómo la app le dice al usuario "éxito" o "error":

```typescript
export interface Notifier {
  success(message: string): void;
  error(message: string): void;
}
```

En el dashboard se implementa con un toast DOM; en el service worker, con un notificador silencioso (console.error).

---

### `src/application/messaging/message-types.ts`

**Tipos de los mensajes** que se intercambian vía `chrome.runtime.sendMessage` entre las distintas partes de la extensión:

| Mensaje | Dirección | Propósito |
|---|---|---|
| `CLIP_EXTRACTED` | content script → background | Datos extraídos del artículo |
| `CLIP_ACTIVE_TAB` | popup → background | "Clippea la pestaña actual" |
| `CLIP_RESULT` | background → content script | Respuesta con éxito/error |
| `OPEN_LIBRARY` | popup → background | "Abre la biblioteca en nueva pestaña" |
| `GET_PREFERENCES` | UI → background | Leer preferencias |

Cada tipo es una interfaz con un discriminante `type` para pattern matching.

---

### `src/application/use-cases/clip-article.use-case.ts`

**Caso de uso principal: guardar un artículo.**

```
Entrada → { title, url, contentHTML }
Salida  → Article persistido
```

Flujo:
1. Valida que `contentHTML` no esté vacío (si lo está → `ArticleNotReadableError`).
2. Genera un UUID con `crypto.randomUUID()`.
3. Calcula el `excerpt` (primeros ~150 caracteres del texto plano, quitando HTML).
4. Guarda en el repositorio.
5. Notifica éxito al usuario.

La función `stripHtml` interna convierte HTML a texto plano con regex (suficiente para un excerpt; el renderizado real sanitiza por DOMPurify).

---

### `src/application/use-cases/mark-as-read.use-case.ts`

Cambia el estado binario de un artículo (pendiente ⇄ leído). Primero verifica que el artículo existe (lanza `ArticleNotFoundError` si no), luego delega en `repository.markAsRead`.

---

### `src/application/use-cases/delete-article.use-case.ts`

Elimina un artículo definitivamente. Misma estructura: verifica existencia, luego `repository.delete`.

---

### `src/application/use-cases/get-library.use-case.ts`

Dos métodos:

- **`getLibrary()`** — devuelve solo metadata ligera (sin `contentHTML`) para pintar tarjetas.
- **`getArticle(id)`** — devuelve el artículo completo con el HTML **resanificado** (defensa en profundidad) antes de exponerlo a la UI.

---

### `src/application/use-cases/update-preferences.use-case.ts`

Gestiona las preferencias del usuario:

- **`get()`** — devuelve las preferencias persistidas o las **por defecto** (`DEFAULT_PREFERENCES`) la primera vez.
- **`update(partial)`** — merge parcial sobre las existentes y persiste.

```typescript
export const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'user',
  theme: 'paper',
  fontSize: 'medium',
  language: 'es',
};
```

---

## CAPA 3 — `src/infrastructure/` (Infraestructura)

> **Regla:** implementa los **ports** definidos en `application`. Es el único lugar que conoce Dexie, Readability, DOMPurify, Chrome APIs.

---

### `src/infrastructure/persistence/dexie-article.repository.ts`

**Implementación concreta** de `ArticleRepository` sobre Dexie/IndexedDB:

```typescript
class ZenReaderDB extends Dexie {
  articles!: Table<Article, string>;
  preferences!: Table<UserPreferences, string>;

  constructor() {
    super('zen-reader');
    this.version(1).stores({
      articles: 'id, savedAt, isArchived',  // índices
      preferences: 'id',
    });
  }
}
```

Métodos clave:
- `getLibrary()` — ordena por `savedAt` descendente y **proyecta** a `ArticleMetadata` (descarta `contentHTML`).
- `savePreferences()` — usa `await db.preferences.put(...)` para devolver `Promise<void>`.

---

### `src/infrastructure/parser/readability.parser.ts`

**Wrapper de Readability.js** (la misma librería de Firefox Reader View):

```typescript
export function parseReadableDocument(sourceDocument: Document): ParsedArticle | null
```

1. Clona el documento (no muta el DOM visible).
2. Pasa el clon a `new Readability(clone).parse()`.
3. Si hay contenido, devuelve `{ title, url, contentHTML }`.
4. Si no → `null`.

Se ejecuta **dentro del content script** (tiene acceso al DOM de la página).

---

### `src/infrastructure/notifications/chrome-toast.notifier.ts`

**Implementación de `Notifier`** para páginas de la extensión (popup/dashboard). Crea un `<div>` flotante en la esquina superior derecha con transiciones CSS:

```typescript
export class ChromeToastNotifier implements Notifier {
  success(message) { this.show(message, 'success'); }
  error(message)   { this.show(message, 'error'); }
}
```

El toast se auto-oculta a los 3 segundos. No bloquea clics (`pointerEvents: 'none'`).

---

### `src/infrastructure/di/container.ts`

**Composition Root** — el único punto de la app que conoce las implementaciones concretas (Dexie, ChromeToastNotifier) y las inyecta en los casos de uso:

```typescript
export function createContainer(notifier: Notifier): ApplicationContainer {
  const repository = new DexieArticleRepository();
  return {
    clipArticle: new ClipArticleUseCase(repository, notifier),
    markAsRead: new MarkAsReadUseCase(repository),
    deleteArticle: new DeleteArticleUseCase(repository),
    library: new GetLibraryUseCase(repository),
    preferences: new UpdatePreferencesUseCase(repository),
  };
}
```

**Ningún componente Preact importa Dexie** — siempre pasa por esta fachada.

---

## CAPA 4 — `src/presentation/` (UI)

---

### `src/presentation/clipper/content-script.tsx`

**El corazón del clipper.** Se inyecta bajo demanda en la pestaña activa. Flujo:

1. Ejecuta `parseReadableDocument(document)` → extrae el artículo.
2. Si no hay artículo → muestra toast de error y termina.
3. Sanitiza el HTML con `sanitizeHtml()`.
4. Envía `CLIP_EXTRACTED` al background vía `chrome.runtime.sendMessage`.
5. Espera la respuesta (`CLIP_RESULT`).
6. Muestra un toast (éxito/error) dentro de un **Shadow DOM** para aislar estilos.

El Shadow DOM se crea con `attachShadow({ mode: 'closed' })` y un `<style>` inline. Esto impide que los estilos de la página interfieran con el toast y viceversa.

---

### `src/presentation/clipper/ToastNotification.tsx`

**Componente Preact** del toast del clipper. Recibe `kind` (success/error), `message` y `onDone`. Usa `useEffect` para auto-ocultarse a los 3 segundos.

Renderiza:
```
┌─────────────────────┐
│ ✓ Artículo guardado  │
└─────────────────────┘
```

Con icono circular (✓ o ✕), mensaje y animación de entrada.

---

### `src/presentation/clipper/toast-types.ts`

Tipo `ToastKind = 'success' | 'error'` compartido entre el content script y el componente.

---

### `src/presentation/popup/index.html`

HTML del popup. Ancho fijo 320px vía clases Tailwind en `PopupApp` (`w-[320px]`), fondo claro.

---

### `src/presentation/popup/main.tsx`

Punto de entrada del popup. Importa el CSS global (`src/index.css`) y renderiza `<PopupApp />` en `#app`.

### `src/presentation/popup/PopupApp.tsx`

**UI del popup.** Dos estados:

- **Normal**: muestra "ZenReader", contador de pendientes, botón "Guardar esta página" y "Ver biblioteca".
- **Clipando**: botón deshabilitado con texto "Guardando…".

Al hacer clic en "Guardar":
1. Envía `CLIP_ACTIVE_TAB` al background.
2. El background inyecta el content script.
3. El popup muestra un toast con el resultado.
4. Actualiza el contador de pendientes.

---

### `src/presentation/dashboard/index.html`

HTML del dashboard (reemplaza New Tab). Incluye:
- Google Fonts: **Literata** (serif para lectura) y **JetBrains Mono** (monoespaciada para metadatos técnicos).

---

### `src/presentation/dashboard/main.tsx`

Punto de entrada del dashboard. Importa el CSS global (`src/index.css`) y renderiza `<DashboardApp />`.

### `src/presentation/dashboard/store.ts`

**Store de Zustand** — el estado centralizado del dashboard:

```typescript
interface AppState {
  // Biblioteca
  articles: ArticleMetadata[];
  loading: boolean;
  fetchLibrary: () => Promise<void>;

  // Acciones
  archiveArticle: (id, isArchived) => Promise<void>;
  deleteArticle: (id) => Promise<void>;

  // Lector
  readerArticleId: string | null;
  readerArticle: Article | null;
  openReader: (id) => Promise<void>;
  closeReader: () => void;

  // Preferencias
  preferences: UserPreferences;
  updatePreferences: (partial) => Promise<void>;
}
```

Cada acción delega en los casos de uso del contenedor. Las actualizaciones de lista son **optimistas** (actualizan el estado local antes de que termine la DB).

---

### `src/presentation/dashboard/hooks/useArticles.ts`

**Hook personalizado** que suscribe componentes al store y dispara la carga inicial:

```typescript
export function useArticles() {
  // ...carga inicial con useEffect
  return { articles, pending, archived, loading, archiveArticle, deleteArticle };
}
```

Separa automáticamente los artículos en `pending` y `archived` con `useMemo`.

---

### `src/presentation/dashboard/DashboardApp.tsx`

**Componente raíz del dashboard.** Decide qué mostrar:

1. **Si hay un artículo abierto** → renderiza `<ReaderView />`.
2. **Si hay artículos** → secciones "Pendientes" y "Leídos" con tarjetas en grid responsive (1-2 columnas).
3. **Si no hay artículos** → estado vacío con emoji 📖 y atajo de teclado.

Aplica la clase `theme-paper` o `theme-dark` al `<html>` globalmente según las preferencias.

---

### `src/presentation/dashboard/components/ArticleCard.tsx`

**Tarjeta de artículo** en el listado. Muestra:
- Título (semibold)
- Excerpt (2 líneas truncadas con `line-clamp-2`)
- Dominio de origen (extraído de la URL)
- Fecha relativa ("hace 2 días", "ayer", "ahora")
- Botones: ✓ (marcar leído) y × (eliminar)

Al hacer clic en la tarjeta → abre el lector. Los botones usan `e.stopPropagation()` para no propagar el clic.

---

### `src/presentation/dashboard/components/ReaderView.tsx`

**Modo lector inmersivo.** Layout:

```
┌──────────────────────────────────────────────────────────┐
│ ← Volver          [toggle tema] [✓ Leído] [× Eliminar]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Título del artículo                                    │
│                                                          │
│   Contenido del artículo renderizado                     │
│   con tipografía Literata, ancho máx 680px               │
│   y el tamaño de fuente seleccionado                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- Usa `dangerouslySetInnerHTML` con el HTML **ya sanitizado**.
- El tamaño de fuente se aplica con clases Tailwind (`text-base`/`text-lg`/`text-xl`).
- Escape cierra el lector.
- Estilos de contenido usan `prose` de Tailwind Typography con variables CSS del tema.

---

### `src/presentation/dashboard/components/ThemeToggle.tsx`

**Interruptor visual** entre tema papel y oscuro. Un `<button role="switch">` con un círculo deslizante. Actualiza las preferencias vía el store.

---

### `src/index.css`

**Único archivo CSS del proyecto** (importado por popup y dashboard):

- `@import "tailwindcss"` + `@plugin "@tailwindcss/typography"`.
- Define los **tokens de tema** (`.theme-paper` / `.theme-dark`) como variables `--zen-*`.
- Mapea los tokens a utilidades Tailwind vía `@theme` (p. ej. `--color-accent: var(--zen-accent)` → `bg-accent`, `text-accent`).
- Fuentes base (`--font-sans: Inter`, `--font-mono: JetBrains Mono`) y scrollbars finos.

Los componentes usan **solo utilidades Tailwind**; no existen clases CSS propias.

---

## Archivos raíz de `src/`

### `src/background/service-worker.ts`

**Service Worker** — el cerebro orquestador. Escucha:

| Evento | Acción |
|---|---|
| `chrome.commands.onCommand('clip-article')` | Inyecta content script en pestaña activa |
| `CLIP_EXTRACTED` (mensaje) | Ejecuta `clipArticle.use-case`, responde con resultado |
| `CLIP_ACTIVE_TAB` (mensaje) | Inyecta content script (desde popup) |
| `OPEN_LIBRARY` (mensaje) | Abre dashboard en nueva pestaña |
| `GET_PREFERENCES` (mensaje) | Devuelve preferencias |

El notificador es **silencioso** (solo `console.error`) porque el SW no tiene DOM.

---

### `src/css.d.ts`

Declaración de tipos para importaciones de CSS side-effect (`import '../index.css'`). Evita errores de TypeScript.

---

## Resumen visual de dependencias

```
presentation → application → domain
                  ↑
            infrastructure (implementa ports)
```

```
popup ──────┐
dashboard ──┤──→ container.ts ──→ use-cases ──→ repository port
            │                          ↑                    ↑
            │                     domain entities      infrastructure
            │                                         (Dexie, Readability)
            │
content-script ──→ Readability + DOMPurify ──→ background ──→ use-cases
```
