# ZenReader — Especificación Técnica Completa (V1)

> Prompt/spec de desarrollo para construir la extensión desde cero hasta una primera versión funcional. Diseñado para ser usado como contexto en Claude Code, Cursor, o como documento de referencia del proyecto.

---

## 1. Resumen del proyecto

**ZenReader** es una extensión de navegador minimalista de tipo "Read-it-later" (guardar artículos para leer después) que elimina la fricción entre descubrir contenido web y consumirlo de forma cómoda, privada y sin distracciones.

**Filosofía del producto:**
- 100% local y offline — sin backend, sin cuentas, sin servidores propios
- Privacidad radical — el contenido del usuario nunca sale de su dispositivo
- Minimalista — sin feature bloat, sin organización compleja
- Rápido — carga instantánea, cero impacto en RAM durante la navegación normal

**Dos módulos integrados en una sola extensión:**
1. **El Capturador (Clipper):** content script que limpia el DOM de la página actual y extrae título, URL y texto puro del artículo, en 1 clic o atajo de teclado.
2. **El Lector/Dashboard:** interfaz a pantalla completa (reemplaza New Tab o se abre desde el popup) para gestionar artículos pendientes/leídos, con un entorno de lectura estilo e-reader.

---

## 2. Alcance de la V1 (MVP)

**Objetivo de la V1:** que una persona pueda clippear un artículo y leerlo cómodo, offline. Nada más. Resistir la tentación de agregar features de V2/V3.

### Incluido en V1
- Clipper de 1 clic desde el icono de la extensión
- Atajo de teclado configurable para clippear
- Limpieza de contenido con Readability.js (quita menús, ads, trackers)
- Toast flotante de confirmación (sin interrumpir la navegación)
- Dashboard/New Tab con lista de artículos: pendientes + leídos
- Modo lector inmersivo con dos temas: "papel" (estilo Kindle) y "oscuro técnico"
- Marcar artículo como leído/archivado (estado binario simple)
- Eliminar artículo
- Persistencia 100% local con IndexedDB (Dexie) + `unlimitedStorage`
- Internacionalización: Español / Inglés
- Popup con acceso rápido (clippear la pestaña activa, ir al dashboard)

### Explícitamente fuera de la V1 (queda para V2/V3)
- Tags, carpetas, colecciones
- Búsqueda full-text
- Progreso de lectura / posición de scroll guardada
- Tiempo estimado de lectura
- Exportar a Markdown
- Importar desde Pocket/Instapaper
- Detección de duplicados
- Resaltados/highlights
- Cualquier funcionalidad de IA (resumen, auto-tagging, chat con artículo)
- Sonidos de interacción (Cuelume u otro)
- Sync entre dispositivos

---

## 3. Stack tecnológico

| Capa | Elección | Justificación breve |
|---|---|---|
| **UI** | Preact + `preact/hooks` | API compatible con React (curva de aprendizaje cero si ya sabes React), ~3KB vs ~45KB de React, carga instantánea en popup/newtab |
| **Bundler** | Vite + `@crxjs/vite-plugin` | Único plugin maduro que resuelve HMR para content scripts y auto-genera el manifest desde el build, sin configurarlo a mano |
| **Estilos** | Tailwind CSS | Iteración rápida de los dos temas de lectura vía variables CSS; JIT purga todo lo no usado |
| **Estado** | Zustand (o Preact Signals) | Store mínimo, sin boilerplate de Redux — innecesario para el tamaño de esta app |
| **Persistencia** | Dexie.js sobre IndexedDB | API basada en promesas, manejo de versionado/migraciones de esquema, mucho menos propenso a bugs generados por IA que IndexedDB nativo |
| **Parsing de contenido** | Readability.js (Mozilla) | Estándar de facto — la misma librería que usa Firefox Reader View |
| **Sanitización HTML** | DOMPurify | Obligatorio: el HTML viene de páginas de terceros, nunca se inyecta sin sanitizar (riesgo XSS) |
| **Validación** | Zod (opcional en V1) | Solo si hay inputs de usuario que validar; en V1 el modelo de datos es simple, se puede omitir |
| **i18n** | `chrome.i18n` nativo | API del navegador, sin librería externa |
| **Backend** | Ninguno | Todo corre en el dispositivo del usuario. No hay servidor, no hay API propia, no hay cuentas |
| **Base de datos** | IndexedDB (vía Dexie) + permiso `unlimitedStorage` | Evita el límite de ~5-10MB de `localStorage`/IndexedDB por defecto; soporta cientos de artículos completos |

