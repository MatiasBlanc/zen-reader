import type { Notifier } from '@application/ports/notifier.port';

/**
 * Notificador usado en las páginas de la extensión (popup/dashboard).
 * Inyecta un toast flotante efímero en el `document` del host y lo
 * auto-oculta a los ~3 segundos, sin bloquear la interacción.
 * Incluye sonidos de notificación usando Cuelume.
 */
export class ChromeToastNotifier implements Notifier {
  private readonly durationMs: number;
  private cuelume: typeof import('cuelume') | null = null;
  private cuelumeInitialized = false;

  constructor(durationMs = 3000) {
    this.durationMs = durationMs;
  }

  success(message: string): void {
    this.show(message, 'success');
    this.playSuccessSound();
  }

  error(message: string): void {
    this.show(message, 'error');
    this.playErrorSound();
  }

  /**
   * Inicializa Cuelume de forma lazy para evitar problemas de SSR/CSR.
   * Se ejecuta automáticamente en la primera llamada a los sonidos.
   */
  private async initializeCuelume(): Promise<void> {
    if (this.cuelumeInitialized) return;

    try {
      this.cuelume = await import('cuelume');
      this.cuelume.setVolume(0.7); // Volumen global para notificaciones
      this.cuelumeInitialized = true;
    } catch (error) {
      console.error('Error al inicializar Cuelume para notificaciones:', error);
    }
  }

  /**
   * Reproduce el sonido de éxito asociado a la notificación.
   * Se ejecuta junto con success() para feedback auditivo.
   */
  async playSuccessSound(): Promise<void> {
    await this.initializeCuelume();
    if (this.cuelume) {
      this.cuelume.play('success');
    }
  }

  /**
   * Reproduce el sonido de error asociado a la notificación.
   * Se ejecuta junto con error() para feedback auditivo.
   */
  async playErrorSound(): Promise<void> {
    await this.initializeCuelume();
    if (this.cuelume) {
      this.cuelume.play('error');
    }
  }

  /** Dibuja y anima el toast en el host actual. */
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

    // Fuerza el reflow para disparar la transición de entrada.
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

/** Devuelve los estilos base del toast (top-right, fijo, elevado).
 *  Los colores referencian los tokens de tema (`--zen-*`) definidos en
 *  index.css, con fallback en hex por si el host no los define. */
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