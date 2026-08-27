import type { Notifier } from '@application/ports/notifier.port';

/**
 * Notificador usado en las páginas de la extensión (popup/dashboard).
 * Inyecta un toast flotante efímero en el `document` del host y lo
 * auto-oculta a los ~3 segundos, sin bloquear la interacción.
 */
export class ChromeToastNotifier implements Notifier {
  private readonly durationMs: number;

  constructor(durationMs = 3000) {
    this.durationMs = durationMs;
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }


  private show(message: string, kind: 'success' | 'error'): void {
    if (typeof document === 'undefined') return;

    const host = document.createElement('div');
    host.setAttribute('data-zen-reader-toast', kind);
    host.textContent = message;
    Object.assign(host.style, toastStyle());

    const accent = kind === 'success'
      ? 'var(--zen-accent, #A0522D)'
      : 'var(--zen-danger, #C0392B)';
    host.style.borderLeft = `4px solid ${accent}`;

    document.documentElement.appendChild(host);

    requestAnimationFrame(() => {
      host.style.opacity = '1';
      host.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
      host.style.opacity = '0';
      host.style.transform = 'translateY(8px)';
      window.setTimeout(() => host.remove(), 320);
    }, this.durationMs);
  }
}

function toastStyle(): Record<string, string> {
  return {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: '2147483647',
    maxWidth: '300px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'var(--zen-card, #FFFFFF)',
    color: 'var(--zen-text, #2B2B2B)',
    boxShadow: 'var(--zen-shadow, 0 4px 16px rgba(0,0,0,0.18))',
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontSize: '14px',
    lineHeight: '1.4',
    border: '1px solid var(--zen-border, transparent)',
    opacity: '0',
    transform: 'translateY(8px)',
    transition: 'opacity 240ms ease, transform 240ms ease',
    pointerEvents: 'none',
  };
}