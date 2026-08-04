import { useEffect, useRef } from 'preact/hooks';
import { useAppStore } from './store';
import { useArticles } from './hooks/useArticles';
import { Sidebar } from './components/Sidebar';
import { ReaderView } from './components/ReaderView';
import { BookOpen } from '../icons';

/**
 * Dashboard principal de ZenReader.
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
    // El fondo y el color del body se aplican con utilidades del tema
    // (bg-paper / text-ink) en lugar de var() inline: las utilidades
    // resuelven contra los tokens --zen-* que cambian con la clase de tema.
    document.body.classList.add('bg-paper', 'text-ink');
  }, [preferences.theme]);

  const hasArticles = pending.length > 0 || archived.length > 0;

  return (
    <div class="relative flex h-dvh overflow-hidden">
      {/* Backdrop del drawer en móvil: cierra la barra lateral al tocar el lector. */}
      {!sidebarCollapsed && (
        <div
          class="absolute inset-0 z-10 bg-black/25 md:hidden"
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
      <main class="h-full min-w-0 flex-1 overflow-hidden bg-reader">
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
    <div class="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <BookOpen size={64} class="text-ink opacity-20" />
      <p class="max-w-[28rem] text-xl font-medium text-ink">
        {chrome.i18n.getMessage('no_articles') || 'Sin artículos guardados'}
      </p>
      <p class="max-w-sm text-sm text-muted">
        Abre cualquier artículo en la web y presiona{' '}
        <kbd class="rounded bg-line px-1.5 py-0.5 font-mono text-xs">Ctrl+Shift+S</kbd>{' '}
        o usa el botón del popup para guardarlo aquí.
      </p>
    </div>
  );
}