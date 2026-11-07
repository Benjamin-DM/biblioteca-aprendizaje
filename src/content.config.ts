import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const CURSOS = './src/content/cursos';

// El id conserva la ruta: de ahí salen curso y módulo. Un quiz comparte id con su lección.
const idDeRuta = ({ entry }: { entry: string }) => entry.replace(/(\.quiz)?\.(md|ya?ml)$/, '');

const tags = z.array(z.string()).default([]);

const areas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/areas' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    icono: z.string(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Debe ser un color hexadecimal, como #4338ca'),
  }),
});

const cursos = defineCollection({
  loader: glob({ pattern: '*/curso.md', base: CURSOS, generateId: idDeRuta }),
  schema: z.object({
    titulo: z.string(),
    area: z.string(),
    nivel: z.enum(['basico', 'intermedio', 'avanzado']),
    tags,
    objetivo: z.string(),
    fecha_meta: z.coerce.date().optional(),
    horas_semana: z.number().positive(),
    estado: z.enum(['por-empezar', 'en-curso', 'completado']),
    fuentes: z.array(z.object({ titulo: z.string(), url: z.url() })).default([]),
  }),
});

const modulos = defineCollection({
  loader: glob({ pattern: '*/modulos/*/modulo.md', base: CURSOS, generateId: idDeRuta }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number().int(),
    dominio: z
      .object({
        nombre: z.string(),
        peso_min: z.number().min(0).max(100),
        peso_max: z.number().min(0).max(100),
      })
      .refine((d) => d.peso_min <= d.peso_max, 'peso_min no puede superar a peso_max')
      .optional(),
  }),
});

const lecciones = defineCollection({
  loader: glob({
    pattern: ['*/modulos/*/*.md', '!**/modulo.md', '!**/lab-*.md'],
    base: CURSOS,
    generateId: idDeRuta,
  }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number().int(),
    duracion_min: z.number().positive(),
    tags,
    dificultad: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    tipo_contenido: z.enum(['conceptos', 'datos', 'practica']).optional(),
    conceptos_clave: z.array(z.string()).default([]),
    preguntas_elaboracion: z.array(z.string()).default([]),
  }),
});

const labs = defineCollection({
  loader: glob({ pattern: '*/modulos/*/lab-*.md', base: CURSOS, generateId: idDeRuta }),
  schema: z.object({
    titulo: z.string(),
    orden: z.number().int(),
    duracion_min: z.number().positive(),
    objetivo: z.string(),
    criterio_hecho: z.array(z.string()).min(1),
  }),
});

const quizzes = defineCollection({
  loader: glob({ pattern: '*/modulos/*/*.quiz.yaml', base: CURSOS, generateId: idDeRuta }),
  schema: z.object({
    preguntas: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
            enunciado: z.string(),
            opciones: z.array(z.string()).min(2),
            correcta: z.number().int().min(0),
            explicacion: z.string(),
          })
          .refine((p) => p.correcta < p.opciones.length, {
            path: ['correcta'],
            message: 'El índice no corresponde a ninguna opción',
          }),
      )
      .min(1)
      .refine((ps) => new Set(ps.map((p) => p.id)).size === ps.length, 'Hay ids de pregunta repetidos'),
  }),
});

const roadmaps = defineCollection({
  loader: glob({ pattern: '*/roadmap.yaml', base: CURSOS, generateId: idDeRuta }),
  schema: z.object({
    fases: z.array(
      z.object({
        titulo: z.string(),
        semanas: z.array(
          z.object({ numero: z.number().int(), titulo: z.string(), tareas: z.array(z.string()) }),
        ),
        gate: z.string(),
      }),
    ),
  }),
});

const recursos = defineCollection({
  loader: glob({ pattern: '*/recursos.md', base: CURSOS, generateId: idDeRuta }),
  schema: z.object({}),
});

export const collections = { areas, cursos, modulos, lecciones, labs, quizzes, roadmaps, recursos };
