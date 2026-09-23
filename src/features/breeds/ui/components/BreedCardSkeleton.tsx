import { Skeleton } from '@/ui/components/skeleton';

/** Placeholder de una tarjeta de raza, con el alto de la grilla. */
export function BreedCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
