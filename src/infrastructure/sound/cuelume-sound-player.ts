import type { SoundPlayer } from '@application/ports/sound-player.port';
import { sounds } from 'cuelume';
import type { SoundName } from 'cuelume';

/** Conjunto de nombres de sonido conocidos, para validar en runtime. */
const KNOWN_SOUNDS: ReadonlySet<string> = new Set(sounds);

/**
 * Comprueba si un identificador corresponde a un sonido conocido de Cuelume.
 * @param soundId identificador arbitrario (p. ej. desde preferencias).
 * @returns true si el sonido existe en el catálogo.
 */
function isKnownSound(soundId: string): soundId is SoundName {
  return KNOWN_SOUNDS.has(soundId);
}

/**
 * Implementación del puerto SoundPlayer usando la librería Cuelume.
 * Proporciona sonidos de interacción sintetizados con Web Audio.
 */
export class CuelumeSoundPlayer implements SoundPlayer {
  private cuelume: typeof import('cuelume') | null = null;
  private initialized = false;

  /**
   * Inicializa Cuelume de forma lazy para evitar problemas de SSR/CSR.
   * Se ejecuta automáticamente en la primera llamada a play().
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.cuelume = await import('cuelume');
      this.cuelume.bind(); // Vincula todos los data-cuelume-* attributes
      this.cuelume.setVolume(0.7); // Volumen global
      this.initialized = true;
    } catch (error) {
      console.error('Error al inicializar Cuelume:', error);
    }
  }

  /**
   * Reproduce un sonido de interacción.
   * @param soundId Identificador del sonido (ej: "tick", "press", "success").
   */
  async play(soundId: string): Promise<void> {
    await this.initialize();

    // Validamos en runtime: Cuelume solo acepta nombres de su catálogo.
    if (this.cuelume && isKnownSound(soundId)) {
      this.cuelume.play(soundId);
    }
  }
}
