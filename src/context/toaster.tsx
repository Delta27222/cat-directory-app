'use client';

import { onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast, { Toaster as HotToaster } from 'react-hot-toast';

const OFFLINE_TOAST_ID = 'offline';

/**
 * Avisa cuando se pierde y cuando vuelve la conexión. Usa el `onlineManager`
 * de React Query, el mismo que pausa las peticiones sin red y las retoma
 * solas al volver: el aviso y el comportamiento van siempre juntos.
 */
function useNetworkStatusToasts() {
  useEffect(
    () =>
      onlineManager.subscribe((isOnline) => {
        if (!isOnline) {
          toast.error('Sin conexión. Reintentaremos cuando vuelva la red.', {
            id: OFFLINE_TOAST_ID,
            duration: Number.POSITIVE_INFINITY,
          });
          return;
        }
        toast.dismiss(OFFLINE_TOAST_ID);
        toast.success('Conexión restablecida.');
      }),
    []
  );
}

/** Contenedor de toasts de la app, con los colores del tema (`--toast`). */
export function Toaster() {
  useNetworkStatusToasts();

  return (
    <HotToaster
      position="bottom-center"
      toastOptions={{
        className: 'bg-toast! text-toast-foreground! text-sm! rounded-md!',
        duration: 5000,
      }}
    />
  );
}
