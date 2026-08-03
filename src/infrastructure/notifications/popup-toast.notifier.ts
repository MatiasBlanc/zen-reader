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
 *
 * A diferencia de ChromeToastNotifier (pensado para el clipper, que
 * inyecta un nodo `position: fixed` en la página host), este adaptador
 * NO toca el DOM: en la ventana diminuta del popup ese toast aparecía
 * duplicado (arriba y abajo) o cortado por los límites. Aquí solo se
 * puentea el mensaje al estado de React para que se renderice dentro
 * del árbol del popup, en un único punto.
 */
export class PopupToastNotifier implements Notifier {
  constructor(private readonly handler: PopupToastHandler) {}

  success(message: string): void {
    this.handler('success', message);
  }

  error(message: string): void {
    this.handler('error', message);
  }

  /**
   * No-op: el sonido de éxito se reproduce en la UI vía SoundPlayer
   * (app.soundPlayer), centralizado en el contenedor.
   */
  playSuccessSound(): void {}

  /**
   * No-op: el sonido de error se reproduce en la UI vía SoundPlayer
   * (app.soundPlayer), centralizado en el contenedor.
   */
  playErrorSound(): void {}
}
