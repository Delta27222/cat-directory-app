'use client';

import React from 'react';
import type { Breed } from '@/core/models/breeds/breed.model';
import { filterBreeds, getOptions } from '../../domain/breeds.filters';
import { useBreedFiltersStore } from './useBreedFiltersStore';

/**
 * La opción elegida siempre figura en el select, aunque ninguna raza cargada
 * todavía la tenga (p. ej. llegó por URL y su página aún no se pidió).
 */
function withSelected(options: string[], selected: string): string[] {
  return !selected || options.includes(selected)
    ? options
    : [...options, selected].sort((a, b) => a.localeCompare(b, 'es'));
}

/**
 * Aplica los filtros del store (Zustand) a las razas cargadas y arma las
 * opciones de cada select.
 */
export function useBreedFilters(breeds: Breed[]) {
  const filters = useBreedFiltersStore((state) => state.filters);

  const origins = React.useMemo(
    () => withSelected(getOptions(breeds, 'origin'), filters.origin),
    [breeds, filters.origin]
  );
  const coats = React.useMemo(
    () => withSelected(getOptions(breeds, 'coat'), filters.coat),
    [breeds, filters.coat]
  );
  const filtered = React.useMemo(
    () => filterBreeds(breeds, filters),
    [breeds, filters]
  );

  return { filters, origins, coats, filtered };
}
