import type { Breed } from '@/core/models/breeds/breed.model';
import { BreedCard } from '../components/BreedCard';
import { BREED_GRID_CLASSES } from './breedGridClasses';

export function BreedGrid({ breeds }: { breeds: Breed[] }) {
  return (
    <ul aria-label="Razas" className={BREED_GRID_CLASSES}>
      {breeds.map((breed) => (
        <li key={breed.id}>
          <BreedCard breed={breed} />
        </li>
      ))}
    </ul>
  );
}
