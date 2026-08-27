import { create } from 'zustand';
import type { ArticleMetadata } from '@domain/entities/article';
import type { Article } from '@domain/entities/article';
import type { UserPreferences } from '@domain/entities/preferences';
import { DEFAULT_PREFERENCES } from '@application/use-cases/update-preferences.use-case';
import { createContainer } from '@infrastructure/di/container';
import { ChromeToastNotifier } from '@infrastructure/notifications/chrome-toast.notifier';
import type { Notifier } from '@application/ports/notifier.port';

/**
 * Store Zustand de la aplicación dashboard.
 * Centraliza el estado de la biblioteca, el artículo activo en el lector
 * y las preferencias del usuario.
 * Inyecta el contenedor de Clean Architecture (composition root) con
 * el notificador del contexto de UI.
 */

const dashboardNotifier: Notifier = new ChromeToastNotifier();
const app = createContainer(dashboardNotifier);

export interface AppState {
  /* ── Biblioteca ─────────────────────────────────────────────────────── */
  articles: ArticleMetadata[];
  loading: boolean;
  fetchLibrary: () => Promise<void>;

  /* ── Acciones sobre artículos ────────────────────────────────────────── */
  archiveArticle: (id: string, isArchived: boolean) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;

  /* ── Lector ──────────────────────────────────────────────────────────── */
  readerArticleId: string | null;
  readerArticle: Article | null;
  readerLoading: boolean;
  openReader: (id: string) => Promise<void>;
  closeReader: () => void;

  /* ── Preferencias ────────────────────────────────────────────────────── */
  preferences: UserPreferences;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (partial: Partial<UserPreferences>) => Promise<void>;

  /* ── Layout ──────────────────────────────────────────────────────────── */
  /** true = barra lateral comprimida a un rail estrecho. */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  /* ── Estado inicial ──────────────────────────────────────────────────── */
  articles: [],
  loading: false,
  readerArticleId: null,
  readerArticle: null,
  readerLoading: false,
  preferences: DEFAULT_PREFERENCES,

  /* ── Layout ──────────────────────────────────────────────────────────── */
  sidebarCollapsed: isMobileViewport(),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  /* ── Biblioteca ─────────────────────────────────────────────────────── */
  fetchLibrary: async () => {
    set({ loading: true });
    try {
      const items = await app.library.getLibrary();
      set({ articles: items, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  /* ── Acciones ────────────────────────────────────────────────────────── */
  archiveArticle: async (id: string, isArchived: boolean) => {
    await app.markAsRead.execute(id, isArchived);
    // Actualización optimista de la lista.
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id ? { ...a, isArchived } : a,
      ),
    }));
  },

  deleteArticle: async (id: string) => {
    await app.deleteArticle.execute(id);
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
      // Si estábamos leyendo el artículo eliminado, cerramos el lector.
      ...(state.readerArticleId === id
        ? { readerArticleId: null, readerArticle: null }
        : {}),
    }));
  },

  /* ── Lector ──────────────────────────────────────────────────────────── */
  openReader: async (id: string) => {
    // En móvil, abrir un artículo pliega la barra lateral: el lector
    // se queda con todo el ancho disponible.
    if (isMobileViewport()) {
      set({ sidebarCollapsed: true });
    }
    set({ readerArticleId: id, readerArticle: null, readerLoading: true });
    try {
      const article = await app.library.getArticle(id);
      if (!article) {
        dashboardNotifier.error('Artículo no encontrado');
        set({ readerArticleId: null, readerArticle: null, readerLoading: false });
        return;
      }
      set({ readerArticle: article, readerLoading: false });
    } catch {
      dashboardNotifier.error('Error al cargar el artículo');
      set({ readerArticleId: null, readerArticle: null, readerLoading: false });
    }
  },

  closeReader: () => {
    set({ readerArticleId: null, readerArticle: null });
  },

  /* ── Preferencias ────────────────────────────────────────────────────── */
  fetchPreferences: async () => {
    const prefs = await app.preferences.get();
    set({ preferences: prefs });
  },

  updatePreferences: async (partial) => {
    const prefs = await app.preferences.update(partial);
    set({ preferences: prefs });
  },
}));

/**
 * ¿Viewport móvil (<768px)?
 * Se usa para auto-plegar la barra lateral en pantallas pequeñas.
 */
function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767.98px)').matches;
}

// Sincroniza el estado plegado de la barra lateral con cambios de viewport
// (rotación del dispositivo, cambio de tamaño de ventana, etc.).
const mobileQuery = window.matchMedia('(max-width: 767.98px)');
mobileQuery.addEventListener('change', (e) => {
  useAppStore.setState({ sidebarCollapsed: e.matches });
});