import { useAppStore } from '../store';

/**
 * Toggle de tema: alterna entre "papel" (estilo Kindle) y "oscuro técnico".
 * Se renderiza como un interruptor visual discreto que no compite con
 * el contenido del artículo.
 */
export function ThemeToggle() {
  const preferences = useAppStore((s) => s.preferences);
  const updatePreferences = useAppStore((s) => s.updatePreferences);

  const isDark = preferences.theme === 'dark';

  const handleToggle = () => {
    updatePreferences({ theme: isDark ? 'paper' : 'dark' });
  };

  return (
    <button
      onClick={handleToggle}
      class={`theme-switch ${isDark ? 'theme-switch--dark' : 'theme-switch--light'}`}
      title={isDark
        ? chrome.i18n.getMessage('reader_theme_paper') || 'Tema papel'
        : chrome.i18n.getMessage('reader_theme_dark') || 'Tema oscuro'}
      role="switch"
      aria-checked={isDark}
    >
      <span class={`theme-switch-knob ${isDark ? 'theme-switch-knob--dark' : 'theme-switch-knob--light'}`} />
      <span class="sr-only">
        {isDark
          ? chrome.i18n.getMessage('reader_theme_paper') || 'Tema papel'
          : chrome.i18n.getMessage('reader_theme_dark') || 'Tema oscuro'}
      </span>
    </button>
  );
}
