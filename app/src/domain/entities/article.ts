/**
 * Entidad `Article` del dominio Zen Reader.
 * Representa un artículo guardado en la biblioteca local del usuario.
 * El modelo es deliberadamente simple (estado binario pendiente/leído).
 */
export interface Article {
  /** Identificador único (UUID). */
  id: string;
  /** Título del artículo. */
  title: string;
  /** URL original de la que se extrajo. */
  url: string;
  /** ~150 caracteres para las tarjetas del dashboard. */
  excerpt: string;
  /** HTML limpio de Readability.js, sanitizado con DOMPurify. */
  contentHTML: string;
  /** Timestamp (epoch ms) en que se guardó. */
  savedAt: number;
  /** false = pendiente, true = leído/archivado. */
  isArchived: boolean;
}

/**
 * Metadata «ligera» de un artículo, apta para listar tarjetas sin
 * cargar el `contentHTML` completo (megabytes) al pintar el dashboard.
 */
export type ArticleMetadata = Pick<
  Article,
  'id' | 'title' | 'url' | 'excerpt' | 'savedAt' | 'isArchived'
>;