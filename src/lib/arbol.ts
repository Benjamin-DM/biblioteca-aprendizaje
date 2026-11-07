import type { CollectionEntry } from 'astro:content';

export type Fuentes = {
  areas: CollectionEntry<'areas'>[];
  cursos: CollectionEntry<'cursos'>[];
  modulos: CollectionEntry<'modulos'>[];
  lecciones: CollectionEntry<'lecciones'>[];
  labs: CollectionEntry<'labs'>[];
  quizzes: CollectionEntry<'quizzes'>[];
  roadmaps: CollectionEntry<'roadmaps'>[];
  recursos: CollectionEntry<'recursos'>[];
};

export type Leccion = {
  slug: string;
  ruta: string;
  entrada: CollectionEntry<'lecciones'>;
  quiz?: CollectionEntry<'quizzes'>;
};
export type Lab = { slug: string; ruta: string; entrada: CollectionEntry<'labs'> };
export type Modulo = {
  slug: string;
  entrada: CollectionEntry<'modulos'>;
  lecciones: Leccion[];
  labs: Lab[];
};
export type Curso = {
  slug: string;
  ruta: string;
  entrada: CollectionEntry<'cursos'>;
  area: CollectionEntry<'areas'>;
  modulos: Modulo[];
  roadmap?: CollectionEntry<'roadmaps'>;
  recursos?: CollectionEntry<'recursos'>;
};

const ordenar = <T extends { data: { orden: number } }>(a: T, b: T) => a.data.orden - b.data.orden;
const partes = (id: string) => id.split('/');

/** Id `curso/modulos/modulo/archivo`: módulo como `curso/modulo`, para agrupar. */
const claveModulo = (id: string) => {
  const [curso, , modulo] = partes(id);
  return `${curso}/${modulo}`;
};

function agrupar<T extends { id: string }>(entradas: T[]) {
  const grupos = new Map<string, T[]>();
  for (const e of entradas) {
    const clave = claveModulo(e.id);
    grupos.set(clave, [...(grupos.get(clave) ?? []), e]);
  }
  return grupos;
}

function revisarHuerfanos(grupos: Map<string, { id: string }[]>, validos: Set<string>) {
  for (const [clave, entradas] of grupos) {
    if (!validos.has(clave)) throw new Error(`${entradas[0].id}: falta el modulo.md de ${clave}`);
  }
}

export function armarArbol(f: Fuentes): Curso[] {
  const quizzes = new Map(f.quizzes.map((q) => [q.id, q]));
  const roadmaps = new Map(f.roadmaps.map((r) => [partes(r.id)[0], r]));
  const recursos = new Map(f.recursos.map((r) => [partes(r.id)[0], r]));
  const areas = new Map(f.areas.map((a) => [a.id, a]));
  const lecciones = agrupar(f.lecciones);
  const labs = agrupar(f.labs);

  const idsLeccion = new Set(f.lecciones.map((l) => l.id));
  for (const q of f.quizzes) {
    if (!idsLeccion.has(q.id)) throw new Error(`${q.id}.quiz.yaml: no hay una lección con ese nombre`);
  }
  const modulosValidos = new Set(f.modulos.map((m) => claveModulo(m.id)));
  revisarHuerfanos(lecciones, modulosValidos);
  revisarHuerfanos(labs, modulosValidos);

  return f.cursos
    .map((entrada) => {
      const slug = partes(entrada.id)[0];
      const area = areas.get(entrada.data.area);
      if (!area) {
        const validas = [...areas.keys()].join(', ');
        throw new Error(`cursos/${slug}/curso.md: el área "${entrada.data.area}" no existe. Válidas: ${validas}`);
      }
      const modulos = f.modulos
        .filter((m) => partes(m.id)[0] === slug)
        .sort(ordenar)
        .map((m) => {
          const clave = claveModulo(m.id);
          const modulo = partes(m.id)[2];
          // La ruta /labs/ del curso es fija; un módulo con ese nombre la pisaría.
          if (modulo === 'labs') throw new Error(`${m.id}: un módulo no puede llamarse "labs"`);
          return {
            slug: modulo,
            entrada: m,
            lecciones: (lecciones.get(clave) ?? []).sort(ordenar).map((l) => {
              const nombre = partes(l.id)[3];
              return { slug: nombre, ruta: `cursos/${slug}/${modulo}/${nombre}/`, entrada: l, quiz: quizzes.get(l.id) };
            }),
            labs: (labs.get(clave) ?? []).sort(ordenar).map((l) => {
              const nombre = partes(l.id)[3];
              return { slug: nombre, ruta: `cursos/${slug}/labs/${nombre}/`, entrada: l };
            }),
          };
        });
      return { slug, ruta: `cursos/${slug}/`, entrada, area, modulos, roadmap: roadmaps.get(slug), recursos: recursos.get(slug) };
    })
    .sort((a, b) => a.entrada.data.titulo.localeCompare(b.entrada.data.titulo, 'es'));
}

/** Lecciones vecinas dentro del curso, cruzando módulos. */
export function vecinas(curso: Curso, slugModulo: string, slugLeccion: string) {
  const todas = curso.modulos.flatMap((m) => m.lecciones.map((l) => ({ ...l, modulo: m.slug })));
  const i = todas.findIndex((l) => l.modulo === slugModulo && l.slug === slugLeccion);
  return { anterior: todas[i - 1], siguiente: todas[i + 1] };
}

export const contarLecciones = (curso: Curso) => curso.modulos.reduce((n, m) => n + m.lecciones.length, 0);
export const contarLabs = (curso: Curso) => curso.modulos.reduce((n, m) => n + m.labs.length, 0);
export const contarPreguntas = (curso: Curso) =>
  curso.modulos.reduce((n, m) => n + m.lecciones.reduce((k, l) => k + (l.quiz?.data.preguntas.length ?? 0), 0), 0);
