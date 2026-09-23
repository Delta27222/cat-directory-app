import { BreedsPage } from '@/features/breeds/ui/pages/BreedsPage';

/** Se renderiza por request (SSR): lee los filtros de la URL. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <BreedsPage searchParams={await searchParams} />;
}
