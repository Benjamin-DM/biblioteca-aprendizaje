import { describe, expect, it } from 'vitest';
import { vacio, type Doc } from '../src/lib/almacen';
import { completados, continuar, diasDeEstudio, diasHasta, fechaLocal, porcentaje, proximaTarea, racha } from '../src/lib/progreso';
import { registrarSesion, segundosDelTick } from '../src/lib/sesiones';

const doc = (cambios: Partial<Doc>): Doc => ({ ...vacio(), ...cambios });
const items = [
  { id: 'a', titulo: 'A', href: '/a' },
  { id: 'b', titulo: 'B', href: '/b' },
];
const local = (a: number, m: number, d: number) => new Date(a, m - 1, d, 12);

describe('progreso', () => {
  it('cuenta completados y porcentaje, sin dividir por cero', () => {
    const d = doc({ lecciones: { a: { completada: true, actualizado: 't' }, b: { completada: false, actualizado: 't' } } });
    expect(completados(d, items)).toBe(1);
    expect(porcentaje(1, 3)).toBe(33);
    expect(porcentaje(0, 0)).toBe(0);
  });
  it('continuar elige la apertura más reciente', () => {
    expect(continuar(vacio(), items)).toBeUndefined();
    const d = doc({ aperturas: { a: { actualizado: '2026-01-02' }, b: { actualizado: '2026-01-03' } } });
    expect(continuar(d, items)?.id).toBe('b');
  });
  it('la próxima tarea es la primera sin marcar', () => {
    const tareas = [
      { clave: 'k1', texto: 'uno', semana: 1 },
      { clave: 'k2', texto: 'dos', semana: 1 },
    ];
    expect(proximaTarea(doc({ roadmap: { k1: { hecho: true, actualizado: 't' } } }), tareas)?.clave).toBe('k2');
    expect(proximaTarea(doc({ roadmap: { k1: { hecho: true, actualizado: 't' }, k2: { hecho: true, actualizado: 't' } } }), tareas)).toBeUndefined();
  });
  it('días hasta la fecha meta, en ambos sentidos', () => {
    expect(diasHasta('2026-11-10', local(2026, 11, 7))).toBe(3);
    expect(diasHasta('2026-11-07', local(2026, 11, 7))).toBe(0);
    expect(diasHasta('2026-11-01', local(2026, 11, 7))).toBe(-6);
    expect(diasHasta('2027-01-01', local(2026, 12, 31))).toBe(1);
  });
});

describe('racha', () => {
  const dias = new Set(['2026-11-04', '2026-11-05', '2026-11-06']);
  it('cuenta los días seguidos hasta hoy', () => {
    expect(racha(new Set([...dias, '2026-11-07']), local(2026, 11, 7))).toBe(4);
  });
  it('si hoy aún no estudiaste, la racha de ayer sigue', () => {
    expect(racha(dias, local(2026, 11, 7))).toBe(3);
  });
  it('un día sin estudiar corta la racha', () => {
    expect(racha(dias, local(2026, 11, 8))).toBe(0);
  });
  it('días de estudio: sesiones de al menos un minuto y lecciones completadas', () => {
    const d = doc({
      sesiones: [
        { id: '1', curso: 'c', leccion: 'l', fecha: local(2026, 11, 5).toISOString(), metodo: 'lectura', segundos: 30, actualizado: 't' },
        { id: '2', curso: 'c', leccion: 'l', fecha: local(2026, 11, 6).toISOString(), metodo: 'lectura', segundos: 60, actualizado: 't' },
      ],
      lecciones: { x: { completada: true, actualizado: local(2026, 11, 7).toISOString() } },
    });
    expect([...diasDeEstudio(d)].sort()).toEqual(['2026-11-06', '2026-11-07']);
    expect(fechaLocal(local(2026, 1, 9))).toBe('2026-01-09');
  });
});

describe('sesiones', () => {
  it('suma tiempo solo con la pestaña visible y actividad reciente', () => {
    expect(segundosDelTick(true, 0, 60_000)).toBe(30);
    expect(segundosDelTick(false, 0, 60_000)).toBe(0);
    expect(segundosDelTick(true, 0, 5 * 60_000)).toBe(0);
  });
  it('registrar actualiza la misma sesión por id', () => {
    const base = { id: 's', curso: 'c', leccion: 'l', fecha: 't', metodo: 'lectura' };
    let d = registrarSesion(vacio(), { ...base, segundos: 30 });
    d = registrarSesion(d, { ...base, segundos: 60 });
    expect(d.sesiones).toHaveLength(1);
    expect(d.sesiones[0].segundos).toBe(60);
  });
});
