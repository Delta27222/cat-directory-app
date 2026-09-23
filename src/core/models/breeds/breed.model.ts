/**
 * Raza de gato vista desde la app.
 *
 * Se diferencia del DTO en que tiene un `id` estable para la URL (la API no lo
 * trae) y en que los campos vacíos (`""`) llegan como `null`.
 */
export interface Breed {
  /** Slug del nombre (p. ej. `american-curl`). */
  id: string;
  name: string;
  country: string | null;
  /** Tipo de origen: Natural, Mutation, Crossbreed, … */
  origin: string | null;
  coat: string | null;
  pattern: string | null;
}
