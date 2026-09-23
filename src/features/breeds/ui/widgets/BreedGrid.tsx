import type { Breed } from '@/core/models/breeds/breed.model';
import { BREED_GRID_CLASSES } from './breedGridClasses';
import { BreedInfoCard } from '../components/BreedInfoCard';

export function BreedGrid({ breeds }: { breeds: Breed[] }) {
  return (
    <ul aria-label="Razas" className={BREED_GRID_CLASSES}>
      {breeds.map((breed) => (
        <li key={breed.id}>
          <BreedInfoCard breed={breed} />
        </li>
      ))}
    </ul>
  );
}
