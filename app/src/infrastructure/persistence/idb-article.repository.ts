import type { Article, ArticleMetadata } from '@domain/entities/article';
import type { UserPreferences } from '@domain/entities/preferences';
import type { ArticleRepository } from '@application/ports/article-repository.port';

const DB_NAME = 'zen-reader';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Abre (o reutiliza) la conexión singleton a la base de datos.
 * Crea los object stores en el primer uso (onupgradeneeded).
 */
function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('articles')) {
        const store = db.createObjectStore('articles', { keyPath: 'id' });
        store.createIndex('by-savedAt', 'savedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

/** Wraps an IDBRequest in a Promise. */
function wrap<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
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

/**
 * Implementación del puerto `ArticleRepository` sobre la API nativa IndexedDB.
 * Devuelve siempre *metadata ligera* en los listados y el documento
 * completo únicamente bajo demanda (getById).
 */
export class IdbArticleRepository implements ArticleRepository {
  async save(article: Article): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('articles', 'readwrite');
    await wrap(tx.objectStore('articles').put(article));
  }

  async delete(articleId: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('articles', 'readwrite');
    await wrap(tx.objectStore('articles').delete(articleId));
  }

  async markAsRead(articleId: string, isArchived: boolean): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('articles', 'readwrite');
    const store = tx.objectStore('articles');
    const article = await wrap<Article>(store.get(articleId));
    if (article) {
      await wrap(store.put({ ...article, isArchived }));
    }
  }

  async getLibrary(): Promise<ArticleMetadata[]> {
    const db = await openDB();
    const tx = db.transaction('articles', 'readonly');
    const index = tx.objectStore('articles').index('by-savedAt');
    const articles = await wrap<Article[]>(index.getAll());
    return articles.sort((a, b) => b.savedAt - a.savedAt).map(toMetadata);
  }

  async getById(articleId: string): Promise<Article | undefined> {
    const db = await openDB();
    const tx = db.transaction('articles', 'readonly');
    const result = await wrap<Article | undefined>(tx.objectStore('articles').get(articleId));
    return result;
  }

  async getPreferences(): Promise<UserPreferences | undefined> {
    const db = await openDB();
    const tx = db.transaction('preferences', 'readonly');
    const result = await wrap<UserPreferences | undefined>(tx.objectStore('preferences').get('user'));
    return result;
  }

  async savePreferences(preferences: UserPreferences): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('preferences', 'readwrite');
    await wrap(tx.objectStore('preferences').put(preferences));
  }
}
