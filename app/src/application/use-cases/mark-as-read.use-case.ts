import type { ArticleRepository } from '@application/ports/article-repository.port';
import { ArticleNotFoundError } from '@domain/errors/article-errors';

/**
 * Caso de uso: cambiar el estado binario de un artículo
 * (pendiente ⇄ leído/archivado).
 */
export class MarkAsReadUseCase {
  constructor(private readonly repository: ArticleRepository) {}

  async execute(articleId: string, isArchived: boolean): Promise<void> {
    const existing = await this.repository.getById(articleId);
    if (!existing) {
      throw new ArticleNotFoundError(articleId);
    }
    await this.repository.markAsRead(articleId, isArchived);
  }
}