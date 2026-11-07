---
titulo: Diagnosticar un workflow roto
orden: 1
duracion_min: 40
objetivo: Encontrar la causa de fallos reales usando solo el historial, los logs y el debug logging.
criterio_hecho:
  - Identificaste la causa de los 3 fallos sin leer el YAML primero.
  - Repetiste solo el job afectado con `gh run rerun`.
  - Anotaste cada error en tu log de errores.
---

1. Crea un workflow que falle de tres formas: un comando inexistente, un output mal escrito (`needs.a.outputs.vesion`) y un secreto que no existe.
2. Mira solo el run: localiza el job, el step y el primer error.
3. Fíjate cuál de los tres no marca error: ¿qué efecto tiene?
4. Repite con `gh run rerun RUN_ID --debug` y compara el log.
5. Corrige uno y repite solo ese job con `--job`.
