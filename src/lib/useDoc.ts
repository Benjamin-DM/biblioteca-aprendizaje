import { useSyncExternalStore } from 'react';
import { instantanea, instantaneaServidor, suscribir } from './almacen';

export const useDoc = () => useSyncExternalStore(suscribir, instantanea, instantaneaServidor);

// shortcut: la fecha se fija al cargar la página; una pestaña abierta pasada la medianoche sigue en el día anterior hasta recargar.
let hoyCliente: Date | undefined;
const sinCambios = () => () => {};

/** Fecha del cliente, solo después de hidratar: el HTML generado en el build no puede saber qué día es. */
export const useHoy = () => useSyncExternalStore(sinCambios, () => (hoyCliente ??= new Date()), () => null);