**Entorno:** Manifest V3, compatible con Chrome, Edge y Firefox/Zen Browser (verificar compatibilidad de `unlimitedStorage` y `scripting` API en Firefox MV3 al implementar).

---

## 4. Arquitectura (Clean Architecture)

Separación estricta de responsabilidades: el dominio no depende de nada externo, la infraestructura implementa contratos definidos por el dominio/aplicación, la UI solo consume casos de uso.

```
zen-reader/
├── manifest.json
├── package.json
├── vite.config.ts
├── public/
│   └── icons/
│       ├── icon-16.png
│       ├── icon-48.png
│       └── icon-128.png
├── _locales/
│   ├── en/messages.json
│   └── es/messages.json
│
└── src/
    ├── domain/                          # CAPA 1 — sin dependencias externas
    │   ├── entities/
    │   │   ├── article.ts               # tipo Article (id, title, url, content, excerpt, status, savedAt)
    │   │   └── preferences.ts           # tipo UserPreferences (tema, tamaño de fuente)
    │   ├── errors/
    │   │   └── article-errors.ts        # ArticleNotFoundError, DuplicateArticleError, etc.
    │   └── services/
    │       ├── reading-calculator.ts    # función pura: minutos de lectura estimados
    │       └── text-sanitizer.ts        # wrapper de DOMPurify, función pura
    │
    ├── application/                     # CAPA 2 — casos de uso y contratos
    │   ├── ports/
    │   │   ├── article-repository.port.ts
    │   │   └── notifier.port.ts
    │   ├── messaging/
    │   │   └── message-types.ts         # tipos de mensajes entre content-script/background/popup/dashboard
    │   └── use-cases/
    │       ├── clip-article.use-case.ts
    │       ├── mark-as-read.use-case.ts
    │       ├── delete-article.use-case.ts
    │       └── get-library.use-case.ts
    │
    ├── infrastructure/                  # CAPA 3 — adaptadores al mundo exterior
    │   ├── persistence/
    │   │   └── dexie-article.repository.ts
    │   ├── parser/
    │   │   └── readability.parser.ts
    │   ├── notifications/
    │   │   └── chrome-toast.notifier.ts
    │   └── di/
    │       └── container.ts             # composition root: instancia repos/adapters e inyecta en use-cases
    │
    ├── background/
    │   └── service-worker.ts            # orquesta comandos, clics del icono, mensajes
    │
    └── presentation/                    # CAPA 4 — UI (Preact)
        ├── clipper/
        │   ├── content-script.ts
        │   └── ToastNotification.tsx
        ├── popup/
        │   ├── PopupApp.tsx
        │   └── main.tsx
        ├── dashboard/
        │   ├── components/
        │   │   ├── ArticleCard.tsx
        │   │   ├── ReaderView.tsx
        │   │   └── ThemeToggle.tsx
        │   ├── hooks/
        │   │   └── useArticles.ts
        │   ├── DashboardApp.tsx
        │   └── main.tsx
        └── ../index.css   (único CSS: Tailwind + tokens de tema)
```

**Regla de dependencia:** `presentation` → `application` → `domain`. `infrastructure` implementa los `ports` definidos en `application`, nunca al revés. Ningún componente Preact importa Dexie directamente — siempre pasa por un use case.

---

## 5. Modelo de datos (esquema Dexie)

```typescript
// domain/entities/article.ts
interface Article {
  id: string;                // uuid
  title: string;
  url: string;
  excerpt: string;           // ~150 caracteres, para las tarjetas
  contentHTML: string;       // HTML limpio de Readability.js, sanitizado con DOMPurify
  savedAt: number;           // timestamp
  isArchived: boolean;       // false = pendiente, true = leído/archivado
}

// domain/entities/preferences.ts
interface UserPreferences {
  theme: 'paper' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  language: 'es' | 'en';
}
```

```javascript
// infrastructure/persistence/dexie-article.repository.ts
db.version(1).stores({
  articles: 'id, savedAt, isArchived',
  preferences: 'id'
});
```

