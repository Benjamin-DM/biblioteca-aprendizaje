---
titulo: Workflow manual con inputs
orden: 1
duracion_min: 30
objetivo: Disparar un workflow a mano con inputs tipados y comprobar cómo llegan a cada contexto.
criterio_hecho:
  - El workflow corre desde la pestaña Actions y desde `gh workflow run`.
  - Un job se salta según el valor del input boolean.
  - Puedes explicar la diferencia entre `inputs` y `github.event.inputs` con la salida del log.
---

1. Crea un repo de prueba y agrega `.github/workflows/manual.yml` en la rama por defecto.
2. Define `workflow_dispatch` con un `choice`, un `boolean` y un `string`.
3. Imprime cada input desde `inputs` y desde `github.event.inputs`, pasándolos por `env`.
4. Agrega un job con `if: inputs.forzar` y dispara con ambos valores.
5. Dispara desde la terminal: `gh workflow run manual.yml -f ambiente=dev -f forzar=true`.
6. Agrega un `schedule` y anota a qué hora en UTC correría.
