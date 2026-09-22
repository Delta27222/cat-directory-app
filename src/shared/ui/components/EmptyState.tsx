import { Search } from 'lucide-react';
import type React from 'react';

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <div className="px-5 py-12 text-center text-muted-foreground">
      <Search
        aria-hidden="true"
        className="mx-auto mb-2.5 size-10 opacity-40"
      />
      <div className="mb-1 font-bold text-foreground text-sm">{title}</div>
      <div className="text-sm">{description}</div>
    </div>
  );
}
