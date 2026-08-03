/**
 * Contrato para reproducir sonidos de interacción.
 * La capa de infraestructura implementa este puerto (p.ej. vía Cuelume),
 * y la capa de aplicación solo depende de esta interfaz.
 */
export interface SoundPlayer {
  /**
   * Reproduce un sonido por su identificador.
   * @param soundId Identificador del sonido (ej: "tick", "press", "success").
   */
  play(soundId: string): void;
}
