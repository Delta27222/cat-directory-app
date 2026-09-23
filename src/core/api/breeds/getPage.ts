import { toBreed } from '@/core/models/breeds/breed.mapper';
import type { Breed } from '@/core/models/breeds/breed.model';
import { breedPageDtoSchema } from '@/core/models/breeds/breed.schema';
import { httpClient } from '../httpClient';

/** Razas por página: la primera la trae el servidor, el resto el scroll. */
export const BREEDS_PAGE_SIZE = 15;

export interface BreedsPage {
  breeds: Breed[];
  page: number;
  lastPage: number;
  total: number;
}

/** Una página de `GET /breeds`. */
export const getBreedsPage = async (page: number): Promise<BreedsPage> => {
  const response = await httpClient.get<unknown>(
    `/breeds?limit=${BREEDS_PAGE_SIZE}&page=${page}`,
    { revalidate: 60 * 60 } // 1 hour
  );
  const dto = breedPageDtoSchema.parse(response);

  return {
    breeds: dto.data.map(toBreed),
    page: dto.current_page,
    lastPage: dto.last_page,
    total: dto.total,
  };
};
