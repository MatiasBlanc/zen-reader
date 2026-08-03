/**
 * Calcula el tiempo estimado de lectura de un texto puro.
 * Función pura: sin efectos, sin dependencias externas.
 * (Utilidad de V2; se mantiene en el dominio como helpers reutilizable.)
 */

/**
 * Palabras por minuto usadas como referencia de lectura cómoda en español.
 * Valores conservadores para lectura profunda de artículos.
 */
const STANDARD_WORDS_PER_MINUTE = 200;

/** Cota mínima de minutos devuelta para evitar "0 min". */
const MIN_READING_MINUTES = 1;

/**
 * Estima los minutos necesarios para leer un texto dado.
 *
 * @param text Texto plano (ya sin markup) del artículo.
 * @returns minutos de lectura redondeados (mínimo 1).
 */
export function estimateReadingMinutes(text: string): number {
  const words = countWords(text);
  const minutes = Math.ceil(words / STANDARD_WORDS_PER_MINUTE);
  return Math.max(minutes, MIN_READING_MINUTES);
}

/**
 * Cuenta las palabras de un texto normalizando espacios y saltos de línea.
 * @param text Texto plano.
 * @returns número de palabras.
 */
function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}