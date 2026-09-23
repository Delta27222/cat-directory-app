import type { Breed } from '@/core/models/breeds/breed.model';

export interface BreedFilters {
  search: string;
  /** `''` = todos los tipos de origen. */
  origin: string;
  /** `''` = todos los pelajes. */
  coat: string;
}

export const EMPTY_BREED_FILTERS: BreedFilters = {
  search: '',
  origin: '',
  coat: '',
};

type SearchParams = Record<string, string | string[] | undefined>;

/** Filtros a partir de los `searchParams` de la URL (`?search=&origin=&coat=`). */
export function parseBreedFilters(params: SearchParams): BreedFilters {
  const read = (key: keyof BreedFilters) => {
    const value = params[key];
    return typeof value === 'string' ? value : '';
  };
  return { search: read('search'), origin: read('origin'), coat: read('coat') };
}

/** Minúsculas y sin tildes, para que "etiopia" encuentre "Etiopía". */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** La búsqueda mira nombre y país; origen y pelaje son coincidencia exacta. */
export function filterBreeds(breeds: Breed[], filters: BreedFilters): Breed[] {
  const search = normalize(filters.search);

  return breeds.filter((breed) => {
    if (filters.origin && breed.origin !== filters.origin) return false;
    if (filters.coat && breed.coat !== filters.coat) return false;
    if (!search) return true;
    return (
      normalize(breed.name).includes(search) ||
      normalize(breed.country ?? '').includes(search)
    );
  });
}

/** Valores únicos y ordenados de un campo, sin los vacíos, para un filtro. */
export function getOptions(
  breeds: Breed[],
  field: 'origin' | 'coat'
): string[] {
  const values = breeds.flatMap((breed) => breed[field] ?? []);
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es'));
}

export function hasActiveFilters(filters: BreedFilters): boolean {
  return Boolean(filters.search || filters.origin || filters.coat);
}
