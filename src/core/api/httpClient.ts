/**
 * Único wrapper de `fetch` hacia catfact.ninja. Toda llamada HTTP sale de acá
 * (ver `core/api/<recurso>/`): ningún componente ni hook arma su propio fetch.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_CAT_API_URL || 'https://catfact.ninja';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  /**
   * Segundos que el servidor de Next guarda la respuesta en su caché de datos.
   * Evita pegarle a la API en cada visita (tiene límite de peticiones). En el
   * navegador se ignora.
   */
  revalidate?: number;
};

type GetOptions = Pick<RequestOptions, 'headers' | 'revalidate'>;

/** Error HTTP de la API: guarda el `status` para decidir si vale reintentar. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Si un error puede ser pasajero y vale la pena reintentar: fallos de red (el
 * `fetch` ni llegó: sin conexión, DNS, CORS…), límite de peticiones (429) y
 * errores del servidor (5xx). Un 404 o 400 va a fallar igual: no se reintenta.
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 429 || error.status >= 500;
  }
  return error instanceof TypeError;
}

/** Extrae un mensaje legible del cuerpo de error, sea JSON o texto plano. */
async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  if (!text) return `Error ${response.status}`;
  try {
    const json: unknown = JSON.parse(text);
    if (
      typeof json === 'object' &&
      json !== null &&
      'message' in json &&
      typeof json.message === 'string'
    ) {
      return json.message;
    }
  } catch {
    // No era JSON: el texto crudo ya es el mensaje.
  }
  return text;
}

async function apiRequest<T>(
  endpoint: string,
  { method, body, headers, revalidate }: RequestOptions
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...(revalidate === undefined ? {} : { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get: <T>(endpoint: string, options?: GetOptions) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(
    endpoint: string,
    body: unknown,
    headers?: Record<string, string>
  ) => apiRequest<T>(endpoint, { method: 'POST', body, headers }),
  patch: <T>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>
  ) => apiRequest<T>(endpoint, { method: 'PATCH', body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};
