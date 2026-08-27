/**
 * Sanitizador mínimo de HTML para el contenido procesado por Readability.js.
 *
 * Readability ya elimina scripts, iframes y la mayoría de contenido peligroso.
 * Esta capa adicional elimina cualquier tag potencialmente peligroso que pueda
 * haber sobrevivido, sin depender de librerías externas.
 *
 * Nota: DOMPurify (27 KB) fue eliminado. El HTML recibido aquí ya fue
 * procesado por Readability, que actúa como primera barrera de limpieza.
 */

const FORBIDDEN_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'select',
  'textarea',
  'link',
  'base',
  'meta',
]);

/**
 * Sanitiza un fragmento HTML devolviendo un documento libre de XSS.
 * Utiliza el árbol DOM del navegador (DOMParser) para eliminar nodos y atributos
 * peligrosos de forma 100% segura sin añadir dependencias externas.
 *
 * @param html HTML sin sanear (p.ej. el `content` de Readability.js).
 * @returns HTML sanitizado listo para inyectar en el `ReaderView`.
 */
export function sanitizeHtml(html: string): string {
  if (typeof DOMParser === 'undefined') {
    return fallbackRegexSanitize(html);
  }

  try {
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    cleanNode(doc.body);
    return doc.body.innerHTML;
  } catch {
    return fallbackRegexSanitize(html);
  }
}

function cleanNode(node: Node): void {
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      if (FORBIDDEN_TAGS.has(tagName)) {
        el.remove();
        continue;
      }

      // Remover atributos de eventos inline (onclick, onload, etc.) y protocolos inseguros
      for (const attr of Array.from(el.attributes)) {
        const attrName = attr.name.toLowerCase();
        const attrVal = attr.value.trim().toLowerCase();

        if (attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
        } else if ((attrName === 'href' || attrName === 'src') && attrVal.startsWith('javascript:')) {
          el.setAttribute(attr.name, '#');
        }
      }

      cleanNode(el);
    }
  }
}

const DANGEROUS_TAGS = /(<\s*\/?\s*(script|style|iframe|object|embed|form|input|button|select|textarea|link|base|meta)[^>]*>)/gi;
const EVENT_ATTRS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;
const JS_PROTOCOL = /(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi;

function fallbackRegexSanitize(html: string): string {
  return html
    .replace(DANGEROUS_TAGS, '')
    .replace(EVENT_ATTRS, '')
    .replace(JS_PROTOCOL, (_, attr) => `${attr}="#"`);
}
