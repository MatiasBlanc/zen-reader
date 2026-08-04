import { useAppStore } from '../store';

/**
 * Toggle de tema: alterna entre "papel" (estilo Kindle) y "oscuro técnico".
 * Se renderiza como un interruptor visual discreto que no compite con
 * el contenido del artículo.
 * Reproduce un sonido de interacción al cambiar el tema.
 */
export function ThemeToggle() {
  const preferences = useAppStore((s) => s.preferences);
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const soundPlayer = useAppStore((s) => s.soundPlayer);

  const isDark = preferences.theme === 'dark';

  const handleToggle = () => {
    soundPlayer.play('toggle');
    updatePreferences({ theme: isDark ? 'paper' : 'dark' });
  };

  return (
    <button
      onClick={handleToggle}
      class={`relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full border-0 transition-colors duration-200 ${isDark ? 'bg-accent' : 'bg-line'}`}
      title={isDark
        ? chrome.i18n.getMessage('reader_theme_paper') || 'Tema papel'
        : chrome.i18n.getMessage('reader_theme_dark') || 'Tema oscuro'}
      role="switch"
      aria-checked={isDark}
    >
      <span
        class={`absolute left-0.5 top-0.5 h-7 w-7 rounded-full bg-white shadow-md transition-transform duration-200 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
      />
      <span class="sr-only">
        {isDark
          ? chrome.i18n.getMessage('reader_theme_paper') || 'Tema papel'
          : chrome.i18n.getMessage('reader_theme_dark') || 'Tema oscuro'}
      </span>
    </button>
  );
}
