import type React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Botonera de la derecha. */
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps): React.JSX.Element {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-extrabold text-2xl tracking-tight">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2.5">{actions}</div>}
    </div>
  );
}
