import { toBreed } from '@/core/models/breeds/breed.mapper';
import type { Breed } from '@/core/models/breeds/breed.model';
import { breedPageDtoSchema } from '@/core/models/breeds/breed.schema';
import { httpClient } from '../httpClient';

/** Alcanza para traer todas las razas (~98) en una sola llamada. */
const ALL_BREEDS_LIMIT = 100;

/**
 * Una raza por su `id` (slug del nombre), o `null` si no existe.
 *
 * La API no tiene `GET /breeds/:id`: se trae el listado completo y se busca.
 * Solo se usa cuando la raza no está en la caché de la lista (link directo o
 * recarga; ver `useBreedDetail`).
 */
export const getBreedById = async (id: string): Promise<Breed | null> => {
  const response = await httpClient.get<unknown>(
    `/breeds?limit=${ALL_BREEDS_LIMIT}`,
    { revalidate: 60 * 60 } // 1 hour
  );
  const dto = breedPageDtoSchema.parse(response);

  return dto.data.map(toBreed).find((breed) => breed.id === id) ?? null;
};
