import { useEffect, useCallback, useRef } from 'preact/hooks';
import { useAppStore } from '../store';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen, Check, Undo, Trash, ArrowLeft, ArrowRight } from '../../icons';

/**
 * Panel lector integrado en el layout de dos columnas.
 * Renderiza el `contentHTML` sanitizado de un artículo con tipografía
 * optimizada para lectura prolongada.
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
      document.title = `${article.title} — Zen Reader`;
    }
    return () => {
      document.title = 'Zen Reader — Biblioteca';
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
      <div class="reader-loading">
        <span class="animate-pulse">Cargando artículo…</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div class="reader-placeholder">
        <BookOpen size={40} style="color:var(--zen-text);opacity:0.2" />
        <p>Selecciona un artículo para leer</p>
        <p style="font-size:14px;opacity:0.6">
          Usa <kbd class="kbd">j</kbd>/<kbd class="kbd">k</kbd> para navegar,{' '}
          <kbd class="kbd">s</kbd> sidebar, <kbd class="kbd">d</kbd> eliminar
        </p>
      </div>
    );
  }

  const fontSizeClass =
    preferences.fontSize === 'small'
      ? 'reader-content--sm'
      : preferences.fontSize === 'large'
        ? 'reader-content--lg'
        : 'reader-content--md';

  return (
    <div class="reader-panel">
      {/* ── Barra de herramientas ─────────────────────────────────── */}
      <div class="reader-toolbar">
        <div class="reader-toolbar-domain">
          <span>{extractDomain(article.url)}</span>
        </div>

        <div class="reader-toolbar-actions">
          <ThemeToggle />
          <button
            class="btn-ghost"
            onClick={handleArchive}
            title={article.isArchived
              ? chrome.i18n.getMessage('mark_as_unread') || 'Volver a pendientes'
              : chrome.i18n.getMessage('mark_as_read') || 'Marcar como leído'}
          >
            {article.isArchived ? <Undo size={16} /> : <Check size={16} />}
          </button>
          <button
            class="btn-ghost-danger"
            onClick={handleDelete}
            title={chrome.i18n.getMessage('delete') || 'Eliminar'}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* ── Contenido del artículo ───────────────────────────────── */}
      <div class="reader-scroll">
        <article class="reader-article">
          <h1 class="reader-article-title">{article.title}</h1>
          <SanitizedHTML html={article.contentHTML} class={`reader-content ${fontSizeClass}`} />
        </article>

        {/* ── Navegación inferior ────────────────────────────────── */}
        <div class="reader-nav">
          <button
            class="btn-ghost"
            onClick={navigateToPrev}
            title="Anterior (k)"
          >
            <ArrowLeft size={15} /> <span class="label">Anterior</span>
          </button>
          <button
            class="btn-read-next"
            onClick={() => { archiveArticle(article.id, true); navigateToNext(); }}
            title="Marcar leído y siguiente (Enter)"
          >
            <Check size={15} /> <span class="label">Leído, siguiente</span>
          </button>
          <button
            class="btn-ghost"
            onClick={navigateToNext}
            title="Siguiente (j)"
          >
            <span class="label">Siguiente</span> <ArrowRight size={15} />
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
