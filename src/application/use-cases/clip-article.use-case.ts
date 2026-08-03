import type { Article } from '@domain/entities/article';
import type { ArticleRepository } from '@application/ports/article-repository.port';
import type { Notifier } from '@application/ports/notifier.port';
import { ArticleNotReadableError } from '@domain/errors/article-errors';

/** Datos crudos (ya extraídos y saneados) para crear un artículo. */
export interface ClipArticleInput {
  title: string;
  url: string;
  contentHTML: string;
}

/**
 * Caso de uso: guardar un artículo clippeado en la biblioteca local.
 * Valida la entrada, calcula el excerpt y delega la persistencia en el
 * repositorio, notificando al usuario del resultado.
 */
export class ClipArticleUseCase {
  constructor(
    private readonly repository: ArticleRepository,
    private readonly notifier: Notifier,
  ) {}

  /**
   * Guarda un artículo clippeado.
   * @param input título, url y contentHTML limpio del artículo.
   * @returns el artículo persistido.
   */
  async execute(input: ClipArticleInput): Promise<Article> {
    const contentHTML = input.contentHTML.trim();
    if (contentHTML.length === 0) {
      throw new ArticleNotReadableError(input.url);
    }

    const article: Article = {
      id: crypto.randomUUID(),
      title: input.title.trim() || input.url,
      url: input.url,
      excerpt: deriveExcerpt(contentHTML),
      contentHTML,
      savedAt: Date.now(),
      isArchived: false,
    };

    await this.repository.save(article);
    this.notifier.success(`Guardado: ${article.title}`);
    return article;
  }
}

/**
 * Deriva un excerpt de ~150 caracteres a partir del HTML, descartando markup.
 * @param contentHTML HTML limpio del artículo.
 * @returns fragmento de texto plano.
 */
function deriveExcerpt(contentHTML: string): string {
  const plain = stripHtml(contentHTML).replace(/\s+/g, ' ').trim();
  return plain.length > 150 ? `${plain.slice(0, 147)}…` : plain;
}

/**
 * Convierte HTML a texto plano sin depender de un DOM (expresión regular
 * suficiente para un excerpt; el renderizado real sanitiza por DOMPurify).
 * @param html HTML del que extraer texto.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"');
}