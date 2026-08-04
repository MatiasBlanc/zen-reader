import { render } from 'preact';
import { sanitizeHtml } from '@domain/services/text-sanitizer';
import { parseReadableDocument } from '@infrastructure/parser/readability.parser';
import { ToastNotification } from './ToastNotification';
import type { ToastKind } from './toast-types';

/**
 * Content script inyectado bajo demanda por el service worker.
 * Ejecuta Readability.js + DOMPurify sobre el DOM actual de la pestaña
 * y devuelve el resultado al background mediante `chrome.runtime.sendMessage`.
 * Muestra un toast en la página sin bloquear la interacción.
 */

(async () => {
  // ── 1. Extraer contenido ──────────────────────────────────────────────
  const parsed = parseReadableDocument(document);

  if (!parsed) {
    // Avisamos al service worker para que el popup reciba el error real.
    try {
      await chrome.runtime.sendMessage({
        type: 'CLIP_FAILED',
        error: chrome.i18n.getMessage('clip_failed') || 'No se detectó artículo en esta página.',
      });
    } catch (err) {
      console.error('[ZenReader] Error notificando fallo de extracción:', err);
    }
    showToast('error', chrome.i18n.getMessage('clip_failed') || 'No se detectó artículo en esta página.');
    return;
  }

  // Sanitizamos *antes* de enviar al background — nunca HTML sucio.
  const cleaned: typeof parsed = {
    ...parsed,
    contentHTML: sanitizeHtml(parsed.contentHTML),
  };

  // ── 2. Enviar al service worker y esperar resultado ───────────────────
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'CLIP_EXTRACTED',
      title: cleaned.title,
      url: cleaned.url,
      contentHTML: cleaned.contentHTML,
    });

    const isOk = response?.ok === true;
    const message = isOk
      ? chrome.i18n.getMessage('clip_success') || 'Artículo guardado'
      : response?.error || chrome.i18n.getMessage('clip_failed') || 'Error al guardar';

    showToast(isOk ? 'success' : 'error', message);
  } catch (err) {
    console.error('[ZenReader] Error al enviar al background:', err);
    showToast('error', chrome.i18n.getMessage('clip_failed') || 'Error de conexión');
  }
})();

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Muestra un toast en la página usando Shadow DOM para aislar estilos. */
function showToast(kind: ToastKind, message: string): void {
  const host = document.createElement('zen-reader-toast');
  const shadow = host.attachShadow({ mode: 'closed' });

  document.documentElement.appendChild(host);

  // Inyectamos los estilos mínimos del toast dentro del shadow para que
  // no interfiere con los estilos de la página subyacente.
  const style = document.createElement('style');
  style.textContent = TOAST_CSS;
  shadow.appendChild(style);

  // Montamos el componente Preact dentro del shadow root.
  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  const onDone = () => {
    requestAnimationFrame(() => host.remove());
  };

  render(
    <ToastNotification kind={kind} message={message} onDone={onDone} />,
    mountPoint,
  );
}

/** CSS mínimo encapsulado del toast (aislado por Shadow DOM).
 *  Los colores se declaran como variables CSS locales (`--toast-*`) con
 *  fallback en hex: la página host no define los tokens de tema de
 *  ZenReader, así que el toast es autónomo pero sobrescribible. */
const TOAST_CSS = `
:host {
  all: initial;
  --toast-bg: #FEFEFE;
  --toast-text: #1A1A1A;
  --toast-icon: #FFFFFF;
  --toast-success: #1F8A4D;
  --toast-error: #C0392B;
  --toast-info: #A0522D;
  --toast-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
  position: fixed !important;
  top: 16px !important;
  right: 16px !important;
  z-index: 2147483647 !important;
  pointer-events: none;
}

.zen-toast {
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: min(320px, calc(100vw - 32px));
  padding: 12px 18px;
  border-radius: 10px;
  background: var(--toast-bg, #FEFEFE);
  color: var(--toast-text, #1A1A1A);
  box-shadow: var(--toast-shadow, 0 4px 20px rgba(0, 0, 0, 0.18));
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  pointer-events: auto;
  box-sizing: border-box;
}

@keyframes zenToastIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes zenToastOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(6px); }
}

.zen-toast__icon {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: var(--toast-icon, #FFFFFF);
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.zen-toast__icon[data-kind='success'] {
  background: var(--toast-success, #1F8A4D);
}

.zen-toast__icon[data-kind='error'] {
  background: var(--toast-error, #C0392B);
}

.zen-toast__icon[data-kind='info'] {
  background: var(--toast-info, #A0522D);
}

.zen-toast__msg {
  all: unset;
  color: inherit;
  font: inherit;
}
`;