import type { Curso } from './arbol';
import { u } from './contenido';
import type { Item, Tarea } from './progreso';
import { tareasDe } from './roadmap';

/** Lo que las islas necesitan saber de un curso, sin pasar entradas completas al navegador. */
export type ResumenCurso = {
  slug: string;
  titulo: string;
  href: string;
  fechaMeta?: string;
  items: Item[];
  tareas: Tarea[];
};

export const resumir = (c: Curso): ResumenCurso => ({
  slug: c.slug,
  titulo: c.entrada.data.titulo,
  href: u(c.ruta),
  fechaMeta: c.entrada.data.fecha_meta?.toISOString().slice(0, 10),
  items: c.modulos.flatMap((m) => [
    ...m.lecciones.map((l) => ({ id: l.entrada.id, titulo: l.entrada.data.titulo, href: u(l.ruta) })),
    ...m.labs.map((l) => ({ id: l.entrada.id, titulo: l.entrada.data.titulo, href: u(l.ruta) })),
  ]),
  tareas: tareasDe(c.slug, c.roadmap),
});
