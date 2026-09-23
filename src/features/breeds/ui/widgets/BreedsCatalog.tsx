'use client';

import { useCallback, useMemo } from 'react';
import type { BreedsPage } from '@/core/api/breeds';
import { EmptyState, PageHeader } from '@/shared/ui/components';
import { useBreedFilters } from '../../application/hooks/useBreedFilters';
import {
  useBreedsInfinite,
  useReloadBreeds,
} from '../../application/queries/useBreedsInfinite.query';
import { hasActiveFilters } from '../../domain/breeds.filters';
import { BreedsTable } from '../components/breedTable';
import { BreedFiltersBar } from './BreedFiltersBar';

/**
 * Parte interactiva del listado: muestra la primera página que trajo el
 * servidor y pide las siguientes al hacer scroll. Los filtros se aplican
 * sobre las razas ya cargadas y viven en el store de Zustand.
 */
export function BreedsCatalog({ firstPage }: { firstPage: BreedsPage }) {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    isRefetching,
  } = useBreedsInfinite(firstPage);
  const reload = useReloadBreeds();

  // Durante una recarga no se piden más páginas: `fetchNextPage` la cancelaría.
  const loadMore = useCallback(() => {
    if (!isRefetching) fetchNextPage();
  }, [isRefetching, fetchNextPage]);

  const breeds = useMemo(
    () => data.pages.flatMap((page) => page.breeds),
    [data]
  );
  const { filters, origins, coats, filtered } = useBreedFilters(breeds);

  /** Lo que va debajo de los filtros, según el estado de la carga. */
  function renderBody() {
    if (filtered.length === 0 && !hasNextPage) {
      return (
        <EmptyState
          description="No se encontraron resultados para tu búsqueda, por favor intenta con otro valor."
          title="Sin coincidencias"
        />
      );
    }

    return (
      <BreedsTable
        breeds={filtered}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        loadMoreFailed={isFetchNextPageError}
        loadingLabel={
          hasActiveFilters(filters)
            ? `Buscando coincidencias… ${breeds.length} de ${firstPage.total} razas revisadas`
            : undefined
        }
        onLoadMore={loadMore}
      />
    );
  }

  return (
    <>
      <PageHeader
        subtitle={`Explora ${firstPage.total} razas con su país de origen, pelaje y patrón.`}
        title="Razas de gatos"
      />

      <BreedFiltersBar
        coats={coats}
        origins={origins}
        isReloading={isRefetching}
        onReload={reload}
      />

      {renderBody()}
    </>
  );
}
