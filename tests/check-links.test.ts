import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { enlacesRotos } from '../scripts/check-links.mjs';

describe('enlacesRotos', () => {
  it('acepta páginas, archivos y anclas existentes; reporta el resto', () => {
    const dist = mkdtempSync(join(tmpdir(), 'dist-'));
    mkdirSync(join(dist, 'cursos/a'), { recursive: true });
    mkdirSync(join(dist, '_astro'));
    writeFileSync(join(dist, 'cursos/a/index.html'), '');
    writeFileSync(join(dist, '_astro/x.css'), '');
    writeFileSync(
      join(dist, 'index.html'),
      `<a href="/b/cursos/a/">ok</a><a href="/b/cursos/a/#x">ancla</a><link href="/b/_astro/x.css">
       <a href="/b/cursos/nada/">roto</a><img src="/b/falta.png"><a href="https://externo.com/x">ext</a><a href="#local">local</a>`,
    );
    expect(enlacesRotos(dist, '/b/')).toEqual(['index.html -> /b/cursos/nada/', 'index.html -> /b/falta.png']);
  });
});
