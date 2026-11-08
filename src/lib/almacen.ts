// Documento único de datos personales en localStorage. Formato: specs/.../contracts/formato-exportacion.md

export const CLAVE = 'biblioteca:v1';
export const VERSION = 1;
export const EVENTO = 'biblioteca:cambio';
export const EVENTO_ERROR = 'biblioteca:error';

export type Marca = { actualizado: string };
export type Registro = Marca & { id: string; curso?: string };
export type Completado = Marca & { completada: boolean };
export type Casilla = Marca & { hecho: boolean };
export type Nota = Marca & { texto: string };
export type Sesion = Registro & {
  curso: string;
  leccion: string;
  fecha: string;
  metodo: string;
  segundos: number;
  foco?: number;
  energia?: number;
};

export type Intento = Registro & {
  modo: 'practica' | 'examen';
  preguntas: string[];
  /** Índice original de la opción elegida, por id de pregunta. */
  respuestas: Record<string, number>;
  segundos: number;
  correctas: number;
  total: number;
  porcentaje: number;
  dominios: { dominio: string; correctas: number; total: number; porcentaje: number }[];
};
export type ErrorLab = Registro & { curso: string; lab: string; descripcion: string; correccion: string; descartado?: boolean };

export type Doc = {
  version: number;
  /** Lecciones y labs completados. */
  lecciones: Record<string, Completado>;
  /** Última apertura de cada lección o lab; `actualizado` es la fecha de apertura. */
  aperturas: Record<string, Marca>;
  checklists: Record<string, Casilla>;
  roadmap: Record<string, Casilla>;
  notas: Record<string, Nota>;
  /** Estado FSRS por id de tarjeta (ver repaso.ts). */
  tarjetas: Record<string, Marca & Record<string, unknown>>;
  miniquizzes: Record<string, Marca>;
  experimentos: Record<string, Marca>;
  ajustes: Record<string, Marca>;
  intentos: Intento[];
  errores: ErrorLab[];
  sesiones: Sesion[];
};

const MAPAS = [
  'lecciones',
  'aperturas',
  'checklists',
  'roadmap',
  'notas',
  'tarjetas',
  'miniquizzes',
  'experimentos',
  'ajustes',
] as const;
const LISTAS = ['intentos', 'errores', 'sesiones'] as const;

export const vacio = (): Doc =>
  ({
    version: VERSION,
    ...Object.fromEntries(MAPAS.map((k) => [k, {}])),
    ...Object.fromEntries(LISTAS.map((k) => [k, []])),
  }) as Doc;

export const ahora = () => new Date().toISOString();

const esObjeto = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

/** Valida un documento externo y completa las claves faltantes. Lanza un error legible si no sirve. */
export function validar(x: unknown): Doc {
  if (!esObjeto(x)) throw new Error('El archivo no contiene un objeto JSON.');
  if (typeof x.version !== 'number') throw new Error('Falta el campo "version".');
  if (x.version > VERSION) {
    throw new Error(`El archivo es de la versión ${x.version} y esta app solo entiende hasta la ${VERSION}. Actualiza la app.`);
  }
  // Sin migraciones todavía: la versión 1 es la primera. Una v2 agregará aquí su paso desde la v1.
  const doc = vacio() as Record<string, unknown>;
  // shortcut: se valida la estructura y las marcas de fusión, no cada campo de cada registro; alcanza para respaldos propios.
  for (const k of MAPAS) {
    const v = x[k] ?? {};
    if (!esObjeto(v)) throw new Error(`"${k}" debe ser un objeto.`);
    for (const [clave, e] of Object.entries(v)) {
      if (!esObjeto(e) || typeof e.actualizado !== 'string') throw new Error(`"${k}.${clave}" no tiene fecha "actualizado".`);
    }
    doc[k] = v;
  }
  for (const k of LISTAS) {
    const v = x[k] ?? [];
    if (!Array.isArray(v)) throw new Error(`"${k}" debe ser una lista.`);
    v.forEach((e, i) => {
      if (!esObjeto(e) || typeof e.id !== 'string' || typeof e.actualizado !== 'string') {
        throw new Error(`"${k}[${i}]" no tiene "id" o "actualizado".`);
      }
    });
    doc[k] = v;
  }
  return doc as Doc;
}

