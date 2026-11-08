import { describe, expect, it } from 'vitest';
import { rehypeAccesible } from '../src/lib/rehype-accesible.mjs';

const casilla = () => ({ type: 'element', tagName: 'input', properties: { type: 'checkbox' }, children: [] });
const enlace = { type: 'element', tagName: 'a', properties: {}, children: [{ type: 'text', value: 'el lab' }] };

describe('rehypeAccesible', () => {
  it('nombra la casilla con el texto del ítem, incluyendo enlaces', () => {
    const input = casilla();
    const li = { type: 'element', tagName: 'li', children: [input, { type: 'text', value: ' Hacer ' }, enlace] };
    rehypeAccesible()({ type: 'root', children: [li] });
    expect(input.properties).toMatchObject({ ariaLabel: 'Hacer el lab' });
  });
  it('encuentra la casilla en un ítem con párrafo', () => {
    const input = casilla();
    const p = { type: 'element', tagName: 'p', children: [input, { type: 'text', value: ' Tarea' }] };
    rehypeAccesible()({ type: 'root', children: [{ type: 'element', tagName: 'li', children: [p] }] });
    expect(input.properties).toMatchObject({ ariaLabel: 'Tarea' });
  });
  it('no toca un ítem sin casilla', () => {
    const li = { type: 'element', tagName: 'li', children: [{ type: 'text', value: 'Normal' }] };
    expect(() => rehypeAccesible()({ type: 'root', children: [li] })).not.toThrow();
  });
  it('hace enfocables las tablas', () => {
    const tabla: any = { type: 'element', tagName: 'table', children: [] };
    rehypeAccesible()({ type: 'root', children: [tabla] });
    expect(tabla.properties.tabIndex).toBe(0);
  });
});
