import { useState, useCallback } from 'preact/hooks';
import type { ArticleMetadata } from '@domain/entities/article';
import { useAppStore } from '../store';
import { Archive, ChevronRight, SidebarLeft, Menu2 } from '../../icons';

interface SidebarProps {
  pending: ArticleMetadata[];
  archived: ArticleMetadata[];
  loading: boolean;
  /** true = barra comprimida a un rail estrecho con el toggle de expandir. */
  collapsed: boolean;
}

/**
 * Barra lateral del dashboard con listado de artículos.
 * Muestra los pendientes arriba (scrollable) y los archivados
 * en una sección colapsable abajo.
 *
 * Puede comprimirse a un rail estrecho (44px) con un botón de toggle;
 * la animación de ancho la controla el layout padre (`transition-[width]`).
 */
export function Sidebar({ pending, archived, loading, collapsed }: SidebarProps) {
  const readerArticleId = useAppStore((s) => s.readerArticleId);
  const openReader = useAppStore((s) => s.openReader);
  const soundPlayer = useAppStore((s) => s.soundPlayer);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const [showArchived, setShowArchived] = useState(false);

  const handleSelect = useCallback(
    (id: string) => {
      soundPlayer.play('press');
      openReader(id);
    },
    [openReader, soundPlayer],
  );

  const toggleArchived = useCallback(() => {
    soundPlayer.play('tick');
    setShowArchived((v) => !v);
  }, [soundPlayer]);

  const handleToggleSidebar = useCallback(() => {
    soundPlayer.play('press');
    toggleSidebar();
  }, [soundPlayer, toggleSidebar]);

  return (
    <aside
      class={`shrink-0 border-r border-line bg-bg transition-[width] duration-300 ease-in-out ${
        collapsed ? 'w-11' : 'w-[280px]'
      }`}
    >
      {collapsed ? (
        <RailToggle onClick={handleToggleSidebar} pendingCount={pending.length} />
      ) : (
        <nav class="flex h-full flex-col" aria-label="Barra lateral">
          {/* ── Cabecera ─────────────────────────────────────────────── */}
          <header class="flex shrink-0 items-center justify-between p-3 mb-2">
            <h1 class="m-0 text-lg font-bold tracking-tight text-ink">ZenReader</h1>
            <button
              class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-line hover:text-ink"
              onClick={handleToggleSidebar}
              type="button"
              title="Comprimir barra lateral"
              aria-label="Comprimir barra lateral"
            >
              <SidebarLeft size={16} />
            </button>
          </header>

          {/* ── Pendientes ───────────────────────────────────────────── */}
          <section class="flex min-h-0 flex-1 flex-col overflow-hidden" aria-labelledby="pending-heading">
            <div id="pending-heading" class="w-full mb-3 flex items-center justify-between gap-2 px-3">
              <h2 class="text-muted font-semibold uppercase tracking-widest text-[11px]">Pendientes</h2>
              {pending.length > 0 && (
                <span class="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent p-1.5 text-[10px] font-semibold leading-none text-on-accent">
                  {pending.length}
                </span>
              )}
            </div>

            <ul class="flex-1 list-none overflow-y-auto overflow-x-hidden pb-2 m-0" role="list">
              {loading && pending.length === 0 ? (
                <li class="px-5 py-3 text-[13px] text-muted opacity-60">Cargando…</li>
              ) : pending.length === 0 ? (
                <li class="px-5 py-3 text-[13px] text-muted opacity-60">Sin artículos pendientes</li>
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
            <section class="max-h-[40vh] shrink-0 border-t border-line" aria-labelledby="archived-heading">
              <button
                id="archived-heading"
                class="flex w-full items-center gap-2 px-5 pb-2 pt-3.5 text-[11px] font-semibold uppercase tracking-widest text-muted transition-colors hover:text-ink"
                onClick={toggleArchived}
                type="button"
                aria-expanded={showArchived}
              >
                <ChevronRight
                  size={12}
                  class={`transition-transform duration-200 ${showArchived ? 'rotate-90' : ''}`}
                />
                <Archive size={14} />
                Leídos
                <span class="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold leading-none text-on-accent">
                  {archived.length}
                </span>
              </button>

              {showArchived && (
                <ul class="list-none overflow-y-auto overflow-x-hidden pb-2 m-0" role="list">
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
    <nav class="flex h-full flex-col items-center gap-2 pt-4" aria-label="Barra lateral comprimida">
      <button
        class="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-line hover:text-ink"
        onClick={onClick}
        type="button"
        title="Expandir barra lateral"
        aria-label="Expandir barra lateral"
      >
        <Menu2 size={18} />
      </button>

      {pendingCount > 0 && (
        <span
          class="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-semibold leading-none text-on-accent"
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
    <li class="m-0 p-0">
      <button
        class={`flex w-full flex-col px-3 py-2.5 text-left transition-colors ${isActive ? 'bg-line/30' : 'bg-transparent'}`}
        onClick={() => onSelect(article.id)}
        type="button"
        title={article.title}
        aria-current={isActive ? 'page' : undefined}
      >
        <span class="line-clamp-2 text-[13px] font-medium leading-[1.35] text-ink">
          {article.title}
        </span>
        <span class="text-[11px] text-muted opacity-70">
          {domain} · {relativeDate}
        </span>
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
