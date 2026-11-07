---
titulo: Estructura y metadata
orden: 2
duracion_min: 25
tags: [action-yml, metadata]
dificultad: 1
tipo_contenido: datos
conceptos_clave:
  - Archivo action.yml
  - Inputs, outputs y runs
  - Workflow commands dentro de una action
preguntas_elaboracion:
  - ¿Por qué name, description y runs son obligatorios, mientras inputs y outputs no?
---

## Archivo de metadata

Toda action tiene `action.yml` o `action.yaml`.

| Clave | Obligatoria | Para qué |
| --- | --- | --- |
| `name` | Sí | Nombre mostrado |
| `description` | Sí | Qué hace |
| `runs` | Sí | Cómo se ejecuta |
| `inputs` | No | Parámetros |
| `outputs` | No | Resultados |
| `author` | No | Autor |
| `branding` | No | Icono y color en Marketplace |

## Estructura típica

```text
mi-action/
├── action.yml
├── README.md
├── LICENSE
├── src/
└── dist/index.js      # JavaScript empaquetado, committeado
```

## Inputs dentro de una action

En composite, un input se lee con `inputs.nombre`. En JavaScript o Docker, también llega como variable de entorno `INPUT_NOMBRE`, en mayúsculas.

## Workflow commands

Las actions usan los mismos comandos y archivos de entorno que un workflow: `::error::`, `::notice::`, `::add-mask::`, `GITHUB_OUTPUT`. Ver [[estructura-del-workflow]].

## Para memorizar

| Dato | Valor |
| --- | --- |
| Nombres válidos | `action.yml` o `action.yaml` |
| Claves obligatorias | `name`, `description`, `runs` |
