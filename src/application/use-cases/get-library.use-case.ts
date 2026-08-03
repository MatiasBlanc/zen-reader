import type { ArticleMetadata } from '@domain/entities/article';
import type { ArticleRepository } from '@application/ports/article-repository.port';
import { sanitizeHtml } from '@domain/services/text-sanitizer';

/**
 * Caso de uso: consultar la biblioteca (metadata ligera) y obtener un
 * artículo completo bajo demanda para el modo lector.
 */
export class GetLibraryUseCase {
  constructor(private readonly repository: ArticleRepository) {}

  /** Devuelve solo la metadata ligera para el listado de tarjetas. */
  getLibrary(): Promise<ArticleMetadata[]> {
    return this.repository.getLibrary();
  }

  /**
   * Obtiene un artículo completo (con contentHTML) para el modo lector.
   * El HTML se vuelve a sanitizar antes de exponerlo a la UI.
   * @param articleId id del artículo.
   */
  async getArticle(articleId: string) {
    const article = await this.repository.getById(articleId);
    if (!article) return undefined;
    return { ...article, contentHTML: sanitizeHtml(article.contentHTML) };
  }
}