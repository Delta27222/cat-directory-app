import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isRetryableError } from '@/core/api/httpClient';

/** Intentos extra antes de mostrarle el error al usuario. */
const MAX_RETRIES = 3;
/** Tope de espera entre intentos. */
const MAX_RETRY_DELAY_MS = 10_000;

/**
 * Backoff exponencial: 1 s, 2 s, 4 s… (hasta `MAX_RETRY_DELAY_MS`). Espaciar
 * los intentos da tiempo a que vuelva la red y no satura una API con límite.
 */
export function retryDelay(attempt: number): number {
  return Math.min(1000 * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

/** Solo se reintentan los errores pasajeros, y con un límite de intentos. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  return failureCount < MAX_RETRIES && isRetryableError(error);
}

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isServer || query.state.data === undefined) return;
        toast.error(`No pudimos actualizar los datos. ${error.message}`, {
          id: `query-error-${query.queryHash}`,
        });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: shouldRetry,
        retryDelay,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
