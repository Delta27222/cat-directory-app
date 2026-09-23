'use client';

import { LoaderCircle } from 'lucide-react';
import {
  Breadcrumb,
  EmptyState,
  ErrorState,
  PageHeader,
} from '@/shared/ui/components';
import { useBreedDetail } from '../../application/queries/useBreedDetail.query';
import { useGetFunFact } from '../../application/queries/useGetFunFact.query';
import { BreedInfoCard } from '../components/BreedInfoCard';
import { FunFactCard } from '../components/FunFactCard';

/**
 * Página de detalle completa: migas, título, ficha y dato curioso. No muestra
 * nada a medias: hasta que cargaron la raza y el dato, se ve un solo loader.
 */
export function BreedDetail({ id }: { id: string }) {
  const {
    data: breed,
    isPending: isBreedPending,
    isError: isBreedError,
  } = useBreedDetail(id);
  const {
    data: funFact,
    isPending: isFunFactPending,
    isRefetching: isFunFactRefetching,
    refetch: refetchFunFact,
  } = useGetFunFact();

  if (isBreedPending || isFunFactPending) {
    return (
      <div
        aria-busy="true"
        className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground text-sm"
        role="status"
      >
        <LoaderCircle
          aria-hidden="true"
          className="size-5 animate-spin text-brand"
        />
        Cargando raza…
      </div>
    );
  }

  if (isBreedError)
    return <ErrorState error={new Error('Error al cargar la raza')} />;

  if (!breed) {
    return (
      <EmptyState
        description="Revisá el enlace o volvé al listado."
        title="No encontramos esta raza"
      />
    );
  }

  return (
    <section className="space-y-4">
      <Breadcrumb
        items={[{ label: 'Razas', href: '/' }, { label: breed.name }]}
      />
      <PageHeader title={breed.name} />
      <BreedInfoCard breed={breed} />
      {/* Si el dato falla, la tarjeta lo avisa sin romper la página. */}
      <FunFactCard
        fact={funFact?.fact ?? null}
        isRefreshing={isFunFactRefetching}
        onRefresh={refetchFunFact}
      />
    </section>
  );
}
