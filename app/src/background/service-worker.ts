import { createContainer } from '@infrastructure/di/container';
import type {
  ClipExtractedMessage,
  ClipFailedMessage,
  ClipResultMessage,
} from '@application/messaging/message-types';
import type { Article } from '@domain/entities/article';
import type { Notifier } from '@application/ports/notifier.port';

/**
 * Service Worker del background de Zen Reader.
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
  error: (msg: string) => console.error('[Zen Reader]', msg),
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

/* ── Rastreo de pestaña activa para soporte móvil (Firefox Android) ───────── */

function isExtensionUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.startsWith('moz-extension://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('about:') ||
    url.startsWith('chrome://') ||
    url.startsWith('edge://') ||
    url.startsWith('view-source:')
  );
}

async function setLastActiveWebTabId(tabId: number): Promise<void> {
  try {
    await chrome.storage.local.set({ lastActiveWebTabId: tabId });
  } catch {}
}

async function getLastActiveWebTabId(): Promise<number | undefined> {
  try {
    const data = await chrome.storage.local.get('lastActiveWebTabId');
    return typeof data.lastActiveWebTabId === 'number' ? data.lastActiveWebTabId : undefined;
  } catch {
    return undefined;
  }
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab?.id && tab.url && !isExtensionUrl(tab.url)) {
      await setLastActiveWebTabId(tab.id);
    }
  } catch {}
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    const url = changeInfo.url || tab?.url;
    if (url && !isExtensionUrl(url)) {
      await setLastActiveWebTabId(tabId);
    }
  }
});

/* ── Comandos de teclado ──────────────────────────────────────────────────── */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'clip-article') {
    const id = await getTargetTabId();
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
    handleClipActiveTab(sender.tab?.id)
      .then(sendResponse)
      .catch(() => sendResponse({ type: 'CLIP_RESULT', ok: false, error: 'Error al clippear la pestaña' }));
    return true;
  }

  if (type === 'OPEN_LIBRARY') {
    handleOpenLibrary()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => {
        console.error('[Zen Reader] Error abriendo biblioteca:', err);
        sendResponse({ ok: false, error: String(err) });
      });
    return true;
  }

  if (type === 'GET_PREFERENCES') {
    app.preferences.get().then(sendResponse);
    return true;
  }

  return false;
});

/* ── Lógica de clip ───────────────────────────────────────────────────────── */

/**
 * Clippea la pestaña objetivo y espera el resultado real del content script.
 * @param senderTabId id de la pestaña que originó la petición (si la hay, ej. popup en móvil).
 * @returns el resultado del clip (guardado o error) para responder al popup.
 */
async function handleClipActiveTab(senderTabId?: number): Promise<ClipResultMessage> {
  const id = await getTargetTabId(senderTabId);
  if (id === undefined) {
    return { type: 'CLIP_RESULT', ok: false, error: 'No se encontró una página web activa para guardar' };
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
    console.error('[Zen Reader] Error inyectando content script:', err);
    return { type: 'CLIP_RESULT', ok: false, error: 'No se pudo inyectar el content script en esta página' };
  }

  return result;
}

/**
 * Determina el ID de la pestaña web que el usuario desea clippear.
 * En escritorio, suele ser la pestaña activa en la ventana actual.
 * En navegadores móviles (como Firefox para Android), el popup se abre como una
 * pestaña independiente o vista modal que se convierte en la pestaña activa,
 * por lo que debemos identificar la pestaña web previa.
 */
async function getTargetTabId(senderTabId?: number): Promise<number | undefined> {
  // 1. Escritorio: intentar activa en ventana actual
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id && tab.id !== senderTabId && !isExtensionUrl(tab.url)) {
      return tab.id;
    }
  } catch {}

  // 2. Consulta de pestaña activa sin currentWindow (en Android no aplica el concepto de ventanas)
  try {
    const activeTabs = await chrome.tabs.query({ active: true });
    for (const tab of activeTabs) {
      if (tab.id && tab.id !== senderTabId && !isExtensionUrl(tab.url)) {
        return tab.id;
      }
    }
  } catch {}

  // 3. Si el remitente es la pestaña activa (popup en pestaña en Android),
  // recurrimos a la última pestaña web registrada antes de abrir el popup.
  const lastActiveId = await getLastActiveWebTabId();
  if (lastActiveId !== undefined && lastActiveId !== senderTabId) {
    try {
      const tab = await chrome.tabs.get(lastActiveId);
      if (tab?.id && !isExtensionUrl(tab.url)) {
        return tab.id;
      }
    } catch {}
  }

  // 4. Fallback: buscar entre todas las pestañas abiertas ordenadas por último acceso
  try {
    const allTabs = await chrome.tabs.query({});
    const sorted = [...allTabs].sort((a, b) => (b.lastAccessed ?? 0) - (a.lastAccessed ?? 0));
    for (const tab of sorted) {
      if (tab.id && tab.id !== senderTabId && !isExtensionUrl(tab.url)) {
        return tab.id;
      }
    }
  } catch {}

  return undefined;
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

/** Abre la página de la biblioteca en una pestaña nueva o enfocada. */
async function handleOpenLibrary(): Promise<void> {
  const url = chrome.runtime.getURL('src/presentation/dashboard/index.html');
  await chrome.tabs.create({ url, active: true });
}
