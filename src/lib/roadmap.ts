import type { CollectionEntry } from 'astro:content';
import { hash } from './almacen';
import type { Tarea } from './progreso';

// La semana entra en la clave para que la misma tarea en dos semanas sean dos casillas.
export const claveTarea = (curso: string, semana: number, tarea: string) => `${curso}/roadmap#${hash(`${semana}|${tarea}`)}`;

export const tareasDe = (curso: string, roadmap?: CollectionEntry<'roadmaps'>): Tarea[] =>
  (roadmap?.data.fases ?? []).flatMap((f) =>
    f.semanas.flatMap((s) => s.tareas.map((texto) => ({ clave: claveTarea(curso, s.numero, texto), texto, semana: s.numero }))),
  );
