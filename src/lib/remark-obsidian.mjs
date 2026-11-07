import { readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ENLACE = /(!?)\[\[([^\]\n]+)\]\]/g;

const posix = (ruta) => ruta.replaceAll('\\', '/');

/** Ruta del sitio de un archivo del vault, o null si no tiene página propia. */
export function rutaDeArchivo(relativa) {
  const m = relativa.match(/^cursos\/([^/]+)\/(?:modulos\/([^/]+)\/)?([^/]+)\.md$/);
  if (!m) return null;
  const [, curso, modulo, nombre] = m;
  if (!modulo) {
    if (nombre === 'curso') return `cursos/${curso}/`;
    if (nombre === 'recursos') return `cursos/${curso}/#recursos`;
    return null;
  }
  if (nombre === 'modulo') return null;
  return nombre.startsWith('lab-') ? `cursos/${curso}/labs/${nombre}/` : `cursos/${curso}/${modulo}/${nombre}/`;
}

/** Resuelve como Obsidian: ruta parcial, o nombre; ante empate gana el mismo curso. */
export function resolver(destino, archivos, cursoActual) {
  const buscado = destino.toLowerCase();
  const coincide = (a) => {
    const ruta = a.toLowerCase();
    return ruta === buscado || ruta.endsWith(`/${buscado}`);
  };
  const candidatos = archivos.filter(coincide);
  if (candidatos.length <= 1) return candidatos[0] ?? null;
  const delCurso = candidatos.filter((a) => a.startsWith(`cursos/${cursoActual}/`));
  if (delCurso.length === 1) return delCurso[0];
  throw new Error(`El enlace [[${destino}]] es ambiguo: ${candidatos.join(', ')}`);
}

function listar(dir, raiz = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name.startsWith('.')) return [];
    const ruta = join(dir, e.name);
    return e.isDirectory() ? listar(ruta, raiz) : [posix(relative(raiz, ruta))];
  });
}

const sinMd = (ruta) => ruta.replace(/\.md$/, '');

function nodoDeEnlace(contenido, { archivos, base, raizAbs, archivo }) {
  const [destinoCompleto, alias] = contenido.split('|').map((s) => s.trim());
  const [destino, ancla] = destinoCompleto.split('#');
  const relActual = posix(relative(raizAbs, archivo));
  const cursoActual = relActual.split('/')[1];
  const encontrado = resolver(destino, archivos.map(sinMd), cursoActual);
  const original = encontrado && archivos.find((a) => sinMd(a) === encontrado);
  const ruta = original && rutaDeArchivo(original);
  if (!ruta) throw new Error(`Enlace roto [[${contenido}]] en ${relActual}`);
  // shortcut: ancla aproximada (minúsculas y guiones); una con símbolos raros puede no coincidir.
  const sufijo = ancla ? `#${ancla.trim().toLowerCase().replaceAll(/\s+/g, '-')}` : '';
  const texto = alias ?? (ancla ? `${destino} > ${ancla}` : destino.split('/').pop());
  return { type: 'link', url: `${base}/${ruta}${sufijo}`, children: [{ type: 'text', value: texto }] };
}

function nodoDeImagen(contenido, { archivos, raizAbs, archivo }) {
  const [destino, alt] = contenido.split('|').map((s) => s.trim());
  const relActual = posix(relative(raizAbs, archivo));
  const encontrado = resolver(destino, archivos, relActual.split('/')[1]);
  if (!encontrado) throw new Error(`Imagen rota ![[${contenido}]] en ${relActual}`);
  const url = posix(relative(dirname(archivo), join(raizAbs, encontrado)));
  return { type: 'image', url: url.startsWith('.') ? url : `./${url}`, alt: alt ?? '' };
}

function expandir(texto, ctx) {
  const salida = [];
  let ultimo = 0;
  for (const m of texto.matchAll(ENLACE)) {
    if (m.index > ultimo) salida.push({ type: 'text', value: texto.slice(ultimo, m.index) });
    salida.push(m[1] ? nodoDeImagen(m[2], ctx) : nodoDeEnlace(m[2], ctx));
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) salida.push({ type: 'text', value: texto.slice(ultimo) });
  return salida;
}

function recorrer(nodo, ctx) {
  if (!nodo.children) return;
  nodo.children = nodo.children.flatMap((hijo) => {
    if (hijo.type === 'text' && hijo.value.includes('[[')) return expandir(hijo.value, ctx);
    recorrer(hijo, ctx);
    return [hijo];
  });
}

/** Convierte [[nota]], [[nota|texto]] y ![[imagen]] en enlaces e imágenes. Un destino inexistente falla el build. */
export function remarkObsidian({ base, raiz }) {
  const raizAbs = resolve(raiz);
  return (arbol, file) => {
    // Se relee por archivo para que el servidor de desarrollo vea notas nuevas sin reiniciar.
    recorrer(arbol, {
      base,
      raizAbs,
      archivo: file.path,
      get archivos() {
        return listar(raizAbs);
      },
    });
  };
}
