import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  /** Sin `href` (o en el último ítem) se muestra como texto, no como enlace. */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Migas de pan: "Inicio › Razas › Abyssinian". El último ítem es la página
 * actual, así que no es enlace y lleva `aria-current="page"`.
 */
export function Breadcrumb({
  items,
  className,
}: BreadcrumbProps): React.JSX.Element {
  return (
    <nav aria-label="Migas de pan" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li className="flex items-center gap-1.5" key={item.label}>
              {item.href && !isCurrent ? (
                <Link
                  className="rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(isCurrent && 'font-medium text-foreground')}
                >
                  {item.label}
                </span>
              )}
              {!isCurrent && (
                <ChevronRight aria-hidden="true" className="size-3.5" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
