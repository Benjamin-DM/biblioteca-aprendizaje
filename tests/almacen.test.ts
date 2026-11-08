import { describe, expect, it } from 'vitest';
import { actualizar, AlmacenLleno, CLAVE, combinar, hash, leer, resetearCurso, vacio, validar, type Doc } from '../src/lib/almacen';

function almacenFalso(inicial: Record<string, string> = {}, lleno = false) {
  const datos = new Map(Object.entries(inicial));
  return {
    datos,
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => {
      if (lleno) throw new DOMException('lleno', 'QuotaExceededError');
      datos.set(k, v);
    },
  };
}

const doc = (cambios: Partial<Doc>): Doc => ({ ...vacio(), ...cambios });

describe('validar', () => {
  it('completa las claves faltantes', () => {
    const d = validar({ version: 1, notas: { a: { texto: 'x', actualizado: '2026-01-01' } } });
    expect(d.notas.a.texto).toBe('x');
    expect(d.sesiones).toEqual([]);
    expect(d.roadmap).toEqual({});
  });
  it('rechaza versiones futuras, tipos incorrectos y registros sin marcas', () => {
    expect(() => validar([])).toThrow(/objeto JSON/);
    expect(() => validar({})).toThrow(/version/);
    expect(() => validar({ version: 2 })).toThrow(/versión 2/);
    expect(() => validar({ version: 1, notas: [] })).toThrow(/"notas" debe ser un objeto/);
    expect(() => validar({ version: 1, notas: { a: { texto: 'x' } } })).toThrow(/notas\.a/);
    expect(() => validar({ version: 1, sesiones: [{ id: 's' }] })).toThrow(/sesiones\[0\]/);
  });
});

describe('combinar', () => {
  it('en mapas gana el más reciente y conserva claves de ambos lados', () => {
    const a = doc({ lecciones: { x: { completada: true, actualizado: '2026-01-02' }, solo_a: { completada: true, actualizado: '2026-01-01' } } });
    const b = doc({ lecciones: { x: { completada: false, actualizado: '2026-01-01' }, solo_b: { completada: true, actualizado: '2026-01-01' } } });
    const r = combinar(a, b);
    expect(r.lecciones.x.completada).toBe(true);
    expect(Object.keys(r.lecciones).sort()).toEqual(['solo_a', 'solo_b', 'x']);
  });
  it('en listas une por id y deja la versión más reciente', () => {
    const s = (id: string, segundos: number, actualizado: string) =>
      ({ id, segundos, actualizado, curso: 'c', leccion: 'l', fecha: actualizado, metodo: 'lectura' });
    const r = combinar(doc({ sesiones: [s('1', 60, '2026-01-01'), s('2', 30, '2026-01-01')] }), doc({ sesiones: [s('1', 120, '2026-01-02'), s('3', 10, '2026-01-01')] }));
    expect(r.sesiones.map((x) => [x.id, x.segundos])).toEqual([['1', 120], ['2', 30], ['3', 10]]);
  });
  it('abrir una lección en otro dispositivo no deshace su completado', () => {
    const telefono = doc({ lecciones: { x: { completada: true, actualizado: '2026-01-01' } } });
    const pc = doc({ aperturas: { x: { actualizado: '2026-01-05' } } });
    const r = combinar(pc, telefono);
    expect(r.lecciones.x.completada).toBe(true);
    expect(r.aperturas.x.actualizado).toBe('2026-01-05');
  });
});

describe('resetearCurso', () => {
  it('borra solo lo del curso indicado', () => {
    const d = doc({
      lecciones: { 'c1/m/l': { completada: true, actualizado: 't' }, 'c10/m/l': { completada: true, actualizado: 't' } },
      roadmap: { 'c1/roadmap#a': { hecho: true, actualizado: 't' } },
      sesiones: [{ id: '1', curso: 'c1', leccion: 'c1/m/l', fecha: 't', metodo: 'lectura', segundos: 60, actualizado: 't' }],
    });
    const r = resetearCurso(d, 'c1');
    expect(Object.keys(r.lecciones)).toEqual(['c10/m/l']);
    expect(r.roadmap).toEqual({});
    expect(r.sesiones).toEqual([]);
  });
});

describe('leer y actualizar', () => {
  it('guarda y vuelve a leer', () => {
    const s = almacenFalso();
    actualizar((d) => {
      d.notas.a = { texto: 'hola', actualizado: 't' };
    }, s);
    expect(leer(s).notas.a.texto).toBe('hola');
  });
  it('relee antes de escribir, para no pisar lo que guardó otra pestaña', () => {
    const s = almacenFalso();
    actualizar((d) => void (d.notas.a = { texto: '1', actualizado: 't' }), s);
    s.datos.set(CLAVE, JSON.stringify({ ...JSON.parse(s.datos.get(CLAVE)!), notas: { a: { texto: '1', actualizado: 't' }, b: { texto: 'otra pestaña', actualizado: 't' } } }));
    actualizar((d) => void (d.notas.c = { texto: '3', actualizado: 't' }), s);
    expect(Object.keys(leer(s).notas).sort()).toEqual(['a', 'b', 'c']);
  });
  it('un documento dañado se aparta en una copia y no se pierde', () => {
    const s = almacenFalso({ [CLAVE]: '{roto' });
    expect(leer(s)).toEqual(vacio());
    const copia = [...s.datos.keys()].find((k) => k.startsWith(`${CLAVE}:danado:`));
    expect(copia && s.datos.get(copia)).toBe('{roto');
  });
  it('con el almacenamiento lleno lanza AlmacenLleno y no cambia nada', () => {
    const s = almacenFalso({ [CLAVE]: JSON.stringify(vacio()) }, true);
    expect(() => actualizar((d) => void (d.notas.a = { texto: 'x', actualizado: 't' }), s)).toThrow(AlmacenLleno);
    expect(leer(s).notas).toEqual({});
  });
});

describe('hash', () => {
  it('es estable e ignora espacios de más', () => {
    expect(hash('Hacer  el lab ')).toBe(hash('Hacer el lab'));
    expect(hash('a')).not.toBe(hash('b'));
  });
});
