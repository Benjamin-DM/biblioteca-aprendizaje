---
titulo: Reusable workflow versionado
orden: 2
duracion_min: 45
objetivo: Publicar un reusable workflow con inputs, secrets y outputs, y consumirlo desde otro repo.
criterio_hecho:
  - Otro repo lo invoca por un tag y lee su output.
  - Un cambio en una rama no afecta al consumidor fijado por el tag.
  - Puedes explicar por qué esto no sería igual con un starter workflow.
---

1. En un repo, crea un workflow con `on: workflow_call`, un input, un secreto y un output.
2. Crea un tag `v1`.
3. En otro repo, invócalo con `uses: OWNER/REPO/.github/workflows/x.yml@v1`.
4. Lee el output con `needs` y muéstralo en el job summary.
5. Cambia el reusable en otra rama y comprueba que el consumidor no cambia.
6. Si el repo es privado, revisa qué configuración de acceso hace falta.
