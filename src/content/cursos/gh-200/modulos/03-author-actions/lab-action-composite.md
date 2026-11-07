---
titulo: Composite action
orden: 1
duracion_min: 35
objetivo: Encapsular pasos repetidos en una composite action con inputs y outputs.
criterio_hecho:
  - Un workflow la usa desde `./.github/actions/`.
  - Otro repo la usa por un tag.
  - El output llega al step que la llamó.
---

1. Identifica 3 steps que repitas (por ejemplo, instalar y testear).
2. Muévelos a `.github/actions/preparar/action.yml`, con un input de versión.
3. Declara `shell` en cada `run` y expón un output.
4. Úsala en un workflow local.
5. Muévela a un repo propio, crea el tag `v1` y consúmela desde otro repo.
