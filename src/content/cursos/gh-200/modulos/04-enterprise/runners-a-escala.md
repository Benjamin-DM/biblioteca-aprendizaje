---
titulo: Runners a escala
orden: 2
duracion_min: 40
tags: [runners, self-hosted, runner-groups]
dificultad: 3
tipo_contenido: datos
conceptos_clave:
  - GitHub-hosted contra self-hosted
  - Runner groups y labels
  - Límites de tiempo
  - Software preinstalado y setup actions
  - Scripts antes y después del job
preguntas_elaboracion:
  - ¿Por qué un self-hosted runner en un repo público es un riesgo de seguridad?
  - ¿Cómo se conecta un runner efímero con el aislamiento entre jobs?
---

## Hospedado o propio

| Aspecto | GitHub-hosted | Self-hosted |
| --- | --- | --- |
| Mantenimiento | GitHub | Tú |
| Entorno | Limpio en cada job | Persiste, salvo que sea efímero |
| Red interna | No por defecto | Sí |
| Tiempo máximo por job | 6 horas | 5 días |
| Tiempo máximo en cola | No aplica aquí | 24 horas |

## Selección y grupos

```yaml
runs-on: [self-hosted, linux, x64]
# o por grupo
runs-on:
  group: produccion
  labels: [linux]
```

Un runner está en un solo grupo a la vez; los nuevos caen en el grupo por defecto. Un grupo restringe qué organizaciones y repos pueden usar sus runners.

## Red

El runner inicia las conexiones hacia GitHub, por HTTPS saliente. Si la organización usa una IP allow list, las IP de los runners deben estar permitidas.

## Software

- Las imágenes hospedadas publican su software en las release notes de `actions/runner-images`.
- Las herramientas cacheadas viven en el toolcache (`RUNNER_TOOL_CACHE`).
- Fija versiones con `setup-*`, en lugar de depender de lo preinstalado.
- Para más velocidad o control, usa una imagen propia en un self-hosted runner.

## Operación

- Revisa el estado de los runners en la configuración de la organización o del repo.
- `ACTIONS_RUNNER_HOOK_JOB_STARTED` y `ACTIONS_RUNNER_HOOK_JOB_COMPLETED` ejecutan scripts al inicio y al final de cada job. No tienen timeout: agrégalo en el script.

## Para memorizar

| Dato | Valor |
| --- | --- |
| Job en GitHub-hosted | 6 horas |
| Job en self-hosted | 5 días |
| Cola en self-hosted | 24 horas |
| Duración total de un workflow run | 35 días |
| Grupos por runner | 1 |

## Practica

- [ ] Hacer [[lab-self-hosted-runner]]
