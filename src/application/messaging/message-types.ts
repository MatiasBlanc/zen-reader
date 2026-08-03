import type { Article } from '@domain/entities/article';
import type { UserPreferences } from '@domain/entities/preferences';

/**
 * Contratos de mensajes intercambiados mediante `chrome.runtime` entre
 * el content script, el service worker y las páginas de la extensión.
 */

/** Resultado que el content script envía al service worker tras extraer el artículo. */
export interface ClipExtractedMessage {
  type: 'CLIP_EXTRACTED';
  title: string;
  url: string;
  contentHTML: string;
}

/**
 * Respuesta genérica del service worker a un clip:
 * nunca se traslada el HTML completo de vuelta si no hace falta.
 */
export interface ClipResultMessage {
  type: 'CLIP_RESULT';
  ok: boolean;
  article?: Article;
  error?: string;
}

/**
 * El content script informa al service worker que no pudo extraer
 * un artículo legible de la página (p. ej. no hay contenido detectable).
 */
export interface ClipFailedMessage {
  type: 'CLIP_FAILED';
  error: string;
}

/** Petición del dashboard/popup para abrir la biblioteca en una pestaña. */
export interface OpenLibraryMessage {
  type: 'OPEN_LIBRARY';
}

/** Petición del popup para clippear la pestaña activa. */
export interface ClipActiveTabMessage {
  type: 'CLIP_ACTIVE_TAB';
}

/** Lectura de preferencias desde las páginas de UI. */
export interface GetPreferencesMessage {
  type: 'GET_PREFERENCES';
}

export type PrefsResultMessage = UserPreferences;

/** Sindicato de todos los mensajes entrantes que gestiona el service worker. */
export type RuntimeInboundMessage =
  | ClipExtractedMessage
  | ClipFailedMessage
  | ClipActiveTabMessage
  | OpenLibraryMessage
  | GetPreferencesMessage;

/** Forma de una respuesta preservada para el remitente. */
export type InboundResponse = ClipResultMessage | UserPreferences | undefined;