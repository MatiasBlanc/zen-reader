import { useCallback, useState } from 'preact/hooks';
import { useAppStore } from '../store';
import { SidebarLeft, Menu2, Archive, ChevronRight } from '../../icons';
import type { ArticleMetadata } from '@domain/entities/article';

interface SidebarProps {
  pending: ArticleMetadata[];
  archived: ArticleMetadata[];
  loading: boolean;
  collapsed: boolean;
}

/**
 * Barra lateral de Zen Reader.
 * Tiene dos modos: expandida (lista completa) y comprimida (rail estrecho).
 * En móvil se comporta como un drawer deslizable sobre el lector.
 */
export function Sidebar({ pending, archived, loading, collapsed }: SidebarProps) {
  const readerArticleId = useAppStore((s) => s.readerArticleId);
  const openReader = useAppStore((s) => s.openReader);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const [showArchived, setShowArchived] = useState(false);

  const handleSelect = useCallback((id: string) => {
    openReader(id);
  }, [openReader]);

  const toggleArchived = useCallback(() => {
    setShowArchived((v) => !v);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <aside class={`sidebar ${collapsed ? 'sidebar--collapsed' : 'sidebar--expanded'}`}>
      {collapsed ? (
        <RailToggle onClick={handleToggleSidebar} pendingCount={pending.length} />
      ) : (
        <nav class="sidebar-nav" aria-label="Barra lateral">
          {/* ── Cabecera ─────────────────────────────────────────────── */}
          <header class="sidebar-header">
            <h1 class="sidebar-title">Zen Reader</h1>
            <button
              class="btn-icon"
              onClick={handleToggleSidebar}
              type="button"
              title="Comprimir barra lateral"
              aria-label="Comprimir barra lateral"
            >
              <SidebarLeft size={16} />
            </button>
          </header>

          {/* ── Pendientes ───────────────────────────────────────────── */}
          <section class="sidebar-section" aria-labelledby="pending-heading">
            <div id="pending-heading" class="sidebar-section-header">
              <h2 class="sidebar-section-label">Pendientes</h2>
              {pending.length > 0 && (
                <span class="badge">{pending.length}</span>
              )}
            </div>

            <ul class="sidebar-list" role="list">
              {loading && pending.length === 0 ? (
                <li class="sidebar-empty">Cargando…</li>
              ) : pending.length === 0 ? (
                <li class="sidebar-empty">Sin artículos pendientes</li>
              ) : (
                pending.map((a) => (
                  <SidebarItem
                    key={a.id}
                    article={a}
                    isActive={a.id === readerArticleId}
                    onSelect={handleSelect}
                  />
                ))
              )}
            </ul>
          </section>

          {/* ── Archivados (colapsable) ──────────────────────────────── */}
          {archived.length > 0 && (
            <section class="sidebar-archived-section" aria-labelledby="archived-heading">
              <button
                id="archived-heading"
                class="sidebar-archived-toggle"
                onClick={toggleArchived}
                type="button"
                aria-expanded={showArchived}
              >
                <ChevronRight
                  size={12}
                  class={`chevron ${showArchived ? 'chevron--open' : ''}`}
                />
                <Archive size={14} />
                Leídos
                <span class="badge">{archived.length}</span>
              </button>

              {showArchived && (
                <ul class="sidebar-list" role="list">
                  {archived.map((a) => (
                    <SidebarItem
                      key={a.id}
                      article={a}
                      isActive={a.id === readerArticleId}
                      onSelect={handleSelect}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
        </nav>
      )}
    </aside>
  );
}

/* ── RailToggle ──────────────────────────────────────────────────────────── */

interface RailToggleProps {
  onClick: () => void;
  /** Nº de pendientes para mostrar un indicador en el rail. */
  pendingCount: number;
}

/**
 * Rail estrecho que se muestra con la barra lateral comprimida:
 * solo el botón para volver a expandirla y un indicador de pendientes.
 */
function RailToggle({ onClick, pendingCount }: RailToggleProps) {
  return (
    <nav class="sidebar-rail" aria-label="Barra lateral comprimida">
      <button
        class="btn-icon btn-icon-sm"
        onClick={onClick}
        type="button"
        title="Expandir barra lateral"
        aria-label="Expandir barra lateral"
      >
        <Menu2 size={18} />
      </button>

      {pendingCount > 0 && (
        <span
          class="badge"
          title={`${pendingCount} pendientes`}
          aria-label={`${pendingCount} artículos pendientes`}
        >
          {pendingCount}
        </span>
      )}
    </nav>
  );
}

/* ── SidebarItem ─────────────────────────────────────────────────────────── */

interface SidebarItemProps {
  article: ArticleMetadata;
  isActive: boolean;
  onSelect: (id: string) => void;
}

/** Elemento compacto de la lista lateral. */
function SidebarItem({ article, isActive, onSelect }: SidebarItemProps) {
  const domain = extractDomain(article.url);
  const relativeDate = formatRelativeDate(article.savedAt);

  return (
    <li style="margin:0;padding:0">
      <button
        class={`sidebar-item-btn${isActive ? ' sidebar-item-btn--active' : ''}`}
        onClick={() => onSelect(article.id)}
        type="button"
        title={article.title}
        aria-current={isActive ? 'page' : undefined}
      >
        <span class="sidebar-item-title">{article.title}</span>
        <span class="sidebar-item-meta">{domain} · {relativeDate}</span>
      </button>
    </li>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function formatRelativeDate(ts: number): string {
  const now = Date.now();
  const diffMs = now - ts;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay === 1) return '1d';
  return `${diffDay}d`;
}
