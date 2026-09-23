'use client';

import { useEffect, useMemo, useRef } from 'react';

/**
 * Devuelve una versión de `callback` que solo se ejecuta cuando pasan `delay`
 * ms sin volver a llamarla. `cancel()` descarta la llamada pendiente.
 *
 * Siempre ejecuta la última versión de `callback`, aunque cambie entre renders.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  // Al desmontar no queda ninguna llamada colgada.
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return useMemo(() => {
    const debounced = (...args: Args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delay
      );
    };
    debounced.cancel = () => clearTimeout(timeoutRef.current);
    return debounced;
  }, [delay]);
}
