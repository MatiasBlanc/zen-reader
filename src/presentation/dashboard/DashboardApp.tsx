import { useEffect, useRef } from 'preact/hooks';
import { useAppStore } from './store';
import { useArticles } from './hooks/useArticles';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { BookOpen } from '../icons';

/**
 * Dashboard principal de Zen Reader.
 * Layout de dos paneles:
 *  - Izquierda: barra lateral con listado de artículos (scroll).
 *  - Derecha: panel lector con el artículo seleccionado.
 *
 * Al abrir la biblioteca, se selecciona automáticamente el último
 * artículo pendiente (si existe) para minimizar clicks.
 */
export function DashboardApp() {
  const { pending, archived, loading } = useArticles();
  const preferences = useAppStore((s) => s.preferences);
  const fetchPreferences = useAppStore((s) => s.fetchPreferences);
  const readerArticleId = useAppStore((s) => s.readerArticleId);
  const openReader = useAppStore((s) => s.openReader);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const autoSelected = useRef(false);

  // Cargar preferencias al montar.
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Auto-seleccionar el último artículo pendiente al cargar.
  useEffect(() => {
    if (!loading && !autoSelected.current && !readerArticleId && pending.length > 0) {
      autoSelected.current = true;
      openReader(pending[0].id);
    }
  }, [loading, readerArticleId, pending, openReader]);

  // Aplicar tema al <html> globalmente.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-paper', 'theme-dark');
    root.classList.add(`theme-${preferences.theme}`);
    document.body.style.backgroundColor = 'var(--zen-bg)';
    document.body.style.color = 'var(--zen-text)';
  }, [preferences.theme]);

  const hasArticles = pending.length > 0 || archived.length > 0;

  return (
    <div class="dashboard-root">
      {/* Backdrop del drawer en móvil: cierra la barra lateral al tocar el lector. */}
      {!sidebarCollapsed && (
        <div
          class="dashboard-backdrop"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      {/* ── Barra lateral (comprimible) ──────────────────────────────── */}
      <Sidebar
        pending={pending}
        archived={archived}
        loading={loading}
        collapsed={sidebarCollapsed}
      />

      {/* ── Panel lector ─────────────────────────────────────────────── */}
      <main class="dashboard-main">
        {!hasArticles && !loading ? (
          <EmptyState />
        ) : (
          <ReaderView />
        )}
      </main>
    </div>
  );
}

/* ── Estado vacío ──────────────────────────────────────────────────────────── */

/** Se muestra cuando no hay ningún artículo guardado. */
function EmptyState() {
  return (
    <div class="empty-state">
      <BookOpen size={64} class="empty-state__icon" />
      <p class="empty-state__title">
        {chrome.i18n.getMessage('no_articles') || 'Sin artículos guardados'}
      </p>
      <p class="empty-state__subtitle">
        Abre cualquier artículo en la web y presiona{' '}
        <kbd class="kbd">Ctrl+Shift+S</kbd>{' '}
        o usa el botón del popup para guardarlo aquí.
      </p>
    </div>
  );
}
