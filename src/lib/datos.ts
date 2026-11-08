const TITULO = /^#{2,4}\s+(datos\s+)?para\s+memorizar\s*$/i;

const celdas = (linea: string) =>
  linea
    .trim()
    .replace(/^\||\|$/g, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.replaceAll('\\|', '|').replaceAll('**', '').trim());

/** Filas de las tablas bajo un título "Para memorizar" o "Datos para memorizar": primera columna al frente. */
export function filasParaMemorizar(markdown: string) {
  const filas: { frente: string; reverso: string }[] = [];
  let dentro = false;
  let enTabla = 0;
  for (const linea of markdown.split(/\r?\n/)) {
    if (/^#{1,6}\s/.test(linea)) {
      dentro = TITULO.test(linea.trim());
      enTabla = 0;
      continue;
    }
    if (!dentro) continue;
    if (!linea.trim().startsWith('|')) {
      enTabla = 0;
      continue;
    }
    enTabla++;
    if (enTabla <= 2) continue; // Encabezado y separador.
    const [frente, ...resto] = celdas(linea);
    if (frente && resto.some(Boolean)) filas.push({ frente, reverso: resto.filter(Boolean).join(' · ') });
  }
  return filas;
}
