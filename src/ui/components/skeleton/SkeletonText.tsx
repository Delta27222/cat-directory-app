import { cn } from '@/lib/utils';
import Skeleton from './Skeleton';

interface SkeletonTextProps {
  /** Texto para lectores de pantalla, p. ej. "Cargando otro dato". */
  label: string;
  /** Ancho de cada línea; la última suele ser más corta, como un párrafo. */
  lines?: string[];
  /**
   * Alto de cada línea: igual al `line-height` del texto real, así el
   * contenedor no cambia de tamaño al llegar el contenido.
   */
  lineClassName?: string;
  /** Alto de la barra dentro de la línea (más bajo que la línea). */
  barClassName?: string;
  className?: string;
}

const DEFAULT_LINES = ['w-full', 'w-11/12', 'w-2/3'];

/** Párrafo de barras animadas mientras llega un texto. */
function SkeletonText({
  label,
  lines = DEFAULT_LINES,
  lineClassName = 'h-6',
  barClassName = 'h-4',
  className,
}: SkeletonTextProps) {
  return (
    <div
      aria-busy="true"
      aria-label={label}
      className={className}
      role="status"
    >
      {lines.map((width, index) => (
        <div
          className={cn('flex items-center', lineClassName)}
          // Las líneas son fijas y no se reordenan: el índice es una key estable.
          key={index}
        >
          <Skeleton className={cn(barClassName, width)} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonText;
