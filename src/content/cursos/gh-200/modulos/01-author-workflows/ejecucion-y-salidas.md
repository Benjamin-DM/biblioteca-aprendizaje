---
titulo: Ejecución y salidas
orden: 3
duracion_min: 40
tags: [artifacts, cache, outputs, summary]
dificultad: 2
tipo_contenido: practica
conceptos_clave:
  - Cache contra artifacts
  - GITHUB_ENV, GITHUB_OUTPUT y GITHUB_STEP_SUMMARY
  - Outputs entre jobs
  - Badges y protecciones de environment
preguntas_elaboracion:
  - ¿Por qué un dato de un step no llega a otro job sin declararlo en outputs?
  - ¿Cuándo usarías un artifact en lugar de cache?
---

## Cache o artifact

| Aspecto | Cache | Artifact |
| --- | --- | --- |
| Para qué | Acelerar con dependencias reutilizables | Conservar un resultado de la ejecución |
| Alcance | Entre workflow runs | Una ejecución; se descarga después |
| Herramienta | `actions/cache` o el cache de `setup-*` | `actions/upload-artifact` y `actions/download-artifact` |
| Expiración | Sin acceso por más de 7 días | `retention-days` o política del repo |

Cada repositorio tiene 10 GB de cache por defecto. Si se excede, GitHub guarda el nuevo y expulsa otros hasta volver al límite.

## Pasar datos

![[flujo-de-datos.svg|Un step escribe en GITHUB_OUTPUT, el job lo expone en outputs y otro job lo lee con needs]]

```yaml
jobs:
  a:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.calc.outputs.version }}
    steps:
      - id: calc
        run: echo "version=1.2.3" >> "$GITHUB_OUTPUT"
  b:
    needs: a
    runs-on: ubuntu-latest
    steps:
      - run: echo "Versión $VERSION"
        env:
          VERSION: ${{ needs.a.outputs.version }}
```

| Archivo | Efecto |
| --- | --- |
| `GITHUB_ENV` | Variable de entorno para los steps siguientes del job |
| `GITHUB_OUTPUT` | Output del step actual |
| `GITHUB_PATH` | Agrega una ruta al `PATH` de los steps siguientes |
| `GITHUB_STEP_SUMMARY` | Markdown en el resumen de la ejecución |

## Job summary

```bash
echo "### Tests: 42 correctos" >> "$GITHUB_STEP_SUMMARY"
```

## Retención por REST API

La retención se ajusta en la configuración o por REST API, a nivel de repo y de organización. También se pueden borrar artifacts y logs de una ejecución por API.

## Badges y environments

El badge de estado usa esta URL:

```text
https://github.com/OWNER/REPO/actions/workflows/ARCHIVO.yml/badge.svg
```

Un `environment` puede exigir aprobadores (hasta 6; alcanza con que uno apruebe) y un wait timer de 1 a 43 200 minutos. Sus secretos no están disponibles hasta la aprobación. En planes Free, Pro y Team, ambas protecciones solo están disponibles en repos públicos.

## Para memorizar

| Dato | Valor |
| --- | --- |
| Expiración de cache sin acceso | Más de 7 días |
| Cache por repo, por defecto | 10 GB |
| Aprobadores requeridos | Hasta 6 |
| Wait timer | Hasta 43 200 min (30 días) |

## Practica

- [ ] Hacer [[lab-outputs-cache-summary]]
