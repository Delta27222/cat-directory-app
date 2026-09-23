"use client";

import { QueryClient } from "./react-query";
import { Toaster } from "./toaster";

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers de navegador. El estado de servidor lo administra React Query desde
 * el cliente; los errores de red y de la API se avisan con toasts.
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <QueryClient>
      {children}
      <Toaster />
    </QueryClient>
  );
}
