import { getCollection } from 'astro:content';
import { armarArbol } from './arbol';

export async function obtenerArbol() {
  const [areas, cursos, modulos, lecciones, labs, quizzes, roadmaps, recursos] = await Promise.all([
    getCollection('areas'),
    getCollection('cursos'),
    getCollection('modulos'),
    getCollection('lecciones'),
    getCollection('labs'),
    getCollection('quizzes'),
    getCollection('roadmaps'),
    getCollection('recursos'),
  ]);
  return armarArbol({ areas, cursos, modulos, lecciones, labs, quizzes, roadmaps, recursos });
}

export const obtenerAreas = () => getCollection('areas');

export const u = (ruta: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${ruta}`;

export const ETIQUETAS = {
  nivel: { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' },
  estado: { 'por-empezar': 'Por empezar', 'en-curso': 'En curso', completado: 'Completado' },
} as const;
