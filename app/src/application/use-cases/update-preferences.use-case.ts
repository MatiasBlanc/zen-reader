import type { UserPreferences } from '@domain/entities/preferences';
import type { ArticleRepository } from '@application/ports/article-repository.port';

/** Preferencias por defecto si todavía no existen persistidas. */
export const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'user',
  theme: 'paper',
  fontSize: 'medium',
  language: 'es',
};

/**
 * Caso de uso: leer y actualizar las preferencias de usuario.
 */
export class UpdatePreferencesUseCase {
  constructor(private readonly repository: ArticleRepository) {}

  /** Devuelve las preferencias actuales o las por defecto la primera vez. */
  async get(): Promise<UserPreferences> {
    const stored = await this.repository.getPreferences();
    return stored ?? DEFAULT_PREFERENCES;
  }

  /** Guarda preferencias (merge parcial sobre las existentes). */
  async update(partial: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.get();
    const next: UserPreferences = { ...current, ...partial };
    await this.repository.savePreferences(next);
    return next;
  }
}