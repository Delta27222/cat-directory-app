import {
  type InfiniteData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { type BreedsPage, getBreedById } from '@/core/api/breeds';
import { BREEDS_LIST_KEY } from './useBreedsInfinite.query';

/**
 * Una raza para el detalle. Primero la busca en las páginas que ya cargó la
 * lista (caché de React Query): si se llegó desde ahí, aparece al instante y
 * sin pedir nada. Si no está (link directo o recarga), la pide a la API
 * (`getBreedById`); si no existe, devuelve `null`.
 */
export function useBreedDetail(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['breeds', 'detail', id],
    queryFn: () => getBreedById(id),
    initialData: () =>
      queryClient
        .getQueryData<InfiniteData<BreedsPage>>(BREEDS_LIST_KEY)
        ?.pages.flatMap((page) => page.breeds)
        .find((breed) => breed.id === id),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
