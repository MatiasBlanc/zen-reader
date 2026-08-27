import { useCallback, useRef, useState } from 'preact/hooks';
import { Bookmark, BookOpen, Loader, Check, AlertCircle } from '../icons';
import type { ClipResultMessage } from '@application/messaging/message-types';

/**
 * Aplicación popup de Zen Reader.
 *
 * Dos acciones principales: guardar la pestaña activa/previa y abrir la
 * biblioteca. Soporta entornos de escritorio (ventana popup flotante)
 * y navegadores móviles como Firefox para Android (donde el popup se
 * ejecuta en una pestaña o vista dedicada).
 */

/** Textos del popup con fallback por si falta alguna clave i18n. */
const messages = {
  savePage: chrome.i18n.getMessage('save_page') || 'Guardar esta página',
  savingPage: chrome.i18n.getMessage('saving_page') || 'Guardando…',
  savedPage: chrome.i18n.getMessage('clip_success') || 'Artículo guardado',
  viewLibrary: chrome.i18n.getMessage('view_library') || 'Ver biblioteca',
  clipError: chrome.i18n.getMessage('clip_error') || 'Error al guardar',
};

export function PopupApp() {
  const [clipping, setClipping] = useState(false);
  const [status, setStatus] = useState<'idle' | 'clipping' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /** Ref para bloquear clics duplicados de forma síncrona. */
  const clippingRef = useRef(false);

  /** Solicita al service worker que clippee la pestaña activa o previa en móvil. */
  const handleClip = useCallback(async () => {
    if (clippingRef.current) return;
    clippingRef.current = true;
    setClipping(true);
    setStatus('clipping');
    setErrorMessage('');

    try {
      const res: ClipResultMessage = await chrome.runtime.sendMessage({ type: 'CLIP_ACTIVE_TAB' });
      if (!res?.ok) {
        throw new Error(res?.error ?? messages.clipError);
      }
      setStatus('success');

      // Si estamos en un popup de escritorio flotante, cerramos automáticamente tras confirmar
      try {
        const currentTab = await chrome.tabs?.getCurrent?.();
        if (!currentTab?.id) {
          setTimeout(() => {
            window.close();
          }, 1200);
        }
      } catch {
        // En caso de duda o error, mantenemos el popup abierto para ver el feedback
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : messages.clipError);
    } finally {
      clippingRef.current = false;
      setClipping(false);
    }
  }, []);

  /** Abre la biblioteca en una pestaña nueva o navega si ya es pestaña. */
  const handleOpenLibrary = useCallback(async () => {
    const libraryUrl = chrome.runtime.getURL('src/presentation/dashboard/index.html');

    try {
      // Si el popup se está ejecutando como una pestaña propia (común en Firefox para Android),
      // navegamos directamente en la pestaña actual para evitar bloqueos y pestañas huérfanas.
      const currentTab = await chrome.tabs?.getCurrent?.();
      if (currentTab?.id) {
        window.location.href = libraryUrl;
        return;
      }
    } catch {}

    try {
      await chrome.tabs.create({ url: libraryUrl, active: true });
      window.close();
    } catch {
      await chrome.runtime.sendMessage({ type: 'OPEN_LIBRARY' });
    }
  }, []);

  return (
    <div class="popup-root">
      <header class="popup-header">
        <span class="popup-icon" aria-hidden="true">
          <BookOpen size={17} />
        </span>
        <h1 class="popup-title">Zen Reader</h1>
      </header>

      <main class="popup-main">
        <button
          type="button"
          onClick={handleClip}
          disabled={clipping || status === 'success'}
          aria-busy={clipping}
          class={`btn ${status === 'success' ? 'btn-success' : 'btn-primary'}`}
        >
          {clipping ? (
            <span class="animate-spin" aria-hidden="true">
              <Loader size={15} />
            </span>
          ) : status === 'success' ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Bookmark size={15} aria-hidden="true" />
          )}
          {clipping
            ? messages.savingPage
            : status === 'success'
              ? messages.savedPage
              : messages.savePage}
        </button>

        {status === 'error' && (
          <div class="popup-error" role="alert">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleOpenLibrary}
          class="btn btn-secondary"
        >
          <BookOpen size={15} aria-hidden="true" />
          {messages.viewLibrary}
        </button>
      </main>
    </div>
  );
}

