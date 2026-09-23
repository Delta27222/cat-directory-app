import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { type BreedsPage, getBreedsPage } from '@/core/api/breeds';

/** Clave del listado en la caché. El detalle la importa para leer la raza ya cargada. */
export const BREEDS_LIST_KEY = ['breeds', 'list'] as const;

/**
 * Listado paginado. Arranca con la página 1 que trajo el servidor, así que
 * solo pide al cliente las páginas siguientes.
 */
export function useBreedsInfinite(firstPage: BreedsPage) {
  return useInfiniteQuery({
    queryKey: BREEDS_LIST_KEY,
    queryFn: ({ pageParam }) => getBreedsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.lastPage ? last.page + 1 : undefined,
    initialData: { pages: [firstPage], pageParams: [1] },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Recarga el listado desde la página 1. `refetch` volvería a pedir, una por
 * una, todas las páginas ya cargadas; `resetQueries` descarta las demás y pide
 * solo la primera (el scroll vuelve a traer el resto).
 */
export function useReloadBreeds() {
  const queryClient = useQueryClient();
  return () => queryClient.resetQueries({ queryKey: BREEDS_LIST_KEY });
}
