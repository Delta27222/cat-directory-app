'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import type { BreedFiltersState } from '../stores/breedFilters.store';
import { BreedFiltersContext } from '../stores/BreedFiltersContext';

/**
 * Lee del store de filtros. Con un selector, el componente solo se vuelve a
 * renderizar cuando cambia lo que seleccionó.
 */
export function useBreedFiltersStore<T>(
  selector: (state: BreedFiltersState) => T
): T {
  const store = useContext(BreedFiltersContext);
  if (!store) {
    throw new Error(
      'useBreedFiltersStore debe usarse dentro de <BreedFiltersProvider>'
    );
  }
  return useStore(store, selector);
}
