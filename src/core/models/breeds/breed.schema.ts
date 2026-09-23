import { z } from 'zod';

/** Una raza tal como la publica `GET /breeds` de catfact.ninja. */
export const breedDtoSchema = z.object({
  breed: z.string(),
  country: z.string(),
  origin: z.string(),
  coat: z.string(),
  pattern: z.string(),
});

/**
 * Página de `GET /breeds` (paginador de Laravel). Solo se declaran los campos
 * que la app usa; Zod descarta el resto (`links`, `*_page_url`, …).
 */
export const breedPageDtoSchema = z.object({
  current_page: z.number().int(),
  last_page: z.number().int(),
  total: z.number().int(),
  data: z.array(breedDtoSchema),
});

export type TBreedDto = z.infer<typeof breedDtoSchema>;
export type TBreedPageDto = z.infer<typeof breedPageDtoSchema>;
