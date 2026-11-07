---
titulo: Triggers y eventos
orden: 1
duracion_min: 35
tags: [triggers, eventos]
dificultad: 1
tipo_contenido: conceptos
conceptos_clave:
  - Eventos de repositorio, programados, manuales y por webhook
  - Inputs de workflow_dispatch
  - workflow_call con inputs y secrets
  - Eventos que crea GITHUB_TOKEN
preguntas_elaboracion:
  - ¿Por qué los eventos creados con GITHUB_TOKEN no suelen iniciar otro workflow?
  - ¿Cómo se conecta workflow_dispatch con workflow_call en un pipeline reutilizable?
---

## Tipos de evento

La clave `on` decide cuándo corre un workflow.

| Tipo | Evento | Dato clave |
| --- | --- | --- |
| Repositorio | `push`, `pull_request` | Admiten filtros `branches`, `tags` y `paths` |
| Programado | `schedule` | Cron POSIX, en UTC salvo `timezone`; corre sobre el último commit de la rama por defecto |
| Manual | `workflow_dispatch` | Inputs tipados; el archivo debe existir en la rama por defecto |
| Webhook | `repository_dispatch` | Se dispara por REST; solo si el archivo está en la rama por defecto |
| Reutilización | `workflow_call` | Otro workflow lo invoca |

No se puede usar `branches` y `branches-ignore` para el mismo evento. Para combinar, usa `branches` con patrones `!`.

## Inputs manuales

`workflow_dispatch` acepta los tipos `boolean`, `choice`, `number`, `environment` y `string`.

```yaml
on:
  workflow_dispatch:
    inputs:
      ambiente:
        type: choice
        options: [dev, prod]
        required: true
        default: dev
      forzar:
        type: boolean
        default: false

jobs:
  mostrar:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Ambiente $AMBIENTE"
        env:
          AMBIENTE: ${{ inputs.ambiente }}
```

El contexto `inputs` conserva los booleanos. En `github.event.inputs` los mismos valores llegan como texto, y eso cambia cómo se evalúa un `if`.

## Pasar datos a un reusable workflow

```yaml
jobs:
  desplegar:
    uses: mi-org/plantillas/.github/workflows/deploy.yml@v1
    with:
      ambiente: ${{ inputs.ambiente }}
    secrets:
      token: ${{ secrets.DEPLOY_TOKEN }}
```

Más detalle en [[plantillas-de-workflow]].

## Eventos y GITHUB_TOKEN

Los eventos causados con `GITHUB_TOKEN` no crean workflow runs, para evitar bucles. Las excepciones son `workflow_dispatch` y `repository_dispatch`, que siempre los crean. Además, un PR creado o actualizado con ese token genera runs de `pull_request` que esperan aprobación.

## Para memorizar

| Dato | Valor |
| --- | --- |
| Zona horaria por defecto de `schedule` | UTC |
| Inactividad que desactiva `schedule` en un repo público | 60 días |
| Máximo de inputs en `workflow_dispatch` | 25 |

## Practica

- [ ] Hacer [[lab-triggers-inputs]]
