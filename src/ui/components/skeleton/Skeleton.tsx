import type * as React from 'react';
import { cn } from '@/lib/utils';

/** Barra gris animada que ocupa el lugar de un contenido mientras carga. */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded bg-muted', className)}
      {...props}
    />
  );
}

export default Skeleton;