const masNuevo = <T extends Marca>(a: T | undefined, b: T | undefined) =>
  !a ? b : !b ? a : b.actualizado > a.actualizado ? b : a;

/** Combina dos documentos: por clave o por id gana el registro con `actualizado` más reciente. Nada se borra. */
export function combinar(a: Doc, b: Doc): Doc {
  const r = vacio() as Record<string, unknown>;
  for (const k of MAPAS) {
    const x = a[k] as Record<string, Marca>;
    const y = b[k] as Record<string, Marca>;
    const claves = new Set([...Object.keys(x), ...Object.keys(y)]);
    r[k] = Object.fromEntries([...claves].map((c) => [c, masNuevo(x[c], y[c])]));
  }
  for (const k of LISTAS) {
    const porId = new Map<string, Registro>();
    for (const e of [...a[k], ...b[k]] as Registro[]) porId.set(e.id, masNuevo(porId.get(e.id), e)!);
    r[k] = [...porId.values()];
  }
  return r as Doc;
}

/** Borra todo lo de un curso. Un respaldo anterior al reseteo lo restaura al importarlo. */
export function resetearCurso(doc: Doc, curso: string): Doc {
  const prefijo = `${curso}/`;
  const r = { ...doc } as Record<string, unknown>;
  for (const k of MAPAS) {
    r[k] = Object.fromEntries(Object.entries(doc[k]).filter(([c]) => !c.startsWith(prefijo)));
  }
  for (const k of LISTAS) r[k] = (doc[k] as Registro[]).filter((e) => e.curso !== curso);
  return r as Doc;
}

export class AlmacenLleno extends Error {
  constructor() {
    super('El almacenamiento del navegador está lleno. Exporta tus datos desde Ajustes para no perderlos.');
  }
}

type Almacen = Pick<Storage, 'getItem' | 'setItem'>;
const local = (): Almacen | undefined => (typeof localStorage === 'undefined' ? undefined : localStorage);

/** Lee el documento. Si está dañado, guarda una copia aparte y empieza vacío, para no pisar el original. */
export function leer(s = local()): Doc {
  const crudo = s?.getItem(CLAVE);
  if (!crudo) return vacio();
  try {
    return validar(JSON.parse(crudo));
  } catch {
    try {
      s!.setItem(`${CLAVE}:danado:${Date.now()}`, crudo);
    } catch {
      // Sin espacio para la copia: el original sigue intacto hasta la próxima escritura.
    }
    return vacio();
  }
}

/** Lee lo último guardado, aplica el cambio y escribe. Releer evita pisar lo que otra pestaña acaba de guardar. */
export function actualizar(cambio: (doc: Doc) => Doc | void, s = local()): Doc {
  if (!s) throw new Error('No hay almacenamiento disponible.');
  const actual = leer(s);
  const doc = cambio(actual) ?? actual;
  try {
    s.setItem(CLAVE, JSON.stringify(doc));
  } catch (e) {
    const error = e instanceof DOMException && e.name === 'QuotaExceededError' ? new AlmacenLleno() : (e as Error);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVENTO_ERROR, { detail: error.message }));
    throw error;
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(EVENTO));
  return doc;
}

// Instantánea cacheada para useSyncExternalStore: el mismo texto devuelve el mismo objeto.
let ultimoCrudo: string | null | undefined;
let ultimoDoc = vacio();
const VACIO = vacio();

export function instantanea(): Doc {
  const crudo = localStorage.getItem(CLAVE);
  if (crudo !== ultimoCrudo) {
    ultimoCrudo = crudo;
    ultimoDoc = leer();
  }
  return ultimoDoc;
}

export const instantaneaServidor = () => VACIO;

export function suscribir(alCambiar: () => void) {
  window.addEventListener(EVENTO, alCambiar);
  window.addEventListener('storage', alCambiar);
  return () => {
    window.removeEventListener(EVENTO, alCambiar);
    window.removeEventListener('storage', alCambiar);
  };
}

/** Hash corto y estable de un texto (FNV-1a), para identificar ítems de checklist y tareas del roadmap. */
export function hash(texto: string) {
  let h = 0x811c9dc5;
  for (const c of texto.trim().replace(/\s+/g, ' ')) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
