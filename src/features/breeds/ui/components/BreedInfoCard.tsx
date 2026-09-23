import type { Breed } from '@/core/models/breeds/breed.model';

const FIELDS = [
  { key: 'country', label: 'País' },
  { key: 'origin', label: 'Origen' },
  { key: 'coat', label: 'Pelaje' },
  { key: 'pattern', label: 'Patrón' },
] as const satisfies { key: keyof Breed; label: string }[];

/**
 * Ficha con los datos de la raza: país, origen, pelaje y patrón.
 */
export function BreedInfoCard({ breed }: { breed: Breed }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-4">
      {FIELDS.map(({ key, label }) => (
        <div className="bg-card px-6 py-5" key={key}>
          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
            {label}
          </dt>
          <dd className="mt-2 font-medium">{breed[key] ?? 'Sin datos'}</dd>
        </div>
      ))}
    </dl>
  );
}
