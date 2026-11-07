---
titulo: Outputs, cache y job summary
orden: 3
duracion_min: 40
objetivo: Pasar datos entre jobs, acelerar con cache y publicar un resumen legible.
criterio_hecho:
  - Un job lee un output calculado por otro.
  - El segundo run muestra un cache hit y tarda menos.
  - El run muestra un summary en Markdown y un artifact descargable con retención de 3 días.
---

1. Calcula una versión en un step y pásala a otro job con `outputs` y `needs`.
2. Usa `setup-node` con `cache: npm` en un proyecto pequeño. Compara el tiempo de dos runs.
3. Sube un archivo con `actions/upload-artifact` y `retention-days: 3`.
4. Descárgalo en otro job, y después con `gh run download`.
5. Escribe una tabla Markdown en `GITHUB_STEP_SUMMARY`.
6. Agrega el badge del workflow al README.
