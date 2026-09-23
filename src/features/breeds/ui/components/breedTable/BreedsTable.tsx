'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Breed } from '@/core/models/breeds/breed.model';
import { Button } from '@/ui/components/button';
import { Card } from '@/ui/components/card';
import { BREED_TABLE_COLUMNS, BreedRow } from './BreedRow';

/** Alto estimado de una fila; luego se mide la real. */
const ROW_HEIGHT = 53;
/** Filas extra que se dibujan arriba y abajo de lo visible. */
const OVERSCAN = 5;
/** Se pide la página siguiente cuando faltan estas filas para el final. */
const LOAD_MORE_THRESHOLD = 5;
/**
 * En el servidor no hay contenedor que medir: se asume este alto para que el
 */
const INITIAL_RECT = { width: 0, height: 480 };

interface BreedsTableProps {
  breeds: Breed[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreFailed: boolean;
  onLoadMore: () => void;
  loadingLabel?: string;
}

export function BreedsTable({
  breeds,
  hasMore,
  isLoadingMore,
  loadMoreFailed,
  onLoadMore,
  loadingLabel = 'Cargando más razas…',
}: BreedsTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Basado en el scroll, se calculas las filas visibles
  const virtualizer = useVirtualizer({
    count: breeds.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    getItemKey: (index) => breeds[index]?.id ?? index,
    overscan: OVERSCAN,
    initialRect: INITIAL_RECT,
  });
  const rows = virtualizer.getVirtualItems();

  // Con la lista vacía (un filtro sin coincidencias aún) `lastIndex` es -1 y
  // también pide: así se siguen buscando coincidencias en las páginas que faltan.
  const lastIndex = rows.at(-1)?.index ?? -1;
  const nearEnd = lastIndex >= breeds.length - 1 - LOAD_MORE_THRESHOLD;

  useEffect(() => {
    if (nearEnd && hasMore && !isLoadingMore && !loadMoreFailed) onLoadMore();
  }, [nearEnd, hasMore, isLoadingMore, loadMoreFailed, onLoadMore]);

  // TODO -> Este componente se puede optimizar para que sea reutilizable
  return (
    <Card
      aria-label="Razas"
      // Solo hay unas pocas filas en el DOM: se anuncia el total real.
      aria-rowcount={breeds.length + 1}
      className="gap-0 overflow-hidden py-0"
      role="table"
    >
      <div className="border-b" role="rowgroup">
        <div
          className={`${BREED_TABLE_COLUMNS} text-muted-foreground text-xs uppercase tracking-wide`}
          role="row"
        >
          <div className="px-5 py-3 font-medium" role="columnheader">
            Raza
          </div>
          <div className="px-5 py-3 font-medium" role="columnheader">
            País de origen
          </div>
          <div className="px-5 py-3" role="columnheader">
            <span className="sr-only">Detalle</span>
          </div>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto" ref={scrollRef}>
        <div
          className="relative w-full"
          role="rowgroup"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {rows.map((row) => {
            const breed = breeds[row.index];
            if (!breed) return null;
            return (
              <BreedRow
                aria-rowindex={row.index + 2}
                breed={breed}
                className="absolute top-0 left-0 w-full"
                data-index={row.index}
                key={row.key}
                ref={virtualizer.measureElement}
                style={{ transform: `translateY(${row.start}px)` }}
              />
            );
          })}
        </div>

        {/* El pie también es una fila: dentro de `role="table"` solo van filas. */}
        <div role="row">
          <div
            aria-live="polite"
            className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm"
            role="cell"
          >
            {isLoadingMore && (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin text-brand"
                />
                {loadingLabel}
              </>
            )}
            {loadMoreFailed && !isLoadingMore && (
              <>
                No pudimos cargar más razas.
                <Button onClick={onLoadMore} size="sm" variant="ghost">
                  Reintentar
                </Button>
              </>
            )}
            {!hasMore && 'No hay más razas'}
          </div>
        </div>
      </div>
    </Card>
  );
}
