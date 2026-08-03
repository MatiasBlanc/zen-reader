import type { ArticleRepository } from '@application/ports/article-repository.port';
import { ArticleNotFoundError } from '@domain/errors/article-errors';

/**
 * Caso de uso: eliminar un artículo de la biblioteca (definitivo).
 */
export class DeleteArticleUseCase {
  constructor(private readonly repository: ArticleRepository) {}

  async execute(articleId: string): Promise<void> {
    const existing = await this.repository.getById(articleId);
    if (!existing) {
      throw new ArticleNotFoundError(articleId);
    }
    await this.repository.delete(articleId);
  }
}