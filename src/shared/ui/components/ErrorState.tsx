import { TriangleAlert } from 'lucide-react';
import type React from 'react';

/**
 * Aviso de que la carga falló. Sin esto, `data ?? []` pinta una grilla vacía y
 * quien la mira concluye que no hay nada, en vez de que algo se rompió.
 */
export function ErrorState({ error }: { error: Error }): React.JSX.Element {
  return (
    <div className="px-5 py-12 text-center text-muted-foreground" role="alert">
      <TriangleAlert
        aria-hidden="true"
        className="mx-auto mb-2.5 size-10 text-destructive/60"
      />
      <div className="mb-1 font-bold text-foreground text-sm">
        No pudimos cargar los datos
      </div>
      <div className="text-sm">
        Reintentá en unos segundos. Detalle: {error.message}
      </div>
    </div>
  );
}
