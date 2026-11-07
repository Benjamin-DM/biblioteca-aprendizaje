import { describe, expect, it } from 'vitest';
import { filtrarCursos, SIN_FILTROS, type TarjetaCurso } from '../src/lib/catalogo';

const curso = (id: string, c: Partial<TarjetaCurso>) => ({ id, area: 'a', nivel: 'basico', estado: 'en-curso', tags: [], ...c }) as TarjetaCurso;
const cursos = [curso('1', { tags: ['x'] }), curso('2', { area: 'b', nivel: 'avanzado' })];
const ids = (r: TarjetaCurso[]) => r.map((c) => c.id);

describe('filtrarCursos', () => {
  it('sin filtros devuelve todo', () => {
    expect(ids(filtrarCursos(cursos, SIN_FILTROS))).toEqual(['1', '2']);
  });
  it('filtra por cada campo', () => {
    expect(ids(filtrarCursos(cursos, { ...SIN_FILTROS, area: 'b' }))).toEqual(['2']);
    expect(ids(filtrarCursos(cursos, { ...SIN_FILTROS, tag: 'x' }))).toEqual(['1']);
    expect(ids(filtrarCursos(cursos, { ...SIN_FILTROS, nivel: 'avanzado' }))).toEqual(['2']);
  });
  it('combina filtros con Y', () => {
    expect(filtrarCursos(cursos, { ...SIN_FILTROS, area: 'a', nivel: 'avanzado' })).toEqual([]);
  });
});
