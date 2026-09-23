import type { Breed } from './breed.model';
import type { TBreedDto } from './breed.schema';

/** "Dwarf cat, or Dwelf" → "dwarf-cat-or-dwelf". */
export function toBreedId(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** La API manda `""` cuando no conoce el dato. */
function orNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function toBreed(dto: TBreedDto): Breed {
  return {
    id: toBreedId(dto.breed),
    name: dto.breed.trim(),
    country: orNull(dto.country),
    origin: orNull(dto.origin),
    coat: orNull(dto.coat),
    pattern: orNull(dto.pattern),
  };
}
