import type { Doc } from './almacen';

export type Item = { id: string; titulo: string; href: string };
export type Tarea = { clave: string; texto: string; semana: number };

export const completados = (doc: Doc, items: Item[]) => items.filter((i) => doc.lecciones[i.id]?.completada).length;

export const porcentaje = (hechos: number, total: number) => (total === 0 ? 0 : Math.round((hechos * 100) / total));

/** El ítem abierto más recientemente entre los dados. */
export function continuar(doc: Doc, items: Item[]) {
  let mejor: Item | undefined;
  for (const i of items) {
    const fecha = doc.aperturas[i.id]?.actualizado;
    if (fecha && (!mejor || fecha > doc.aperturas[mejor.id].actualizado)) mejor = i;
  }
  return mejor;
}

export const proximaTarea = (doc: Doc, tareas: Tarea[]) => tareas.find((t) => !doc.roadmap[t.clave]?.hecho);

/** Fecha local como AAAA-MM-DD: los días de estudio son los del usuario, no los de UTC. */
export function fechaLocal(d: Date) {
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

const diaUTC = (aaaammdd: string) => {
  const [a, m, d] = aaaammdd.split('-').map(Number);
  return Date.UTC(a, m - 1, d) / 86_400_000;
};

/** Días desde hoy hasta la fecha meta (negativo si ya pasó). */
export const diasHasta = (meta: string, hoy: Date) => diaUTC(meta) - diaUTC(fechaLocal(hoy));

export const SEGUNDOS_PARA_CONTAR = 60;

/** Días con al menos un minuto de estudio o una lección completada. */
export function diasDeEstudio(doc: Doc) {
  const dias = new Set<string>();
  for (const s of doc.sesiones) if (s.segundos >= SEGUNDOS_PARA_CONTAR) dias.add(fechaLocal(new Date(s.fecha)));
  for (const l of Object.values(doc.lecciones)) if (l.completada) dias.add(fechaLocal(new Date(l.actualizado)));
  return dias;
}

/** Días seguidos estudiando. Si hoy todavía no estudiaste, la racha de ayer sigue viva. */
export function racha(dias: Set<string>, hoy: Date) {
  const dia = new Date(hoy);
  if (!dias.has(fechaLocal(dia))) dia.setDate(dia.getDate() - 1);
  let n = 0;
  while (dias.has(fechaLocal(dia))) {
    n++;
    dia.setDate(dia.getDate() - 1);
  }
  return n;
}
