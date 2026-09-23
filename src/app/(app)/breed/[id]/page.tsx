import { BreedDetail } from "@/features/breeds/ui/widgets/BreedDetail";

interface BreedPageProps {
  params: Promise<{ id: string }>;
}

export default async function BreedPage({ params }: BreedPageProps) {
  const { id } = await params;
  return <BreedDetail id={id} />;
}
