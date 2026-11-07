# Contrato: formato del contenido

Todo vive en `src/content/`. La carpeta se abre como vault de Obsidian.

## Curso (`cursos/<id>/curso.md`)

```yaml
---
titulo: GitHub Actions — Certificación GH-200
area: automatizacion          # nombre del archivo en areas/
nivel: intermedio             # basico | intermedio | avanzado
tags: [github-actions, ci-cd]
objetivo: Aprobar GH-200
fecha_meta: 2027-03-01        # opcional
horas_semana: 6
estado: por-empezar           # por-empezar | en-curso | completado
fuentes:
  - titulo: Guía oficial
    url: https://learn.microsoft.com/...
---
Descripción del curso en Markdown.
```

## Módulo (`modulos/<id>/modulo.md`)

```yaml
---
titulo: Author and manage workflows
orden: 1
dominio:                      # opcional; con pesos aparece el gráfico del curso
  nombre: Author and manage workflows
  peso_min: 20
  peso_max: 25
---
```

## Lección (`modulos/<id>/<leccion>.md`)

```yaml
---
titulo: Triggers y eventos
orden: 1
duracion_min: 30
tags: [triggers]
dificultad: 2                 # opcional: 1 | 2 | 3
tipo_contenido: conceptos     # opcional: conceptos | datos | practica
conceptos_clave: [workflow_dispatch, workflow_call]   # opcional (Feynman)
preguntas_elaboracion:        # opcional
  - ¿Por qué ...?
---
```

El cuerpo es Markdown estándar: código con lenguaje, checklists `- [ ]`, tablas y enlaces de Obsidian (`[[nota]]`, `[[nota|texto]]`, `![[imagen.png]]`). Un enlace sin destino falla el build. Las imágenes van en `_adjuntos/`.

## Lab (`modulos/<id>/lab-<nombre>.md`)

```yaml
---
titulo: Workflow con matrix
orden: 1
duracion_min: 45
objetivo: Generar variantes de un job con strategy.matrix.
criterio_hecho:
  - Corren las 4 combinaciones.
---
```

Los pasos van en el cuerpo.

## Quiz (`modulos/<id>/<leccion>.quiz.yaml`)

```yaml
preguntas:
  - id: dispatch-inputs        # único en el archivo; no cambiarlo: el progreso depende de él
    enunciado: ¿Qué evento acepta inputs definidos manualmente?
    opciones:
      - workflow_dispatch
      - schedule
    correcta: 0                # índice desde 0
    explicacion: ...
```

Debe llamarse como su lección, seguido de `.quiz.yaml`.

## Roadmap (`cursos/<id>/roadmap.yaml`)

```yaml
fases:
  - titulo: Fundamentos
    semanas:
      - numero: 1
        titulo: Triggers y estructura
        tareas:
          - Leer las lecciones del módulo 1
    gate: Criterio para pasar de fase.
```

## Recursos (`cursos/<id>/recursos.md`)

Tabla Markdown con las columnas Recurso, Tipo, Costo y Para qué sirve. El frontmatter es opcional.

## Crear un curso

```bash
npm run new:course -- <id> --titulo "Mi curso" --area <area>
```
