'use client';

import { RotateCcwIcon } from 'lucide-react';
import { SearchBox, SelectFilter } from '@/shared/ui/components';
import { Button } from '@/ui/components/button';
import { useBreedFiltersStore } from '../../application/hooks/useBreedFiltersStore';
import { hasActiveFilters } from '../../domain/breeds.filters';
import { cn } from '@/lib/utils';

interface BreedFiltersBarProps {
  origins: string[];
  coats: string[];
  onReload: () => void;
  /** Hay una recarga en curso: el ícono gira y el botón se deshabilita. */
  isReloading: boolean;
}

/** Buscador, selects y recarga. Lee y cambia los filtros en el store. */
export function BreedFiltersBar({
  origins,
  coats,
  onReload,
  isReloading,
}: BreedFiltersBarProps) {
  const filters = useBreedFiltersStore((state) => state.filters);
  const setFilter = useBreedFiltersStore((state) => state.setFilter);
  const clear = useBreedFiltersStore((state) => state.clear);

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex gap-3">
        <SearchBox
          label="Buscar raza"
          onChange={(value) => setFilter('search', value)}
          placeholder="Buscar por nombre o país…"
          value={filters.search}
        />
        <Button
          aria-label="Recargar razas"
          className="size-11 border-input"
          disabled={isReloading}
          onClick={onReload}
          size="icon"
          title="Recargar razas"
          variant="secondary"
        >
          <RotateCcwIcon
            aria-hidden="true"
            className={cn('size-4', isReloading && 'animate-spin')}
          />
        </Button>
      </div>

      <div className="flex gap-3">
        <SelectFilter
          name="origin"
          allLabel="Todos los orígenes"
          label="Filtrar por origen"
          onChange={(value) => setFilter('origin', value)}
          options={origins}
          value={filters.origin}
        />
        <SelectFilter
          name="coat"
          allLabel="Todos los pelajes"
          label="Filtrar por pelaje"
          onChange={(value) => setFilter('coat', value)}
          options={coats}
          value={filters.coat}
        />
        {hasActiveFilters(filters) && (
          <Button onClick={clear} size="sm" variant="ghost">
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
