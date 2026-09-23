import { RotateCcwIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/components/button';
import { SkeletonText } from '@/ui/components/skeleton';

export interface FunFactCardProps {
  fact: string | null;
  onRefresh: () => void | Promise<unknown>;
  isRefreshing: boolean;
}

/** Tarjeta con un dato curioso sobre gatos y el botón para pedir otro. */
export function FunFactCard({
  fact,
  onRefresh,
  isRefreshing,
}: FunFactCardProps) {
  return (
    // Colores del tema (no `bg-white`/`gray-200`): cambian solos en modo oscuro.
    <div className="w-full mx-auto space-y-4 rounded-lg border bg-card p-7 font-display text-card-foreground">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand">Dato curioso</h1>
        <Button
          aria-label="Otro dato"
          className="size-10 shrink-0 px-0 md:w-auto md:px-4"
          disabled={isRefreshing}
          onClick={onRefresh}
          variant="secondary"
        >
          <RotateCcwIcon
            aria-hidden="true"
            className={cn('size-4', isRefreshing && 'animate-spin')}
          />
          <span className="hidden md:inline">Otro dato</span>
        </Button>
      </div>
      <div aria-live="polite">
        <FunFactContent fact={fact} isRefreshing={isRefreshing} />
      </div>
    </div>
  );
}

/** Lo que va debajo del título: cargando, el dato, o el aviso si no hay. */
function FunFactContent({
  fact,
  isRefreshing,
}: Pick<FunFactCardProps, 'fact' | 'isRefreshing'>) {
  if (isRefreshing) {
    return (
      <SkeletonText
        barClassName="h-5 md:h-7"
        label="Cargando otro dato"
        lineClassName="h-8 md:h-10"
      />
    );
  }

  if (!fact) {
    return (
      <p className="text-muted-foreground text-sm">
        No pudimos cargar un dato curioso ahora. Probá de nuevo en un rato.
      </p>
    );
  }

  return <h2 className="text-2xl font-black md:text-4xl">"{fact}"</h2>;
}
