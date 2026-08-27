import { useEffect, useMemo } from 'preact/hooks';
import { useAppStore } from '../store';

/**
 * Hook personalizado para acceder a la biblioteca y las acciones comunes
 * desde los componentes del dashboard. Encapsula la suscripción al store
 * de Zustand y dispara la carga inicial.
 */
export function useArticles() {
  const {
    articles,
    loading,
    fetchLibrary,
    archiveArticle,
    deleteArticle,
  } = useAppStore();

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  /** Artículos pendientes (no archivados), ordenados por fecha de guardado. */
  const pending = useMemo(
    () => articles.filter((a) => !a.isArchived),
    [articles],
  );

  /** Artículos archivados/leídos. */
  const archived = useMemo(
    () => articles.filter((a) => a.isArchived),
    [articles],
  );

  return {
    articles,
    pending,
    archived,
    loading,
    archiveArticle,
    deleteArticle,
  };
}