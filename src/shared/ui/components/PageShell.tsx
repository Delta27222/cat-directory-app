import type React from 'react';

/** Contenedor de ancho máximo para el contenido de cada pantalla. */
export function PageShell({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {children}
    </main>
  );
}
