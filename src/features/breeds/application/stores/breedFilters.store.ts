import { createStore } from 'zustand/vanilla';
import {
  type BreedFilters,
  EMPTY_BREED_FILTERS,
} from '../../domain/breeds.filters';

export interface BreedFiltersState {
  filters: BreedFilters;
  setFilter: (field: keyof BreedFilters, value: string) => void;
  clear: () => void;
}

export type BreedFiltersStore = ReturnType<typeof createBreedFiltersStore>;

/** Refleja los filtros en la URL sin recargar ni sumar entradas al historial. */
function writeFiltersToUrl(filters: BreedFilters): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(filters)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, '', url);
}

/**
 * Store de los filtros del listado (estado de UI). Se crea uno por request
 * con los filtros que el servidor leyó de la URL: un store global de módulo
 * se compartiría entre todas las visitas en el servidor.
 *
 * Cada cambio pasa por una acción y se refleja en la URL.
 */
export function createBreedFiltersStore(initialFilters: BreedFilters) {
  return createStore<BreedFiltersState>()((set, get) => {
    const update = (filters: BreedFilters) => {
      set({ filters });
      writeFiltersToUrl(filters);
    };

    return {
      filters: initialFilters,
      setFilter: (field, value) => update({ ...get().filters, [field]: value }),
      clear: () => update(EMPTY_BREED_FILTERS),
    };
  });
}
