import { useQuery } from '@tanstack/react-query';
import { getFunFact } from '@/core/api/breeds';
import { isRetryableError } from '@/core/api/httpClient';

const FUN_FACT_KEY = ['fun', 'fact'] as const;

/**
 * Obtiene un hecho aleatorio sobre las razas de gatos. Solo cambia cuando se
 * pide otro (`refetch`), no al volver a la pestaña.
 */
export function useGetFunFact() {
  return useQuery({
    queryKey: FUN_FACT_KEY,
    queryFn: () => getFunFact(),
    staleTime: Number.POSITIVE_INFINITY,
    // Es secundario y el detalle espera por él: un solo reintento (y solo si
    // el error es pasajero) en vez de los 3 de siempre.
    retry: (failureCount, error) => failureCount < 1 && isRetryableError(error),
  });
}
