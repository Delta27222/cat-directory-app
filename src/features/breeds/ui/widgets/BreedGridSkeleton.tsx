import { BreedCardSkeleton } from '../components/BreedCardSkeleton';
import { BREED_GRID_CLASSES } from './breedGridClasses';

const SKELETON_KEYS = Array.from({ length: 6 }, (_, i) => `skeleton-${i}`);

export function BreedGridSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Cargando razas"
      className={BREED_GRID_CLASSES}
      role="status"
    >
      {SKELETON_KEYS.map((key) => (
        <BreedCardSkeleton key={key} />
      ))}
    </div>
  );
}
