import type { Article, ArticleMetadata } from '@domain/entities/article';
import type { UserPreferences } from '@domain/entities/preferences';

/**
 * Contrato de persistencia de artículos y preferencias.
 * La capa de infraestructura implementa este puerto (p.ej. vía Dexie),
 * y la capa de aplicación solo depende de esta interfaz.
 */
export interface ArticleRepository {
  /** Guarda un artículo nuevo en la biblioteca. */
  save(article: Article): Promise<void>;

  /** Elimina un artículo por su id. */
  delete(articleId: string): Promise<void>;

  /** Actualiza el estado leído/archivado de un artículo. */
  markAsRead(articleId: string, isArchived: boolean): Promise<void>;

  /** Obtiene solo la metadata ligera de todos los artículos (sin contentHTML). */
  getLibrary(): Promise<ArticleMetadata[]>;

  /** Obtiene un artículo completo (con contentHTML) por su id. */
  getById(articleId: string): Promise<Article | undefined>;

  /** Lee las preferencias persistidas del usuario. */
  getPreferences(): Promise<UserPreferences | undefined>;

  /** Guarda las preferencias del usuario. */
  savePreferences(preferences: UserPreferences): Promise<void>;
}