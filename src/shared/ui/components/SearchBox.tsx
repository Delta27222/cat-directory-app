'use client';

import { Search, X } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/shared/hooks/useDebouncedCallback';
import { isTypingTarget } from '@/shared/utils/isTypingTarget';
import { Input } from '@/ui/components/input';

interface SearchBoxProps {
  label: string;
  placeholder: string;
  value: string;
  /** Se llama cuando se deja de escribir por `debounceMs` (al limpiar, al instante). */
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchBox({
  label,
  placeholder,
  value,
  onChange,
  debounceMs = 300,
  className,
}: SearchBoxProps): React.JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState<string>(value);
  const [prevValue, setPrevValue] = React.useState<string>(value);

  // El input muestra cada tecla al instante; `onChange` recibe el texto con retraso.
  const debouncedOnChange = useDebouncedCallback(onChange, debounceMs);

  // Si el padre cambia el valor (p. ej. "Limpiar filtros"), el input lo refleja.
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  const clear = () => {
    debouncedOnChange.cancel();
    setText('');
    onChange('');
  };

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey)
        return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className={cn('relative w-full', className)}>
      <Search
        aria-hidden="true"
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3.5 size-4 text-muted-foreground"
      />
      <Input
        aria-keyshortcuts="/"
        aria-label={label}
        className="h-11 pr-10 pl-10 [&::-webkit-search-cancel-button]:appearance-none"
        onChange={(event) => {
          setText(event.target.value);
          debouncedOnChange(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') clear();
        }}
        placeholder={placeholder}
        ref={inputRef}
        type="search"
        value={text}
      />
      {text ? (
        <button
          aria-label="Limpiar búsqueda"
          className="-translate-y-1/2 absolute top-1/2 right-2 flex size-7 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:cursor-pointer hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            clear();
            inputRef.current?.focus();
          }}
          type="button"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 rounded-sm border px-1.5 font-mono text-muted-foreground text-xs leading-5"
        >
          /
        </kbd>
      )}
    </div>
  );
}
