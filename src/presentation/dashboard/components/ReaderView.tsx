import { useEffect, useCallback, useRef } from 'preact/hooks';
import { useAppStore } from '../store';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen, Check, Undo, Trash, ArrowLeft, ArrowRight } from '../../icons';

/**
 * Panel lector integrado en el layout de dos columnas.
 * Renderiza el `contentHTML` sanitizado de un artículo con tipografía
 * optimizada para lectura prolongada. No ocupa toda la pantalla,
 * sino el espacio restante junto a la barra lateral.
 */
export function ReaderView() {
  const article = useAppStore((s) => s.readerArticle);
  const loading = useAppStore((s) => s.readerLoading);
  const preferences = useAppStore((s) => s.preferences);
  const archiveArticle = useAppStore((s) => s.archiveArticle);
  const deleteArticle = useAppStore((s) => s.deleteArticle);

  // Actualizar título del documento al abrir un artículo.
  useEffect(() => {
    if (article) {
      document.title = `${article.title} — ZenReader`;
    }
    return () => {
      document.title = 'ZenReader — Biblioteca';
    };
  }, [article]);

  // Navegar con flechas del teclado entre artículos.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'ArrowDown') {
        navigateToNext();
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        navigateToPrev();
      } else if (e.key === 'e') {
        if (article) archiveArticle(article.id, !article.isArchived);
      } else if (e.key === 's') {
        useAppStore.getState().toggleSidebar();
      } else if (e.key === 'd') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [article, archiveArticle]);

  /** Navega al siguiente artículo pendiente. */
  const navigateToNext = useCallback(() => {
    const state = useAppStore.getState();
    const { articles, readerArticleId } = state;
    const pending = articles.filter((a) => !a.isArchived);
    if (!readerArticleId || pending.length === 0) return;
    const idx = pending.findIndex((a) => a.id === readerArticleId);
    const next = pending[idx + 1] ?? pending[0];
    if (next && next.id !== readerArticleId) {
      useAppStore.getState().openReader(next.id);
    }
  }, []);

  /** Navega al artículo pendiente anterior. */
  const navigateToPrev = useCallback(() => {
    const state = useAppStore.getState();
    const { articles, readerArticleId } = state;
    const pending = articles.filter((a) => !a.isArchived);
    if (!readerArticleId || pending.length === 0) return;
    const idx = pending.findIndex((a) => a.id === readerArticleId);
    const prev = pending[idx - 1] ?? pending[pending.length - 1];
    if (prev && prev.id !== readerArticleId) {
      useAppStore.getState().openReader(prev.id);
    }
  }, []);

  const handleArchive = useCallback(() => {
    if (article) archiveArticle(article.id, !article.isArchived);
  }, [article, archiveArticle]);

  const handleDelete = useCallback(() => {
    if (!article) return;
    const msg = chrome.i18n.getMessage('confirm_delete') || '¿Eliminar este artículo?';
    if (window.confirm(msg)) {
      // Buscar el siguiente artículo antes de eliminar.
      const state = useAppStore.getState();
      const pending = state.articles.filter((a) => !a.isArchived);
      const idx = pending.findIndex((a) => a.id === article.id);
      const next = pending[idx + 1] ?? pending[0];

      deleteArticle(article.id);

      // Navegar al siguiente si existe.
      if (next && next.id !== article.id) {
        useAppStore.getState().openReader(next.id);
      }
    }
  }, [article, deleteArticle]);

  if (loading) {
    return (
      <div class="flex h-full items-center justify-center text-muted">
        <span class="animate-pulse">Cargando artículo…</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div class="flex h-full flex-col items-center justify-center gap-4 text-muted">
        <BookOpen size={40} class="text-ink opacity-20" />
        <p>Selecciona un artículo para leer</p>
        <p class="text-sm opacity-60">
          Usa <kbd class="rounded bg-line px-1 py-0.5 font-mono text-xs">j</kbd>/
          <kbd class="rounded bg-line px-1 py-0.5 font-mono text-xs">k</kbd> para navegar, <kbd class="rounded bg-line px-1 py-0.5 font-mono text-xs">s</kbd> sidebar, <kbd class="rounded bg-line px-1 py-0.5 font-mono text-xs">d</kbd> eliminar
        </p>
      </div>
    );
  }

  const fontSizeClass =
    preferences.fontSize === 'small'
      ? 'text-base'
      : preferences.fontSize === 'large'
        ? 'text-xl'
        : 'text-lg';

  return (
    <div class="flex h-full flex-col">
      {/* ── Barra de herramientas ─────────────────────────────────── */}
      <div class="flex shrink-0 items-center justify-between border-b border-line bg-reader px-5 py-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted opacity-70">{extractDomain(article.url)}</span>
        </div>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          <button
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-line hover:text-ink"
            onClick={handleArchive}
            title={article.isArchived
              ? chrome.i18n.getMessage('mark_as_unread') || 'Volver a pendientes'
              : chrome.i18n.getMessage('mark_as_read') || 'Marcar como leído'}
          >
            {article.isArchived ? <Undo size={16} /> : <Check size={16} />}
          </button>
          <button
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-danger transition-colors hover:bg-danger hover:text-on-accent"
            onClick={handleDelete}
            title={chrome.i18n.getMessage('delete') || 'Eliminar'}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* ── Contenido del artículo ───────────────────────────────── */}
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <article class="mx-auto max-w-[680px] px-10 pb-12 pt-8">
          <h1 class="mb-6 text-[1.75rem] font-bold leading-[1.25] tracking-tight text-heading">
            {article.title}
          </h1>

          <SanitizedHTML html={article.contentHTML} class={`prose max-w-none text-ink prose-headings:text-heading prose-a:text-accent prose-blockquote:border-accent prose-pre:bg-line prose-pre:text-ink ${fontSizeClass}`} />
        </article>

        {/* ── Navegación inferior ────────────────────────────────── */}
        <div class="mt-4 flex items-center justify-center gap-3 border-t border-line px-10 py-6">
          <button
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-line hover:text-ink"
            onClick={navigateToPrev}
            title="Anterior (k)"
          >
            <ArrowLeft size={15} /> Anterior
          </button>
          <button
            class="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-[13px] font-medium text-on-accent transition-opacity hover:opacity-90"
            onClick={() => { archiveArticle(article.id, true); navigateToNext(); }}
            title="Marcar leído y siguiente (Enter)"
          >
            <Check size={15} /> Leído, siguiente
          </button>
          <button
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-line hover:text-ink"
            onClick={navigateToNext}
            title="Siguiente (j)"
          >
            Siguiente <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/**
 * Renderiza HTML sanitizado sin usar dangerouslySetInnerHTML.
 * Usa DOMParser + adoptNode para evitar warnings de innerHTML inseguro.
 */
function SanitizedHTML({ html, class: className }: { html: string; class?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Limpiar contenido previo.
    ref.current.textContent = '';

    // Parsear el HTML sanitizado (ya pasado por DOMPurify).
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    const parsed = doc.body.firstElementChild;

    if (parsed) {
      // adoptNode transfiere el nodo al documento actual sin innerHTML.
      const adopted = document.adoptNode(parsed);
      ref.current.appendChild(adopted);
    }
  }, [html]);

  return <div ref={ref} class={className} />;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
