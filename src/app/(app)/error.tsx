'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { ErrorState, PageShell } from '@/shared/ui/components';
import { Button } from '@/ui/components/button';

/**
 * Límite de error de las pantallas de la app: si un Server Component falla
 * (p. ej. la API no responde), se muestra esto en vez de la página genérica.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  // `refresh` vuelve a ejecutar el Server Component; `reset` limpia el error.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <PageShell>
      <ErrorState error={error} />
      <div className="text-center">
        <Button onClick={retry} size="sm" variant="ghost">
          Reintentar
        </Button>
      </div>
    </PageShell>
  );
}
