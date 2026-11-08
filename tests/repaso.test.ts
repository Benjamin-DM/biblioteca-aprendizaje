import { Rating } from 'ts-fsrs';
import { describe, expect, it } from 'vitest';
import { filasParaMemorizar } from '../src/lib/datos';
import { calificar, cola, describirIntervalo, NUEVAS_POR_DIA, previsiones, proximoVencimiento, type EstadoTarjeta, type Tarjeta } from '../src/lib/repaso';

const t = (id: string): Tarjeta => ({ id, curso: 'c', frente: id, reverso: id, origen: 'quiz' });
const ahora = new Date('2026-11-07T15:00:00');

describe('calificar', () => {
  it('una tarjeta nueva calificada Fácil vence días después; Otra vez, en minutos', () => {
    const facil = calificar(undefined, Rating.Easy, ahora);
    const otra = calificar(undefined, Rating.Again, ahora);
    expect(new Date(facil.due).getTime() - ahora.getTime()).toBeGreaterThan(86_400_000);
    expect(new Date(otra.due).getTime() - ahora.getTime()).toBeLessThan(3_600_000);
    expect(facil.primera).toBe(ahora.toISOString());
  });
  it('se puede guardar como JSON y seguir calificando', () => {
    const primera = calificar(undefined, Rating.Good, ahora);
    const guardada: EstadoTarjeta = JSON.parse(JSON.stringify(primera));
    const despues = calificar(guardada, Rating.Good, new Date(primera.due));
    expect(despues.reps).toBe(2);
    expect(despues.primera).toBe(primera.primera);
    expect(despues.due > primera.due).toBe(true);
  });
  it('las previsiones crecen de Otra vez a Fácil', () => {
    const p = previsiones(undefined, ahora);
    expect(p[Rating.Again] <= p[Rating.Hard] && p[Rating.Hard] <= p[Rating.Good] && p[Rating.Good] <= p[Rating.Easy]).toBe(true);
  });
});

describe('cola', () => {
  it('pone primero las vencidas, la más atrasada antes, y después las nuevas', () => {
    const estados = {
      a: { ...calificar(undefined, Rating.Good, new Date('2026-10-01')), due: '2026-11-05T00:00:00.000Z' },
      b: { ...calificar(undefined, Rating.Good, new Date('2026-10-01')), due: '2026-11-01T00:00:00.000Z' },
      c: { ...calificar(undefined, Rating.Good, new Date('2026-10-01')), due: '2026-12-01T00:00:00.000Z' },
    };
    expect(cola([t('a'), t('b'), t('c'), t('n')], estados, ahora).map((x) => x.id)).toEqual(['b', 'a', 'n']);
    expect(proximoVencimiento([t('a'), t('c')], estados)?.toISOString()).toBe('2026-11-05T00:00:00.000Z');
  });
  it('limita las nuevas por día, contando las ya empezadas hoy', () => {
    const muchas = Array.from({ length: 40 }, (_, i) => t(`n${i}`));
    expect(cola(muchas, {}, ahora)).toHaveLength(NUEVAS_POR_DIA);
    const hoy = { n0: calificar(undefined, Rating.Good, ahora), n1: calificar(undefined, Rating.Good, ahora) };
    expect(cola(muchas, hoy, ahora).filter((x) => !(x.id in hoy))).toHaveLength(NUEVAS_POR_DIA - 2);
  });
  it('describe intervalos', () => {
    expect(describirIntervalo(ahora, new Date(ahora.getTime() + 10 * 60_000))).toBe('10 min');
    expect(describirIntervalo(ahora, new Date(ahora.getTime() + 3 * 3_600_000))).toBe('3 h');
    expect(describirIntervalo(ahora, new Date(ahora.getTime() + 8 * 86_400_000))).toBe('8 días');
  });
});

describe('filasParaMemorizar', () => {
  const md = `## Algo
| no | va |
| --- | --- |
| x | y |

## Para memorizar

| Dato | Valor |
| --- | --- |
| Máximo de jobs | **256** |
| Uso de \`a\\|b\` | sí |

Texto que corta.

### Datos para memorizar
| Uno | Dos | Tres |
| - | - | - |
| k | v1 | v2 |

## Otra sección
| z | w |
| - | - |
| no | entra |`;
  it('toma solo las tablas bajo el título y limpia el formato', () => {
    expect(filasParaMemorizar(md)).toEqual([
      { frente: 'Máximo de jobs', reverso: '256' },
      { frente: 'Uso de `a|b`', reverso: 'sí' },
      { frente: 'k', reverso: 'v1 · v2' },
    ]);
  });
});
