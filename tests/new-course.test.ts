import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { crearCurso } from '../scripts/new-course.mjs';

let raiz: string;

beforeEach(() => {
  raiz = mkdtempSync(join(tmpdir(), 'curso-'));
  mkdirSync(join(raiz, 'src/content/areas'), { recursive: true });
  writeFileSync(join(raiz, 'src/content/areas/infra.md'), '');
});

describe('crearCurso', () => {
  it('crea la estructura y reemplaza los datos', () => {
    const destino = crearCurso({ raiz, id: 'k8s', titulo: 'Kubernetes: lo básico', area: 'infra' });
    const curso = readFileSync(join(destino, 'curso.md'), 'utf8');
    expect(curso).toContain('titulo: "Kubernetes: lo básico"');
    expect(curso).toContain('area: infra');
    expect(existsSync(join(destino, 'modulos/01-primer-modulo/01-primera-leccion.quiz.yaml'))).toBe(true);
    expect(existsSync(join(destino, 'roadmap.yaml'))).toBe(true);
  });
  it('no pisa un curso existente', () => {
    crearCurso({ raiz, id: 'k8s', titulo: 'A', area: 'infra' });
    expect(() => crearCurso({ raiz, id: 'k8s', titulo: 'B', area: 'infra' })).toThrow(/Ya existe/);
    expect(readFileSync(join(raiz, 'src/content/cursos/k8s/curso.md'), 'utf8')).toContain('"A"');
  });
  it('rechaza un área inexistente y lista las válidas', () => {
    expect(() => crearCurso({ raiz, id: 'k8s', titulo: 'A', area: 'nada' })).toThrow(/Válidas: infra/);
  });
  it('rechaza ids inválidos y título vacío', () => {
    expect(() => crearCurso({ raiz, id: 'Mi Curso', titulo: 'A', area: 'infra' })).toThrow(/Id inválido/);
    expect(() => crearCurso({ raiz, id: '../fuera', titulo: 'A', area: 'infra' })).toThrow(/Id inválido/);
    expect(() => crearCurso({ raiz, id: 'k8s', titulo: '', area: 'infra' })).toThrow(/titulo/);
  });
});
