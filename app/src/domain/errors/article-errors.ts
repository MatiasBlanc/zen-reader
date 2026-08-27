/**
 * Errores de dominio específicos de la gestión de artículos.
 * Mensajes en español, con contexto suficiente para reproducir el fallo.
 */

/** Se lanza cuando se intenta operar sobre un artículo inexistente. */
export class ArticleNotFoundError extends Error {
  readonly articleId: string;

  constructor(articleId: string) {
    super(`No se encontró el artículo con id "${articleId}".`);
    this.name = 'ArticleNotFoundError';
    this.articleId = articleId;
  }
}

/** Se lanza cuando el documento extraído no contiene contenido legible. */
export class ArticleNotReadableError extends Error {
  constructor(url: string) {
    super(`No se pudo extraer contenido legible de: ${url}`);
    this.name = 'ArticleNotReadableError';
  }
}