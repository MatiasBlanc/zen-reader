/**
 * Preferencias de usuario persistidas localmente.
 * Son la única fuente de verdad para el tema y el idioma de la UI.
 */

/** Temas de lectura disponibles. */
export type ReadingTheme = 'paper' | 'dark';

/** Tamaño base de fuente del modo lector (3 niveles). */
export type FontSize = 'small' | 'medium' | 'large';

/** Idiomas soportados por `chrome.i18n`. */
export type SupportedLanguage = 'es' | 'en';

export interface UserPreferences {
  /** Identificador fijo del registro (una sola fila de preferencias). */
  id: 'user';
  theme: ReadingTheme;
  fontSize: FontSize;
  language: SupportedLanguage;
}