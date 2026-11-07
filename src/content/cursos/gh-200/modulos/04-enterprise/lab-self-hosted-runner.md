---
titulo: Self-hosted runner efímero
orden: 1
duracion_min: 60
objetivo: Registrar un self-hosted runner, enrutar jobs con labels y usarlo como efímero.
criterio_hecho:
  - Un job corre en tu runner, seleccionado por un label propio.
  - El runner se desregistra solo tras terminar un job, usando `--ephemeral`.
  - Puedes explicar por qué no debes usarlo en un repo público.
---

Usa un repo **privado** y una máquina virtual o un contenedor descartable.

1. Sigue **Settings > Actions > Runners > New self-hosted runner** y registra el runner con un label propio.
2. Crea un workflow con `runs-on: [self-hosted, mi-label]`.
3. Deja un archivo en el directorio de trabajo y comprueba que sigue ahí en el siguiente job.
4. Registra el runner con `--ephemeral` y repite la prueba.
5. Agrega un script con `ACTIONS_RUNNER_HOOK_JOB_STARTED` que limpie el directorio.
6. Revisa el estado del runner y sus logs en `_diag/`. Al terminar, elimínalo.
