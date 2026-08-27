import type { Notifier } from '@application/ports/notifier.port';
import { ClipArticleUseCase } from '@application/use-cases/clip-article.use-case';
import { MarkAsReadUseCase } from '@application/use-cases/mark-as-read.use-case';
import { DeleteArticleUseCase } from '@application/use-cases/delete-article.use-case';
import { GetLibraryUseCase } from '@application/use-cases/get-library.use-case';
import { UpdatePreferencesUseCase } from '@application/use-cases/update-preferences.use-case';
import { IdbArticleRepository } from '@infrastructure/persistence/idb-article.repository';

/**
 * Composition root (Clean Architecture).
 * Único punto de la app que conoce la implementación concreta del repositorio
 * (Dexie) y la inyecta en los casos de uso. Nada de la UI importa Dexie.
 *
 * La UI depende únicamente de esta fachada de casos de uso.
 */
export interface ApplicationContainer {
  clipArticle: ClipArticleUseCase;
  markAsRead: MarkAsReadUseCase;
  deleteArticle: DeleteArticleUseCase;
  library: GetLibraryUseCase;
  preferences: UpdatePreferencesUseCase;
}

/**
 * Construye el contenedor de la aplicación.
 * @param notifier puerto de notificación del contexto actual (UI o silencioso).
 */
export function createContainer(notifier: Notifier): ApplicationContainer {
  const repository = new IdbArticleRepository();

  return {
    clipArticle: new ClipArticleUseCase(repository, notifier),
    markAsRead: new MarkAsReadUseCase(repository),
    deleteArticle: new DeleteArticleUseCase(repository),
    library: new GetLibraryUseCase(repository),
    preferences: new UpdatePreferencesUseCase(repository),
  };
}