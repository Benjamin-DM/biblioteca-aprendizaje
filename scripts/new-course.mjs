import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const PLANTILLA = join(dirname(fileURLToPath(import.meta.url)), 'plantilla-curso');

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n);
    return statSync(ruta).isDirectory() ? archivos(ruta) : [ruta];
  });
}

/** Crea src/content/cursos/<id> desde la plantilla, sin pisar nada existente. */
export function crearCurso({ raiz, id, titulo, area }) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id ?? '')) {
    throw new Error(`Id inválido "${id}": usa minúsculas, números y guiones.`);
  }
  if (!titulo) throw new Error('Falta --titulo.');
  const dirAreas = join(raiz, 'src/content/areas');
  const areas = readdirSync(dirAreas).map((a) => a.replace(/\.md$/, ''));
  if (!areas.includes(area)) throw new Error(`Área "${area}" no existe. Válidas: ${areas.join(', ')}`);

  const destino = join(raiz, 'src/content/cursos', id);
  if (existsSync(destino)) throw new Error(`Ya existe ${destino}.`);

  cpSync(PLANTILLA, destino, { recursive: true });
  for (const ruta of archivos(destino)) {
    const texto = readFileSync(ruta, 'utf8');
    // JSON.stringify deja un título con comillas o dos puntos como YAML válido.
    writeFileSync(ruta, texto.replaceAll('{{titulo}}', JSON.stringify(titulo)).replaceAll('{{area}}', area));
  }
  return destino;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { values, positionals } = parseArgs({
      allowPositionals: true,
      options: { titulo: { type: 'string' }, area: { type: 'string' } },
    });
    const destino = crearCurso({ raiz: process.cwd(), id: positionals[0], titulo: values.titulo, area: values.area });
    console.log(`Curso creado en ${destino}`);
  } catch (e) {
    console.error(e.message);
    console.error('Uso: npm run new:course -- <id> --titulo "Mi curso" --area <area>');
    process.exit(1);
  }
}
