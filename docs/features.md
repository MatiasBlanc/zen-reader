# Features — ZenReader

Documento de planificación interna. Lista completa de funcionalidades de V1
y el roadmap de V2/V3/V4. No es documentación pública; el README solo enlaza aquí.

## Incluido en V1

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

## Explícitamente fuera de la V1 (V2/V3/V4)

### Pronto (extensión chica de V1)

- 3 temas de lectura (Focus / Calm / Night) en vez de los 2 actuales

### V2

- Tags, carpetas, colecciones
- Búsqueda full-text
- Destacador / resaltados (highlights)
- Progreso de lectura / posición de scroll guardada
- Tiempo estimado de lectura
- Exportar a Markdown
- Importar desde Pocket/Instapaper
- Detección de duplicados
- Bulk actions (marcar / archivar / eliminar varios artículos a la vez)

### V3

- Resumen con IA local (on-device) o API key propia (BYOK), con aviso
  explícito de privacidad
- Auto-tagging asistido
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
