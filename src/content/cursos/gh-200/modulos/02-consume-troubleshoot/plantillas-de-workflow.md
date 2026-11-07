---
titulo: Plantillas y reusable workflows
orden: 3
duracion_min: 35
tags: [reusable-workflows, templates]
dificultad: 2
tipo_contenido: conceptos
conceptos_clave:
  - Starter workflow contra reusable workflow contra composite action
  - Plantillas en el repo .github
  - Disponibilidad según visibilidad
  - Deshabilitar contra borrar un workflow
preguntas_elaboracion:
  - ¿Por qué un arreglo en un reusable workflow llega a todos sus consumidores, y en un starter workflow no?
  - ¿Cuándo elegirías una composite action en lugar de un reusable workflow?
---

## Tres formas de reutilizar

| Aspecto | Starter workflow | Reusable workflow | Composite action |
| --- | --- | --- | --- |
| Qué es | Plantilla que se copia | Workflow central invocado | Pasos encapsulados |
| Después de crearlo | Independiente del original | Sigue ligado a la versión referenciada | Sigue ligado a la versión referenciada |
| Se usa en | Un archivo nuevo | Un job, con `uses` | Un step, con `uses` |
| Declara jobs | Sí | Sí | No, solo steps |

## Reusable workflows

```yaml
# El que se reutiliza
on:
  workflow_call:
    inputs:
      ambiente:
        type: string
        required: true
    secrets:
      token:
        required: true
    outputs:
      url:
        value: ${{ jobs.deploy.outputs.url }}
```

El consumidor pasa `with` y `secrets`, o `secrets: inherit`.

## Plantillas de organización

Van en el repo `.github` de la organización, en `workflow-templates/`, con un `.yml` y un `.properties.json` por plantilla.

| Visibilidad del repo `.github` | Disponibles para |
| --- | --- |
| Público | Todos los tipos de repo |
| Interno | Repos internos y privados |
| Privado | Solo repos privados |

Con un repo `.github` privado o interno, hay que dar acceso de lectura a quienes usen las plantillas.

## Deshabilitar o borrar

Deshabilitar conserva el archivo y evita que corra. Borrar lo saca del repo. Para pausar un workflow, deshabilita:

```bash
gh workflow disable ci.yml
```

## Para memorizar

| Dato | Valor |
| --- | --- |
| Niveles de anidamiento de reusable workflows | Hasta 10 |
| Reusable workflows únicos desde un archivo | Hasta 50, contando anidados |

## Practica

- [ ] Hacer [[lab-workflow-reutilizable]]
