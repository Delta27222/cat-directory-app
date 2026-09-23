import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import type { Breed } from '@/core/models/breeds/breed.model';
import { cn } from '@/lib/utils';

/** Columnas compartidas por el encabezado y las filas de `BreedsTable`. */
export const BREED_TABLE_COLUMNS = 'grid grid-cols-[1fr_1fr_3rem]';

interface BreedRowProps extends React.ComponentProps<'div'> {
  breed: Breed;
}

/**
 * Fila de `BreedsTable`: nombre, país de origen y flecha de detalle.
 * Es un `div` con roles ARIA porque la tabla está virtualizada: las filas se
 * posicionan en absoluto y un `<tr>` así pierde el ancho de las columnas.
 *
 * El enlace va dentro de la celda del nombre (no envolviendo la fila, que
 * rompería `rowgroup > row`) y su `::after` se estira sobre toda la fila, así
 * cualquier parte de la fila es clickeable.
 */
export function BreedRow({ breed, className, ...props }: BreedRowProps) {
  return (
    <div
      className={cn(
        BREED_TABLE_COLUMNS,
        'items-center border-b transition-colors hover:bg-muted',
        className
      )}
      role="row"
      {...props}
    >
      <div className="px-5 py-4 font-medium" role="cell">
        <Link
          className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-inset"
          href={`/breed/${breed.id}`}
        >
          {breed.name}
        </Link>
      </div>
      <div className="px-5 py-4 text-muted-foreground text-sm" role="cell">
        {breed.country ?? 'Sin datos'}
      </div>
      <div className="px-5 py-4 text-muted-foreground" role="cell">
        <ChevronRight aria-hidden="true" className="ml-auto size-4" />
      </div>
    </div>
  );
}
