import { useEffect, useState, useSyncExternalStore } from 'react';
import { instantanea, instantaneaServidor, suscribir } from './almacen';

export const usarDoc = () => useSyncExternalStore(suscribir, instantanea, instantaneaServidor);

/** Fecha del cliente, solo después de hidratar: el HTML generado en el build no puede saber qué día es. */
export function usarHoy() {
  const [hoy, setHoy] = useState<Date | null>(null);
  useEffect(() => setHoy(new Date()), []);
  return hoy;
}
