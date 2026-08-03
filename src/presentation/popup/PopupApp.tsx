import { useCallback, useRef, useState } from 'preact/hooks';
import { createContainer } from '@infrastructure/di/container';
import type { ApplicationContainer } from '@infrastructure/di/container';
import { Bookmark, BookOpen, Loader } from '../icons';
import type { Notifier } from '@application/ports/notifier.port';

/**
 * Aplicación popup de ZenReader.
 *
 * Dos acciones principales: guardar la pestaña activa y abrir la
 * biblioteca. El toast de confirmación lo muestra el content script
 * en la página host, no el popup.
 */

/** Textos del popup con fallback por si falta alguna clave i18n. */
const messages = {
  savePage: chrome.i18n.getMessage('save_page') || 'Guardar esta página',
  savingPage: chrome.i18n.getMessage('saving_page') || 'Guardando…',
  viewLibrary: chrome.i18n.getMessage('view_library') || 'Ver biblioteca',
};

/** Notificador silencioso (el toast lo muestra el content script). */
const silentNotifier: Notifier = {
  success: () => {},
  error: (msg) => console.error('[ZenReader]', msg),
  playSuccessSound: () => {},
  playErrorSound: () => {},
};

export function PopupApp() {
  const [clipping, setClipping] = useState(false);

  /** Ref para bloquear clics duplicados de forma síncrona. */
  const clippingRef = useRef(false);

  /** Composición root: contenedor DI, creado una sola vez. */
  const ctxRef = useRef<{ app: ApplicationContainer } | null>(null);
  if (ctxRef.current === null) {
    ctxRef.current = { app: createContainer(silentNotifier) };
  }
  const { app } = ctxRef.current;

  /** Solicita al service worker que clippee la pestaña activa. */
  const handleClip = useCallback(async () => {
    if (clippingRef.current) return;
    clippingRef.current = true;
    setClipping(true);
    try {
      const res = await chrome.runtime.sendMessage({ type: 'CLIP_ACTIVE_TAB' });
      if (res?.ok) {
        app.soundPlayer.play('success');
      } else {
        throw new Error(res?.error ?? 'clip_failed');
      }
    } catch {
      app.soundPlayer.play('error');
    } finally {
      clippingRef.current = false;
      setClipping(false);
    }
  }, [app]);

  /** Abre la biblioteca en una nueva pestaña. */
  const handleOpenLibrary = useCallback(async () => {
    await chrome.runtime.sendMessage({ type: 'OPEN_LIBRARY' });
  }, []);

  return (
    <div class="relative flex w-[320px] select-none flex-col bg-canvas p-4 text-ink antialiased">
      <header class="flex items-center gap-2.5">
        <span
          class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-on-accent shadow-sm"
          aria-hidden="true"
        >
          <BookOpen size={17} />
        </span>
        <h1 class="min-w-0 truncate text-[15px] font-bold leading-tight text-heading">ZenReader</h1>
      </header>

      <main class="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleClip}
          disabled={clipping}
          aria-busy={clipping}
          class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent shadow-sm transition duration-150 hover:bg-accent-hover hover:shadow-md active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {clipping ? (
            <span class="animate-spin" aria-hidden="true">
              <Loader size={15} />
            </span>
          ) : (
            <Bookmark size={15} aria-hidden="true" />
          )}
          {clipping ? messages.savingPage : messages.savePage}
        </button>

        <button
          type="button"
          onClick={handleOpenLibrary}
          class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink transition duration-150 hover:bg-surface active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <BookOpen size={15} aria-hidden="true" />
          {messages.viewLibrary}
        </button>
      </main>
    </div>
  );
}
