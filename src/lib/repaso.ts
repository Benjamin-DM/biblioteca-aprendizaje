// shortcut: API clásica de ts-fsrs (fsrs/createEmptyCard), deprecada en la v6 pero síncrona; la nueva
// (DefaultScheduler) se crea de forma asíncrona. Migrar cuando una versión mayor quite la clásica.
import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs';
import type { Marca } from './almacen';
import { fechaLocal } from './progreso';

export type Tarjeta = { id: string; curso: string; frente: string; reverso: string; origen: 'quiz' | 'dato' | 'error' };

/** Estado FSRS serializado (fechas como texto) más la fecha del primer repaso. */
export type EstadoTarjeta = Marca & Omit<Card, 'due' | 'last_review'> & { due: string; last_review?: string; primera: string };

export const NUEVAS_POR_DIA = 15;
export const NOTAS: { nota: Grade; texto: string; tecla: string }[] = [
  { nota: Rating.Again, texto: 'Otra vez', tecla: '1' },
  { nota: Rating.Hard, texto: 'Difícil', tecla: '2' },
  { nota: Rating.Good, texto: 'Bien', tecla: '3' },
  { nota: Rating.Easy, texto: 'Fácil', tecla: '4' },
];

const planificador = fsrs();

const aCard = (e: EstadoTarjeta | undefined, ahora: Date): Card =>
  e ? ({ ...e, due: new Date(e.due), last_review: e.last_review ? new Date(e.last_review) : undefined } as Card) : createEmptyCard(ahora);

export function calificar(estado: EstadoTarjeta | undefined, nota: Grade, ahora: Date): EstadoTarjeta {
  const { card } = planificador.next(aCard(estado, ahora), ahora, nota);
  return {
    ...card,
    due: card.due.toISOString(),
    last_review: card.last_review?.toISOString(),
    primera: estado?.primera ?? ahora.toISOString(),
    actualizado: ahora.toISOString(),
  };
}

/** Próxima fecha según cada nota posible, para mostrar el intervalo en cada botón. */
export function previsiones(estado: EstadoTarjeta | undefined, ahora: Date) {
  const todas = planificador.repeat(aCard(estado, ahora), ahora);
  return Object.fromEntries(NOTAS.map(({ nota }) => [nota, todas[nota].card.due])) as Record<Grade, Date>;
}

/** Vencidas primero (la más atrasada antes); después nuevas, sin pasar el límite diario. */
export function cola(tarjetas: Tarjeta[], estados: Record<string, EstadoTarjeta | undefined>, ahora: Date) {
  const hoy = fechaLocal(ahora);
  const nuevasHoy = Object.values(estados).filter((e) => e && fechaLocal(new Date(e.primera)) === hoy).length;
  const vencidas = tarjetas
    .filter((t) => estados[t.id] && new Date(estados[t.id]!.due) <= ahora)
    .sort((a, b) => estados[a.id]!.due.localeCompare(estados[b.id]!.due));
  const nuevas = tarjetas.filter((t) => !estados[t.id]).slice(0, Math.max(0, NUEVAS_POR_DIA - nuevasHoy));
  return [...vencidas, ...nuevas];
}

export function proximoVencimiento(tarjetas: Tarjeta[], estados: Record<string, EstadoTarjeta | undefined>) {
  const fechas = tarjetas.flatMap((t) => (estados[t.id] ? [estados[t.id]!.due] : [])).sort();
  return fechas[0] ? new Date(fechas[0]) : undefined;
}

export function describirIntervalo(desde: Date, hasta: Date) {
  const min = Math.max(1, Math.round((hasta.getTime() - desde.getTime()) / 60_000));
  if (min < 60) return `${min} min`;
  if (min < 60 * 24) return `${Math.round(min / 60)} h`;
  const dias = Math.round(min / (60 * 24));
  return dias === 1 ? '1 día' : `${dias} días`;
}
