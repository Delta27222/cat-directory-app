import { getBreedsPage } from '@/core/api/breeds';
import { PageShell } from '@/shared/ui/components';
import { BreedFiltersProvider } from '../../application/stores/BreedFiltersContext';
import { parseBreedFilters } from '../../domain/breeds.filters';
import { BreedsCatalog } from '../widgets/BreedsCatalog';

/**
 * Server Component: trae solo la primera página, así el HTML llega con las
 * primeras razas. Las siguientes las pide el cliente al hacer scroll.
 *
 * Los filtros llegan en la URL (`?origin=Natural`): se leen acá para que el
 * HTML ya venga filtrado y sin salto al hidratar, y arrancan el store de
 * filtros (Zustand).
 *
 * Si la API falla, el error lo muestra `app/(app)/error.tsx`.
 */
export async function BreedsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const firstPage = await getBreedsPage(1);

  return (
    <PageShell>
      <BreedFiltersProvider initialFilters={parseBreedFilters(searchParams)}>
        <BreedsCatalog firstPage={firstPage} />
      </BreedFiltersProvider>
    </PageShell>
  );
}
