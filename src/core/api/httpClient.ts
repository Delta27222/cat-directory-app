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
};

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
  { method, body, headers }: RequestOptions
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'GET', headers }),
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
