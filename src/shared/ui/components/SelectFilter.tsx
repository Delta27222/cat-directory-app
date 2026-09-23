'use client';

import { ChevronDown } from 'lucide-react';
import type React from 'react';

interface SelectFilterProps {
  label: string;
  name: string;
  allLabel: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Select nativo para filtrar por un valor de catálogo. `''` = sin filtro.
 * La flecha nativa no respeta el padding: se oculta y se dibuja una propia.
 */
export function SelectFilter({
  label,
  name,
  allLabel,
  options,
  value,
  onChange,
}: SelectFilterProps): React.JSX.Element {
  return (
    <div className="relative w-full md:w-52">
      <select
        aria-label={label}
        name={name}
        className="h-11 w-full appearance-none truncate rounded-md border border-input bg-card pr-9 pl-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground"
      />
    </div>
  );
}
