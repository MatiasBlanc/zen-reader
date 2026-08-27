/**
 * Contrato de notificación al usuario.
 * En V1 se implementa con el toast flotante (chrome-toast.notifier.ts).
 */
export interface Notifier {
  /** Muestra una confirmación de éxito. */
  success(message: string): void;

  /** Muestra un aviso de error. */
  error(message: string): void;
}
