'use client';

import type React from 'react';

interface SelectFilterProps {
  label: string;
  /** Texto de la opción que no filtra. */
  allLabel: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

/** Select nativo para filtrar por un valor de catálogo. `''` = sin filtro. */
export function SelectFilter({
  label,
  allLabel,
  options,
  value,
  onChange,
}: SelectFilterProps): React.JSX.Element {
  return (
    <select
      aria-label={label}
      className="h-9 rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
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
  );
}
