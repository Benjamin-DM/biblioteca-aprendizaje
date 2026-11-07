---
titulo: Estructura del workflow
orden: 2
duracion_min: 50
tags: [jobs, matrix, contextos, expresiones]
dificultad: 2
tipo_contenido: conceptos
conceptos_clave:
  - Dependencias con needs y condiciones con if
  - Matrix con include, exclude, fail-fast y max-parallel
  - Service containers
  - YAML anchors y aliases
  - Contextos y expresiones
preguntas_elaboracion:
  - ¿Por qué include se procesa después de exclude, y qué permite eso?
  - ¿Cómo se conecta el tamaño de una matrix con el costo del workflow?
---

## Jobs, steps y condiciones

Los jobs corren en paralelo salvo que declaren `needs`. Un `if` decide si un job o step corre.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  publicar:
    needs: test
    if: github.ref == 'refs/heads/main' && success()
    runs-on: ubuntu-latest
    steps:
      - run: echo "publicando"
```

## Matrix

```yaml
strategy:
  fail-fast: false
  max-parallel: 2
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [20, 22]
    exclude:
      - os: windows-latest
        node: 20
```

- Una matrix genera como máximo 256 jobs por workflow run.
- `include` se procesa después de `exclude`, así que puede devolver una combinación excluida.
- `*-latest` cambia de imagen con el tiempo: una migración de runner puede romper un job sin que cambie tu código.

## Service containers

`services` levanta dependencias como una base de datos. Requiere un runner Linux.

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_PASSWORD: prueba
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready"
      --health-interval 10s
```

Si el job corre en el runner, se accede por `localhost` y el puerto mapeado. Si corre en un `container`, se accede por el nombre del servicio.

## YAML anchors

Un anchor (`&`) marca contenido, y un alias (`*`) lo repite.

```yaml
jobs:
  uno:
    env: &comunes
      NODE_ENV: production
    runs-on: ubuntu-latest
    steps:
      - run: echo uno
  dos:
    env: *comunes
    runs-on: ubuntu-latest
    steps:
      - run: echo dos
```

La guía del examen también menciona merge (`<<`), pero la referencia de docs.github.com solo documenta `&` y `*`. Compruébalo en [[lab-matrix-servicios]] antes de apoyarte en `<<`.

## Contextos y expresiones

`${{ }}` evalúa una expresión con contextos como `github`, `env`, `vars`, `secrets`, `inputs`, `matrix`, `needs`, `strategy`, `job`, `steps` y `runner`.

No todos los contextos están disponibles en todas partes. En el `if` de un job no existe `env`, y `secrets` no se puede usar directamente en un `if`.

## Workflow commands

Un step se comunica con el runner por `stdout`:

```bash
echo "::notice::Build terminado"
echo "::error file=app.js,line=3::Falta un punto y coma"
echo "::add-mask::$VALOR_SENSIBLE"
```

## Herramientas

La extensión GitHub Actions para VS Code valida el YAML y completa metadata mientras escribes. `actionlint` hace una revisión parecida desde la terminal.

## Para memorizar

| Dato | Valor |
| --- | --- |
| Máximo de jobs de una matrix | 256 por workflow run |
| `fail-fast` por defecto | `true` |
| `timeout-minutes` por defecto | 360 |

## Practica

- [ ] Hacer [[lab-matrix-servicios]]
