export type Pregunta = {
  /** `<id de lección>#<id local>`: estable mientras no se renombre el archivo. */
  id: string;
  curso: string;
  modulo: string;
  moduloTitulo: string;
  leccion: string;
  leccionTitulo: string;
  dominio: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
};

/** Pregunta lista para mostrar: `orden` son los índices originales de las opciones, ya mezclados. */
export type PreguntaEnJuego = { pregunta: Pregunta; orden: number[] };

/** Respuestas por id de pregunta, como índice original de la opción elegida. */
export type Respuestas = Record<string, number>;

export function barajar<T>(xs: T[], azar = Math.random): T[] {
  const r = [...xs];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Elige y mezcla preguntas de los módulos o la lección indicados; varias fuentes dan práctica intercalada. */
export function armar(preguntas: Pregunta[], filtro: { modulos?: Set<string>; leccion?: string }, cantidad: number, azar = Math.random) {
  const pool = preguntas.filter((p) => (filtro.leccion ? p.leccion === filtro.leccion : filtro.modulos?.has(p.modulo)));
  return barajar(pool, azar)
    .slice(0, cantidad)
    .map((pregunta) => ({ pregunta, orden: barajar(pregunta.opciones.map((_, i) => i), azar) }));
}

export type Resultado = {
  correctas: number;
  total: number;
  porcentaje: number;
  /** De peor a mejor, para saber qué reforzar primero. */
  dominios: { dominio: string; correctas: number; total: number; porcentaje: number }[];
};

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a * 100) / b));

/** Una pregunta sin responder cuenta como incorrecta. */
export function puntuar(preguntas: Pregunta[], respuestas: Respuestas): Resultado {
  const porDominio = new Map<string, { correctas: number; total: number }>();
  let correctas = 0;
  for (const p of preguntas) {
    const bien = respuestas[p.id] === p.correcta;
    if (bien) correctas++;
    const d = porDominio.get(p.dominio) ?? { correctas: 0, total: 0 };
    porDominio.set(p.dominio, { correctas: d.correctas + (bien ? 1 : 0), total: d.total + 1 });
  }
  const dominios = [...porDominio]
    .map(([dominio, d]) => ({ dominio, ...d, porcentaje: pct(d.correctas, d.total) }))
    .sort((a, b) => a.porcentaje - b.porcentaje || a.dominio.localeCompare(b.dominio));
  return { correctas, total: preguntas.length, porcentaje: pct(correctas, preguntas.length), dominios };
}

/** Segundos que quedan, calculados sobre la hora de fin: no depende de que los ticks lleguen a tiempo. */
export const restante = (fin: number, ahora: number) => Math.max(0, Math.ceil((fin - ahora) / 1000));

export const formatoTiempo = (segundos: number) =>
  `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
