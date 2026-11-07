---
titulo: JavaScript action
orden: 2
duracion_min: 50
objetivo: Crear, empaquetar y versionar una JavaScript action.
criterio_hecho:
  - La action corre en Linux y en Windows.
  - Falla con un `::error::` claro cuando falta un input.
  - El código empaquetado está en el repo y tiene los tags `v1.0.0` y `v1`.
---

1. Crea `action.yml` con un input y un output, y `runs.using` con una versión de Node soportada.
2. Implementa la lógica con `@actions/core`.
3. Empaqueta en `dist/index.js` con `@vercel/ncc` y haz commit de `dist/`.
4. Pruébala con una matrix de sistemas operativos.
5. Crea los tags `v1.0.0` y `v1`.
6. Revisa los requisitos de Marketplace en [[distribuir-actions]] y anota qué te falta.
