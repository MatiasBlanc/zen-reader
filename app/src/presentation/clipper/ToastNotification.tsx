import { useCallback, useEffect, useRef } from 'preact/hooks';
import type { ToastKind } from './toast-types';
import { Check, X, AlertCircle } from '../icons';

interface ToastNotificationProps {
  kind: ToastKind;
  message: string;
  onDone: () => void;
}

/**
 * Toast flotante del clipper. Se muestra en la esquina de la página,
 * se auto-oculta a los ~3 segundos y no bloquea clics en la página
 * subyacente (pointer-events: none).
 */
export function ToastNotification({ kind, message, onDone }: ToastNotificationProps) {
  const timerRef = useRef<number>();

  const tearDown = useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    onDone();
  }, [onDone]);

  useEffect(() => {
    timerRef.current = window.setTimeout(tearDown, 3000);
    return () => {
      if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
    };
  }, [tearDown]);

  const isSuccess = kind === 'success';
  const Icon = isSuccess ? Check : kind === 'error' ? X : AlertCircle;

  return (
    <div
      class="zen-toast zen-toast--enter"
      data-kind={kind}
      role="status"
      aria-live="polite"
      style={{ animation: 'zenToastIn 220ms ease-out' }}
    >
      <span class="zen-toast__icon" data-kind={kind}>
        <Icon size={13} />
      </span>
      <span class="zen-toast__msg">{message}</span>
    </div>
  );
}