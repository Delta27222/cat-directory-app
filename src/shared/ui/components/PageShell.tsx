import type React from 'react';

/** Contenedor de ancho máximo para el contenido de cada pantalla. */
export function PageShell({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <main className="mx-auto w-full max-w-content px-4 py-8 sm:px-6">
      {children}
    </main>
  );
}