**Nota de diseño:** el listado (dashboard) solo debe consultar metadatos ligeros (`title`, `excerpt`, `savedAt`, `isArchived`) para renderizar tarjetas — el `contentHTML` completo se carga bajo demanda solo al abrir el artículo en modo lector. Esto evita transferir megabytes innecesarios al pintar la lista.

---

## 6. Flujo de funcionamiento

### Flujo de clip (guardar artículo)
1. Usuario hace clic en el icono de la extensión o usa el atajo de teclado.
2. `background/service-worker.ts` recibe el evento (`chrome.action.onClicked` o `chrome.commands.onCommand`).
3. El Service Worker inyecta el content script en la pestaña activa vía `chrome.scripting.executeScript` (**no** declarado como content script permanente en el manifest — cero costo mientras el usuario navega normalmente).
4. El content script ejecuta Readability.js sobre el DOM actual, extrae `title`, `url`, `contentHTML`.
5. El resultado se sanitiza con DOMPurify.
6. Se envía vía mensaje al `clip-article.use-case.ts`, que guarda el artículo en Dexie a través del repositorio.
7. Se muestra el toast flotante de confirmación (éxito o error) sin bloquear la interacción del usuario con la página.

### Flujo de lectura
1. Usuario abre una nueva pestaña (reemplaza `chrome://newtab`) o hace clic en "Ver biblioteca" desde el popup.
2. `DashboardApp.tsx` invoca `get-library.use-case.ts`, que trae solo metadatos de Dexie.
3. Se renderizan las tarjetas (`ArticleCard.tsx`), separadas en pendientes/leídos.
4. Al hacer clic en una tarjeta, se carga el `contentHTML` completo de ese artículo específico y se abre `ReaderView.tsx`.
5. El usuario puede alternar tema (papel/oscuro) y marcar como leído/eliminar desde ahí.

---

## 7. Diseño UX/UI

### Principios de diseño
- Cero elementos decorativos que no aporten función
- Máxima legibilidad por encima de la estética
- Transiciones sutiles, nunca llamativas (nada que compita con el texto)
- El modo lector debe sentirse como un e-reader físico, no como una app web

### Tipografía

| Uso | Fuente recomendada | Razón |
|---|---|---|
| **Texto de lectura (artículos)** | Literata (Google Fonts) — o alternativa: Lora | Serif diseñada específicamente para pantallas y modo lectura prolongada (usada por Google Play Books) |
| **UI general (dashboard, popup, botones)** | Inter, o `system-ui` como fallback | Alta legibilidad en tamaños pequeños, neutral, no compite con el contenido |
| **Modo oscuro técnico (opcional, monoespaciada para metadata)** | JetBrains Mono o similar, solo para timestamps/metadatos técnicos si se usa | Refuerza el carácter "técnico" del tema oscuro sin usarse en el cuerpo del texto |

**Tamaños base sugeridos (modo lector):**
- Cuerpo de texto: 18-20px, line-height 1.6-1.75
- Ancho de columna máximo: ~680px (evita líneas demasiado largas, fatiga visual)
- 3 niveles de tamaño de fuente ajustables por el usuario (small/medium/large)

### Paleta de colores

> Los tokens viven en `src/index.css` bajo el prefijo `--zen-*` (se alternan
> con las clases `theme-paper` / `theme-dark` sobre `<html>`). La UI los
> consume **siempre vía utilidades de Tailwind** (`bg-paper`, `bg-canvas`,
> `text-ink`, `text-muted`, `bg-accent`, `border-line`, `bg-card`, ...),
> mapeadas en `@theme`; nunca con `var(--...)` inline en los componentes.

**Tema "Papel" (estilo Kindle, por defecto):**
```css
--zen-bg: #F4F1EA;             /* fondo tono papel envejecido → bg-paper */
--zen-text: #2B2B2B;           /* texto casi negro, no negro puro (menos fatiga) */
--zen-text-secondary: #6B6558; /* metadatos, fechas, excerpt */
--zen-accent: #A0522D;         /* acento sepia/terracota, para links y botones activos */
--zen-border: #E0DCD1;         /* separadores sutiles */
--zen-card: #FFFFFF;           /* tarjetas ligeramente más claras que el fondo */
```

**Tema "Oscuro técnico":**
```css
--zen-bg: #121212;             /* negro suave, no #000 puro */
--zen-text: #E0E0E0;           /* blanco roto, no blanco puro */
--zen-text-secondary: #9A9A9A;
--zen-accent: #5B8DEF;         /* azul frío, contraste técnico */
--zen-border: #2A2A2A;
--zen-card: #1A1A1A;
```

