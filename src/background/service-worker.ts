import { createContainer } from '@infrastructure/di/container';
import type {
  ClipExtractedMessage,
  ClipFailedMessage,
  ClipResultMessage,
} from '@application/messaging/message-types';
import type { Article } from '@domain/entities/article';
import type { Notifier } from '@application/ports/notifier.port';

/**
 * Service Worker del background de ZenReader.
 *
 * Responsabilidades:
 * - Escucha comandos de teclado (`Ctrl+Shift+S`) y mensajes del popup/content script.
 * - Orquesta el caso de uso de clip, guardando en IndexedDB.
 * - Responde al content script con el resultado para mostrar el toast.
 *
 * Diseñado para no mantener estado en memoria: el service worker se suspende
 * cuando el navegador lo determina y se re-inicializa al recibir un evento.
 */

/** Tiempo máximo (ms) que se espera al content script antes de responder al popup. */
const CLIP_TIMEOUT_MS = 10_000;

/** Notificador silencioso (el SW no tiene DOM propio). */
const silentNotifier: Notifier = {
  success: () => {},
  error: (msg: string) => console.error('[ZenReader]', msg),
  playSuccessSound: () => {},
  playErrorSound: () => {},
};

const app = createContainer(silentNotifier);

/**
 * Clips pendientes de confirmar, indexados por tabId.
 *
 * El popup (`CLIP_ACTIVE_TAB`) no asume éxito al inyectar: espera el resultado
 * real del content script (`CLIP_EXTRACTED`/`CLIP_FAILED`) para responder con
 * la verdad. Si el SW se suspende a mitad, la promesa queda huérfana y el
 * remitente se desconecta por su cuenta (comportamiento aceptable).
 */
const pendingClips = new Map<
  number,
  { resolve: (result: ClipResultMessage) => void; timer: ReturnType<typeof setTimeout> }
>();

/* ── Comandos de teclado ──────────────────────────────────────────────────── */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'clip-article') {
    const id = await getActiveTabId();
    if (id !== undefined) {
      await clipActiveTab(id);
    }
  }
});

/* ── Mensajes entre content script / popup / dashboard ───────────────────── */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const type: string | undefined = message?.type;

  if (type === 'CLIP_EXTRACTED') {
    handleClipExtracted(message as ClipExtractedMessage)
      .then((result) => {
        resolvePendingClip(sender.tab?.id, result);
        sendResponse(result);
      })
      .catch(() => {
        const result: ClipResultMessage = { type: 'CLIP_RESULT', ok: false, error: 'Error desconocido al guardar' };
        resolvePendingClip(sender.tab?.id, result);
        sendResponse(result);
      });
    return true; // async response
  }

  if (type === 'CLIP_FAILED') {
    const { error } = message as ClipFailedMessage;
    const result: ClipResultMessage = { type: 'CLIP_RESULT', ok: false, error };
    resolvePendingClip(sender.tab?.id, result);
    sendResponse(result);
    return false; // respuesta síncrona
  }

  if (type === 'CLIP_ACTIVE_TAB') {
    handleClipActiveTab()
      .then(sendResponse)
      .catch(() => sendResponse({ type: 'CLIP_RESULT', ok: false, error: 'Error al clippear la pestaña' }));
    return true;
  }

  if (type === 'OPEN_LIBRARY') {
    handleOpenLibrary();
    return false;
  }

  if (type === 'GET_PREFERENCES') {
    app.preferences.get().then(sendResponse);
    return true;
  }

  return false;
});

/* ── Lógica de clip ───────────────────────────────────────────────────────── */

/**
 * Clippea la pestaña activa y espera el resultado real del content script.
 * @returns el resultado del clip (guardado o error) para responder al popup.
 */
async function handleClipActiveTab(): Promise<ClipResultMessage> {
  const id = await getActiveTabId();
  if (id === undefined) {
    return { type: 'CLIP_RESULT', ok: false, error: 'No se encontró una pestaña activa' };
  }
  return clipActiveTab(id);
}

/**
 * Inyecta el content script en una pestaña y espera su confirmación.
 * Resuelve cuando el content script notifica éxito (`CLIP_EXTRACTED`) o
 * fracaso (`CLIP_FAILED`), con un timeout de seguridad.
 * @param tabId pestaña sobre la que clippear.
 */
async function clipActiveTab(tabId: number): Promise<ClipResultMessage> {
  // Un clip previo pendiente en la misma pestaña (doble clic) queda invalidado.
  resolvePendingClip(tabId, { type: 'CLIP_RESULT', ok: false, error: 'Sustituido por un nuevo clip' });

  const result = new Promise<ClipResultMessage>((resolve) => {
    const timer = setTimeout(() => {
      pendingClips.delete(tabId);
      resolve({ type: 'CLIP_RESULT', ok: false, error: 'Tiempo de espera agotado al extraer el artículo' });
    }, CLIP_TIMEOUT_MS);
    pendingClips.set(tabId, { resolve, timer });
  });

  try {
    // Inyectamos el content script empaquetado por vite/crxjs.
    // La ruta del archivo de salida la gestiona vite en el dist.
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-script.js'],
    });
  } catch (err) {
    clearPendingClip(tabId);
    console.error('[ZenReader] Error inyectando content script:', err);
    return { type: 'CLIP_RESULT', ok: false, error: 'No se pudo inyectar el content script en esta página' };
  }

  return result;
}

/** Busca el id de la pestaña activa de la ventana actual. */
async function getActiveTabId(): Promise<number | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

/**
 * Gestiona el mensaje CLIP_EXTRACTED enviado por el content script.
 * Persiste el artículo y devuelve la respuesta.
 */
async function handleClipExtracted(msg: ClipExtractedMessage): Promise<ClipResultMessage> {
  try {
    const article: Article = await app.clipArticle.execute({
      title: msg.title,
      url: msg.url,
      contentHTML: msg.contentHTML,
    });
    return { type: 'CLIP_RESULT', ok: true, article };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
    return { type: 'CLIP_RESULT', ok: false, error: errorMsg };
  }
}

/**
 * Resuelve (si existe) el clip pendiente de una pestaña con un resultado.
 * @param tabId pestaña del remitente (puede faltar en mensajes de otros orígenes).
 * @param result resultado final del clip.
 */
function resolvePendingClip(tabId: number | undefined, result: ClipResultMessage): void {
  if (tabId === undefined) return;
  const pending = pendingClips.get(tabId);
  if (!pending) return;
  clearTimeout(pending.timer);
  pendingClips.delete(tabId);
  pending.resolve(result);
}

/** Cancela el clip pendiente de una pestaña sin resolverlo. */
function clearPendingClip(tabId: number): void {
  const pending = pendingClips.get(tabId);
  if (!pending) return;
  clearTimeout(pending.timer);
  pendingClips.delete(tabId);
}

/** Abre la página de la biblioteca en una pestaña nueva. */
async function handleOpenLibrary(): Promise<void> {
  const url = chrome.runtime.getURL('src/presentation/dashboard/index.html');
  await chrome.tabs.create({ url });
}
