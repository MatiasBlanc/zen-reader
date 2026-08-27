import { Readability } from '@mozilla/readability';

/** Resultado del parseo de Readability.js sobre un documento. */
export interface ParsedArticle {
  title: string;
  url: string;
  contentHTML: string;
}

/**
 * Extrae el contenido principal de un documento HTML usando Readability.js
 * (la misma heurística de Firefox Reader View). Debe ejecutarse sobre el DOM
 * real de la pestaña, por eso corre dentro del content script.
 *
 * @param sourceDocument El `document` de la página a limpiar.
 * @returns contenido extraído, o null si no se detecta artículo legible.
 */
export function parseReadableDocument(sourceDocument: Document): ParsedArticle | null {
  // Clonamos para no mutar el DOM visible del usuario durante el parseo.
  const clone = sourceDocument.cloneNode(true) as Document;

  // Readability manipula el documento que recibe; el formato base es el de
  // un Document real, por eso se asigna como tal dentro de una url de origen.
  const reader = new Readability(clone);
  const parsed = reader.parse();

  if (!parsed?.content) {
    return null;
  }

  return {
    title: parsed.title?.trim() || sourceDocument.title || 'Sin título',
    url: sourceDocument.location?.href || '',
    contentHTML: parsed.content,
  };
}