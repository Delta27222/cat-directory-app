'use client';

import { Search } from 'lucide-react';
import type React from 'react';
import { Input } from '@/ui/components/input';

interface SearchBoxProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

/** Buscador con la lupa dentro del campo. */
export function SearchBox({
  label,
  placeholder,
  value,
  onChange,
}: SearchBoxProps): React.JSX.Element {
  return (
    <div className="relative w-full sm:w-64">
      <Search
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-4 text-muted-foreground"
      />
      <Input
        aria-label={label}
        className="pl-8"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  );
}