**Regla de contraste:** verificar que ambos temas cumplan WCAG AA mínimo (4.5:1 para texto normal) — especialmente el texto secundario sobre fondo, que suele fallar si se elige muy claro/oscuro.

### Componentes clave de UI

- **Toast del Clipper:** aparece en la esquina, se auto-oculta en ~3 segundos, no bloquea clics en la página subyacente, con icono de check/error simple.
- **ArticleCard:** título, excerpt corto, dominio de origen, fecha relativa ("hace 2 días"), sin imagen destacada en V1 (mantenerlo simple; si se agrega, extraerla de Readability.js como mejora futura).
- **ReaderView:** solo texto + título, sin sidebar, sin distracciones, botón de volver discreto, toggle de tema visible pero no intrusivo.
- **Popup:** mínimo — botón "Guardar esta página" + acceso a "Ver biblioteca" + contador simple de pendientes.

---

## 8. Permisos del manifest (Manifest V3)

```json
{
  "manifest_version": 3,
  "name": "ZenReader",
  "permissions": [
    "storage",
    "unlimitedStorage",
    "scripting",
    "activeTab"
  ],
  "commands": {
    "clip-article": {
      "suggested_key": { "default": "Ctrl+Shift+S" },
      "description": "Guardar artículo actual"
    }
  },
  "chrome_url_overrides": {
    "newtab": "dashboard.html"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  }
}
```

**Nota:** no se solicita `<all_urls>` de forma permanente ni content script declarativo — el clipper se inyecta bajo demanda con `activeTab` + `scripting`, minimizando permisos y footprint.

---

## 9. Criterios de aceptación de la V1 (Definition of Done)

La V1 se considera completa cuando:

- [ ] El usuario puede clippear cualquier artículo web con 1 clic o atajo de teclado
- [ ] El toast de confirmación aparece y desaparece sin interrumpir la navegación
- [ ] El artículo clippeado aparece en el dashboard con título, excerpt y fecha correctos
- [ ] El texto extraído está limpio de menús/ads/trackers (validado en al menos 10 sitios distintos de prueba: noticias, blogs, docs técnicas)
- [ ] El modo lector renderiza el contenido de forma legible en ambos temas
- [ ] El usuario puede marcar como leído/archivar y eliminar un artículo
- [ ] Todo funciona sin conexión a internet una vez guardado el artículo
- [ ] La extensión funciona en Chrome; se valida compatibilidad básica en Edge y Firefox
- [ ] El idioma de la interfaz cambia correctamente entre ES/EN
- [ ] No hay fugas de memoria perceptibles tras guardar/leer 20+ artículos en una sesión
- [ ] El Service Worker no mantiene estado persistente en memoria (se descarga correctamente cuando el navegador lo determina)

---

## 10. Roadmap posterior (fuera de alcance de este prompt, referencia futura)

- **V2:** tags manuales, búsqueda full-text, progreso de lectura, tiempo estimado de lectura, exportar a Markdown, importar desde Pocket/Instapaper, detección de duplicados, virtualización de listas (`@tanstack/virtual`) si el volumen de artículos lo justifica.
- **V3:** resumen con Chrome Summarizer API (local, on-device), auto-tagging asistido, y como sub-fase posterior, integración opcional con APIs externas de IA (BYOK — el usuario aporta su propia API key) con aviso explícito de privacidad, más chat con el contenido del artículo.

---

## 11. Instrucción de desarrollo (resumen ejecutable)

Construye ZenReader V1 como extensión de navegador Manifest V3 siguiendo exactamente el stack, la arquitectura de carpetas, el modelo de datos, los flujos, la paleta de colores y los criterios de aceptación descritos arriba. Prioriza:

1. Que el flujo completo de clip → guardado → lectura funcione end-to-end antes de pulir UI.
2. Respetar estrictamente las capas de Clean Architecture (domain/application/infrastructure/presentation) — ningún componente de presentación debe acceder a Dexie directamente.
3. No implementar ninguna funcionalidad listada en la sección "Explícitamente fuera de la V1".
4. Sanitizar siempre el HTML extraído antes de renderizarlo (DOMPurify).
5. Minimizar permisos del manifest — usar `activeTab` + `scripting` en vez de content scripts declarativos permanentes.
