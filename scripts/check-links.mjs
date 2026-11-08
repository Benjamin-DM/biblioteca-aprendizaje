import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

function html(dir) {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? html(ruta) : n.endsWith('.html') ? [ruta] : [];
  });
}

/** Archivo de dist que sirve una URL interna, o null si no existe. */
function destino(dist, base, url) {
  const ruta = decodeURIComponent(url.split(/[?#]/)[0]).slice(base.length);
  const candidatos = ruta.endsWith('/') || ruta === '' ? [join(ruta, 'index.html')] : [ruta, join(ruta, 'index.html')];
  return candidatos.map((c) => join(dist, c)).find((c) => existsSync(c) && statSync(c).isFile()) ?? null;
}

/** Enlaces internos rotos (href y src bajo la base). Los externos no se revisan: dependen de la red. */
export function enlacesRotos(dist, base) {
  const rotos = [];
  for (const archivo of html(dist)) {
    const texto = readFileSync(archivo, 'utf8');
    for (const [, url] of texto.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (url.startsWith(base) && !destino(dist, base, url)) rotos.push(`${archivo.slice(dist.length + 1)} -> ${url}`);
    }
  }
  return rotos;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rotos = enlacesRotos('dist', '/biblioteca-aprendizaje/');
  for (const r of rotos) console.error(`Enlace roto: ${r}`);
  console.log(rotos.length === 0 ? 'Enlaces internos: OK' : `${rotos.length} enlaces rotos`);
  process.exit(rotos.length === 0 ? 0 : 1);
}
