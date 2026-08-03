import DOMPurify from 'dompurify';

/**
 * Wrapper de DOMPurify para sanitizar HTML procedente de páginas de terceros.
 * Nunca se debe inyectar HTML clippeado sin pasarlo por aquí (riesgo XSS).
 *
 * Se expone como función pura: dado un HTML devuelve su versión segura.
 */

/** Configuración de DOMPurify usada en toda la app. */
const SANITIZE_CONFIG = {
  // Bloqueamos cualquier script, plugin, evento inline y SVG potencialmente
  // peligroso. Readability ya limpia bastante, esto es la segunda barrera.
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'] as string[],
};

/**
 * Sanitiza un fragmento HTML devolviendo un documento libre de XSS.
 *
 * @param html HTML sin sanear (p.ej. el `content` de Readability.js).
 * @returns HTML sanitizado listo para inject(e) en el `ReaderView`.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}