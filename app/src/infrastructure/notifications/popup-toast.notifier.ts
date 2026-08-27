import type { Notifier } from '@application/ports/notifier.port';

/** Tipo de toast soportado por el notifier del popup. */
export type PopupToastKind = 'success' | 'error';

/**
 * Callback al que se le entrega el toast para que la UI lo renderice.
 * Recibe el tipo y el mensaje; el temporizador de auto-ocultado lo
 * gestiona el componente (PopupApp), no el notifier.
 */
export type PopupToastHandler = (kind: PopupToastKind, message: string) => void;

/**
 * Notificador del popup.
 * Solo puentea el mensaje al estado de Preact para que se renderice
 * dentro del árbol del popup, en un único punto.
 */
export class PopupToastNotifier implements Notifier {
  constructor(private readonly handler: PopupToastHandler) {}

  success(message: string): void {
    this.handler('success', message);
  }

  error(message: string): void {
    this.handler('error', message);
  }
}
