import Dexie, { type Table } from 'dexie';
import type { Article, ArticleMetadata } from '@domain/entities/article';
import type { UserPreferences } from '@domain/entities/preferences';
import type { ArticleRepository } from '@application/ports/article-repository.port';

/**
 * Instancia Dexie que modela la base de datos local.
 * Un solo `version(1)` con dos tablas. Cualquier cambio de esquema futuro
 * debe incrementar la versión con migraciones explícitas.
 */
class ZenReaderDB extends Dexie {
  articles!: Table<Article, string>;
  preferences!: Table<UserPreferences, string>;

  constructor() {
    super('zen-reader');
    this.version(1).stores({
      articles: 'id, savedAt, isArchived',
      preferences: 'id',
    });
  }
}

const db = new ZenReaderDB();

/**
 * Implementación del puerto `ArticleRepository` sobre Dexie/IndexedDB.
 * Devuelve siempre *metadata ligera* en los listados y el documento
 * completo únicamente bajo demanda (getById).
 */
export class DexieArticleRepository implements ArticleRepository {
  async save(article: Article): Promise<void> {
    await db.articles.put(article);
  }

  async delete(articleId: string): Promise<void> {
    await db.articles.delete(articleId);
  }

  async markAsRead(articleId: string, isArchived: boolean): Promise<void> {
    await db.articles.update(articleId, { isArchived });
  }

  async getLibrary(): Promise<ArticleMetadata[]> {
    const loaded = await db.articles
      .orderBy('savedAt')
      .reverse()
      .toArray();
    return loaded.map((article) => toMetadata(article));
  }

  getById(articleId: string): Promise<Article | undefined> {
    return db.articles.get(articleId);
  }

  getPreferences(): Promise<UserPreferences | undefined> {
    return db.preferences.get('user');
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    await db.preferences.put(preferences);
  }
}

/** Proyecta un artículo hacia su metadata ligera (descarta `contentHTML`). */
function toMetadata(article: Article): ArticleMetadata {
  return {
    id: article.id,
    title: article.title,
    url: article.url,
    excerpt: article.excerpt,
    savedAt: article.savedAt,
    isArchived: article.isArchived,
  };
}