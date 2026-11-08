import { hash } from './almacen';
import type { Curso } from './arbol';
import { filasParaMemorizar } from './datos';
import type { Pregunta } from './quiz';
import type { Tarjeta } from './repaso';

/** Todas las preguntas, con su dominio heredado del módulo. */
export const preguntasDe = (cursos: Curso[]): Pregunta[] =>
  cursos.flatMap((c) =>
    c.modulos.flatMap((m) =>
      m.lecciones.flatMap((l) =>
        (l.quiz?.data.preguntas ?? []).map((p) => ({
          id: `${l.entrada.id}#${p.id}`,
          curso: c.slug,
          modulo: `${c.slug}/${m.slug}`,
          moduloTitulo: m.entrada.data.titulo,
          leccion: l.entrada.id,
          leccionTitulo: l.entrada.data.titulo,
          dominio: m.entrada.data.dominio?.nombre ?? m.entrada.data.titulo,
          enunciado: p.enunciado,
          opciones: p.opciones,
          correcta: p.correcta,
          explicacion: p.explicacion,
        })),
      ),
    ),
  );

/** Tarjetas que salen del contenido: preguntas de quiz y tablas "para memorizar". Las de errores salen del almacén. */
export function tarjetasDe(cursos: Curso[]): Tarjeta[] {
  const deQuiz = preguntasDe(cursos).map((p) => ({
    id: p.id,
    curso: p.curso,
    frente: p.enunciado,
    reverso: `${p.opciones[p.correcta]}. ${p.explicacion}`,
    origen: 'quiz' as const,
  }));
  const deDatos = cursos.flatMap((c) =>
    c.modulos.flatMap((m) =>
      m.lecciones.flatMap((l) =>
        filasParaMemorizar(l.entrada.body ?? '').map((f) => ({
          id: `${l.entrada.id}#dato-${hash(f.frente)}`,
          curso: c.slug,
          frente: f.frente,
          reverso: f.reverso,
          origen: 'dato' as const,
        })),
      ),
    ),
  );
  return [...deQuiz, ...deDatos];
}
