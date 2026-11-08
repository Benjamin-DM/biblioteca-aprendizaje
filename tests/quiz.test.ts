import { describe, expect, it } from 'vitest';
import { armar, barajar, formatoTiempo, puntuar, restante, type Pregunta } from '../src/lib/quiz';

const p = (id: string, modulo: string, dominio: string, leccion = 'l1'): Pregunta => ({
  id,
  curso: 'c',
  modulo,
  moduloTitulo: modulo,
  leccion,
  leccionTitulo: leccion,
  dominio,
  enunciado: id,
  opciones: ['a', 'b', 'c'],
  correcta: 1,
  explicacion: '',
});

// Generador determinista para que el orden sea reproducible.
const semilla = (s = 1) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

describe('armar', () => {
  const pool = [p('1', 'm1', 'A'), p('2', 'm1', 'A'), p('3', 'm2', 'B', 'l2'), p('4', 'm3', 'C', 'l3')];
  it('intercala solo los módulos elegidos y respeta la cantidad', () => {
    const r = armar(pool, { modulos: new Set(['m1', 'm2']) }, 10, semilla());
    expect(r.map((x) => x.pregunta.id).sort()).toEqual(['1', '2', '3']);
    expect(armar(pool, { modulos: new Set(['m1', 'm2', 'm3']) }, 2, semilla())).toHaveLength(2);
  });
  it('filtra por lección', () => {
    expect(armar(pool, { leccion: 'l2' }, 10).map((x) => x.pregunta.id)).toEqual(['3']);
  });
  it('mezcla las opciones conservando todos los índices', () => {
    const [x] = armar(pool, { leccion: 'l2' }, 1, semilla(7));
    expect([...x.orden].sort()).toEqual([0, 1, 2]);
  });
  it('barajar no pierde ni duplica elementos', () => {
    expect(barajar([1, 2, 3, 4, 5], semilla(3)).sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('puntuar', () => {
  it('cuenta aciertos, trata sin responder como error y ordena dominios de peor a mejor', () => {
    const preguntas = [p('1', 'm1', 'A'), p('2', 'm1', 'A'), p('3', 'm2', 'B')];
    const r = puntuar(preguntas, { '1': 1, '2': 0 });
    expect(r).toMatchObject({ correctas: 1, total: 3, porcentaje: 33 });
    expect(r.dominios).toEqual([
      { dominio: 'B', correctas: 0, total: 1, porcentaje: 0 },
      { dominio: 'A', correctas: 1, total: 2, porcentaje: 50 },
    ]);
  });
  it('sin preguntas no divide por cero', () => {
    expect(puntuar([], {}).porcentaje).toBe(0);
  });
});

describe('tiempo', () => {
  it('se calcula sobre la hora de fin', () => {
    expect(restante(10_000, 0)).toBe(10);
    expect(restante(10_000, 9_001)).toBe(1);
    expect(restante(10_000, 20_000)).toBe(0);
    expect(formatoTiempo(605)).toBe('10:05');
  });
});
