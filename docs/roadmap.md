# Roadmap — Zen Reader

Resumen del estado de features (V1) y planificación (V2/V3/V4).

> **Cómo se trackea esto**: la fuente de verdad de las features son los **issues de GitHub** con sus **milestones**. Este documento es un resumen con enlaces. Si una feature aparece aquí sin enlace a issue, es que todavía está en estado *propuesta* — conviértela en issue usando el [feature request form](../.github/ISSUE_TEMPLATE/feature_request.yml) antes de implementarla.

## V1 — Incluido en V1

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

### Complementos de V1 (verificados contra el código)

- **UI para ajustar el tamaño de fuente (small/medium/large)** — el modelo ya
  tiene `preferences.fontSize` y el lector ya lo aplica (`text-base/lg/xl`);
  solo falta el control en la UI
- **Tiempo estimado de lectura** — movido desde V2: `estimateReadingMinutes()`
  ya existe en `domain/services/reading-calculator.ts`, mostrar minutos en el
  lector es casi gratis
- **Progreso de lectura (versión simple)** — guardar % de scroll al cerrar el
  lector y restaurarlo al reabrir; hoy `ReaderView` no trackea scroll
- **Detección de duplicados por URL al clippear** — hoy el mismo artículo se
  guarda N veces (el caso de uso genera UUID sin chequear la URL)
- **Filtro simple por título** — client-side sobre metadatos ya cargados; NO es
  la búsqueda full-text de V2 (que requiere índice en Dexie)
- **Badge con contador de pendientes** en el ícono (`chrome.action.setBadgeText`)
- **Error visible cuando el clip falla por atajo de teclado** — verificado:
  vía popup y vía content script el error ya se muestra (toast); vía atajo
  (Ctrl+Shift+S) en páginas restringidas (chrome://, Web Store, PDFs) la
  inyección falla y el error solo va a console (notifier silencioso del SW).
  Fix propuesto sin permiso nuevo: badge `!` rojo temporal
  (`setBadgeText` + `setBadgeBackgroundColor`); alternativamente
  `chrome.notifications`, que añade permiso (peso)
- **Estado vacío / onboarding** — ✅ ya implementado (`EmptyState` con emoji,
  mensaje i18n y atajo Ctrl+Shift+S); sin cambio necesario
- **Confirmación antes de eliminar** — ✅ ya implementado en el lector
  (`window.confirm` + i18n `confirm_delete`); hoy eliminar solo existe dentro
  del lector. Mejora opcional: reemplazar el nativo por un modal con estilo

## Fuera de la V1 (V2/V3/V4)

> Cada feature de esta lista debería tener su issue con milestone. El checkbox indica si ya se convirtió en issue. Crea los que falten con el [feature request form](../.github/ISSUE_TEMPLATE/feature_request.yml).

### Pronto (extensión chica de V1)

- [ ] 3 temas de lectura (Focus / Calm / Night) en vez de los 2 actuales

### V2

- [ ] Tags, carpetas, colecciones
- [ ] Búsqueda full-text (índice en Dexie, busca dentro del contenido) — el filtro
  simple por título ya está en V1
- [ ] Destacador / resaltados (highlights)
- [ ] Exportar a Markdown
- [ ] Importar desde Pocket/Instapaper
- [ ] Bulk actions (marcar / archivar / eliminar varios artículos a la vez)

### V3

- [ ] Resumen con IA local (on-device) o API key propia (BYOK), con aviso
  explícito de privacidad
- [ ] Auto-tagging asistido
- Cualquier otra funcionalidad de IA (chat con artículo, etc.)

### V4

- RSS feeds — fase propia por el peso de permisos que añade

### Sin fecha / nice-to-have

- Sonidos de interacción (Cuelume u otro) — ya implementado con Cuelume
  (toasts de éxito/error); queda exponerlo/configurarlo en la UI si se desea
- Sonido ambiente (Sound)
- Sync entre dispositivos — ⚠️ choca con la filosofía "100% local, el
  contenido nunca sale del dispositivo": si entra, definir primero el modelo
  de privacidad (cifrado, qué se sincroniza)

## Deuda técnica de arquitectura

Violaciones de la regla "presentation no toca infrastructure" detectadas al
activar la verificación con dependency-cruiser (ADR-0003). Están permitidas
en `.dependency-cruiser.cjs` (`pathNot`) hasta que se refactoricen. **No añadir
excepciones nuevas sin abrir un issue.**

- [ ] `content-script.tsx` usa `readability.parser` sin port — fix: extraer
  `parser.port.ts` e implementarlo en `infrastructure`
- [ ] `dashboard/store.ts` instancia `ChromeToastNotifier` directo — fix:
  inyectarlo vía el container (`di/container.ts`)
