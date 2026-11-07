import { describe, expect, it } from 'vitest';
import { armarArbol, contarLabs, contarLecciones, contarPreguntas, vecinas, type Fuentes } from '../src/lib/arbol';

const e = (id: string, data: object = {}) => ({ id, data }) as any;

function fuentes(cambios: Partial<Record<keyof Fuentes, any[]>> = {}): Fuentes {
  return {
    areas: [e('a')],
    cursos: [e('c/curso', { titulo: 'C', area: 'a' })],
    modulos: [e('c/modulos/m2/modulo', { orden: 2 }), e('c/modulos/m1/modulo', { orden: 1 })],
    lecciones: [
      e('c/modulos/m1/l2', { orden: 2 }),
      e('c/modulos/m1/l1', { orden: 1 }),
      e('c/modulos/m2/l3', { orden: 1 }),
    ],
    labs: [e('c/modulos/m1/lab-x', { orden: 1 })],
    quizzes: [e('c/modulos/m1/l1', { preguntas: [{}, {}] })],
    roadmaps: [e('c/roadmap')],
    recursos: [],
    ...cambios,
  };
}

describe('armarArbol', () => {
  it('ordena módulos y lecciones por orden y arma rutas', () => {
    const [c] = armarArbol(fuentes());
    expect(c.modulos.map((m) => m.slug)).toEqual(['m1', 'm2']);
    expect(c.modulos[0].lecciones.map((l) => l.slug)).toEqual(['l1', 'l2']);
    expect(c.modulos[0].lecciones[0].ruta).toBe('cursos/c/m1/l1/');
    expect(c.modulos[0].labs[0].ruta).toBe('cursos/c/labs/lab-x/');
  });
  it('asocia quiz, roadmap y totales', () => {
    const [c] = armarArbol(fuentes());
    expect(c.modulos[0].lecciones[0].quiz).toBeDefined();
    expect(c.modulos[0].lecciones[1].quiz).toBeUndefined();
    expect(c.roadmap).toBeDefined();
    expect(contarLecciones(c)).toBe(3);
    expect(contarLabs(c)).toBe(1);
    expect(contarPreguntas(c)).toBe(2);
  });
  it('acepta un curso vacío', () => {
    const [c] = armarArbol(fuentes({ modulos: [], lecciones: [], labs: [], quizzes: [], roadmaps: [] }));
    expect(c.modulos).toEqual([]);
    expect(contarLecciones(c)).toBe(0);
  });
  it('rechaza un área inexistente nombrando el curso', () => {
    expect(() => armarArbol(fuentes({ areas: [e('otra')] }))).toThrow(/cursos\/c\/curso\.md.*"a" no existe.*otra/);
  });
  it('rechaza un quiz sin lección', () => {
    expect(() => armarArbol(fuentes({ quizzes: [e('c/modulos/m1/nada', { preguntas: [] })] }))).toThrow(/no hay una lección/);
  });
  it('rechaza una lección sin modulo.md', () => {
    expect(() => armarArbol(fuentes({ lecciones: [e('c/modulos/mx/l', { orden: 1 })], quizzes: [] }))).toThrow(/falta el modulo\.md/);
  });
  it('rechaza un módulo llamado labs', () => {
    expect(() => armarArbol(fuentes({ modulos: [e('c/modulos/labs/modulo', { orden: 1 })], lecciones: [], labs: [], quizzes: [] }))).toThrow(/labs/);
  });
});

describe('vecinas', () => {
  it('cruza el límite entre módulos', () => {
    const [c] = armarArbol(fuentes());
    expect(vecinas(c, 'm1', 'l2').siguiente?.slug).toBe('l3');
    expect(vecinas(c, 'm2', 'l3').anterior?.slug).toBe('l2');
  });
  it('no tiene vecina en los extremos', () => {
    const [c] = armarArbol(fuentes());
    expect(vecinas(c, 'm1', 'l1').anterior).toBeUndefined();
    expect(vecinas(c, 'm2', 'l3').siguiente).toBeUndefined();
  });
});
