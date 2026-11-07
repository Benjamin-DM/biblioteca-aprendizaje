---
titulo: Interpretar ejecuciones
orden: 1
duracion_min: 30
tags: [troubleshooting, logs, debug]
dificultad: 2
tipo_contenido: practica
conceptos_clave:
  - Leer trigger y efecto en el historial
  - Debug logging
  - Re-run de jobs fallidos o específicos
  - Expandir anchors y matrix al leer un workflow
preguntas_elaboracion:
  - ¿Por qué un re-run parcial puede dar otro resultado que el run original?
  - ¿Cómo distinguirías un fallo de código de uno causado por el runner?
---

## Método

1. **Qué lo disparó**: el evento, la rama y el commit aparecen en el run.
2. **Qué job falló**: el nombre de un job de matrix incluye sus ejes, como `build (ubuntu-latest, 22)`.
3. **Qué step falló**: abre el log y busca el primer error, no el último.
4. **Qué cambió**: compara con el último run correcto.

## Debug logging

Dos opciones:

- Marcar **Enable debug logging** al hacer re-run, o usar `gh run rerun RUN_ID --debug`.
- Definir `ACTIONS_STEP_DEBUG` o `ACTIONS_RUNNER_DEBUG` en `true`, como secreto o variable.

## Re-run

Puedes volver a correr todo el workflow, solo los jobs fallidos, o un job específico, hasta 30 días después del run inicial.

Al repetir jobs fallidos o uno específico, también se repiten los que dependen de ellos. Los demás conservan sus outputs del intento anterior.

```bash
gh run rerun RUN_ID --failed
gh run rerun RUN_ID --job JOB_ID
```

## Leer configuración expandida

Al analizar un workflow, sustituye mentalmente cada alias `*x` por el contenido de su anchor `&x`. Para una matrix, escribe las combinaciones: producto de los ejes, menos `exclude`, más `include`.

## Para memorizar

| Dato | Valor |
| --- | --- |
| Plazo para re-run | 30 días |
| Máximo de re-runs por workflow run | 50 |

## Practica

- [ ] Hacer [[lab-diagnosticar-fallo]]
