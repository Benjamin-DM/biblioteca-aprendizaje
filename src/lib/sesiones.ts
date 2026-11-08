import { ahora, type Doc, type Sesion } from './almacen';

export const TICK_MS = 30_000;
export const INACTIVIDAD_MS = 5 * 60_000;

/** Segundos a sumar en un tick: solo con la pestaña visible y actividad reciente, para no contar una pestaña olvidada. */
export const segundosDelTick = (visible: boolean, ultimaActividad: number, momento: number) =>
  visible && momento - ultimaActividad < INACTIVIDAD_MS ? TICK_MS / 1000 : 0;

/** Crea o actualiza la sesión por id. */
export function registrarSesion(doc: Doc, sesion: Omit<Sesion, 'actualizado'>): Doc {
  const nueva = { ...sesion, actualizado: ahora() };
  const resto = doc.sesiones.filter((s) => s.id !== sesion.id);
  return { ...doc, sesiones: [...resto, nueva] };
}
