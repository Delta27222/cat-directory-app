'use client';

import { createContext, useState } from 'react';
import type { BreedFilters } from '../../domain/breeds.filters';
import {
  type BreedFiltersStore,
  createBreedFiltersStore,
} from './breedFilters.store';

/** Contexto con el store de filtros. Se lee con `useBreedFiltersStore`. */
export const BreedFiltersContext = createContext<BreedFiltersStore | null>(
  null
);

/** Crea el store de filtros una sola vez por montaje, con los filtros de la URL. */
export function BreedFiltersProvider({
  initialFilters,
  children,
}: {
  initialFilters: BreedFilters;
  children: React.ReactNode;
}) {
  const [store] = useState(() => createBreedFiltersStore(initialFilters));
  return (
    <BreedFiltersContext.Provider value={store}>
      {children}
    </BreedFiltersContext.Provider>
  );
}
