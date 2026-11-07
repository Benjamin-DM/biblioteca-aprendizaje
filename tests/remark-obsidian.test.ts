import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { remarkObsidian, resolver, rutaDeArchivo } from '../src/lib/remark-obsidian.mjs';

function vault() {
  const raiz = mkdtempSync(join(tmpdir(), 'vault-'));
  const dir = join(raiz, 'cursos/c1/modulos/m1');
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(raiz, '_adjuntos'));
  for (const f of ['modulo.md', 'triggers.md', 'lab-matrix.md']) writeFileSync(join(dir, f), '');
  writeFileSync(join(raiz, '_adjuntos/fig.svg'), '');
  return { raiz, archivo: join(dir, 'triggers.md') };
}

function transformar(texto: string, { raiz, archivo } = vault()) {
  const arbol: any = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: texto }] }] };
  remarkObsidian({ base: '/b', raiz })(arbol, { path: archivo });
  return arbol.children[0].children;
}

describe('rutaDeArchivo', () => {
  it('mapea cada tipo de archivo a su página', () => {
    expect(rutaDeArchivo('cursos/c/curso.md')).toBe('cursos/c/');
    expect(rutaDeArchivo('cursos/c/recursos.md')).toBe('cursos/c/#recursos');
    expect(rutaDeArchivo('cursos/c/modulos/m/l.md')).toBe('cursos/c/m/l/');
    expect(rutaDeArchivo('cursos/c/modulos/m/lab-x.md')).toBe('cursos/c/labs/lab-x/');
    expect(rutaDeArchivo('cursos/c/modulos/m/modulo.md')).toBeNull();
    expect(rutaDeArchivo('areas/a.md')).toBeNull();
  });
});

describe('resolver', () => {
  const archivos = ['cursos/a/modulos/m/intro', 'cursos/b/modulos/m/intro'];
  it('ante nombres repetidos prefiere el curso actual', () => {
    expect(resolver('intro', archivos, 'b')).toBe('cursos/b/modulos/m/intro');
  });
  it('falla si el empate no se puede resolver', () => {
    expect(() => resolver('intro', archivos, 'c')).toThrow(/ambiguo/);
  });
  it('no confunde un sufijo parcial del nombre', () => {
    expect(resolver('tro', archivos, 'a')).toBeNull();
  });
  it('acepta una ruta parcial', () => {
    expect(resolver('b/modulos/m/intro', archivos, 'a')).toBe('cursos/b/modulos/m/intro');
  });
});

describe('remarkObsidian', () => {
  it('convierte enlace con alias y deja el texto alrededor', () => {
    const [a, b, c] = transformar('ver [[triggers|los triggers]] ahora');
    expect(a.value).toBe('ver ');
    expect(b).toMatchObject({ type: 'link', url: '/b/cursos/c1/m1/triggers/' });
    expect(b.children[0].value).toBe('los triggers');
    expect(c.value).toBe(' ahora');
  });
  it('enlaza labs a su ruta y conserva el ancla', () => {
    const [n] = transformar('[[lab-matrix#Paso uno]]');
    expect(n.url).toBe('/b/cursos/c1/labs/lab-matrix/#paso-uno');
  });
  it('convierte imágenes en ruta relativa', () => {
    const [n] = transformar('![[fig.svg|Figura]]');
    expect(n).toMatchObject({ type: 'image', url: '../../../../_adjuntos/fig.svg', alt: 'Figura' });
  });
  it('falla el build con un enlace roto e indica el archivo', () => {
    expect(() => transformar('[[no-existe]]')).toThrow(/Enlace roto \[\[no-existe\]\] en cursos\/c1\/modulos\/m1\/triggers\.md/);
  });
  it('falla con una imagen rota', () => {
    expect(() => transformar('![[no.png]]')).toThrow(/Imagen rota/);
  });
  it('no enlaza a archivos sin página', () => {
    expect(() => transformar('[[modulo]]')).toThrow(/Enlace roto/);
  });
});
